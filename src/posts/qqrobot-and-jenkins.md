---
date: 2015-05-18
title: QQ机器人和Jenkins插件编写
category:
- 技术
tag:
- Jenkins
- QQ机器人
- 效率
---
Jenkins是一个有名的可持续集成工具，使用现有的插件就可以很容易的搭建一个软件自动集成环境。
Jenkins使用过程中，发现一个常见场景：用Jenkins开始打包，然后马上投入正常工作，接下来就把打包的事情忘记了。这样产生一个问题是不能及时的展开打包的下一步工作；另外的情况下，一直挂记这件事时不时上Jenkins查看编译状态，影响当前的工作。于是我思考一种解决方法：
> 编译结果直接通知到QQ岂不是很方便？
于是开始在Github有意的关注`QQ机器人`类似的repo，也从中了解了一些`QQ机器人`的基本情况。
## QQ机器人
QQ协议并不开放，QQ机器人都是基于破解WebQQ协议实现的。WebQQ协议分为两种：
* WebQQ：早一些，协议破解的已经很完整，并且有不少以此为基础的工具。悲剧的是QQ已经停止WebQQ服务了。
* SmartQQ：正在使用中的QQ协议，工具不多。
### [pfqq](https://github.com/sjdy521/pfqq)
这是一款非常好用的基于SmartQQ的工具：
* 使用Perl语言编写，插件式的设计结构。
* QQ基本功能，如：可发送消息到个人和QQ群。
* 提供基于HTTP协议的api接口供其他语言或系统调用的插件。
> repo地址：[https://github.com/sjdy521/pfqq](https://github.com/sjdy521/pfqq)
具体使用方法看源码的Demo和Doc说明。
到这里问题已经解决了一大半，接下来把功能集成到Jenkin就好了。
## Jenkins插件编写
网上可以找到一些中文资料，但并不面面俱到。官网的文档也相当不友好，关键概念没有点明，看了几遍文档还是一头雾水，只能通过参考现有插件慢慢摸索。下面主要是开发过程中的一些问题记录。
官方文档：[Jenkins Tutorial](https://wiki.jenkins-ci.org/display/JENKINS/Plugin+tutorial#Plugintutorial-TableofContents) 可以参考用来搭建开发环境，简要步骤如下：
* 安装[Maven](http://maven.apache.org/)，添加环境变量。
* 把`maven/conf/settings.xml`复制到`~/.m2/settings.xml`下。
* 注意：mvn的操作需要下载各种各样的依赖，而且悲剧的是依赖很可能下载失败，需要尝试翻墙等等各种方法。
#### Eclipse下进行插件的开发
开发效率会提升很多，代码提示、编译错误上就可以节约不少时间。执行如下命令：
	mvn -DdownloadSources=true -DdownloadJavadocs=true -DoutputDirectory=target/eclipse-classes -Declipse.workspace=/path/to/workspace eclipse:eclipse eclipse:add-maven-repo
> Where /path/to/workspace is the path to your Eclipse workspace.
下载个半天的依赖，并显示成功后，就可以在Eclipse中导入插件工程了。如果有报错，看 [TroubleShooting](https://wiki.jenkins-ci.org/display/JENKINS/Jenkins+plugin+development+with+Eclipse) 即可。
* 按照要求修改`settings.xml`，注意不是直接加到文件末尾，要对应XML格式修改settings。
* 修改完成后`mvn hpi:create`即可创建新插件。
### 插件结构
* 插件代码结构分两部分：jelly为基础的xml的界面配置、java进行数据绑定和插件功能实现。
* jelly中的field值和java中的构造函数参数名需要一致、jelly的xml结构需要注意。
#### 关于扩展点
有两个格式的扩展点：
* Singleton Pattern
* Describale/Descriptor Pattern
我目前对于扩展点理解是：Job配置界面中有很多的分区，界面元素区域和功能对应扩展点类。比如：
* 顶部的复选框部分，对应JobProperty
* Build Environment部分，对应BuildWrapper，可以定义环境变量用在后面的阶段
* Build部分(Add build step)，对应Builder，可以定义Build行为
* Builder部分(Add Postbuild action)，对应Notifier，可以定义编译后的行为，如结果通知
写插件的第一步就是确认扩展点，随着需求的增加会对扩展点有更深入的认识。
#### Jelly编写
可用的tag说明：[Jelly tag Ref](https://jenkins-ci.org/maven-site/jenkins-core/jelly-taglib-ref.html)
官方有个Sample UI的插件，可以用来参考学习UI编写。
> Dynamic是件非常麻烦的事情。。。搞了半天没搞定，貌似没有动态能力。
### Debug
运行下面的命令，执行完成后启动Jenkins，并进入debug模式：
	export MAVEN_OPTS="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,address=8000,suspend=n"
	mvn hpi:run
非常方便，jelly修改后直接刷新即可看到更新。
### 依赖外部jar包
需要将依赖写入pom文件，比较烦的是不容易找到groupid/artifactid等信息。查了一些资料，也有直接安装本地jar包的方法。
## 总结
Jenkins插件编写没有想象那么简单，不过结果是好的，最终完成了整个工具。Jenkins插件可以在Job中配置要通知到的个人QQ和QQ群，还有QQ消息内容。在编译机运行pfqq服务，每当编译完成就可以发送消息到QQ了。╮(╯▽╰)╭
