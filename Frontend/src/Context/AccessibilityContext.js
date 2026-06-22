import { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(0);     // 0=normal 1=grande 2=muy grande
  const [contrast, setContrast] = useState(0);     // 0=normal 1=alto 2=invertido
  const [cursorLarge, setCursorLarge] = useState(false);
  const [dyslexia, setDyslexia] = useState(false);
  const [readingMask, setReadingMask] = useState(false);
  const [lineHeight, setLineHeight] = useState(0); // 0=normal 1=amplio 2=muy amplio

  useEffect(() => {
    const sizes = ["", "120%", "145%"];
    document.documentElement.style.fontSize = sizes[fontSize];
  }, [fontSize]);

  useEffect(() => {
    const filters = ["", "contrast(1.6)", "invert(1) hue-rotate(180deg)"];
    document.documentElement.style.filter = filters[contrast];
  }, [contrast]);

  useEffect(() => {
    const heights = ["", "1.8", "2.5"];
    document.body.style.lineHeight = heights[lineHeight];
  }, [lineHeight]);

  useEffect(() => {
    if (dyslexia) {
      document.body.style.fontFamily = "'Lexend', Arial, sans-serif";
      document.body.style.letterSpacing = "0.07em";
      document.body.style.wordSpacing = "0.16em";
    } else {
      document.body.style.fontFamily = "";
      document.body.style.letterSpacing = "";
      document.body.style.wordSpacing = "";
    }
  }, [dyslexia]);

  useEffect(() => {
    document.body.classList.toggle("acc-cursor-large", cursorLarge);
  }, [cursorLarge]);

  const reset = () => {
    setFontSize(0);
    setContrast(0);
    setCursorLarge(false);
    setDyslexia(false);
    setReadingMask(false);
    setLineHeight(0);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize, setFontSize,
        contrast, setContrast,
        cursorLarge, setCursorLarge,
        dyslexia, setDyslexia,
        readingMask, setReadingMask,
        lineHeight, setLineHeight,
        reset,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
