<template>
  <div class="banner" ref="container"></div>
</template>

<script lang='ts'>
import { LayerConfig, OffsetCurve, LayerConfigImageData } from '@/data/banner.d.ts'
import Curve from '@/utils/curve'
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
@Component({
  name: 'BiliBanner'
})
export default class BiliBanner extends Vue {
  @Prop() layerConfig!: LayerConfig
  @Ref('container') readonly container!: HTMLDivElement

  layers: HTMLDivElement[] = []
  proportion = 1
  offsetProportion = 0
  aimationFrameId = 0
  mouseOnContainer = false
  mouseWhenEnteringPositionX = 0
  handleMouseLeave!: () => void
  handleMouseMove!: (e: MouseEvent) => void
  handleResize!: () => void

  mounted () {
    let containerHeight = this.container.clientHeight
    let containerWidth = this.container.clientWidth
    // 设置比例
    this.proportion = containerHeight / 155
    // 设置所有img的宽高
    this.layerConfig.forEach((v) => {
      v.images.forEach((image) => {
        const img = image.img
        img.dataset.height = img.height + ''
        img.dataset.width = img.width + ''
        img.height = +img.dataset.height * this.proportion * (v.initial.scale || 1)
        img.width = +img.dataset.width * this.proportion * (v.initial.scale || 1)
      })
    })
    // 生成layer元素并添加到banner
    this.layers = this.layerConfig.map(() => {
      const layer = document.createElement('div')
      layer.classList.add('layer')
      this.container.appendChild(layer)
      return layer
    })
    // 设置img初始样式
    const setDefaultStyle = () => {
      this.layers.map((layer, i) => {
        const imgConfig = this.layerConfig[i]
        const img = layer.firstElementChild as HTMLImageElement
        let rotateStr = ''
        let translateStr = ''
        let blurStr = ''
        if (imgConfig.initial.rotate) {
          rotateStr = `rotate(${imgConfig.initial.rotate}deg)`
        }
        if (imgConfig.initial.translate) {
          const translate = imgConfig.initial.translate || [0, 0]
          translateStr = `translate(${translate[0]}px, ${translate[1]}px)`
        }
        img.style.transform = `${translateStr} ${rotateStr}`
        if (imgConfig.initial.blur) {
          blurStr = `blur(${Math.abs(imgConfig.initial.blur)}px)`
          img.style.filter = blurStr
        }
      })
    }
    // 曲线计算函数
    const computeCurve = (offsetCurve: [number, number, number, number]) => {
      const CurveFunction = Curve(...offsetCurve)
      return function (offsetRatio: number) {
        return offsetRatio > 0 ? CurveFunction(offsetRatio) : -CurveFunction(-offsetRatio)
      }
    }
    // 设置样式
    const setStyle = () => {
      this.layers.map((layer, i) => {
        const imgConfig = this.layerConfig[i]
        const img = layer.firstElementChild as HTMLImageElement
        if (imgConfig.offset && img) {
          const defaultRotate = imgConfig.initial.rotate || 0
          const defaultTranslate = imgConfig.initial.translate || [0, 0]
          let rotateStr = `rotate(${defaultRotate}deg)`
          let translateStr = `translate(${defaultTranslate[0]}px, ${defaultTranslate[1]}px)`
          let scaleStr = ''
          const realOffsetComputeFn = (offsetName: keyof OffsetCurve) => {
            if (imgConfig.offsetCurve && imgConfig.offsetCurve[offsetName]) {
              return computeCurve(imgConfig.offsetCurve[offsetName] || [0, 0, 0, 0])
            } else {
              return (offsetRatio: number) => offsetRatio
            }
          }
          if (imgConfig.offset.scale) {
            const scale = imgConfig.offset.scale * realOffsetComputeFn('scale')(this.offsetProportion)
            scaleStr = `scale(${1 + scale})`
          }
          if (imgConfig.offset.rotate) {
            const rotate = imgConfig.offset.rotate * realOffsetComputeFn('rotate')(this.offsetProportion)
            rotateStr = `rotate(${defaultRotate + rotate}deg)`
          }
          if (imgConfig.offset.translate) {
            const fn = realOffsetComputeFn('translate')
            const translate = imgConfig.offset.translate.map((v) => {
              return fn(this.offsetProportion) * v
            })
            const computedTranslate = defaultTranslate.map((v, i) => {
              return (translate[i] + v) * this.proportion * (imgConfig.initial.scale || 1)
            })
            translateStr = `translate(${computedTranslate[0]}px, ${computedTranslate[1]}px)`
          }
          img.style.transform = `${scaleStr} ${translateStr} ${rotateStr}`
          if (imgConfig.offset.blur) {
            const blur = imgConfig.offset.blur * realOffsetComputeFn('blur')(this.offsetProportion)
            img.style.filter = `blur(${Math.abs((imgConfig.initial.blur || 0) + blur)}px)`
          }
        }
      })
    }
    // 自动切换图片
    const autoChangeImage = (layer: HTMLDivElement, images: LayerConfigImageData[], index: number) => {
      setTimeout(() => {
        const currentImgIndex = index === images.length - 1 ? 0 : index + 1
        layer.removeChild(layer.firstElementChild as Node)
        layer.appendChild(images[currentImgIndex].img)
        autoChangeImage(layer, images, currentImgIndex)
        requestAnimationFrame(setStyle)
      }, images[index].duration)
    }
    // 在layer元素中插入img
    this.layerConfig.map((imgConfig, i) => {
      const firstImg = imgConfig.images[0].img
      this.layers[i].appendChild(firstImg)
      requestAnimationFrame(setDefaultStyle)
      if (imgConfig.images.length > 1 && imgConfig.loopTime > 0) {
        autoChangeImage(this.layers[i], imgConfig.images, 0)
      }
    })
    // 返回初始样式
    const backToDefaultStyle = () => {
      const startTiming = performance.now()
      const preOffsetProportion = this.offsetProportion
      cancelAnimationFrame(this.aimationFrameId)
      const callback = (runTiming: number) => {
        if (runTiming - startTiming < 200) {
          this.offsetProportion = preOffsetProportion * (1 - (runTiming - startTiming) / 200)
          setStyle()
          requestAnimationFrame(callback)
        } else {
          this.offsetProportion = 0
          setStyle()
        }
      }
      this.aimationFrameId = requestAnimationFrame(callback)
    }
    this.handleMouseLeave = () => {
      this.mouseOnContainer = false
      backToDefaultStyle()
    }
    this.handleMouseMove = (e: MouseEvent) => {
      const mousePositionY = document.documentElement.scrollTop + e.clientY
      const navHeight = (document.querySelector('#nav') as HTMLDivElement).offsetHeight
      if (mousePositionY > navHeight && mousePositionY < navHeight + containerHeight) {
        if (!this.mouseOnContainer) {
          this.mouseOnContainer = true
          this.mouseWhenEnteringPositionX = e.clientX
        }
        this.offsetProportion = (e.clientX - this.mouseWhenEnteringPositionX) / containerWidth
        cancelAnimationFrame(this.aimationFrameId)
        this.aimationFrameId = requestAnimationFrame(setStyle)
      } else {
        if (this.mouseOnContainer) {
          this.mouseOnContainer = false
          backToDefaultStyle()
        }
      }
    }
    this.handleResize = () => {
      containerWidth = this.container.clientWidth
      containerHeight = this.container.clientHeight
      this.proportion = containerWidth / 155
      this.layerConfig.forEach((imgConfig) => {
        imgConfig.images.forEach((image) => {
          image.img.width = image.img.dataset.width * this.proportion * (imgConfig.initial.scale || 1)
          image.img.height = image.img.dataset.height * this.proportion * (imgConfig.initial.scale || 1)
        })
      })
      cancelAnimationFrame(this.aimationFrameId)
      this.aimationFrameId = requestAnimationFrame(setStyle)
    }
    document.addEventListener('mouseleave', this.handleMouseLeave)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('resize', this.handleResize)
  }

  beforeDestroy () {
    document.removeEventListener('mouseleave', this.handleMouseLeave)
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="scss">
.banner {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  .layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
}
</style>
