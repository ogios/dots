import { App } from "astal/gtk4";
import style from "./style.scss";
import Bar from "./src/widget/Bar";
import PoweMenu from "./src/widget/PoweMenu";
import TogglePowerMenu from "./src/widget/TogglePowerMenu";

App.start({
  css: style,
  main() {
    App.get_monitors().map(Bar);
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
