---
comments: true
date: 2012-09-03
title: Mac下Cocos2d-x Android开发环境配置
category:
- 技术
tag:
- cocos2d
---
## 资源准备
Eclipse for Mac  
Android SDK mac  
Android NDK mac  
coco2d-x source Code  
## 依次
1. 安装Eclipse
2. 安装CDT
	C++ Development Tools，直接在Eclipse，Help->Install New SoftWare中载入、安装。
3. 安装Android SDK
	下载的安装包解压到自己指定的目录，打开sdk目录/tools/android，会启动Android SDK Manager，下载一个版本的SDK安装即可。
	插曲:感谢伟大的GFW，一般来说这个下载是会卡住连不上的。改hosts，加入:
		74.125.237.1 dl-ssl.google.com
4. 解压Android NDK
	配置环境变量
	需要配置的环境变量如下:
		export ANDROID_SDK_ROOT="你的sdk目录"
		export ANDROID_NDK_ROOT="你的ndk目录"
		export COCOS2DX_ROOT="你的cocos2d-x目录"
		export NDK_ROOT="你的ndk目录"
		export PATH=$PATH:$ANDROID_SDK_ROOT
		export PATH=$PATH:$ANDROID_NDK_ROOT
	这里依照Unix环境配置方法，修改/etc/profile或.bash_profile，可能需要加权限，使用Emacs或其它编译器填写上面环境变量定义。重启Shell终端，让环境变量生效。
5. 安装ADT
	同样Eclipse，Help->Install New SoftWare中，add新的Repository，地址为
		https://dl-ssl.google.com/android/eclipse
	把pendding出来的包都装上就OK。
## 环境安装配置完成
现在应该可以正常调试、创建Android项目了，测试一下，没问题向下。
### 编译cocos2d-x工程
去cocos2d-x目录下的HelloWorld，终端cd到 你的cocos2d目录/samples/HelloCpp/proj.android。
终端./build_native.sh执行编译脚本，编译C++代码，复制资源。正常编译完成后，JNI调用C++的.so库就编译出来了。
Eclipse中创建已存在工程，选择这个proj.android目录。OK，正常的话就可以调试了。
到Project->properties->Java Compiler，把Compiler compliance level从默认值（应该是1.5）改成1.6即可。
## 创建和调试
### Android调试
因为Android模拟器不支持OpenGL ES 2.0，所以模拟器调试cocos2d-x的工程是不行的。4.1的模拟器也不可以。直接真机调试就可以了。
#### 创建新的Android工程
cd到COCOS2DX_ROOT目录，终端执行create-android-project.sh脚本。
按提示依次输入:
	bundle id
	SDK id
	project name
新的工程就创建到当前目录了，同样cd到proj.android目录，执行build_native.sh进行编译后，导入Eclipse。
**jni目录下的Android.mk**
cocos2d-x工程代码文件或目录有添加时，一定要修改Android.mk的LOCAL_SRC_FILES和LOCAL_C_INCLUDES值。否则新的文件不会被编译。
## iOS、Android跨平台，共用Classes、Resources工程配置
以上都能正常操作，Android开发环境的搭建工作就完成了。但是，如果你就这样iOS代码放一堆，Android代码放一堆开发的话，切来切去非常麻烦，而且很可能搞错，搭建共用Classes和Resources目录的工程才是王道。
不要怕，这其实非常非常的简单。
2012.08.30发布的新版cocos2d-x源码做这件事情很便捷，Android工程中的的build_native.sh脚本已经把资源、文件路径改为相对路径，不需要修改脚本就可以完成这任务。
主要步骤如下:
1. XCode创建iOS工程，因为有项目模板非常方便，不做说明。
2. 按如上操作创建新的同名Android工程
3. 把Android工程中的proj.android文件夹直接复制到iOS工程的Classes、Resources、ios、libs目录。
4. 执行build_native.sh脚本，完成编译。
## 几个问题
1. Resources目录中不要分子目录，这在iOS平台没什么影响，但是Android上会找不到资源。
2. 记得修改Android工程，jni目录中的Android.mk文件。
3. 如何把XCode中完成的工程移植到Andriod?
	这是个大问题，但也并不麻烦，需要细心。只需要:按照如上步骤正常的配置好Android环境。注意上面两个问题。分析编译过程中的错误log，修改部分代码。耐心调试，一点一点完成移植。
