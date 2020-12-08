declare const BannerDatas: BannerData[]
export default BannerDatas
interface BannerData {
  images: BannerImageData[];
  initial: Initial;
  offset: Initial;
  offsetCurve: OffsetCurve;
}

export type LayerConfig = LayerConfigBannerData[]

interface LayerConfigBannerData extends BannerData {
  images: layerConfigImageData[];
  loopTime: number;
}

export interface LayerConfigImageData extends BannerImageData {
  img: HTMLImageElement;
}

interface BannerImageData {
  src: string;
  img?: HTMLImageElement;
  duration?: number;
}

interface Initial {
  scale?: number;
  blur?: number;
  translate?: [number, number];
  rotate?: number;
}

export interface OffsetCurve {
  scale?: OffsetCurveValue;
  blur?: OffsetCurveValue;
  translate?: OffsetCurveValue;
  rotate?: OffsetCurveValue;
}

type OffsetCurveValue = [number, number, number, number]
