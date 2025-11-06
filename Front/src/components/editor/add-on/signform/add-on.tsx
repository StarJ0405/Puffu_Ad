"use client";

import { fileRequester } from "@/shared/FileRequester";
import { dataURLtoFile } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { AddOn } from "../../class";

export default class SignformAddOn extends AddOn {
  static _name: string = "signform";
  static icon = `<div style="background-color: red; width: 100%; height: 100%;"></div>`;
  static tagName: string | string[] = "div";
  static create(node: HTMLElement, rawValue: any): Node {
    const div = document.createElement("div");
    node.setAttribute("data-width", rawValue?.width);
    node.setAttribute("data-height", rawValue?.height);
    node.setAttribute("data-x", rawValue?.x);
    node.setAttribute("data-y", rawValue?.y);
    div.className = "signfloat";
    div.style.width = rawValue?.width;
    div.style.left = `${rawValue?.x}px`;
    div.style.top = `${rawValue?.y}px`;
    div.style.height = rawValue?.height;
    // div.innerHTML = "(서명)";
    const close = document.createElement("div");
    close.className = "close-btn";
    div.appendChild(close);

    // 삭제버튼처리
    close.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      node.remove();
    });
    // 서명 기능
    div.addEventListener("click", (e) => {
      const float = e.target as HTMLElement;
      const readOnly = float.closest(".ql-disabled");
      if (!readOnly) return;
      const width = node.getAttribute("data-width");
      const height = node.getAttribute("data-height");
      const url = node.getAttribute("data-signature");
      NiceModal.show("signature", {
        withCloseButton: true,
        canvasStyle: {
          width,
          height,
        },
        url,
        backgroundColor: "#fff",
        onConfirm: async (url: string) => {
          const file = dataURLtoFile(url, `서명_${new Date().getTime()}.png`);
          const formData = new FormData();
          formData.set("files", file);
          const { urls } = await fileRequester.upload(formData, "/quill");

          node.setAttribute("data-signature", urls[0]);
          float.style.backgroundImage = `url(${urls[0]}`;
        },
      });
    });
    // 이동 및 크기 조절 기능
    div.addEventListener("mousedown", (e) => {
      const float = e.target as HTMLElement;
      const readOnly = float.closest(".ql-disabled");
      if (readOnly) return;
      const editor = document.querySelector(".ql-editor") as HTMLElement;
      const bounds = editor.getBoundingClientRect();
      const computed = float.computedStyleMap();
      const left = computed.get("left");
      const top = computed.get("top");
      float.style.maxWidth = `calc(${bounds.width}px - ${left?.toString()})`;
      float.style.maxHeight = `calc(${bounds.height}px - ${top?.toString()})`;
      float.setAttribute(
        "offsetX",
        String(e.clientX - parseFloat(float.style.left))
      );
      float.setAttribute(
        "offsetY",
        String(e.clientY - parseFloat(float.style.top))
      );
    });

    div.addEventListener("mousemove", (e) => {
      const float = e.target as HTMLElement;

      const node = document.querySelector(".signform") as HTMLElement;
      if (
        float.hasAttribute("offsetX") &&
        node.getAttribute("data-width") === float.style.width &&
        node.getAttribute("data-height") === float.style.height
      ) {
        const editor = document.querySelector(".ql-editor") as HTMLElement;
        const offsetX = parseFloat(float.getAttribute("offsetX") || "0");
        const offsetY = parseFloat(float.getAttribute("offsetY") || "0");
        const left = Math.min(
          Math.max(0, e.clientX - offsetX),
          editor.getBoundingClientRect().width -
            float.getBoundingClientRect().width
        );
        const top = Math.min(
          Math.max(0, e.clientY - offsetY),
          editor.getBoundingClientRect().height -
            float.getBoundingClientRect().height
        );
        float.style.zIndex = "10";
        float.style.left = `${left}px`;
        float.style.top = `${top}px`;
      }
    });
    div.addEventListener("mouseleave", (e) => {
      const float = e.target as HTMLElement;
      float.removeAttribute("offsetX");
      float.removeAttribute("offsetY");
    });

    div.addEventListener("mouseup", (e) => {
      const target = e.target as HTMLElement;
      const node = target.closest(".signform") as HTMLElement;
      if (
        node.getAttribute("data-width") !== target.style.width ||
        node.getAttribute("data-height") !== target.style.height
      ) {
        node.setAttribute("data-width", target.style.width);
        node.setAttribute("data-height", target.style.height);
      }
      const float = target.closest(".signfloat") as HTMLElement;
      float.style.maxHeight = "";
      float.style.maxWidth = "";
      float.style.zIndex = "";
      float.removeAttribute("offsetX");
      float.removeAttribute("offsetY");
    });

    div.addEventListener("touchstart", (e) => {
      const float = e.target as HTMLElement;
      const readOnly = float.closest(".ql-disabled");
      if (readOnly) return;
      if (e.touches.length > 1) {
        float.style.maxHeight = "";
        float.style.maxWidth = "";
        float.style.zIndex = "";
        float.removeAttribute("offsetX");
        float.removeAttribute("offsetY");
        return;
      }
      const editor = document.querySelector(".ql-editor") as HTMLElement;
      const bounds = editor.getBoundingClientRect();
      const computed = float.computedStyleMap();
      const left = computed.get("left");
      const top = computed.get("top");
      float.style.maxWidth = `calc(${bounds.width}px - ${left?.toString()})`;
      float.style.maxHeight = `calc(${bounds.height}px - ${top?.toString()})`;
      float.setAttribute(
        "offsetX",
        String(e.touches[0].clientX - parseFloat(float.style.left))
      );
      float.setAttribute(
        "offsetY",
        String(e.touches[0].clientY - parseFloat(float.style.top))
      );
    });
    div.addEventListener("touchmove", (e) => {
      const float = e.target as HTMLElement;

      const node = document.querySelector(".signform") as HTMLElement;
      if (
        float.hasAttribute("offsetX") &&
        node.getAttribute("data-width") === float.style.width &&
        node.getAttribute("data-height") === float.style.height
      ) {
        e.stopPropagation();
        e.preventDefault();
        const editor = document.querySelector(".ql-editor") as HTMLElement;
        const offsetX = parseFloat(float.getAttribute("offsetX") || "0");
        const offsetY = parseFloat(float.getAttribute("offsetY") || "0");
        const left = Math.min(
          Math.max(0, e.touches[0].clientX - offsetX),
          editor.getBoundingClientRect().width -
            float.getBoundingClientRect().width
        );
        const top = Math.min(
          Math.max(0, e.touches[0].clientY - offsetY),
          editor.getBoundingClientRect().height -
            float.getBoundingClientRect().height
        );
        float.style.zIndex = "10";
        float.style.left = `${left}px`;
        float.style.top = `${top}px`;
      }
    });

    div.addEventListener("touchcancel", (e) => {
      const float = e.target as HTMLElement;
      float.removeAttribute("offsetX");
      float.removeAttribute("offsetY");
    });
    div.addEventListener("touchend", (e) => {
      const target = e.target as HTMLElement;
      const node = target.closest(".signform") as HTMLElement;
      if (
        node.getAttribute("data-width") !== target.style.width ||
        node.getAttribute("data-height") !== target.style.height
      ) {
        node.setAttribute("data-width", target.style.width);
        node.setAttribute("data-height", target.style.height);
      }
      const float = target.closest(".signfloat") as HTMLElement;
      float.style.maxHeight = "";
      float.style.maxWidth = "";
      float.style.zIndex = "";
      float.removeAttribute("offsetX");
      float.removeAttribute("offsetY");
    });

    node.appendChild(div);
    return node;
  }
  static formats(_domNode: HTMLElement): any {
    return {
      width: _domNode.getAttribute("data-width"),
      height: _domNode.getAttribute("data-height"),
      x: _domNode.getAttribute("data-x"),
      y: _domNode.getAttribute("data-y"),
      signature: _domNode.getAttribute("data-signature"),
    };
  }
  static value(_domNode: HTMLElement): any {
    return {
      width: _domNode.getAttribute("data-width"),
      height: _domNode.getAttribute("data-height"),
      x: _domNode.getAttribute("data-x"),
      y: _domNode.getAttribute("data-y"),
      signature: _domNode.getAttribute("data-signature"),
    };
  }
  static format(
    domNode: Node,
    name: string,
    value: any,
    _format: (name: string, value: any) => void
  ): void {
    switch (name) {
      case "height": {
        (domNode as HTMLElement).setAttribute("data-height", value?.height);
        const float = (domNode as HTMLElement).querySelector(
          ".signfloat"
        ) as HTMLElement;
        float.style.height = value?.height;
        break;
      }
      case "width": {
        (domNode as HTMLElement).setAttribute("data-width", value?.width);
        const float = (domNode as HTMLElement).querySelector(
          ".signfloat"
        ) as HTMLElement;
        float.style.width = value?.width;
        break;
      }
      case "x": {
        (domNode as HTMLElement).setAttribute("data-x", value?.x);
        const float = (domNode as HTMLElement).querySelector(
          ".signfloat"
        ) as HTMLElement;
        float.style.left = `${value?.x}px`;
        break;
      }
      case "y": {
        (domNode as HTMLElement).setAttribute("data-y", value?.y);
        const float = (domNode as HTMLElement).querySelector(
          ".signfloat"
        ) as HTMLElement;
        float.style.left = `${value?.y}px`;
        break;
      }
      case "signature": {
        (domNode as HTMLElement).setAttribute(
          "data-signature",
          value?.signature
        );
        const float = (domNode as HTMLElement).querySelector(
          ".signfloat"
        ) as HTMLElement;
        float.style.backgroundImage = `url(${value.signature}}`;
        break;
      }
      default:
        // if (value) _format(name, value);
        break;
    }
  }
  static handleInsert(quill: any): void {
    const range = quill.getSelection(true);
    const bounds = quill.getBounds(range.index, 0);
    const editor = quill.editor.scroll.domNode as HTMLElement;

    quill.insertEmbed(range.index, "signform", {
      width: "300px",
      height: "100px",
      x:
        bounds.left -
        (editor.getBoundingClientRect().left -
          (quill.container as HTMLElement).getBoundingClientRect().left),
      y:
        bounds.top -
        (editor.getBoundingClientRect().top -
          (quill.container as HTMLElement).getBoundingClientRect().top),
    });
    quill.setSelection(range.index + 1, "silent");
  }
}
