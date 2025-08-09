import { useEffect } from "react";

export const usePDFTextSelection = (numPages: number, scale: number) => {
  // Enhanced text selection CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "pdf-text-selection-enhanced";
    style.textContent = `
      /* PDF Document Container */
      .react-pdf__Document {
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
      }

      /* PDF Page Container */
      .react-pdf__Page {
        position: relative !important;
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        margin-bottom: 8px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
      }

      /* Canvas Layer - Make it non-interactive */
      .react-pdf__Page__canvas {
        position: relative !important;
        z-index: 1 !important;
        pointer-events: none !important;
        display: block !important;
      }

      /* Text Layer - Make it interactive and selectable */
      .react-pdf__Page__textContent {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 10 !important;
        pointer-events: auto !important;
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        overflow: hidden !important;
      }

      /* Text Spans - Individual text elements */
      .react-pdf__Page__textContent span {
        position: absolute !important;
        color: transparent !important;
        cursor: text !important;
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        pointer-events: auto !important;
        white-space: pre !important;
        transform-origin: 0% 0% !important;
        line-height: 1 !important;
        font-family: sans-serif !important;
        /* Ensure spans can be selected */
        -webkit-touch-callout: text !important;
        -webkit-user-drag: none !important;
        -khtml-user-select: text !important;
      }

      /* Selection Highlighting - Make it more visible */
      .react-pdf__Page__textContent span::selection {
        background-color: #3f51b5 !important;
        color: white !important;
        opacity: 0.7 !important;
      }

      .react-pdf__Page__textContent span::-moz-selection {
        background-color: #3f51b5 !important;
        color: white !important;
        opacity: 0.7 !important;
      }

      /* Alternative selection highlighting for better visibility */
      .react-pdf__Page__textContent::selection {
        background-color: #3f51b5 !important;
        color: white !important;
        opacity: 0.7 !important;
      }

      .react-pdf__Page__textContent::-moz-selection {
        background-color: #3f51b5 !important;
        color: white !important;
        opacity: 0.7 !important;
      }

      /* Annotation Layer - Keep it below text */
      .react-pdf__Page__annotations {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 5 !important;
        pointer-events: none !important;
      }
    `;

    document.head.appendChild(style);

    // Enable text selection globally
    document.onselectstart = null;
    document.onmousedown = null;

    // Remove any selection prevention from body
    const bodyStyle = document.body.style as any;
    bodyStyle.userSelect = "text";
    bodyStyle.webkitUserSelect = "text";
    bodyStyle.mozUserSelect = "text";
    bodyStyle.msUserSelect = "text";

    return () => {
      const existingStyle = document.getElementById(
        "pdf-text-selection-enhanced"
      );
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  // Enhanced text selection enabler after pages load
  useEffect(() => {
    if (numPages > 0) {
      const enableTextSelection = () => {
        // Wait for pages to render
        setTimeout(() => {
          const pages = document.querySelectorAll(".react-pdf__Page");
          pages.forEach((page, pageIndex) => {
            const textContent = page.querySelector(
              ".react-pdf__Page__textContent"
            );
            const canvas = page.querySelector(".react-pdf__Page__canvas");

            if (textContent) {
              const textElement = textContent as HTMLElement;

              // Force enable text selection on text layer - preserve PDF.js positioning
              const textStyle = textElement.style as any;
              textStyle.display = "block"; // Override display: none
              textStyle.zIndex = "999";
              textStyle.pointerEvents = "auto";
              textStyle.userSelect = "text";
              textStyle.webkitUserSelect = "text";
              textStyle.mozUserSelect = "text";
              textStyle.msUserSelect = "text";
              textStyle.webkitTouchCallout = "default";
              textStyle.webkitUserDrag = "none";
              textStyle.khtmlUserSelect = "text";

              // Enable selection on text spans - preserve PDF.js positioning and transforms
              const spans = textElement.querySelectorAll("span");
              spans.forEach((span, spanIndex) => {
                const spanElement = span as HTMLElement;
                const spanStyle = spanElement.style as any;

                // Only modify selection-related styles, preserve positioning
                spanStyle.color = "rgba(0,0,0,0.01)";
                spanStyle.cursor = "text";
                spanStyle.userSelect = "text";
                spanStyle.webkitUserSelect = "text";
                spanStyle.mozUserSelect = "text";
                spanStyle.msUserSelect = "text";
                spanStyle.pointerEvents = "auto";
                spanStyle.webkitTouchCallout = "default";
                spanStyle.webkitUserDrag = "none";
                spanStyle.khtmlUserSelect = "text";
                spanStyle.zIndex = "1000";

                // Add data attributes for debugging
                spanElement.setAttribute("data-page", pageIndex.toString());
                spanElement.setAttribute("data-span", spanIndex.toString());
              });
            }

            if (canvas) {
              const canvasElement = canvas as HTMLElement;
              canvasElement.style.pointerEvents = "none";
              canvasElement.style.zIndex = "1";
            }
          });
        }, 100);
      };

      enableTextSelection();

      // Re-enable after scale changes and periodically
      const interval = setInterval(enableTextSelection, 1000);

      return () => clearInterval(interval);
    }
  }, [numPages, scale]);
};
