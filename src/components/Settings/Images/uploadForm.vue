<template lang="pug">
  .uploadFile.q-pa-lg
    .text-h5.q-pb-md Выберите изображение
    form(@submit.prevent="submit" class="form")
      .row.q-pb-md
        .col
          q-input(
            type="file"
            @change="onAttachmentChange"
          )
      .row
        .col.q-pr-md
          q-btn.bg-primary.text-white(type="submit" label="Отправить" style="width: 100%")
        .col
          q-btn(label="Закрыть" @click="$emit('closeUploadDialogWithoutReload')" no-caps style="width: 100%")
</template>

<script>
export default {
  props: {
    imgData: Object,
    page: String
  },
  data () {
    return {
      submitting: false,
      name: null,
      attachment: null
    }
  },
  methods: {
    async submit () {
      this.submitting = true
      const config = { 'content-type': 'multipart/form-data' }
      const formData = new FormData()
      const len = this.page.length
      const page = this.page[len - 1] === 's' ? this.page.slice(0, len - 1) : this.page
      formData.append('sort', this.imgData.images.length)
      formData.append(page, this.imgData.id)
      formData.append('image', this.attachment)

      this.$app[this.page].uploadImage(formData, config).then(({ data }) => {
        if (!data) return
        this.submitting = false
        if (this.page === 'extras' && this.imgData.images.length) {
          this.imgData.images.splice(0, 1, data)
        } else {
          this.imgData.images.push(data)
        }
        this.$emit('closeUploadDialog')
      })
    },
    onAttachmentChange (e) {
      this.attachment = e.target.files[0]
    }
  }
}
</script>

<style scoped>
  .form__inputFile {
    width: 100%;
    height: 2.5em;
  }
</style>
