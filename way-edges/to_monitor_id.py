import json5

config_file = "./config.jsonc"

raw = json5.loads(open(config_file, "r").read())

if type(raw) is not dict:
    exit()

groups = raw["groups"]

if type(groups) is not list:
    exit()

name = "slidetest"
to_monitor = 0  # or str


group = None
matched_index = None
for matched_index, group in enumerate(groups):
    if type(group) is not dict:
        continue
    if name == group.get("name", ""):
        break


if group is None or matched_index is None:
    exit()

for widget in group["widgets"]:
    widget["monitor"] = to_monitor


res = json5.dumps(raw, indent=2, ensure_ascii=False, quote_keys=True)

if res is None:
    exit()

open(config_file, "w").write(res)
