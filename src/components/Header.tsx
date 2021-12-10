import { Channel, channels, channelColors } from "../App";
import Presence from "../components/Presence";

export default function Header({
  channel,
  setChannel,
}: {
  channel: Channel;
  setChannel: (channel: Channel) => void;
}) {
  const padding = window.innerWidth < 500 ? 15 : 20;
  const fontWidth = 7.2;
  const paddingRight = window.innerWidth < 500 ? 23 : 30; // fixes mobile overflow issue
  const channelIndex = channel ? channels.indexOf(channel) : 0;
  const left = channel
    ? channels.slice(0, channelIndex).join("").length * fontWidth +
      channelIndex * paddingRight -
      8
    : 0;
  const width = channel ? channel.length * fontWidth + 16 : 0;
  function selectChannel(e: React.MouseEvent<HTMLButtonElement>) {
    setChannel((e.target as HTMLElement).innerText);
  }

  const buttonStyle = {
    WebkitTapHighlightColor: "transparent",
    paddingRight,
  };

  return (
    <nav style={{ fontFamily: "monospace", fontSize: 16, display: "flex" }}>
      ComposeJS
      <div
        style={{
          fontFamily: "monospace",
          display: "flex",
          justifyContent: "center",
          flexGrow: 1,
          paddingLeft: padding,
          paddingRight: padding,
          fontSize: "12px",
          lineHeight: "1.4em",
        }}
      >
        <div style={{ display: "flex", position: "relative" }}>
          <button style={buttonStyle} onClick={selectChannel}>
            all
          </button>
          <button style={buttonStyle} onClick={selectChannel}>
            #intro
          </button>
          <button style={buttonStyle} onClick={selectChannel}>
            #help
          </button>
          <button
            style={{ ...buttonStyle, paddingRight: 0 }}
            onClick={selectChannel}
          >
            #demo
          </button>
          <div
            style={{
              width: width + "px",
              height: 20,
              position: "absolute",
              backgroundColor: channelColors[channelIndex],
              zIndex: -1,
              left: left + "px",
              borderRadius: 10,
              transition: "all 0.3s",
            }}
          ></div>
        </div>
      </div>
      <Presence />
    </nav>
  );
}
