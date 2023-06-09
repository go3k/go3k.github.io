---
comments: true
date: 2012-11-28
slug: cocos2dx-add-webview
title: cocos2d-x在iOS/Android双平台上嵌入WebView
category:
- 技术
tag:
- cocos2d
- webview
- iOS
- Android
---
感谢党感谢国家，感谢攀哥、教主、锋哥。
游戏中的帮助和游戏公告，可以通过嵌入显示WebView的方案来实现，通过编辑HTML来修改、更新公告的样式和内容都很方便。
# iOS平台嵌入
iOS平台上的嵌入很顺利，网上有现成的教程加代码，关键是做好OC与C++代码混编的封装。
参考如下链接中的实现方式：
[cocos2d-x 使用UIWebView加载网页](http://www.cocos2dev.com/?p=248)
<!-- more -->
# Android平台嵌入
##  1. 通过JNI从cocos2d-x的C++代码调用java代码。
这是Android实现WebView嵌入的前提条件，务必仔细的学习一遍，否则无法向下继续。
详情参见：
[JNI使用教程](http://go3k.org/?p=49)
这是我总结的一篇JNI使用的教程，基本涵盖所有JNI使用相关的要点。
##  2. java代码的实现
标准Android显示WebView的实现，参考代码如下：
        public void displayWebView() {
        	this.runOnUiThread(new Runnable() {
                public void run() {
    //actInstance为成员变量，是当前的Activity。   m_webView是WebView类型的成员变量
                	LinearLayout layout = new LinearLayout(actInstance);
                	actInstance.addContentView(layout, new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.FILL_PARENT));
                	m_webView = new WebView(actInstance);
                	layout.addView(m_webView);
                	LinearLayout.LayoutParams linearParams = (LinearLayout.LayoutParams) m_webView.getLayoutParams();
    //可选的webview位置，x,y,width,height可任意填写，也可以做为函数参数传入。
                	linearParams.leftMargin = x;
                	linearParams.topMargin = y;
                	linearParams.width = width;
                	linearParams.height = height;
                	m_webView.setLayoutParams(linearParams);
    //可选的webview配置
                	m_webView.setBackgroundColor(0);
                	m_webView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
                	m_webView.getSettings().setAppCacheEnabled(false);
                }
            });
        }
这里需要注意的问题是：
JNI调用过来的代码并不是在主线程程序流中，UI显示需要放到主线程中进行。这个问题卡了我半天的时间，最后问了锋哥才明白Android上需要这么搞。
### 源码分享
抽时间Github上建了项目，地址如下：
[https://github.com/go3k/CCXWebview](https://github.com/go3k/CCXWebview)
## 3. 对webView的配置
## 在自定义的webView中跳转链接，而不是打开系统浏览器。
这需要对webView设置WebViewClient，并实现shouldOverrideUrlLoading方法，如下：
## 改变WebView视图的大小与位置
设置webView的LayoutParamaters，setLayoutParams。
参考链接：
[How to add an UIWebView to Cocos2d-x ?](http://www.cocos2d-x.org/boards/6/topics/4450)
