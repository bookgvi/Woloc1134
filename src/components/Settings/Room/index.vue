<template lang="pug">
  .room
    .menu.menu--menu2
      filters-list(name="settings")
        template(#prepend="props")
          studio-filter(v-bind="props")
        template(#append)
          q-btn.q-btn--no-uppercase(label="Добавить зал" dense color="primary" @click="createNew")
    .content--content2(:key="reloadData")
      .row.q-py-md.q-pr-sm(:key="filterChanged.studio")
        .col-3.bg-white
          room-list(
            :rooms="rooms"
            :selectedRoom="selectedRoom.id"
            @setCurrentRoom="setCurrentRoom"
          )
        .col-6
          roomData(
            :currentStudio="currentStudio"
            :roomData="currentRoomData"
            :isRequired="isRequired"
            @hInput="hInput"
          )
          Google(
            :roomData="currentRoomData"
          )
          specifications(
            :specification="currentRoomData"
            :isRequired="isRequired"
            @hInput="hInput"
          )
          payment(
            :payment="currentRoomData.payment"
          )
          images(
            :imgData="currentRoomData"
            @reloadPage="reloadData++"
            :page="page"
          )
          interior(
            :interiors="currentRoomData.interiors"
          )
          backgrounds(
            :backgrounds="currentRoomData.backgrounds"
          )
          additionalServices(
            :extras="currentRoomData.extras"
          )
          // -------------- TODO --------------------
          // services(:singleStudio="singleStudio")
          // ----------------------------------------
          .row
            q-btn.fit.bg-primary.text-white(label="Сохранить" no-caps @click="saveChanges")
      q-dialog(v-model="isLeavePageDialog" persistent)
        q-card
          q-card-section.row.items-center
            q-icon(name="report" color="primary" text-color="white" style="font-size: 2rem;")
            span.q-ml-sm Вы покидаете страницу настроек зала! <br /> Все несохраненные данные будут утеряны.
          q-card-actions(align="right")
            q-btn.primary(label="ОК" color="primary" flat no-caps v-close-popup @click="leavePage")
            q-btn.primary(label="Отмена" color="primary" flat no-caps v-close-popup @click="isLeavePageConfirm = false")
</template>

<script>
import roomData from './roomData'
import Google from './Google'
import specifications from './specifications'
import payment from './payment'
import images from '../Images/index'
import interior from './interior'
import backgrounds from './backgrounds'
import additionalServices from './additionalServices'
import services from './services'
import StudioFilter from '../../Filters/StudioFilter'
import FiltersList from '../../Filters/FiltersList'
import RoomList from './roomList'
import { room } from '../../../api/room'
import { Util } from '../Helper/utils'

const emptyRoom = new Util()
// const util = new Util()
export default {
  data () {
    return {
      page: 'room',
      createRoomAfterLocation: false,
      defaultStudio: {},
      defaultRooms: {},
      roomDataDefault: {},
      reloadData: 0,
      currentStudio: {},
      rooms: [],
      selectedRoom: {},
      currentRoomData: {},
      isRequired: 0,
      isSomethingChanged: false,
      isLeavePageDialog: false,
      routerTo: '',
      routerFrom: ''
    }
  },
  components: {
    RoomList,
    StudioFilter,
    FiltersList,
    roomData,
    Google,
    specifications,
    payment,
    images,
    interior,
    backgrounds,
    additionalServices,
    services
  },
  watch: {
    async filterChanged () {
      await this.getStudioAndRoom()
      if (this.createRoomAfterLocation) {
        this.createNew()
      }
    }
  },
  computed: {
    filterChanged () {
      return this.$app.filters.getValues('settings')
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.path === '/settings/location' && to.query.createRoom) {
      next(vm => {
        vm.createRoomAfterLocation = true
      })
    } else {
      next()
    }
  },
  beforeRouteLeave (to, from, next) {
    this.isSomethingChanged =
      this.isDefaultNotEqualCurrent(this.currentRoomData, this.roomDataDefault) ||
      this.isDefaultNotEqualCurrent(this.rooms, this.defaultRooms)
    if (this.isSomethingChanged) {
      this.isLeavePageDialog = true
      this.routerFrom = from
      this.routerTo = to
    } else {
      next()
    }
  },
  mounted () {
    window.addEventListener('keyup', e => {
      if (e.key === 'Escape' && this.createRoomAfterLocation) {
        this.getStudioAndRoom()
      }
    })
  },
  methods: {
    async getStudioAndRoom () {
      // this.currentRoomData = {}
      let filter = this.$app.filters.getValues('settings')
      if (!filter || !filter.studio) return
      this.currentStudio = await this.$app.studios.getFiltered(filter)
      if (!this.currentStudio) return
      this.rooms = this.currentStudio.rooms
      if (!this.rooms) return
      this.selectedRoom = this.rooms.length ? this.rooms[0] : {}
      if (this.selectedRoom.hasOwnProperty('id') && this.selectedRoom.id) {
        this.currentRoomData = await this.getRoomData(this.selectedRoom.id)
        this.defaultRooms = this.rooms
        this.roomDataDefault = this.saveDefaultData(this.currentRoomData)
      }
      this.reloadData++
    },
    async setCurrentRoom (room) {
      this.selectedRoom = room
      if (this.selectedRoom.hasOwnProperty('id') && this.selectedRoom.id) {
        this.currentRoomData = await this.getRoomData(this.selectedRoom.id)
      }
      this.defaultRooms = this.rooms
      this.roomDataDefault = this.saveDefaultData(this.currentRoomData)
      this.reloadData++
    },
    async getRoomData (id) {
      if (this.selectedRoom.hasOwnProperty('id') && this.selectedRoom.id) {
        const currentRoomData = await this.$app.room.getOne(id)
        return currentRoomData
      }
    },
    async getAllRooms (id) { // Получаем массив всех залов локации id
      const { items } = await this.$app.studios.getAll()
      const [{ rooms }] = items.filter(item => item.id === id)
      return rooms
    },
    async createNew () {
      const filter = this.$app.filters.getValues('settings')
      this.currentStudio = this.$app.studios.getFiltered(filter)
      const interiors = emptyRoom.clearExtras(emptyRoom.cloneObject(this.currentRoomData.interiors))
      const backgrounds = emptyRoom.clearExtras(emptyRoom.cloneObject(this.currentRoomData.backgrounds))
      const extras = emptyRoom.clearExtras(emptyRoom.cloneObject(this.currentRoomData.extras))
      const characteristics = emptyRoom.clearExtras(emptyRoom.cloneObject(this.currentRoomData.characteristics))
      const jsonData = JSON.stringify(await room.getDefaultPrices())
      const { data } = JSON.parse(jsonData)

      this.currentRoomData = {
        status: 1,
        isRoom: 1,
        needPrepayment: 1,
        color: '',
        interiors,
        backgrounds,
        extras,
        characteristics,
        payment: data.payment,
        studio: {
          id: filter.studio
        },
        images: []
      }
      this.createRoomAfterLocation = false
      this.reloadData++
    },
    hInput (value, field) {
      this.currentRoomData[field] = value
    },
    async saveChanges () {
      this.isRequired++
      /*
      * POST method
      * */
      if ((this.currentRoomData.hasOwnProperty('id') && !this.currentRoomData.id) || !this.currentRoomData.hasOwnProperty('id')) {
        const rooms = await this.$app.room.addNew(this.currentRoomData).then(this.resultPutPost)
        if (!rooms) return
        this.rooms = rooms
        const newRoom = this.rooms.filter(item => item.name === this.currentRoomData.name)[0]
        this.setCurrentRoom(newRoom) // Выбираем новосозданный зал в списке
        /*
        * PUT method
        * */
      } else {
        const rooms = await this.$app.room.updateOne({ id: this.currentRoomData.id, data: this.currentRoomData }).then(this.resultPutPost)
        if (!rooms) return
      }
      this.defaultRooms = this.rooms
      this.roomDataDefault = this.saveDefaultData(this.currentRoomData)
      this.reloadData++
    },
    /*
    *
    * then-функция обработки ответа от сервера POST/PUT
    * */
    resultPutPost ({ data, errors }) {
      if (!errors) {
        return this.getAllRooms(this.currentRoomData.studio.id) // Обновляем список залов для блока слева
      } else {
        window.scrollTo(0, 0)
        return null
      }
    },
    leavePage () {
      this.isSomethingChanged = false
      this.defaultRooms = this.rooms
      this.roomDataDefault = this.saveDefaultData(this.currentRoomData)
      this.$router.replace(this.routerTo.fullPath)
    },
    saveDefaultData (obj) {
      let tmpObj = JSON.stringify(Object.assign({}, obj))
      return JSON.parse(tmpObj)
    },
    isDefaultNotEqualCurrent (obj, defaultObj) {
      for (let key in obj) {
        if (Array.isArray(obj[key]) && key !== 'images') {
          for (let index = 0, arrLength = obj[key].length; index < arrLength; index++) {
            if (this.isDefaultNotEqualCurrent(obj[key][index], defaultObj[key][index])) {
              return true
            }
          }
        } else if (typeof obj[key] === 'object' && key !== 'images') {
          if (this.isDefaultNotEqualCurrent(obj[key], defaultObj[key])) {
            return true
          }
        } else if (key !== 'images') {
          if (String(obj[key]) !== String(defaultObj[key])) {
            return true
          }
        }
      }
      return false
    }
  }
}
</script>

<style>
  .error {
    color: red;
  }
</style>
