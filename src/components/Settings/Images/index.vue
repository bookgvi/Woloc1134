<template lang="pug">
  .images
    .text-h6.q-mb-md Изображения
    .row.q-pb-sm
      .col
        q-btn.q-btn--no-uppercase(label="Выбрать файл" @click="showUploadFileDialog" outline dense)
        q-btn.q-pl-xs(@click="$emit('reloadPage')" dense flat)
          q-icon(name="cached" style="font-size: 1.5em;")
    .hasServerData(v-if="isServerResponse")
      .row.no-wrap.q-pb-lg(v-if="!isShow")
        draggable(v-model="imgDataVM.images" @change="changeSortField(imgDataVM.images)")
          .inline-block(v-for="index in Math.min(defaultImgCount, imgDataVM.images.length)" :key="index" title="Drag and drop")
            q-img.q-mr-sm.q-mb-sm.cursor-pointer(
              v-if="!imgDataVM.images[index - 1].isDeleted"
              :src="srcVM(imgDataVM.images[index - 1].src)"
              style="height: 140px; width: 140px"
            )
              q-btn.absolute-top-right(icon="close" class="block" dense flat color="white" title="close" @click="deleteImg(imgDataVM.images[index - 1], index- 1)")
              template(v-slot:error)
                .absolute-full.flex.flex-center.bg-grey-6.text-white Не удалось загрузить изображение
      .row.no-wrap.q-pb-lg(v-if="isShow")
        draggable(v-model="imgDataVM.images" @change="changeSortField(imgDataVM.images)")
          .inline-block(v-for="(item, index) in imgDataVM.images" :key="index" title="Drag and drop")
            q-img.q-mr-sm.q-mb-sm.cursor-pointer(
              v-if="!item.isDeleted"
              :src="srcVM(item.src)"
              style="height: 140px; width: 140px"
            )
              q-btn.absolute-top-right(icon="close" class="block" dense flat color="red" title="close" @click="deleteImg(item, index)")
              template(v-slot:error)
                .absolute-full.flex.flex-center.bg-grey-6.text-white Не удалось загрузить изображение
      .row
        .col
          .cursor-pointer(v-if="!isShow && imgDataVM.images.length > defaultImgCount" @click="isShow = !isShow" style="font-size: 18px")
            q-icon(name="keyboard_arrow_down")
            span.text-primary &nbsp; Показать еще {{ imgDataVM.images.length - defaultImgCount }} изображений
          .cursor-pointer(v-if="isShow" @click="isShow = !isShow" style="font-size: 18px")
            q-icon(name="keyboard_arrow_up")
            span.text-primary &nbsp; Скрыть изображения
    q-dialog(v-model="isModalForUploadFile")
      q-card
        uploadForm(@closeUploadDialog="closeUploadDialog" @closeUploadDialogWithoutReload="closeUploadDialogWithoutReload" :imgData="imgData" :page="page")
</template>

<script>
import draggable from 'vuedraggable'
import uploadForm from './uploadForm'

export default {
  name: 'images',
  components: { draggable, uploadForm },
  props: {
    imgData: {
      type: Object
    },
    page: String
  },
  data: () => ({
    defaultImgCount: 4,
    isShow: false,
    isModalForUploadFile: false,
    isServerResponse: false,
  }),
  watch: {
    imgDataVM (newVal) {
      if (newVal.hasOwnProperty('images') && newVal.images.length) {
        this.isServerResponse = true
        this.imgSortMethod()
      }
    }
  },
  computed: {
    imgDataVM: {
      get () {
        return this.imgData
      }
    }
  },
  mounted () {
    if (this.imgData && this.imgData.hasOwnProperty('images') && this.imgData.images.length) {
      this.isServerResponse = true
      this.imgSortMethod()
    }
  },
  methods: {
    srcVM (val) {
      // return `http://ugoloc-1052.shot.ugoloc.ucann.ru/${val}`
      return `${val}`
    },
    imgSortMethod () {
      if (this.imgDataVM && this.imgDataVM.hasOwnProperty('images')) {
        this.imgDataVM.images.sort((current, prev) => {
          if (current.sort === prev.sort) return 0
          return current.sort > prev.sort ? 1 : -1
        })
      }
    },
    async changeSortField (imgArray) {
      imgArray.forEach((item, index) => {
        item.sort = index
      })
      await this.$app[this.page].updateOne({ id: this.imgDataVM.id, data: this.imgDataVM })
    },
    closeUploadDialog () {
      this.isModalForUploadFile = false
      if (this.page === 'studios') return
      this.$emit('reloadPage')
    },
    closeUploadDialogWithoutReload () {
      this.isModalForUploadFile = false
    },
    async deleteImg (img, index) {
      img.isDeleted = true
      await this.$app[this.page].updateOne({ id: this.imgDataVM.id, data: this.imgDataVM })
      if (this.page === 'extras') {
        this.imgData.images.splice(0, 1)
      }
    },
    showUploadFileDialog () {
      if (!this.imgData.id) {
        return
      }
      this.isModalForUploadFile = true
    }
  }
}
</script>

<style scoped>
  .closeBtn {
    position: relative;
  }
</style>
