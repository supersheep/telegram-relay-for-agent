# 登记到 Notion 项目表

若 Notion MCP 已启用，可调用 `notion-create-pages` 写入「项目」数据库：

```json
{
  "parent": { "type": "data_source_id", "data_source_id": "d50a9067-2a29-401d-b113-921b2e2dfc26" },
  "pages": [{
    "properties": {
      "项目名称": "Telegram Relay for Agent",
      "GitHub": "https://github.com/supersheep/telegram-relay-for-agent",
      "描述": "Telegram relay bot for Cursor Cloud Agent - receives files/videos and saves to ~/.telegram-relay/uploads/<project>/"
    }
  }]
}
```

或手动在 [Notion 项目表](https://www.notion.so/ab17dd5a390a46ca8aba600b76dd86ae) 新增一行：

| 项目名称 | GitHub | 描述 |
|----------|--------|------|
| Telegram Relay for Agent | https://github.com/supersheep/telegram-relay-for-agent | Telegram relay bot for Cursor Cloud Agent - receives files/videos and saves to ~/.telegram-relay/uploads/<project>/ |
