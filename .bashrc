#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
alias grep='grep --color=auto'
PS1='[\u@\h \W]\$ '

# 设置代理函数
function on() {
  export https_proxy=http://127.0.0.1:7890
  export http_proxy=http://127.0.0.1:7890
  export all_proxy=socks5://127.0.0.1:7890

  git config --global https.proxy http://127.0.0.1:7890
  git config --global https.proxy http://127.0.0.1:7890
}
# 取消代理函数
function off() {
  unset https_proxy
  unset http_proxy
  unset all_proxy

  git config --global --unset http.proxy
  git config --global --unset https.proxy
}

eval "$(starship init bash)"

# HSTR configuration - add this to ~/.bashrc
alias hh=hstr                   # hh to be alias for hstr
export HSTR_CONFIG=hicolor      # get more colors
shopt -s histappend             # append new history items to .bash_history
export HISTCONTROL=ignorespace  # leading space hides commands from history
export HISTFILESIZE=10000       # increase history file size (default is 500)
export HISTSIZE=${HISTFILESIZE} # increase history size (default is 500)
# ensure synchronization between bash memory and history file
export PROMPT_COMMAND="history -a; history -n; ${PROMPT_COMMAND}"
function hstrnotiocsti {
  { READLINE_LINE="$({ </dev/tty hstr ${READLINE_LINE}; } 2>&1 1>&3 3>&-)"; } 3>&1
  READLINE_POINT=${#READLINE_LINE}
}
# if this is interactive shell, then bind hstr to Ctrl-r (for Vi mode check doc)
if [[ $- =~ .*i.* ]]; then bind -x '"\C-r": "hstrnotiocsti"'; fi
export HSTR_TIOCSTI=n

# Use bash-completion, if available
[[ $PS1 && -f /usr/share/bash-completion/bash_completion ]] &&
  # . /usr/share/bash-completion/bash_completion
  . /usr/share/bash-completion/bash_completion

export PATH=/home/ogios/go/bin:/home/ogios/.cargo/bin:$PATH

alias tserv_start="systemctl --user restart cptserv-server"
alias tserv_close="systemctl --user stop cptserv-server"

alias ssh-agent-cyg='eval `ssh-agent -s`'

# yazi
function yy() {
  local tmp="$(mktemp -t "yazi-cwd.XXXXXX")"
  yazi "$@" --cwd-file="$tmp"
  if cwd="$(cat -- "$tmp")" && [ -n "$cwd" ] && [ "$cwd" != "$PWD" ]; then
    cd -- "$cwd"
  fi
  rm -f -- "$tmp"
}

# default editor
export EDITOR=neovide

function wre() {
  pkill -9 way-edges
  nohup way-edges daemon >/dev/null &
  sleep 1 && way-edges add common

  case $CURRENT_COMPOSITOR in
  hyprland)
    way-edges add hyprland
    ;;
  niri)
    way-edges add niri
    ;;
  *)
    echo NO COMPOSITOR SPECIFIED
    ;;
  esac
}

# Created by `pipx` on 2024-11-12 10:24:56
export PATH="$PATH:/home/ogios/.local/bin"
