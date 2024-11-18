import {useCellState} from "@do-while-for-each/tree-cell-react";
import {useEffect, useRef, useState} from 'react';
import {canvasHeight, canvasWidth} from "../app-common/constant";
import {SerifsController} from "./serifs.controller";
import s from './serifs.module.css';

export function Serifs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [controller] = useState(() => new SerifsController());
  const [{cursorPos}] = useCellState<any>(() => controller.state);

  useEffect(() => {
    controller.setCanvasElement(canvasRef.current!);
  }, []);

  useEffect(() => () => controller.dispose(), []);

  return (
    <div className={s.container}>

      <canvas className={s.canvas}
              width={canvasWidth} height={canvasHeight}
              ref={canvasRef}/>

      <div className={s.cursorPos}>
        <code>
          pixel: {cursorPos.pixel} <br/>
          value: {cursorPos.value}
        </code>
      </div>

    </div>
  );
}
