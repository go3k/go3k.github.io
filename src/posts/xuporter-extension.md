---
date: 2015-03-12
title: XUPorter加入Embed Framework支持
category:
- 技术
tag:
- Unity
- XUPorter
- 开源项目
- Github
- Pull Request
---
## XUPorter
XUPorter是一个超实用的Unity第三方插件，利用`PostProcessBuild`标签的特性，实现Unity Build iOS项目结束时自动进行XCode工程的设置，可链接framework、添加资源引用、加flag等等。总之用来自动化处理iOS的第三方SDK接入非常方便，详情可查看以下链接：
XUPorter Github Repo: [https://github.com/onevcat/XUPorter](https://github.com/onevcat/XUPorter)
XUPorter 中文说明: [ReadMe](http://www.onevcat.com/2012/12/xuporter/)
## Embed Framework扩展
这是XCode 6引入的新特性，不幸的是一些渠道SDK开始使用这一特性，XUPorter不支持这玩意的话真是会相当麻烦。。。于是，我写了这个扩展[Pull Request](https://github.com/onevcat/XUPorter/pull/45)，代码已经merge到XUPorter主项目。
### 用法和注意事项
1. `.projmods`中加入`embed_binaries`字段，如下：
			....
			"linker_flags": [],
			"embed_binaries": ["AiBeiFramework.framework"]
2. 注意：embed_binaries内的framework必须在files或其它字段添加过
2. embed_binaries是可选配置，这样保证配置文件的兼容性
## 实现扩展的方法
以Embed Framework为例，简单讲一下如何自己做扩展吧，方便定制或新特性增加。
1. 先了解XCode工程配置文件的格式: [XCode project file format](http://www.monobjc.net/xcode-project-file-format.html)
2. XCode工程配置文件是`.xcodeproj`中的`project.pbxproj`文件，仔细对比增加Embed Framework前后的文件变化。
3. 在`PBXBuildFile section`增加了：
		C6B94D0DAE1BB6B597716138 /* AiBeiFramework.framework in CopyFiles */ = {isa = PBXBuildFile; fileRef = 294C44AA83B643D5B7A69D29 /* AiBeiFramework.framework */; settings = {ATTRIBUTES = (CodeSignOnCopy, RemoveHeadersOnCopy, ); }; };
	在`PBXCopyFilesBuildPhase section`增加了：
		210E4548994D6EDB0F5944B4 /* CopyFiles */ = {
			isa = PBXCopyFilesBuildPhase;
			buildActionMask = 2147483647;
			dstPath = "";
			dstSubfolderSpec = 10;
			name = "Embed Frameworks";
			runOnlyForDeploymentPostprocessing = 0;
			files = (
				C6B94D0DAE1BB6B597716138 /* AiBeiFramework.framework in CopyFiles */,
			);
		};
	在`PBXNativeTarget section`主工程Target的buildPhases中增加了：
		1D6058900D05DD3D006BFB54 /* Unity-iPhone */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = 1D6058960D05DD3E006BFB54 /* Release */;
			buildPhases = (
				1D60588D0D05DD3D006BFB54 /* Resources */,
				83D0C1FB0E6C8D5900EBCE5D /* ShellScript */,
				83D0C1FD0E6C8D7700EBCE5D /* CopyFiles */,
				1D60588E0D05DD3D006BFB54 /* Sources */,
				1D60588F0D05DD3D006BFB54 /* Frameworks */,
				210E4548994D6EDB0F5944B4 /* CopyFiles */, /*--------新增------*/
			);
		......
	在`XCBuildConfiguration`中增加了：
		LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited) @executable_path/Frameworks",
				);
4. `PBXBuildFile`、`PBXCopyFilesBuildPhase`、`PBXNativeTarget`这些字段在代码中都有对应的类型定义，只要分析对应的类实现，了解基本用法，适当创建新对象加入到对应的父对象或者为`PBX`对象增加属性即可。具体可参照我的[Pull Request](https://github.com/onevcat/XUPorter/pull/45)。
