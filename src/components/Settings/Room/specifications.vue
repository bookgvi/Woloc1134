<template lang="pug">
  .specifications
    .row.q-pb-lg
      .col
        .text-h6 Характеристики
    .row.q-pb-lg
      .col
        span Описание зала
          textarea.q-pa-sm.text-grey-8(
            v-model="specification.description"
            type="textarea"
            rows=5
            style="width: 100%;"
          )
    .row.q-pb-lg
      .col.q-pr-sm
        span Высота потолков, м&nbsp;
        span.text-red *
        q-input.q-pb-xs(
          :value="form.height"
          :error="$v.form.height.$error"
          @input.native="util.hInput($event, 'height')"
          outlined
          dense
        )
        div(v-if="$v.form.height.$invalid && $v.form.height.$dirty" class="error") * - Поле обязательно для заполнения
      .col
        span(style="line-height: 0;") Площадь, м
          sup 2
        span &nbsp;
        span.text-red *
        q-input.q-pb-xs(
          :value="form.yardage"
          :error="$v.form.yardage.$error"
          @input.native="util.hInput($event, 'yardage')"
          outlined
          dense
        )
        div(v-if="$v.form.yardage.$invalid && $v.form.yardage.$dirty" class="error") * - Поле обязательно для заполнения
    abstract-list(:dataArray="specification.characteristics")

</template>

<script>
import AbstractList from './AbstractDataList/abstractList'
import { required } from 'vuelidate/lib/validators'
import { Util } from '../Helper/utils'

export default {
  name: 'specifications',
  components: { AbstractList },
  props: {
    specification: {
      type: Object
    },
    isRequired: Number
  },
  data () {
    return {
      util: new Util(this),
      form: {
        height: '',
        yardage: ''
      }
    }
  },
  watch: {
    'isRequiredVM' (newVal) {
      this.$v.form.$touch()
    }
  },
  validations: {
    form: {
      height: { required },
      yardage: { required }
    }
  },
  computed: {
    isRequiredVM () {
      return this.isRequired
    }
  },
  created () {
    this.form.height = this.specification.height
    this.form.yardage = this.specification.yardage
  }
}
</script>
