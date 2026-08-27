import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";

const useAiChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("gemini");

  const { userData, currentCity, itemsInMyCity } = useSelector(
    (state) => state.user
  );

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: "user", content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const context = {
        city: currentCity,
        userName: userData?.fullname,
        availableItems: itemsInMyCity?.map((item) => ({
          name: item.name,
          price: item.price,
          category: item.category,
          foodType: item.foodType,
        })) || [],
      };

      const result = await axios.post(
        `${serverUrl}/api/ai/chat`,
        {
          message: text,
          role: userData?.role || "user",
          provider: selectedProvider,
          context,
        },
        { withCredentials: true }
      );

      const aiMessage = {
        role: "assistant",
        content: result.data.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log("AI chat error:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again later.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const addMessage = (role, content) => {
    const newMessage = { role, content, timestamp: Date.now() };
    setMessages((prev) => [...prev, newMessage]);
  };

  return {
    messages,
    isLoading,
    selectedProvider,
    setSelectedProvider,
    sendMessage,
    clearChat,
    addMessage,
  };
};

export default useAiChat;
