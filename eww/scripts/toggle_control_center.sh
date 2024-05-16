#!/bin/bash

state=false
if [[ ! -z $(eww active-windows | grep 'control_center') ]]; then
	state=true
fi
echo $state

open_control_center() {
	eww open control_center
}

close_control_center() {
	eww close control_center
}

case $1 in
close)
	close_control_center
	exit 0
	;;
esac

case $state in
true)
	close_control_center
	;;
false)
	open_control_center
	;;
esac
