import {Operator} from '@do-while-for-each/math';
import {IGetCursorPosition, ISetNextTransform} from '../contract';
import {scaleMinus, scalePlus} from "../../app-common/constant";

/**
 * Генерит трансформ масштабирования относительно текущего положения курсора.
 */
export class ScaleGenerator {

  onWheel = (event: WheelEvent) => {
    const scaleValue = Math.sign(event.deltaY) < 0
      ? scalePlus
      : scaleMinus;

    this.setNextTransform(
      Operator.scaleAtPoint(
        this.getCursorPosition(event),
        scaleValue
      )
    );
  };

  constructor(private element: HTMLElement,
              private getCursorPosition: IGetCursorPosition,
              private setNextTransform: ISetNextTransform) {
    this.element.addEventListener('wheel', this.onWheel);
  }

  dispose = () => this.element.removeEventListener('wheel', this.onWheel);
}
