import { useEffect, useRef, useState } from "react";

export default function AutoFitText({
  text,
  maxWidth,
  maxFontSize = 48,
  minFontSize = 18,
  safetyPadding = 0,
  style = {},
}) {
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    let size = maxFontSize;
    el.style.fontSize = `${size}px`;

    while (el.scrollWidth > maxWidth - safetyPadding && size > minFontSize) {
      size -= 1;
      el.style.fontSize = `${size}px`;
    }

    setFontSize(size);
  }, [text, maxWidth, maxFontSize, minFontSize, safetyPadding]);

  return (
    <div
      ref={textRef}
      style={{
        ...style,
        fontSize: `${fontSize}px`,
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {text}
    </div>
  );
}