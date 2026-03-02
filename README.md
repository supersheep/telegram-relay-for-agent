# Telegram Relay for Cursor Cloud Agent

轻量级 Telegram 中转 Bot，用于 Cursor Cloud Agent：在 Telegram 上传文件/视频，自动保存到本地目录，Agent 可直接读取。

## 功能

- 接收 Telegram 中的 document、video、photo、audio、voice
- 保存到 `~/.telegram-relay/uploads/<project>/` 目录（不落盘到项目内）
- 支持按 Chat ID 限制来源（可选）
- 配置通过环境变量，适配 Cursor Cloud Agent Secrets

## 快速开始

### 方式一：全局安装（推荐）

```bash
npm install -g github:supersheep/telegram-relay-for-agent
export TELEGRAM_BOT_TOKEN="你的Bot Token"
export TELEGRAM_CHAT_ID="你的Chat ID"  # 可选
cd /path/to/你的项目  # 文件会保存到 ~/.telegram-relay/uploads/<项目名>/
telegram-relay-for-agent
```

### 方式二：本地运行

```bash
git clone git@github.com:supersheep/telegram-relay-for-agent && cd telegram-relay-for-agent
npm install
export TELEGRAM_BOT_TOKEN="你的Bot Token"
npm start
```

## 与 Cursor Cloud Agent 集成

**推荐方式**：装到机器全局，不 clone、不装进项目。把以下项目信息添加到目标项目的 `AGENTS.md`（或 `agent.md`），Agent 会完成全局安装和配置。

将下面「可复制块」整段粘贴到目标项目的 AGENTS.md 末尾即可：

---

### 可复制块（粘贴到目标项目的 AGENTS.md）

````markdown
## Telegram Relay（文件中转）

- **项目**：telegram-relay-for-agent
- **GitHub**：https://github.com/supersheep/telegram-relay-for-agent
- **用途**：在 Telegram 上传文件/视频，自动保存到 `~/.telegram-relay/uploads/<project>/`，不落盘到项目内，Agent 可直接读取

**集成步骤**（由 Agent 执行，装到机器全局）：
1. 在 `.cursor/environment.json` 中配置：
   - `install`：在原有命令后追加 ` && npm install -g github:supersheep/telegram-relay-for-agent`（例如 `npm install && npm install -g github:supersheep/telegram-relay-for-agent`）
   - `terminals`：追加 `{ "name": "Telegram Relay Bot", "command": "telegram-relay-for-agent" }`
2. 在 Cursor Dashboard Secrets 中配置 `TELEGRAM_BOT_TOKEN` 和 `TELEGRAM_CHAT_ID`（用户自行完成）

**文件落盘路径**：`~/.telegram-relay/uploads/<project>/`（`<project>` 为当前工作目录名，可用 `TELEGRAM_RELAY_PROJECT` 覆盖）
````

---

用户还需在 [cursor.com/dashboard?tab=cloud-agents](https://cursor.com/dashboard?tab=cloud-agents) 的 Secrets 中配置 `TELEGRAM_BOT_TOKEN` 和 `TELEGRAM_CHAT_ID`。创建 Bot、获取 Chat ID 等见 [AGENTS.md](./AGENTS.md)。

## 技术栈

- [grammY](https://grammy.dev/) — Telegram Bot 框架（与 OpenClaw 相同）
- Node.js 18+

## License

MIT
