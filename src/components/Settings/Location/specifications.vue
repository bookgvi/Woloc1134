<template lang="pug">
  .specifications
    h6.q-mb-md Характеристики
    .row.q-pb-lg
      .col
        span Описание локации
        textarea.q-pa-sm.text-grey-8(v-model="singleStudio.description" rows=5 style="width: 100%;")
    .row.q-pb-sm
      .col-4.q-pr-sm.q-pt-xs
        span Лимит, недели &nbsp
        span.text-red *
        q-input.q-pb-sm(
          :value="form.limit"
          :error="$v.form.limit.$error"
          @input.native="util.hInput($event, 'limit')"
          mask="#####"
          unmasked-value
          outlined
          dense
        )
        div(v-if="$v.form.limit.$invalid && $v.form.limit.$dirty" class="error") * - Поле обязательно для заполнения
      .col-4.q-pr-sm.q-pt-xs
        span Высота потолков, м &nbsp
        span.text-red *
        q-input.q-pb-sm(
          :value="form.height"
          :error="$v.form.height.$error"
          @input.native="util.hInput($event, 'height')"
          mask="#####"
          unmasked-value
          outlined
          dense
        )
        div(v-if="$v.form.height.$invalid && $v.form.height.$dirty" class="error") * - Поле обязательно для заполнения
      .col-4
        span(style="line-height: 0;") Площадь,
        span.text-red * &nbsp
        span м
          sup 2
        q-input.q-pb-sm(
          :value="form.yardage"
          :error="$v.form.yardage.$error"
          @input.native="util.hInput($event, 'yardage')"
          mask="#####"
          unmasked-value
          outlined
          dense
        )
        div(v-if="$v.form.yardage.$invalid && $v.form.yardage.$dirty" class="error") * - Поле обязательно для заполнения
    .row.q-pb-lg
      p Насколько недель вперед возможна бронь.
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
        limit: '',
        height: '',
        yardage: ''
      }
    }
  },
  validations: {
    form: {
      limit: { required },
      height: { required },
      yardage: { required }
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
    this.form.limit = this.singleStudio.limit
    this.form.height = this.singleStudio.height
    this.form.yardage = this.singleStudio.yardage
  }
}
</script>

<style scoped>

</style>
