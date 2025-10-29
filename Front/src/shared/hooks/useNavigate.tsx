"use client";
import { useRouter } from "next/navigation";

interface NavigateFunction {
  (to: String, options?: NavigateOptions): void;
  (delta: number): void;
}
interface NavigateOptions {
  type?: "move" | "replace" | "new";
  preventScrollReset?: boolean;
  refresh?: boolean;
}

export default function useNavigate(): NavigateFunction {
  const router = useRouter();
  return (...props) => {
    setTimeout(() => {
      if (typeof props?.[0] === "undefined" || props?.[0] === null) return;
      if (typeof props[0] === "number") {
        const delta: number = props[0];

        if (delta === -1) {
          if (window.history.length <= 2) router.push("/");
          else router.back();
        } else if (delta === 1) {
          router.forward();
        } else if (delta === 0) {
          router.refresh();
        }
      } else {
        const to: string = String(props[0]);

        if (to.split("?")[0] !== window.location.pathname)
          sessionStorage.removeItem(`scrollPos:${to.split("?")[0]}`);
        if (props?.[1]) {
          const option = props?.[1] as NavigateOptions;
          const _option = {
            scroll: option.preventScrollReset,
          };
          if (option?.type === "new") {
            window.open(
              to.startsWith("http")
                ? to
                : `${window.location.host}${`/${to}`.replace("//", "/")}`
            );
          } else if (option?.type === "replace") {
            router.replace(to, _option);
            if (option?.refresh) setTimeout(() => router.refresh(), 0);
          } else {
            router.push(to, _option);
            if (option?.refresh) setTimeout(() => router.refresh(), 0);
          }
        } else router.push(to);
      }
    }, 1);
  };
}

// export default function useNavigate(): NavigateFunction {
//   const router = useRouter();
//   const { isMobile } = useBrowserEvent();
//   return (...props) => {
//     if (!props?.[0]) return;

//     const animate = async (move: () => void, preload?: () => Promise<void>) => {
//       if (isMobile) {
//         const element = document.getElementById("motion");
//         if (element) {
//           await preload?.();
//           element.style.animation = "slide-out 0.5s ease-in-out forwards";
//           setTimeout(() => {
//             move();
//           }, 200);
//         } else move();
//       } else move();
//     };

//     if (typeof props[0] === "number") {
//       const delta: number = props[0];

//       if (delta === -1) animate(() => router.back());
//       else if (delta === 1) animate(() => router.forward());
//     } else {
//       const to: string = String(props[0]);
//       if (props?.[1]) {
//         const option = props?.[1] as NavigateOptions;
//         const _option = {
//           scroll: option.preventScrollReset,
//         };
//         if (option?.type === "new") {
//           window.open(
//             to.startsWith("http")
//               ? to
//               : `${window.location.host}${`/${to}`.replace("//", "/")}`
//           );
//         } else if (option?.type === "replace") {
//           animate(
//             () => router.replace(to, _option),
//             async () => await router.prefetch(to)
//           );
//         } else
//           animate(
//             () => router.push(to, _option),
//             async () => await router.prefetch(to)
//           );
//       } else
//         animate(
//           () => router.push(to),
//           async () => await router.prefetch(to)
//         );
//     }
//   };
// }
