import { exec, Variable } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk4";

export default {
  window: PowerMenu,
  toggle,
};

async function get_current_output_niri() {
  const j = exec(["niri", "msg", "-j", "focused-output"]).trim();
  return JSON.parse(j).name;
}

async function toggle() {
  const current_output = await get_current_output_niri();
  App.toggle_window(`power-menu-${current_output}`);
}

type Props = {
  lable: string;
  icon: string;
  on_click: () => void;
};
function menus(
  a: Props[],
  btns: Gtk.Button[],
  current_selection: Variable<number>,
) {
  const ms: Gtk.Widget[] = Array(a.length);
  for (const [i, p] of a.entries()) {
    ms[i] = (
      <button
        widthRequest={300}
        heightRequest={300}
        focusable={false}
        setup={(b) => (btns[i] = b)}
        cssClasses={current_selection((n) => (n === i ? ["selected"] : []))}
        onHoverEnter={() => current_selection.set(i)}
        onClicked={p.on_click}
      >
        <box
          spacing={10}
          vertical
          valign={Gtk.Align.CENTER}
          halign={Gtk.Align.CENTER}
        >
          <label
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
            label={p.icon}
          />
          <label
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
            label={p.lable}
          />
        </box>
      </button>
    );
  }

  return ms;
}

function PowerMenu(monitor: Gdk.Monitor) {
  const { TOP, LEFT, BOTTOM, RIGHT } = Astal.WindowAnchor;

  const name = `power-menu-${monitor.get_connector()}`;
  print(`spawning power menu for ${name}`);

  const btns: Gtk.Button[] = Array(2);
  let current_selection = Variable(0);

  return (
    <window
      name={name}
      gdkmonitor={monitor}
      anchor={BOTTOM | LEFT | TOP | RIGHT}
      layer={Astal.Layer.OVERLAY}
      application={App}
      cssClasses={["power-menu"]}
      halign={Gtk.Align.FILL}
      valign={Gtk.Align.FILL}
      keymode={Astal.Keymode.EXCLUSIVE}
      onKeyReleased={(_, val, code, mod) => {
        if (val === Gdk.KEY_Escape || val === Gdk.KEY_q) {
          toggle();
        }
      }}
      onKeyPressed={(_, val, code, mod) => {
        if (
          val === Gdk.KEY_Return ||
          val === Gdk.KEY_KP_Enter ||
          val === Gdk.KEY_space
        ) {
          if (current_selection.get() === 0) {
            btns[0].emit("clicked");
          } else if (current_selection.get() === 1) {
            btns[1].emit("clicked");
          }
        }

        if (val === Gdk.KEY_l || val === Gdk.KEY_rightarrow) {
          current_selection.set((current_selection.get() + 1) % btns.length); // % btns.length to ensure it wraps around correctly
        }
        if (val === Gdk.KEY_h || val === Gdk.KEY_leftarrow) {
          current_selection.set(
            (current_selection.get() - 1 + btns.length) % btns.length, // % btns.length to ensure it wraps around correctly
          );
        }
      }}
    >
      <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} spacing={20}>
        {menus(
          [
            {
              lable: "ShutDown",
              icon: "",
              on_click: () => {
                toggle();
                exec(["systemctl", "poweroff"]);
              },
            },
            {
              lable: "Reboot",
              icon: "",
              on_click: () => {
                toggle();
                exec(["systemctl", "reboot"]);
              },
            },
            {
              lable: "Logout",
              icon: "󰗽",
              on_click: () => {
                toggle();
                exec(["niri", "msg", "quit"]);
              },
            },
          ],
          btns,
          current_selection,
        )}
      </box>
    </window>
  );
}
