---
date: 2016-06-18
title: Unity UNet用法
category:
- 技术
tag:
- Unity
- network
---
# Unity UNet用法
UNet是Unity设计的网络多人游戏模块，特点是与Unity高度集成，使用非常方便，可以快速制作多人游戏原型。根据使用需求来分提供两种功能：
  * High Level API：简单快速，完全可以实现多人游戏
  * NetworkTransport API：使用底层传输模块自行封装
本文主要介绍一下HLAPI的用法和编程模型，理解了这个模块的设定之后，使用这个模块会非常得心应手。
> 详细的功能介绍: [UNetOverview](http://docs.unity3d.com/Manual/UNetOverview.html)
>
> 使用HAPI从头制作多人游戏：[Setting up a Multiplayer Project from Scratch](http://docs.unity3d.com/Manual/UNetSetup.html)
最吸引我的功能是支持局域网联机，这个功能想很久了。
## 概念和设定
UNet支持局域网联机，实现方式是有一个客户端同时做服务器，但是从概念上我们仍然需要用客户端、服务器通信模式来理解。
![server client structure](http://docs.unity3d.com/uploads/Main/NetworkLocalPlayers.png)
### NetworkBehaviour
可以理解为有网络行为的MonoBehaviour，创建NetworkBehaviour的GameObject后，必须进行Spawn操作。并且，这个操作只能在Server端进行，操作完成后，UNet会为每个客户端生成客户端实例。
### player
每个客户端都有一个Player，可以在NetWorkManager指定prefab为player。两个玩家联机游戏的情况如上图所示，Server端和客户端都有同样多的Player，并且他们之间的状态应该是完全同步的。客户端中有一个Player是localPlayer，可以理解为是玩家可操作的player，通过这个Player可以进行与服务器之间的通信。
### 网络通信方式
最常用的通信就是Commond和Rpc
![Remote Actions](http://docs.unity3d.com/uploads/Main/UNetDirections.jpg)
* Commond
NetworkBehaviour可以通过Commond通信给Server，简单理解就是程序执行权跳转到Server，Server有绝对控制权，进行客户端不能进行的操作。使用方式为：
    [Command]
    void CmdDoFire(float lifeTime)
    {
      ...
    }
* ClientRpc
Server调用Client，只能在Server执行，所有Client中的NetworkBehaviour都会受到调用。
* 网络通信的参数有一些限制如下：
The arguments passed to commands and ClientRpc calls are serialized and sent over the network. These arguments can be:
1. basic types (byte, int, float, string, UInt64, etc)
2. arrays of basic types
3. structs containing allowable types
4. built-in unity math types (Vector3, Quaternion, etc)
5. NetworkIdentity
6. NetworkInstanceId
7. NetworkHash128
8. GameObject with a NetworkIdentity component attached
## 使用思路
理解了这些概念和设计就完全可以使用HLAPI制作多人游戏了，以我制作的游戏为例说明一下我的实现思路。
首先，是一个格斗游戏，要求是服务器验证并执行所有用户指令，并转发指令结果给客户端。那么，客户端只负责输入指令、播放动作(攻击、被打)，服务器执行战斗核心代码，例如：解析指令为技能、通知客户端释放技能、通知客户端状态(攻击、被打)。
1. BattleEngine，只在服务器执行。PlayerManager持有所有Player
2. 客户端接收指令，通过Cmd发送到服务器，在服务器上：BattleEngine接收指令，计算处理结果后通过PlayerManager对所有Player调用rpc方法(Server有最高控制权)，这样所有的客户端的所有player都能得到调用并更新显示。
3. 就这么简单，没了。需要注意的是，UNet把客户端和服务器同等对待，你编写的一个NetworkBehaviour既在客户端执行，也在服务器执行，非常容易搞混。建议通过方法名或者注释，来标记关键函数的调用点是客户端还是服务器。理清楚这个思路，编码就很轻松了。
