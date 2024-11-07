'use client'

import { useEffect, useRef } from "react";


export default function Home() {

    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current

        if (!canvas) return

        const ctx = canvas.getContext("2d") // canvas context (the 2d canvas)

        if (!ctx) return

        // strokes
        ctx.fillRect(20, 20, 100, 100) //   x,  y, width, height

        ctx.clearRect(30, 30, 80, 80)


        ctx.strokeRect(70, 10, 1, 120)
        ctx.strokeRect(10, 70, 120, 1)

        ctx.font = "30px Times New Roman";
        ctx.strokeStyle = "green"
        ctx.strokeText("text inside box", 40, 80)

        // paths
        ctx.beginPath()

        // set starting position
        ctx.moveTo(100, 200)

        ctx.lineTo(100, 300)
        ctx.lineTo(150, 250)

        // paint
        ctx.fillStyle = 'orange'
        ctx.fill()
    }, [canvasRef])

    return (
        <canvas ref={canvasRef} width={300} height={300} className="border border-neutral-300"> <p>fallback text</p> </canvas>
    );
}
