# Markdown++(**Femd**)
+ About
+ ### **Install**
    + Custom Syntax
## **What is *markdown++***?

*markdown++* is an free and extensible markdown (femd) that allows you to create grammar freely.

You can learn how to use *markdown++* and how to customize syntax at [Markdown++](https://femarkdown.github.io/)(Under construction) or refer to README.md of this project.

## **Install**
### **Usage through\<script\>tag(Browser)**
Insert in page
```html
<script src="https://cdn.jsdelivr.net/gh/femarkdown/Extensible-Markdown/femd.js"></script>
```

You can use the Femd class to call(Support chain call).

The construction parameter can be a list divided by  \n or an entire string containing \n.
```javascript
new Femd(["# Hello World!"]).toDOM().mount("#main")
//Convert the list to a DOM element using the default syntax and insert it into #main.
```

### **Install tools through npm(CLI)**

**femd** is a tool for *markdown++*.

You can use the npm package to easily use markdown++.

You can use it to easily convert `markdown++` to `html`.

Install the required package first:
```
npm install femd -g
```
Then you can use the femd command to convert markdown.
```
femd 1.md
```
This command will convert `1.md` under the folder into html and generate `1.html`.

If you want to convert markdown++, you can put the json file path into the command line.
```
femd 1.md 2.json
```
This instruction will generate `1.html` according to the syntax defined in markdown and `2.json`.

## **Docs**
### **Custom Syntax**
**Femd** uses a section of json or object to customize the syntax. We call this section of json or object config.

You can call your syntax in the following ways.
```javascript
new Femd(markdown).toDOM(config).mount()
```
or in the command line
```
femd ***.md config.json
```
Next, the parameters of config will be explained in detail.

1. `config.block`  The most powerful syntax. Use to customize block structure.

Structure:
```javascript
config.block=[[RegExp,(e)=>{}[,type=0]]...]
```
**RegExp**:RegExp is the regular expression to match.

**Funtion**:The second parameter of each item is a function (not necessarily an arrow function), and the parameter e is an object (exactly an array, but it has many non-numeric indexes). It is obtained through [... str.matchAll (RegExp)], so each item will have an array basic numeric index, groups, index, input, and the length attribute of the array.

The explanation script will replace the matched markdown text with the return value of the function as the html result.

**Type**:Type is an optional parameter, which is 0 by default, that is, non-overlay block structure. If you can match again in the matched structure, you can set type to 1.(Warning: setting type to 1 is easy to cause memory overflow. You need to check whether the generated structure will be matched again, otherwise it will cause infinite recursion).

**Example**:In this example, we will create a selection structure.

There are the following codes
```markdown
$[Name]{value}
$[Name]{value}
$[Name]{value}!
$[Name]{value}
```
We need to convert it to
```html
<select>
  <option value=value>Name</option>
  <option value=value>Name</option>
  <option value=value selected>Name</option>
  <option value=value>Name</option>
</select>
```
Edit the regular expression and function to get the final config.And compile content using syntax.
```javascript
new Femd(["$[zero]{0}","$[one]{1}!","$[two]{2}"]).toDOM({
	block:[[/(\$\[.+\]\{.+\}\!?\n)+/g,(e)=>"<select>"+[...e[0].matchAll(/\$\[(.+)\]\{(.+)\}\!?/g)].map(d=>`<option value='${d[2]}'${d[0][d[0].length-1]=="!"?" selected":""}>${d[1]}</option>`).join("\n")+"</select>"]]
}).mount("#l");
```
Result:

<select><option value='0'>zero</option><option value='1' selected>one</option></select>$[two]{2}

Note: The last line is not converted because of the vulnerability of regular expressions, which also reminds us to check carefully when writing regular expressions.

2. `config.create` The best choice for creating in-line tools.

Structure:
```javascript
config.create=[[RegExp,(e)=>{}]...]
```

Extraordinary:Because it is an inline syntax tool.**RegExp** does not need to match \n.

**Example**:In this example, we will create a phonetic grammar.

There are the following codes
```markdown
%[word](pronunciation)
```
We need to convert it to
```html
<ruby>word<rt>pronunciation</rt></ruby>
```
Edit the regular expression and function to get the final config.And compile content using syntax.
```javascript
new Femd(["%[apple]([ˈæpl])"]).toDOM({
	create:[[/\%\[([^\[\]]{1,})\]\(([^\(\)]{1,})\)/g,(e)=>"<ruby>"+e[1]+"<rt>"+e[2]+"</rt></ruby>"]]
}).mount("#l");
```
Result:

<ruby>apple<rt>[ˈæpl]</rt></ruby>