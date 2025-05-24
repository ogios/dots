import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { Variable } from "astal";
import AudioVisualizer from "./AsciiCava";
import Board1 from "./Board1";
import Board2 from "./Board2";

// const time = Variable("").poll(1000, "date");

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, BOTTOM, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      visible
      cssClasses={["Bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={BOTTOM | LEFT | TOP}
      layer={Astal.Layer.BACKGROUND}
      application={App}
      marginLeft={5}
    >
      <box vertical vexpand>
        {/* <AudioVisualizer /> */}
        <Board1 />
        <Board2 />
      </box>
    </window>
  );
}

//      <centerbox cssName="centerbox">
//        <button onClicked="echo hello" hexpand halign={Gtk.Align.CENTER}>
//          Welcome to AGS!
//        </button>
//        <box />
//        <menubutton hexpand halign={Gtk.Align.CENTER}>
//          <label label={time()} />
//          <popover>
//            <Gtk.Calendar />
//          </popover>
//        </menubutton>
//      </centerbox>
