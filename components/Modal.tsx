"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  className = "max-w-md",
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className={`bg-white/95 backdrop-blur-md border border-slate-200 p-8 rounded-none w-full animate-in zoom-in-95 duration-200 ${className}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {title && (
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h2>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}