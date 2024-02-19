import {Basis, identityMatrix, IMatrix, IPoint, Matrix, Operator} from "@do-while-for-each/math";
import {canvasHeight, canvasWidth} from "../app-common/constant";
import {getCursorCoordinates} from "./util/cursor-coordinates";
import {ScaleGenerator} from "./util/scale-generator";
import {IPointConverter} from "./contract";

export class SerifsController {

  context: CanvasRenderingContext2D;
  step = 100; // пиксели
  visValuesRangeX: IVisValuesRange = {
    minVis: 0,
    maxVis: 500,
  };

  basePixelToValue: IMatrix;
  baseValueToPixel: IMatrix;

  forward: IMatrix = identityMatrix;
  inverse: IMatrix = identityMatrix;

  get transformedPixelToValue(): IPointConverter {
    const conv = Matrix.multiply(
      this.basePixelToValue, // (2)
      this.inverse           // (1)
    );
    return (point: IPoint): IPoint => Matrix.apply(conv, point);
  }

  get valueToTransformedPixel(): IPointConverter {
    const conv = Matrix.multiply(
      this.forward,         // (2)
      this.baseValueToPixel // (1)
    );
    return (point: IPoint): IPoint => Matrix.apply(conv, point);
  }


  scaleGenerator: ScaleGenerator;

  constructor() {
    this.basePixelToValue = Operator.proportionsWithRotationConverter(
      Basis.fromExtent(
        [0, 0],
        [canvasWidth, 0],
        [0, canvasHeight],
      ),
      Basis.fromExtent(
        [this.visValuesRangeX.minVis!, 0],
        [this.visValuesRangeX.maxVis!, 0],
        [0, 1],
      ),
    );
    this.baseValueToPixel = Matrix.invert(this.basePixelToValue);
  }

  get state() {
    return {};
  }

  setCanvasElement(canvasElement: HTMLCanvasElement) {
    this.context = canvasElement.getContext('2d')!;
    this.context.font = '14px serif';
    this.draw();
    const clientRect = canvasElement.getBoundingClientRect();
    this.scaleGenerator = new ScaleGenerator(
      canvasElement,
      (event: any) => getCursorCoordinates(event, clientRect),
      (next: IMatrix) => {
        this.forward = Matrix.multiply(next, this.forward);
        this.inverse = Matrix.invert(this.forward);
        this.draw();
      },
    );
  }

  draw() {
    requestAnimationFrame(() => {
      this.drawSerifsAndLabels();
    });
  }

  drawSerifsAndLabels() {
    const pixelToValue = this.transformedPixelToValue;
    const valueToPixel = this.valueToTransformedPixel;
    const step = this.step;
    // const step = pixelToValue([this.step, 0])[0];

    this.context.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = this.visValuesRangeX.minVis!; i <= this.visValuesRangeX.maxVis!; i = i + step) {
      const pos = valueToPixel([i, 0])[0];
      this.context.beginPath();
      this.context.moveTo(pos, 0);
      this.context.lineTo(pos, 10);
      this.context.stroke();

      let moveLabel = 0;
      const label = `${Math.round(i)}`;
      switch (label.length) {
        case 1:
          moveLabel = 2.5;
          break;
        case 2:
          moveLabel = 7;
          break;
        case 3:
          moveLabel = 11;
          break;
      }
      this.context.fillText(label, pos - moveLabel, 25);
    }
  }

  dispose() {
    this.scaleGenerator?.dispose();
  }

}


interface IVisValuesRange {
  minVis?: number; // min видимое значение оси
  maxVis?: number; // max видимое значение оси
}
