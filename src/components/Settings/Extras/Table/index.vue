<template lang="pug">
  .table.wrapper.wrapper--header(:key="keyNumber")
    DataTable(
      title="Дополнительные услуги"
      :loadData="$app.extras.getAll"
      :filter="$app.filters.getValues('settings')"
      :columns="columns"
      @toggleDialogRow="toggleDialogRow"
    )
      template(#table-controls-append)
        q-btn.q-ml-md.text-white.bg-primary(label="Добавить услугу" no-caps @click="createExtra")

      // template(#row-controls="props")
        q-btn(flat round icon="drag_handle" no-caps title="Редактировать")
    q-dialog(v-model="isModal")
      q-card(style="width: 600px;")
        q-card-section
          editExtras(
            :row="row"
            :singleStudio="singleStudio"
            :allStudiosProps="allStudios"
            @hasModal="hasModal"
            @createUpdate="createUpdate"
            @extraDelete="extraDelete"
          )
</template>

<script>
import columns from './columns'
import DataTable from 'components/DataTable'
import editExtras from '../editExtrasModal/editExtras'
export default {
  name: 'extrasTable',
  components: { DataTable, editExtras },
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
        const status = await this.$app.extras.addNew(value)
        if (status.errors) return
      } else {
        const status = await this.$app.extras.updateOne({ id, data: value })
        if (status.errors) return
      }
      this.isModal = false
      this.keyNumber++
    },
    async extraDelete (id) {
      const status = await this.$app.extras.deleteOne(id)
      if (status.errors) return
      this.isModal = false
      this.keyNumber++
    },
    createExtra () {
      this.row = {}
      this.isModal = true
    }
  }
}
</script>
