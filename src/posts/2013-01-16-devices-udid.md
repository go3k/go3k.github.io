---
comments: true
date: 2013-01-16
title: Android、iOS设备唯一标识问题
category:
- 技术
tag:
- iOS
- Android
- UDID
- cocos2d
---
为了标明用户身份，便于数据统计，设备唯一标识在移动App开发中经常需要用到。
iOS原本是提供UDID供开发者自由获取设备唯一标识的，但Apple老早就公布将不允许应用程序获取UDID，获取UDID的App已经不能上线AppStore了。
查了查资料两边实际上情况差不多，大致有如下方案：
1. IMEI，它是手机设备的标识，并不是所有设备都有IMEI。山寨机甚至有重复的IMEI。
2. wifi Mac地址，阉割wifi模块的设备也不少。
而且这两个值实际上关系用户隐私，并且Android上需要一些权限才能查看，我觉得不太值得。
3. 当然还有生成唯一串，再保存到本地的做法。可是，删除了应用怎么办？
综合考虑，纠结了一下，我觉得使用开源的OpenUDID方案解决。
它不依赖机器的其它唯一值，并且它能一定程度上保证UDID值唯一且可以持久保持(即使删除也不会改变 )。
<!-- more -->
大致看了下iOS的实现思路
1. 用生成唯一标识的算法生成唯一码
2. 唯一码保存到本地，再把唯一码放入所有应用程序公用的剪贴板
3. 这样所有使用OpenUDID的应用都会共用同一个唯一码，共同保证唯一码不会随意消失或改变。
4. 但实际上，还是存在唯一码改变的情况。不过，我认为这是极少发生的情况，不刻意的让udid丢失是不会产生问题的。
源码Github地址为：[https://github.com/ylechelle/OpenUDID](https://github.com/ylechelle/OpenUDID)
