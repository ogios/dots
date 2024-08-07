#!/bin/bash

# 获取总内存
total_memory=$(free -m | awk '/Mem:/ {print $2}')

# 获取已使用的内存
used_memory=$(free -m | awk '/Mem:/ {print $3}')

# 计算内存占用百分比
memory_usage=$(echo "scale=4; $used_memory / $total_memory * 100" | bc)

# 将内存占用百分比转换为0到1之间的浮点数
memory_ratio=$(echo "scale=4; $memory_usage / 100" | bc)

# echo "内存占用百分比: $memory_usage%"
# echo "内存占用比率: $memory_ratio"
echo -n "0$memory_ratio"
