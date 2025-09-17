import Header from "./header";

export default async function ({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100vw",
        maxWidth: "100vw",

        height: "100dvh",
        backgroundColor: "#F5F6FB",
        overflow: "auto",
        // scrollbarWidth: "none",
        // msOverflowStyle: "none",
      }}
    >
      <div
        style={{
          minWidth: "1440px",
        }}
      >
        <Header />
        {/*  */}
        {children}
        {/*  */}
      </div>
    </div>
  );
}
