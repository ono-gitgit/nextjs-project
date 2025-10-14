import React from "react";
import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, any>(
  ({ className, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const combinedRef = (node: HTMLTextAreaElement) => {
      textareaRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const resize = () => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto"; // 高さを一度リセット
      el.style.height = `${el.scrollHeight}px`; // 内容に応じて高さ設定
    };

    useEffect(() => {
      resize(); // 初期化時もリサイズ
    }, []);

    return (
      <textarea
        {...props}
        ref={combinedRef}
        onInput={resize}
        className={`${className} transition-all duration-150`}
      />
    );
  }
);
AutoResizeTextarea.displayName = "AutoResizeTextarea";
