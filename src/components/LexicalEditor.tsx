"use client";

import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import {
//   HeadingNode,
//   QuoteNode,
// } from "@lexical/rich-text";

// ✅ Proper Lexical error boundary
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

function Placeholder() {
  return (
    <div className="text-gray-400 absolute pointer-events-none left-3 top-2">
      Enter description...
    </div>
  );
}

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    // Function to update current selection formats
    const updateFormats = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const newFormats = {
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
            underline: selection.hasFormat("underline"),
          };
          setFormats(newFormats);
          console.log("🖋️ Selection formats:", newFormats);
        }
      });
    };

    // Register selection change
    const unregisterSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateFormats();
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    // Register editor updates (e.g. typing, format toggles)
    const unregisterUpdate = editor.registerUpdateListener(() => {
      updateFormats();
    });

    return () => {
      unregisterSelection();
      unregisterUpdate();
    };
  }, [editor]);

  const toggleFormat = (type: "bold" | "italic" | "underline") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
  };

  return (
    <div className="flex space-x-2 mb-2">
      {(["bold", "italic", "underline"] as const).map((format) => (
        <button
          key={format}
          onClick={() => toggleFormat(format)}
          className={`px-2 py-1 border rounded ${
            formats[format] ? "bg-black text-white" : "bg-white"
          }`}
        >
          {format[0].toUpperCase()}
        </button>
      ))}
    </div>
  );
};

const editorConfig = {
  namespace: "FormEditor",
  theme: {
    paragraph: "py-1",
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline underline-offset-2", // <-- this is key
    },
  },
  onError(error: Error) {
    throw error;
  },
  // nodes: [
  //   HeadingNode,
  //   QuoteNode,
  // ],
};

type Props = {
  onChange?: (content: string) => void;
};

export default function RichTextEditor({ onChange }: Props) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Toolbar />
      <div className="relative border rounded min-h-[120px] p-2 bg-white">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none w-full min-h-[100px] px-2 py-1" />
          }
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              const content = JSON.stringify(editorState);
            //   console.log("[📝 RichTextEditor] New description saved:", content);
              onChange?.(content); // send to parent
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
}
