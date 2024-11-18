import {Basis, identityMatrix, IMatrix, IPoint, Matrix, Operator} from '@do-while-for-each/math';
import {cell, makeObservable} from '@do-while-for-each/tree-cell';
import {CursorPositionGenerator} from './util/cursor-position-generator';
import {canvasHeight, canvasWidth} from '../app-common/constant';
import {getCursorCoordinates} from './util/cursor-coordinates';
import {ScaleGenerator} from './util/scale-generator';
import {DragGenerator} from './util/drag-generator';
import {IPointConverter} from './contract';

export class SerifsController {

  context: CanvasRenderingContext2D;

  valuesRangeX: IValuesRange = {
    min: 0,
    max: 800,
  };
  valueStep = 10;

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
  dragGenerator: DragGenerator;
  cursorPositionGenerator: CursorPositionGenerator;

  cursorPos: { pixel: number; value: number } = {pixel: 0, value: 0};

  constructor() {
    this.basePixelToValue = Operator.proportionsWithRotationConverter(
      Basis.fromExtent(
        [0, 0],
        [100, 0],
        [0, 1],
      ),
      Basis.fromExtent(
        [0, 0],
        [10, 0],
        [0, 1],
      ),
    );
    this.baseValueToPixel = Matrix.invert(this.basePixelToValue);

    makeObservable(this, {
      cursorPos: cell,
    });
  }

  get state() {
    return {
      cursorPos: this.cursorPos,
    };
  }

  setCanvasElement(canvasElement: HTMLCanvasElement) {
    this.context = canvasElement.getContext('2d')!;
    this.context.font = '14px serif';
    this.draw();
    const clientRect = canvasElement.getBoundingClientRect();
    const getCursorPosition = (event: any) => getCursorCoordinates(event, clientRect);
    const setNextTransform = (next: IMatrix) => {
      this.forward = Matrix.multiply(next, this.forward);
      this.inverse = Matrix.invert(this.forward);
      this.draw();
    };
    this.scaleGenerator = new ScaleGenerator(
      canvasElement,
      getCursorPosition,
      setNextTransform,
    );
    this.dragGenerator = new DragGenerator(
      canvasElement,
      setNextTransform,
    );
    this.cursorPositionGenerator = new CursorPositionGenerator(
      canvasElement,
      getCursorPosition,
      (point: IPoint) => {
        this.cursorPos = {
          pixel: point[0],
          value: this.transformedPixelToValue([point[0], 0])[0],
        };
      },
    );

    // сдвигаю, чтобы по левой границе значение было 10
    const moveVector = Matrix.apply(this.baseValueToPixel, [-500, 0]);
    setNextTransform(
      Matrix.multiply(
        [1, 0, 0, 1, canvasWidth / 2, 0], // (2) но я хочу, чтобы это значение стояло по центру
        [1, 0, 0, 1, moveVector[0], 0]    // (1) сдвигаю, чтобы по левому краю было целевое значение value-пространства
      )
    );
  }

  draw() {
    requestAnimationFrame(() => {
      this.drawSerifsAndLabels();
    });
  }

  drawSerifsAndLabels() {
    this.context.clearRect(0, 0, canvasWidth, canvasHeight);
    const valueToPixel = this.valueToTransformedPixel;

    for (
      let i = this.valuesRangeX.min!;
      i <= this.valuesRangeX.max!;
      i = i + this.valueStep
    ) {
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
    this.dragGenerator?.dispose();
    this.cursorPositionGenerator?.dispose();
  }

}


interface IValuesRange {
  min: number;
  max: number;
}
