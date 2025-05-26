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
          current_selection.set((current_selection.get() + 1) % 2);
        }
        if (val === Gdk.KEY_h || val === Gdk.KEY_leftarrow) {
          current_selection.set((current_selection.get() - 1 + 2) % 2); // +2 to ensure it wraps around correctly
        }
      }}
    >
      <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} spacing={20}>
        <button
          widthRequest={300}
          heightRequest={300}
          setup={(b) => (btns[0] = b)}
          cssClasses={current_selection((n) => (n === 0 ? ["selected"] : []))}
          onHoverEnter={() => current_selection.set(0)}
          onClicked={() => {
            toggle();
            exec(["systemctl", "poweroff"]);
          }}
          focusable={false}
          label=""
        />
        <button
          widthRequest={300}
          heightRequest={300}
          setup={(b) => (btns[1] = b)}
          cssClasses={current_selection((n) => (n === 1 ? ["selected"] : []))}
          onHoverEnter={() => current_selection.set(1)}
          onClicked={() => {
            toggle();
            exec(["systemctl", "reboot"]);
          }}
          focusable={false}
          label=""
        />
      </box>
    </window>
  );
}
