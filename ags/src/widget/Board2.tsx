import { exec, Variable } from "astal";
import { Gtk } from "astal/gtk4";

type UsageProps = {
  label: string;
  update_func: () => number; // 0~100
};

const BLOCK = [
  // "▒",
  " ",
  // "▓",
  "█",
];

const BLOCK_NUMS = 10;

function Usage({ label, update_func }: UsageProps) {
  const v = Variable(0).poll(1000, update_func);

  return (
    <box vertical spacing={2} hexpand>
      <label
        label={`[ ${label} ]`}
        halign={Gtk.Align.START}
        cssClasses={["monospace", "usage-label"]}
      />
      <box spacing={6}>
        <box spacing={4} cssClasses={["usage-blocks", "common-box"]}>
          {[...Array(BLOCK_NUMS).keys()].map((current) => {
            return (
              <label
                label={" "}
                heightRequest={40}
                cssClasses={v((v) => {
                  return current <= v / 10
                    ? ["usage-block", "monospace", "fill"]
                    : ["usage-block", "monospace"];
                })}
              />
            );
          })}
        </box>
        <label
          widthRequest={60}
          valign={Gtk.Align.END}
          cssClasses={["usage-num", "common-box"]}
          label={v((v) => `${v}`)}
          justify={Gtk.Justification.CENTER}
        />
      </box>
    </box>
  );
}

export default function Board2() {
  return (
    <box
      vertical
      spacing={5}
      halign={Gtk.Align.FILL}
      valign={Gtk.Align.CENTER}
      hexpand
    >
      <Usage
        label="CPU LOAD"
        update_func={() => {
          const a = exec([
            "bash",
            "-c",
            'top -bn1 | grep "Cpu(s)" | awk \'{printf "%.1f", 100 - $8}\'',
          ]).trim();
          return parseInt(a);
        }}
      />

      <Usage
        label="RAM USAGE"
        update_func={() => {
          const a = exec([
            "bash",
            "-c",
            "free | grep Mem | awk '{printf \"%.1f\", $3/$2 * 100.0}'",
          ]).trim();
          return parseInt(a);
        }}
      />

      <Usage
        label="STORAGE"
        update_func={() => {
          const a = exec([
            "bash",
            "-c",
            "df -h | grep '/$' | awk '{print $5}' | sed 's/%//'",
          ]).trim();
          return parseInt(a);
        }}
      />
    </box>
  );
}
