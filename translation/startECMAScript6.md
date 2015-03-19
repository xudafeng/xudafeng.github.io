ECMAScript 6，让我们启程吧
---
> 题记：目前，ECMAScript 6 的制定已经进入尾声了。众所周知，ECMAScript 是javascript语言的基石。因此，对新版本特性的发掘就意味着我们可以偷瞄一下以后可以怎样编写javascript！在这篇文章里，我们将通过工具，浏览器，编译器来探讨10项改进。

## ECMA, ECMAScript和JavaScript简史

Javascript最初是由Netscape公司的[Brendan Eich](https://twitter.com/BrendanEich)在1995年开发的，并且嵌入[Netscape浏览器2.0](http://en.wikipedia.org/wiki/Netscape_Navigator)官方版本.一年后，Javascript被提交到 [ECMA 国际组织](http://www.ecma-international.org/)，由此作为促进信息标准化、技术交流和电子消费的主体，使行业方面变得更加正式。因此，从[ECMA-262](http://www.ecma-international.org/publications/standards/Ecma-262.htm)开始就正式更名为**ECMAScript**。
ECMAScript标准成为了其他衍生语言的核心，如[ActionScript](http://www.adobe.com/devnet/actionscript.html?PID=3985897)和[JScript](http://msdn.microsoft.com/en-us/library/vstudio/72bd815a.aspx)。在近几年，ECMAScript已经发行了4个版本，围绕第六版进行多次讨论，最终定名为**ECMAScript Harmony**（和谐版）。
###版本对照

讲这些特性之前,还是有必要强调下，ECMAScript是Javascript的根基。在Javascript版本和对应的ECMAScript版本之间的确有一些不同点。这也就意味着，Javascript兼容ECMAScript标准，同时提供更多特性。如下表格总结了[JavaScript 与 ECMAScript](http://en.wikipedia.org/wiki/Ecmascript#Version_correspondence)的[关系](https://developer.mozilla.org/en-US/docs/JavaScript/Guide/JavaScript_Overview#Relationship_between_JavaScript_Versions_and_ECMAScript_Editions):
<table><tbody>
<tr><td><strong><strong>JavaScript 版本</strong></td><td><strong>ECMAScript 版本</strong></td><td><strong>年份</strong></td></tr>
<tr><td>JavaScript 1.1</td><td>ECMAScript edition 1</td><td>1997</td></tr><tr><td>JavaScript 1.5</td><td>ECMAScript edition 3</td><td>1999</td></tr>
<tr><td>JavaScript 2.0</td><td>ECMAScript Harmony</td><td>制定中</td></tr>
</tbody></table>

##ES6 概述
###目标
从默默无闻的诞生那一刻起，Javascript经历了20年的漫漫长路。如今，前端工程师们可以写上千行代码的富交互应用。讲述ES6详细的特性之前，你或许想依据[需求](http://wiki.ecmascript.org/doku.php?id=harmony:harmony#requirements)，[目标](http://wiki.ecmascript.org/doku.php?id=harmony:harmony#goals)，[打算](http://wiki.ecmascript.org/doku.php?id=harmony:harmony#means)和[主题](http://wiki.ecmascript.org/doku.php?id=harmony:harmony#themes)知道已定草案的主要内容。ES6其中一个[目标](http://wiki.ecmascript.org/doku.php?id=harmony:harmony#goals)就是要成为如下各项的最佳语言：

> 1. complex applications（富交互应用）
> 1. libraries（类库）
> 1. code generators(代码生成)

###兼容性
[ES6的兼容性表](http://kangax.github.io/es5-compat-table/es6/)用途非常大，因为它提供我们ES6特性在现代浏览器中的支持情况。也给我们新特性列表的各个说明链接。 要注意的是，有些特性虽然存在，但是并不意味着就会完全遵从说明文档。在使用Chrome浏览器开发时，请打开浏览器开启试验性功能。

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-compatibility.png)

###特性
既然主要部分都已经确定了，让我们来探寻下如何实现吧。在下一段，我们将会讨论ES6的10大特性，并借助各种各样的工具来帮助我理解ES6的原理和实践。JavaScript的预备知识还是首要的，如何学习Javascript的话题在这就直接收了。
> 1. Block scoping with let [ using Firefox browser ]
> 1. Block scoping with const [ using Chrome browser ]
> 1. Classes [ using Traceur ]
> 1. Default function parameters [ using TypeScript ]
> 1. Collections [ using NodeJS ]
> 1. Destructuring [ using Firefox browser ]
> 1. Rest parameters & Spread operator [ using Grunt plugin Traceur ]
> 1. Iterators [ using Firefox browser ]
> 1. Array comprehension [ using Firefox browser ]
Modules (using ES6 Module Transpiler)

###特性1 - let 块级作用域
> 1. 文档：[let](http://wiki.ecmascript.org/doku.php?id=harmony:let)
> 1. 工具：[Firefox browser 20.0](http://www.mozilla.org/en-US/firefox/20.0.1/releasenotes/): Menu > Tools > Web developer > Web Console

JavaScript 变量是函数作用域的。这就意味着，即使嵌入块声明了变量，他们也要通过function才能起效。我们回顾一个简短的例子如下；我们简单地使用Firefox或者Chrome的控制台来执行。jsFuture的值会是多少?

    var jsFuture = "es6";
    (function () {
        if (!jsFuture) {
            var jsFuture = "es5";
        }
        console.log(jsFuture);
    }());

在上面的例子中，控制台中的jsFuture的值是“es5”。能否理解就看你是否了解这一事实，在Javascript中，变量声明是会被提升置顶的，但另一方面，变量的初始化却不会这样。因此，函数作用域中可以忽略变量在哪声明和初始化，在函数作用域中，他们,一直会被提升。用下面加上注释的代码片段来阐述变量提升这一特性。

    var jsFuture = "es6";
    (function () {
        // var jsFuture = undefined;
        // variable hoisting
        if (!jsFuture) {
            var jsFuture = "es5";
        }
        console.log(jsFuture); // "es5"
    }());

ES6 中的let来解决这个问题，它很像*var*，只是他是使用块级作用域而非函数作用域。让我们思考下面使用*var*的例子。调用function es[6] () 我们得到的i值是10。 注意，即使 var i = 0; 是声明在for循环里， i的作用域也是全局的。 因此，当es[6] ()执行时候i的值是10。

    var es = [];
    for (var i = 0; i < 10; i++) {
        es[i] = function () {
            console.log("Upcoming edition of ECMAScript is ES" + i);
        };
    }
    es[6](); // Upcoming edition of ECMAScript is ES10

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-var-es5.png)

我们现在来看let。直接在控制台打出这段代码。在for循环里创建一个块级作用域变量，let c = i;实现块级作用域。

    var es = [];
    for (var i = 0; i < 10; i++) {
        let c = i;
        es[i] = function () {
            console.log("Upcoming edition of ECMAScript is ES" + c);
        };
    }
    es[6](); // Upcoming edition of ECMAScript is ES6

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-let.png)
Firefox 已经支持很多即将诞生的ES6特性。关注Firefox的兼容性表来或许支持的最新情况，和当前的兼容情况。

###特性 2 - const 块级作用域
> 1. 文档：[const](http://wiki.ecmascript.org/doku.php?id=harmony:const)
> 1. 工具：[Chrome Browser](https://www.google.com/intl/en/chrome/browser/beta.html) > View > Developer > JavaScript Console
const让定义常量成为可能。let和const就块级作用域而言，表现极其相似，但是对于const，值只读并且不能重新声明。我们来看个Chrome的简单例子：

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-const.png)

###特性 3 - Classes 类
> 1. 文档：[class](http://wiki.ecmascript.org/doku.php?id=strawman:maximally_minimal_classes)
> 1. 工具：[Traceur](http://net.tutsplus.com/articles/news/ecmascript-6-today/) with [Chrome Browser](https://www.google.com/intl/en/chrome/browser/beta.html) > View > Developer > JavaScript Console

在面向对象的语言中，类是一个对象的陈述。当实例化一个对象时，类就成了它的蓝本。至于Javascript，是一种缺乏类的程序语言，而且它的一切都是对象。按照传统做法，我们已经使用functions和prototypes去实现类的机制。我们来剖析下ES5中类的实现。

    var Language = function(config) {
        this.name = config.name;
        this.founder = config.founder;
        this.year = config.year;
    };
 
    Language.prototype.summary = function() {
        return this.name + " was created by " + this.founder + " in " + this.year;
    };

下面,我们来看下ES6用简洁的类声明语法来实现类，这对于区分方法和类也是极其重要的。通过ES6语法实现类，我们使用谷歌开发的Traceur，它是个编译器使ES6兼容ES5。首先，我们创建一个html文件结构，来插入ES6语法的代码以实现类。为了编译Traceur代码，我们需要traceur.js来编译 Traceur to JavaScript, 和bootstrap.js创建他们。
最后，Traceur 会去查找type="text/traceur" 的script标签来编译有关代码。

     <!DOCTYPE html>
     <html>
     <head>
       <title>ES6 Classes</title>
       <script src="https://traceur-compiler.googlecode.com/git/bin/traceur.js"></script>
       <script src="https://traceur-compiler.googlecode.com/git/src/bootstrap.js"></script>
     </head>
     <body>
       <script type="text/traceur">
         // insert ES6 code
       </script>
     </body>
     </html>

接下来，在type="text/traceur"标签的脚本中，我们使用ES6语法来实现刚刚的类。

    class Language {
        constructor(name, founder, year) {
            this.name = name;
            this.founder = founder;
            this.year = year;
        }
        summary() {
            return this.name + " was created by " + this.founder + " in " + this.year;
        }
    }

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-class.png)
我们现在可以通过var js = new Language创建一个实例。在控制台中，我们可以看见language的其他属性的提示！使用如此简洁的声明，我们也能够扩展这个类实现子类元语言，来继承父类Language的所有属性。在构造函数里，我们需要super方法来掉调用构造函数的父类，以便于继承它所有的属性。最后，我们也能增加额外的属性，比如版本，就像下面贴出的代码。让我们回顾下ES6的语法，在Chrome中执行一下:
    
    class MetaLanguage extends Language {
        constructor(x, y, z, version) {
            super(x, y, z);
            this.version = version;
        }
    }


![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-subclass.png)

也许你有所发现，Traceur 是个实用的编译器，让我们可以使用ES6语法， 尤其是当需要特别麻烦地兼容老版本Javascript时。话不多说，继续主题和[Traceur](https://code.google.com/p/traceur-compiler/wiki/LanguageFeatures)！

###特性 4 - 默认函数参数
> 1. 文档：[default function parameters](http://wiki.ecmascript.org/doku.php?id=harmony:parameter_default_values)
> 1. 工具：[TypeScript 0.8.3](http://www.typescriptlang.org/)

函数有默认参数，我们能够让函数参数有个选项，通过设置一些默认值。ES6的此项语法极其直接。默认的参数在函数定义时被定义。让我们看如下的一个后缀名为*.ts的TypeScript文件如何使用ES6的语法。

    function history(lang = "C", year = 1972) {
        return lang + " was created around the year " + year;
    }

接着，我们将要安装TypeScript，作为一个npm模块并且运行 .*ts文件来编译成为JavaScript.如下命令行操作安装并且编译:

    $ npm install -g typescript
    $ npm view typescript version
    0.8.3
    $ tsc 4-default-params.ts

如上命令行将会创建一个Javascript文件，被称为 4-default-params.js, 可以被一个HTML文件调用。这里有个简单的HTML文件将会调用被TypeScript编译器创建的外部JavaScript文件:

    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>ES6 Default Parameters</title>
    </head>
    <body>
        <script src="4-default-params.js"></script>
    </body>
    </html>

最后，我们将会打开一个HTML文件在Chrome/Firefox 并且调用history()方法两次，无需parameters方法。 注意不要进入任何方法参数将会求助默认参数:

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-params.png)

检查其他TypeScript 特性, 包括类或者通过一个TypeScript教程学习更深入的用法.

###特性 5 - 集合
> 1. 文档：[Sets and Maps](http://wiki.ecmascript.org/doku.php?id=harmony:simple_maps_and_sets)
> 1. 工具：[NodeJS v0.10.4](http://nodejs.org/)

ES6 提前提供新的没用到的数据结构。我们深入研究两个数据结构（Setsh和Maps）之前，让我们看下NodeJS如何执行ES6语法。安装NodeJS；从现在起，我们开始使用命令行。
首先，我们我们检测NodeJS安装的版本，然后命令行node --v8-options | grep harmony，检查可以支持ES6特性的选项。

    $ node --version
    v0.10.4

    $ node --v8-options | grep harmony
    --harmony_typeof (enable harmony semantics for typeof)
    --harmony_scoping (enable harmony block scoping)
    --harmony_modules (enable harmony modules (implies block scoping))
    --harmony_proxies (enable harmony proxies)
    --harmony_collections (enable harmony collections (sets, maps, and weak maps))
    --harmony (enable all harmony features (except typeof))

然后，启用NodeJS repl查询Set和Maps可用属性。我们使用命令node --harmony启用 NodeJS repl来支持ES6特性.

    $ node --harmony
    > Object.getOwnPropertyNames(Set.prototype)
    [ 'constructor',
      'add',
      'has',
      'delete' ]
    > Object.getOwnPropertyNames(Map.prototype)
    [ 'constructor',
      'get',
      'set',
      'has',
      'delete' ]
    > .exit
    $

####Sets
Sets是与数组很相似的简单数据结构，但是每个值是孤立的。
让我们创建一个新文件命名为5-sets.js，并且插入一些代码去create，add，delete，和query新的set。另外，注意"Hippo"虽然add了两次，在set中只会被注册一次！

    var engines = new Set(); // create new Set

    engines.add("Gecko"); // add to Set
    engines.add("Trident");
    engines.add("Webkit");
    engines.add("Hippo");
    engines.add("Hippo"); // note that Hippo is added twice

    console.log("Browser engines include Gecko? " + engines.has("Gecko"));    // true
    console.log("Browser engines include Hippo? " + engines.has("Hippo"));    // true
    console.log("Browser engines include Indigo? " + engines.has("Indigo"));   // false

    engines.delete("Hippo"); // delete item
    console.log("Hippo is deleted. Browser engines include Hippo? " + engines.has("Hippo"));    // false

Run the file in the node repl with the command node --harmony 5-set.js. Note that, even though “Hippo” was added twice to the set, upon deleting it, the set didn’t include it anymore. This once again illustrates that a set is a data structure that can only contain unique values.

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-set.png)

####Maps

Maps与Javascript的键值对对象颇为相像。通过一个唯一的的key.我们能够检索到它的值。在ES6中，key可以是字符串外的其他数据类型。这才是真正有趣的部分！我们创建一个文件5-map.js，然后create，get 和 delete 属性：

    var es6 = new Map(); // create new Map

    es6.set("edition", 6);        // key is string
    es6.set(262, "standard");     // key is number
    es6.set(undefined, "nah");    // key is undefined

    var hello = function() {console.log("hello");};
    es6.set(hello, "Hello ES6!"); // key is function

    console.log( "Value of 'edition' exits? " + es6.has("edition") );     // true
    console.log( "Value of 'year' exits? " + es6.has("years") );          // false
    console.log( "Value of 262 exits? " + es6.has(262) );                 // true
    console.log( "Value of undefined exits? " + es6.has(undefined) );     // true
    console.log( "Value of hello() exits? " + es6.has(hello) );           // true

    es6.delete(undefined); // delete map
    console.log( "Value of undefined exits? " + es6.has(undefined) );      // false

    console.log( es6.get(hello) ); // Hello ES6!
    console.log( "Work is in progress for ES" + es6.get("edition") ); // Work is in progress for ES6

    ![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-map.png)


如上面例子所示，ES6 集合特性，NodeJS harmony 配置项已经支持其他ES6特性，比如块级作用域，代理和模块。 也可以使用NodeJS一一尝试下！

###特性 6 - 解构
> 1. 文档：[Destructuring](http://wiki.ecmascript.org/doku.php?id=harmony:destructuring)
> 1. 工具：[Firefox browser 20.0](http://www.mozilla.org/en-US/firefox/20.0.1/releasenotes/): Menu > Tools > Web developer > Web Console

在编程语言中，”解构“一词意味着模式匹配。在ES6中，我们可以在数组和对象里做些漂亮的模式匹配，但是需要几个步骤才能完成。我们用Firefox控制台来探究一下。

####数组解构

数组解构，我们可以立刻初始化变量，甚至可以交换顺序，从而不需要创建一个临时变量。

    var [ start, end ] = ["earth", "moon"] // initialize
    console.log(start + " calling " + end); // earth calling moon

    [start, end] = [end, start] // variable swapping
    console.log(start + " calling " + end); // moon calling earth

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-swap.png)

解构机制变得非常有用当从一个函数返回各种值的时候，我们不再需要对象做映射匹配。同样的，略过某些变量只需要留空数组即可。

    function equinox() {
      return [20, "March", 2013, 11, 02];
    }
    var [date, month, , ,] = equinox();
    console.log("This year's equinox was on " + date + month); // This year's equinox was on 20March

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-destructure.png)

####对象解构

由于解构机制，变量同样可以被被函数返回的甚至深层潜逃的对象初始化。而且，就像数组模式，我们可以略过不需要的。这里的代码片段恰恰说明了这点：

    function equinox2() {
      return {
        date: 20,
        month: "March",
        year: 2013,
        time: {
          hour: 11, // nested
          minute: 2
        }
      };
    }

    var { date: d, month: m, time : { hour: h} } = equinox2();
    // h has the value of the nested property while "year" and "minute" are skipped totally

    console.log("This year's equinox was on " + d + m + " at " + h); // This year's equinox was on 20March at 11

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-destructure-object.png)

###特性 7 - 余参数 与 传播运算符
> 1. 文档：[Rest parameters](http://wiki.ecmascript.org/doku.php?id=harmony:rest_parameters) & [Spread operator](http://wiki.ecmascript.org/doku.php?id=harmony:spread)
> 1. 工具：[Grunt plugin Traceur](https://github.com/aaronfrost/grunt-traceur)
####余参数
ES6中，余参数让我们轻而易举地在函数中使用固定参数， 连剩余的后面的和各种各样的参数。我们已经使用arguments，一个函数传入的类似数组的对象，但是很明显我们却不能使用数组方法来操作这些参数。使用简明的ES6语法，开发者会发觉可以使用...三个点来描述一系列参数。让我们通过gruntjs和它的插件在上一段提到过的traceur编译器中尝试使用ES6中的剩余参数。

#####1. 安装实用的grunt命令行工具：

    $ npm uninstall -g grunt
    $ npm install -g grunt-cli
    
#####2. 创建一个文件命名为package.json，定义Grunt需要执行的各个模块。注意依赖 traceur 附件：

    {
      "name": "rest-params",
      "version": "0.1.0",
      "devDependencies": {
         "grunt": "0.4.1",
         "grunt-traceur": "0.0.1"
       }
    }
    
#####3. 创建Gruntfile.js包含了仅仅一个任务可以转换ES6语法到正常的Javascript。明白这一点，我们可以尝试ES6的余参数特性了。

    module.exports = function(grunt) {

      grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        traceur: {
          custom: {
            files:{
            'js/': ['rest-spread.js']  // dest : 1
            }
          }
        }
      });

      grunt.loadNpmTasks('grunt-traceur');
      grunt.registerTask('default', ['traceur']);

    };
    
#####4. 创建一个简单的index.html 去调用traceur编译后的Javascript文件，js/rest-spread.js:

    <!DOCTYPE html>
    <html>
    <head>
      <title>ES6 Rest parameters</title>
    </head>
    <body>
      <script src="js/rest-spread.js"></script>
    </body>
    </html>
    
#####5. 最重要的是，我们将会创建文件rest-spread.js，里面有余参数的内容:

    function push(array, ...items) { // defining rest parameters with 3 dot syntax
      items.forEach(function(item) {
        array.push(item);
        console.log( item );
      });
    }

    // 1 fixed + 4 variable parameters
    var planets = [];
    console.log("Inner planets of our Solar system are: " );
    push(planets, "Mercury", "Venus", "Earth", "Mars"); // rest parameters
    
#####6. 最后。我们命令行运行grunt， 默认情况下会运行traceur任务并且创建文件，js/5-rest-spread.js。下一步，看文件在浏览器控制台的输出情况：

    $ npm install
    $ grunt
    ╰─$ grunt
    Running "traceur:custom" (traceur) task
    js/ [ 'rest-spread.js' ]
    Compiling... js/
    Compilation successful - js/
    Writing... js/
    js/rest-spread.js successful.
    Writing successful - [object Object]

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-rest.png)

####Spread 运算符

一个spread运算符是余参数的反面功能。当调用一个函数，我们能够进入固定的参数，这需要一个数组变量按照类似于三个点...的语法去表达不同的参数。我们会使用上面余参数同样的工程，并且在rest-spread.js添加代码。下面的例子中，函数需要六个独立的参数。当调用函数时，使用spread运算符，数据会被当作一个数组传入。我们看下语法长什么样，当调用函数有一长串参数的时候:

#####1. rest-spread.js新增spread运算符代码:

    // Spread operator "...weblink"
    function createURL (comment, path, protocol, subdomain, domain, tld) {
          var shoutout = comment
            + ": "
            + protocol
            + "://"
            + subdomain
            + "."
            + domain
            + "."
            + tld
            + "/"
            + path;

      console.log( shoutout );
    }

    var weblink = ["hypertext/WWW/TheProject.html", "http", "info", "cern", "ch"],
      comment = "World's first Website";

    createURL(comment, ...weblink ); // spread operator
    
#####2. 运行traceur通过Grunt任务命令行编译并且在浏览器浏览文件 index.html：

    $ grunt
    Running "traceur:custom" (traceur) task
    js/ [ 'rest-spread.js' ]
    Compiling... js/
    Compilation successful - js/
    Writing... js/
    js/rest-spread.js successful.
    Writing successful - [object Object]

    Done, without errors.

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-spread.png)

如果在日常项目里，你已经使用GruntJS作为一个打包工具，使用ES6插件会更加丰富它的更加锦上添花。所以来试下另一个GruntJS ES6相关的插件来编译ES语法成当前的JavaScript。

###Feature 8 - 迭代

JavaScript提供for-in 功能完成迭代，但是它有些限制。比如在数组迭代，for-in循环的结果给出的是下标，而不是我们需要的值。我们看下如下代码说明这个问题：

    var planets = ["Mercury", "Venus", "Earth", "Mars"];
    for (p in planets) {
      console.log(p); // 0,1,2,3
    }

    var es6 = {
      edition: 6,
      committee: "TC39",
      standard: "ECMA-262"
    };
    for (e in es6) {
      console.log(e); // edition, committee, standard
    }

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-forin.png)

我们尝试同样的概念，但是，这次，对一个数组、set、map使用for-of:

    var planets = ["Mercury", "Venus", "Earth", "Mars"];
    for (p of planets) {
      console.log(p); // Mercury, Venus, Earth, Mars
    }

    var engines = Set(["Gecko", "Trident", "Webkit", "Webkit"]);
    for (var e of engines) {
        console.log(e);
        // Set only has unique values, hence Webkit shows only once
    }

    var es6 = new Map();
    es6.set("edition", 6);
    es6.set("committee", "TC39");
    es6.set("standard", "ECMA-262");
    for (var [name, value] of es6) {
      console.log(name + ": " + value);
    }

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-forof.png)

###Feature 9 - 数组包含

数组包含给我们一个简短的语法来操作数组中的每一项在一个指定的模式。就像数组对象增加了与map()或者filter()方法。 我们看下如何使用map()

    var temperature = [0, 37, 100];
    function degToKelvin(deg) {
      return deg + 273;
    }
    temperature.map(degToKelvin); // [273, 310, 373]
    
我们在Firefox通过ES6简短的语法体验这个特性，来解决3个循环才能创建的数组， Cluedo:
    
    // Array created with 1 loop
    var temperature = [0, 37, 100];
    [t + 273 for (t of temperature)]; // [273, 310, 373]

    // Array created with 3 loops
    var suspects = ["Miss Scarlet", "Colonel Mustard"],
        weapons = ["Candlestick", "Dagger"],
        rooms = ["Kitchen", "Ballroom"];

    [(console.log(s + " with a " + w + " in the " + r)) for (s of suspects) for (w of weapons) for (r of rooms)];

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-array-comprehension.png)

###Feature 10 - 模块

在程序语言中，模块执行独立离散的功能并且相互之间独立。这使得我们不仅能够跨工程创造可复用的模块，而且保持错误相对于当前工程独立。我们已经使用AMD或者CommonJS创建了Javascript模块。让我们创建一个简单的ES6语法模块和ES6模块编译器。

#####1.首先，让我们创建一个HTML文件，index.html，将会调用基本的Javascript。我们会使用RequireJS 作为一个 AMD 加载器; 因此，我们参考一个最新版RequiresJS文件的CDN备份。然后，我们在script标签上增加属性来告诉RequireJS去加载js/init.js文件。

    <!DOCTYPE html>
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>ES6 Modules</title>
    </head>
    <body>
      <script src="//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.5/require.min.js" data-main="js/init"></script>
    </body>
    </html>
    
#####2.现在，我们将要创建一个文件 js/init.js来调用 js/main.js 文件:

    require(['main'],
      function(){
      });
      
#####3.在文件in/circle.js中使用ES6语法创建模块circle。这个模块输出两个功能：

    export function area(radius) {
      return Math.PI * radius * radius;
    }

    export function circumference(radius) {
      return 2 * Math.PI * radius;
    }
    
#####4.创建文件in/main.js，引入模块 circle以便于我们能够使用特殊模块的功能。注意重要语法：

    import { area, circumference } from 'circle';

    console.log("Area of the circle: " + area(4) + " meter squared");
    console.log("Circumference of the circle: " + circumference(14) + " meters");
    
#####5.这一点，文件结构如下。我们将在js/circle.js 和 js/main.js使用ES6模块编译器来创建兼容ES5的文件。

    $ tree
    .
    |-- in
    |   |-- circle.js
    |   `-- main.js
    |-- index.html
    `-- js
        `-- init.js
        
#####6.安装ES6 模块编译器:

    $ npm install https://github.com/square/es6-module-transpiler.git
    $ compile-modules --help
    
#####7.最后，我们将会编译这两个文件。如下命令行进入in文件夹：

    $ compile-modules circle.js --type amd --to ../js
    $ compile-modules main.js --type amd --to ../js
    $ cd ..
    $ tree
    .
    |-- in
    |   |-- circle.js
    |   `-- main.js
    |-- index.html
    `-- js
        |-- circle.js
        |-- init.js
        `-- main.js
        
#####8.看js/circle.js 和 js/main.js文件中编译的文件。我们现在浏览器浏览文件index.html，看运行中的模块!我们需要使用一个web服务器来运行文件。我是用Python SimpleHTTPServer。在文件index.html根目录执行如下命令行:

    $ python -m SimpleHTTPServer 8000

![](http://cdn.tutsplus.com/net.tutsplus.com/uploads/2013/05/es6-modules.png)

###资源

很多开发者社区的人员公开分享ES6并且准备好了。推荐几个有ES6相关内容的大牛博客以供学习:

> - [Brendan Eich](https://brendaneich.com/?s=ecmascript) 
> - [Addy Osmani](http://addyosmani.com/blog/?s=ecmascript)
> - [Ariya Hidayat](http://ariya.ofilabs.com/?s=ecmascript)
> - [Nicholas Zakas](http://www.nczonline.net/blog/?s=ecmascript)
> - [Axel Rauschmayer](http://www.2ality.com/search/label/esnext)
> - [Brandon Benvie](http://bbenvie.com/)
> 
>> 还有一些更深层次的资料：
> 
> - [ECMAScript 6 support in Mozilla](https://developer.mozilla.org/en-US/docs/JavaScript/ECMAScript_6_support_in_Mozilla)
> - [Draft specification for ES.next](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts)
> - [The Future of JavaScript](http://www.youtube.com/watch?v=u4IdoBU1uKE), a video by Dave Herman
> - ECMAScript 6 - The Refined Parts ([video](https://www.youtube.com/watch?v=Dt0f2XdvriQ) and [slides](https://speakerdeck.com/kitcambridge/es-6-the-refined-parts)) by Kit Cambridge
> - [Latest Tweets on ES mailing list](https://twitter.com/esdiscuss)
> - [es6 - my fav parts](https://dl.dropboxusercontent.com/u/3531958/es6-favorite-parts/index.html#/)
> - [ES6 has proper tail calls](http://bbenvie.com/articles/2013-01-06/JavaScript-ES6-Has-Tail-Call-Optimization)
> - [Power of Getters](http://webreflection.blogspot.de/2013/01/the-power-of-getters.html)
> - [ECMAScript 6](http://www.slideshare.net/dmitrysoshnikov/falsyvalues-dmitry-soshnikov-ecmascript-6)
> - [ES6 deep Dive](https://speakerdeck.com/dherman/es6-deep-dive) by Dave Herman 

###ES6启程

现在介绍完了，:10个ES6特性配合一些工具可以让我们轻松的写新语法了。我希望你已经对将要到来的更加兴奋。请记住，自从标准化提上日程那天起，语法，特性和符合性一直都可能变化。但是它的价值迟早会被挖掘出来的。

###总结说明

> - 原文地址：http://net.tutsplus.com/articles/news/ecmascript-6-today/
> - 译文地址：http://www.xdf.me/?p=754
> - 翻译：[xdf](http://www.xdf.me/)
> - 转载请注明作者版权，翻译不妥之处望各位指正
