---
comments: true
date: 2013-03-14
slug: android-crash-call-to-opengl-api-without-a-current-context
title: Android crash “Call to openGL API without a current context”
category:
- 技术
tag:
- Android
- cocos2d
---
最近在做各种第三方渠道的SDK接入，国内的Android第三方游戏平台实在是多。。。SDK接入的方式实在五花八门，有些SDK做的实在有够烂，做接入实在苦逼。（吐槽完毕）
之前我做了几个渠道接入和游戏内支付，360、iapppay、Appstore的IAP，已经把客户端结构搭建好、辅助API封闭完毕，服务端也全部调通可以做其它第三方平台接入扩展了。这次就简要说明流程，把任务交下去做了。
**没想到。。**
##Crash原因
当乐SDK接入时产生了这个问题，java部分处理完毕，JNI native方法把结果通知到C++后就crash了，日志错误为：
	Call to openGL API without a current context
<!-- more -->
排除了客户端代码异常后，Google it，发现：
> From the GLSurfaceView documentation:
> "There are situations where the EGL rendering context will be lost. This typically happens when device wakes up after going to sleep. When the EGL context is lost, all OpenGL resources (such as textures) that are associated with that context will be automatically deleted. In order to keep rendering correctly, a renderer must recreate any lost resources that it still needs. The onSurfaceCreated(GL10, EGLConfig) method is a convenient place to do this."
> You need to be aware of lost OpenGL contexts, then reacquire the context and reload all OpenGL resources. It looks like your context is being lost when you display the full-screen file browser.
详见[stackoverflow answer](http://stackoverflow.com/a/3585482/1773317)
有些情况下，GLSurfaceView的rendering context会被清掉，而Context被清掉后再去调用OpenGL方法就会发生Crash，Call to openGL API without a current context。
### 与当乐SDK有关
简单分析后，原因基本确定。当乐SDK的使用方法是，启动一个全屏Dialog，Dialog中内嵌WebView，登录、支付的操作都在WebView中进行，最后关闭Dialog把结果返回。所以，Dialog加载WebView后，把Main Activity中OpenGL的rendering context清除了，那么之后的调用就会出错。
##解决方法
###思路
很简单，cocos2d-x Android部分有针对解决这个问题的处理方案，见 `/jni/xxx/main.cpp`中，如下函数实现：
	Java_org_cocos2dx_lib_Cocos2dxRenderer_nativeInit
从函数名上可以看出这是一个JNI native方法，它在Cocos2dxRenderer中声明并被调用。当Android app切出后切入(后台转到前台)，从其它Activity切回Cocos2dxRenderer所在Activity时都会被调用。
这个函数实现里会进行OpenGL rendering context创建以及相关的处理，那么我们想办法那这个方法被调用，就可以高效的解决Crash问题。
###方案
把当乐SDK的使用封装到另一个Activity中去，当需要使用当乐SDK时启动并跳转到这个Activity，当乐SDK处理完成时，关闭Activity回到MainActivity。这样就会调用`Java_org_cocos2dx_lib_Cocos2dxRenderer_nativeInit`方法“自动的”重新创建并初始化好OpenGL环境，程序正常运行，不会再发生crash。
### 2013.04.18更新
[参考链接](http://hsienwei.blogspot.com/2012/11/call-to-opengl-es-api-with-no-current.html)
今天又遇到这个问题，而我实在不想用以前的方式解决，于是又Google了一次。
发现这个问题不一定是OpenGL context被清除，还有因为：“在OpenGL Thread以外的Thread呼叫OpenGL指令”。
可以使用GLSurfaceView.queueEvent的方式解決，具体方案见参考链接。
