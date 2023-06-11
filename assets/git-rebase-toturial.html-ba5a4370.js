import{_ as i}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as r,c as s,a as e,b as n,e as c,f as d}from"./app-c703f97d.js";const o={},l=d(`<p>一直以为<code>git rebase</code>是一个非常复杂日常用不到的操作，然而事实并不是这样。git中有两个操作可以进行分支合并，一个是<code>git merge</code>，一个是<code>git rebase</code>。<code>git merge</code>很简单，很容易理解，就是把一个分支合并到另外一个分支，合并完成后会产生一个<code>merge commit</code>。</p><p>关于<code>git rebase</code>不是特别直观，先举例说明：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    //假设我们有一个master分支
    //我为了开发feature创建feature分支
    git checkout -b feature
    //进行了一系列的修改和提交
    git commit -m &#39;a&#39;
    //此时其他同事有提交到master分支，我们完成工作要提交到master
    git checkout master
    git pull origin master
    git checkout feature
    //feature分支rebase到最新的master的HEAD
    git rebase master
    //合并回到master分支
    git checkout master
    git merge feature
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>提交记录的图形如下：</p><p><img src="https://wac-cdn.atlassian.com/dam/jcr:e4a40899-636b-4988-9774-eaa8a440575b/02.svg?cdnVersion=jh" alt="rebase" loading="lazy"><code>git rebase</code>可以理解为，把当前分支的基础节点<code>rebase</code>到一个新的位置，从而达到当前分支的修改是其父分支快进效果。这样当我们把当前分支<code>merge</code>回去的时候可以直接快进，父分支是一个清晰的提交历史，不会产生<code>merge commit</code>。</p><p>对git的认识还是不够系统。。。这么基础的操作居然一直没有理解，还是要多学习一个。</p><h3 id="参考文档" tabindex="-1"><a class="header-anchor" href="#参考文档" aria-hidden="true">#</a> 参考文档</h3>`,7),m={href:"https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase",target:"_blank",rel:"noopener noreferrer"};function u(g,v){const a=t("ExternalLinkIcon");return r(),s("div",null,[l,e("p",null,[e("a",m,[n("1. atlassian tutorial: git rebase"),c(a)])])])}const h=i(o,[["render",u],["__file","git-rebase-toturial.html.vue"]]);export{h as default};
