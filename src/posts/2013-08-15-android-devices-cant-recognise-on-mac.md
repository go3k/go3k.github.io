---
title: "Android devices can't recognise on Mac"
date: 2013-08-15
comments: true
category:
- 技术
tag:
- Android
- adb devices
---
# Android设备在Mac上不能识别
## 问题
本来Mac上做Android调试非常简单，实际上大部分Android手机在Mac上都是即插即用，完全不需要安装驱动。But，偏偏就有大量的国产手机识别不出来，实在是无法吐槽。
`adb`命令完全不能识别，Eclipse上也就找不到设备了。
## 解决方法
在`~/.android/adb_usb.ini`文件中加入供应商ID/Vender ID。
具体如下：
### 找到Vender ID
打开应用“系统信息”/"System Information"，可以在Application里找到。
Hardware -> USB，点击你此时连在电脑上的Android设备的一项，出现设备详细信息。Vender ID/供应商ID就在这。
执行命令：
	echo 0x9d17 >> ~/.android/adb_usb.ini
把ID写入到`adb_usb.ini`，然后命令：
	adb kill-server
	adb devices
就完成了。
---------
### 最新更新
华为手机用该方法仍旧不能识别，据说底层把adb处理权限锁定了。。。简直是山寨中的战斗机，开发机远离华为吧，无解。
参考：[StackOverFlow Detail Answer](http://stackoverflow.com/a/7136003/1773317)
