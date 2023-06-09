---
title: Unity优化：特效动态dynamic batching思路
date: 2018-03-02 15:33:04
category:
- 技术
tag:
- Unity
---
Unity 5.3.5 版本以后恢复了对粒子系统的动态合批功能，需要注意的是，粒子系统合批的前提是渲染顺序上相邻，且材质相同。默认情况下，粒子系统的渲染与一般的半透明渲染一样，必须从后向前渲染。
## order in layer
![orderinlayer](http://7jppsr.com1.z0.glb.clouddn.com/img/unity_particle_orderinlayer.png)
`ParticleSystem`这个Component下的`Render`标签下面，这个参数可以设定该粒子的渲染顺序。
例子：一个表现两军交战的场景，双方战斗单位20v20，每次攻击每个战斗单位射出一个粒子效果表示飞行子弹。该粒子效果包含两个`ParticleSystem`，各自引用了不同的`Material`。由于渲染顺序问题，很有可能这些粒子效果是不能合批的，因为两个`ParticleSystem`交替渲染会造成`Material`相同这个条件不成立，导致`drawcall`数量是`特效数量 * 2`。
优化：把两个粒子的`order in layer`分别修改为0、1，粒子系统的dynamic batching就会生效，最终`drawcall`数量变成2。
## 广度上的优化
因为动态合批的前提条件之一是"材质相同"，如果我们尽可能保证粒子系统的"材质相同"就能有更多的动态合批，这可行吗？
### 材质之间的主要区别
1. 使用的贴图不同
2. 使用的shader不同
经过一些研究，发现大部分特效的贴图比较小，或者说移动游戏特效贴图可以限定到很小；最常用的particle shader只用2到3个。
### 优化方案
利用SpritePacker把特效texture合并为一个图集，根据使用的particle shader不同来对应图集，这样我们就得到了2到3个shader和贴图相同的“相同材质球”。具体步骤如下：
1. 修改Texture type为Sprite，Packing Tag中填入对应shader的名字，例如：BattleParticle_additive
![textureFormat](http://7jppsr.com1.z0.glb.clouddn.com/img/unity_particle_spritetexture.png)
2. 创建名称为`BattleParticle_additive`的材质球，Shader选择`Additive`，texture留空。
3. 在粒子特效的`ParticleSystem`下，在`Render`标签中选择Material为刚才创建的`BattleParticle_additive`。开启`Texture Sheet Animation`选项，Mode选择Sprites，把步骤1中的Sprite拖上去，Frame Over Time选择constant。
![textureSheet](http://7jppsr.com1.z0.glb.clouddn.com/unity_particle_settexturesheet.png)
经过测试发现同样的`Material`都会合批，并且关于sprite的处理非常方便，几乎无需关心，Unity出包时会自动通过SpritePacker编译图集，并且放入包体内。
