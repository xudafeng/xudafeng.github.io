基本的jQuery插件设计模式
---
**我偶尔会写实现Javascript[设计模式](http://addyosmani.com/resources/essentialjsdesignpatterns/book/)的文章。经反馈证实，解决普遍的开发问题还是非常奏效的，而且我觉得使用设计模式大有裨益。不过，虽然知名的Javascript模式是有用的，但是话说回来开发者使用他们自己的一套设计模式也蛮爽的，例如：jQuery插件。虽然官方的jQuery[插件开发指南](http://docs.jquery.com/Plugins/Authoring)已经为写插件或者工具开了个好头，但是我们还是要深入一下。**

这几年，插件开发一直在不断地进化。开发插件不仅仅有一种方式，而是多种多样。事实上，某些模式对于规避一些常见问题或者架构上要优越一些。

一些开发者可能会喜欢使用jQuery UI[widget factory](http://ajpiano.com/widgetfactory/)；这对于开发复杂，灵活的UI组件是非常有好处的。有些人却不是这样。还有些人喜欢把他们组件解构模块化(类似于模块模式)或者像[AMD (异步模块定义)](https://github.com/amdjs/amdjs-api/wiki/AMD)一样封装一些模块。有些人利用强大的原型继承开发插件。还有些使用自定义事件或者pub/sub来实现插件内的通信。等等。

为开发一个适合所有需求的 jQuery 插件样本而做了一些研究之后，我开始考虑使用插件模式。这个样本在原理上讲概念很棒， 实际上我们极少按照固定风格来写插件，而是一直使用一种简单的模式。

让我们假设下，某一天你已经在尝试写你自己的Jquery插件，也很容易的组织所需要的功能。最后功能实现了。它做了需要做的，但是也许你觉得它的结构有待改进。 也许它可以更加灵活或者可以解决更多问题。如果这种情况很多，而且你也不确定各种jQuery插件模式之间有何有缺点，你就会发现我说的多么有帮助了。

我的建议并不能提供每个模式的解决方案，但是会覆盖一些开发者习惯性采纳的常用的模式。

**注意**：此文针对中高级开发者。如果你还没有准备接受，我很乐意为你推荐官方的jQuery[插件开发指南](http://docs.jquery.com/Plugins/Authoring),Ben Alman的[插件风格指南](http://msdn.microsoft.com/en-us/scriptjunkie/ff696759)和Remy Sharp的[“Signs of a Poorly Written jQuery Plugin”](http://remysharp.com/2010/06/03/signs-of-a-poorly-written-jquery-plugin/)。

## 模式

jQuery插件没有多少明确地规则，也是造成各种参差不齐实现的主要原因。想达到基本的水准，你可以给jQuery的$.fn增加一个方法属性，如下：
    
    $.fn.myPluginName = function() {
        // your plugin logic
    };

很简洁吧，但是下面的就要更加健壮了：

    (function( $ ){
        $.fn.myPluginName = function() {
            // your plugin logic
        };
    })( jQuery );
    
这里，我们我们把插件的逻辑封装在一个匿名函数里。以确保我们使用的$符号只代表jQuery的简写，而不会与其他库冲突，我们简单地将它传入闭包里，映射给一个美元符号，因此确保它不能被其作用域外部的代码影响。

这种模式的代替方案就是使用$.extend，你可以一次性定义各种方法，而且语意化更强：

    (function( $ ){
        $.extend($.fn, {
            myplugin: function(){
                // your plugin logic
            }
        });
    })( jQuery );
    
我们可以继续改进更多；今天第一个完整的模式就要就出炉了，轻量的模式，是应对基本的日常插件开发的最好实现了，并且考虑了一般的性能和可拓展性。

###一些札记

你可以找到这篇文章里所有的设计模式在这个[GitHub仓库](https://github.com/xudafeng/jquery-patterns)（原作者删除了仓库，译者补充了替代的仓库）。

虽然下面的绝大部分模式都会被解析，我推荐通过注释阅读代码，因为，这样你会直接体会到必要的实践才是最好的。

我想要说的是，没有先前做的功课预备工作，输入和建议其他jQuery社区成员是不可能办到的。我已经列出了他们惯用的各个模式，所以如果你感兴趣的话可以研读他们的个人作品。

##轻量的开始

让我们看下使用一些基础途径做到的最佳设计模式的实现(包括那些在jQuery插件开发指南里的)。此模式对于初级开发者或者只是想完成某个简单的功能(比如一个功能插件)是很理想的。这个轻量的开始使用了如下开发思想：

- 常规的最好实现， 比如在function前加分号；<code>window, document, undefined</code> 作为参数传入；并且坚持jQuery核心的风格。
- 一个基础的默认对象。
- 一个简单的插件构造器，具有初始化构建和给需要的元素赋值的逻辑。
- 通过默认项扩展其他项。
- 对构造器轻量的封装，帮助我们避免重复实例化造成的干扰问题。

code:

    /*!
     * jQuery lightweight plugin boilerplate
     * Original author: @ajpiano
     * Further changes, comments: @addyosmani
     * Licensed under the MIT license
     */
    
    
    // the semi-colon before the function invocation is a safety 
    // net against concatenated scripts and/or other plugins 
    // that are not closed properly.
    ;(function ( $, window, document, undefined ) {
        
        // undefined is used here as the undefined global 
        // variable in ECMAScript 3 and is mutable (i.e. it can 
        // be changed by someone else). undefined isn't really 
        // being passed in so we can ensure that its value is 
        // truly undefined. In ES5, undefined can no longer be 
        // modified.
        
        // window and document are passed through as local 
        // variables rather than as globals, because this (slightly) 
        // quickens the resolution process and can be more 
        // efficiently minified (especially when both are 
        // regularly referenced in your plugin).
    
        // Create the defaults once
        var pluginName = 'defaultPluginName',
            defaults = {
                propertyName: "value"
            };
    
        // The actual plugin constructor
        function Plugin( element, options ) {
            this.element = element;
    
            // jQuery has an extend method that merges the 
            // contents of two or more objects, storing the 
            // result in the first object. The first object 
            // is generally empty because we don't want to alter 
            // the default options for future instances of the plugin
            this.options = $.extend( {}, defaults, options) ;
            
            this._defaults = defaults;
            this._name = pluginName;
            
            this.init();
        }
    
        Plugin.prototype.init = function () {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element 
            // and this.options
        };
    
        // A really lightweight plugin wrapper around the constructor, 
        // preventing against multiple instantiations
        $.fn[pluginName] = function ( options ) {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, 
                    new Plugin( this, options ));
                }
            });
        }
    
    })( jQuery, window, document );    
    
    
###拓展阅读

- [插件开发](http://docs.jquery.com/Plugins/Authoring)， jQuery
- “[怎么把jQuery插件写烂](http://remysharp.com/2010/06/03/signs-of-a-poorly-written-jquery-plugin/)，” Remy Sharp
- “[如何创建你自己的jQuery插件](http://msdn.microsoft.com/en-us/scriptjunkie/ff608209)，” Elijah Manor
- “[jQuery插件风格和为什么奏效]()，” Ben Almon
- “[创建你的第一个jQuery插件 2]()” Andrew Wirick

##“完整的” 组件 工厂

虽然开发指南对插件开发是个非常棒的介绍，但是并没有提供多少方便条件，我们必须定期处理。

jQuery UI 组件工厂主要是解决创建复杂，多状态性面向对象的插件的问题。它也可以轻松地解决插件实例间通信，但是混淆了一系列的重复任务，再基础的插件你也不得不码出来。

假使你以前没有遇到过，使用状态性插件记录当前的状态，也可以在初始化之后改变插件的属性。

组件工厂设计的非常好以至于，jQuery UI库实际上都使用它作为组件的基础。这意味着如果你想找到比样本更好的代码组织方式，你还真得仔细看一下jQuery UI。

扯回设计模式。jQuery UI 样本做了如下工作：

- 覆盖了绝大部分默认支持的方法，包括触发事件。
- 包括一些方法的注释，因此也不确定哪个逻辑你也没准儿用得上。

code:

    /*!
     * jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
     * Author: @addyosmani
     * Further changes: @peolanha
     * Licensed under the MIT license
     */
    
    
    ;(function ( $, window, document, undefined ) {
    
        // define your widget under a namespace of your choice
        //  with additional parameters e.g. 
        // $.widget( "namespace.widgetname", (optional) - an 
        // existing widget prototype to inherit from, an object 
        // literal to become the                         widget's prototype ); 
    
        $.widget( "namespace.widgetname" , {
    
            //Options to be used as defaults
            options: {
                someValue: null
            },
    
            //Setup widget (eg. element creation, apply theming
            // , bind events etc.)
            _create: function () {
    
                // _create will automatically run the first time 
                // this widget is called. Put the initial widget 
                // setup code here, then you can access the element 
                // on which the widget was called via this.element. 
                // The options defined above can be accessed 
                // via this.options this.element.addStuff();
            },
    
            // Destroy an instantiated plugin and clean up 
            // modifications the widget has made to the DOM
            destroy: function () {
    
                // this.element.removeStuff();
                // For UI 1.8, destroy must be invoked from the 
                // base widget
                $.Widget.prototype.destroy.call(this);
                // For UI 1.9, define _destroy instead and don't 
                // worry about 
                // calling the base widget
            },
    
            methodB: function ( event ) {
                //_trigger dispatches callbacks the plugin user 
                // can subscribe to
                // signature: _trigger( "callbackName" , [eventObject], 
                // [uiObject] )
                // eg. this._trigger( "hover", e /*where e.type == 
                // "mouseenter"*/, { hovered: $(e.target)});
                this._trigger('methodA', event, {
                    key: value
                });
            },
    
            methodA: function ( event ) {
                this._trigger('dataChanged', event, {
                    key: value
                });
            },
    
            // Respond to any changes the user makes to the 
            // option method
            _setOption: function ( key, value ) {
                switch (key) {
                case "someValue":
                    //this.options.someValue = doSomethingWith( value );
                    break;
                default:
                    //this.options[ key ] = value;
                    break;
                }
    
                // For UI 1.8, _setOption must be manually invoked 
                // from the base widget
                $.Widget.prototype._setOption.apply( this, arguments );
                // For UI 1.9 the _super method can be used instead
                // this._super( "_setOption", key, value );
            }
        });
    
    })( jQuery, window, document );

###拓展阅读

- [jQuery UI工具工厂](http://ajpiano.com/widgetfactory/#slide1)
- ”[状态性插件和工具工厂的介绍](http://msdn.microsoft.com/en-us/scriptjunkie/ff706600)，“ Doug Neiner
- “[插件工厂](http://wiki.jqueryui.com/w/page/12138135/Widget%20factory)” (explained)， Scott Gonzalez
- ”[理解jQuery UI工具：一个教程](http://bililite.com/blog/understanding-jquery-ui-widgets-a-tutorial/)，“ Hacking at 0300

##命名空间和嵌套

创建命名空间是避免与其他在全局下的对象和变量冲突。命名空间很重要，因为当页面上其他脚本使用了同样的变量或者和你一样的插件名称，你要确保插件的环境安全。想成为全局命名空间下的良民，你同样要尽量保证你的插件不会影响别人的代码执行。

JavaScript并不是像其他语言一样支持真正的命名空间，但是它确实有可以实现类似功能的对象。 使用一个顶级对象作为命名空间的名称，你可以很容易地检查这个页面是否有同名的对象。如果这个对象不存在，我们就可以声明它。如果它存在，我们就可以用我们的插件简单的扩展它。

对象(或者，更确切一点儿，对象常量) 可以用来创建嵌套命名空间，比如<code>namespace.subnamespace.pluginName</code>等等。但是简单起见，如下的命名空间样例给你提供了这些概念里你所需要的一切。

    /*!
     * jQuery namespaced 'Starter' plugin boilerplate
     * Author: @dougneiner
     * Further changes: @addyosmani
     * Licensed under the MIT license
     */
    
    ;(function ( $ ) {
        if (!$.myNamespace) {
            $.myNamespace = {};
        };
    
        $.myNamespace.myPluginName = function ( el, myFunctionParam, options ) {
            // To avoid scope issues, use 'base' instead of 'this'
            // to reference this class from internal events and functions.
            var base = this;
    
            // Access to jQuery and DOM versions of element
            base.$el = $(el);
            base.el = el;
    
            // Add a reverse reference to the DOM object
            base.$el.data( "myNamespace.myPluginName" , base );
    
            base.init = function () {
                base.myFunctionParam = myFunctionParam;
    
                base.options = $.extend({}, 
                $.myNamespace.myPluginName.defaultOptions, options);
    
                // Put your initialization code here
            };
    
            // Sample Function, Uncomment to use
            // base.functionName = function( paramaters ){
            // 
            // };
            // Run initializer
            base.init();
        };
    
        $.myNamespace.myPluginName.defaultOptions = {
            myDefaultValue: ""
        };
    
        $.fn.mynamespace_myPluginName = function 
            ( myFunctionParam, options ) {
            return this.each(function () {
                (new $.myNamespace.myPluginName(this, 
                myFunctionParam, options));
            });
        };
    
    })( jQuery );
    
###拓展阅读

- “[JavaScript命名空间](http://javascriptweblog.wordpress.com/2010/12/07/namespacing-in-javascript/)，” Angus Croll
- “[使用你的$.fn jQuery命名空间](http://ryanflorence.com/use-your-fn-jquery-namespace/)，” Ryan Florence
- “[JavaScript命名空间](http://michaux.ca/articles/javascript-namespacing)，” Peter Michaux
- “[JavaScript模块和命名空间](http://www.2ality.com/2011/04/modules-and-namespaces-in-javascript.html)，” Axel Rauschmayer
    
##自定义事件 Pub/Sub (使用工具工厂)

在以前的异步Javascript应用开发中，你也许使用过观察者(Pub/Sub)模式。基本的思想就是元素会在你的应用发生有趣的变化时公布事件通知。其它元素订阅或者监听这些事件并且响应。你的应用里使用这种逻辑非常利于解耦(从来都是优秀的)。

在jQuery中，我们给自定义事件提供一个内置的方法实现一个类似于观察者模式的公布和订阅系统。因此，bind('eventType')与执行subscribe('eventType')是等效的，而且trigger('eventType')与publish('eventType')效果也差不多。

一些开发者可能认为jQuery 事件系统被用来做公布和订阅系统开销太大了，但是绝大部分用例 中，这种架构是可靠的健壮的。在如下jQuery UI 工具工厂的样本里，我们将实现一个基本的自定义事件pub/sub模式，让我们的插件来订阅应用其他部分公布的事件通知。

    /*!
     * jQuery custom-events plugin boilerplate
     * Author: DevPatch
     * Further changes: @addyosmani
     * Licensed under the MIT license
     */
    
    // In this pattern, we use jQuery's custom events to add 
    // pub/sub (publish/subscribe) capabilities to widgets. 
    // Each widget would publish certain events and subscribe 
    // to others. This approach effectively helps to decouple 
    // the widgets and enables them to function independently.
    
    ;(function ( $, window, document, undefined ) {
        $.widget("ao.eventStatus", {
            options: {
    
            },
            
            _create : function() {
                var self = this;
    
                //self.element.addClass( "my-widget" );
    
                //subscribe to 'myEventStart'
                self.element.bind( "myEventStart", function( e ) {
                    console.log("event start");
                });
    
                //subscribe to 'myEventEnd'
                self.element.bind( "myEventEnd", function( e ) {
                    console.log("event end");
                });
    
                //unsubscribe to 'myEventStart'
                //self.element.unbind( "myEventStart", function(e){
                    ///console.log("unsubscribed to this event"); 
                //});
            },
    
            destroy: function(){
                $.Widget.prototype.destroy.apply( this, arguments );
            },
        });
    })( jQuery, window , document );
    
    //Publishing event notifications
    //usage: 
    // $(".my-widget").trigger("myEventStart");
    // $(".my-widget").trigger("myEventEnd");    
    
##DOM-To-Object桥接模式的原型继承

JavaScript中，与其他语言不同的是，我们并没有类的概念，但是我们可以使用原型继承。使用原型继承，一个对象可以继承自另外一个对象。并且我们可以把这个概念应用到jQuery插件的开发上。

Alex Sexton 和 Scott Gonzalez 已经详细地看了这个主题。总结下，他们发现组织模块化的发展，清晰的分离为插件定义逻辑的对象从插件创建过程本身就很有益处。好处就是测试你的插件代码变得更加容易，并且你也能在幕后调整代码的形式从而不需要改变你已经实现的对象API使用方式。

在Sexton的前一篇关于这个主题的文章中，他实现了如下样板代码所示的一个桥，能够让你给一个特定的插件添加正常的逻辑。此模式的另一个优势是你不能不断的重复执行插件的初始化代码，因此可以确保维持DRY开发背后的理念。一些开发者或许发现这种模式可读性更强一些

    /*!
     * jQuery prototypal inheritance plugin boilerplate
     * Author: Alex Sexton, Scott Gonzalez
     * Further changes: @addyosmani
     * Licensed under the MIT license
     */
    
    
    // myObject - an object representing a concept that you want 
    // to model (e.g. a car)
    var myObject = {
      init: function( options, elem ) {
        // Mix in the passed-in options with the default options
        this.options = $.extend( {}, this.options, options );
    
        // Save the element reference, both as a jQuery
        // reference and a normal reference
        this.elem  = elem;
        this.$elem = $(elem);
    
        // Build the DOM's initial structure
        this._build();
    
        // return this so that we can chain and use the bridge with less code.
        return this;
      },
      options: {
        name: "No name"
      },
      _build: function(){
        //this.$elem.html('<h1>'+this.options.name+'</h1>');
      },
      myMethod: function( msg ){
        // You have direct access to the associated and cached
        // jQuery element
        // this.$elem.append('<p>'+msg+'</p>');
      }
    };
    
    
    // Object.create support test, and fallback for browsers without it
    if ( typeof Object.create !== 'function' ) {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }
    
    
    // Create a plugin based on a defined object
    $.plugin = function( name, object ) {
      $.fn[name] = function( options ) {
        return this.each(function() {
          if ( ! $.data( this, name ) ) {
            $.data( this, name, Object.create(object).init( 
            options, this ) );
          }
        });
      };
    };
    
    // Usage:
    // With myObject, we could now essentially do this:
    // $.plugin('myobj', myObject);
    
    // and at this point we could do the following
    // $('#elem').myobj({name: "John"});
    // var inst = $('#elem').data('myobj');
    // inst.myMethod('I am a method');  
    
###扩展阅读

- “[使用继承模式组织大型jQuery应用](http://alexsexton.com/?p=51),” Alex Sexton
- “[如何使用jQuery等组织管理大型应用](http://www.slideshare.net/SlexAxton/how-to-manage-large-jquery-apps)” (进一步讨论), Alex Sexton
- “[必要的原型继承例析](http://blog.bigbinary.com/2010/03/12/pratical-example-of-need-for-prototypal-inheritance.html),” Neeraj Singh
- “[JavaScript原型继承](http://javascript.crockford.com/prototypal.html),” Douglas Crockford  
    
##jQuery UI 工具工厂桥

如果你喜欢基于最新的设计模式开发插件，你可能会对jQuery UI工具工厂里的<code>$.widget.bridge</code>感兴趣。这个桥作为通过<code>$.widget</code>创建的JavaScript对象与jQuery API的中间层提供基础服务，提供更多的内置解决方案实现面向对象的定义。实际上，我们有能力创建状态性插件使用自定义构造器。

此外，<code>$.widget.bridge</code>提供了其它一系列功能，包括如下：

- 共有和私有方法可以作为传统的OOP编程的一大特点 (也就是暴露公有方法，但是调用私有方法就不可能了);
- 解决重复初始化的自动保护;
- 自动创建传入对象的实例并且选择内部的<code>$.data</code>做缓存。
- 各个项可以更改后再初始化。

具体怎么使用这个模式，可以看下样例中的注释：

    /*!
     * jQuery UI Widget factory "bridge" plugin boilerplate
     * Author: @erichynds
     * Further changes, additional comments: @addyosmani
     * Licensed under the MIT license
     */
    
    
    
    // a "widgetName" object constructor
    // required: this must accept two arguments,
    // options: an object of configuration options
    // element: the DOM element the instance was created on
    var widgetName = function( options, element ){
      this.name = "myWidgetName";
      this.options = options;
      this.element = element;
      this._init();
    }
    
    
    // the "widgetName" prototype
    widgetName.prototype = {
        
        // _create will automatically run the first time this 
        // widget is called
        _create: function(){
            // creation code
        },
    
        // required: initialization logic for the plugin goes into _init
        // This fires when your instance is first created and when 
        // attempting to initialize the widget again (by the bridge)
        // after it has already been initialized.
        _init: function(){
            // init code
        },
    
        // required: objects to be used with the bridge must contain an 
        // 'option'. Post-initialization, the logic for changing options
        // goes here. 
        option: function( key, value ){
            
            // optional: get/change options post initialization
            // ignore if you don't require them.
            
            // signature: $('#foo').bar({ cool:false });
            if( $.isPlainObject( key ) ){
                this.options = $.extend( true, this.options, key );
            
            // signature: $('#foo').option('cool'); - getter
            } else if ( key && typeof value === "undefined" ){
                return this.options[ key ];
                
            // signature: $('#foo').bar('option', 'baz', false);
            } else {
                this.options[ key ] = value;
            }
            
            // required: option must return the current instance. 
            // When re-initializing an instance on elements, option 
            // is called first and is then chained to the _init method.
            return this;  
        },
    
        // notice no underscore is used for public methods
        publicFunction: function(){ 
            console.log('public function');
        },
    
        // underscores are used for private methods
        _privateFunction: function(){ 
            console.log('private function');
        }
    };
    
    
    // usage:
    
    // connect the widget obj to jQuery's API under the "foo" namespace
    // $.widget.bridge("foo", widgetName);
    
    // create an instance of the widget for use
    // var instance = $("#elem").foo({
    //     baz: true
    // });
    
    // your widget instance exists in the elem's data
    // instance.data("foo").element; // => #elem element
    
    // bridge allows you to call public methods...
    // instance.foo("publicFunction"); // => "public method"
    
    // bridge prevents calls to internal methods
    // instance.foo("_privateFunction"); // => #elem element   
    
###扩展阅读

- “[使用工具工厂之外的$.widget.bridge](http://erichynds.com/jquery/using-jquery-ui-widget-factory-bridge/),” Eric Hynds 
    
##jQuery 工具工程开发手机工具

手机版jQuery是一个鼓励普遍存在的web应用在主流移动设备和平台还有桌面端设计的框架。比起给每个设备和系统写独立应用，你现在可以只简单地写一个，并且可以很理想地运行在 A-, B- 和 C-级浏览器上。

jQuery手机版的基本原理也可以应用在插件和工具开发中，显然在一些jQuery mobile 核心组件被用在官方库套件里。有趣的是，即使在写移动端组件有很小 ，很细微的不同，如果你对jQuery UI组件工厂使用熟悉，就可以立刻上手。

如下的移动化组件与我们以前看过的标准 UI 组件在模式上有很多有趣的不同：

- <code>$.mobile.widget</code> 做为一个现成的组件原型被引用做继承来使用。至于标准组件，基本的开发而言跨越任何这种原型的做法根本没必要，但是是要你管jQuery-mobile 特殊组件原型内部提供实现更深层“options” 格式化的方式。
- 要注意 <code>_create()</code> 是一个代表jQuery mobile官方组件如何操作元素选择的方法，选择一个基于角色的方法是使用jQM的加分项。不是说标准的选择方式不好，而是这种方式可以给出更有意义的jQM页面结构。
- 指南也以注释的形式提供通过<code>pagecreate</code>应用你的插件方法，还有通过数据角色和数据属性选择插件应用。

code:

    /*!
     * (jQuery mobile) jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
     * Author: @scottjehl
     * Further changes: @addyosmani
     * Licensed under the MIT license
     */
    
    ;(function ( $, window, document, undefined ) {
    
        //define a widget under a namespace of your choice
        //here 'mobile' has been used in the first parameter
        $.widget( "mobile.widgetName", $.mobile.widget, {
    
            //Options to be used as defaults
            options: {
                foo: true,
                bar: false
            },
    
            _create: function() {
                // _create will automatically run the first time this 
                // widget is called. Put the initial widget set-up code 
                // here, then you can access the element on which 
                // the widget was called via this.element
                // The options defined above can be accessed via 
                // this.options
    
                //var m = this.element,
                //p = m.parents(":jqmData(role='page')"),
                //c = p.find(":jqmData(role='content')")
            },
    
            // Private methods/props start with underscores
            _dosomething: function(){ ... },
    
            // Public methods like these below can can be called 
                    // externally: 
            // $("#myelem").foo( "enable", arguments );
    
            enable: function() { ... },
    
            // Destroy an instantiated plugin and clean up modifications 
            // the widget has made to the DOM
            destroy: function () {
                //this.element.removeStuff();
                // For UI 1.8, destroy must be invoked from the 
                // base widget
                $.Widget.prototype.destroy.call(this);
                // For UI 1.9, define _destroy instead and don't 
                // worry about calling the base widget
            },
    
            methodB: function ( event ) {
                //_trigger dispatches callbacks the plugin user can 
                // subscribe to
                //signature: _trigger( "callbackName" , [eventObject],
                //  [uiObject] )
                // eg. this._trigger( "hover", e /*where e.type == 
                // "mouseenter"*/, { hovered: $(e.target)});
                this._trigger('methodA', event, {
                    key: value
                });
            },
    
            methodA: function ( event ) {
                this._trigger('dataChanged', event, {
                    key: value
                });
            },
    
            //Respond to any changes the user makes to the option method
            _setOption: function ( key, value ) {
                switch (key) {
                case "someValue":
                    //this.options.someValue = doSomethingWith( value );
                    break;
                default:
                    //this.options[ key ] = value;
                    break;
                }
    
                // For UI 1.8, _setOption must be manually invoked from 
                // the base widget
                $.Widget.prototype._setOption.apply(this, arguments);
                // For UI 1.9 the _super method can be used instead
                // this._super( "_setOption", key, value );
            }
        });
    
    })( jQuery, window, document );
    
    //usage: $("#myelem").foo( options );
    
    
    /* Some additional notes - delete this section before using the boilerplate.
    
     We can also self-init this widget whenever a new page in jQuery Mobile is created. jQuery Mobile's "page" plugin dispatches a "create" event when a jQuery Mobile page (found via data-role=page attr) is first initialized.
    
    We can listen for that event (called "pagecreate" ) and run our plugin automatically whenever a new page is created.
    
    $(document).bind("pagecreate", function (e) {
        // In here, e.target refers to the page that was created 
        // (it's the target of the pagecreate event)
        // So, we can simply find elements on this page that match a 
        // selector of our choosing, and call our plugin on them.
        // Here's how we'd call our "foo" plugin on any element with a 
        // data-role attribute of "foo":
        $(e.target).find("[data-role='foo']").foo(options);
    
        // Or, better yet, let's write the selector accounting for the configurable 
        // data-attribute namespace
        $(e.target).find(":jqmData(role='foo')").foo(options);
    });
    
    That's it. Now you can simply reference the script containing your widget and pagecreate binding in a page running jQuery Mobile site, and it will automatically run like any other jQM plugin.
     */
     
##RequireJS 与 jQuery UI 工具工厂

RequireJS是一个脚本加载器，提供一个清晰的解决方案将应用逻辑封装在易管理的模块内部。它也可以以正确的顺序加载模块(通过它的序列插件)；通过它大量的优化，简化了结合脚本的方式；并且它提供每个模块定义依赖关系的方法。

James Burke 为RequireJS写了一系列全面的教程。但是倘若你已经熟习如何使用它并且想要在一个兼容Resquire的模块里封装你的jQuery UI工具或者插件?

在如下的示例中，我们通过下面的工作展示如何定义一个这种模块：

- 在上一个jQuery UI 样本所表达的基础上，允许工具模块定义依赖；
- 演示的方法之一，传入 HTML 模板，通过jQuery创建模板化的工具(结合 jQuery 模板插件) (看 <code>_create()</code>的注释。)
- 包括一个小调整让你的工具模块以后可以通过RequireJS 优化器管理

code:

    /*!
     * jQuery UI Widget + RequireJS module boilerplate (for 1.8/9+)
     * Authors: @jrburke, @addyosmani
     * Licensed under the MIT license
     */
    
     
    // Note from James:
    // 
    // This assumes you are using the RequireJS+jQuery file, and 
    // that the following files are all in the same directory: 
    //
    // - require-jquery.js 
    // - jquery-ui.custom.min.js (custom jQuery UI build with widget factory) 
    // - templates/ 
    //    - asset.html 
    // - ao.myWidget.js 
    
    // Then you can construct the widget like so: 
    
    
    
    //ao.myWidget.js file: 
    define("ao.myWidget", ["jquery", "text!templates/asset.html", "jquery-ui.custom.min","jquery.tmpl"], function ($, assetHtml) {
    
        // define your widget under a namespace of your choice
        // 'ao' is used here as a demonstration 
        $.widget( "ao.myWidget", { 
    
            // Options to be used as defaults
            options: {}, 
    
            // Set up widget (e.g. create element, apply theming, 
            // bind events, etc.)
            _create: function () {
    
                // _create will automatically run the first time 
                // this widget is called. Put the initial widget 
                // set-up code here, then you can access the element 
                // on which the widget was called via this.element.
                // The options defined above can be accessed via 
                // this.options
    
                //this.element.addStuff();
                //this.element.addStuff();
                //this.element.tmpl(assetHtml).appendTo(this.content); 
            },
    
            // Destroy an instantiated plugin and clean up modifications 
            // that the widget has made to the DOM
            destroy: function () {
                //t his.element.removeStuff();
                // For UI 1.8, destroy must be invoked from the base 
                // widget
                $.Widget.prototype.destroy.call( this );
                // For UI 1.9, define _destroy instead and don't worry 
                // about calling the base widget
            },
    
            methodB: function ( event ) {
                // _trigger dispatches callbacks the plugin user can 
                // subscribe to
                //signature: _trigger( "callbackName" , [eventObject], 
                // [uiObject] )
                this._trigger('methodA', event, {
                    key: value
                });
            },
    
            methodA: function ( event ) {
                this._trigger('dataChanged', event, {
                    key: value
                });
            },
    
            //Respond to any changes the user makes to the option method
            _setOption: function ( key, value ) {
                switch (key) {
                case "someValue":
                    //this.options.someValue = doSomethingWith( value );
                    break;
                default:
                    //this.options[ key ] = value;
                    break;
                }
    
                // For UI 1.8, _setOption must be manually invoked from 
                // the base widget
                $.Widget.prototype._setOption.apply( this, arguments );
                // For UI 1.9 the _super method can be used instead
                //this._super( "_setOption", key, value );
            }
    
            //somewhere assetHtml would be used for templating, depending 
            // on your choice.
        }); 
    }); 
    
    
    // If you are going to use the RequireJS optimizer to combine files 
    // together, you can leave off the "ao.myWidget" argument to define: 
    // define(["jquery", "text!templates/asset.html", "jquery-ui.custom.min"], …

###拓展阅读

- [jQuery使用RequireJS](http://jqfundamentals.com/book/index.html#example-10.5), Rebecca Murphey
- “[基于jQuery 与 RequireJS的高速模块化代码](http://speakerrate.com/talks/2983-fast-modular-code-with-jquery-and-requirejs),” James Burke
- “[jQuery最好的伙伴](http://jquerysbestfriends.com/#slide1) ,” Alex Sexton
- “[使用RequireJS处理依赖关系](http://www.angrycoding.com/2011/09/managing-dependencies-with-requirejs.html),” Ruslan Matveev
    
##每次调用覆盖全局各配置项 (最佳配置项模式)

到了我们的下一种模式，我们来看插件的一种理想配置项方式。这种方式你或许很熟悉了，定义插件配置项传入一个内部默认对象给$.extend，就像我们基础插件样例演示的那样。

然而，如果你的插件有很多自定义的配置项，你会希望用户无论在全局还是每次调用时都能够覆盖，那么你就可以稍微改进下代码的结构组织了。

反而, 通过参照：使用插件命名空间明确地定义配置对象(比如，<code>$fn.pluginName.options</code>)并且在初始化的时候与传入插件的配置合并，用户可以选择在初始化时传入或者在插件外部覆盖配置(像演示的那样).

    /*!
     * jQuery 'best options' plugin boilerplate
     * Author: @cowboy
     * Further changes: @addyosmani
     * Licensed under the MIT license
     */
    
    
    ;(function ( $, window, document, undefined ) {
    
        $.fn.pluginName = function ( options ) {
    
            // Here's a best practice for overriding 'defaults'
            // with specified options. Note how, rather than a 
            // regular defaults object being passed as the second
            // parameter, we instead refer to $.fn.pluginName.options 
            // explicitly, merging it with the options passed directly 
            // to the plugin. This allows us to override options both 
            // globally and on a per-call level. 
    
            options = $.extend( {}, $.fn.pluginName.options, options );
    
            return this.each(function () {
    
                var elem = $(this);
    
            });
        };
    
        // Globally overriding options
        // Here are our publicly accessible default plugin options 
        // that are available in case the user doesn't pass in all 
        // of the values expected. The user is given a default
        // experience but can also override the values as necessary.
        // eg. $fn.pluginName.key ='otherval';
    
        $.fn.pluginName.options = {
    
            key: "value",
            myMethod: function ( elem, param ) {
                
            }
        };
        
    })( jQuery, window, document );

###扩展阅读

- [jQuery 插件](http://benalman.com/talks/jquery-pluginization.html) and the [附带的 gist](https://gist.github.com/472783/e8bf47340413129a8abe5fac55c83336efb5d4e1), Ben Alman
    
##高度配置化与多变化插件

就像 Alex Sexton 的模式，我们插件的如下逻辑没有自己嵌入jQuery插件。我们使用一个构造器和一个内部对象的原型定义插件的逻辑，使用jQuery来实例化插件对象。

通过使用两个小招数可以把用户定制化提高一个档次，其中一个在上个模式中已经见过了：

- 无论是全局的还是每个元素集合的配置项能够被覆盖；

- **单个元素**级的可定制化可以通过 HTML5 data 属性 (如下所示)实现。这样有助于插件行为，而且可以被应用到元素集合上but then 是定义内联属性从而不需要遍历元素值。

你往往意识不到后者，但是它完全是个优秀简洁的实现 (只要你不介意内联用法)。如果你想知道哪里可以用得到，假设写了一个可以操作大量元素的拖拽组件。你可以考虑这样实现定制化：

    javascript
    $('.item-a').draggable({'defaultPosition':'top-left'});
    $('.item-b').draggable({'defaultPosition':'bottom-right'});
    $('.item-c').draggable({'defaultPosition':'bottom-left'});
    //etc
    
但是使用我们的内联的方式，就有了如下实现：

    javascript
    $('.items').draggable();

    html
    <li class="item" data-plugin-options='{"defaultPosition":"top-left"}'></div>
    <li class="item" data-plugin-options='{"defaultPosition":"bottom-left"}'></div>
    
不仅如此，你可以有一种自己偏爱的开发习惯，但需要知道的是，它是另一种潜在有用的开发模式。

    /*
     * 'Highly configurable' mutable plugin boilerplate
     * Author: @markdalgleish
     * Further changes, comments: @addyosmani
     * Licensed under the MIT license
     */
    
    
    // Note that with this pattern, as per Alex Sexton's, the plugin logic
    // hasn't been nested in a jQuery plugin. Instead, we just use
    // jQuery for its instantiation.
    
    ;(function( $, window, document, undefined ){
    
      // our plugin constructor
      var Plugin = function( elem, options ){
          this.elem = elem;
          this.$elem = $(elem);
          this.options = options;
    
          // This next line takes advantage of HTML5 data attributes
          // to support customization of the plugin on a per-element
          // basis. For example,
          // <div class=item' data-plugin-options='{"message":"Goodbye World!"}'></div>
          this.metadata = this.$elem.data( 'plugin-options' );
        };
    
      // the plugin prototype
      Plugin.prototype = {
        defaults: {
          message: 'Hello world!'
        },
    
        init: function() {
          // Introduce defaults that can be extended either 
          // globally or using an object literal. 
          this.config = $.extend({}, this.defaults, this.options, 
          this.metadata);
    
          // Sample usage:
          // Set the message per instance:
          // $('#elem').plugin({ message: 'Goodbye World!'});
          // or
          // var p = new Plugin(document.getElementById('elem'), 
          // { message: 'Goodbye World!'}).init()
          // or, set the global default message:
          // Plugin.defaults.message = 'Goodbye World!'
    
          this.sampleMethod();
          return this;
        },
    
        sampleMethod: function() {
          // eg. show the currently configured message
          // console.log(this.config.message);
        }
      }
    
      Plugin.defaults = Plugin.prototype.defaults;
    
      $.fn.plugin = function(options) {
        return this.each(function() {
          new Plugin(this, options).init();
        });
      };
    
      //optional: window.Plugin = Plugin;
    
    })( jQuery, window , document );

###扩展阅读

- “[创建高度配置化jQuery插件](http://markdalgleish.com/2011/05/creating-highly-configurable-jquery-plugins/),” Mark Dalgleish
- “[编写高度配制化jQeury插件，2](http://markdalgleish.com/2011/09/html5data-creating-highly-configurable-jquery-plugins-part-2/)，” Mark Dalgleish
    
##AMD与CommonJS并存模块

虽然上面提供的很多插件和工具模式足以应对普通使用需求，也不能没有注意事项。有一些为了功能需要jQuery或者jQuery UI组件工厂，但是只有一少部分模块可以做到在客户端和其他环境适配全局。

因为这个原因，一批开发人员，包括我，CDNjsFor this reason, a number of developers, including me, CDNjs 持有者 Thomas Davis 和 RP Florence，已经看了AMD (Asynchronous Module Definition)和CommonJS 模块规范，希望扩展样本插件模式可以清晰的使用包和依赖。John Hann 和 Kit Cambridge 也在这个领域做了深入的研究。

**AMD**

AMD模块规范(定义模块及其依赖模块异步加载的规范)有很多显著的优势，包括异步化和天生就灵活，因此解除了代码和模块一致性的耦合的情况. 它被认为是ES6提议中一个靠谱的里程碑。

当使用匿名模块，这个想法是DRY，来避免文件名和代码重复。因为代码更加便携，它可以被用到其他地方。开发者也可以在复杂的环境运行同样的代码，只需要使用有CommonJS环境的AMD优化器，例如[r.js](https://github.com/jrburke/r.js/)。

使用AMD，你需要知道的两个关键概念是require方法和define方法，对模块定义和依赖加载很重要。define方法按照说明是用来定义命名过的或者无名的模块，使用如下写法：

    define(module_id /*optional*/, [dependencies], definition function /*function for instantiating the module or object*/);

你可以从行内注释分辨，模块的ID是个可选的参数，只有当没有使用AMD时候被引用(它也可以被用在其他极端情况)。选择不使用模块ID的一个好处不需要改变模块模块ID就可以在文件系统里灵活地移动你的模块。在简单的包中并且没被使用，模块ID相当于文件夹路径。

依赖参数是用一个被你定义的模块引用的依赖数组表示的，第三个参数(工厂)是执行代码实例化的函数。 一个非常简单的模块就诞生了：

    // Note: here, a module ID (myModule) is used for demonstration
    // purposes only
    
    define('myModule', ['foo', 'bar'], function ( foo, bar ) {
        // return a value that defines the module export
        // (i.e. the functionality we want to expose for consumption)
        return function () {};
    });
    
    // A more useful example, however, might be:
    define('myModule', ['math', 'graph'], function ( math, graph ) {
        return {
                plot: function(x, y){
                        return graph.drawPie(math.randomGrid(x,y));
                }
        };
    });
    
require方法，另一方面，被典型地用在加载顶级作用域JavaScript代码文件或者在一个模块里如果你想动态获取模块依赖。这有个例子说明这种用法：

    // Here, the 'exports' from the two modules loaded are passed as
    // function arguments to the callback
    
    require(['foo', 'bar'], function ( foo, bar ) {
            // rest of your code here
    });
    
    
    // And here's an AMD-example that shows dynamically loaded
    // dependencies
    
    define(function ( require ) {
        var isReady = false, foobar;
    
        require(['foo', 'bar'], function (foo, bar) {
            isReady = true;
            foobar = foo() + bar();
        });
    
        // We can still return a module
        return {
            isReady: isReady,
            foobar: foobar
        };
    });    
    
上面一些例子只是稍微讲述了AMD模块多么实用，但是它们为帮助你理解其工作原理提供了基础。许多现有大型的应用和公司正在使用AMD模块作为其架构的一部分，包括[IBM](http://www.ibm.com/)和[BBC iPlayer](http://www.bbc.co.uk/iplayer/)。在Dojo和CommonJS社区，规范已经被讨论超过一年了，因此它还有时间发展和改进。想知道开发者们选择AMD模块开发方式的更多原因，你或许会对James Burke的文章 “[JS模块格式和脚本加载的发展](http://tagneto.blogspot.com/2011/04/on-inventing-js-module-formats-and.html)”感兴趣。

不久，我们将会看到使用AMD或者其他模块格式和环境的全局兼容模块，提供的东西也会更加给力。之前，我们需要简短的讨论一个有关的模块格式，CommonJS规范。

**COMMONJS**

如果你对它不熟悉，那么[CommonJS](http://www.commonjs.org/)是一个志愿工作组，设计，提供原型和标准化JavaScript API。迄今为止，它尝试为[模块](http://www.commonjs.org/specs/modules/1.0/)和[包](http://wiki.commonjs.org/wiki/Packages/1.0)制定标准。CommonJS模块建议在声明服务端模块时指定一个简单的API；但是，按照John Hann的正确陈述，确实只有两个方式在浏览器使用CommonJS：无论是封装还是不封装。

这就意味着我们可以使用浏览器封装模块(是个缓慢的过程)或者先build(浏览器执行较快，多了一步build)。

一些开发者，觉得CommonJS更适合服务端开发，也就是造成目前，在和谐时代来临前该使用哪种格式作为实际的标准向前推进始终不能达成统一解决方案的一个原因。一个针对CommonJS的争论点是许多CommonJS API地址是面向服务器的，在浏览器级的JavaScript中不能简单地实现。例如，<code>io></code>,<code>system</code> 和<code> js </code>可以认为是实现不了的。

即便如此，知道如何组织CommonJS模块是很有用的，我们可以更深地领悟模块用在各个地方是怎么适配的。一些模块被用在客户端和服务端包括验证，转换和模版引擎。一些开发者选择使用的方式是CommonJS，当一个模块可以用在服务端环境则选择AMD。

因为AMD模块能够使用插件并且能定义更多细粒度的东西像构造器和函数，这样很有意义。CommonJS模块能够定义对象，如果你尝试从中获取构造器就很麻烦了。

从结构的观点出发，一个CommonJS模块是个可复用的代码片段，输出特殊的对象给依赖的代码；通常有没有函数封装的模块。有大量的CommonJS教程在那里，但是我们进阶来说，模块基本包括两部分：一个名字可变的输出，包括一个对象， 和一个依赖函数，用来引入进来。

    // A very basic module named 'foobar'
    function foobar(){
            this.foo = function(){
                    console.log('Hello foo');
            }
    
            this.bar = function(){
                    console.log('Hello bar');
            }
    }
    
    exports.foobar = foobar;
    
    // An application using 'foobar'
    
    // Access the module relative to the path
    // where both usage and module files exist
    // in the same directory
    
    var foobar = require('./foobar').foobar,
        test   = new foobar.foo();
    
    test.bar(); // 'Hello bar'    
    
有很多优秀的基于AMD和CommonJS标准用来处理模块的JavaScript类库，但是我更倾向于[RequireJS](http://requirejs.org/) ([curl.js](https://github.com/unscriptable/curl) 也很靠谱)。这篇文章无法细述这些工具的教程，但是我推荐John Hann的文章 “[curl.js: 一个AMD加载器](http://unscriptable.com/index.php/2011/03/30/curl-js-yet-another-amd-loader/),” 和James Burke的文章“
[LABjs 和 RequireJS：使用有趣的方式加载资源](http://msdn.microsoft.com/en-us/scriptjunkie/ff943568).”

到目前，使用已经覆盖的知识，如果我们能够通过AMD，CommonJS和其它标准来定义和加载插件模块，并且也兼容不同环境(客户端，服务端和更多)，不就很棒了吗？我们使用AMD和 UMD (通用模块定义)插件和工具还在一个初级水平，但是我们希望改进解决方案做到这一点。

我们[使用的](https://github.com/addyosmani/jquery-plugin-patterns/issues/1)这个模式，此刻出现在下面，有如下特点：

- 一个核心/基础的插件被载入给一个<code>$.core</code> 命名空间，可以通过插件命名空间模式很容易的扩展。插件通过script标签载入，自动构成在<code>core</code> 命名空间里(即 <code>$.core.plugin.methodName()</code>)。
- 此模式使用起来非常优雅，因为插件扩展可以使用定义在base的属性和方法，或者经过稍微调整覆盖默认配置行为以便于扩展更多功能。
- 使用此模式不一定非要一个加载器不可。

**usage.html**

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
    <script type="text/javascript" src="pluginCore.js"></script>
    <script type="text/javascript" src="pluginExtension.js"></script>
    
    <script type="text/javascript">
    
    $(function(){
    
        // Our plugin 'core' is exposed under a core namespace in 
        // this example, which we first cache
        var core = $.core;
    
        // Then use use some of the built-in core functionality to 
        // highlight all divs in the page yellow
        core.highlightAll();
    
        // Access the plugins (extensions) loaded into the 'plugin'
        // namespace of our core module:
    
        // Set the first div in the page to have a green background.
        core.plugin.setGreen("div:first");
        // Here we're making use of the core's 'highlight' method
        // under the hood from a plugin loaded in after it
    
        // Set the last div to the 'errorColor' property defined in 
        // our core module/plugin. If you review the code further down,
        // you'll see how easy it is to consume properties and methods
        // between the core and other plugins
        core.plugin.setRed('div:last');
    });
        
    </script>    
    
**pluginCore.js**

    // Module/Plugin core
    // Note: the wrapper code you see around the module is what enables
    // us to support multiple module formats and specifications by 
    // mapping the arguments defined to what a specific format expects
    // to be present. Our actual module functionality is defined lower 
    // down, where a named module and exports are demonstrated. 
    // 
    // Note that dependencies can just as easily be declared if required
    // and should work as demonstrated earlier with the AMD module examples.
    
    (function ( name, definition ){
      var theModule = definition(),
          // this is considered "safe":
          hasDefine = typeof define === 'function' && define.amd,
          // hasDefine = typeof define === 'function',
          hasExports = typeof module !== 'undefined' && module.exports;
    
      if ( hasDefine ){ // AMD Module
        define(theModule);
      } else if ( hasExports ) { // Node.js Module
        module.exports = theModule;
      } else { // Assign to common namespaces or simply the global object (window)
        (this.jQuery || this.ender || this.$ || this)[name] = theModule;
      }
    })( 'core', function () {
        var module = this;
        module.plugins = [];
        module.highlightColor = "yellow";
        module.errorColor = "red";
    
      // define the core module here and return the public API
    
      // This is the highlight method used by the core highlightAll()
      // method and all of the plugins highlighting elements different
      // colors
      module.highlight = function(el,strColor){
        if(this.jQuery){
          jQuery(el).css('background', strColor);
        }
      }
      return {
          highlightAll:function(){
            module.highlight('div', module.highlightColor);
          }
      };
    
    });
    
**pluginExtension.js**

    // Extension to module core
    
    (function ( name, definition ) {
        var theModule = definition(),
            hasDefine = typeof define === 'function',
            hasExports = typeof module !== 'undefined' && module.exports;
    
        if ( hasDefine ) { // AMD Module
            define(theModule);
        } else if ( hasExports ) { // Node.js Module
            module.exports = theModule;
        } else { // Assign to common namespaces or simply the global object (window)
    
    
            // account for for flat-file/global module extensions
            var obj = null;
            var namespaces = name.split(".");
            var scope = (this.jQuery || this.ender || this.$ || this);
            for (var i = 0; i < namespaces.length; i++) {
                var packageName = namespaces[i];
                if (obj && i == namespaces.length - 1) {
                    obj[packageName] = theModule;
                } else if (typeof scope[packageName] === "undefined") {
                    scope[packageName] = {};
                }
                obj = scope[packageName];
            }
    
        }
    })('core.plugin', function () {
    
        // Define your module here and return the public API.
        // This code could be easily adapted with the core to
        // allow for methods that overwrite and extend core functionality
        // in order to expand the highlight method to do more if you wish.
        return {
            setGreen: function ( el ) {
                highlight(el, 'green');
            },
            setRed: function ( el ) {
                highlight(el, errorColor);
            }
        };
    
    });    
    
虽然这已经超出了本文的范围，你可能已经注意到当讨论AMD和CommonJS时，提到的依赖方法的类型是有差别的。

需要担心的是一个类似的命名约定，当然，会混乱，而且社区就目前使用全局调用函数是否有裨益上有分歧。John Hann给的建议是不掉用它的依赖，那样会有可能无法让用户指导全局和内置依赖的区别，重命名全局加载方法等其它做法或许更有意义(比如这个库的名字). 因为这个原因，curl.js取名，而RequireJS取名requirejs。

某天这将是个更大的话题，但是我希望这样简单地过一下模块类型会增强你对这些规范的意识，并且激励你未来在你的应用里探索和尝试。

###扩展阅读

- “[使用AMD加载器开发管理模块化JavaScript](http://unscriptable.com/code/Using-AMD-loaders/#0),” John Hann
- “[CommonJS模块揭秘](http://dailyjs.com/2010/10/18/modules/),” Alex Young
- “[AMD模块模式：单例](http://unscriptable.com/index.php/2011/09/22/amd-module-patterns-singleton/),” John Hann
- [关于jQuery插件AMD和UMD风格模块的当前讨论思路](https://github.com/addyosmani/jquery-plugin-patterns/issues/1), GitHub
- “[到处可运行的JavaScript模块样本代码](http://www.sitepen.com/blog/2010/09/30/run-anywhere-javascript-modules-boilerplate-code/),” Kris Zyp
- “[JavaScript模块和jQuery的标准和建议](http://tagneto.blogspot.com/2010/12/standards-and-proposals-for-javascript.html),” James Burke

##写好jQuery插件需要什么？

到了结束的时候，模式只是插件开发的一部分。在我们总结之前，这里有我选择第三方插件的标准，希望可以帮到开发者。

###质量
无论是用JavaScript还是jQuery，尽全力坚持你的最好的实现。你的解决方案是最佳的嘛？他们遵照[jQuery核心风格指南](http://docs.jquery.com/JQuery_Core_Style_Guidelines)了吗？如果没有做到，至少你的代码是整洁可读的。

###兼容性
你的插件兼容哪些版本的jQuery？最新的版本的有试过吗？如果插件基于jQuery 1.6更早版本，那么它或许属性有问题，因为那一版本我们获取属性的方式变了。jQuery新版为jQuery工程的核心库提供改进和机会。当我们走向更好的实现方式的时候，这会带来突然的破坏(主要在重要版本)。我喜欢看到插件作者必要时更新他们的代码或者，至少，测试你的插件是否支持心版本，确保各个功能正常。

###可靠
你的插件应该一起提供自己的单元测试。不仅仅证明你的插件却是可以工作，而是他们可以提高设计以便于不被最终用户破坏。我认为单元测试对任何一个在生产环境中的严格jQuery插件都是基本的，他们写起来并不困难。关于QUnit JavaScript自动化测试绝佳的一个例子，你或许会对“[QUnit JavaScript自动化测试](http://msdn.microsoft.com/en-us/scriptjunkie/gg749824),” by [Jorn Zaefferer](http://bassistance.de/)感兴趣。

###性能
如果插件有性能需求，要求好高的计算能力或者重度操作DOM，那么你可以遵循最佳实现把问题最小化。使用[jsPerf.com](http://jsperf.com/)来测试代码段，你就可以在发布之前意识到在不同浏览器里性能如何。

###文档
如果你打算让其它开发者使用你的插件，需要确保它有个好文档。API要有文档。插件支持什么方法和配置？有没有什么坑需要告诉用户？如果用户不知道怎么用你的代码，他们会选择其它的。还有，尽量把注释写好。这是你能给其它开发人员最好的礼物。如果有人他们可以浏览你的仓库，并且改善它，那么你就是好样的。

###可维护性
当发布一个插件，预估一下你有多少时间去投入维护和支持。我们都喜欢到社区分享我们的插件，但是你需要根据能力设置预期来回答问题，解决问题，并且有所改进。有个简单的做法，在README文件说明你的意图，让用户决定是否自己改造。

###结论
今天，我们探索了几个省时的设计模式和最佳实现，可以用来改造你的插件开发过程。有些会更适合某个用例，但是我希望代码注释上描述，讨论的细节，这些对于流行的插件和小部件是很有用的。

记住，当选择一个模式的时候要切实际。不要为了使用设计模式而使用它；相反，花些时间理解底层架构，并且知道它是如何解决你的问题的，或者怎么适应你建立的组件的。选择最适合你的模式。

就是这样啦。如果还有你更加喜欢采用的流行模式或者方式，你觉得有益于他人(还没有被覆盖)，请把它贴到一个[gist](http://gist.github.com/)中，并且在下面评论中分享一下。我确定这样做将会被感激不尽。

直到下次，欢乐编码！

感谢John Hann, Julian Aubourg, Andree Hanson 和其他阅者，征求过他们意见和反馈。

###总结说明

> - 原文地址：http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
> - 译文地址：http://www.xdf.me/?p=650
> - 翻译：[xdf](http://www.xdf.me/)
> - 转载请注明作者版权，翻译不妥之处望各位指正