interface BackgroundProps {
  backgroundUrl: string;
  opacity: number;
}

export default function ImageBackground({
  backgroundUrl,
  opacity,
}: BackgroundProps) {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
        }}
      >
        <img
          src={backgroundUrl}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            margin: "auto",
            minWidth: "50%",
            minHeight: "50%",
            opacity: opacity,
            zIndex: "-1",
          }}
          alt="Background"
        />
        {/* <div className="bg-dark-cover"></div> */}
      </div>
    </>
  );
}
