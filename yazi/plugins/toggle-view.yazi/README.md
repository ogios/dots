# toggle-view.yazi

Toggle the different views: parent, current and preview.

## Installation

```sh
ya pack -a dawsers/toggle-view
```

## Usage

Add this to your `~/.config/yazi/keymap.toml`:

``` toml
[manager]
prepend_keymap = [
    { on = "<C-1>", run = "plugin --sync toggle-view --args=parent", desc = "Toggle parent" },
    { on = "<C-2>", run = "plugin --sync toggle-view --args=current", desc = "Toggle current" },
    { on = "<C-3>", run = "plugin --sync toggle-view --args=preview", desc = "Toggle preview" },
]
```

Now each key will toggle on/off one of the three panels: `Ctrl+1` for
*parent*, `Ctrl+2` for *current* and `Ctrl+3` for *preview*.

You can set your own key bindings.

