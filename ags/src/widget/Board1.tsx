import { Variable, exec } from "astal";
import { Gtk } from "astal/gtk4";

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
  label: string;
  update_func: () => string;
};

function BaseInfoBox({ label, update_func }: InfoBoxProps) {
  const v = Variable(label).poll(1000, update_func);
  return (
    <box vertical spacing={10} cssClasses={["info-box"]} hexpand>
      <label
        label={`[ ${label} ]`}
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

function LeftInfoBox() {
  return (
    <box
      vertical
      spacing={5}
      halign={Gtk.Align.FILL}
      valign={Gtk.Align.CENTER}
      hexpand
    >
      <BaseInfoBox
        label="REACTOR UPTIME"
        update_func={() => {
          const time = exec(["uptime", "-r"]).split(" ")[1];
          return formatTimeWithPad(parseInt(time));
        }}
      />
      <BaseInfoBox
        label="CPU TEMP"
        update_func={() => {
          const temp = exec(["sensors", "-u", "coretemp-isa-0000"])
            .split("\n")
            .find((line) => line.includes("temp1_input"))
            ?.split(":")[1]
            .trim();
          return temp ? `${parseInt(temp)}°C` : "N/A";
        }}
      />
    </box>
  );
}

function RightInfoBox() {
  return (
    <box
      vertical
      spacing={5}
      halign={Gtk.Align.FILL}
      valign={Gtk.Align.CENTER}
      hexpand
    >
      <BaseInfoBox
        label="AAA"
        update_func={() => {
          return "aaa";
        }}
      />
      <BaseInfoBox
        label="GPU TEMP"
        update_func={() => {
          const temp = exec([
            "nvidia-smi",
            "--query-gpu=temperature.gpu",
            "--format=csv,noheader",
          ]);
          return temp ? `${temp}°C` : "N/A";
        }}
      />
    </box>
  );
}

export default function Board1() {
  return (
    <centerbox cssName="centerbox" hexpand>
      <LeftInfoBox />
      <box vertical cssClasses={["monospace"]} valign={Gtk.Align.CENTER}>
        <label label="─┐   ┌─" halign={Gtk.Align.CENTER} />
        <label label=" [ 2 ] " halign={Gtk.Align.CENTER} />
        <label label="─┘   └─" halign={Gtk.Align.CENTER} />
      </box>
      <RightInfoBox />
    </centerbox>
  );
}
