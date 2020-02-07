<template lang="pug">
  .table.wrapper.wrapper--header(:key="keyNumber")
    DataTable(
      title="Промокоды"
      :loadData="$app.promocodes.getAll"
      :filter="$app.filters.getValues('settings')"
      :columns="columns"
      @toggleDialogRow="toggleDialogRow"
    )
      template(#table-controls-append)
        q-btn.q-ml-md.text-white.bg-primary(label="Добавить промокод" @click="createPromo" no-caps)
    q-dialog(v-model="isModal" persistent)
      q-card(style="width: 600px;")
        edit-promocode(
          :row="row"
          :singleStudio="singleStudio"
          :allStudiosProps="allStudios"
          @hasModal="hasModal"
          @createUpdate="createUpdate"
          @promoDelete="promoDelete"
        )

</template>

<script>
import columns from './columns'
import DataTable from 'components/DataTable'
import editPromocode from '../editPromoModal/editPromo'
export default {
  name: 'promoTable',
  components: { DataTable, editPromocode },
  data () {
    return {
      columns,
      keyNumber: 0,
      dataset: {},
      isModal: false,
      row: {},
      allStudios: [],
      singleStudio: {}
    }
  },
  watch: {
    'changeFilter' () {
      this.filter()
    }
  },
  computed: {
    changeFilter () {
      return this.$app.filters.getValues('settings')
    }
  },
  async mounted () {
    this.filter()
  },
  methods: {
    async filter () {
      let { studio } = await this.$app.filters.getValues('settings')
      if (!studio) return
      const { items } = await this.$app.studios.getAll()
      this.singleStudio = await this.$app.studios.getOne(studio)
      this.allStudios = items
    },
    async toggleDialogRow (row) {
      this.row = row
      this.isModal = true
    },
    async hasModal () {
      await this.$nextTick()
      this.isModal = false
    },
    async createUpdate (id, value) {
      if (!id) {
        const status = await this.$app.promocodes.addNew(value)
        if (status.errors) return
      } else {
        const status = await this.$app.promocodes.updateOne({ id, data: value })
        if (status.errors) return
      }
      this.isModal = false
      this.keyNumber++
    },
    async promoDelete (id) {
      const status = await this.$app.promocodes.deleteOne(id)
      if (status.errors) return
      this.isModal = false
      this.keyNumber++
    },
    createPromo () {
      this.row = {}
      this.isModal = true
    }
  }
}
</script>

<style scoped>
</style>
