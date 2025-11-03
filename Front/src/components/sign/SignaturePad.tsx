// import dynamic from "next/dynamic";
// import { SignatureCanvasProps } from "react-signature-canvas";

// const SignatureCanvas = dynamic(
//   () => import("react-signature-canvas"),
//   { ssr: false } // 👈 **SSR 비활성화 필수**
// );

// function SignaturePad(props: SignatureCanvasProps) {
//   return <SignatureCanvas {...props} />;
// }

// export default SignaturePad;

import dynamic from "next/dynamic";
import { forwardRef, useRef } from "react";
import { SignatureCanvasProps } from "react-signature-canvas";

const SignatureCanvas = dynamic(
  async () => {
    const { default: SC } = await import("react-signature-canvas");
    const Component = ({ forwardedRef, ...props }: any) => (
      <SC ref={forwardedRef} {...props} />
    );
    Component.displayName = "SignatureCanvas";
    return Component;
  },
  { ssr: false }
);

const SignaturePad = forwardRef((props: SignatureCanvasProps, ref) => {
  return <SignatureCanvas ref={ref} {...props} />;
});

export default SignaturePad;
