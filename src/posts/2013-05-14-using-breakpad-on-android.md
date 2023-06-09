---
comments: true
date: 2013-05-14
slug: using-breakpad-on-android
title: Using breakpad on Android
category:
- 技术
tag:
- C++
- Android
---
##breakpad
开源项目，用于C/C++代码的崩溃信息处理
googlecode项目地址为：[breakpad](https://code.google.com/p/google-breakpad/)
应用的项目有：Chrome、Firefox、Picasa、Google Earth等等。
##for android
breakpad支持Android，在源码的根目录中有README.ANDROID文档，详细介绍了如何正确在Android平台使用breakpad。
<!-- more -->
###为什么需要breakpad?
我目前在做cocos2d-x跨Android/iOS平台的游戏，现状是：
* iOS平台的crash report非常好用，可以很方便的统计崩溃，并通过crash report定位崩溃信息（可精确到崩溃函数名称、所在行数）。
* Android平台，机型、ROM比较混乱，出错机率相对高很多；并且因为cocos2d-x本身由cocos2d衍生，cocos2d是基于iOS的游戏引擎，所以cocos2d-x在iOS平台表现较稳定，而在Android平台还存在着各种各样的问题。Android本身提供的crash report机制不能支持对C++库中崩溃的处理。
于是，Android平台上实现一套crash log生成、上传、分析的功能尤为重要。breakpad就是一个不错的选择。
##用法
阅读README.ANDROID
> 以下内容，是我的配置过程记录。
###1. 编译breakpad客户端库，有两种方式：
1.1 通过ndk编译，这种方式非常便捷
a. 包含`android/google_breakpad/Android.mk`到项目的`Android.mk`。可以通过import-module或者直接include实现，示例：
	include $(LOCAL_PATH)/../../google-breakpad/android/google_breakpad/Android.mk
b. link library to one of your modules by using:
	LOCAL_STATIC_LIBRARIES += breakpad_client
1.2 使用独立的Android toolchain编译，我没编译成功，直接使用第1种方式完成的。
>	文档中所有与此方式相关的内容跳过
###2. 使用客户端库
2.1 C++代码中包含`client/linux/handler/exception_handler.h`文件
2.2 注意Android上没有/tmp目录
---
需要一个保存崩溃信息文件的目录
android/sample_app下有一个示例可供参考。
###3.处理log文件
程序crash后，breakpad保存信息到.dmp文件
###4. 编译breakpad工具集
一定要准备Linux环境，按README进行编译。编译出错的话，看error分析，比较顺利，期间我只安装了一次g++就直接编译通过了。
生成符号文件
使用符号文件，分析.dmp中的crash信息。一定要让.sym文件名与.so名相同，这样才可以正常完成符号映射。
###5. 项目中使用
暂空
