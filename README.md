# Markdown++(Femd)
## **What is *markdown++***?

*markdown++* is an free and extensible markdown (femd) that allows you to create grammar freely.

## **Usage through\<script\>tag**
Insert in page
```html
<script src="https://femarkdown.github.io/femd.js">
```
You can use the Femd class to call(Support chain call).

The construction parameter can be a list divided by  \n or an entire string containing \n.
```javascript
new Femd(["# Hello World!"]).toDOM().mount("#main")
//Convert the list to a DOM element using the default syntax and insert it into #main.
```

## **Install tools through npm**

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