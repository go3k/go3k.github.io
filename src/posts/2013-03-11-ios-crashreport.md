---
comments: true
date: 2013-03-11
title: 处理、分析iOS App的Crash Reports
category:
- 心情
tag:
- crash report
- iOS
- cocos2d
---

## 应用被Reject
很不幸，首次的AppStore应用提交失败了。其中一个原因是：游戏中发生Crash。

`2.1: Apps that crash will be rejected.`

苹果审核与结果通知并没有传说中那么BT加无脑，清清楚楚的列出了Reject原因，并为每个问题附带解决方案的建议,崩溃附带crash log。很清晰，很合理。

## 分析Crash report
Apple的官方文档：[Understanding and Analyzing iOS Application Crash Reports](https://developer.apple.com/library/ios/#technotes/tn2008/tn2151.html)

iOS设备上，当app崩溃时会创建一个"crash report"文件保存在设备上。Crash report文件记录了，app崩溃时的信息，通常包含每个线程的调用堆栈。
<!-- more -->
### Symbolication
分析crash report之前，需要把crash report中的内存地址与函数名、行数进行“符号映射”--Symbolication。

**必须的文件**

* 上传AppStore的app二进制包
* 与二进制包对应的.dSYM文件

每次上传AppStore时的app二进制包也.dSYM文件都一定要保存好。
> 这两个文件必须是严格一一对应的，否则crash report不能完全的符号映射。即使代码没有任何修改，重新编译一次生成的.dSYM文件，与上次编译的app二进制包也是不能对应的。

使用XCode的"Archive"命令可以非常便捷的保存相互对应的app包与.dSYM文件，当完成Product->Archive命令后，可以在XCode Organizer的Archived页面里查看所有Archive过的应用程序。(app上架时，非常推荐用这种方式去提交。)

如果存在互相对应的app二进制包与.dSYM文件，那么XCode会对这个app产生的crash report自动进行符号映射。
> 网上那些使用symbolicatecrash工具进行映射的操作都是多此一举。

**操作步骤**
1. 准备好app包、.dSYM、crash report文件
2. 把crash report导入到XCode Organizer：打开XCode Organizer -> Devices选项 -> 选择左侧LIBRARY分组下的Devices Logs -> 点击Import按钮选择.crash文件。
3. XCode会自动Symbolicate crash report文件，并显示结果。

> 如果你是直接把设置连接到Mac，并从XCode Organizer窗口里直接获取crash report的，那么能够自动进行Symbolication，非常方便。不过多数情况下，我们是分析用户的crash report。

**符号没有映射成功？**

我严格的按照以上所有步骤操作，但是Crash report中与我的app相关的内容依旧显示内存地址并没有映射为可读的代码符号。我花了几个小时的时间搜索各种相关的资料，解决方案，尝试了几乎所有方法还是没能成功解出符号。

最后在github上找到这样的一个回复：

> If you goto Xcode->Organizer click on archives then right-click any archive and
select show in finder. Back up to the folder called Xcode that contains the archive. Run terminal and cd to this folder, you can do this easily by typing 'cd ' then dragging the folder to the terminal. Now type 'mdimport .' and enter. This will take a minute to finish. If you go back to Organizer and find your crash file then press Re-Symbolicate it should now give you method names and line numbers.

按照他的方法操作了一次，居然就成功了。找到Archive操作的.app与.dSYM所在目录，一般是/Users/用户名/Library/Developer/Xcode/Archives(可以在Organizer Archives中，右击Archive包进入)，命令行中cd到/Users/用户名/Library/Developer/Xcode/，输入命令：

	`mdimport .`

意为，把Xcode目录加入到spotlight索引，这可能需要一些时间，等一等。

也可以只导入你需要的.app与.dSYM文件，这样比较快速。

**原来符号不能正确映射的原因是：**

我的.app与.dSYM文件没有被spotlight索引到，导致符号映射失败，Apple的文档中提到：

> If you use the “Build and Archive” command then they will be placed in a suitable location automatically. Otherwise any location searchable by Spotlight (such as your home directory) is fine.

### dwarfdump工具

直接查询崩溃的内存地址，定义崩溃代码的文件与行数。

需要.app与.dSYM文件，不做详细介绍。

示例：
	`dwarfdump –lookup 0x000036d2 –arch armv6 MyApp.app.dSYM`

## 我的结果

经过反复测试，发现崩溃原因是，cocos2d-x引擎的CCBReader扩展中文件读取时，其中有一个操作没有考虑ARM下内存对齐，崩溃并Exception Codes: EXC_ARM_DA_ALIGN。Github上找到新版源码，问题就修复了。
