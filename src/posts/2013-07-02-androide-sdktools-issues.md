---
comments: true
date: 2013-07-02
slug: android-sdktools-issues
title: Android更新SDK-tools后的各种问题
category:
- 技术
tag:
- Android
---
## 配置配置配置
要用Windows电脑做开发，在配置各种开发环境。整体来说很痛苦。。。问题实在不少。
## ADT版本的问题
为了省去Eclipse和Android SDK、ADT、CDT配置中的各种麻烦，Google推出了整合完全的ADT Bundle，集成了Android开发工具链。下载解压后可直接使用。
为了省事，从同事那里直接拿了一套安装包。但是下载SDK、升级SDK-tools后就出问题了：启动Eclipse会提示ADT版本过低，而在Eclipse里检查更新ADT又找不更新。导致Android SDK根本不能用。
本以为修改一个Eclipse中的ADT版本配置文件了事了，但是发现修改之后SDK-tools中的工具链不能正常使用了，一些工具的名称和位置已经改变了。最后，去官网下载新的ADT Bundle才了事。
## 链接外部jar包的工程崩溃
这个问题搞了半天，工程链接了外部jar包，工程正常编译，但是一旦运行到jar包部分的功能时程序就崩溃。找了半天配置上的问题未果，同事那边没有什么区别的工程就完全运行正常。这种问题最是头疼，找各种配置上的区别，使用上的区别，最后发现还是升级的SDK-tools的原因。
发现我的`.classpath`文件有点区别，多了一行：
	<classpathentry exported="true" kind="con" path="com.android.ide.eclipse.adt.DEPENDENCIES"/>
多亏这一行，让我Google到了解决方案。[解决方案](!http://stackoverflow.com/a/16595708)
想了想，应该是jar包没有导出原因，我发现调试运行后`bin/dexedLibs`下面没有出现需要的包。
## 工具名称和路径变化产生的问题
之前用ant工具，做了自动化打包的脚本。其中通过build.xml来配置各种打包中的处理，tools名称和路径修改后导致之前的build.xml中使用的工具找不到。没办法，需要修改一下。
