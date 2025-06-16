import { App } from "astal/gtk4";
import style from "./style.scss";
import SystemMonitor from "./src/widget/SystemMonitor";
import PoweMenu from "./src/widget/PoweMenu";
import TogglePowerMenu from "./src/widget/TogglePowerMenu";
import Time from "./src/widget/Time";

App.start({
  css: style,
  main() {
    App.get_monitors().map((m) => SystemMonitor(m, "ags-backdrop"));
    App.get_monitors().map((m) => SystemMonitor(m, "ags-front"));

    App.get_monitors().map((m) => Time(m, "ags-backdrop"));
    // App.get_monitors().map((m) => Time(m, "ags-front"));

    App.get_monitors().map(PoweMenu.window);
    App.get_monitors().map(TogglePowerMenu.TogglePowerMenu);
  },
  requestHandler(request: string, res) {
    if (request === "power-menu") {
      PoweMenu.toggle();
    }
    res("");
  },
});
