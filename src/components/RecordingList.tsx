// src/components/RecordingList.tsx
import type { Recording } from '../types'

interface RecordingListProps {
    recordings: Recording[]
    activeId: string
    onSelectRecording: (id: string) => void
    formatDuration: (seconds: number) => string
    formatDate: (iso: string) => string
}

export const RecordingList: React.FC<RecordingListProps> = ({
                                                                recordings,
                                                                activeId,
                                                                onSelectRecording,
                                                                formatDuration,
                                                                formatDate,
                                                            }) => {
    return (
        <>
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
                        onClick={() => onSelectRecording(rec.id)}
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
        </>
    )
}
