"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

const theme = {
    paragraph: "py-1",
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline underline-offset-2", // <-- this is key
    },
};

function LoadSerializedContent({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!content) return;
    try {
      const parsedState = JSON.parse(content);
      const newEditorState = editor.parseEditorState(parsedState);
      editor.setEditorState(newEditorState);
    //   console.log("[🧩 RichTextPreview] editor state set:", parsedState);
    } catch (err) {
      console.error("🛑 Failed to parse editor state:", err);
    }
  }, [editor, content]);

  return null;
}

export default function RichTextPreview({ content }: { content: string }) {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: "FormPreview",
        editable: false,
        editorState: null, // we'll set it manually later
        theme,
        onError: (e) => console.error(e),
      }}
    >
      <LoadSerializedContent content={content} />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="min-h-[100px] outline-none p-2" />
        }
        placeholder={<p className="text-gray-400">No description added.</p>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
}
