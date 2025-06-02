import { App, Astal, Gdk } from "astal/gtk4";
import Board1 from "./Board1";
import Board2 from "./Board2";
import Board3 from "./Board3";

export default function SystemMonitor(gdkmonitor: Gdk.Monitor, ns: string) {
  const { TOP, LEFT, BOTTOM, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      visible
      namespace={ns}
      cssClasses={["Bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={BOTTOM | LEFT | TOP}
      layer={Astal.Layer.BACKGROUND}
      application={App}
      margin_left={30}
      margin_top={50}
      child={
        <box vertical hexpand spacing={40}>
          {/* <AudioVisualizer /> */}
          <Board1 />
          <Board2 />
          <Board3 />
        </box>
      }
    />
  );
}
