// src/App.tsx
import { useRef, useState } from 'react'
import './App.css'
import type { Recording, TranscriptSegment } from './types'
import { mockRecordings } from './mockRecordings'

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
            {/* 顶部栏 */}
            <header className="page-header">
                <div className="brand">
                    <div className="brand-logo" />
                    <div>
                        <div className="brand-text-main">superhexa · 录音中心</div>
                        <div className="brand-text-sub">录音管理 · 转写 · 分享 · 编辑</div>
                    </div>
                </div>
            </header>

            {/* 主体：左侧列表 + 右侧详情 */}
            <main className="page-main">
                {/* 左侧：录音列表 */}
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h2>我的录音</h2>
                        <span className="sidebar-count">{recordings.length} 条</span>
                    </div>

                    <ul className="recording-list">
                        {recordings.map((rec) => (
                            <li
                                key={rec.id}
                                className={
                                    'recording-item ' +
                                    (rec.id === activeId ? 'recording-item-active' : '')
                                }
                                onClick={() => handleSelectRecording(rec.id)}
                            >
                                <div className="recording-title">{rec.title}</div>
                                <div className="recording-meta">
                                    <span>{formatDuration(rec.durationSeconds)}</span>
                                    <span>·</span>
                                    <span>{formatDate(rec.createdAt)}</span>
                                </div>
                                <div className="recording-tags">
                                    {rec.tags.map((tag) => (
                                        <span key={tag} className="tag">
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* 右侧：录音详情 */}
                <section className="content">
                    {activeRecording ? (
                        <>
                            <div className="content-header">
                                <h1 className="content-title">{activeRecording.title}</h1>
                                <div className="content-meta">
                                    <span>{formatDuration(activeRecording.durationSeconds)}</span>
                                    <span>·</span>
                                    <span>{formatDate(activeRecording.createdAt)}</span>
                                    {activeRecording.speaker && (
                                        <>
                                            <span>·</span>
                                            <span>主讲：{activeRecording.speaker}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* 播放器 */}
                            <div className="player-card">
                                <div className="player-title">录音播放</div>
                                <audio
                                    ref={audioRef}
                                    controls
                                    src={activeRecording.audioUrl}
                                    style={{ width: '100%' }}
                                    onTimeUpdate={handleTimeUpdate} // ✅ 播放进度更新时自动高亮
                                >
                                    您的浏览器不支持 audio 播放。
                                </audio>
                            </div>

                            {/* 分享状态 */}
                            <div className="share-card">
                                <div className="share-header">
                                    <div className="share-title">分享状态</div>
                                    {activeRecording.isShared ? (
                                        <span className="share-badge shared">已分享</span>
                                    ) : (
                                        <span className="share-badge not-shared">未分享</span>
                                    )}
                                </div>

                                {activeRecording.isShared && activeRecording.shareUrl ? (
                                    <div className="share-url">
                                        <span>分享链接：</span>
                                        <a
                                            href={activeRecording.shareUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {activeRecording.shareUrl}
                                        </a>
                                    </div>
                                ) : (
                                    <div className="share-url">还没有生成分享链接。</div>
                                )}
                            </div>

                            {/* Tabs：总结 / 转写 / 思维导图 */}
                            <div className="detail-tabs">
                                <div className="tabs" role="tablist">
                                    <button
                                        type="button"
                                        className={`tab-btn ${
                                            activeTab === 'summary' ? 'active' : ''
                                        }`}
                                        onClick={() => setActiveTab('summary')}
                                    >
                                        总结
                                    </button>
                                    <button
                                        type="button"
                                        className={`tab-btn ${
                                            activeTab === 'transcript' ? 'active' : ''
                                        }`}
                                        onClick={() => setActiveTab('transcript')}
                                    >
                                        转写
                                    </button>
                                    <button
                                        type="button"
                                        className={`tab-btn ${
                                            activeTab === 'mindmap' ? 'active' : ''
                                        }`}
                                        onClick={() => setActiveTab('mindmap')}
                                    >
                                        思维导图
                                    </button>
                                </div>

                                <div className="tab-panels">
                                    {/* 总结 Tab */}
                                    {activeTab === 'summary' && (
                                        <div className="summary-card">
                                            <h3>AI 总结</h3>
                                            <p>{activeRecording.summary ?? '暂无总结内容。'}</p>

                                            {activeRecording.summaryHighlights &&
                                                activeRecording.summaryHighlights.length > 0 && (
                                                    <>
                                                        <h4>要点提炼</h4>
                                                        <ul className="summary-list">
                                                            {activeRecording.summaryHighlights.map(
                                                                (item, idx) => (
                                                                    <li key={idx}>{item}</li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </>
                                                )}
                                        </div>
                                    )}

                                    {/* 转写 Tab：可点击跳转、行高亮 + 自动跟随播放 */}
                                    {activeTab === 'transcript' && (
                                        <div className="summary-card">
                                            <h3>完整转写</h3>
                                            {activeRecording.transcriptSegments &&
                                            activeRecording.transcriptSegments.length > 0 ? (
                                                <div className="transcript-full">
                                                    {activeRecording.transcriptSegments.map(
                                                        (seg, index) => (
                                                            <div
                                                                key={seg.id}
                                                                className={
                                                                    'transcript-line ' +
                                                                    (index === activeSegmentIndex
                                                                        ? 'transcript-line-active'
                                                                        : '')
                                                                }
                                                                onClick={() => handleSegmentClick(index, seg)}
                                                            >
                                <span className="transcript-time">
                                  {formatTimeShort(seg.startSeconds)}
                                </span>
                                                                {seg.speaker && (
                                                                    <span className="transcript-speaker">
                                    {seg.speaker}：
                                  </span>
                                                                )}
                                                                <span className="transcript-text">{seg.text}</span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="transcript-preview">暂无转写内容。</p>
                                            )}
                                        </div>
                                    )}

                                    {/* 思维导图 Tab */}
                                    {activeTab === 'mindmap' && (
                                        <div className="summary-card">
                                            <h3>思维导图</h3>
                                            <p className="transcript-preview">
                                                这里将展示由录音自动生成的思维导图结构（后续可以接入真正的
                                                mindmap 组件或绘图库）。
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>请选择一条录音查看详情。</div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default App
