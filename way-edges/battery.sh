#!/bin/bash

# output battery percentage within 0-1

battery_percentage() {
  local battery=$(cat /sys/class/power_supply/BAT0/capacity 2>/dev/null)
  if [ -z "$battery" ]; then
    echo -n "0"
  else
    echo "scale=2; $battery / 100" | bc
  fi
}

a=$(battery_percentage)

# trim blank spaces and break lines
# a=$(echo "$a" | tr -d '[:space:]' | tr -d '\n')

echo -n "$a"
