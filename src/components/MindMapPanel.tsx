// src/components/MindMapPanel.tsx
import { useEffect, useRef, useState } from 'react'
import MindElixir from 'mind-elixir'
import 'mind-elixir/style'

// 这里用你的 mock 数据
const mockMindMapData: any = {
    nodeData: {
        id: 'root',
        topic: 'UI 迭代 & SPRING 需求评审会议',
        root: true,
        expanded: true,
        children: [
            {
                id: 'overview',
                topic: '会议概要',
                direction: 0,
                expanded: true,
                children: [
                    { id: 'goal', topic: '明确录音转写产品形态' },
                    { id: 'scope', topic: '聚焦 UI 迭代 + SPRING 集成' },
                ],
            },
            {
                id: 'core-topic',
                topic: '核心议题',
                direction: 0,
                expanded: true,
                children: [
                    {
                        id: 'recording-feature',
                        topic: '1. 录音功能模块梳理',
                        expanded: true,
                        children: [
                            {
                                id: 'pipeline',
                                topic: '录音转写流程：录音 → 转写 → 总结 → 思维导图',
                            },
                            { id: 'quality', topic: '音质 & 转写准确率校准' },
                        ],
                    },
                    {
                        id: 'ui-design',
                        topic: '2. UI 页面设计细节',
                        expanded: true,
                        children: [
                            {
                                id: 'list',
                                topic: '录音列表：标题、时长、标签、创建时间',
                            },
                            {
                                id: 'player',
                                topic: '播放器：进度条与时间点联动高亮',
                            },
                        ],
                    },
                    {
                        id: 'test',
                        topic: '3. 测试与异常处理',
                        expanded: true,
                        children: [
                            {
                                id: 'edge-cases',
                                topic: '边界用例：无音频、无转写、超长录音',
                            },
                            { id: 'qa', topic: '回归测试策略与版本节奏' },
                        ],
                    },
                ],
            },
            {
                id: 'key-decisions',
                topic: '重要实现 & 共识',
                direction: 1,
                expanded: true,
                children: [
                    {
                        id: 'meta',
                        topic: 'META DATA 结构统一：时间轴 + TODO 列表',
                    },
                    {
                        id: 'api',
                        topic: 'API 规划：统一为前端提供 summary / transcript / mindmap',
                    },
                    { id: 'spring', topic: 'SPRING 集成：拆分服务，按模块发布' },
                ],
            },
            {
                id: 'followup',
                topic: '后续行动',
                direction: 1,
                expanded: true,
                children: [
                    { id: 'todo1', topic: '完善交互文案与空状态提示' },
                    { id: 'todo2', topic: '补齐异常 case 自动化测试' },
                    { id: 'todo3', topic: '接入真实后端数据做一轮联调' },
                ],
            },
        ],
    },
    linkData: {},
}

interface MindMapPanelProps {
    active: boolean
}

const SCALE_MIN = 0.4
const SCALE_MAX = 2
const SCALE_STEP = 0.1
const INITIAL_SCALE = 0.7

export function MindMapPanel({ active }: MindMapPanelProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const mindRef = useRef<any | null>(null)
    const [scale, setScale] = useState(INITIAL_SCALE)

    // 初始化 / 刷新导图
    useEffect(() => {
        if (!active) return
        if (!containerRef.current) return

        const ME: any = (MindElixir as any).default || MindElixir

        if (!mindRef.current) {
            const mind = new ME({
                el: containerRef.current,
                direction: 2, // 左右分布
                draggable: true,
                contextMenu: false,
                toolBar: false, // 我们自己做按钮，这里关掉内置 toolbar
                nodeMenu: false,
                keypress: true,
                locale: 'zh_CN',
                overflowHidden: false,
            })

            mind.init(mockMindMapData)

            // 初始缩放 + 居中
            if (typeof mind.scale === 'function') {
                mind.scale(INITIAL_SCALE)
            }
            if (typeof mind.toCenter === 'function') {
                mind.toCenter()
            }

            mindRef.current = mind
            setScale(INITIAL_SCALE)
        } else {
            const mind = mindRef.current
            mind.refresh(mockMindMapData)
            if (typeof mind.toCenter === 'function') {
                mind.toCenter()
            }
        }
    }, [active])

    // 自定义缩放控制
    const applyScale = (next: number) => {
        if (!mindRef.current || typeof mindRef.current.scale !== 'function') return
        const clamped = Math.max(SCALE_MIN, Math.min(SCALE_MAX, next))
        mindRef.current.scale(clamped)
        setScale(clamped)
    }

    const handleZoomIn = () => {
        applyScale(scale + SCALE_STEP)
    }

    const handleZoomOut = () => {
        applyScale(scale - SCALE_STEP)
    }

    const handleCenter = () => {
        if (mindRef.current && typeof mindRef.current.toCenter === 'function') {
            mindRef.current.toCenter()
        }
    }

    const handleReset = () => {
        applyScale(INITIAL_SCALE)
        handleCenter()
    }

    return (
        <div className="summary-card">
            <h3>思维导图（Mock）</h3>

            <div className="mindmap-wrapper">
                <div
                    ref={containerRef}
                    className="mindmap-container"
                    style={{
                        height: '480px',
                        width: '100%',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#111',
                    }}
                />

                {/* 底部控制条：缩小 / 还原 / 放大 / 居中 */}
                <div className="mindmap-controls">
                    <button
                        type="button"
                        className="mindmap-btn"
                        onClick={handleZoomOut}
                        aria-label="Zoom out"
                    >
                        −
                    </button>
                    <button
                        type="button"
                        className="mindmap-btn"
                        onClick={handleReset}
                        aria-label="Reset zoom"
                    >
                        1x
                    </button>
                    <button
                        type="button"
                        className="mindmap-btn"
                        onClick={handleZoomIn}
                        aria-label="Zoom in"
                    >
                        +
                    </button>
                    <button
                        type="button"
                        className="mindmap-btn"
                        onClick={handleCenter}
                        aria-label="Center map"
                    >
                        ⊙
                    </button>
                </div>
            </div>

            <p className="mindmap-tip">
                当前为前端 Mock 思维导图，后续可以替换为后端返回的真实结构。
            </p>
        </div>
    )
}
