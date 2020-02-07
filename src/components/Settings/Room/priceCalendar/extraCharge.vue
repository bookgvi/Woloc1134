<template lang="pug">
  .extraCharge
    .row
      .col(v-for="(item, index) in columns" :key="index")
        p(style="text-align: center;") {{ item.label }}
    .row
      .col
        p.q-py-sm(style="text-align: center; border: 1px solid silver; height: 2.5rem;") на час
      .col.q-pl-sm(v-for="(item2, index2) in payment")
        input.q-pa-sm(:value="payment[index2].value" @input="inputPrice($event, payment[index2])" style="width: 100%; height: 2.5rem;")

</template>

<script>
export default {
  name: 'extraCharge',
  props: {
    payment: {
      type: Array,
      default: _ => {
      }
    }
  },
  data () {
    return {
      columns: [
        {
          name: 'charge',
          field: 'charge',
          label: 'Наценка',
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

</style>
