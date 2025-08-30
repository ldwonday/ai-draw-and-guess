import { NextRequest } from 'next/server';

// 用于存储 API 密钥的环境变量
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function POST(request: NextRequest) {
  // 检查是否提供了 API 密钥
  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Gemini API key is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 获取上传的图片数据
    const arrayBuffer = await request.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    // 构建 Gemini API 请求体
    const requestBody = {
      contents: [{
        parts: [
          {
            text: "你是一个精通画画识别的AI助手。请仔细观察这幅画，告诉我画的是什么具体的事物或概念。请用中文回答，只说出你认为最可能的答案，不要解释，不要使用'这看起来像'这样的表述。如果完全无法识别，请回答'无法识别'。"
          },
          {
            inline_data: {
              mime_type: "image/png",
              data: base64Image
            }
          }
        ]
      }]
    };

    // 调用 Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // 检查 API 响应状态
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${response.status}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 解析 API 响应
    const data = await response.json();
    
    // 提取 AI 的回答
    const guess = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '无法识别';
    
    // 返回结果
    return new Response(
      JSON.stringify({ guess }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing image:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process image' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}