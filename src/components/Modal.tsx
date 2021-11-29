import { useEffect } from "react";

export default function Modal({
  children,
  show,
  onClose,
}: {
  children: any;
  show: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  // modal styles: https://www.w3schools.com/howto/howto_css_modals.asp
  return (
    <div
      style={{
        position: "fixed" /* Stay in place */,
        zIndex: 1 /* Sit on top */,
        left: 0,
        top: 0,
        width: "100%" /* Full width */,
        height: "100%" /* Full height */,
        overflow: "auto" /* Enable scroll if needed */,
        backgroundColor: show
          ? "rgba(0,0,0,0.2)"
          : "rgba(0,0,0,0)" /* Black w/ opacity */,
        transition: "0.2s" /* Fade in */,
        pointerEvents: show ? "auto" : "none",
      }}
      onClick={onClose}
    >
      <div
        style={{
          pointerEvents: show ? "auto" : "none",
          opacity: show ? 1 : 0,
          backgroundColor: "#fefefe",
          margin: "15% auto" /* 15% from the top and centered */,
          paddingTop: 5,
          paddingBottom: 22,
          paddingRight: 18,
          paddingLeft: 18,
          minHeight: "170px",
          width: "470px" /* Could be more or less, depending on screen size */,
          transition: "0.4s" /* Fade in */,
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()} // prevent click propagating to parent (closing modal)
      >
        <button
          style={{
            color: "#aaa",
            fontSize: "28px",
            fontWeight: "bold",
            alignSelf: "end",
            position: "absolute",
          }}
          onClick={onClose}
        >
          &times;
        </button>
        <div
          style={{
            paddingTop: 5,
            paddingBottom: 22,
            paddingRight: 18,
            paddingLeft: 18,
          }}
          onClick={(e) => e.stopPropagation()} // prevent click propagating to parent (closing modal)
        >
          {show && children}
        </div>
      </div>
    </div>
  );
}
