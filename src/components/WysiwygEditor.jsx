import React, { useEffect, useRef } from "react";
import Quill from "quill";
import { useTheme } from "../contexts/ThemeContext";

const WysiwygEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (editorRef.current) {
      // Prevent multiple initializations
      if (quillRef.current) return;

      const toolbarOptions = [
        ["bold", "italic", "underline", "link"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ];

      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      });

      const quill = quillRef.current;

      // Set initial only if empty
      if (value && !quill.root.innerHTML) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      quill.on("text-change", (delta, oldDelta, source) => {
        if (source === "user") {
          onChange(quill.root.innerHTML);
        }
      });
    }

    // Cleanup
    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  // Update editor content if value prop changes from outside
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      const currentSelection = quillRef.current.getSelection();
      quillRef.current.clipboard.dangerouslyPasteHTML(value);
      if (currentSelection) {
        // Restore cursor position after update
        setTimeout(
          () =>
            quillRef.current.setSelection(
              currentSelection.index,
              currentSelection.length
            ),
          0
        );
      }
    }
  }, [value]);

  return (
    <div className={`wysiwyg-container mt-1 ${theme}`}>
      <div ref={editorRef} />
      {/* FIX: Replaced non-standard `style jsx global` with a standard style tag for React. */}
      <style>{`
        .wysiwyg-container .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border-color: #d1d5db; /* gray-300 */
        }
        .wysiwyg-container .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          border-color: #d1d5db; /* gray-300 */
          min-height: 200px;
          font-size: 1rem;
        }
        .wysiwyg-container .ql-editor {
          color: #111827; /* gray-900 */
        }
        /* Dark Theme Styles */
        .wysiwyg-container.dark .ql-toolbar {
          border-color: #4b5563; /* gray-600 */
        }
         .wysiwyg-container.dark .ql-stroke {
          stroke: #d1d5db; /* gray-300 */
        }
        .wysiwyg-container.dark .ql-picker-label {
          color: #d1d5db; /* gray-300 */
        }
        .wysiwyg-container.dark .ql-container {
          border-color: #4b5563; /* gray-600 */
          background-color: #374151; /* gray-700 */
        }
        .wysiwyg-container.dark .ql-editor {
          color: #f9fafb; /* gray-50 */
        }
         .wysiwyg-container.dark .ql-editor.ql-blank::before {
          color: rgba(209, 213, 219, 0.5);
        }
      `}</style>
    </div>
  );
};

export default WysiwygEditor;
