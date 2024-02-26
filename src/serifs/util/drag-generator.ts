import {ISetNextTransform} from "../contract";

/**
 * Генерит трансформ смещения.
 */
export class DragGenerator {

  prevPos = [0, 0]; // предыдущее положение курсора

  startListenMousemove = (event: any) => {
    this.prevPos = [event.pageX, event.pageY];
    this.element.addEventListener('mousemove', this.onMousemove);
  };

  onMousemove = ({pageX, pageY}: any) => {
    /**
     * drag - это приращение между текущим и предыдущим положением курсора.
     * За положение курсора принимаются значения события: pageX, pageY.
     */
    this.setNextTransform([
      1, 0, 0, 1,
      pageX - this.prevPos[0],
      pageY - this.prevPos[1]
    ]);

    this.prevPos = [pageX, pageY];
  };

  stopListenMousemove = () => {
    this.element.removeEventListener('mousemove', this.onMousemove);
  };

  constructor(private element: HTMLElement,
              private setNextTransform: ISetNextTransform) {
    this.element.addEventListener('mousedown', this.startListenMousemove);
    this.element.addEventListener('mouseup', this.stopListenMousemove);
    this.element.addEventListener('mouseleave', this.stopListenMousemove);
  }

  dispose() {
    this.element.removeEventListener('mousedown', this.startListenMousemove);
    this.element.removeEventListener('mouseup', this.stopListenMousemove);
    this.element.removeEventListener('mouseleave', this.stopListenMousemove);

    this.element.removeEventListener('mousemove', this.onMousemove);
  }

}
