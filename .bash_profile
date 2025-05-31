#
# ~/.bash_profile
#

[[ -f ~/.bashrc ]] && . ~/.bashrc

export PATH=/home/ogios/go/bin:/home/ogios/.cargo/bin:$PATH

export PATH="/home/ogios/.bun/bin:$PATH"

export PATH="$PATH:/home/ogios/.local/bin"
# Created by $(pipx) on 2024-11-12 10:24:56

# Load pyenv automatically by appending
# the following to
# ~/.bash_profile if it exists, otherwise ~/.profile (for login shells)
# and ~/.bashrc (for interactive shells) :

export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init - bash)"

# Restart your shell for the changes to take effect.
