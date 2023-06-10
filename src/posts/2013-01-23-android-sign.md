---
comments: true
date: 2013-01-23
slug: '112'
title: Android应用程序签名
category:
- 技术
tag:
- Android
- 签名
---
Android系统要求所有的程序经过数字签名才能安装，如果没有可用的数字签名，系统将不许安装运行此程序，不管是模拟器还是真实手机。因此，在设备或者是模拟器上运行调试程序之前，必须为应用程序设置数字签名。Android系统仅仅会在安装的时候测试签名证书的有效期，如果应用程序的签名在安装之后过期，那么应用程序仍然可以正常启用。

Android通过数字签名来标识应用程序的作者和在应用程序之间建立信任关系，不是用来决定用户可不可以安装该应用程序。android的这个签名由应用程序的作者完成，并不需要权威的数字证书签名机构认证，他只是用来让应用程序包自我认证的。
<!-- more -->
## 默认debug密钥签名
当用Eclipse打包测试时，ADT会自动使用debug密钥为应用程序签名，debug密钥是一个名为debug.keystore的文件，位于电脑的：
```
	/userName/.Android/debug.keystore，其中的userName是电脑的用户名。
```

工程的bin目录下的apk包就是使用debug密钥做签名的包，所以理论上是不能用这个包做上线发布的。

## 生成密钥签名

整个过程涉及到几个工具：
  * keytool    生成、修改操作数字证书，jdk的工具
  * jarsigner  使用数字证书给apk文件签名，jdk的工具
  * zipalign   对签名后的apk进行优化，提高与Android系统交互的效率，Android sdk中的工具

最简单的方法是直接使用Eclipse的功能完成这一系列操作：

右击工程->Android Tools->Export signed Application package，选择使用现有的keystore签名、创建新的keystore签名。有几个关键信息需要记住：

  * storepass：keystore的密码(一个keystore下面可以存在多个key，这是keystore的一级密码)
  * alias：每个key对应一个alias名字
  * keypass：单个key的主密码

输入正确的keystore信息就可以输出一个打包过的apk包了。

## 误使用debug.keystore发布的应用怎么办？
没错。。。说的就是我自己。

## 产生的问题

第一次发布时，直接从bin目录拷出apk包，并把这个包发布。这样就是使用debug.keystore签名、并上线了应用，我想发生这种情况都是因为不太了解Android应用程序签名相关的细节。

当发现了以后，希望使用一个自己生成的“正规的”keystore再更新应用。因为更换了keystore，那么安装包的签名就变了。用户更新应用时，会在安装过程中报错。安装过程中系统检测到程序的签名不一致，认为安装包有风险(可能被篡改)，安装失败，需要卸载原应用重新安装。这样的问题很严重！！！

##  解决办法

一个字，改！！！
找到debug.keystore文件，事实上你只要保存这个.keystore，今后都使用默认key做应用程序签名并更新也是可以的，一点问题没有。只是默认密码会有点不安全。

debug.keystore默认信息为：

```
alias : androiddebugkey
storepass&keypass : andriod
```

只需要使用keytool，把debug.keystore的alias、storepass、keypass修改为我们想要的值即可。

修改alias：

```bash
    keytool -changealias -alias "your-very-very-long-alias" -destalias "new-alias" -keypass keypass -keystore /path/to/keystore -storepass storepass
```

修改storepass：

```bash
    keytool -storepasswd -keystore /path/to/keystore
    Enter keystore password:  changeit
    New keystore password:  new-password
    Re-enter new keystore password:  new-password
```