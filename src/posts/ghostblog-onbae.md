---
date: 2014-07-01
title: BAE搭建Ghost博客指南
category:
- 技术
tag:
- 博客
- blog
- ghost
---
博客再次搬家了，从Wordpress到Octopress，现在到BAE + Ghost了。Octopress实在是用不下去了，所谓“像黑客一样写博客”败给了蜗牛一样的访问速度，想cool也cool不起来。调研了一堆的博客系统(真是一堆，太特么多了。[知乎体方案对比](http://www.zhihu.com/question/21981094))，主要几个有兴趣的做了下对比：
1. Ghost
	它是一个node.js实现的简化wordpress。BAE可支持其运行，BAE访问速度非常快，ping值几乎10ms以内。BAE需要付费，但很便宜。缺点是还很简单，需要改进。
2. Jekyll系，如：Octopress
	我很喜欢它的使用方式，非常cool非常hacker，但是要托管在Github，访问速度难以忍受，并不时被墙。而且文章多过以后，编译速度非常慢。
3. FarBox
	以Dropbox API为基础的博客应用，本地的markdown文件直接解析为博文显示，照片目录直接当作相册，完全的一键式博客。唯一问题是访问速度慢。
三者对比下来，BAE + Ghost最靠谱，因为速度是最重要的，其它一切都是浮云。OK，动机明确，搬！
## 部署步骤
### 1. 在BAE后台初始化工程
[BAE Ghost官方教学](http://developer.baidu.com/wiki/index.php?title=docs/cplat/bae/start)
按照官方教学步骤，创建应用、添加部署、Check代码。在此之后的内容，BAE的文档就写的不清不楚，又有些啰嗦了，只能当作参考。
### 2. 部署Ghost
* 初始代码有3个文件：`app.conf、package.json、server.js`。
* 下载Ghost包，[Ghost官网](https://ghost.org/download/), [Github](https://github.com/TryGhost/Ghost)，直接解压到初始代码的文件夹。
* `config.example.js`改名为`config.js`，将其中的port（值2368或2369）全部替换成18080。
* 将`package.json`中的"start": "node index"改为"start": "node index.js"。
* 使用MySQL
	* 按照[BAE mysql教程](http://developer.baidu.com/wiki/index.php?title=docs/cplat/bae/mysql)，创建MySQL扩展服务。
	* 修改`config.js`，将其中：
			database: {
	            client: 'sqlite3',
	            connection: {
	                filename: path.join(__dirname, '/content/data/ghost-dev.db')
	            },
	            debug: false
	        },
		修改为：
			database: {
				client: 'mysql',
				connection: {
				    host: 'sqld.duapp.com',
				    port: 4050,
				    user: 'xxxxxx', //your ak
				    password: 'xxxxxx', //your sk
				    database: 'xxxxxx',//your dbname
				    charset: 'utf8'
				},
				debug: false
        	},
	* 将package.json中有关sqlite的部分删除，已经完全不需要它了。
	* 在本地执行`npm install --production`，安装`package.json`中定义的所有依赖，用[mysql.tgz](http://bcs.duapp.com/baev3demo/nodejs-web/mysql.tgz)替换node_modules中的mysql。
* 删除`package.json`中的`dependencies`，`optionalDependencies`和`devDependencies`项，删除后的`package.json`内容如下：
			{
				"name": "ghost",
				"version": "0.3.3",
				"private": true,
				"scripts": {
				    "start": "node index.js",
				    "test": "grunt validate --verbose"
				},
				"engines": {
				    "node": ">=0.10.* <0.11.4"
				},
				"engineStrict": true
			}
* 所有修改均已完成，保存所有修改，提交全部代码到服务器。
* 进入BAE后台，相应部署的状态栏会显示“有新版”，此时点击“快捷发布”即可上线。
* 一切顺利的话，站点就可以正常访问并使用了。`your.domain.xx/ghost`可进入Ghost管理后台。
> BAE的应用引擎默认是不能保存静态文件的(需要另外开通云存储)，而sqlite是以一个.db文件的方式存在的，所以一定要使用MySQL做为数据库，否则不能保存博客内容。
### 3. [可选]引入云存储 --- 七牛云
BAE云存储需要另外收费，计费标准比较恶心，我觉得非常不划算。这里我选用七牛云，我认为从各方面来讲它都能甩BAE的云存储几条街，并且标准用户的免费额度如下图：
![qiniu](./img/qiniu.png)
#### 用途
主要可以解决图片上传的问题，引入该配置后，从Ghost上传的图片可以自动保存到七牛云，无需手动上传图片后再复制外链。
#### 配置步骤
七牛版Ghost源码地址为：[七牛版Ghost Github地址](https://github.com/ghostchina/Ghost-0.4.2-qiniu)，按以下步骤合并本地ghost和七牛版ghost。
* 在 `core/server/storage` 目录增加 `qiniu.js` 文件。
* 修改 `core/server/storage/index.js` 文件，以支持加载 `qiniu.js` 存储类。直接使用七版文件替换它即可。
* 修改`config.js`，按照七牛版的`config.example.js`来修改:
		qiniu: {
            bucketname: 'my-first-bucket', //空间名称
            ACCESS_KEY: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', //具体含义请参考七牛的文档
            SECRET_KEY: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            root: '/images/', //文件存储在哪个目录。可以设置为 `/` 表示存储在根目录
            prefix: 'http://cdn.my-domainname.com'  //上传的文件的 URL 前缀，可以是你自己绑定的二级域名或者七牛云默认分配的二级域名。文件最中的 URL 为：prefix + root + md5(file) + extension
            例如：http://cdn.my-domainname.com/images/a/ab/dqwerqwetetqwedfasdf.png
        }
* 修改 `package.json` 文件，增加了对 `qiniu` npm包的依赖。将七牛版`dependencies`、`devDependencies`部分内容复制到本地`package.json`文件。本地再次运行`npm install --production`，安装`qiniu`相关的包依赖。
* 安装完成后，再次删除`package.json`中的`dependencies`，`optionalDependencies`和`devDependencies`项，将所有修改提交。
* 再次发布新版，七牛同步版就完成了。
