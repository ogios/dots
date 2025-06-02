import { Variable, execAsync } from "astal";
import { Gtk } from "astal/gtk4";
import AstalBattery from "gi://AstalBattery";

function formatTimeWithPad(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

type InfoBoxProps = {
  label?: string;
  label_var?: Variable<string>;
  v: Variable<string>;
};

function BaseInfoBox({ label, label_var, v }: InfoBoxProps) {
  return (
    <box vertical spacing={10} cssClasses={["info-box", "common-box"]} hexpand>
      <label
        label={
          label
            ? `[ ${label.toString()} ]`
            : label_var
              ? label_var((label) => `[ ${label.toString()} ]`)
              : ""
        }
        halign={Gtk.Align.CENTER}
        cssClasses={["monospace", "info-box-label"]}
      />
      <label
        label={v()}
        halign={Gtk.Align.CENTER}
        cssClasses={["info-box-value"]}
      />
    </box>
  );
}

var REACTOR_UPTIME = Variable("UNKNOWN").poll(500, async (_) => {
  const time = await execAsync(["uptime", "-r"]).then((s) => s.split(" ")[1]);
  return formatTimeWithPad(parseInt(time));
});

var CPU_TEMP = Variable("UNKNOWN").poll(500, async (_) => {
  const temp = await execAsync(["sensors", "-u", "coretemp-isa-0000"]).then(
    (s) =>
      s
        .split("\n")
        .find((line) => line.includes("temp1_input"))
        ?.split(":")[1]
        .trim(),
  );
  return temp ? `${parseInt(temp)}°C` : "N/A";
});

function LeftInfoBox() {
  return (
    <box
      vertical
      spacing={5}
      halign={Gtk.Align.FILL}
      valign={Gtk.Align.CENTER}
      hexpand
    >
      <BaseInfoBox label="REACTOR UPTIME" v={REACTOR_UPTIME} />
      <BaseInfoBox label="CPU TEMP" v={CPU_TEMP} />
    </box>
  );
}

const bat = AstalBattery.get_default();
const BATTERY_LABEL = Variable("MULTDONW TIME");
if (bat.get_charging()) {
  BATTERY_LABEL.set("IGNITION TIME");
}
bat.connect("notify::charging", () => {
  BATTERY_LABEL.set(bat.get_charging() ? "IGNITION TIME" : "MULTDONW TIME");
});
var BATTERY = Variable("UNKNOWN").poll(500, async (_) => {
  const bat = AstalBattery.get_default();
  if (bat.get_charging()) {
    const time = bat.get_time_to_full();
    return time === 0 ? "FULL" : formatTimeWithPad(time);
  } else {
    const time = bat.get_time_to_empty();
    return formatTimeWithPad(time);
  }
});

var GPU_TEMP = Variable("UNKNOWN").poll(500, async (_) => {
  const temp = await execAsync([
    "nvidia-smi",
    "--query-gpu=temperature.gpu",
    "--format=csv,noheader",
  ]);
  return temp ? `${temp}°C` : "N/A";
});

function RightInfoBox() {
  return (
    <box
      vertical
      spacing={5}
      halign={Gtk.Align.FILL}
      valign={Gtk.Align.CENTER}
      hexpand
    >
      <BaseInfoBox label_var={BATTERY_LABEL} v={BATTERY} />
      <BaseInfoBox label="GPU TEMP" v={GPU_TEMP} />
    </box>
  );
}

export default function Board1() {
  return (
    // @ts-ignore
    <centerbox cssName="centerbox" hexpand>
      <LeftInfoBox />
      <box vertical cssClasses={["monospace"]} valign={Gtk.Align.CENTER}>
        <label label="─┐   ┌─" halign={Gtk.Align.CENTER} />
        <label label=" [ o ] " halign={Gtk.Align.CENTER} />
        <label label="─┘   └─" halign={Gtk.Align.CENTER} />
      </box>
      <RightInfoBox />
    </centerbox>
  );
}
