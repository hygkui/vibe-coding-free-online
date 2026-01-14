# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供在此仓库中工作的指导。

## 项目概述

VuePress 2 文档站点，托管 "Vibe Coding 零基础教程" —— 一个面向初学者的 AI 辅助编程免费开源教程。部署在 GitHub Pages 的 `/vibe-coding-free-online/` 路径下。

## 核心技术栈

- **框架：** VuePress 2.0.0-rc.26 + Vite bundler
- **主题：** @vuepress/theme-default
- **CSS：** sass-embedded
- **内容语言：** 简体中文 (zh-CN)

## 开发命令

```bash
# 启动本地开发服务器（支持热重载）
pnpm docs:dev

# 构建生产环境静态站点
pnpm docs:build
```

CI/CD 流程位于 `.github/workflows/deploy.yml`，推送 master 分支时自动构建并部署到 GitHub Pages。

## 项目结构

- `docs/.vuepress/config.js` - VuePress 配置（基础路径、主题、导航栏、侧边栏）
- `docs/README.md` - 教程首页
- `.github/workflows/deploy.yml` - GitHub Actions 部署流程

## 内容添加指南

教程内容遵循 VuePress Markdown 格式：
- 使用中文导航和内容
- VuePress 默认主题，配置了自定义导航栏和侧边栏
- 部署基础路径：`/vibe-coding-free-online/`
