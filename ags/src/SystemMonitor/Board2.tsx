import { execAsync, Variable } from "astal";
import { Gtk } from "astal/gtk4";

const CPU_LOAD = Variable(0).poll(1000, async () => {
  const a = await execAsync([
    "bash",
    "-c",
    'top -bn1 | grep "Cpu(s)" | awk \'{printf "%.1f", 100 - $8}\'',
  ]).then((s) => s.trim());
  return parseInt(a);
});

const RAM_USAGE = Variable(0).poll(1000, async () => {
  const a = await execAsync([
    "bash",
    "-c",
    "free | grep Mem | awk '{printf \"%.1f\", $3/$2 * 100.0}'",
  ]).then((s) => s.trim());
  return parseInt(a);
});

const STORAGE_USAGE = Variable(0).poll(1000, async () => {
  const a = await execAsync([
    "bash",
    "-c",
    "df -h | grep '/$' | awk '{print $5}' | sed 's/%//'",
  ]).then((s) => s.trim());
  return parseInt(a);
});

type UsageProps = {
  label: string;
  v: Variable<number>;
};

const BLOCK_NUMS = 10;

function Usage({ label, v }: UsageProps) {
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
      <Usage label="CPU LOAD" v={CPU_LOAD} />
      <Usage label="RAM USAGE" v={RAM_USAGE} />
      <Usage label="STORAGE" v={STORAGE_USAGE} />
    </box>
  );
}
