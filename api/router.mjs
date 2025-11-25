import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { loadEnvironment } from "./load.mjs";

const app = express();

loadEnvironment();  // 環境変数の読み込み

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  // **APIキーがない場合はサーバーを起動せず、エラーを出して停止**
  console.error("FATAL: OPENAI_API_KEY is not set in the environment.");
  process.exit(1); 
}
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// CORS 設定
// 🌟 修正: 開発用のオリジンを許可するCORS設定
const allowedOrigins = [
  "https://ai-pd.anaito.com",
  "http://localhost:9474", 
  "http://localhost:8844"
];
app.use(cors({
  origin: function (origin, callback) {
    // 許可されたオリジン、またはオリジンがない場合（例: Postmanなど）は許可
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Type"]
}));

app.use(express.json());

// /api/chat エンドポイント
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || !Array.isArray(message) || message.length === 0) {
    return res.status(400).json({ error: 'Invalid message format' });
  }
  
  try {
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const stream = await client.chat.completions.create({
      model: 'gpt-4.1-mini-2025-04-14',
      messages: message,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(content);
      }
    }
    
    res.end();
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    
    // ヘッダーが既に送信されているかチェック
    if (!res.headersSent) {
      res.status(500).json({ error: 'Something went wrong' });
    } else {
      // すでにストリーミングが開始されている場合は、エラーメッセージをストリームで送信
      res.write('\n\n[An error occurred]');
      res.end();
    }
  }
});

const PORT = process.env.API_PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});