# Telegram Relay for Cursor Cloud Agent

本项目的 Bot 会在 Cloud Agent 启动时自动运行，接收 Telegram 上传的文件并保存到 `~/.telegram-relay/uploads/<project>/`（不落盘到项目内）。与 Agent 对话时可直接引用该目录下的文件。

## 配置步骤

### 1. 创建 Telegram Bot

1. 在 Telegram 中搜索 `@BotFather`
2. 发送 `/newbot`，按提示创建 Bot，获得 **Bot Token**（形如 `123456:ABC-DEF...`）
3. （可选）私聊你的 Bot 发一条消息，用 `getUpdates` 获取你的 **Chat ID**：
   ```bash
   curl "https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates"
   ```
   返回的 `message.chat.id` 即为 Chat ID

### 2. 配置 Cursor Cloud Agent Secrets

1. 打开 [cursor.com/dashboard?tab=cloud-agents](https://cursor.com/dashboard?tab=cloud-agents)
2. 在 **Secrets** 中添加：
   - `TELEGRAM_BOT_TOKEN`：Bot Token
   - `TELEGRAM_CHAT_ID`：你的 Chat ID（可选，不填则接受所有聊天；建议填写以限制来源）
   - `TELEGRAM_RELAY_PROJECT`：可选，指定落盘子目录名，不填则用当前工作目录名

### 3. 将本项目加入你的 Agent 环境

**推荐**：装到机器全局，不 clone、不装进项目。把项目信息添加到目标项目的 `AGENTS.md`（或 `agent.md`），由 Agent 完成全局安装和配置。

在目标项目的 AGENTS.md 末尾添加以下内容（Agent 读取后会执行）：

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

Secrets 需用户在 Dashboard 中手动添加。

### 4. 使用流程

1. 启动 Cursor Cloud Agent
2. 在 Telegram 中向你的 Bot 发送文件/视频/图片
3. 文件会保存到 `~/.telegram-relay/uploads/<project>/`（`<project>` 为项目目录名）
4. 在 Cursor 中对 Agent 说：「处理一下 ~/.telegram-relay/uploads/<project> 里刚上传的 xxx 文件」

## 文件保存位置

- 默认：`~/.telegram-relay/uploads/<project>/`（`<project>` 为 Bot 进程 cwd 的目录名，可用 `TELEGRAM_RELAY_PROJECT` 覆盖）
- 文件名格式：`原名_时间戳.扩展名`

## 注意事项

- Cloud Agent 每次任务会启动新 VM，任务结束后 VM 销毁，`uploads/` 中的文件也会消失
- 建议配置 `TELEGRAM_CHAT_ID`，避免他人滥用你的 Bot
- Telegram Bot API 单文件最大约 20MB
