<template lang="pug">
  .location
    .menu.menu--menu2
      filters-list(name="settings")
        template(#prepend="props")
          studio-filter(v-bind="props")
        template(#append)
          q-btn.q-btn--no-uppercase(label="Добавить локацию" dense color="primary" @click="newStudio")
    .content
      .row.justify-center.q-pb-md
        .col-6
          dataBlock(
            :key="pageReload"
            :singleStudio="singleStudio"
            :isRequired="isRequired"
            @hInput="hInput"
          )
          specifications(
            :key="pageReload + 1"
            :singleStudio="singleStudio"
            :isRequired="isRequired"
            @hInput="hInput"
          )
          images(
            :key="pageReload + 2"
            :imgData="singleStudio"
            :page="page"
            @reloadPage="pageReload++"
          )
          addressBlock(
            :singleStudio="singleStudio"
            :isRequired="isRequired"
            @hInput="hInput"
          )
          services(:singleStudio="singleStudio")
          equipment(:singleStudio="singleStudio")
          rooms(:rooms="rooms")
          .row.col-12.justify-center.q-pt-md
            .col-6.q-pr-sm
              q-btn.fit.bg-primary.text-white(
                label="Сохранить"
                no-caps
                @click="updateStudio"
              )
            .col-6.q-pl-sm
              q-btn.fit(
                label="Сохранить и создать зал"
                no-caps
                @click="createNewStudio"
              )
</template>

<script>
import dataBlock from './data'
import specifications from './specifications'
import images from '../Images/index'
import addressBlock from './address'
import services from './services'
import equipment from './equipment'
import rooms from './rooms'
import StudioFilter from '../../Filters/StudioFilter'
import FiltersList from '../../Filters/FiltersList'

export default {
  name: 'setting',
  components: {
    dataBlock,
    specifications,
    images,
    addressBlock,
    services,
    equipment,
    rooms,
    StudioFilter,
    FiltersList
  },
  data () {
    return {
      page: 'studios',
      pageReload: 0,
      id: this.$app.filters.getValues('settings').studio,
      currentTab: 'Локация',
      tabs: ['Локация'],
      singleStudio: {},
      currentStudio: '',
      rooms: [],
      requiredFields: ['name', 'phone', 'limit', 'email', 'height', 'yardage', 'address'],
      isRequired: 0
    }
  },
  watch: {
    async filterChanged () {
      await this.singleStudioM()
    }
  },
  computed: {
    filterChanged () {
      return this.$app.filters.getValues('settings')
    }
  },
  mounted () {
    this.singleStudioM()
  },
  methods: {
    /*
    *
    * Метод получения данных локации, установленной в фильтре
    * */
    async singleStudioM () {
      let filter = this.$app.filters.getValues('settings')
      if (!filter || !filter.studio) return
      this.currentStudio = await this.$app.studios.getFiltered(filter)
      if (!this.currentStudio) return
      this.rooms = this.currentStudio.rooms
      if (!this.rooms) return
      this.singleStudio = await this.$app.studios.getOne(filter.studio)
      this.pageReload++
    },
    /*
    *
    * Метод для подготовки payload-объекта для создания локации
    * */
    async newStudio () {
      this.rooms = []
      const { services, facilities } = await this.$app.studios.getServicesFacilities()
      this.singleStudio = {
        lat: 55.751490781095335,
        lon: 37.618877799781785,
        services,
        facilities,
        images: []
      }
      this.pageReload++
    },
    hInput (value, field) {
      this.singleStudio[field] = value
    },
    /*
    *
    * Обработка кнопки Сохранить
    */
    async updateStudio () {
      this.isRequired++
      if (this.singleStudio.phone) {
        this.singleStudio.phone = String(this.singleStudio.phone).match(/\d/g).join('')
      }
      let newStudioId = ''
      /*
      * Метод POST
      * */
      if ((this.singleStudio.hasOwnProperty('id') && !this.singleStudio.id) || !this.singleStudio.hasOwnProperty('id')) {
        newStudioId = await this.$app.studios.addNew(this.singleStudio).then(({ data }) => {
          if (data) return data.id
        })
      /*
      * Метод PUT
      * */
      } else {
        let { studio } = this.$app.filters.getValues('settings')
        if (!studio) {
          studio = this.currentStudio
        }
        newStudioId = await this.$app.studios.updateOne({ id: studio, data: this.singleStudio }).then(_ => null)
      }
      if (newStudioId) {
        this.$app.filters.setValue('settings', 'studio', newStudioId)
        this.singleStudioM()
        this.pageReload++
      } else {
        window.scrollTo(0, 0) // При ошибках скролл к началу страницы
      }
    },
    /*
    *
    * Обработка кнопки Сохранить и создать зал
    * */
    async createNewStudio () {
      this.isRequired++
      if (this.singleStudio.phone) {
        this.singleStudio.phone = String(this.singleStudio.phone).match(/\d/g).join('')
      }
      /*
      * Метод POST
      * */
      if ((this.singleStudio.hasOwnProperty('id') && !this.singleStudio.id) || !this.singleStudio.hasOwnProperty('id')) {
        this.$app.studios.addNew(this.singleStudio).then(this.resultPutPostPushToRoom)
      /*
      * Метод PUT
      * */
      } else {
        let { studio } = this.$app.filters.getValues('settings')
        if (!studio) {
          studio = this.currentStudio
        }
        this.$app.studios.updateOne({ id: studio, data: this.singleStudio }).then(this.resultPutPostPushToRoom)
      }
    },
    /*
    *
    * then-функция для обработки кнопки Сохранить и создать зал
     */
    async resultPutPostPushToRoom ({ data, errors }) {
      if (data) {
        await this.$app.filters.setValue('settings', 'studio', data.id)
        this.$router.push({ path: '/settings/room', query: { createRoom: true } })
      } else {
        window.scrollTo(0, 0) // При ошибках скролл к началу страницы
      }
    }
  }
}
</script>

<style>
  .error {
    color: red;
  }
</style>
