import {IPoint} from "@do-while-for-each/math";
import {IGetCursorPosition} from "../contract";

export class CursorPositionGenerator {

  constructor(private element: HTMLElement,
              private getCursorPosition: IGetCursorPosition,
              private handleCursorPosition: (point: IPoint) => void) {
    this.element.addEventListener('mousemove', this.onMousemove);
  }

  onMousemove = (event: any) => {
    this.handleCursorPosition(this.getCursorPosition(event));
  }

  dispose() {
    this.element.removeEventListener('mousemove', this.onMousemove);
  }

}
