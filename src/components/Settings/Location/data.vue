<template lang="pug">
  .datas
    h6.q-mb-md Данные локации
    .row.q-pb-lg
      .col
        span Название &nbsp
        span.text-red *
        q-input.q-py-sm(
          :value="form.name"
          :error="$v.form.name.$error"
          @input.native="util.hInput($event, 'name')"
          placeholder="Название студии"
          outlined
          dense
        )
        div(v-if="$v.form.name.$invalid && $v.form.name.$dirty" class="error") * - Поле обязательно для заполнения
    .row.q-pb-lg
      .col.q-pr-sm
        span Телефон &nbsp
        span.text-red *
        q-input.q-py-sm(
          :value="form.phone"
          :error="$v.form.phone.$error"
          @input.native="util.hInput($event, 'phone')"
          placeholder="+7 (800) 800 0123"
          mask="+# (###) ### ####"
          unmasked-value
          type="tel"
          outlined
          dense
        )
        div(v-if="$v.form.phone.$invalid && $v.form.phone.$dirty" class="error") * - Поле обязательно для заполнения
      .col
        span Эл. почта &nbsp
        span.text-red *
        q-input.q-py-sm(
          :value="form.email"
          :error="$v.form.email.$error"
          @input.native="util.hInput($event, 'email')"
          placeholder="email@domain.com"
          type="email"
          outlined
          dense
        )
        div(v-if="$v.form.email.$invalid && $v.form.email.$dirty" class="error") * - Поле обязательно для заполнения
    .row.q-pb-sm
      q-checkbox(v-model="singleStudio.hidden" label="Скрыть локацию" dense)
    .row
      p В этом случае локация не будет публиковаться в общих списках, не будет выдаваться в каталоге, но будет доступна по прямой ссылке.
</template>

<script>
import { Util } from '../Helper/utils'
import { required } from 'vuelidate/lib/validators'

export default {
  props: {
    singleStudio: Object,
    isRequired: Number
  },
  data () {
    return {
      util: new Util(this),
      form: {
        name: '',
        phone: '',
        email: ''
      }
    }
  },
  validations: {
    form: {
      name: { required },
      phone: { required },
      email: { required }
    }
  },
  watch: {
    'isRequiredVM' (newVal) {
      this.$v.form.$touch()
    }
  },
  computed: {
    isRequiredVM () {
      return this.isRequired
    }
  },
  mounted () {
    this.form.name = this.singleStudio.name
    this.form.phone = this.singleStudio.phone
    this.form.email = this.singleStudio.email
  }
}
</script>
