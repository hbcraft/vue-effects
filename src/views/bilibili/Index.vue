<template>
  <div class="banner-box">
    <Bilibanner v-if="imgLoaded" :layerConfig="layerConfig" />
  </div>
</template>

<script lang='ts'>
import BannerDatas from '@/data/banner'
import { LayerConfig } from '@/data/banner.d.ts'
import { Component, Vue } from 'vue-property-decorator'
declare module '@/data/banner' {
  interface BannerImageData {
    img: HTMLImageElement;
  }
}
@Component({
  name: 'Bilibili',
  components: {
    Bilibanner: () => import('./Bilibanner.vue')
  }
})
export default class Bilibili extends Vue {
  imgLoaded = false
  layerConfig: LayerConfig = BannerDatas as LayerConfig
  created () {
    let loadedBannerDataImageCount = 0
    this.layerConfig = this.layerConfig.map((bannerData) => {
      let loadedImageCount = 0
      bannerData.loopTime = 0
      bannerData.images = bannerData.images.map((image) => {
        const img = new Image()
        img.src = image.src
        bannerData.loopTime += image.duration || 0
        img.onload = () => {
          loadedImageCount++
          if (loadedImageCount >= bannerData.images.length) {
            loadedBannerDataImageCount++
            if (loadedBannerDataImageCount >= this.layerConfig.length) {
              this.imgLoaded = true
            }
          }
        }
        image.img = img
        return image
      })
      return bannerData
    })
  }
}
</script>

<style lang="scss">
.banner-box {
  height: 9.375vw;
  min-height: 155px;
  min-width: 999px;
  background-image: url("/images/banner/pre.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
</style>
