---
date: 2014-12-02
title: blueimp Gallery开源的Web图片浏览效果
category:
- 技术
tag:
- 博客
- web
- 美化
---
对Markdown默认的图片显示效果不满意，尤其显示宽度小于高度的照片时，整个文章的排版显示不舒服；如果打算连续显示多张大小不一的图片，那效果更是糟糕的一塌糊涂。所以，加入一个第三方图片浏览是很有必要的！！
Github搜索找到了blueimp Gallery，star,fork比较高搜索结果排名第一。简单测试后，发现非常容易使用，并且效果不错！
![blueimp Gallery](http://ghost3k.qiniudn.com/img/blueGallery_lightbox.png)
项目地址：[https://github.com/blueimp/Gallery#requirements](https://github.com/blueimp/Gallery#requirements)
## 使用方法
非常简单，看项目README很快可以搞定，我使用的是Lightbox效果，配置步骤：
1. 把css,img,js目录copy到网站存储。
2. 网页头引入样式：
		<link rel="stylesheet" href="css/blueimp-gallery.min.css">
3. 将代码段落加入网页body中：
		<!-- The Gallery as lightbox dialog, should be a child element of the document body -->
		<div id="blueimp-gallery" class="blueimp-gallery">
		    <div class="slides"></div>
		    <h3 class="title"></h3>
		    <a class="prev">‹</a>
		    <a class="next">›</a>
		    <a class="close">×</a>
		    <a class="play-pause"></a>
		    <ol class="indicator"></ol>
		</div>
4. 在body底部加入：
		<script src="js/blueimp-gallery.min.js"></script>
5. 上述代码后面加入script，处理点击事件：
		<script>
		document.getElementById('links').onclick = function (event) {
		    event = event || window.event;
		    var target = event.target || event.srcElement,
		        link = target.src ? target.parentNode : target,
		        options = {index: link, event: event},
		        links = this.getElementsByTagName('a');
		    blueimp.Gallery(links, options);
		};
		</script>
6. 最后，创建图片列表即可（注意，最好使用大小相同的缩略图）
		<div id="links">
			<a href="images/banana.jpg" title="Banana">
			    <img src="images/thumbnails/banana.jpg" alt="Banana">
			</a>
			<a href="images/apple.jpg" title="Apple">
			    <img src="images/thumbnails/apple.jpg" alt="Apple">
			</a>
			<a href="images/orange.jpg" title="Orange">
			    <img src="images/thumbnails/orange.jpg" alt="Orange">
			</a>
		</div>
还有其它的样式和配置项可选，具体内容可参考项目README。
## 集成到Ghost
我采用了非常简单粗暴的方式，将2，3，4，5的代码直接加入到`post.hbs`、`default.hbs`等模版。在需要的地方添加图片列表代码即可。
### 快速添加图片列表代码(Mac环境)
利用`ThisService`，写了一个简单的自动生成代码的脚本做为服务，之后在KeyBoard设置中为该服务绑定快捷键。
只需要按一次快捷键，再修改图片链接即可。
> 欢迎提出更便捷的方法
### 缩略图
我使用七牛云存储做为图片空间，七牛的数据处理功能可以完美解决这一问题。只需创建一个图片样式，定义好剪裁方式、大小、图片质量、格式。最后，通过：
	http://绑定域名/文件名称 + 分隔符 + 处理样式名
	如：http://space.qiniudn.com/sample.jpg/style.com.jpg
的方式，即可得到缩略图。
## 效果展示
<div class="BGallery">
    <a href="http://ghost3k.qiniudn.com/matrix.jpg" title="Matrix">
        <img src="http://ghost3k.qiniudn.com/matrix.jpg-test" alt="Matrix">
    </a>
    <a href="http://ghost3k.qiniudn.com/img/rivertown.jpg" title="River Town">
        <img src="http://ghost3k.qiniudn.com/img/rivertown.jpg-test" alt="River Town">
    </a>
    <a href="http://ghost3k.qiniudn.com/imgshangpala.jpg" title="ShangPala">
        <img src="http://ghost3k.qiniudn.com/imgshangpala.jpg-test" alt="ShangPala">
    </a>
    <a href="http://ghost3k.qiniudn.com/img/Yunnan.JPG" title="YunNan">
        <img src="http://ghost3k.qiniudn.com/img/Yunnan.JPG-test" alt="YunNan">
    </a>
    <a href="http://ghost3k.qiniudn.com/image/3/26/c252e66b67e3425950c2ee97b7a4a.jpg" title="The Hobbit">
        <img src="http://ghost3k.qiniudn.com/image/3/26/c252e66b67e3425950c2ee97b7a4a.jpg-test" alt="The Hobbit">
    </a>
</div>
