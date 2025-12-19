

# 🚀 Gemini Nexus

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Chrome Extension](https://img.shields.io/badge/Manifest_V3-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini_API-8E75FF?style=for-the-badge&logo=googlegemini&logoColor=white)

**基于 Gemini 引擎的下一代浏览器智能增强助手**

[功能特性](#-核心功能) • [技术栈](#-技术架构) • [安装指南](#-安装步骤) • [快捷键](#-默认快捷键)

</div>

---

## ✨ 核心功能

### 1. 📂 多功能侧边栏 (Sidepanel)
*   **全天候陪伴**：点击扩展图标或使用快捷键即可召唤侧边栏，边看网页边聊天。
*   **会话历史**：自动保存所有对话，支持关键词搜索和历史记录管理。
*   **富文本渲染**：完美支持 **Markdown** 表格、代码高亮以及 **LaTeX 数学公式**（KaTeX 驱动）。

### 2. ⚡ 浮动工具栏 (Quick Actions)
*   **划词即用**：在网页上选中文字，立即弹出工具栏。
*   **一键处理**：内置“翻译”、“解释”、“总结”快捷指令。
*   **自由提问**：直接在网页浮窗中提问，结果实时流式输出。

### 3. 📄 网页环境感知 (Page Context)
*   **对话网页**：开启后 Gemini 可读取当前页面文本，帮你总结长文或分析代码。
*   **快速引用**：支持一键引用网页选中文本到对话框。

### 4. 🖼️ 视觉与图像处理 (Visual Intelligence)
*   **OCR 提取**：截图并自动提取图片中的文字。
*   **图像分析**：支持拖拽、粘贴图片给 AI 进行深度解析。
*   **区域截图**：支持选取特定区域（Snip）进行精准提问。

---

## 🛠 技术架构

本项目采用了现代化的前端技术栈，确保扩展的稳定与高性能：

### 核心引擎
| 技术 | 描述 |
| :--- | :--- |
| **Google Gemini API** | 提供强大的多模态大模型理解能力 |
| **Chrome Extension MV3** | 采用最新的浏览器扩展标准，安全且性能卓越 |
| **Sandbox Architecture** | UI 渲染运行在隔离沙盒，确保主程序安全 |

### 前端开发
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat-square&logo=vite&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat-square&logo=css3&logoColor=white)

### 渲染与工具库
![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=flat-square&logo=markdown&logoColor=white)
- **Marked.js**: 高速 Markdown 解析。
- **KaTeX**: 毫秒级的数学公式渲染。
- **Highlight.js**: 自动识别并高亮 100+ 种编程语言。
- **Fuse.js**: 轻量级模糊搜索引擎，用于历史记录检索。

---

## 🚀 安装步骤

1.  **克隆仓库**：
    ```bash
    git clone https://github.com/your-username/gemini-nexus.git
    cd gemini-nexus
    ```
2.  **安装依赖**：
    ```bash
    npm install
    ```
3.  **构建项目**：
    ```bash
    npm run build
    ```
4.  **加载扩展**：
    *   打开 Chrome 访问 `chrome://extensions/`。
    *   开启 **“开发者模式”**。
    *   点击 **“加载已解压的扩展程序”**，选择 `dist` 文件夹或项目根目录。

---

## ⌨️ 默认快捷键

| 功能 | 快捷键 |
| :--- | :--- |
| **快速询问 (网页浮窗)** | `Ctrl + Q` |
| **打开侧边栏** | `Ctrl + P` |
| **打开/关闭扩展** | `Ctrl + Shift + P` |

> *可以在扩展的“设置”面板中自定义这些快捷键。*

---

## 📄 许可

本项目基于 **MIT 协议** 开源。

<div align="center">

**[给个 Star ⭐ 是对我最大的支持！]**

</div>
