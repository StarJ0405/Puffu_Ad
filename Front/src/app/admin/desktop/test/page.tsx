"use client";

import Editor, { FontWhitelist } from "@/components/editor/edtior";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import { useRef, useState } from "react";
import styles from "./page.module.css";

export default function () {
  const editor = useRef<any>(null);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  return (
    <VerticalFlex>
      <FlexChild backgroundColor="#fff">
        <HorizontalFlex alignItems="stretch">
          <FlexChild width={150}>
            <VerticalFlex flexStart height={"100%"}>
              <FlexChild
                className={styles.inputs}
                onClick={() => setReadOnly(!readOnly)}
              >
                <P>{readOnly ? "편집모드로 전환" : "계약모드로 전환"}</P>
              </FlexChild>
              <FlexChild className={styles.inputs} onClick={() => {}}>
                <P>서명</P>
              </FlexChild>
              <FlexChild
                className={styles.inputs}
                onClick={async () => {
                  const quill = editor.current.getEditor();
                  const { default: TextFormAddOn } = await import(
                    "@/components/editor/add-on/textform/add-on"
                  );
                  TextFormAddOn.handleInsert(quill);
                }}
              >
                <P>입력창</P>
              </FlexChild>
              <FlexChild
                className={styles.inputs}
                onClick={async () => {
                  const quill = editor.current.getEditor();
                  const { default: BoxformAddOn } = await import(
                    "@/components/editor/add-on/boxform/add-on"
                  );
                  BoxformAddOn.handleInsert(quill);
                }}
              >
                <P>텍스트상자</P>
              </FlexChild>
            </VerticalFlex>
          </FlexChild>
          <FlexChild>
            <Editor
              ref={editor}
              container={[
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
              ]}
              modules={{
                textform: true,
                fontsize: true,
              }}
              readOnly={readOnly}
              onChange={(value, delta, source, editor) => {
                console.log(value);
                console.log(delta);
                console.log(source);
                console.log(editor);
              }}
            />
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
