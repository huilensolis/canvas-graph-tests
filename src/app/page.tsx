'use client'

import { useEffect, useRef, useState } from "react";

type TArea = { id: number, title: string, x: number, y: number, width: number, height: number, relatedTo?: number[] }

export default function Home() {
    const CANVAS_SIZE = { width: 800, height: 800 }

    const [draggingAreaId, setDraggingAreaId] = useState<number | null>(null)
    const [dragOffset, setDragOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

    const [areas, setAreas] = useState<TArea[]>([
        { id: 1, title: 'greek works', x: 20, y: 20, width: 100, height: 60 },
        {
            id: 2,
            title: 'Homer works',
            x: 150, y: 50
            , relatedTo: [1], width: 100, height: 60
        },
        {
            id: 3,
            title: 'Plato works',
            x: 150, y: 150
            , relatedTo: [1], width: 100, height: 60
        },
        {
            id: 4,
            title: 'Aristotel works',
            x: 50, y: 250
            , relatedTo: [1], width: 100, height: 60
        },
        {
            id: 5, title: 'The Iliad', x: 250, y: 40, relatedTo: [2], width: 100, height: 60
        }, {
            id: 6, title: 'The Odyssey', x: 350, y: 80, relatedTo: [2], width: 100, height: 60
        }


    ])

    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current

        if (!canvas) return

        drawAreas(canvas, areas)

    }, [canvasRef, areas])

    function drawAreas(canvas: HTMLCanvasElement, areaList: TArea[]) {
        const ctx = canvas.getContext('2d')

        if (!ctx) return

        ctx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height)

        // draw relation lines
        for (const area of areas) {
            if (!area.relatedTo) continue

            area.relatedTo.forEach((relatedAreaId) => {

                const relatedArea = areaList.find((areaElement) => relatedAreaId === areaElement.id)

                if (!relatedArea) return;

                ctx.beginPath()

                ctx.moveTo(area.x + (area.width / 2), area.y + (area.height / 2))
                ctx.lineTo(relatedArea.x + (relatedArea.width / 2), relatedArea.y + (relatedArea.height / 2))
                ctx.stroke()
            })

        }

        // draw areas
        for (const area of areas) {

            // area block
            ctx.fillStyle = 'violet'
            ctx.fillRect(area.x, area.y, area.width, area.height)

            // area border
            ctx.strokeStyle = "gray"
            ctx.strokeRect(area.x, area.y, area.width, area.height)


            // area text
            ctx.fillStyle = 'white'
            ctx.font = '14px Arial'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            const maxWidth = area.width - 10
            let words = area.title.split(' ')
            let line = ''
            let y = area.y + area.height / 2 - 10
            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' '
                const metrics = ctx.measureText(testLine)
                if (metrics.width > maxWidth && i > 0) {
                    ctx.fillText(line, area.x + area.width / 2, y)
                    line = words[i] + ' '
                    y += 20
                } else {
                    line = testLine
                }
            }
            ctx.fillText(line, area.x + area.width / 2, y)
        }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const clickedArticle = areas.find(area =>
            x >= area.x && x <= area.x + area.width &&
            y >= area.y && y <= area.y + area.height
        )

        if (clickedArticle) {
            setDraggingAreaId(clickedArticle.id)
            setDragOffset({
                x: x - clickedArticle.x,
                y: y - clickedArticle.y
            })
        }
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (draggingAreaId === null) return

        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setAreas(areas.map(area =>
            area.id === draggingAreaId
                ? { ...area, x: x - dragOffset.x, y: y - dragOffset.y }
                : area
        ))
    }

    const handleMouseUp = () => {
        setDraggingAreaId(null)
    }

    function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const clickedArticle = areas.find(area =>
            x >= area.x && x <= area.x + area.width &&
            y >= area.y && y <= area.y + area.height
        )

        if (clickedArticle) {
            console.log({
                area: clickedArticle,
                x: x - clickedArticle.x,
                y: y - clickedArticle.y
            })
        }
    }

    return (
        <canvas ref={canvasRef} onMouseDown={handleMouseDown} onClick={handleClick} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} width={CANVAS_SIZE.width} height={CANVAS_SIZE.height} className="border border-neutral-300"> <p>fallback text</p> </canvas>
    );
}
