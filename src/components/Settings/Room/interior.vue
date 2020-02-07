<template lang="pug">
  .interior
    .row.q-py-lg
      .col
        .text-h6 Предметы интерьера
    abstract-list(:dataArray="interiors")
</template>

<script>
import AbstractList from './AbstractDataList/abstractList'
export default {
  name: 'specifications',
  components: { AbstractList },
  props: {
    interiors: {
      type: Array,
      default: _ => []
    }
  }
}
</script>
