"use client";

import Toolbar from "quill/modules/toolbar";
import { AddOn } from "../../class";

export default class FontSizeAddOn extends AddOn {
  static min = 1;
  static max = 100;
  static _name: string = "fontsize";
  static icon = `
  <div style="display:flex; gap: 6px;">
    <div class='ql-fontsize-minus' style="cursor:pointer;">
      <svg width="24" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    
    <input class='ql-fontsize-value' type="number" class="stepper-input" value="12" min="${this.min}" max="${this.max}" style="width: 50px; height:18px; border:none; text-align:center; outline:none;" aria-live="polite">
    
    <div class='ql-fontsize-plus' style="cursor:pointer;">
      <svg width="24" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
  </div>
  `;
  static tagName: string | string[] = "span";

  static create(node: HTMLElement, rawValue = 1): Node {
    return node;
  }

  static formats(_domNode: HTMLElement): any {
    return {
      value: _domNode.getAttribute("data-value"),
    };
  }
  static value(_domNode: HTMLElement): any {
    return {
      value: parseInt(_domNode.getAttribute("data-value") || "1", 10),
    };
  }
  static handleInsert(quill: any): void {}

  static init({ quill, toolbar }: { quill: any; toolbar: Toolbar }): void {
    if (typeof document !== "undefined") {
      function update(e: Event, changeValue: number) {
        e.stopPropagation();
        e.preventDefault();

        const node = (e.currentTarget as HTMLElement).parentNode;
        if (node) {
          const input = node.querySelector(
            ".ql-fontsize-value"
          ) as HTMLInputElement;
          if (input) {
            const value = parseInt(input.value || `${FontSizeAddOn.min}`, 10);
            const size = Math.min(
              FontSizeAddOn.max,
              Math.max(FontSizeAddOn.min, value + changeValue)
            );
            input.value = String(size);
            change(size);
          }
        }
      }
      function change(size: number) {
        const range = quill.getSelection(true);
        if (range) {
          if (range.length === 0) {
            const formats = quill.getFormat(range.index, range.length);

            const index = range.index;
            if (formats?.sizeable === "true") {
              const [leafBlot] = quill.getLeaf(index);
              const node = leafBlot.domNode as HTMLElement;
              node.setAttribute("data-size", `${size}px`);
              node.style.fontSize = `${size}px`;
            } else if (formats.hasOwnProperty("size")) {
              quill.format("size", `${size}px`, "user");
            } else {
              quill.insertText(index, " ", "size", `${size}px`, "user");
              quill.setSelection(index + 1, "silent");
            }
          } else {
            quill.formatText(range.index, range.length, "size", `${size}px`);
          }
        }
      }
      const parentNode = (
        toolbar.container?.querySelector(".ql-fontsize-minus") as HTMLElement
      ).parentNode;
      (
        parentNode?.querySelector(".ql-fontsize-minus") as HTMLElement
      )?.addEventListener("click", (e) => update(e, e.shiftKey ? -5 : -1));
      (
        parentNode?.querySelector(".ql-fontsize-plus") as HTMLElement
      )?.addEventListener("click", (e) => update(e, e.shiftKey ? 5 : 1));
      const input = parentNode?.querySelector(
        ".ql-fontsize-value"
      ) as HTMLInputElement;
      input?.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
      });
      // input.style
      input?.addEventListener("change", (e) => {
        const value = parseInt((e.target as HTMLInputElement).value, 10);
        const size = Math.min(
          FontSizeAddOn.max,
          Math.max(FontSizeAddOn.min, value)
        );
        (e.target as HTMLInputElement).value = String(size);
        change(size);
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const size = parseInt((e.target as HTMLInputElement).value, 10);
          change(size);
          e.preventDefault();
        }
      });
      input.addEventListener("focus", (e) => {
        (e.target as HTMLInputElement).select();
      });
    }
  }
}
