import {useCellState} from "@do-while-for-each/tree-cell-react";
import {useState, useRef, useEffect} from 'react';
import {canvasHeight, canvasWidth} from "../app-common/constant";
import {SerifsController} from "./serifs.controller";
import s from './serifs.module.css';

export function Serifs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [controller] = useState(() => new SerifsController());
  const [{}] = useCellState(() => controller.state);

  useEffect(() => {
    controller.setCanvasElement(canvasRef.current!);
  }, []);

  useEffect(() => () => controller.dispose(), []);

  return (
    <canvas className={s.canvas}
            width={canvasWidth} height={canvasHeight}
            ref={canvasRef}/>
  );
}
