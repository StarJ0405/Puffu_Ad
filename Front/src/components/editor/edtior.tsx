"use client";
import { fileRequester } from "@/shared/FileRequester";
import useClientEffect from "@/shared/hooks/useClientEffect";
import clsx from "clsx";
import katex from "katex";
import dynamic from "next/dynamic";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  DeltaStatic,
  EmitterSource,
  Quill,
  RangeStatic,
} from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import LoadingSpinner from "../loading/LoadingSpinner";
export const FontWhitelist = [
  "Pretendard",
  "NotoSans",
  "NanumBarunGothic",
  "BrushFont",
  "NanumGothic",
  "NanumHuman",
  "NanumMyeongjo",
  "NanumPen",
  "NanumSqaureNeo",
  "Sacheon",
];
// (Keep the dynamic import and type interfaces as they are)
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");

    //add-on
    const { default: FontSizeAddOn } = await import(
      "./add-on/font-size/add-on"
    );
    FontSizeAddOn.register(RQ);
    const { default: TextFormAddOn } = await import("./add-on/textform/add-on");
    TextFormAddOn.register(RQ);
    const { default: BoxformAddOn } = await import("./add-on/boxform/add-on");
    BoxformAddOn.register(RQ);
    const { default: SignformAddOn } = await import("./add-on/signform/add-on");
    SignformAddOn.register(RQ);

    // 폰트
    const Font: any = RQ.Quill.import("attributors/class/font");
    Font.whitelist = FontWhitelist;
    RQ.Quill.register(Font, true);
    const Component = ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );

    const Size: any = RQ.Quill.import("attributors/style/size");
    // 폰트사이즈
    Size.whitelist = Array.from({
      length: FontSizeAddOn.max - FontSizeAddOn.min + 1,
    }).map((_, index) => `${index + 1}px`);
    RQ.Quill.register(Size, true);

    Component.displayName = "ReactQuill";
    return Component;
  },
  {
    ssr: false,
    loading: () => <LoadingSpinner id="ql-loader" />,
  }
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
  container?: Record<string, any>;
  modules?: Record<string, any>;
  type?: "a4";
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
const Editor = forwardRef(
  (
    {
      path = "/",
      // container = [
      //   [{ header: [false, 2, 1] }],
      //   [{ size: ["small", false, "large", "huge"] }],
      //   ["bold", "italic", "underline", "strike"],
      //   ["blockquote", "code-block"],
      //   [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      //   [{ script: "sub" }, { script: "super" }],
      //   [{ indent: "-1" }, { indent: "+1" }],
      //   [{ color: [] }, { background: [] }],
      //   [{ align: [] }],
      //   ["link", "image", "video", "formula"],
      // ],
      container = [
        [
          {
            font: FontWhitelist,
          },
        ],
        ["fontsize"],
        [
          "bold",
          "italic",
          "underline",
          "strike",
          { color: [] },
          { background: [] },
        ],
        // [{ header: [false, 2, 1] }],
        // [{ size: ["small", false, "large", "huge"] }],
        // ["bold", "italic", "underline", "strike"],
        // ["blockquote", "code-block"],
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" },
        ],
        [
          { list: "ordered" },
          { list: "bullet" },
          { list: "check" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [
          "link",
          "image",
          "video",
          "formula",
          { script: "sub" },
          { script: "super" },
        ],
      ],
      modules = { fontsize: true },
      // modules ={},
      ...props
    }: Props,
    ref
  ) => {
    const quillRef = useRef<any>(null);

    const imageUploadHandler = useCallback(async (file: File) => {
      const formData = new FormData();
      formData.append("files", file);
      const response: any = await fileRequester.upload(
        formData,
        (path + `/quill`).replaceAll("//", "/")
      );
      return response.urls?.[0];
    }, []);

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
    useEffect(() => {
      const targetNode = document.querySelector("#ql-loader")?.parentNode;
      if (targetNode) {
        const observer = new MutationObserver((mutationsList, observer) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
              // 제거된 노드(요소) 목록 확인
              mutation.removedNodes.forEach((node) => {
                if ((node as HTMLElement).id === "ql-loader") {
                  const container = document.querySelector(
                    ".ql-container"
                  ) as HTMLElement;
                  if (container) {
                    container.addEventListener("wheel", (e) => {
                      if (!e.ctrlKey) return;
                      e.preventDefault();
                      e.stopPropagation();
                      const direction = e.deltaY > 0 ? -1 : 1;
                      const editor = container.querySelector(
                        ".ql-editor"
                      ) as HTMLElement;
                      const scale = parseFloat(
                        editor.getAttribute("scale") || "1"
                      );
                      const newScale = Math.min(
                        Math.max(
                          0.1,
                          Math.round((scale + direction * 0.1) * 10) / 10
                        ),
                        2.0
                      );
                      editor.setAttribute("scale", String(newScale));
                      editor.style.transform = `scale(${newScale})`;

                      // 1. 데이터 계산
                      const scaleRatio = newScale / scale;
                      const containerRect = container.getBoundingClientRect();
                      const mouseX = e.clientX - containerRect.left;
                      const mouseY = e.clientY - containerRect.top;

                      // 2. 현재 스크롤 위치 보정
                      const currentScrollX = editor.scrollLeft;
                      const currentScrollY = editor.scrollTop;

                      // 3. 커서 위치 (컨텐츠 기준)
                      const newScrollX =
                        (mouseX + currentScrollX) * scaleRatio - mouseX;
                      const newScrollY =
                        (mouseY + currentScrollY) * scaleRatio - mouseY;

                      // 4. 업데이트
                      container.scrollLeft = newScrollX;
                      container.scrollTop = newScrollY;
                    });

                    const getDistance = (touches: TouchList): number => {
                      const touch1 = touches[0];
                      const touch2 = touches[1];
                      return Math.sqrt(
                        Math.pow(touch2.clientX - touch1.clientX, 2) +
                          Math.pow(touch2.clientY - touch1.clientY, 2)
                      );
                    };
                    container.addEventListener("touchstart", (e) => {
                      const editor = container.querySelector(
                        ".ql-editor"
                      ) as HTMLElement;
                      if (editor)
                        if (e.touches.length === 2) {
                          e.preventDefault();
                          e.stopPropagation();
                          editor.setAttribute(
                            "distance",
                            String(getDistance(e.touches))
                          );
                        } else {
                          editor.removeAttribute("distance");
                        }
                    });
                    container.addEventListener("touchmove", (e) => {
                      const editor = container.querySelector(
                        ".ql-editor"
                      ) as HTMLElement;
                      if (
                        e.touches.length === 2 &&
                        editor &&
                        editor.getAttribute("distance")
                      ) {
                        e.preventDefault();
                        e.stopPropagation();
                        const scale = parseFloat(
                          editor.getAttribute("scale") || "1"
                        );
                        const current = getDistance(e.touches);
                        const init = parseFloat(
                          editor.getAttribute("distance") || "0"
                        );

                        const scaleRatio = current / init;

                        const newScale = Math.min(
                          2.0,
                          Math.max(
                            0.1,
                            Math.round(scale * scaleRatio * 10) / 10
                          )
                        );
                        if (newScale === scale) return;
                        editor.setAttribute("scale", String(newScale));
                        editor.setAttribute("distance", String(current));
                        editor.style.transform = `scale(${newScale})`;

                        // 1. 데이터 계산
                        const containerRect = container.getBoundingClientRect();
                        const mouseX =
                          (e.touches[0].clientX + e.touches[1].clientX) / 2 -
                          containerRect.left;
                        const mouseY =
                          (e.touches[0].clientY + e.touches[1].clientY) / 2 -
                          containerRect.top;

                        // 2. 현재 스크롤 위치 보정
                        const currentScrollX = editor.scrollLeft;
                        const currentScrollY = editor.scrollTop;

                        // 3. 커서 위치 (컨텐츠 기준)
                        const newScrollX =
                          (mouseX + currentScrollX) * scaleRatio - mouseX;
                        const newScrollY =
                          (mouseY + currentScrollY) * scaleRatio - mouseY;

                        // 4. 업데이트
                        container.scrollLeft = newScrollX;
                        container.scrollTop = newScrollY;
                      }
                    });
                    container.addEventListener("touchend", (e) => {
                      if (e.touches.length < 2) {
                        const editor = container.querySelector(
                          ".ql-editor"
                        ) as HTMLElement;
                        editor.removeAttribute("distance");
                      }
                    });
                  }
                }
              });
            }
          }
        });
        observer.observe(targetNode, { childList: true });
      }
    }, []);
    const _modules = {
      toolbar: {
        container,

        handlers: {
          image: handleImage,
        },
      },
      ...(modules || {}),
      // The clipboard module is simplified as we handle paste via a direct event listener
      clipboard: {
        matchVisual: false,
      },
    };
    useImperativeHandle(ref, () => ({
      getEditor() {
        return quillRef.current.getEditor();
      },
      getValue() {
        return quillRef.current.getEditor().root.innerHTML;
      },
      getDelta() {
        return quillRef.current.getEditor().getContents();
      },
    }));
    return (
      <ReactQuill
        {...props}
        forwardedRef={quillRef}
        theme="snow"
        modules={_modules}
        className={clsx("wrap-quill", (props.type || "").toLowerCase())}
      />
    );
  }
);

export default Editor;
