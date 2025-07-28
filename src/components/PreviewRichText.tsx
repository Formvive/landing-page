"use client";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

// Lexical Error Boundary fallback
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

function ReadOnlyContent({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!content) return;
    try {
      const editorState = editor.parseEditorState(content);
      editor.setEditorState(editorState);
    } catch (err) {
      console.error("Failed to parse editor state in preview:", err);
    }
  }, [content, editor]);

  return (
    <RichTextPlugin
      contentEditable={
        <ContentEditable className="outline-none prose dark:prose-invert" />
      }
      placeholder={null}
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
}

export default function PreviewRichText({ content }: { content: string }) {
  const config = {
    namespace: "PreviewEditor",
    editable: false,
    theme: {},
    onError: (e: Error) => console.error("Lexical error:", e),
  };

  return (
    <LexicalComposer initialConfig={config}>
      <ReadOnlyContent content={content} />
      <HistoryPlugin />
    </LexicalComposer>
  );
}
