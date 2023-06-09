---
comments: true
date: 2013-07-02
slug: 'anroid-wifi-debug'
title: 通过无线进行Android联机调试
category:
- 技术
tag:
- Android
---
# Debug Android App wirless
## Root设备
1. 设备需要Root
2. 安装adbWireless应用
3. 启动应用后直接`adb connect ipaddress`
> [adbWireless](!http://pan.baidu.com/share/link?shareid=3609962329&uk=2818578138)
## 普通设备
1. Connect tablet via USB and make sure debugging is working.
2. adb tcpip 5555
3. adb connect 10.0.0.2:5555 (replace with desired address)
4. Disconnect USB and proceed with wireless debugging.
5. adb usb to switch back when done.
第1种方式非常方便，完全不需要使用数据线。第2种方法麻烦一些。。。有点多此一举。
[参考链接](http://stackoverflow.com/a/10236938)
