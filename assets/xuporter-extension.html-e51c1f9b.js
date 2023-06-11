import{_ as i}from"./plugin-vue_export-helper-c27b6911.js";import{r as a,o as l,c as d,a as e,b as o,e as r,f as n}from"./app-c703f97d.js";const s={},c=e("h2",{id:"xuporter",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#xuporter","aria-hidden":"true"},"#"),o(" XUPorter")],-1),u=e("p",null,[o("XUPorter是一个超实用的Unity第三方插件，利用"),e("code",null,"PostProcessBuild"),o("标签的特性，实现Unity Build iOS项目结束时自动进行XCode工程的设置，可链接framework、添加资源引用、加flag等等。总之用来自动化处理iOS的第三方SDK接入非常方便，详情可查看以下链接：")],-1),p={href:"https://github.com/onevcat/XUPorter",target:"_blank",rel:"noopener noreferrer"},h={href:"http://www.onevcat.com/2012/12/xuporter/",target:"_blank",rel:"noopener noreferrer"},m=e("h2",{id:"embed-framework扩展",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#embed-framework扩展","aria-hidden":"true"},"#"),o(" Embed Framework扩展")],-1),_={href:"https://github.com/onevcat/XUPorter/pull/45",target:"_blank",rel:"noopener noreferrer"},B=n(`<h3 id="用法和注意事项" tabindex="-1"><a class="header-anchor" href="#用法和注意事项" aria-hidden="true">#</a> 用法和注意事项</h3><ol><li><code>.projmods</code>中加入<code>embed_binaries</code>字段，如下：<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>		....
		&quot;linker_flags&quot;: [],
		&quot;embed_binaries&quot;: [&quot;AiBeiFramework.framework&quot;]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li>注意：embed_binaries内的framework必须在files或其它字段添加过</li><li>embed_binaries是可选配置，这样保证配置文件的兼容性</li></ol><h2 id="实现扩展的方法" tabindex="-1"><a class="header-anchor" href="#实现扩展的方法" aria-hidden="true">#</a> 实现扩展的方法</h2><p>以Embed Framework为例，简单讲一下如何自己做扩展吧，方便定制或新特性增加。</p>`,4),D={href:"http://www.monobjc.net/xcode-project-file-format.html",target:"_blank",rel:"noopener noreferrer"},f=n(`<li><p>XCode工程配置文件是<code>.xcodeproj</code>中的<code>project.pbxproj</code>文件，仔细对比增加Embed Framework前后的文件变化。</p></li><li><p>在<code>PBXBuildFile section</code>增加了：</p><pre><code> C6B94D0DAE1BB6B597716138 /* AiBeiFramework.framework in CopyFiles */ = {isa = PBXBuildFile; fileRef = 294C44AA83B643D5B7A69D29 /* AiBeiFramework.framework */; settings = {ATTRIBUTES = (CodeSignOnCopy, RemoveHeadersOnCopy, ); }; };
</code></pre><p>在<code>PBXCopyFilesBuildPhase section</code>增加了：</p><pre><code> 210E4548994D6EDB0F5944B4 /* CopyFiles */ = {
 	isa = PBXCopyFilesBuildPhase;
 	buildActionMask = 2147483647;
 	dstPath = &quot;&quot;;
 	dstSubfolderSpec = 10;
 	name = &quot;Embed Frameworks&quot;;
 	runOnlyForDeploymentPostprocessing = 0;
 	files = (
 		C6B94D0DAE1BB6B597716138 /* AiBeiFramework.framework in CopyFiles */,
 	);
 };
</code></pre><p>在<code>PBXNativeTarget section</code>主工程Target的buildPhases中增加了：</p><pre><code> 1D6058900D05DD3D006BFB54 /* Unity-iPhone */ = {
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
</code></pre><p>在<code>XCBuildConfiguration</code>中增加了：</p><pre><code> LD_RUNPATH_SEARCH_PATHS = (
 			&quot;$(inherited) @executable_path/Frameworks&quot;,
 		);
</code></pre></li>`,2),b=e("code",null,"PBXBuildFile",-1),P=e("code",null,"PBXCopyFilesBuildPhase",-1),F=e("code",null,"PBXNativeTarget",-1),C=e("code",null,"PBX",-1),k={href:"https://github.com/onevcat/XUPorter/pull/45",target:"_blank",rel:"noopener noreferrer"};function X(g,x){const t=a("ExternalLinkIcon");return l(),d("div",null,[c,u,e("p",null,[o("XUPorter Github Repo: "),e("a",p,[o("https://github.com/onevcat/XUPorter"),r(t)])]),e("p",null,[o("XUPorter 中文说明: "),e("a",h,[o("ReadMe"),r(t)])]),m,e("p",null,[o("这是XCode 6引入的新特性，不幸的是一些渠道SDK开始使用这一特性，XUPorter不支持这玩意的话真是会相当麻烦。。。于是，我写了这个扩展"),e("a",_,[o("Pull Request"),r(t)]),o("，代码已经merge到XUPorter主项目。")]),B,e("ol",null,[e("li",null,[e("p",null,[o("先了解XCode工程配置文件的格式: "),e("a",D,[o("XCode project file format"),r(t)])])]),f,e("li",null,[e("p",null,[b,o("、"),P,o("、"),F,o("这些字段在代码中都有对应的类型定义，只要分析对应的类实现，了解基本用法，适当创建新对象加入到对应的父对象或者为"),C,o("对象增加属性即可。具体可参照我的"),e("a",k,[o("Pull Request"),r(t)]),o("。")])])])])}const v=i(s,[["render",X],["__file","xuporter-extension.html.vue"]]);export{v as default};
