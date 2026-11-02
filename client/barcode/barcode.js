import { BarcodeDetector } from "https://fastly.jsdelivr.net/npm/barcode-detector@3/dist/es/ponyfill.min.js";

const acceptedFormats = await BarcodeDetector.getSupportedFormats();

export class barcodeDetector_atomic {
  #bc_internal;
  #loaded = false;

  barcodeDetector_atomic() {
    if (!this.#loaded) {
      this.#bc_internal = new BarcodeDetector({
        formats: acceptedFormats
      })
      this.#loaded = true;
    }
  }

  get() {
    if (!this.#loaded) {
      this.#bc_internal = new BarcodeDetector({
        formats: acceptedFormats
      })
      this.#loaded = true;
    }
    return this.#bc_internal;
  }

  // Grabs barcode data from image object
  async detect(image_object) {
    if (!(
      image_object instanceof Blob ||
      image_object instanceof ImageData ||
      image_object instanceof VideoFrame ||
      image_object instanceof HTMLImageElement ||
      image_object instanceof SVGImageElement ||
      image_object instanceof HTMLVideoElement ||
      image_object instanceof HTMLCanvasElement ||
      image_object instanceof ImageBitmap ||
      image_object instanceof OffscreenCanvas
    )) {
      console.error("Required image data");
      return;
    }
    var detected_object = await this.get().detect(image_object);
    if (detected_object.length === 0) {
      return null;
    }
    return { val: detected_object[0].rawValue, boundingBox: detected_object[0].boundingBox };
  }
}
