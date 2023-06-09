---
title: git-svn usage
date: 2018-01-18 17:45:16
slug: git-rebase
category:
- 技术
tag:
- git
---
## 简介
由于各种原因，项目一直使用svn作为版本控制工具。最近svn关于分支管理的弊端终于是大爆发了，svn的分支合并真的太挫了，首先你必须checkout每个分支的拷贝才能进行merge，对于几G的工程你根本无法通过创建多个分支的方式进行项目管理，创建bug分支、feature分支等多个分支合并的操作根本不现实。另外，分支合并操作是无法保留提交记录的，这导致根本无法对合并后的分支做代码review，你很难区分自己的提交是不是被合理的合并了，相当的费时费力。现在木已成舟，改用git是不现实的，左思右想发现git-svn也能凑合用一用。
## 用法
    # Clone a repo (like git clone):
    git svn clone http://svn.example.com/project/trunk
    # Enter the newly cloned directory:
    cd trunk
    # You should be on master branch, double-check with 'git branch'
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
    git svn show-ignore >> .git/info/exclude
看起来非常简单，除了下面几个操作，其余都用git操作即可。
1. `git svn clone` 初始化工程
2. `git svn dcommit` 本地修改同步到svn的
3. `git svn rebase` 同步svn的最新修改
并且`git svn dcommit`操作会把git中每个commit生成对应的svn commit，那么对于那些不方便同步到工程的feature分支，完全可以在本地通过git保持维护，等到feature的上线时间点再merge到本地的master即可。
最好不要使用`git merge`进行分支合并，当`dcommit`与svn服务器同步的时候git历史会造成大规模的重写，使用`git rebase`操作可以保持git历史的线性一致。
另外，`git svn clone`操作可能会非常慢，这可能是个比较痛苦的过程。
## 参考
[1. https://git-scm.com/docs/git-svn](https://git-scm.com/docs/git-svn)
