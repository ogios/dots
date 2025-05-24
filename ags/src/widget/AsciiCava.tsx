import Cava from "gi://AstalCava";
const cava = Cava.get_default()!;

import { bind, exec, GLib, Variable } from "astal";
import { Gtk, Widget } from "astal/gtk4";

cava?.set_bars(12);
const bars = Variable("");
const blocks = [
  "\u2581",
  "\u2582",
  "\u2583",
  "\u2584",
  "\u2585",
  "\u2586",
  "\u2587",
  "\u2588",
];
// Assuming blocks is constant, move it outside
const BLOCKS_LENGTH = blocks.length;
const EMPTY_BARS = "".padEnd(12, "\u2581");

export default function AudioVisualizer() {
  cava?.connect("notify::values", () => {
    const values = cava.get_values();
    const barArray = new Array(values.length);

    for (let i = 0; i < values.length; i++) {
      const val = values[i];
      const index = Math.min(Math.floor(val * 8), BLOCKS_LENGTH - 1);
      barArray[i] = blocks[index];
    }

    const b = barArray.join("");
    console.log(barArray);
    bars.set(b);
  });

  return <label onDestroy={() => bars.drop()} label={bind(bars)} />;
}
