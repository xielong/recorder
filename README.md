# 🎧 recorder · Recording Center

`recorder` 是一个基于 **React + TypeScript + Vite** 的前端应用，用于演示「录音管理 / 转写 / 思维导图」的一体化体验。

它模拟了一个完整的「录音中心」：

- 左侧录音列表
- 右侧录音详情（播放、转写、AI 总结）
- 基于 **思维导图（mind-elixir）** 的结构化内容展示

目前使用的是前端 Mock 数据，后续可以很方便地接入真实后端 API。

---

## ✨ Features

### 1. 录音列表（Recording List）

- 展示录音标题、时长、创建时间、标签
- 支持点击切换当前录音
- 当前选中项高亮显示

### 2. 录音详情（Recording Detail）

- 显示录音基础信息：
    - 标题
    - 总时长
    - 创建时间
    - 主讲人（可选）

### 3. 音频播放联动（Audio + Transcript Sync）

- 内置 `<audio>` 播放器
- 支持点击任意转写行，自动跳转到对应时间点播放
- 播放过程中自动高亮当前所在的转写段落

### 4. AI 总结（Summary Tab）

- 展示该录音对应的 AI 总结文本（Mock 数据）
- 支持「要点提炼」列表展示（summary highlights）
- 无内容时显示友好的空状态文案

### 5. 转写内容（Transcript Tab）

- 以时间轴形式展示完整转写内容（Transcript Segments）
- 每行包含：
    - 时间戳（`mm:ss` 或 `hh:mm:ss`）
    - 说话人（可选）
    - 文本内容
- 点击行 ➜ 跳转播放 + 高亮
- 播放进度变化时自动滚动感知当前行（高亮）

### 6. 思维导图视图（Mind Map Tab）

- 使用 **[mind-elixir](https://github.com/ssshooter/mind-elixir-core)** 渲染会议内容思维导图（Mock 数据）
- 初始化时：
    - 自动设置合适的初始缩放比例
    - 自动居中显示
- 支持滚轮缩放、拖动画布
- 自定义控制条：
    - `−`：缩小
    - `1x`：重置缩放并居中
    - `+`：放大
    - `⊙`：仅居中

---

## 🧱 Tech Stack

- **React 18**
- **TypeScript**
- **Vite**
- **mind-elixir**（思维导图库）
- CSS 模块化结构化样式（`App.css` + 组件级 class）

---

## 📦 Scripts

在项目根目录下：

### 开发环境启动

```bash
npm install
npm run dev
