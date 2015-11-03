# React组件开发后记

如今react被广泛应用在各类应用上，直观的编程方式，易学易用的工具链，丰富的生态等等优点被大家所钟爱。
相信你已经熟悉react的用法和相关的开发工具，本文就不赘述react用法、特性等，换种思路，分享一下几个月前开发的组件 [autoresponsive-react](https://github.com/xudafeng/autoresponsive-react) 过程中的几点心得体会。想熟悉react用法推荐看阮一峰老师写的 [React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react)。

## 解决什么问题

    组件开发首要清晰的是，我们要解决什么问题?

我们一直在尝试解决web布局问题。**自动化布局** 一定程度上可以降低开发成本。首先我们要做到自然和直观的使用体验，同时减少布局上的约束条件。除此之外，用户对于布局的元素还可能会有条件排序，图文混排，自然流，动画等很多自定义需求。欣喜的是，react **去DOM化** 的开发思路很适合完成这样的事，而且使用组件时直接嵌套一个标签即可。

```javascript
...
render() {
  return (
    <AutoResponsive>
    	<Something />
    </AutoResponsive>
  );
}
...
```

## 了然的示例

    给使用者一目了然的示例，便于用户加深印象，最好有互动示例

使用者或其他开发者对组件的第一印象就是我们提供的示例，我们提供最基本的排序和布局范例，如下图。

![](http://ww4.sinaimg.cn/bmiddle/6d308bd9gw1ettap20q1cg20b80dc7pv.gif)

如果有需要，可以提供更加形象和例子：

![](http://ww4.sinaimg.cn/bmiddle/6d308bd9gw1ettap4hkvxg20a209de2d.gif)

也可访问相关链接：

- [home live demo](http://xudafeng.github.io/autoresponsive-react/)
- [responsive example](http://xudafeng.github.io/autoresponsive-react/examples/)

## 简明文档

    文档个人认为内容不要太多，基本的API和生命周期描述就够了，尽量减少初始化配置相关的描述，避免使用者压力太大

推荐提供一份英文文档很有必要，国外的react开发者相对要多，如果只有中文文档，国外用户会很麻烦。

![](http://ww4.sinaimg.cn/mw1024/6d308bd9gw1ex1xw02b57j20m805qwf6.jpg)

## 多端支持

于开发者来说，多端支持的理想方式是 "write once, run anywhere."，然RN发布的理念却是 "learn once, write anywhere."，理念差距蛮大。"write once" 当然也能够在工程上加以实现，这要依据工程化的必要性、使用场景和投入产出等多方面促成原因。

### 核心算法提取

要实现多端支持，首先要对核心算法进行提取，我们将其提取为 [autoresponsive-common](https://github.com/xudafeng/autoresponsive-common)。这样做利于工程无关的多向扩展，也利于后面对算法进行定制从而进一步开放。

这样之后，[autoresponsive-react-native](https://github.com/xudafeng/autoresponsive-react-native) 就成为了 [autoresponsive-react](https://github.com/xudafeng/autoresponsive-react) 的一致性实现。

从代码结构上看，初始化和渲染部分几近相同。

![](http://ww4.sinaimg.cn/mw1024/6d308bd9gw1ex2ywhirakj21cd1t97ko.jpg)

RN的效果如下：

![](http://ww1.sinaimg.cn/mw1024/6d308bd9gw1ettap705b7g207g0dckah.gif)

也可访问相关链接：

- [autoresponsive-react-native 示例](https://github.com/xudafeng/autoresponsive_react_native_sample)
- [reactnative.com 中的相关说明](http://www.reactnative.com/responsive-images-in-react-native/)

### 发散思维

除了布局方面，autoresponsive 核心算法能做的还有很多。不妨发散一下思维，举个例子。我们可以编写个小游戏，当然，原理与布局大同小异。

![](http://ww2.sinaimg.cn/mw1024/6d308bd9gw1ex1una787yg20s80k0drt.gif)

放松一下? [戳链接 - 钻石迷情](http://xudafeng.github.io/diamond/1.0.0/demo/)

## 测试用例与CI

    覆盖测试用例是最重要的一环

![](http://ww2.sinaimg.cn/mw1024/6d308bd9gw1ex1t4km6w1j20m8059mxs.jpg)

为我们的组件覆盖测试用例是非常必要的，添加过CI标识的项目会显得靠谱一点。试想一下，如果项目都跑不起来，岂不浪费其他使用者的时间？

react 组件的测试用例编写也很方便，如果你愿意，可以完全不用浏览器运行时环境。react也对测试提供了强大的支持，使用 `React.addons.TestUtils` 配合 `jsdom`，选择常用的流程控制框架和断言库即可完成测试覆盖。[详](https://github.com/xudafeng/autoresponsive-react/tree/master/test)

## 处理PR

    及时处理PR，弄清楚用户的要求

组件会有其他使用者的issue或pr，主要集中在bugfix、版本兼容性，构建方式改进等几个方面。在不违背组件设计和理念的情况下，尽量满足和实现。国外用户会相对活跃一些。

![](http://ww1.sinaimg.cn/mw1024/6d308bd9gw1exlckgwd4dj21j00wagru.jpg)

## 相关推荐

- [Ant Design](https://github.com/ant-design/ant-design) - 高质量的UI library
- [reactnative.com](http://www.reactnative.com/) - RN 非官方站点
- [startserver](https://github.com/xudafeng/startserver) - 简单顺手的的静态服务器

react相关知识一直在学习之中，有误欢迎指出或者私聊哦！

也欢迎联系我: [github/xudafeng](https://github.com/xudafeng)或[@达峰的夏天](http://weibo.com/xudafeng/)