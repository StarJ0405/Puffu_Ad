"use client";

import { useEffect } from "react";

export default function () {
  useEffect(() => {
    console.log(navigator.userAgent);
  }, []);
  return <></>;
}
