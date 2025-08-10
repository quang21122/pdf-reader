import { useEffect } from "react";

export const usePDFTextSelection = (numPages: number, scale: number) => {
  // Simplified text selection enabler
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "pdf-text-selection-enhanced";
    style.textContent = `
      /* Enable text selection on PDF pages */
      .react-pdf__Document {
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
      }

      .react-pdf__Page {
        position: relative !important;
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
      }

      /* Canvas layer should not interfere with text selection */
      .react-pdf__Page__canvas {
        position: relative !important;
        z-index: 1 !important;
        pointer-events: none !important;
      }

      /* Text layer - enable text selection with optimizations */
      .react-pdf__Page__textContent {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 2 !important;
        pointer-events: auto !important;
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        overflow: hidden !important;

        /* Optimize text layer rendering */
        will-change: transform !important;
        transform: translateZ(0) !important;
        -webkit-transform: translateZ(0) !important;
      }

      /* Text spans - optimized for crisp selection */
      .react-pdf__Page__textContent span {
        position: absolute !important;
        color: rgba(0, 0, 0, 0.01) !important; /* Nearly invisible but not fully transparent */
        cursor: text !important;
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        pointer-events: auto !important;
        white-space: pre !important;
        transform-origin: 0% 0% !important;
        line-height: 1 !important;

        /* Font rendering optimizations for crisp text */
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
        font-feature-settings: "kern" 1 !important;

        /* Prevent text distortion during selection */
        backface-visibility: hidden !important;
        -webkit-backface-visibility: hidden !important;
        transform-style: preserve-3d !important;
      }

      /* Clean, crisp selection highlighting */
      .react-pdf__Page__textContent span::selection {
        background-color: #3f51b5 !important; /* Solid blue background */
        color: #ffffff !important; /* White text for maximum contrast */
        text-shadow: none !important; /* Remove any text shadows */
      }

      .react-pdf__Page__textContent span::-moz-selection {
        background-color: #3f51b5 !important;
        color: #ffffff !important;
        text-shadow: none !important;
      }

      /* Alternative selection for better browser compatibility */
      .react-pdf__Page__textContent::selection {
        background-color: #3f51b5 !important;
        color: #ffffff !important;
        text-shadow: none !important;
      }

      .react-pdf__Page__textContent::-moz-selection {
        background-color: #3f51b5 !important;
        color: #ffffff !important;
        text-shadow: none !important;
      }

      /* Annotation layer - keep above text but allow text selection underneath */
      .react-pdf__Page__annotations {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 10 !important;
        pointer-events: none !important; /* Allow text selection through */
      }

      /* Only enable pointer events on actual annotations */
      .react-pdf__Page__annotations .linkAnnotation {
        pointer-events: auto !important;
      }

      .react-pdf__Page__annotations .linkAnnotation > a {
        display: block !important;
        cursor: pointer !important;
        pointer-events: auto !important;
        text-decoration: none !important;
        background-color: transparent !important;
        background: transparent !important;
      }

      /* Remove hover background for links - force transparent background */
      .react-pdf__Page__annotations .linkAnnotation > a:hover,
      .react-pdf__Page__annotations .linkAnnotation > a:focus,
      .react-pdf__Page__annotations .linkAnnotation > a:active {
        background-color: transparent !important;
        background: transparent !important;
        box-shadow: none !important;
        outline: none !important;
      }

      /* Also target the linkAnnotation container itself */
      .react-pdf__Page__annotations .linkAnnotation {
        background-color: transparent !important;
        background: transparent !important;
      }

      .react-pdf__Page__annotations .linkAnnotation:hover {
        background-color: transparent !important;
        background: transparent !important;
      }

      /* Zoom-level optimizations for crisp text at all scales */
      .react-pdf__Page[data-scale] .react-pdf__Page__textContent span {
        image-rendering: -webkit-optimize-contrast !important;
        image-rendering: crisp-edges !important;
        image-rendering: pixelated !important;
      }

      /* High DPI display optimizations */
      @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        .react-pdf__Page__textContent span {
          -webkit-font-smoothing: subpixel-antialiased !important;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(
        "pdf-text-selection-enhanced"
      );
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [numPages]);

  // Enhanced text layer enabler for crisp rendering
  useEffect(() => {
    if (numPages > 0) {
      const enableTextSelection = () => {
        setTimeout(() => {
          const pages = document.querySelectorAll(".react-pdf__Page");
          pages.forEach((page) => {
            const textContent = page.querySelector(
              ".react-pdf__Page__textContent"
            );

            if (textContent) {
              const textElement = textContent as HTMLElement;

              // Ensure text layer is visible and selectable
              textElement.style.display = "block";
              textElement.style.pointerEvents = "auto";
              textElement.style.userSelect = "text";

              // Apply crisp rendering optimizations
              (textElement.style as any).webkitFontSmoothing = "antialiased";
              (textElement.style as any).mozOsxFontSmoothing = "grayscale";
              textElement.style.textRendering = "optimizeLegibility";

              // Optimize text spans for better selection
              const spans = textElement.querySelectorAll("span");
              spans.forEach((span) => {
                const spanElement = span as HTMLElement;
                (spanElement.style as any).webkitFontSmoothing = "antialiased";
                (spanElement.style as any).mozOsxFontSmoothing = "grayscale";
                spanElement.style.textRendering = "optimizeLegibility";
                (spanElement.style as any).backfaceVisibility = "hidden";
              });
            }
          });
        }, 100);
      };

      enableTextSelection();

      // Re-enable after scale changes with longer delay for zoom operations
      const timeout = setTimeout(enableTextSelection, 800);

      return () => clearTimeout(timeout);
    }
  }, [numPages, scale]);
};
