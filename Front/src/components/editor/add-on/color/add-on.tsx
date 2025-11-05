"use client";

import { AddOn } from "../../class";

export default class ColorAddOn extends AddOn {
  static popularColors = [
    "#000000",
    "#FFFFFF",
    "#808080",
    "#D3D3D3",
    "#A9A9A9",
    "#FF0000",
    "#8B0000",
    "#FFA500",
    "#A52A2A",
    "#FFD700",
    "#FFFF00",
    "#FFFFE0",
    "#00FF00",
    "#008000",
    "#006400",
    "#90EE90",
    "#008080",
    "#00FFFF",
    "#00CED1",
    "#E0FFFF",
    "#0000FF",
    "#00008B",
    "#000080",
    "#4169E1",
    "#87CEEB",
    "#87CEFA",
    "#800080",
    "#FF00FF",
    "#8B008B",
    "#4B0082",
    "#E6E6FA",
    "#FFC0CB",
    "#FF1493",
    "#FFB6C1",
    "#FF69B4",
    "#FF7F50",
    "#FF6347",
    "#F5F5DC",
    "#FFFFF0",
    "#FAF0E6",
    "#808000",
    "#CD5C5C",
  ];
  static _name: string = "color";
  static icon = `<div style="background-color: red; width: 100%; height: 100%;"></div>`;
  static tagName: string | string[] = "div";
  static create(node: HTMLElement, rawValue: any): Node {
    return node;
  }
  static formats(_domNode: HTMLElement): any {
    return {};
  }
  static value(_domNode: HTMLElement): any {
    return {};
  }
  static handleInsert(quill: any): void {}
}
