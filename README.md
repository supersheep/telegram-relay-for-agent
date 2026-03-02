# Telegram Relay for Cursor Cloud Agent

轻量级 Telegram 中转 Bot，用于 Cursor Cloud Agent：在 Telegram 上传文件/视频，自动保存到本地目录，Agent 可直接读取。

## 功能

- 接收 Telegram 中的 document、video、photo、audio、voice
- 保存到 `./uploads/` 目录
- 支持按 Chat ID 限制来源（可选）
- 配置通过环境变量，适配 Cursor Cloud Agent Secrets

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
export TELEGRAM_BOT_TOKEN="你的Bot Token"
export TELEGRAM_CHAT_ID="你的Chat ID"  # 可选
```

### 3. 运行

```bash
npm start
```

## 与 Cursor Cloud Agent 集成

详见 [AGENTS.md](./AGENTS.md)，包含：

- 如何创建 Bot、获取 Token 和 Chat ID
- 如何在 Cursor Dashboard 配置 Secrets
- 如何将本项目加入 `environment.json` 的 `terminals`
- 使用流程说明

## 技术栈

- [grammY](https://grammy.dev/) — Telegram Bot 框架（与 OpenClaw 相同）
- Node.js 18+

## License

MIT
