<div align="center">
  <img src="https://github.com/user-attachments/assets/5c5c1f06-7fb2-43b7-b467-f08680d76e70" width="120" height="120" alt="Gemini Nexus Logo">
  <h1>Gemini Nexus</h1>
  <p>一款基于 Google Gemini 的全功能 AI 浏览器助手插件</p>
</div>

---

## 🌟 项目简介

Gemini Nexus 是一款深度集成 Google Gemini 能力的 Chrome 扩展程序。它不仅提供侧边栏对话，还通过悬浮工具栏和浏览器控制协议（MCP），将 AI 的能力扩展到网页浏览的每一个角落。

## ✨ 核心功能

*   **💬 全能侧边栏 (Side Panel)**：随时唤起对话窗口，支持完整的历史记录管理、实时搜索和会话恢复。
*   **🪄 网页划词工具栏**：在页面上选中文字，即可进行**翻译、总结、解释**或**语法纠错**，支持将结果直接插入到网页输入框。
*   **🖼️ 图像 AI 处理**：
    *   **OCR 提取**：快速识别并复制网页图片或截图中的文字。
    *   **截图翻译**：框选区域，AI 会自动提取文字并完成翻译。
    *   **图像分析**：让 AI 为你描述图片细节或进行深度解读。
*   **🤖 浏览器控制 (MCP)**：模型可以通过指令操作浏览器（如：打开新标签页、自动填写表单、获取网页内容、执行 JS 脚本）。
*   **⚙️ 账号轮询系统**：支持配置多个 Google 账号索引，自动轮询以突破频率限制，保证使用顺畅。
*   **🧪 安全渲染**：在独立的 Sandbox 环境中进行 Markdown、KaTeX 数学公式和代码高亮渲染，安全且高效。

---

## ❤️ 赞助与支持

如果您觉得 Gemini Nexus 帮助到了您，并希望支持该项目的持续维护与功能开发，欢迎通过 **爱发电** 请开发者喝杯咖啡！您的支持是我不断优化功能的最大动力。☕

<div align="center">
  <a href="https://afdian.com/a/yeahhe" target="_blank">
    <img src="https://github.com/user-attachments/assets/1a9d6576-0541-453d-ae58-43bb71d73f91" width="220" alt="爱发电赞赏码">
  </a>
  <p><b>扫码通过“爱发电”支持我</b></p>
</div>

---

## 🏗️ 技术架构

*   **Side Panel**：主要的聊天和交互界面 (`sidepanel/`)。
*   **Sandbox**：安全的 iframe 环境，负责 Markdown 转换和 UI 渲染逻辑 (`sandbox/`)。
*   **Content Scripts**：注入到网页中的脚本，负责悬浮工具栏、划词监听和页面交互 (`content/`)。
*   **Background**：插件的“大脑”，负责 API 通信、会话管理、账号轮询和自动化控制 (`background/`)。

## 🛠️ 本地开发

**前提条件：** 需安装 Node.js (建议 v18+)

1.  **安装依赖：**
    ```bash
    npm install
    ```

2.  **构建项目：**
    ```bash
    npm run build
    ```

3.  **加载插件：**
    *   打开 Chrome 浏览器，访问 `chrome://extensions/`。
    *   开启右上角的“开发者模式”。
    *   点击“加载已解压的扩展程序”，选择项目根目录（或 `dist` 目录）。

## 📄 许可证

本项目基于 **MIT License** 开源。
