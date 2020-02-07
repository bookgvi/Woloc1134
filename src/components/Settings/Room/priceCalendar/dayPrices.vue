<template lang="pug">
  .dayPrices
    .row
      .col(v-for="(item, index) in columns" :key="index")
        p(style="text-align: center;") {{ item.label }}
    .row(v-for="(item2, index2) in payment")
      .col
        p.q-px-xs.q-pt-sm(style="text-align: center; border: 1px solid silver; height: 2.5rem;") {{ item2.time }}
      .col.q-pl-sm(v-for="item3 in item2.days")
        input.q-pa-sm(:value="item3.value" @input="inputPrice($event, item3)" style="width: 100%; height: 2.5rem;")
</template>

<script>
export default {
  name: 'extraCharge',
  props: {
    payment: Array
  },
  data () {
    return {
      columns: [
        {
          name: 'time',
          field: 'time',
          label: 'Время',
          style: 'width: 10px'
        },
        {
          name: 'mon',
          field: 'mon',
          label: 'ПН'
        },
        {
          name: 'tue',
          field: 'tue',
          label: 'ВТ'
        },
        {
          name: 'wed',
          field: 'wed',
          label: 'СР'
        },
        {
          name: 'thu',
          field: 'thu',
          label: 'ЧТ'
        },
        {
          name: 'fri',
          field: 'fri',
          label: 'ПТ'
        },
        {
          name: 'sat',
          field: 'sat',
          label: 'СБ'
        },
        {
          name: 'sun',
          field: 'sun',
          label: 'ВС'
        }
      ]
    }
  },
  methods: {
    inputPrice (e, val) {
      val.value = e.target.value.match(/\d*/)[0]
      e.target.value = val.value
    }
  }
}
</script>

<style scoped>
  .q-field--disabled .q-field__inner {
    cursor: pointer !important;
  }
</style>
