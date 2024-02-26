import {IMatrix, IPoint} from "@do-while-for-each/math";

export type IGetCursorPosition = (event: any) => IPoint;
export type ISetNextTransform = (next: IMatrix) => void;

export type IPointConverter = (point: IPoint) => IPoint;
