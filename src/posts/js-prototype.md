---
date: 2014-12-31
title: JavaScript prototype
category:
- 技术
tag:
- js
- JavaScript
---
JavaScript不包含传统的类型继承模型，而是使用prototype原型模型，并且JavaScript是唯一一个被广泛使用的基于原型继承的语言。所以通过JavaScript理解这两种继承模式的差异会有难度，但也相当有必要。
## 属性查找规则
这是整个原型继承的基础。
1. 先查找对象本身的所有属性。
2. 查找原型对象的所有属性，并继续向上遍历原型链，直到找到指定名称的属性为止。
3. 查找到达原型链的顶部，也就是 Object.prototype，但是仍然没有找到指定的属性，就会返回 undefined。
## 原型继承模型
每个函数都有一个prototype属性，它的值就是原型对象，像正常对象一样它可以包含方法和属性。将这个函数用作构造函数调用(使用new调用)的时候，新创建的对象可以继承原型上的属性和方法。
### 示例
	function People(name) {
		this.name = name;
		this.say = function () {
			console.log("Hello! I am " + this.name);
		}
	}
	//共享的原型属性
	People.prototype.gender = "male";
	People.prototype.shareSay = function () {
		console.log("I am " + this.name);
	}
	var p1 = new People("Ming");
	var p2 = new People("Liang");
	//调用对象自身的say
	p1.say();//"Hello! I am Ming"
	p2.say();//"Hello! I am Liang"
	//调用原型中的shareSay
	p1.shareSay();//"I am Ming"
	p2.shareSay();//"I am Liang"
	console.log(p1.gender + ", " + p2.gender);//male, male
	//修改原型中的属性
	People.prototype.gender = "female";
	console.log(p1.gender + ", " + p2.gender);//female, female
简单的示例中不难看出，对象p1,p2共享gender和shareSay属性，p1和p2指向相同的原型对象。
### 数据模型
这是通过Chrome浏览器调试查看的完整对象信息：
* People函数：
![People Model](./img/prototype3.png)
* 以People为构造函数创建的对象p1：
![People Model](./img/prototype4.png)
继承原理总结如下：
1. 每个对象都有`__proto__`属性，指向对象的原型，属性查找时以此进行链式查找。
2. 对象的`__proto__`值为构造函数的`prototype`属性。
3. 每个函数都有`prototype`属性，也就是我们在代码中操作的表示原型对象的属性。
4. 默认情况下，函数对象的`prototype`值为：
	* `constructor`属性：指向当前函数
	* `__proto__`属性：`Object.prototype`
> `__proto__`属性属于隐含属性，正常情况下不要直接使用或修改。
### 想到的问题
我认为一个好的学习方法是自己产生一些问题，然后通过一系列基础理论解决疑问，直到没有疑问。这样就把东西学通了。
`new`操作的过程是怎样的？`constructor`、`__proto__`的值是如何确定的？
> new操作的过程：
>
> 1. 一个对象会被创建，构造函数即是`new`后面的函数，该对象的`__proto__`赋值为构造函数的`prototype`属性。
> 2. 构造函数被执行，上下文的`this`被指定为新创建的对象。
> 3. 如果构造函数有返回值，那么它会取代`new`创建的对象。
## 一些常见错误
学习过程中搜索了一些比较热门的博客文章，经过多方学习与理解之后，却发现有些文章的解释有些错误。大家可以通过这些问题，检验一下对prototype的理解。
### 错误1
> 每个对象都有一个 constructor 属性,用于指向创建其的函数对象,如上例中的 fun.constructor 指向的 就是 Person.
这样的说法非常常见，但实际上对象本身没有constructor属性，如图所示：
![prototype inner](./img/prototype1.png)
这是通过Chrome浏览器调试查看的对象信息。图上可以发现，对象me本身并没有`constructor`，而`__proto__`属性中存在`constructor`属性，所以`constructor`是通过查找调用到prototype中属性的。
### 错误2
> 函数自身声明的方法和属性是 静态的
继续之前的示例代码：
	People.walk = function () {
		console.log("step.");
	}
	p1.walk();//error: function undefined
	People.walk();//"step."
示例代码中p1并不能调用walk方法，这个现象还是函数调用的搜索方式决定的。调用walk时，先从p1中找属性，发现没有。再到proto中找属性，没有，继续遍历proto找属性。很显然该属性不存在。
### 思考一下
	function Men(name) {
		this.name = name;
	}
	Men.prototype = new People();
	var m1 = new Men("Yue");
	m1.say();
对象`m1`的数据模型是什么样的？`m1.constructor`指向什么？
[答案](./img/prototype5.png)
## 参考资料
[1 javascript必知必会之prototype](http://www.cnblogs.com/mindsbook/archive/2009/09/19/javascriptYouMustKnowPrototype.html)
