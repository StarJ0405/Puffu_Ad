"use client";

import { AddOn } from "../../class";

export default class BoxformAddOn extends AddOn {
  static _name: string = "boxform";
  static icon = `<div style="background-color: red; width: 100%; height: 100%;"></div>`;
  static tagName: string | string[] = "textarea";
  static create(node: HTMLElement, rawValue: any): Node {
    node.setAttribute("data-width", rawValue.width);
    node.setAttribute("data-placeholder", rawValue.placeholder);
    node.setAttribute("sizeable", "true");
    node.setAttribute("data-size", rawValue.size);
    node.style.width = rawValue.width;
    node.style.height = rawValue.height;
    node.style.fontSize = rawValue.size;
    const area = node as HTMLTextAreaElement;
    area.rows = 1;
    area.placeholder = rawValue.placeholder;
    area.value = "";
    area.addEventListener("keydown", (e) => {
      e.stopPropagation();
    });
    area.addEventListener("mouseup", (e) => {
      const area = e.target as HTMLTextAreaElement;
      if (area.getAttribute("data-width") !== area.style.width)
        area.setAttribute("data-width", area.style.width);
    });
    return node;
  }
  static formats(_domNode: HTMLElement): any {
    return {
      width: _domNode.getAttribute("data-width"),
      placeholder: _domNode.getAttribute("data-placeholder"),
      sizeable: _domNode.getAttribute("sizeable"),
      size: _domNode.getAttribute("data-size"),
    };
  }
  static value(_domNode: HTMLElement): any {
    return {
      width: _domNode.getAttribute("data-width"),
      placeholder: _domNode.getAttribute("data-placeholder"),
      sizeable: _domNode.getAttribute("sizeable"),
      size: _domNode.getAttribute("data-size"),
    };
  }
  static format(
    domNode: Node,
    name: string,
    value: any,
    _format: (name: string, value: any) => void
  ): void {
    switch (name) {
      case "placeholder": {
        (domNode as HTMLElement).setAttribute(
          "data-placeholder",
          value?.placeholder
        );
        (domNode as HTMLInputElement).placeholder = value?.placeholder;
        break;
      }
      case "width": {
        (domNode as HTMLElement).setAttribute("data-width", value?.width);
        (domNode as HTMLElement).style.width = value?.width;
        break;
      }
      case "size": {
        (domNode as HTMLElement as HTMLElement).style.fontSize = value;
        break;
      }
      default:
        // if (value) _format(name, value);
        break;
    }
  }
  static handleInsert(quill: any): void {
    const range = quill.getSelection(true);

    const [leafBlot] = quill.getLeaf(range.index);
    let node = leafBlot.domNode;
    if (!(leafBlot.domNode instanceof HTMLElement)) {
      node = leafBlot.domNode.parentNode;
    }
    const computedStyle = window.getComputedStyle(node);
    const fontSize = computedStyle.getPropertyValue("font-size");
    quill.insertEmbed(range.index, "boxform", {
      width: "300px",
      placeholder: "텍스트",
      size: fontSize,
    });
    quill.setSelection(range.index + 1, "silent");
  }
}
