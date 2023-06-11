import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as s,c as a,a as e,b as c,e as o,f as d}from"./app-c703f97d.js";const r={},l=d(`<h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介" aria-hidden="true">#</a> 简介</h2><p>由于各种原因，项目一直使用svn作为版本控制工具。最近svn关于分支管理的弊端终于是大爆发了，svn的分支合并真的太挫了，首先你必须checkout每个分支的拷贝才能进行merge，对于几G的工程你根本无法通过创建多个分支的方式进行项目管理，创建bug分支、feature分支等多个分支合并的操作根本不现实。另外，分支合并操作是无法保留提交记录的，这导致根本无法对合并后的分支做代码review，你很难区分自己的提交是不是被合理的合并了，相当的费时费力。现在木已成舟，改用git是不现实的，左思右想发现git-svn也能凑合用一用。</p><h2 id="用法" tabindex="-1"><a class="header-anchor" href="#用法" aria-hidden="true">#</a> 用法</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    # Clone a repo (like git clone):
    git svn clone http://svn.example.com/project/trunk
    # Enter the newly cloned directory:
    cd trunk
    # You should be on master branch, double-check with &#39;git branch&#39;
    git branch
    # Do some work and commit locally to Git:
    git commit ...
    # Something is committed to SVN, rebase your local changes against the
    # latest changes in SVN:
    git svn rebase
    # Now commit your changes (that were committed previously using Git) to SVN,
    # as well as automatically updating your working HEAD:
    git svn dcommit
    # Append svn:ignore settings to the default Git exclude file:
    git svn show-ignore &gt;&gt; .git/info/exclude
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看起来非常简单，除了下面几个操作，其余都用git操作即可。</p><ol><li><code>git svn clone</code> 初始化工程</li><li><code>git svn dcommit</code> 本地修改同步到svn的</li><li><code>git svn rebase</code> 同步svn的最新修改</li></ol><p>并且<code>git svn dcommit</code>操作会把git中每个commit生成对应的svn commit，那么对于那些不方便同步到工程的feature分支，完全可以在本地通过git保持维护，等到feature的上线时间点再merge到本地的master即可。</p><p>最好不要使用<code>git merge</code>进行分支合并，当<code>dcommit</code>与svn服务器同步的时候git历史会造成大规模的重写，使用<code>git rebase</code>操作可以保持git历史的线性一致。</p><p>另外，<code>git svn clone</code>操作可能会非常慢，这可能是个比较痛苦的过程。</p><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>`,10),m={href:"https://git-scm.com/docs/git-svn",target:"_blank",rel:"noopener noreferrer"};function v(g,u){const i=t("ExternalLinkIcon");return s(),a("div",null,[l,e("p",null,[e("a",m,[c("1. https://git-scm.com/docs/git-svn"),o(i)])])])}const p=n(r,[["render",v],["__file","git-svn-usage.html.vue"]]);export{p as default};
