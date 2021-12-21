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
  }, [onClose]);

  // modal styles: https://www.w3schools.com/howto/howto_css_modals.asp
  return (
    <>
      <div
        style={{
          position: "fixed" /* Stay in place */,
          zIndex: 1 /* Sit on top */,
          left: 0,
          top: 0,
          width: "100%" /* Full width */,
          height: "100%" /* Full height */,
          backgroundColor: show
            ? "rgba(0,0,0,0.2)"
            : "rgba(0,0,0,0)" /* Black w/ opacity */,
          transition: "0.2s" /* Fade in */,
          pointerEvents: show ? "auto" : "none",
        }}
        onClick={onClose}
      ></div>
      <div
        className="w-11/12 max-w-lg absolute z-10 top-3 sm:top-1/2 left-1/2 transform -translate-x-1/2 sm:-translate-y-1/2"
        style={{
          pointerEvents: show ? "auto" : "none",
          display: show ? "flex" : "none",
          backgroundColor: "#fefefe",
          paddingTop: 5,
          paddingBottom: 22,
          paddingRight: 18,
          paddingLeft: 18,
          minHeight: "170px",
          transition: "0.4s" /* Fade in */,
          borderRadius: "5px",
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
    </>
  );
}
