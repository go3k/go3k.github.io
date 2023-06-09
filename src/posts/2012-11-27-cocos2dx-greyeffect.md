---
comments: true
date: 2012-11-27
slug: cocos2dx-greyeffect
title: cocos2d-x实现图像灰度渐变效果
category:
- 技术
tag:
- cocos2d
- effect
- OpenGL
---
游戏中有一处效果需要做灰度渐变，首先想到使用CCRGBAProtocol的setColor，但发现效果与预期不一样。SetColor是图像与目标颜色做直接混合，混合出的结果是相当于在原图的基础上放了一张蒙板，远未达到灰度图的样子。
于是，Google一下，从如下文章中找到思路：
[在cocos2d-x2.0上用shader实现灰度图](http://www.cnblogs.com/j1223jesus/archive/2012/10/17/2727096.html)
[CSS+Canvas+jQury实现图片灰度渐变效果](http://my.oschina.net/py115/blog/65265)
尤其看到第2篇文章中的示例效果，与预想中完全相同。
<!-- more -->
大致实现思路如下：
1. 通过写Fragment Shader，在做图像颜色换算时加入“RGB转灰度换算”，Google一下关键字，找到转换算法。公式如下：Gray = R*0.299 + G*0.587 + B*0.114
2. 创建一张原图，一张灰度图。原图做渐变消失FadeOut，灰度图做渐变出现FadeIn。
注意：这与另外提供一张灰度图片的方案是相当有差别的，此方案不必进行载入新图片的I/O操作，同时也不必占用多一张的内存。
OK，不算复杂，效果还不错。
