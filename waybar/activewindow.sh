#!/bin/sh
niri msg focused-window | grep Title | sed "s# Title: \"\(.*\)\"#\1#"
