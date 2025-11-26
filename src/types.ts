// src/types.ts

export interface Recording {
    id: string
    title: string
    createdAt: string
    durationSeconds: number
    speaker?: string
    tags: string[]

    audioUrl: string

    isShared: boolean
    shareUrl?: string

    // 简要总结
    summary?: string

    // 总结要点，用于“总结”Tab
    summaryHighlights?: string[]

    // 简要预览（列表/卡片用）
    transcriptPreview?: string

    // 完整转写段落，用于“转写”Tab
    transcriptFull?: string[]
}
