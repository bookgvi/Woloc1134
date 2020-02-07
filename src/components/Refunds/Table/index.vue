<template lang="pug">

  DataTable(
    :key="reloadTable"
    title="Возврат"
    :loadData="$app.refunds.getAll"
    :getDialogTitle="() => 'Возврат'"
    :filter="$app.filters.getValues('refunds')"
    :columns="columns"
    :isRowDisabled="({ status }) => !status"
  )
    template(#row-controls="props")
      q-btn(flat round icon="block" no-caps title="Отменить" @click="refundCancel(props)")
      q-btn(flat round icon="thumb_up" no-cpas title="Подтвердить" @click="refundConfirm(props)")

</template>

<script>
import columns from './columns'
import details from './details'
import DataTable from 'components/DataTable'
import { showNotif } from '../../../utils/helpers'

export default {
  name: 'RefundsTable',
  components: { DataTable },
  data: () => ({
    reloadTable: 0,
    columns,
    details
  }),
  methods: {
    async refundCancel (refund) {
      const result = await this.$app.refunds.cancel(refund.row.id)
      if (result.hasOwnProperty('data')) {
        showNotif(`Возврат ${refund.row.id} отменен`, 'primary')
        this.reloadTable++
      } else {
        showNotif(`Ошибка совершения операции...`, 'red')
      }
    },
    async refundConfirm (refund) {
      const result = await this.$app.refunds.confirm(refund.row.id)
      if (result.hasOwnProperty('data')) {
        showNotif(`Возврат ${refund.row.id} подтвержден`, 'primary')
        this.reloadTable++
      } else {
        showNotif(`Ошибка совершения операции...`, 'red')
      }
    }
  }
}
</script>

<style scoped>
</style>
