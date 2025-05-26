import { App } from "astal/gtk4";
import style from "./style.scss";
import Bar from "./src/widget/Bar";
import PoweMenu from "./src/widget/PoweMenu";

App.start({
  css: style,
  main() {
    App.get_monitors().map(Bar);
    App.get_monitors().map(PoweMenu.window);
  },
  requestHandler(request: string, res) {
    if (request === "power-menu") {
      PoweMenu.toggle();
    }
    res("");
  },
});
