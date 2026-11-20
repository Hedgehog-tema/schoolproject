import { useEffect } from "react";

// Fullscreen image overlay. Close by clicking the backdrop, the × button, or Escape.
export default function Lightbox({ image, onClose }) {
  useEffect(() => {
    if (!image) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    // Prevent the page from scrolling behind the overlay while it's open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Sulje">
        ×
      </button>
      <img
        src={image.src}
        alt={image.alt || ""}
        className="lightbox-image"
        onClick={(e) => e.stopPropagation()}
      />
      {image.caption && (
        <p className="lightbox-caption" onClick={(e) => e.stopPropagation()}>
          {image.caption}
        </p>
      )}
    </div>
  );
}
