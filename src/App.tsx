// src/App.tsx
import { useRef, useState } from 'react'
import './App.css'
import type { Recording, TranscriptSegment } from './types'
import { MindMapPanel } from './components/MindMapPanel'
import { mockRecordings } from './mockRecordings'
import { HeaderBar } from './components/HeaderBar'
import { RecordingList } from './components/RecordingList'
import { RecordingDetail } from './components/RecordingDetail'

// ====== 工具函数 ======
function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(h)}:${pad(m)}:${pad(s)}`
}

// 段落用短时间格式：mm:ss 或 hh:mm:ss
function formatTimeShort(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    if (h > 0) {
        return `${pad(h)}:${pad(m)}:${pad(s)}`
    }
    return `${pad(m)}:${pad(s)}`
}

function formatDate(iso: string): string {
    const d = new Date(iso)
    const y = d.getFullYear()
    const m = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    const hh = d.getHours().toString().padStart(2, '0')
    const mm = d.getMinutes().toString().padStart(2, '0')
    return `${y}-${m}-${day} ${hh}:${mm}`
}

function App() {
    const [recordings] = useState<Recording[]>(mockRecordings)
    const [activeId, setActiveId] = useState<string>(recordings[0]?.id ?? '')
    const [activeTab, setActiveTab] = useState<'summary' | 'transcript' | 'mindmap'>(
        'summary',
    )

    // 当前高亮的转写段落索引
    const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null)

    // audio 元素引用，用于跳转播放进度
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const activeRecording = recordings.find((r) => r.id === activeId)

    const handleSelectRecording = (id: string) => {
        setActiveId(id)
        setActiveTab('summary') // 切换录音时回到“总结”Tab
        setActiveSegmentIndex(null)
        // 重置播放进度
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.pause()
        }
    }

    const handleSegmentClick = (index: number, segment: TranscriptSegment) => {
        setActiveSegmentIndex(index)
        if (audioRef.current) {
            audioRef.current.currentTime = segment.startSeconds
            audioRef.current
                .play()
                .catch(() => {
                    // 某些浏览器可能因为自动播放策略阻止播放，静默忽略即可
                })
        }
    }

    // ✅ 播放时自动根据 currentTime 高亮当前段落
    const handleTimeUpdate = () => {
        if (!audioRef.current || !activeRecording || !activeRecording.transcriptSegments) {
            return
        }
        const current = audioRef.current.currentTime
        const segments = activeRecording.transcriptSegments

        // 找到最后一个 startSeconds <= current 的段落
        let idx = -1
        for (let i = 0; i < segments.length; i++) {
            if (segments[i].startSeconds <= current) {
                idx = i
            } else {
                break
            }
        }

        if (idx !== -1 && idx !== activeSegmentIndex) {
            setActiveSegmentIndex(idx)
        }
    }

    return (
        <div className="page">
            <HeaderBar />

            <main className="page-main">
                {/* 左侧：录音列表 */}
                <aside className="sidebar">
                    <RecordingList
                        recordings={recordings}
                        activeId={activeId}
                        onSelectRecording={handleSelectRecording}
                        formatDuration={formatDuration}
                        formatDate={formatDate}
                    />
                </aside>

                {/* 右侧：录音详情 */}
                <section className="content">
                    {activeRecording ? (
                        <RecordingDetail
                            recording={activeRecording}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            audioRef={audioRef}
                            onTimeUpdate={handleTimeUpdate}
                            activeSegmentIndex={activeSegmentIndex}
                            onSegmentClick={handleSegmentClick}
                            formatDuration={formatDuration}
                            formatDate={formatDate}
                            formatTimeShort={formatTimeShort}
                        />
                    ) : (
                        <div>请选择一条录音查看详情。</div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default App
