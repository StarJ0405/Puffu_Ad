"use client";
import { fileRequester } from "@/shared/FileRequester";
import useClientEffect from "@/shared/hooks/useClientEffect";
import katex from "katex";
import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";
import {
  DeltaStatic,
  EmitterSource,
  Quill,
  RangeStatic,
} from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// (Keep the dynamic import and type interfaces as they are)
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    const Component = ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
    Component.displayName = "ReactQuill";
    return Component;
  },
  { ssr: false }
);

type Value = string | DeltaStatic;
type Range = RangeStatic | null;
interface Props {
  bounds?: string | HTMLElement;
  children?: React.ReactElement<any>;
  className?: string;
  defaultValue?: Value;
  id?: string;
  onChange?(
    value: string,
    delta: DeltaStatic,
    source: EmitterSource,
    editor: UnprivilegedEditor
  ): void;
  onChangeSelection?(
    selection: Range,
    source: EmitterSource,
    editor: UnprivilegedEditor
  ): void;
  onFocus?(
    selection: Range,
    source: EmitterSource,
    editor: UnprivilegedEditor
  ): void;
  onBlur?(
    previousSelection: Range,
    source: EmitterSource,
    editor: UnprivilegedEditor
  ): void;
  onKeyDown?: React.EventHandler<any>;
  onKeyPress?: React.EventHandler<any>;
  onKeyUp?: React.EventHandler<any>;
  placeholder?: string;
  preserveWhitespace?: boolean;
  readOnly?: boolean;
  style?: React.CSSProperties;
  tabIndex?: number;
  value?: Value;
  path?: string;
}
interface UnprivilegedEditor {
  getLength: Quill["getLength"];
  getText: Quill["getText"];
  getHTML: () => string;
  getSemanticHTML: Quill["getSemanticHTML"];
  getBounds: Quill["getBounds"];
  getSelection: Quill["getSelection"];
  getContents: Quill["getContents"];
}

const Editor = ({ path = "/", ...props }: Props) => {
  const quillRef = useRef<any>(null);

  // 1. Memoize the image upload handler to ensure it's stable
  const imageUploadHandler = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    const response: any = await fileRequester.upload(
      formData,
      (path + `/quill`).replaceAll("//", "/")
    );
    return response.urls?.[0];
  }, []);

  // 2. Toolbar image handler remains the same
  const handleImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input?.files?.[0];
      if (file) {
        const imageUrl = await imageUploadHandler(file);
        if (imageUrl) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", imageUrl, "user");
          quill.setSelection(range.index + 1);
        }
      }
      input.remove();
    };
  }, [imageUploadHandler]);

  // 3. Set up event listeners for paste and drop
  useClientEffect(() => {
    if (window) {
      window.katex = katex as any;
    }
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    const root = editor.root;

    // Paste handler
    const handlePaste = async (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      const items = clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          event.preventDefault(); // Prevent default paste behavior
          const file = items[i].getAsFile();
          if (file) {
            const imageUrl = await imageUploadHandler(file);
            if (imageUrl) {
              const range = editor.getSelection(true);
              editor.insertEmbed(range.index, "image", imageUrl, "user");
              editor.setSelection(range.index + 1);
            }
          }
        }
      }
    };

    // Drop handler
    const handleDrop = async (event: DragEvent) => {
      event.stopPropagation();
      event.preventDefault(); // Prevent default drop behavior (opening file)
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) return;

      const files = dataTransfer.files;
      if (files && files.length > 0) {
        for (const file of Array.from(files)) {
          if (file.type.startsWith("image/")) {
            const imageUrl = await imageUploadHandler(file);
            if (imageUrl) {
              const range = editor.getSelection(true);
              editor.insertEmbed(range.index, "image", imageUrl, "user");
              editor.setSelection(range.index + 1);
            }
          }
        }
      }
    };

    // Prevent default drag-over behavior
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    root.addEventListener("paste", handlePaste, true);
    root.addEventListener("drop", handleDrop, true);
    root.addEventListener("dragover", handleDragOver, true);

    // Cleanup function to remove listeners
    return () => {
      root.removeEventListener("paste", handlePaste, true);
      root.removeEventListener("drop", handleDrop, true);
      root.removeEventListener("dragover", handleDragOver, true);
    };
  }, [imageUploadHandler, quillRef.current]); // Rerun if the handler changes

  const _modules = {
    toolbar: {
      container: [
        [{ header: [false, 2, 1] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "image", "video", "formula"],
      ],
      handlers: {
        image: handleImage,
      },
    },
    // The clipboard module is simplified as we handle paste via a direct event listener
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <ReactQuill
      {...props}
      forwardedRef={quillRef}
      theme="snow"
      modules={_modules}
      className="wrap-quill"
    />
  );
};

export default Editor;
