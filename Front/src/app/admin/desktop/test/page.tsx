"use client";

import Editor from "@/components/editor/edtior";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";

export default function () {
  return (
    <VerticalFlex>
      <FlexChild backgroundColor="#fff">
        <Editor
          container={[
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
            [{ test: "custom" }],
          ]}
          modules={{
            test: true,
          }}
        />
      </FlexChild>
    </VerticalFlex>
  );
}
