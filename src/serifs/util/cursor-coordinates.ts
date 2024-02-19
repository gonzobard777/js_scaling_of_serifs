import {IPoint} from '@do-while-for-each/math';

/**
 * Вычислить координаты курсора внутри прямоугольника DOM-элемента:
 *
 *   1) Для элемента, на котором планируется слушать событие, вычисляется его положение относительно viewport:
 *        const clientRect: DOMRect = element.getBoundingClientRect();  // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
 *
 *   2) Начинаем слушать событие на этом элементе, например 'mousemove'
 *      и по приходу нового события вычисляем координаты курсора внутри DOM-элемента.
 *      То есть координата [0, 0] будет означать, что курсор находится ровно в левом верхнем углу DOM-элемента,
 *      на котором сейчас произошло событие и для которого мы заранее посчитали clientRect.
 *
 * Будьте внимательны. Если DOM-элемент изменил положение или изменились его размеры(в некоторых случаях это может привести к изменению положения),
 *                     то вам надо заново вычислить element.getBoundingClientRect().
 */
export function getCursorCoordinates(event: any, clientRect: DOMRect): IPoint {
  let pageX: number;
  let pageY: number;

  if (event.pageX !== undefined) { // MouseEvent - https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/pageX
    pageX = event.pageX
    pageY = event.pageY
  } else if (event.touches !== undefined) { // TouchEvent - https://developer.mozilla.org/ru/docs/Web/API/TouchEvent/touches
    const [touch] = event.touches;
    pageX = touch.pageX
    pageY = touch.pageY
  } else {
    throw new Error(`can't calculate cursor coordinates because unknown type of event`);
  }
  return [
    pageX - clientRect.left,
    pageY - clientRect.top
  ];
}
