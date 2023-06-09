---
date: 2016-06-17
title: SLua for Unity简要技术原理
category:
- 技术
tag:
- Unity
- SLua
---
动态更新对于游戏来说非常重要，它可以极大缩短bug修复、新功能添加的时间成本，同时强制版本更新造成的用户流失也是一大痛点。对于Unity游戏开发者来说，Slua是一个不错的选择。
这里简要介绍一下Slua的技术原理，Slua Github的项目主页好像没有提及，一些关键代码看起来也都集成到dll文件中了，很难从源码找出一些原理方面的线索。用一个完全不清楚原理的库感觉很慌啊，挖掘了一些有意义的信息，基本可以解释Slua的技术原理，这里罗列一下。
## 原理
从wiki中可以看出Slua是一个可以将C#接口导出到lua进行调用的模块，从一些issue回复和博客中可以看出，作者对Slua的定位是：仅专注解决lua和c#绑定的问题, 保证这部分功能足够内敛精简。
那么其原理是什么？c#和lua怎样互相调用的？
答案是LuaInterface：LuaInterface is a library for integration between the Lua language and Microsoft .NET platform's Common Language Runtime (CLR). Lua scripts can use it to instantiate CLR objects, access properties, call methods, and even handle events with Lua functions.
这是完成C#到Lua绑定的基础。
### 实际感受一下
不亲自使用一下，感觉LuaInterface这个答案就不靠谱，而且只知道一个概念这根本谈不上深入理解。LuaInterface早已停止更新，并且完全没有资料说明其使用方法，但是我找到了其后续开源项目NLua [https://github.com/NLua/NLua](https://github.com/NLua/NLua)。NLua这个项目还在持续维护中，支持新版本.net，README写的很详细，很容易就可以集成到一个c#程序进行与Lua之间的通信。推荐实际使用一下，README中说明了方法调用的语法和关键字用途，这些信息也很有价值。
> 我想SLua没有使用NLua是因为Unity使用的Mono版本太低，NLua不能直接用在Unity项目中。
### cstolua
LuaInterface已经完成了c#和lua的绑定，但是其效率比较低，cstolua可以极大的提升效率，罗列的优势如下：
1. 极大的提升效率，luainterface采用反射调用c#函数，性能较差
2. 可以扩展操作符函数到lua中
3. 可以支持可变参数列表
4. 更好的控制c#函数可见性
5. 可以修改包裹类，更快的回收内存
6. 可以支持数组参数。可以在lua端用table传递传递数组参数
7. 处理二义性。如lua number参数类型可以对应很多c#函数，自动选取精度最高的函数
8. 支持重载函数
9. 类型强匹配，如果某个参数在lua传递nil,可通过重载函数支持，或者使用object参数
10. 解决重载函数参数匹配优先级问题。对于object之类类型最后匹配，优先使用更精确的匹配
11. 严格区分枚举类型和int值，避免造成某些u3d重载函数混淆
12. 支持导出模板类。可以作为自定义类型导出到lua中。不建议使用（使用lua table）
### import语法是怎么回事？
以上来就发现这个问题，lua中找不到import函数的定义，SLua源码中也了无踪影。我不禁要问，import是什么？用来做什么的？怎么使用？
发现它是LuaInterface提供的函数，用来导入assembly的内容。
Recent versions of LuaInterface also provide an 'import' function which lets you import an assembly's contents into the global namespace. It doesn't actually create global symbols, it just adds an index function to the global metatable that looks things up in imported assemblies if they don't match true globals.
