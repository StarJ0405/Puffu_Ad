"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useRouteLoading() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setTimeout(() => setIsLoading(false), 300);

    // push/replace 감지를 위한 monkey patch
    const origPush = router.push;
    const origReplace = router.replace;

    router.push = async (...args: Parameters<typeof router.push>) => {
      handleStart();
      await origPush(...args);
      handleComplete();
    };

    router.replace = async (...args: Parameters<typeof router.replace>) => {
      handleStart();
      await origReplace(...args);
      handleComplete();
    };

    return () => {
      router.push = origPush;
      router.replace = origReplace;
    };
  }, [router]);

  return isLoading;
}