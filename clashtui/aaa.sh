#!/bin/bash

base="https://raw.githubusercontent.com/JohanChane/clashtui/main/contrib/default_configs"

# Mihomo
curl -o ~/.config/clashtui/mihomo/core_override_config.yaml \
  "${base}/mihomo/core_override_config.yaml"
cp ~/.config/clashtui/mihomo/core_override_config.yaml \
  ~/.local/clashtui/mihomo/config/config.yaml

# sing-box
curl -o ~/.config/clashtui/sing-box/core_override_config.json \
  "${base}/sing-box/core_override_config.json"
cp ~/.config/clashtui/sing-box/core_override_config.json \
  ~/.local/clashtui/sing-box/config/config.json

curl -o ~/.config/clashtui/default_keymap.yaml \
  "${base}/default_keymap.yaml"
curl -o ~/.config/clashtui/default_theme.yaml \
  "${base}/default_theme.yaml"
