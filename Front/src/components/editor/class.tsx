"use client";
import { Module } from "quill";
import Embed from "quill/blots/embed";
import Toolbar from "quill/modules/toolbar";
import ReactQuill from "react-quill-new";

export abstract class AddOn {
  static _name: string;
  static icon: string;
  // blot 정의
  static tagName: string | string[];
  static create(node: HTMLElement, rawValue: any): Node {
    return node;
  }
  static formats(_domNode: HTMLElement) {
    return {};
  }
  static value(_domNode: HTMLElement) {
    return {};
  }
  static format(
    domNode: Node,
    name: string,
    value: any,
    _format: (name: string, value: any) => void
  ): void {
    _format(name, value);
  }
  protected static createEmbedClass(): typeof Embed {
    const name = this._name;
    const tagName = this.tagName;
    const _create = this.create;
    const _formats = this.formats;
    const _value = this.value;
    const _format = this.format;
    return class Dynamicblot extends Embed {
      static blotName: string = name;
      static tagName: string | string[] = tagName;
      static className: string = name;

      static create(rawValue?: unknown): Node {
        return _create?.(super.create() as HTMLElement, rawValue);
      }
      static formats(_domNode: HTMLElement) {
        return _formats?.(_domNode);
      }
      static value(_domNode: HTMLElement) {
        return _value?.(_domNode);
      }
      format(name: string, value: any): void {
        _format?.(this.domNode, name, value, super.format);
      }
    };
  }
  // module 정의
  static handleInsert(quill: any): void {}
  static init({ quill, toolbar }: { quill: any; toolbar: Toolbar }): void {}
  protected static createModuleClass(): typeof import("quill").Module {
    const name = this._name;
    const _handleInsert = this.handleInsert;
    const _init = this.init;
    return class DyanmicClsss extends Module {
      constructor(quill: any, options?: any) {
        super(quill, options);
        const toolbar: Toolbar = quill.getModule("toolbar") as Toolbar;
        if (toolbar) toolbar.addHandler(name, this.handleInsert);

        _init?.({ quill, toolbar });
      }
      handleInsert = () => {
        _handleInsert(this.quill);
      };
    };
  }

  static register(RQ: typeof ReactQuill): void {
    const blot = this.createEmbedClass();
    if (blot) RQ.Quill.register(`formats/${this._name}`, blot, true);
    const module = this.createModuleClass();
    if (module) RQ.Quill.register(`modules/${this._name}`, module);
    if (this.icon) {
      const icons: any = RQ.Quill.import("ui/icons");
      icons[this._name] = this.icon;
    }
  }
}
