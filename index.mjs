#!/usr/bin/env node
/**
 * Telegram Relay Bot for Cursor Cloud Agent
 *
 * Receives files/videos/photos from Telegram and saves them to ./uploads/
 * Configure via env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (optional, for access control)
 */

import { Bot } from "grammy";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = "./uploads";
const token = process.env.TELEGRAM_BOT_TOKEN;
const allowedChatId = process.env.TELEGRAM_CHAT_ID
  ? String(process.env.TELEGRAM_CHAT_ID).trim()
  : null;

if (!token) {
  console.error(
    "[telegram-relay] TELEGRAM_BOT_TOKEN is required. Add it in Cursor Dashboard → Secrets."
  );
  process.exit(1);
}

await mkdir(UPLOAD_DIR, { recursive: true });

const bot = new Bot(token);

function getFileId(msg) {
  if (msg.document) return { id: msg.document.file_id, name: msg.document.file_name };
  if (msg.video) return { id: msg.video.file_id, name: msg.video.file_name || `video_${Date.now()}.mp4` };
  if (msg.photo) return { id: msg.photo[msg.photo.length - 1].file_id, name: `photo_${Date.now()}.jpg` };
  if (msg.audio) return { id: msg.audio.file_id, name: msg.audio.file_name || `audio_${Date.now()}.mp3` };
  if (msg.voice) return { id: msg.voice.file_id, name: `voice_${Date.now()}.ogg` };
  return null;
}

function sanitizeFilename(name) {
  if (!name || typeof name !== "string") return `file_${Date.now()}`;
  const safe = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
  return safe || `file_${Date.now()}`;
}

bot.on("message", async (ctx) => {
  const chatId = ctx.chat?.id;
  if (allowedChatId && String(chatId) !== allowedChatId) {
    return; // ignore messages from other chats
  }

  const fileInfo = getFileId(ctx.message);
  if (!fileInfo) {
    return; // text-only, no file
  }

  try {
    const file = await ctx.api.getFile(fileInfo.id);
    const ext = fileInfo.name ? (fileInfo.name.match(/\.[^.]+$/) || [""])[0] : "";
    const base = sanitizeFilename(fileInfo.name).replace(/\.[^.]+$/, "") || `file_${Date.now()}`;
    const filename = `${base}_${Date.now()}${ext}`;
    const destPath = join(UPLOAD_DIR, filename);

    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    const buffer = await res.arrayBuffer();
    await writeFile(destPath, Buffer.from(buffer));

    await ctx.reply(`✅ 已保存到 \`${destPath}\`，Agent 可直接读取。`);
  } catch (err) {
    console.error("[telegram-relay] Download error:", err);
    await ctx.reply(`❌ 保存失败: ${err.message}`);
  }
});

bot.catch((err) => {
  console.error("[telegram-relay] Bot error:", err);
});

console.log("[telegram-relay] Starting... (uploads → ./uploads/)");
await bot.start();
