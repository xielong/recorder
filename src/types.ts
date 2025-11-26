// src/types.ts

// 转写里的每一行（带时间和文本）
export interface TranscriptSegment {
    id: string           // 段落唯一 ID
    startSeconds: number // 从音频开头算起的秒数，用于跳转播放
    speaker?: string     // 说话人（可选）
    text: string         // 文本内容
}

// 一条录音记录
export interface Recording {
    id: string
    title: string
    createdAt: string
    durationSeconds: number
    speaker?: string
    tags: string[]

    // 文件相关
    audioUrl: string

    // 分享信息
    isShared: boolean
    shareUrl?: string

    // 总结
    summary?: string
    summaryHighlights?: string[]

    // 列表/卡片用的简短预览
    transcriptPreview?: string

    // ✅ 完整转写（逐段，带时间）
    transcriptSegments?: TranscriptSegment[]
}
