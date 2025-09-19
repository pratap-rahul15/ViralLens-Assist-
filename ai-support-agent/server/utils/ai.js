const axios = require("axios");

async function sendToOpenRouter(message) {

  // Load API key from environment variable
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) throw new Error("OpenRouter API key missing");

  const url =
    process.env.OPENROUTER_URL ||
    "https://openrouter.ai/api/v1/chat/completions";
  const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

  const body = {
    model,
    messages: [
      {
        role: "system",
        content: "You are a helpful AI customer support assistant.",
      },
      { role: "user", content: message },
    ],
  };

  const resp = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });

  try {
    if (resp.data?.choices?.length) {

      if (resp.data.choices[0].message?.content)

        return resp.data.choices[0].message.content;

      if (resp.data.choices[0].text) return resp.data.choices[0].text;

    }
    if (resp.data?.output?.[0]?.content?.[0]?.text)

      return resp.data.output[0].content[0].text;

    if (typeof resp.data === "string") return resp.data;

  } catch (e) {

    console.error(" Error parsing OpenRouter response:", e.message);

  }

  return " No reply from the AI";

}

async function sendToHuggingFace(message) {

  const apiKey = process.env.HUGGINGFACE_API_KEY;

  const model = process.env.HUGGINGFACE_MODEL;

  if (!apiKey || !model)

    throw new Error("Hugging Face API key or model missing");

  const url = `https://api-inference.huggingface.co/models/${model}`;

  const resp = await axios.post(
    url,
    { inputs: message },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    }
  );

  if (Array.isArray(resp.data) && resp.data[0]?.generated_text)

    return resp.data[0].generated_text;

  if (resp.data?.generated_text) return resp.data.generated_text;

  if (typeof resp.data === "string") return resp.data;

  return " No reply from the AI";
  
}

module.exports = { sendToOpenRouter, sendToHuggingFace };
