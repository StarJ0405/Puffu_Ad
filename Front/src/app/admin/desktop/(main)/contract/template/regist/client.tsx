"use client";
import { useState } from "react";
import { adminRequester } from "@/shared/AdminRequester";
import VerticalFlex from "@/components/flex/VerticalFlex";
import HorizontalFlex from "@/components/flex/HorizontalFlex";

export function TemplateRegistClient() {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");

  async function handleSave() {
    const payload = { name, body };
    const res = await adminRequester.createContractTemplate(payload);
    console.log(res);
  }
    return (
      <div className="p-4">
        <h2>템플릿 등록</h2>
        <div>
          <label>템플릿 이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 에디터 자리 */}
        <div
          style={{
            border: "1px solid #ccc",
            height: "400px",
            marginTop: "16px",
          }}
        >
          <p style={{ textAlign: "center", marginTop: "180px" }}>
            에디터 영역 (추후 교체)
          </p>
        </div>

        <button onClick={handleSave} style={{ marginTop: "16px" }}>
          저장
        </button>
      </div>
    );
  }
