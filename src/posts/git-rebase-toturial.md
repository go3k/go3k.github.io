---
comments: true
title: What is git rebase
date: 2018-01-18 15:05:27
slug: git-rebase
category:
- 技术
tag:
- git
---

一直以为`git rebase`是一个非常复杂日常用不到的操作，然而事实并不是这样。git中有两个操作可以进行分支合并，一个是`git merge`，一个是`git rebase`。`git merge`很简单，很容易理解，就是把一个分支合并到另外一个分支，合并完成后会产生一个`merge commit`。

关于`git rebase`不是特别直观，先举例说明：

```
    //假设我们有一个master分支
    //我为了开发feature创建feature分支
    git checkout -b feature
    //进行了一系列的修改和提交
    git commit -m 'a'
    //此时其他同事有提交到master分支，我们完成工作要提交到master
    git checkout master
    git pull origin master
    git checkout feature
    //feature分支rebase到最新的master的HEAD
    git rebase master
    //合并回到master分支
    git checkout master
    git merge feature
```

提交记录的图形如下：

![rebase](https://wac-cdn.atlassian.com/dam/jcr:e4a40899-636b-4988-9774-eaa8a440575b/02.svg?cdnVersion=jh)
`git rebase`可以理解为，把当前分支的基础节点`rebase`到一个新的位置，从而达到当前分支的修改是其父分支快进效果。这样当我们把当前分支`merge`回去的时候可以直接快进，父分支是一个清晰的提交历史，不会产生`merge commit`。

对git的认识还是不够系统。。。这么基础的操作居然一直没有理解，还是要多学习一个。

### 参考文档
[1. atlassian tutorial: git rebase](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase)
