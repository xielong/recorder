// src/components/RecordingDetail.tsx
import type { MutableRefObject } from 'react'
import type { Recording, TranscriptSegment } from '../types'
import { MindMapPanel } from './MindMapPanel'

interface RecordingDetailProps {
    recording: Recording
    activeTab: 'summary' | 'transcript' | 'mindmap'
    onTabChange: (tab: 'summary' | 'transcript' | 'mindmap') => void
    audioRef: MutableRefObject<HTMLAudioElement | null>
    onTimeUpdate: () => void
    activeSegmentIndex: number | null
    onSegmentClick: (index: number, segment: TranscriptSegment) => void
    formatDuration: (seconds: number) => string
    formatDate: (iso: string) => string
    formatTimeShort: (seconds: number) => string
}

export const RecordingDetail: React.FC<RecordingDetailProps> = ({
                                                                    recording,
                                                                    activeTab,
                                                                    onTabChange,
                                                                    audioRef,
                                                                    onTimeUpdate,
                                                                    activeSegmentIndex,
                                                                    onSegmentClick,
                                                                    formatDuration,
                                                                    formatDate,
                                                                    formatTimeShort,
                                                                }) => {
    return (
        <>
            <div className="content-header">
                <h1 className="content-title">{recording.title}</h1>
                <div className="content-meta">
                    <span>{formatDuration(recording.durationSeconds)}</span>
                    <span>·</span>
                    <span>{formatDate(recording.createdAt)}</span>
                    {recording.speaker && (
                        <>
                            <span>·</span>
                            <span>主讲：{recording.speaker}</span>
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
                    src={recording.audioUrl}
                    style={{ width: '100%' }}
                    onTimeUpdate={onTimeUpdate}
                >
                    您的浏览器不支持 audio 播放。
                </audio>
            </div>

            {/* 分享状态 */}
            <div className="share-card">
                <div className="share-header">
                    <div className="share-title">分享状态</div>
                    {recording.isShared ? (
                        <span className="share-badge shared">已分享</span>
                    ) : (
                        <span className="share-badge not-shared">未分享</span>
                    )}
                </div>

                {recording.isShared && recording.shareUrl ? (
                    <div className="share-url">
                        <span>分享链接：</span>
                        <a href={recording.shareUrl} target="_blank" rel="noreferrer">
                            {recording.shareUrl}
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
                        className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                        onClick={() => onTabChange('summary')}
                    >
                        总结
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'transcript' ? 'active' : ''}`}
                        onClick={() => onTabChange('transcript')}
                    >
                        转写
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'mindmap' ? 'active' : ''}`}
                        onClick={() => onTabChange('mindmap')}
                    >
                        思维导图
                    </button>
                </div>

                <div className="tab-panels">
                    {/* 总结 Tab */}
                    {activeTab === 'summary' && (
                        <div className="summary-card">
                            <h3>AI 总结</h3>
                            <p>{recording.summary ?? '暂无总结内容。'}</p>

                            {recording.summaryHighlights &&
                                recording.summaryHighlights.length > 0 && (
                                    <>
                                        <h4>要点提炼</h4>
                                        <ul className="summary-list">
                                            {recording.summaryHighlights.map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                        </div>
                    )}

                    {/* 转写 Tab */}
                    {activeTab === 'transcript' && (
                        <div className="summary-card">
                            <h3>完整转写</h3>
                            {recording.transcriptSegments &&
                            recording.transcriptSegments.length > 0 ? (
                                <div className="transcript-full">
                                    {recording.transcriptSegments.map((seg, index) => (
                                        <div
                                            key={seg.id}
                                            className={
                                                'transcript-line ' +
                                                (index === activeSegmentIndex
                                                    ? 'transcript-line-active'
                                                    : '')
                                            }
                                            onClick={() => onSegmentClick(index, seg)}
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
                                    ))}
                                </div>
                            ) : (
                                <p className="transcript-preview">暂无转写内容。</p>
                            )}
                        </div>
                    )}

                    {/* 思维导图 Tab */}
                    {activeTab === 'mindmap' && <MindMapPanel active={activeTab === 'mindmap'} />}
                </div>
            </div>
        </>
    )
}
