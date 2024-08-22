# URI

URI——统一资源标识符（Uniform Resource Identifier），是用于唯一标识互联网上的资源的字符串
URI包括两个子类——URL（Uniform Resource Locator）和URN（Uniform Resource Name）

URL提供定位信息，URN则是资源的唯一名称


URI的语法规则
```javascript
scheme:[//authority]path[?query][#fragment]
```


# URL

URL——统一资源定位符（Uniform Resource Locator），适用于标识和定位互联网上资源的字符串（比如网页，图像，视频）

An example of a URI is ISBN 0-476-35557-4.
An example of a URL would be https://hostinger.com.

# encodeURIComponent

encodeURIComponent是Javascript中的一个函数，用于将字符串中的特殊字符编码成对应的字符实体。
主要用于构建合法的URL，确保其中的特殊字符不会被解析为URL的一部分，而是正确表示。

在URL中，某些字符具有特殊含义，问号(?)表示查询参数的开始， 等号(=)表示参数名和参数值的分隔，斜杠('/')表示路径分隔符。
如果一些字符串（就是URL中的参数或者参数值中）包含了这些字符或其他特殊字符，为了能够安全的传递这些信息就需要对他们进行编码。

encodeURIComponent会对字符串中的所有非字母数字字符进行编码，包括一些在URL中有特殊含义的字符，比如?、=、/。
编码的方式是把这些字符转换成他们的十六进制表示，并在前面加上%符号。
这样URL解析器遇到这些编码后的字符时，会正确的将他们还原成原始字符。


# new URL()

构造函数，返回一个URL对象



举个例子，假设有一个字符串 Hello, World!，其中包含了一个逗号和一个空格。如果直接将这个字符串放入 URL 中，逗号和空格可能会被误解为 URL 的一部分，导致解析错误。但是如果使用 encodeURIComponent 对该字符串进行处理，逗号会被转换成 %2C，空格会被转换成 %20，从而安全地嵌入到 URL 中。

```javascript
const originalString = "Hello, World!";
const encodedString = encodeURIComponent(originalString);
console.log(encodedString); // 输出 "Hello%2C%20World%21"
```

所以，使用window.location获得的href和search都是encoded的。
如果使用new URL对window.location进行处理, 获得的 new URL(window.lcation).searchParams.get('key')就是解码后的数据

```javascript
console.log(window.location.href)
// https://jielili.com.cn/js?redirect_url=https%3A%2F%2Fgithub.com%2FJielili%2Fblogs%3Fkouling%3Dfacai

console.log(window.location.search)
// ?redirect_url=https%3A%2F%2Fgithub.com%2FJielili%2Fblogs%3Fkouling%3Dfacai

console.log(new URL(window.location).searchParams.get('redirect_url'))
//  https://github.com/Jielili/blogs?kouling=facai
```


[uri and url differences](https://www.hostinger.com/tutorials/uri-vs-url#What_Is_URI)
