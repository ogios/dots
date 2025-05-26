import { exec } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk4";

export default {
  window: PowerMenu,
  toggle,
};

function get_current_output_niri() {
  const j = exec(["niri", "msg", "-j", "focused-output"]).trim();
  return JSON.parse(j).name;
}

function toggle() {
  const current_output = get_current_output_niri();
  App.toggle_window(`power-menu-${current_output}`);
}

function PowerMenu(monitor: Gdk.Monitor) {
  const { TOP, LEFT, BOTTOM, RIGHT } = Astal.WindowAnchor;

  const name = `power-menu-${monitor.get_connector()}`;
  print(`spawning power menu for ${name}`);

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
    >
      <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} spacing={20}>
        <button focusable={false} label="Shutdown" />
        <button focusable={false} label="Reboot" />
      </box>
    </window>
  );
}
