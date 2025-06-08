import { readFileAsync, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import byte_size from "tiny-byte-size";

function get_ratio(x: number): number {
  return Math.pow(x, 1 / 8);
}

function block(ratio: number) {
  const MAX_WIDTH = 15;

  const w = MAX_WIDTH * Math.max(ratio, 0.1);
  return (
    <box
      cssClasses={["fill-block"]}
      widthRequest={w}
      heightRequest={40}
      halign={Gtk.Align.CENTER}
    />
  );
}

function block_array(ratio: number, num: number) {
  ratio = get_ratio(ratio);
  const v = ratio * num;
  const full_block_num = Math.trunc(v);
  const rest = v - full_block_num;

  const blocks = Array(num).fill(0).fill(1, 0, full_block_num);
  blocks.length = num;
  if (full_block_num < num) {
    blocks[full_block_num] = rest;
  }

  return blocks.reverse().map((ratio_of_each_block) => {
    return block(ratio_of_each_block);
  });
}

type BlockBoxProps = {
  label: string;
  update_func: () => number;
  desc_func: (v: number) => string;
};

function BlockBox({ label, update_func, desc_func }: BlockBoxProps) {
  const v = Variable(0).poll(1000, update_func);
  return (
    <box
      vertical
      spacing={4}
      widthRequest={100}
      halign={Gtk.Align.BASELINE_CENTER}
    >
      <label
        cssClasses={["monospace"]}
        label={`[ ${label} ]`}
        halign={Gtk.Align.CENTER}
      />
      <box
        vertical
        cssClasses={["common-box", "block-box"]}
        halign={Gtk.Align.FILL}
        spacing={1}
      >
        {v((v) => block_array(v, 6))}
      </box>
      <label
        cssClasses={["monospace"]}
        label={v((v) => desc_func(v))}
        halign={Gtk.Align.CENTER}
      />
    </box>
  );
}

export default function Board3() {
  const IFACE = "enp58s0";

  function transform(s: string, o: number[]): number[] {
    const n = parseInt(s);
    if (o[0] !== -1) {
      o[1] = n - o[0];
    }
    o[0] = n;
    return o;
  }

  const donwload = Variable([-1, 0]).poll(1000, async (o) => {
    const s = await readFileAsync(
      `/sys/class/net/${IFACE}/statistics/rx_bytes`,
    );
    return transform(s, o);
  });
  const upload = Variable([-1, 0]).poll(1000, async (o) => {
    const s = await readFileAsync(
      `/sys/class/net/${IFACE}/statistics/tx_bytes`,
    );
    return transform(s, o);
  });

  function speed_format(v: number): string {
    return byte_size.perSecond(v);
  }

  return (
    <box hexpand spacing={20}>
      <BlockBox
        label="DOWNLOAD"
        update_func={() => {
          const MAX = 40 * 1024 * 1024;
          return Math.min(donwload.get()[1] / MAX, 1);
        }}
        desc_func={(_) => {
          return speed_format(donwload.get()[1]);
        }}
      />
      <BlockBox
        label="UPLOAD"
        update_func={() => {
          const MAX = 10 * 1024 * 1024;
          return Math.min(upload.get()[1] / MAX, 1);
        }}
        desc_func={(_) => {
          return speed_format(upload.get()[1]);
        }}
      />
    </box>
  );
}
