"use client";

import { AddOn } from "../../class";

export default class TestAddOn extends AddOn {
  static _name: string = "test";
  static icon = `<div style="background-color: red; width: 100%; height: 100%;"></div>`;
  static tagName: string | string[] = "div";
  static create(node: HTMLElement, rawValue: any): Node {
    node.setAttribute("data-width", rawValue.width);
    node.setAttribute("data-height", rawValue.height);
    node.setAttribute("data-color", rawValue.color);
    node.style.width = rawValue.width;
    node.style.height = rawValue.height;
    node.style.backgroundColor = rawValue.color;
    return node;
  }
  static formats(_domNode: HTMLElement): any {
    return {
      width: _domNode.getAttribute("data-width"),
      height: _domNode.getAttribute("data-height"),
      color: _domNode.getAttribute("data-color"),
    };
  }
  static value(_domNode: HTMLElement): any {
    return {
      width: _domNode.getAttribute("data-width"),
      height: _domNode.getAttribute("data-height"),
      color: _domNode.getAttribute("data-color"),
    };
  }
  static format(domNode: Node, name: string, value: any): void {
    switch (name) {
      case "color": {
        (domNode as HTMLElement).setAttribute("data-color", value.color);
        (domNode as HTMLElement).style.backgroundColor = value.color;
        break;
      }
      case "width": {
        (domNode as HTMLElement).setAttribute("data-width", value.width);
        (domNode as HTMLElement).style.width = value.width;
        break;
      }
      case "height": {
        (domNode as HTMLElement).setAttribute("data-height", value.height);
        (domNode as HTMLElement).style.height = value.height;
        break;
      }
    }
  }
  static handleInsert(quill: any): void {
    const range = quill.getSelection(true);
    quill.insertEmbed(range.index, "test", {
      width: "10px",
      height: "10px",
      color: "red",
    });
  }
}
