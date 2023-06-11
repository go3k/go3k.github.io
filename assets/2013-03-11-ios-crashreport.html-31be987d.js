import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as a,o as p,c,a as e,b as r,e as i,d as n,f as s}from"./app-c703f97d.js";const d={},h=e("h2",{id:"应用被reject",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#应用被reject","aria-hidden":"true"},"#"),r(" 应用被Reject")],-1),l=e("p",null,"很不幸，首次的AppStore应用提交失败了。其中一个原因是：游戏中发生Crash。",-1),u=e("p",null,[e("code",null,"2.1: Apps that crash will be rejected.")],-1),m=e("p",null,"苹果审核与结果通知并没有传说中那么BT加无脑，清清楚楚的列出了Reject原因，并为每个问题附带解决方案的建议,崩溃附带crash log。很清晰，很合理。",-1),b=e("h2",{id:"分析crash-report",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#分析crash-report","aria-hidden":"true"},"#"),r(" 分析Crash report")],-1),g={href:"https://developer.apple.com/library/ios/#technotes/tn2008/tn2151.html",target:"_blank",rel:"noopener noreferrer"},_=e("p",null,'iOS设备上，当app崩溃时会创建一个"crash report"文件保存在设备上。Crash report文件记录了，app崩溃时的信息，通常包含每个线程的调用堆栈。',-1),f=s('<h3 id="symbolication" tabindex="-1"><a class="header-anchor" href="#symbolication" aria-hidden="true">#</a> Symbolication</h3><p>分析crash report之前，需要把crash report中的内存地址与函数名、行数进行“符号映射”--Symbolication。</p><p><strong>必须的文件</strong></p><ul><li>上传AppStore的app二进制包</li><li>与二进制包对应的.dSYM文件</li></ul><p>每次上传AppStore时的app二进制包也.dSYM文件都一定要保存好。</p><blockquote><p>这两个文件必须是严格一一对应的，否则crash report不能完全的符号映射。即使代码没有任何修改，重新编译一次生成的.dSYM文件，与上次编译的app二进制包也是不能对应的。</p></blockquote><p>使用XCode的&quot;Archive&quot;命令可以非常便捷的保存相互对应的app包与.dSYM文件，当完成Product-&gt;Archive命令后，可以在XCode Organizer的Archived页面里查看所有Archive过的应用程序。(app上架时，非常推荐用这种方式去提交。)</p><p>如果存在互相对应的app二进制包与.dSYM文件，那么XCode会对这个app产生的crash report自动进行符号映射。</p><blockquote><p>网上那些使用symbolicatecrash工具进行映射的操作都是多此一举。</p></blockquote><p><strong>操作步骤</strong></p><ol><li>准备好app包、.dSYM、crash report文件</li><li>把crash report导入到XCode Organizer：打开XCode Organizer -&gt; Devices选项 -&gt; 选择左侧LIBRARY分组下的Devices Logs -&gt; 点击Import按钮选择.crash文件。</li><li>XCode会自动Symbolicate crash report文件，并显示结果。</li></ol><blockquote><p>如果你是直接把设置连接到Mac，并从XCode Organizer窗口里直接获取crash report的，那么能够自动进行Symbolication，非常方便。不过多数情况下，我们是分析用户的crash report。</p></blockquote><p><strong>符号没有映射成功？</strong></p><p>我严格的按照以上所有步骤操作，但是Crash report中与我的app相关的内容依旧显示内存地址并没有映射为可读的代码符号。我花了几个小时的时间搜索各种相关的资料，解决方案，尝试了几乎所有方法还是没能成功解出符号。</p><p>最后在github上找到这样的一个回复：</p><blockquote><p>If you goto Xcode-&gt;Organizer click on archives then right-click any archive and select show in finder. Back up to the folder called Xcode that contains the archive. Run terminal and cd to this folder, you can do this easily by typing &#39;cd &#39; then dragging the folder to the terminal. Now type &#39;mdimport .&#39; and enter. This will take a minute to finish. If you go back to Organizer and find your crash file then press Re-Symbolicate it should now give you method names and line numbers.</p></blockquote><p>按照他的方法操作了一次，居然就成功了。找到Archive操作的.app与.dSYM所在目录，一般是/Users/用户名/Library/Developer/Xcode/Archives(可以在Organizer Archives中，右击Archive包进入)，命令行中cd到/Users/用户名/Library/Developer/Xcode/，输入命令：</p><pre><code>`mdimport .`\n</code></pre><p>意为，把Xcode目录加入到spotlight索引，这可能需要一些时间，等一等。</p><p>也可以只导入你需要的.app与.dSYM文件，这样比较快速。</p><p><strong>原来符号不能正确映射的原因是：</strong></p><p>我的.app与.dSYM文件没有被spotlight索引到，导致符号映射失败，Apple的文档中提到：</p><blockquote><p>If you use the “Build and Archive” command then they will be placed in a suitable location automatically. Otherwise any location searchable by Spotlight (such as your home directory) is fine.</p></blockquote><h3 id="dwarfdump工具" tabindex="-1"><a class="header-anchor" href="#dwarfdump工具" aria-hidden="true">#</a> dwarfdump工具</h3><p>直接查询崩溃的内存地址，定义崩溃代码的文件与行数。</p><p>需要.app与.dSYM文件，不做详细介绍。</p><p>示例： <code>dwarfdump –lookup 0x000036d2 –arch armv6 MyApp.app.dSYM</code></p><h2 id="我的结果" tabindex="-1"><a class="header-anchor" href="#我的结果" aria-hidden="true">#</a> 我的结果</h2><p>经过反复测试，发现崩溃原因是，cocos2d-x引擎的CCBReader扩展中文件读取时，其中有一个操作没有考虑ARM下内存对齐，崩溃并Exception Codes: EXC_ARM_DA_ALIGN。Github上找到新版源码，问题就修复了。</p>',29);function y(A,S){const o=a("ExternalLinkIcon");return p(),c("div",null,[h,l,u,m,b,e("p",null,[r("Apple的官方文档："),e("a",g,[r("Understanding and Analyzing iOS Application Crash Reports"),i(o)])]),_,n(" more "),f])}const C=t(d,[["render",y],["__file","2013-03-11-ios-crashreport.html.vue"]]);export{C as default};