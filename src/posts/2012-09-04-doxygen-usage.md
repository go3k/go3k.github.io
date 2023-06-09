---
comments: true
date: 2012-09-04
slug: doxygen-usage
title: Doxygen代码文档生成工具的使用方法
category:
- 技术
tag:
- 开发工具
- doxygen
---
为自己的工程建立文档是非常必要，这可以有效提高代码的开发和维护效率。
Doxygen是一个便捷的文档生成工具，它是一个GPL开源工程，使用的比较普遍。
它的特点是独立于特定的编程语言，支持C++、C、Java、Objective-C、Python等等，基本上可以满足所有编程语言。而且它有社区持续维护，我看到最近的版本更新时间是2012.08，就上个月。
## 使用方法(Mac版)
1. 去Doxygen官网下载需要的Doxygen版本，并且安装。
2. 运行Doxygen，按照提示使用，非常简单。
<!-- more -->
#### 指定working deirectory，选择工程的路径即可。
#### 使用Wizard Tab中的选项进行设置
* Project设置
	输入工程名。(显示为HTML文档中的主标题)  
	版本号  
	logo图片  
	选择代码目录  
	选择文档的输出目录  
* Mode设置
	选择All Entities Mode
* Output
	选择输出文档的类型，HTML即可。
一切配置完成，选择Run Tab，Run doxygen输出文档即可。
## 注释标准
1. 类整体描述
	在头文件的开始处(前面没有任何doxygen注释)，格式如下:
		/**
		@brief The HelloWorld Scene.
		注释 详细内容
		*/
	> @brief 部分不是必须的，加入 @brief 可以在文档的最顶部加入简要的描述信息(The HelloWorld Scene.)，后面紧跟一个可以跳转到详细描述的超链接。
2. 成员变量注释
	在成员的上面一行，格式如下:
		/** 注释内容 */
	> 注意，文档中不会显示私有成员信息。public和protected成员都可以显示。
	下面这种格式的注释，也可以。
		int button; /**< "Run Again" button in GUI */
3. 成员函数注释
	在成员函数的上面一行，格式如下:
		/**
		@brief 描述
		@param newNum 参数描述
		@return "value" 返回值描述
		*/
		@brief同样为可选，可在文档的成员函数列表处做为简介显示。
		@param参数描述
		@return返回值描述
	具体可以去Doxygen Manual查，有非常非常多的针对各语言的注释方法，按自己喜好使用。
4. 大招来了
	Mac上使用Doxygen自动生成脚本，高效完成doxygen风格注释。非常好用，非常便捷。
	[参考链接](http://blog.chukong-inc.com/index.php/2012/05/16/xcode4_fast_doxygen/)
	* 安装ThisService.app，Mac上可自定义系统服务的工具软件。
	* 下载Doxygen.rb脚本，它可以把文字输入转为doxygen风格注释输出。
	* 打开ThisService，输入服务名称，选择执行的脚本，还有一些选项可以设置，比如指定服务生效的应用程序。
(我做了在编辑器中有效的设置)
	* 在系统偏好设置->键盘中选择Service标签，找到刚刚添加的服务，为其设置一个快捷键如:Command+option+/。
完成，在XCode中选中一行代码，按快捷键试试效果吧。
