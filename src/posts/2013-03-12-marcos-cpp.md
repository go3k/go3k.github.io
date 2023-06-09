---
comments: true
date: 2013-03-12
slug: cc%e4%b8%ad%e7%9a%84%e3%80%81%e5%92%8c__va_args__
title: C/C++中的#、##和__VA_ARGS__
category:
- 技术
tag:
- C++
---
## `#`
\#的作用是把符号转化为字符串，例如：
	#define FUN(x) printf(#x)
	//使用
	FUN(2 + 4);
	//输出结果，把2 + 4转为“2 + 4”然后打印
	2 + 4
## `##`
`##`的作用是联接两个符号，例如：
	#define XNAME(n) x##n
	//使用
	int XNAME(1) = 12;	//意为：int x1 = 12;
## `__VA_ARGS__`
`__VA_ARGS__`是可变参数宏，用于对函数原型中`…`参数的宏替换，常用于`printf(…)`这种函数的宏定义，例如：
> 为了方便，做一个printf函数的log开关，定义一个代替printf函数的宏。不想log输出时，将宏定义为空。
	#define kDEBUG 0
	#if kDEBUG
		#define GLOG(…) printf(__VA_ARGS__)
	#else
		#define GLOG(…)
	#endif
###一种特殊情况
有时候需要定义这样的宏，比如：`GLOG(format, …)` 对应函数`printf(const char* a, …)`
如果简单的做如下宏定义，就会有一些问题
	#define GLOG(format, …) printf(format, __VA_ARGS__)
	//调用
	GLOG("abcd");			//编译错误
	GLOG("abcd = %d", 12);	//正常
`GLOG("abcd")`会编译错误，是因为`GLOG`宏定义中有一个`,`逗号存在，宏展开以后出现了一个多余的逗号导致编译出错。
	GLOG("abcd") -> printf("abcd",)
可以使用`##`操作符提示编译器，去掉这个逗号。如：
	#define GLOG(format, …) printf(format, ##__VA_ARGS__)
这样就正常了。
