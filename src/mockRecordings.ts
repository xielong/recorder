// src/mockRecordings.ts
import type { Recording } from './types'

// 统一生成音频基础路径
const audioBase = `${import.meta.env.BASE_URL}audio/`

export const mockRecordings: Recording[] = [
    {
        id: 'rec-001',
        title: '项目周会 · 路线规划讨论',
        createdAt: '2025-11-18T14:00:00+08:00',
        durationSeconds: 5025, // 01:23:45
        speaker: 'Lucas',
        tags: ['周会', '产品评审'],
        // ✅ 这里改成用 BASE_URL
        audioUrl: `${audioBase}my-meeting-2025-11-25.mp3`,

        isShared: true,
        shareUrl: 'https://share.mygithub.ai/rec/rec-001',

        summary:
            '本次会议对 Q4 版本路线推荐能力进行了整体评审，明确多方案对比、拥堵提示和备选路线为三大重点。',
        summaryHighlights: [
            '确定 Q4 核心目标：升级路线推荐体验，重点覆盖早晚高峰。',
            '提出多方案对比卡片、智能备选路线、拥堵与管制提示三项能力。',
            '研发评估整体周期为 6 周，依赖地图接口 QPS 与 AI 推理链路。',
            '形成行动清单：可行性评估、埋点方案设计、AB 实验规划。',
        ],

        transcriptPreview:
            '我们今天主要讨论一下 Q4 版本的整体规划，重点还是放在路线推荐能力上……',

        transcriptSegments: [
            {
                id: 'seg-001',
                startSeconds: 3,
                speaker: 'SPEAKER_01',
                text: '我们今天主要讨论一下 Q4 版本的整体规划，重点还是放在路线推荐能力上，看怎么让用户在早晚高峰的时候能更快做决策。',
            },
            {
                id: 'seg-002',
                startSeconds: 72,
                speaker: 'SPEAKER_02',
                text: '我的想法是，在结果页里，不再只给一条推荐路线，而是给一个「组合卡片」，把驾车、公共交通、步行+地铁这几种方案并排展示。',
            },
            {
                id: 'seg-003',
                startSeconds: 225,
                speaker: 'SPEAKER_03',
                text: '技术上没有问题，就是我们需要提前确认地图侧的接口 QPS，另外 AI 侧推理的延迟要控制在两秒以内，不然体验会打折扣。',
            },
            {
                id: 'seg-004',
                startSeconds: 440,
                speaker: 'SPEAKER_01',
                text: '行，那接下来就按三个方向来拆：路线多方案对比、高峰期拥堵提示、异常情况的备选路线。',
            },
        ],
    },
    {
        id: 'rec-002',
        title: '用户访谈 · 高频功能需求整理',
        createdAt: '2025-11-20T10:30:00+08:00',
        durationSeconds: 2700,
        speaker: 'PM 小王',
        tags: ['用户访谈', '需求'],
        // ✅ 同样改一下
        audioUrl: `${audioBase}my-meeting-2025-11-25.mp3`,

        isShared: false,

        summary:
            '本次访谈重点围绕录音转写准确率、搜索功能和标记重点片段展开，用户希望在复杂会议场景下快速定位关键信息。',
        summaryHighlights: [
            '用户最关注录音转写的准确率及噪音环境下的表现。',
            '希望支持按「说话人 / 关键词 / 时间段」多维度搜索。',
            '强需求：能对关键片段打标签或收藏，方便回看。',
        ],

        transcriptPreview:
            '最近你在使用录音类工具时，最大的痛点是什么？……',

        transcriptSegments: [
            {
                id: 'seg-101',
                startSeconds: 15,
                speaker: 'INTERVIEWER',
                text: '最近你在使用录音类工具时，最大的痛点是什么？',
            },
            {
                id: 'seg-102',
                startSeconds: 30,
                speaker: 'USER',
                text: '我觉得最大的痛点还是回听效率太低了，明明只是想找两三句话，却要拖很久的进度条。',
            },
        ],
    },
]
