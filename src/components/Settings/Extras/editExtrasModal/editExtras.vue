<template lang="pug">
  form.editExtras(:key="pageReload" @submit.prevent="saveExtra")
    .row.justify-center
      .col
        .text-h6 Дополнительная услуга
      q-space
      .col-1
        q-icon.cursor-pointer(name="close" v-close-popup style="font-size: 1.5rem;")
    .row
      span Название&nbsp;
        span.text-red *
    .row.q-pb-md
      .col
        q-input(
          v-model="form.title"
          outlined
          dense
          :error="$v.form.title.$error"
        )
    .row
      .col.q-pr-md
        span Локация&nbsp;
        span.text-red *
      .col
        span Зал&nbsp;
        span.text-red *
    .row.q-pb-md
      .col.q-pr-md
        q-select.elipsis(
          v-model="selectedStudio"
          :options="form.locationsAll.map(item => item.name)"
          outlined
          dense
          :error="$v.form.locationSelected.$error"
        )
      .col
        q-select.elipsis(
          v-model="selectedRoom"
          :options="allRooms.map(item => item.name)"
          multiple
          outlined
          dense
          :error="$v.form.roomSelected.$error"
        )
    .row
      span Описание
    .row.q-pb-md
      .col
        textarea.text-grey-8.q-pa-sm(
          v-model="form.description"
          rows="4"
          style="width: 100%;"
        )
    .row
      span Цена, ₽&nbsp;
        span.text-red *
    .row.q-pb-md
      q-input(
        v-model.number="form.amount"
        outlined
        dense
        :error="$v.form.amount.$error"
      )
    .row
      q-checkbox(v-model="hasLimit" label="Включить ограничение по колличеству доп. услуг")
    .col(v-if="hasLimit")
      .row
        span Лимит
      .row
        q-input(v-model="form.maxLimit" outlined dense)
    .row.q-pt-md
      images(:imgData="row" :page="page" @reloadPage="pageReload++")
    .row.justify-center
      .col.q-mr-sm
        q-btn.q-py-sm(label="Удалить" @click="$emit('extraDelete', row.id)" no-caps flat style="width: 100%; border: 1px solid silver;")
      .col
        q-btn.q-py-sm.bg-primary.text-white(label="Сохранить" type="submit" no-caps flat style="width: 100%")
</template>

<script>
import FiltersList from '../../../Filters/FiltersList'
import RoomsFilter from '../../../Filters/RoomsFilter'
import Images from '../../Images/index'
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'modalForExtras',
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
    allStudiosProps: Array,
    singleStudio: Object
  },
  components: {
    Images,
    FiltersList,
    RoomsFilter
  },
  data () {
    return {
      page: 'extras',
      pageReload: 0,
      form: {
        title: '',
        locationSelected: '',
        locationIdSelected: '',
        locationsAll: [],
        roomSelected: [],
        roomIdSelected: [],
        roomsAll: [],
        description: '',
        amount: '',
        isLimit: false,
        maxLimit: ''
      }
    }
  },
  validations: {
    form: {
      title: { required },
      locationSelected: { required },
      roomSelected: { required },
      amount: { required },
    }
  },
  computed: {
    selectedStudio: {
      get () {
        return this.form.locationSelected
      },
      set (val) {
        this.form.locationSelected = val
        const selectedStudio = this.form.locationsAll.filter(item => item.name === val).pop()
        this.form.locationIdSelected = selectedStudio.id
        this.allRooms = selectedStudio.rooms
        if (val !== this.singleStudio.name || !this.row.id) {
          this.selectedRoom = []
        } else {
          this.selectedRoom = this.row.rooms.map(item => item.name)
        }
      }
    },
    allRooms: {
      get () {
        return this.form.roomsAll
      },
      set (val) {
        this.form.roomsAll = val
      }
    },
    selectedRoom: {
      get () {
        return this.form.roomSelected
      },
      set (val) {
        this.form.roomSelected = val
      }
    },
    hasLimit: {
      get () {
        return this.form.isLimit
      },
      set (val) {
        this.form.isLimit = val
        if (!val || !this.row.id) {
          this.form.maxLimit = 0
        }
      }
    }
  },
  mounted () {
    this.setStartedValues()
  },
  methods: {
    async setStartedValues () {
      this.form.title = this.row.title
      this.form.locationsAll = this.allStudiosProps
      this.form.locationSelected = this.singleStudio.name
      const selectedStudio = this.form.locationsAll.filter(item => item.name === this.form.locationSelected).pop()
      this.form.locationIdSelected = selectedStudio.id
      this.form.roomsAll = selectedStudio.rooms
      if (this.row.rooms) {
        this.form.roomSelected = this.row.rooms.map(item => item.name)
        this.form.roomIdSelected = this.row.rooms
      }
      this.form.description = this.row.description
      this.form.amount = this.row.amount
      this.form.maxLimit = this.row.maxLimit
      this.form.isLimit = this.row.maxLimit > 0
    },
    async saveExtra () {
      this.$v.form.$touch(this.form.locationsAll)
      if (this.$v.form.$invalid) return
      this.form.roomIdSelected = []
      this.form.roomSelected.forEach(item => {
        this.form.roomIdSelected.push(this.form.roomsAll.filter(item2 => item2.name === item).pop())
      })
      this.$emit('createUpdate', this.row.id, {
        title: this.form.title,
        amount: this.form.amount,
        studio: this.form.locationIdSelected,
        rooms: this.form.roomIdSelected,
        description: this.form.description,
        maxLimit: this.form.maxLimit
      })
    }
  }
}
</script>

<style>
  .q-field__native.row.items-center {
    align-content: center;
  }
  .elipsis span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .datePickerCustomization {
    position: fixed;
    width: 280px;
    z-index: 9999;
  }
  .datePickerCustomization div input {
    width: 100%;
    color: #424242 !important;
    border-radius: 0px !important;
  }
</style>
