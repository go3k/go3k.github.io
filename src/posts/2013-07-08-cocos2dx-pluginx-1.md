---
comments: true
date: 2013-07-08
slug: cocos2d-x-pluginx-1
title: Cocos2d-x PluginX （一）使用手册
category:
- 技术
tag:
- cocos2d
- PluginX
---
## 简介
Plugin-x是cocos2d-x最近版本中引入的特性，旨在解决第三方SDK接入的问题，最大程度的简化接入工作，增加可重用性。第一部分主要介绍PluginX如何使用，不涉及设计原理相关内容。
`${cocos2d-x root}\plugin`目录下是PluginX所在位置，从设计和相关文档看感觉这东西相当复杂，但实际上使用起来非常简便。(复杂的设计是为了使用上简单方便)
## 前提
必要条件是配置好Android开发环境，需要NDK。Win下需要安装Cygwin，Cygwin需要gcc、make包，因为这个模块里的自动化脚本是Unix Shell。
<!-- more -->
## 使用现有Plugin步骤
### publish.sh 编译输出
1. 执行`plugin/tools/publish.sh`脚本，根据提示输入Android SDK、NDK、Ant/bin的路径。
	> Ant是Android的打包工具，配置好的Eclipse Android开发环境，那这个工具不需要单独安装，可以搜索下。我这里的路径是：`开发环境目录/adt-bundle-windows-x86/eclipse/plugins/org.apache.ant_1.8.3.v201301120609/bin`。
2. 执行完毕后，会生成`plugin/publish`目录，结果看起来大致如下：
	![publish folder](img/publish-folder.jpg)
	> 这一步实际上，是把Protocol工程、和各个Plugins工程，编译打包输出jar包和其它关键资源到publish目录，以供后面目标工程中引用。
3. publish中的文件主要有：
	* 头文件  .h
	* C++静态库  .a
	* java库文件  .lib
	* Android makefile文件  .mk
	* 其它plugin用到的资源
#### 一些问题
1. 由于project.properties中的target版本找不到(默认level = 7)，编译失败。我都修改到了8。
2. copy的资源目录为只读目录并且权限不对，不能访问，对后续的文件操作有影响。发现是Cygwin的问题，Google处理一下即可。
### 修改目标工程
把plugin应用到具体的Android工程中，这一步需要进行修改、增加内容，让目标工程正常使用需要的plugin。
#### gameDevGuide.sh 自动化修改部分
这是一个做关键修改的自动化脚本，它会自动把资源添加、修改到目标工程，非常简单、好用。
1. 执行`plugin/tools/gameDevGuide.sh`，根据UI提示输入Android目录，然后Next。
2. 接下来弹出一个带复选框的界面，选择需要使用的plugin，Finish即可。
大致会做如下修改：
* Android.mk --- 加入plugin模块C++ 静态库的依赖
* Application.mk --- 增加ndk编译选项
* .project --- 链接publish目录下的相关资源
* .classpath --- 加入相关的java 库文件依赖
* AndroidManifest.xml --- 加入plugin需要的Activity声明或权限声明
#### 手动修改部分
还有一些需要手动修改的部分。
1. 修改ndk-build参数，加入publish目录到`NDK_MODULE_PATH`，修改`build_native.sh`文件(需要在shell中定义PLUGIN_ROOT值)，例如：
		NDK_MODULE_PATH=${PLUGIN_ROOT}/publish:(冒号后面是原有值)
2. 修改main.cpp中的JNI_Onload方法
		#include "PluginJniHelper.h"
		jint JNI_OnLoad(JavaVM *vm, void *reserved)
		{
			JniHelper::setJavaVM(vm);
			PluginJniHelper::setJavaVM(vm);  // for plugins
			return JNI_VERSION_1_4;
		}
3. 在Android主Activity中加入
		import org.cocos2dx.plugin.PluginWrapper;
		import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
		public class HelloIAP extends Cocos2dxActivity{
		    protected void onCreate(Bundle savedState){
		        super.onCreate(savedState);
		        PluginWrapper.init(this); // for plugins
		        // If you want your callback function can be invoked in GL thread, add this line:
		        PluginWrapper.setGLSurfaceView(Cocos2dxGLSurfaceView.getInstance());
		    }
		...
		}
4. 一些SDK的特殊修改
	例如nd91，需要依赖一个Lib工程。
### C++代码里使用PluginX
JNI调用和相关的虚接口都已经在Protocol工程里处理好了，所以使用时都不用关心，可直接使用。下面是一些示例代码：
1. load/unload plugin，直接通过java类名操作
		// load plugin AnalyticsFlurry
		s_pFlurry = dynamic_cast<ProtocolAnalytics*>
		(PluginManager::getInstance()->loadPlugin("AnalyticsFlurry"));
		// unload plugin AnalyticsFlurry
		PluginManager::getInstance()->unloadPlugin("AnalyticsFlurry");
		s_pFlurry = NULL;
2. 使用plugin
	直接使用protocol中定义的接口基本可以满足全部需求了，如下：
		// enable the debug mode
		s_pFlurry->setDebugMode(true);
		// log an event
		s_pFlurry->logEvent("music");
		// log an event with params
		LogEventParamMap paramMap;
		paramMap.insert(LogEventParamPair("type", "popular"));
		s_pFlurry->logEvent("music", &paramMap);
3. 还可以调用自定义的方法，不详细介绍。
#### 一些问题
1. 导入工程到Eclipse后，Lib库没有找到。发现这里是通过修改.project加入LinkedResources标记，把Plugin/publish目录引入的。使劲刷新下工程就好了。。。
2. C++代码ndk编译不过，后来发现是Plugin有个独立的命名空间，需要引入。。。
3. 找不到org/cocos2dx/plugin/AnalyticsUmeng，仔细一看，发现这个类是定义在plugin/plugins/umeng/proj.android/src下的。又一检查，发现这个工程根本没有编译通过，没有生成.jar文件。很奇怪，所有jar文件在publish脚本跑过后都没有生成，手动ant操作一次才出来。
	> 查了半天，原来是ANT路径输入不全，没写bin目录。无奈啊。。。
经过艰苦的调试与修改，终于可以正常跑通了。估计能遇到的问题我遇过了，总之都是小问题。
## 总结
使用上，两个自动化脚本跑一下，手动修改几个点，就可以了，可以说非常简单。简化了很多繁杂的工作，但是实际上整个模块的设计比较复杂，如果对JNI、Ant打包、Shell脚本等等没个详细了解的话，出现问题很难搞定。
