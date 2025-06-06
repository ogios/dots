import { App, Astal, Gdk } from "astal/gtk4";
import PoweMenu from "./PoweMenu";

export default {
  TogglePowerMenu,
  button,
};

function button() {
  return (
    <button
      widthRequest={100}
      heightRequest={100}
      onClicked={PoweMenu.toggle}
      focusable={false}
    />
  );
}

function TogglePowerMenu(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, BOTTOM, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      visible
      namespace="ags"
      cssClasses={["toggle-power-menu"]}
      gdkmonitor={gdkmonitor}
      anchor={RIGHT | TOP}
      layer={Astal.Layer.BOTTOM}
      application={App}
      margin_right={50}
      margin_top={50}
      child={button()}
    />
  );
}
