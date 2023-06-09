---
date: 2014-08-14
title: cocos2d-x使用PC-lint
category:
- 技术
tag:
- cocos2d
- C++
- 优化
---
# cocos2d-x使用PC-lint
## PC-lint
PC-lint是一款C/C++静态分析工具，功能非常强大，应有尽有。[PC-lint官方网站][1]
* 支持大部分的编译器
* 支持大部分的IDE
* 跨平台，类Unix版本名为FlexeLint
* 可检查代码中隐含的错误，和提供编码建议，检查非常严格
> 注意：本文稍长，主要解决的问题是，在VS2012/2010上配置PC-lint，实现检查cocos2dx工程的代码。
## PC-lint的安装配置
### 1. 安装
PC-lint为付费软件，详情请看官网。想体验一下的，可自行寻找破解版。(= =!)不多说，不支持盗版。。。
使用安装包中的`setup.exe`，一路确定安装，非常简单。
### 2. 版本升级，打补丁
安装完成后，在cmd中输入`lint-nt -v`，查看版本，如果与最新版本不一致，可以到官网下载补丁进行版本升级。[升级补丁页面][2]
> 注意：补丁区分32位和64位版，按需下载。
升级方法：
1. 下载补丁工具解压，以`patch.exe`为例，它是命令行工具，需要在cmd下运行。
2. 按顺序打补丁来完成升级，假如你的pc-lint版本号为9.00b，那么你需要依次升级到9.00c、9.00d、9.00e...直到最新，这需要下载b-c、c-d、d-e...直到最新的补丁。
3. 升级工具和升级补丁全部复制到PC-lint安装目录。
3. 在cmd中，输入`patch [补丁文件名]`就可以进行升级了。
### 3. PC-lint配置
双击安装目录中的`CONFIG.exe`进行配置，按照以下步骤选择即可。
1. PC-lint安装目录（如：`C:\lint`），选择`Create a new STD.LNT`
2. 选择编译器，没有`VC 2010/2012`选项，选择Microsoft Visual C++ 2008(co-msc90.Int)即可。
3. 根据情况选择32/64 bit
4. 选择常用的Libraries，如：Active Template Library(ATL), Microsoft Foundation Class Library, Standard Template Library, Windows 32-bit
5. 选择Scott Meyers(Effective C++ More Effective C++ and Effective C++ 3rd Edition)， Dan Saks，MISRA 2004，这些是经典C++著作中提出的C++规范。
6. Create -i options
7. 添加header目录
		-i"C:\Program Files\Microsoft Visual Studio 10.0\VC\include"
		-i"C:\Program Files\Microsoft Visual Studio 10.0\VC\atlmfc\include"
		-i"C:\Program Files\Microsoft SDKs\Windows\v7.0A\Include"
8. No
9. 选择(env-vc9.Int)Microsoft's Visual C++.NET 2008
10. Prepend my PC-lint directory to my PATH(create LSET.BAT)
[PC-lint配置参考][3]
配置完成后，安装目录生成`std.lnt`文件，它是PC-lint的配置文件，其中引用了检查规则文件`*.lnt`和检查时需要的头文件目录。
### 4. 配置VS 2012，及使用方法
在[升级补丁页面][2]下载，`co-msc110.lnt、co-msc110.h、env-vc10.lnt`，放入PC-lint安装根目录。
1. 编辑`std.lnt`文件，将`co-msc90.lnt`修改为`co-msc110.lnt`
2. 集成到`Visual Studio`，Tool -> External Tools，选择Add：
		Title：工具名，如：PL-SimpleCheck
		Command：C:\lint\lint-nt.exe
		Arguments：-i"c:\lint" std.lnt env-vc10.lnt "$(ItemFileName)$(ItemExt)"
		Initial Directory：$(ItemDir)
		勾选"Use Output window”，后点击OK就完成了。
	完成后，Tool菜单中出现该工具，这个只能分析一个.cpp文件。
3. 同上操作，加入如下内容：
		Title:          PC-lint (Project Creation)
    	Command:        c:\lint\lint-nt.exe
   	 	Arguments:      -v -os("$(TargetName).lnt") "$(ProjectFileName)"
    	Init. Dir.:     $(ProjectDir)
	这个工具会在工程目录生成`xx.lnt`文件，其中定义了工程所有需要检查的.cpp路径。
4. 继续加入工具：
	    Title:          PC-lint (Project Check)
    	Command:        c:\lint\lint-nt.exe
    	Arguments:      -i"c:\lint" std.lnt env-vc10.lnt "$(TargetName).lnt"
    	Init. Dir.:     $(ProjectDir)
		勾选"Use Output window”
	这个工具需要与上一个配合使用，检查3中生成的`xx.lnt`文件中定义的.cpp，达到检查整个工程的目的。
那么一个工作流就可以是：
* 使用SimpleCheck检查某个.cpp中的问题
* 使用ProjectCreation一次，再使用ProjectCheck，检查整个工程。(速度很慢，可以在休息时检查。)
### 5. 修改lnt文件，检查cocos2d-x工程
检查cocos2d-x工程时，出现的唯一错误就是找不到xxx头文件，只要在`lnt`文件中加入`-i"header目录"`格式的头文件目录即可。工程头文件找不到修改`xxx.lnt`，系统头文件找不到修改`std.lnt`。
例如：
	//std.lnt
	...
	-i"C:\cocos2d-x\cocos2dx\include"
	-i"C:\cocos2d-x\cocos2dx"
## 附录
### 其它静态分析工具
了解了相当多的类似工具，个人的调研结果如下：
* pclint/flexelint：资历最老，牌子最响，功能强大应有尽有。付费，超级贵。(可用破解版尝试)
* include what you use：google的项目，针对Clang编译器，10年停更，支持到3.4。。。现在都5.1了。并且，看起来要编译Clang，据实战经验，源码加编译后的符号文件5G+。
* cppclean：google的项目，功能不如iwyu强大，头文件清楚功能还在计划中，没有class declaration建议。
* Eclipse CDT插件Includator：这种集成方式相当简化，安装、试用都很方便，但是貌似不能处理C++/Java混编译的项目，所有功能执行后都报错。这可能是我用ndk编译的问题。也需要付费。
* Eclipse CDT自带分析工具，Codan，它没有头文件包含的检查功能！
* cppcheck，也没有头文件相关功能。
* deheader，Eric raymond写的工具，但是编译环境不允许啊...不是纯C++工程，所以工具执行make后，报错，编译不通过。
[1]: http://www.gimpel.com/html/pcl.htm "PC-lint官网"
[2]: http://www.gimpel.com/html/ptch90.htm "PC-lint补丁"
[3]: http://blog.csdn.net/jbcjay/article/details/7389543 "PC-lint配置参考"
