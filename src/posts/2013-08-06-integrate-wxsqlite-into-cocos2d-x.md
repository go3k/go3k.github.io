---
title: "Integrate wxSqlite into Cocos2d-x"
date: 2013-08-06
comments: true
category:
- 技术
tag:
- cocos2d
- sqlite3
---
# cocos2d-x中使用支持加密扩展的Sqlite
## 简述
sqlite小巧快速，非常适合在移动设备上做为复杂数据结构做数据库管理的支持。但是其存储完全明文，寻求数据加密的支持非常必要。
开始觉得加密这事也不怎么复杂，两种方案：
#### 数据项加密
只对数据表中的数据项加密。
* 优点：是实现简单，找个加密算法就Ok了；
* 缺点：每次数据读写都要做一次加密操作，效率非常低；整个数据库的数据表结构是暴露的。
#### 数据库文件加密
对数据文件加密，感觉上实现不复杂，也避免了数据项加密的问题。
开始想，只要读入文件流，再把流解密，然后用sqlite接口初始化就搞定了。But，sqlite库根本不给你使用流数据初始化的接口。
### wxSqlite3
不想重复造轮子，又找了一些资料发现，sqlite3源码本身是支持数据加密扩展的，于是找到了实现加密扩展的库 `wxSqlite3`。
它同sqlite3一样，是c语言实现的，跨平台、开源，理论上完全没有问题。
[wxSqlite3源码下载](http://jaist.dl.sourceforge.net/project/wxcode/Components/wxSQLite3/)
<!-- more -->
## Use in Cocos2d-x
在cocos2d-x的external目录下新建`wxsqlite3/src`，将`wxsqlite3-3.0.3/sqlite3/secure/src`下的 .c 和 .h 拷贝进去。
### Build on Andorid
1. 写makefile
	`external/wxsqlite3`下新建Android.mk，写makefile，只需要编辑`src/sqlite3secure.c`即可，makefile内容参考如下：
		LOCAL_PATH := $(call my-dir)
		include $(CLEAR_VARS)
		LOCAL_MODULE := wxsqlite3_static
		LOCAL_MODULE_FILENAME := libwxsqlite3
		LOCAL_CFLAGS := \
		-DSQLITE_HAS_CODEC \
		-DCODEC_TYPE=CODEC_TYPE_AES128
		LOCAL_SRC_FILES := \
		src/sqlite3secure.c
		LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/src
		LOCAL_C_INCLUDES := $(LOCAL_PATH)/src
		include $(BUILD_STATIC_LIBRARY)
	> 注意，这里加入了开启加密功能的宏定义，`SQLITE_HAS_CODEC`和`CODEC_TYPE=CODEC_TYPE_AES128`
2. 引入静态库
	在项目的Android.mk中的适当位置加入如下模块引入操作：
		LOCAL_WHOLE_STATIC_LIBRARIES += wxsqlite3_static
		$(call import-module,external/wxsqlite3)
	> 我直接加入到extension的makefile中去了。
### Build on iOS
1. add files to
	右击项目 -> add files to，把`external/wxsqlite3`加入到工程中，与Box2D等目录平级(只是好看一些)。
	项目中只保留src下的两个文件的引用：
		sqlite3.h
		sqlite3secure.c
	正常编译通过就Ok可用了。
	> 注意，不要引入iOS的sqlite3 FrameWork，会编译不过，符号重定义。
2. 开启加密功能
	在sqlite3.h和sqlite3secure.c中加入如下宏定义：
		#define SQLITE_HAS_CODEC
		#define CODEC_TYPE CODEC_TYPE_AES128
	> 这里很傻的修改了源码。。。也是没找到办法，Build settings里面为编译器加预编译宏定义完全没作用。
### 代码中使用
#### include 头文件
	#include "sqlite3.h"
#### 加密接口的使用
两个接口：
	SQLITE_API int sqlite3_key(
	  sqlite3 *db,                   /* Database to be rekeyed */
	  const void *pKey, int nKey     /* The key */
	);
	SQLITE_API int sqlite3_rekey(
	  sqlite3 *db,                   /* Database to be rekeyed */
	  const void *pKey, int nKey     /* The new key */
	);
> 三个参数分别为：sqlite3对象，密码，密码长度
* 为db设置密码，正常open db，调用sqlite3_key即可。
* 打开加密的db，正常open db，调用sqlite3_key即可，后续读写操作不变。
* 修改密码，先打开加密的db，调用sqlite3_rekey，设置新的密码。
* 删除密码，先打开加密的db，调用sqlite3_rekey(_db, NULL, 0)。
#### 普通数据存取操作
参考链接：
[SQLite3 C/C++ 开发接口简介（API函数）](http://blog.csdn.net/yang_rong_yong/article/details/2832678)
[SQLite3 C/C++编程接口介绍](http://blog.csdn.net/woxiaozhi/article/details/6530529)
数据库连接对象: sqlite3
prepared_statement对象: sqlite3_stmt
其它基本操作有：
* sqlite3_open()	打开一个数据库连接, 返回sqlite3对象
* sqlite3_prepare() 此函数将SQL转换成sqlite3_stmt对象, 通常使用sqlite3_prepare_v2()
* sqlite3_step() 此函数单步执行sqlite3_stmt
* sqlite3_column() 返回 sqlite3_stmt所在行的指定column的值
* sqlite3_finalize() 销毁 sqlite3_stmt对象, 所有sqlite3_stmt对象都应该销毁以防止内存泄漏
* sqlite3_close() 关闭数据库连接,  销毁sqlite3对象, 所有与这个sqlite3对象相关的sqlite3_stmt对象都应该在调用这个函数之前销毁。
* sqlite3_reset() 此函数使得执行过sqlite3_step()的sqlite3_stmt重新执行, 相当于将游标返回到开始位置重新读取数据, sqlite3_reset()的效率比重新创建一个sqlite3_stmt搞很多。
* sqlite3_bind() 如下：
	SQL声明可以包含一些型如"?" 或 "?nnn" 或 ":aaa"的标记，可以在后面用sqlite3_bind 接口来填充这些值。
## sqlite数据库工具
有不少类似的软件，在用SqliteStudio，跨平台，还不错。
