<template lang="pug">
  .extras
    .menu.menu--menu2
      filters-list(name="settings")
        template(#prepend="props")
          studio-filter(v-bind="props")
    .content--content2.wrapper--header
      .row
        promoTable
</template>

<script>
import StudioFilter from '../../Filters/StudioFilter'
import FiltersList from '../../Filters/FiltersList'
import promoTable from './Table'
export default {
  name: 'promocodes',
  components: {
    StudioFilter,
    FiltersList,
    promoTable
  }
}
</script>
