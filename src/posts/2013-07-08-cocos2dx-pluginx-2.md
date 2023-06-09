---
comments: true
date: 2013-07-08
slug: cocos2d-x-pluginx-2
title: Cocos2d-x PluginX （二）增加新的Plugin
category:
- 技术
tag:
- cocos2d
- PluginX
---
## 创建Plugin目录
第一步，在plugin/plugins下，目录需要严格按照如下规范实现：
	plugin/plugins/alipay/proj.android
						 /proj.ios
因为publish工具是按照这种格式的目录做操作的。
## Android平台
能封装的基本都封装好了，需要做的就是创建一个Plugin工程，然后实现对应的Interface接口。
<!-- more -->
1. 在Eclipse中导入`plugin\protocols\proj.android`工程。
2. 创建Library工程，并依赖于libPluginProtocol。
	创建Libary工程的具体步骤如下(可略过，但需要注意包名、类名的格式)，以QQWeibo为例：  
	* New -> Android Application Project
		Application Name,Project Name为：libPluginQQWeibo，格式为`libPlugin{XXX}`；  
		Package Name为：org.cocos2dx.libSocialQQWeibo，格式为org.cocos2dx.lib{Plugin类型}{Plugin标识}。
	* SDK 都选API 8，Theme：None。Next。
	* Mark this project as a library勾选，其余勾选都去掉。Location手动选择刚刚创建的Plugin proj.android目录。Finish。
3. 实现Plugin，增加一些必要文件：
	* build.xml，直接从其它Plugin工程中复制，这是用来做Ant输出的编译配置。需要修改project name，如：
			<project name="libPluginQQWeibo" default="plugin-publish">
	* ForManifest.xml，用来自动修改目标工程的Manifest.xml文件的，里面填写当前Plugin需要的xml修改内容，比如：权限、Activity声明，等等。直接复制后修改，参考自带Plugin中的格式。
	* sdk目录，把第三方SDK的.jar文件放入。
	* ForAssets、DependProject用途参考自带Plugin。
4. 实现Interface
	* 必须创建一个实现Interface的java类，这个类中封装SDK的功能，要求如下：
	> 右击src目录，New -> Package，Name：org.cocos2dx.plugin，不要有变化。  
	> 在这个Package下创建Java类文件，SocialQQWeibo，格式为{Plugin类型}{Plugin标识}。SuperClass空，Interface选择一个Plugin Interface类型，这里是InterfaceSocial。
	* 这个类一定要提供一个以 Context 为参数的构造函数，如下：
			public AnalyticsFlurry(Context context) {
        		mContext = context;
    		}
	* 其余就是Interface的实现了，按第3方SDK文档实现即可，任意发挥。
5. 修改plugin/tools/config.sh，加入新的plugin目录名到ALL_PLUGINS变量，这样脚本会自动输出新增的plugin。
## iOS平台暂时不看
## 总结
一系列处理看似麻烦，但非常有意义，不多说。
