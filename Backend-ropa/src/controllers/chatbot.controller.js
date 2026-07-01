import { chatbotResponse } from "../models/chatbot.model.js";

export const askChatbot = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await chatbotResponse(message);

    res.json({
      reply: response,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "Ocurrió un error.",
    });
  }
};
