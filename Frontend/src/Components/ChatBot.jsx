import { useState, useEffect, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { getProducts } from "../Services/Api";

function ChatBot() {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "¡Hola! 👋 Soy el asistente virtual de la tienda. ¿En qué puedo ayudarte?",
      time: getCurrentTime(),
    },
  ]);

  const [input, setInput] = useState("");
  const [products, setProducts] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProducts();

      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];

      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const cleanQuestion = (text) => {
    const stopWords = [
      "hola",
      "quiero",
      "busco",
      "tienen",
      "tienes",
      "mostrar",
      "muestrame",
      "muéstrame",
      "necesito",
      "dame",
      "por",
      "favor",
      "hay",
      "algún",
      "alguna",
      "unos",
      "unas",
      "el",
      "la",
      "los",
      "las",
      "de",
      "un",
      "una",
      "me",
      "que",
      "qué",
    ];

    return text
      .toLowerCase()
      .split(" ")
      .filter((word) => !stopWords.includes(word))
      .join(" ");
  };

  const searchProducts = (keyword) => {
    if (!keyword) return [];

    return products.filter((product) => {
      return (
        (product.nombre || "").toLowerCase().includes(keyword) ||
        (product.categoria || "").toLowerCase().includes(keyword)
      );
    });
  };

  const searchByPrice = (maxPrice) => {
    return products.filter((p) => Number(p.precio) <= maxPrice);
  };

  const searchAvailable = () => {
    return products.filter((p) => p.stock > 0);
  };

  const recommendProducts = () => {
    return [...products].sort((a, b) => b.stock - a.stock).slice(0, 5);
  };

  const getBotResponse = (text) => {
    const question = text.toLowerCase();

    if (question.includes("hola") || question.includes("buenas")) {
      return "¡Hola! 😊 ¿Cómo puedo ayudarte?";
    }

    if (question.includes("envío") || question.includes("envio")) {
      return "Realizamos envíos a todo el Perú.";
    }

    if (question.includes("pago")) {
      return "Aceptamos Visa, Mastercard y Yape.";
    }

    if (question.includes("devolución") || question.includes("devolucion")) {
      return "Puedes devolver un producto dentro de los primeros 7 días.";
    }

    if (question.includes("gracias")) {
      return "¡Con gusto! 😊";
    }

    if (
      question.includes("barato") ||
      question.includes("económico") ||
      question.includes("economico")
    ) {
      const baratos = searchByPrice(100);

      if (baratos.length === 0) {
        return "No encontré productos económicos.";
      }

      return (
        "Estos productos cuestan menos de S/.100:\n\n" +
        baratos
          .map((p) => `• ${p.nombre}\nS/. ${Number(p.precio).toFixed(2)}`)
          .join("\n\n")
      );
    }

    if (question.includes("stock") || question.includes("disponible")) {
      const disponibles = searchAvailable();

      return (
        `Actualmente hay ${disponibles.length} productos disponibles.\n\n` +
        disponibles
          .slice(0, 5)
          .map((p) => `• ${p.nombre}`)
          .join("\n")
      );
    }

    if (
      question.includes("recomienda") ||
      question.includes("recomendación") ||
      question.includes("recomendacion")
    ) {
      const recomendados = recommendProducts();

      return (
        "Te recomiendo estos productos:\n\n" +
        recomendados
          .map((p) => `⭐ ${p.nombre}\nS/. ${Number(p.precio).toFixed(2)}`)
          .join("\n\n")
      );
    }

    const keyword = cleanQuestion(question);

    const foundProducts = searchProducts(keyword);

    if (foundProducts.length > 0) {
      return (
        "Encontré estos productos:\n\n" +
        foundProducts
          .slice(0, 5)
          .map(
            (p) =>
              `• ${p.nombre}\nS/. ${Number(p.precio).toFixed(
                2,
              )}\nStock: ${p.stock}`,
          )
          .join("\n\n")
      );
    }

    return "Lo siento, no encontré productos relacionados con tu búsqueda 😕";
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userText,
        time: getCurrentTime(),
      },
    ]);

    setInput("");

    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: getBotResponse(userText),
        time: getCurrentTime(),
      },
    ]);

    setIsTyping(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="dark"
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "26px",
          zIndex: 9999,
        }}
      >
        🤖
      </Button>
    );
  }

  return (
    <Card
      style={{
        width: "380px",
        position: "fixed",
        bottom: "20px",
        left: "20px",
        right: "auto",
        zIndex: 9999,
        borderRadius: "15px",
        boxShadow: "0 8px 25px rgba(0,0,0,.2)",
      }}
    >
      <Card.Header className="fw-bold d-flex justify-content-between align-items-center">
        <span>🤖 Asistente Virtual</span>

        <Button
          variant="outline-dark"
          size="sm"
          onClick={() => setIsOpen(false)}
          style={{
            padding: "2px 8px",
            lineHeight: "1",
          }}
        >
          ✕
        </Button>
      </Card.Header>

      <Card.Body
        style={{
          height: "350px",
          overflowY: "auto",
          overflowX: "hidden",
          whiteSpace: "pre-wrap",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 ${
              msg.sender === "user" ? "text-end" : "text-start"
            }`}
          >
            <span
              className={`badge ${
                msg.sender === "user" ? "bg-primary" : "bg-secondary"
              }`}
              style={{
                padding: "10px 14px",
                fontSize: "14px",
                maxWidth: "90%",
                display: "inline-block",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                textAlign: "left",
              }}
            >
              {msg.text}
              <div
                style={{
                  fontSize: "11px",
                  color: "#888",
                  marginTop: "4px",
                }}
              >
                {msg.time}
              </div>
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="text-start mb-3">
            <span className="badge bg-secondary">Escribiendo...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </Card.Body>

      <Card.Footer>
        <Form.Control
          placeholder="Escribe tu pregunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <Button
          className="mt-2 w-100"
          variant="dark"
          onClick={sendMessage}
          disabled={isTyping}
        >
          {isTyping ? "Respondiendo..." : "Enviar"}
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default ChatBot;
