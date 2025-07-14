import { Variable } from "astal";
import { App, Astal, Gdk } from "astal/gtk4";

export default function Time(gdkmonitor: Gdk.Monitor, namespace: string) {
  const { TOP, LEFT, BOTTOM, RIGHT } = Astal.WindowAnchor;

  const time = Variable(new Date()).poll(500, () => new Date());

  return (
    <window
      visible
      namespace={namespace}
      cssClasses={["time"]}
      gdkmonitor={gdkmonitor}
      anchor={RIGHT | BOTTOM}
      exclusivity={Astal.Exclusivity.IGNORE}
      layer={Astal.Layer.BACKGROUND}
      application={App}
      margin_right={50}
      margin_bottom={50}
      child={
        <box vertical>
          <label
            cssClasses={["time-hm"]}
            label={time((date) => {
              // time format: HH:MM
              const hours = date.getHours().toString().padStart(2, "0");
              const minutes = date.getMinutes().toString().padStart(2, "0");
              // return string
              return `${hours}:${minutes}`;
            })}
          />
          <label
            cssClasses={["time-date"]}
            label={time((date) => {
              // date format: day-month-year weak(eg: 8-Jun-2023 Thu)
              const day = date.getDate().toString();
              const month = date.toLocaleString("default", { month: "short" });
              const year = date.getFullYear().toString();
              const weekDay = date.toLocaleString("default", {
                weekday: "short",
              });
              // return string
              return `${day}-${month}-${year} ${weekDay}`;
            })}
          />
        </box>
      }
    />
  );
}
