import{_ as l}from"./plugin-vue_export-helper-c27b6911.js";import{r,o as a,c as t,d as i,a as e,b as n,e as c,f as d}from"./app-c703f97d.js";const s={},u=e("p",null,"为自己的工程建立文档是非常必要，这可以有效提高代码的开发和维护效率。 Doxygen是一个便捷的文档生成工具，它是一个GPL开源工程，使用的比较普遍。 它的特点是独立于特定的编程语言，支持C++、C、Java、Objective-C、Python等等，基本上可以满足所有编程语言。而且它有社区持续维护，我看到最近的版本更新时间是2012.08，就上个月。",-1),h=e("h2",{id:"使用方法-mac版",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#使用方法-mac版","aria-hidden":"true"},"#"),n(" 使用方法(Mac版)")],-1),_=e("ol",null,[e("li",null,"去Doxygen官网下载需要的Doxygen版本，并且安装。"),e("li",null,"运行Doxygen，按照提示使用，非常简单。")],-1),b=d('<h4 id="指定working-deirectory-选择工程的路径即可。" tabindex="-1"><a class="header-anchor" href="#指定working-deirectory-选择工程的路径即可。" aria-hidden="true">#</a> 指定working deirectory，选择工程的路径即可。</h4><h4 id="使用wizard-tab中的选项进行设置" tabindex="-1"><a class="header-anchor" href="#使用wizard-tab中的选项进行设置" aria-hidden="true">#</a> 使用Wizard Tab中的选项进行设置</h4><ul><li>Project设置 输入工程名。(显示为HTML文档中的主标题)<br> 版本号<br> logo图片<br> 选择代码目录<br> 选择文档的输出目录</li><li>Mode设置 选择All Entities Mode</li><li>Output 选择输出文档的类型，HTML即可。 一切配置完成，选择Run Tab，Run doxygen输出文档即可。</li></ul><h2 id="注释标准" tabindex="-1"><a class="header-anchor" href="#注释标准" aria-hidden="true">#</a> 注释标准</h2>',4),x=e("li",null,[n("类整体描述 在头文件的开始处(前面没有任何doxygen注释)，格式如下: /** @brief The HelloWorld Scene. 注释 详细内容 */ "),e("blockquote",null,[e("p",null,"@brief 部分不是必须的，加入 @brief 可以在文档的最顶部加入简要的描述信息(The HelloWorld Scene.)，后面紧跟一个可以跳转到详细描述的超链接。")])],-1),g=e("li",null,[n("成员变量注释 在成员的上面一行，格式如下: /** 注释内容 */ "),e("blockquote",null,[e("p",null,'注意，文档中不会显示私有成员信息。public和protected成员都可以显示。 下面这种格式的注释，也可以。 int button; /**< "Run Again" button in GUI */')])],-1),p=e("li",null,'成员函数注释 在成员函数的上面一行，格式如下: /** @brief 描述 @param newNum 参数描述 @return "value" 返回值描述 */ @brief同样为可选，可在文档的成员函数列表处做为简介显示。 @param参数描述 @return返回值描述 具体可以去Doxygen Manual查，有非常非常多的针对各语言的注释方法，按自己喜好使用。',-1),f={href:"http://blog.chukong-inc.com/index.php/2012/05/16/xcode4_fast_doxygen/",target:"_blank",rel:"noopener noreferrer"},m=e("ul",null,[e("li",null,"安装ThisService.app，Mac上可自定义系统服务的工具软件。"),e("li",null,"下载Doxygen.rb脚本，它可以把文字输入转为doxygen风格注释输出。"),e("li",null,"打开ThisService，输入服务名称，选择执行的脚本，还有一些选项可以设置，比如指定服务生效的应用程序。 (我做了在编辑器中有效的设置)"),e("li",null,"在系统偏好设置->键盘中选择Service标签，找到刚刚添加的服务，为其设置一个快捷键如:Command+option+/。 完成，在XCode中选中一行代码，按快捷键试试效果吧。")],-1);function y(k,v){const o=r("ExternalLinkIcon");return a(),t("div",null,[u,h,_,i(" more "),b,e("ol",null,[x,g,p,e("li",null,[n("大招来了 Mac上使用Doxygen自动生成脚本，高效完成doxygen风格注释。非常好用，非常便捷。 "),e("a",f,[n("参考链接"),c(o)]),m])])])}const M=l(s,[["render",y],["__file","2012-09-04-doxygen-usage.html.vue"]]);export{M as default};