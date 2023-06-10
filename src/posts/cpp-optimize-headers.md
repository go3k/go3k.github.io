---
date: 2014-07-31
title: C++项目优化头文件包含
category:
- 技术
tag:
- C++
- optimize
---
当一个C++项目越来越庞大，编译时间会慢的让人难受。虽说编译执行的语言在编译阶段都存在类似的问题，但是很多时候错误的编码习惯才是这类问题的根源。

## 头文件包含问题

如果你的项目随便修改了某个头文件，就造成整个项目大规模的重新编译，那么就需要注意头文件包含问题了。

问题原因是，C/C++中`#include`是一个预编译关键字，预编译处理时它会将`#include`后面的文件内容直接复制过来。当include后面的文件有修改，那么当前文件也会被认为有修改，该文件会被重新编译。举例说明：

```
	//A.h
	void A_dosth();
	//B.h
	#include "A.h"
	void B_dosth();
	//B.cpp
	#include "B.h"
	void B_dosth()
	{
		//......
	}
```

如果`A.h`或`B.h`任一文件有修改，那么`B.cpp`就会被重新编译。

可以想象一下更加复杂的情况，头文件之间互相嵌套包含，当嵌套关系上的任何一个头文件修改时，所有包含它的文件都会重新编译。如果不加以控制，整个项目就像蝴蝶效应一般，牵一发动全身。每个修改都将带来大量文件的编译，开发效率极受影响。

## 建议编码原则

* 头文件中尽量使用类前置声明，避免在头文件中包含其它头文件。[Google c++ Style Guide](http://google-styleguide.googlecode.com/svn/trunk/cppguide.xml?showone=Forward_Declarations#Forward_Declarations)
* 使用PIMPL，降低不同模块之间的编译依赖。具体参考：[csdn文章](http://blog.csdn.net/wo17fang/article/details/25280577)
* Unity Build，把关联的cpp包含到一个`all.cpp`中 ,然后只编译`all.cpp`。
* 面向接口编程，定义好模块的接口。代码尽量接近MVC模式，只在Controller部分做各模块间的通信。
* 不要滥用单例模式，例如：Datamanager单例用于获取数据，开发过程中数据结构和接口会经常变化和新增的；如果到处使用datamanager单例获取数据，那么每次对datamanager的修改会造成代码大规范编译。

## 自动化工具

代码重构后，忘记删除某些头文件包含。积累下来，项目中有很多unused include。人工检查这类问题会费时费力，下面推荐一些工具化的手段。

### Visual Studio 12自带功能

* vs中的showinclude选项，编译时可以显示每个cpp中使用的所有头文件，是一个层级结构，这可以帮助分析。如果某个文件重复出现，则认定为重复包含。
* Generate Graph of Include Files，这个功能非常强大，可以生成某个文件的头文件包含情况图，可以用来非常直观的分析头文件的包含结构。其实这个功能，可以反应程序结构设计好坏，协助及时发现设计问题。

### C/C++静态分析工具PC-lint

资历最老，牌子最响，功能非常强大应有尽有。
* 支持大部分的编译器
* 支持大部分的IDE
* 可检查代码中隐含的错误，检查非常严格；提示unused include情况，提供类前置声明建议；等等
* 跨平台，类Unix版本名为Flexe-Lint

[PC-lint官方网站](http://www.gimpel.com/html/pcl.htm)

## 参考链接
[如何加快C++代码的编译速度](http://www.cnblogs.com/baiyanhuang/archive/2010/01/17/1730717.html)
