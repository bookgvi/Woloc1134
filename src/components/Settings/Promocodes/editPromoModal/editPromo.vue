<template lang="pug">
  form.promo.q-pa-md(@submit.prevent="savePromo")
    .row.q-pb-sm
      .col
        .text-h5 Промокод № {{ row.id }}
      .col-auto
        q-icon.cursor-pointer(name="close" v-close-popup style="font-size: 1.5rem;")
    .row.q-pb-sm
      .col
        span(style="color: red;") *&nbsp;
        span Название промокода
    .row.q-pb-md
      .col
        q-input(
          v-model="form.alias"
          outlined
          dense
          :error="$v.form.alias.$error"
        )
        // .error(v-if="!$v.form.alias.required" style="color: red;") * Поле обязательно для заполнения
    .row.q-pb-sm
      .col.q-pr-sm
        span Локация
      .col
        span(style="color: red;") *&nbsp;
        span Зал
    .row.q-pb-md
      .col.q-pr-sm
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

    .row.q-pb-sm
      .col.q-pr-sm
        span(style="color: red;") *&nbsp;
        span Скидка
      .col
        span(style="color: red;") *&nbsp;
        span Тип
    .row.q-pb-md
      .col.q-pr-sm
        q-input(
          v-model="form.discount"
          outlined
          dense
          :error="$v.form.discount.$error"
        )
      .col
         q-select(
           v-model="discountType"
           :options="allDiscountTypes"
           outlined
           dense
           :error="$v.form.type.$error"
         )
    .row.q-pb-sm
      .col.q-pr-sm
        span(style="color: red;") *&nbsp;
        span Минимальная сумма заказа, ₽.
      .col
        span Статус
    .row.q-pb-md
      .col.q-pr-sm
        q-input(
          v-model="form.minPrice"
          outlined
          dense
          :error="$v.form.minPrice.$error"
        )
      .col
        q-select(
          v-model="currentStatus"
          :options="form.statusArr"
          outlined
          dense
          :error="$v.form.isPublic.$error"
        )
    .row
      .col.q-pr-sm
        span(style="color: red;") *&nbsp;
        span Период действия
      .col
        span(style="color: red;") *&nbsp;
        span Период действия
    .row.q-pb-xl
      .col-6.q-pr-sm
        VueCtkDateTimePicker.q-pt-sm(
          id="datePicker1"
          v-model="form.dateRange1"
          color="#81AEB6"
          formatted="D MMMM Y"
          range
          no-shortcuts
          no-label
          :label="form.dateLabel1"
          class="datePickerCustomization"
          :error="$v.form.dateRange1.start.$error"
        )
      .col-6.q-pl-xs
        VueCtkDateTimePicker.q-pt-sm(
          id="datePicker2"
          v-model="form.dateRange2"
          color="#81AEB6"
          formatted="D MMMM Y"
          range
          no-shortcuts
          no-label
          :label="form.dateLabel2"
          class="datePickerCustomization"
          :error="$v.form.dateRange2.start.$error"
        )
    .row.q-py-md
      .col-6.q-pl-sm
        span Заполните только дату начала, если срок действия должен быть неограничен.
    .row.justify-center
      .col.q-mr-sm
        q-btn.q-py-sm(label="Удалить" @click="$emit('promoDelete', row.id)" no-caps flat style="width: 100%; border: 1px solid silver;")
      .col
        q-btn.q-py-sm.bg-primary.text-white(label="Сохранить" type="submit" no-caps flat style="width: 100%")
</template>

<script>
import { date } from 'quasar'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
import { required } from 'vuelidate/lib/validators'

export default {
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
    allStudiosProps: Array,
    singleStudio: Object
  },
  components: {
    VueCtkDateTimePicker,
    date
  },
  data () {
    return {
      form: {
        alias: '', // Promocode name
        locationSelected: '',
        locationsAll: [],
        roomSelected: [],
        roomsAll: [],
        discount: '',
        type: '', // Тип скидки
        typeAll: { 'rub': 'В рублях', 'percent': 'В процентах' },
        minPrice: '',
        isPublic: 0,
        statusArr: ['Персональный', 'Публичный'],
        lang: 'ru',
        dateLabel1: '',
        dateRange1: '',
        dateLabel2: '',
        dateRange2: ''
      }
    }
  },
  validations: {
    form: {
      alias: { required },
      locationSelected: { required },
      roomSelected: { required },
      discount: { required },
      type: { required },
      minPrice: { required },
      isPublic: { required },
      dateRange1: {
        start: { required }
      },
      dateRange2: {
        start: { required }
      }
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
        this.allRooms = selectedStudio.rooms
        if (val !== this.singleStudio.name || !this.row.id) this.selectedRoom = []
        else this.selectedRoom = this.row.rooms.map(item => item.name)
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
    allDiscountTypes: {
      get () {
        return Object.keys(this.form.typeAll).map(item => this.form.typeAll[item])
      }
    },
    discountType: {
      get () {
        return this.form.typeAll[this.form.type]
      },
      set (val) {
        this.form.type = Object.keys(this.form.typeAll).filter(item => this.form.typeAll[item] === val)[0]
      }
    },
    currentStatus: {
      get () {
        return this.form.statusArr[this.form.isPublic]
      },
      set (val) {
        this.form.isPublic = this.form.statusArr.indexOf(val)
      }
    }
  },
  mounted () {
    this.setStartedValues()
  },
  methods: {
    async setStartedValues () {
      this.form.alias = this.row.alias
      this.form.locationsAll = this.allStudiosProps
      this.form.locationSelected = this.singleStudio.name
      const selectedStudio = this.form.locationsAll.filter(item => item.name === this.form.locationSelected).pop()
      this.form.roomsAll = selectedStudio.rooms
      if (this.row.rooms) {
        this.form.roomSelected = this.row.rooms.map(item => item.name)
      }
      this.form.discount = this.row.discount
      this.form.type = this.row.type
      this.form.minPrice = this.row.minPrice
      this.form.isPublic = this.row.isPublic
      this.form.dateRange1 = {
        'start': date.formatDate(this.row.startedAt, 'YYYY-MM-DD'),
        'end': date.formatDate(this.row.expiredAt, 'YYYY-MM-DD')
      }
      this.form.dateRange2 = {
        'start': date.formatDate(this.row.dateFrom, 'YYYY-MM-DD'),
        'end': date.formatDate(this.row.dateTo, 'YYYY-MM-DD')
      }
    },
    async savePromo () {
      this.$v.form.$touch()
      const selectedLocation = this.form.locationsAll.filter(item => item.name === this.form.locationSelected).pop()
      const roomsOfSelectedLocation = selectedLocation.rooms
      let selectedRooms = []
      this.selectedRoom.forEach(item => {
        selectedRooms.push(roomsOfSelectedLocation.filter(item2 => item2.name === item).pop())
      })
      if (this.$v.form.$invalid) return
      this.$emit('createUpdate', this.row.id, {
        alias: this.form.alias,
        rooms: selectedRooms,
        discount: this.form.discount,
        minPrice: this.form.minPrice,
        isPublic: this.form.isPublic,
        type: this.form.type,
        startedAt: this.form.dateRange1['start'] ? this.form.dateRange1['start'].split(' ')[0] : this.form.dateRange1['start'],
        expiredAt: this.form.dateRange1['end'] ? this.form.dateRange1['end'].split(' ')[0] : this.form.dateRange1['end'],
        dateFrom: this.form.dateRange2['start'] ? this.form.dateRange2['start'].split(' ')[0] : this.form.dateRange2['start'],
        dateTo: this.form.dateRange2['end'] ? this.form.dateRange2['end'].split(' ')[0] : this.form.dateRange2['end']
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
    width: 260px;
    z-index: 9999;
  }
  .datePickerCustomization div input {
    width: 100%;
    color: #424242 !important;
    border-radius: 0px !important;
  }
</style>
