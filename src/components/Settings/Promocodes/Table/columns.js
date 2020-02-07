import { date } from 'quasar'

export default [
  {
    name: 'alias',
    label: 'промокод',
    active: true,
  },
  {
    name: 'discount',
    label: 'скидка',
    align: 'right',
    headerStyle: 'text-align: right;',
    width: 100,
    active: true,
  },
  {
    name: 'rooms',
    label: 'Зал',
    headerStyle: 'text-align: center;',
    active: true,
  },
  {
    name: 'minPrice',
    label: 'Мин. заказ, ₽.',
    align: 'right',
    headerStyle: 'text-align: right;',
    width: 100,
    active: true,
  },
  {
    name: 'isPublic',
    label: 'статус',
    field: ({ isPublic }) => ['Персональный', 'Публичный'].filter((item, index) => index === Number(isPublic)).pop(),
    active: true,
  },
  {
    name: 'startedAt',
    label: 'Дата создания',
    format: value => date.formatDate(value, 'D MMMM YYYY в h:mm'),
    active: true,
  },
  {
    name: 'expiredAt',
    label: 'Активен до',
    format: value => date.formatDate(value, 'D MMMM'),
    active: true,
  },
]
