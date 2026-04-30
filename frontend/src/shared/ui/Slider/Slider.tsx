import React, { useEffect, useState } from "react"
import "./slider.css"
import type { SliderProps } from "./types"
import clsx from "clsx";

export const Slider = ({progress, onProgressChange, ...props}: SliderProps) => {
    const backgroundRef = React.useRef<HTMLDivElement>(null);
    const sliderButtonRef = React.useRef<HTMLDivElement>(null);
    const [progressLocal, setProgressLocal] = useState<number>(progress);
    const [moving, setMoving] = useState(false);

    useEffect(() => {
        if (moving) return;

        setProgressLocal(progress);
    }, [progress, moving])

    const handleSliderButtonStarted = () => {
        setMoving(true);
    }

    const handleSliderButtonEnded = () => {
        setMoving(false);
        onProgressChange(progressLocal);
    }

    const onMouseMove = (event: globalThis.MouseEvent) => {
        if (!moving) return;

        const wholeWidth = backgroundRef.current?.getBoundingClientRect().width || 1;
        const startingX = backgroundRef.current?.getBoundingClientRect().left || 0;
        const touchX = event.clientX;
        console.log(wholeWidth, startingX, touchX);
        setProgressLocal(Math.min(1, Math.max(0, (touchX - startingX) / wholeWidth)))
    }

    const onTouchMove = (event: globalThis.TouchEvent) => {
        if (!moving) return;

        const wholeWidth = backgroundRef.current?.getBoundingClientRect().width || 1;
        const startingX = backgroundRef.current?.getBoundingClientRect().left || 0;
        const touchX = event.touches?.[0].clientX;
        setProgressLocal(Math.min(1, Math.max(0, (touchX - startingX) / wholeWidth)))
    }

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("mouseup", handleSliderButtonEnded);
        window.addEventListener("touchend", handleSliderButtonEnded);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("mouseup", handleSliderButtonEnded);
            window.removeEventListener("touchend", handleSliderButtonEnded);
        }
    })

    return <div onMouseDown={handleSliderButtonStarted}
            onTouchStart={handleSliderButtonStarted}  {...props} className={clsx(props.className, "slider")}>
        <div className="slider-background" ref={backgroundRef}></div>
        <div style={{width: `${progressLocal * 100}%`}} className="slider-foreground"></div>
        <div 
            style={{left: `${progressLocal * 100}%`}}
            className="slider-button" 
            ref={sliderButtonRef}
        ></div>
    </div>
}