#!/usr/bin/env node
const fs=require("fs");
const Femd=require("./femd")
//mdd markdown++ json
var i=process.argv;//path path mdd json
var json_path="";
var mdd_path="";
if(i[2]=="-h"||i[2]=="-help"||i[2]=="\\?"||i[2]=="/?"||i[2]=="--help"||i[2]=="--h"){
    console.log("femd [mdfile [jsonfile]]")
}else if(i[2]=="-v"||i[2]=="-verson"||i[2]=="--v"||i[2]=="--verson"){
    console.log("femd v\x1b[38;2;22;198;12m2.1.0\x1b[0m")
}else if(i[2]){
    if(i[3]){
        if(i[3].slice(0,2)=="./"||i[3].slice(0,2)==".\\"){
            json_path=process.cwd()+"\\"+i[3].slice(2)
        }else if(i[3].search(/\\/g)==-1){
            json_path=process.cwd()+"\\"+i[3]
        }else{json_path=i[3]}
    }
    if(i[2].slice(0,2)=="./"){
        mdd_path=process.cwd()+"\\"+i[2].slice(2)
    }else if(i[2].search(/\\/g)==-1){
        mdd_path=process.cwd()+"\\"+i[2]
    }else{mdd_path=i[3]}
if(json_path){
    if(json_path.slice(-5)==".json"&&mdd_path.slice(-3)==".md"){
        var mdd_t=fs.readFileSync(mdd_path,"utf-8");
        var json_t=fs.readFileSync(json_path,"utf-8");
        var j=new Femd(mdd_t);
        fs.writeFileSync(mdd_path.replace(".mdd",".html").replace(".md",".html"),j.toDOM(JSON.parse(json_t)).r(),"utf-8")
    }
}else{
    if([".md","mdd"].includes(mdd_path.slice(-3))){
        var mdd_t=fs.readFileSync(mdd_path,"utf-8");
        var j=new Femd(mdd_t);
        fs.writeFileSync(mdd_path.replace(".mdd",".html").replace(".md",".html"),j.toDOM().r(),"utf-8");
        console.log("Femd:Success!!");
    }
}
}else{
    console.log("Femd:\x1b[38;2;197;15;31mError\x1b[0m Invalid parameter.\nType \"femd --help\" for usage.")
}