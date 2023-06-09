---
comments: true
date: 2013-04-07
slug: cocos2dx-newfeatures
title: 错过的Cocos2d-x更新
category:
- 技术
tag:
- cocos2d
---
由于一些原因，目前项目使用的cocos2d-x引擎在我保持更新到官方2.0.4版本后，没有继续保持与cocos2d-x官方版本的同步，现在已经落下3个版本了。这是项目经理出于引擎更新时间成本的考虑，所做的决定，当时我也没太重视就表示同意了。But，我现在发觉，这一步错了。
##Cocos2d-x 2.0.4版本之后的新特性
总结一下新版本中的新增的Features，考虑是否多花些时间把引擎代码升级。
###修复了无数个bug...
###CocosBuilder相关
<!-- more -->
这几项对使用CocosBuilder做游戏界面开发都大有益处：
* Built in texture packer with support for png, pvr and pvrtc  
* Automatic resizing of assets for different devices
* Automatic audio conversions for different platforms
* Adds support for sound playback directly from the timeline
* Adds support for callbacks from the timeline
* Skew properties can now be animated
###Add new features from cocos2d-iphone
基本保持与cocos2d-iphone中功能的同步
* CCClippingNode
* CCDrawNode
* CCPhysicsDebugNode and CCPhysicsSprite (under extensions/physics_nodes/)
###Accessing to files from APK is boosted
这个比较实用，可以提升Android下游戏i/o操作效率，技术方案如下链接：  
[Android: Access to files from APK is boosted](https://github.com/cocos2d/cocos2d-x/pull/1562)
###Eclipse integration for Android
Android开发中，集成C++代码到Eclipse.
* 可在Eclipse中编译C++代码，可一步编译、运行工程。(但有时候只想clean java部分就麻烦了，clean rebuild整个工程，时间较长。)
* C++代码编辑，代码补全、定义跳转，重命名工具等等。
不能做C++部分的程序断点调试，C++部分崩溃时不能获取崩溃栈信息。So，意义也不是那么的大。
[详细](https://github.com/cocos2d/cocos2d-x/blob/master/samples/Cpp/HelloCpp/proj.android/README.md)
###Add AssetsManager to do auto upgrading
这个比较重磅，资源自动更新功能，这在移动游戏开发中异常重要。程序更新流失率实在太高，选择一个恰当的资源更新机制很有必要。  
[详细](https://github.com/cocos2d/cocos2d-x/blob/master/samples/Cpp/AssetsManagerTest/README.md)
简单看了下实现机制，整体来讲很一般。。。实用价值不高，没有我自己设计的方案好。
1. 测试工程我没跑起来，下载新资源后点击"enter"程序直接崩溃。
2. AssetsManager就做检查版本号，记录版本号，下载指定链接的资源。可定制性极差，连下载过程中的进度信息都没放出监听接口，线程阻塞式下载。
###New tool to create multi-platform projects
加入`tools/project-creator/`目录，其中有`create_project.py`脚本和一些各平台配置的json文本。
试用了下，真心不错。。。比起原来手动创建各平台工程再合并到一起方便多了。可以一次性创建支持android、blackberry、ios、linux、mac、marmalade、win32的工程。
###增强Lua Binding
###增强JS Binding
