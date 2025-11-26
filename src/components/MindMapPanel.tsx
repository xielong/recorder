// src/components/MindMapPanel.tsx
import { useEffect, useRef } from 'react'
import MindElixir from 'mind-elixir'
//import 'mind-elixir/dist/mind-elixir.css'

// 这里用你之前的 mock 数据
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
                    {
                        id: 'goal',
                        topic: '明确录音转写产品形态',
                    },
                    {
                        id: 'scope',
                        topic: '聚焦 UI 迭代 + SPRING 集成',
                    },
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
                            {
                                id: 'quality',
                                topic: '音质 & 转写准确率校准',
                            },
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
                            {
                                id: 'qa',
                                topic: '回归测试策略与版本节奏',
                            },
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
                    {
                        id: 'spring',
                        topic: 'SPRING 集成：拆分服务，按模块发布',
                    },
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

export function MindMapPanel({ active }: MindMapPanelProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const mindRef = useRef<any | null>(null)

    useEffect(() => {
        if (!active) return
        if (!containerRef.current) return

        if (!mindRef.current) {
            const ME: any = (MindElixir as any).default || MindElixir
            const mind = new ME({
                el: containerRef.current,
                direction: ME.SIDE, // 左右展开
                draggable: true,
                contextMenu: false,
                toolBar: false,
                nodeMenu: false,
                keypress: true,
                locale: 'zh_CN',
                overflowHidden: false,
                scaleMin: 0.4,
                scaleMax: 2,
                scaleSensitivity: 30,
                handleWheel: true,
            })

            mind.init(mockMindMapData)

            if (typeof (mind as any).toCenter === 'function') {
                ;(mind as any).toCenter()
            }

            mindRef.current = mind
        } else {
            const mind = mindRef.current
            mind.refresh(mockMindMapData)
            if (typeof (mind as any).toCenter === 'function') {
                ;(mind as any).toCenter()
            }
        }
    }, [active])

    return (
        <div className="summary-card">
            <h3>思维导图（Mock）</h3>
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
            <p className="mindmap-tip">
                当前为前端 Mock 思维导图，后续可以替换为后端返回的真实结构。
            </p>
        </div>
    )
}

