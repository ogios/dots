# 设置代理函数
function on() {
  export https_proxy=http://127.0.0.1:20171
  export http_proxy=http://127.0.0.1:20171
  export all_proxy=socks5://127.0.0.1:20170

  git config --global https.proxy http://127.0.0.1:20171
  git config --global https.proxy http://127.0.0.1:20171
}

# 取消代理函数
function off() {
  unset https_proxy
  unset http_proxy
  unset all_proxy

  git config --global --unset http.proxy
  git config --global --unset https.proxy
}

# 导出环境变量
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx

# source "/usr/share/nvm/init-nvm.sh"
if [[ ! -a ~/.zsh-async ]]; then
  git clone git@github.com:mafredri/zsh-async.git ~/.zsh-async
fi
source ~/.zsh-async/async.zsh

export NVM_DIR="$HOME/.nvm"
function load_nvm() {
  echo "loading nvn..."
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"
}

# Initialize worker
# async_start_worker nvm_worker -n
# async_register_callback nvm_worker load_nvm
# async_job nvm_worker sleep 0.1

alias lnvm=load_nvm

# Go环境变量
export GOROOT=/usr/lib/go
export GOBIN=$GOROOT/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH:$GOBIN:$GOROOT

# lf别名  
function lfcd () {
    tmp="$(mktemp)"
    # `command` is needed in case `lfcd` is aliased to `lf`
    command lf -last-dir-path="$tmp" "$@"
    if [ -f "$tmp" ]; then
        dir="$(cat "$tmp")"
        rm -f "$tmp"
        if [ -d "$dir" ]; then
            if [ "$dir" != "$(pwd)" ]; then
                cd "$dir"
            fi
        fi
    fi
}

alias lf='lfcd'
alias ali="ssh root@47.94.146.109 -p 8022"
# alias acute="ssh ubuntu@sussybot.dynv6.net"
alias acute="ssh ubuntu@ogios.dns.army"

# starship prompt
# eval "$(starship init zsh)"
export _JAVA_AWT_WM_NONREPARENTING=1


alias pstart="systemctl --user start pserv"
alias pstop="systemctl --user stop pserv"
alias pcheck="systemctl --user status pserv"

alias nstart="systemctl --user start notify"
alias nstop="systemctl --user stop notify"
alias ncheck="systemctl --user status notify"

alias tstart="systemctl --user start tserv"
alias tstop="systemctl --user stop tserv"
alias tcheck="systemctl --user status tserv"

alias tcli="/home/ogios/app/tcli/transfer_client"
