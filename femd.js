/**
 * femd v2.1.0 - A tool for markdown++.
 * Copyright (c) 2011-2023, Sifer. (MIT Licensed)
 * https://github.com/femarkdown/Extensible-Markdown
 */
class Femd{
    constructor(n){
        var t=Object.prototype.toString.call(n);
        if(t=="[object String]"){
            this.n=n.split("\n");
            this.md=n.split("\n");
        }else if(t=="[object Array]"){
            this.n=n;
            this.md=n;
        }
    }
    toDOM(config={}){
        var Rex={
            "#":/ *# +/g,
            "##":/ *## +/g,
            "###":/ *### +/g,
            "####":/ *#### +/g,
            "#####":/ *##### +/g,
            "######":/ *###### +/g,
            "---":/[ -]{3,}/g,
            "___":/[ _]{3,}/g,
            "***":/[ *]{3,}/g,
            "**":/\*\*([^*]+|[^*]+.+[^*]+)\*\*/g,
            "__":/\_\_([^_]+|[^_]+.+[^_]+)\_\_/g,
            "*":/\*([^*]+|[^*]+.+[^*]+)\*/g,
            "_":/\_([^_]+|[^_]+.+[^_]+)\_/g,
            "`":/\`([^`]+|[^`]+.+[^`]+)\`/g,
            "~~":/~~([^~]+|[^~]+.+[^~]+)~~/g,
            "[]()":/\[([^\[\]]+)\]\(([^\(\)]+)\)/g,
            "![]()":/\!\[([^\[\]]*)\]\(([^\(\)]+)\)/g,
            "```":/( |<[A-z]+>)*`{3} *([A-z]*) */g,
            "||":/(\|.+)+\|\n(\| *[-:]+ *)+\|(\n(\|.+)+\|)*/g,
            "n.":/(?<=<.+> *|\n *|\n|^)(([0-9]+)\. +[^<\n]+(\n *[0-9]+\. +[^<\n]+)*)|[0-9]+\. +<.*>/g,
            "+.":/(?<=<.+> *|\n *|\n|^)((\+|\-|\*) +[^<\n]+(\n *(\+|\-|\*) +[^<\n]+)*)|(\+|\-|\*) +<.*>/g,
            ">":/\n *(> *[^<\n]+(\n *> *[^<\n]+)*)|\n *> *<.*>/g,
            "[^]":/\[\^.{1,}\] *\: *.{1,}/g
        };
        var doable=true;
        if(!config.list){config.list={}};
        var y_list={"#":"h1","##":"h2","###":"h3","####":"h4","#####":"h5","######":"h6","**":"b","__":"b","_":"i","*":"i","`":"code","~~":"s","![]()":"img","[]()":"a","---":"hr","___":"hr","***":"hr","===":"h1"};
        Object.assign(y_list,config.list);
        config.list=y_list;
        var g_tag=(u)=>config.list[u].replace(">","").replace("<","");
        var config_d={
            make:[["**","<b>"],["__","<b>"],["*","<i>"],["_","<i>"],["`","code"],["~~","<s>"]],
            do:[["#",g_tag("#")],["##",g_tag("##")],["###",g_tag("###")],["####",g_tag("####")],["#####",g_tag("#####")],["######",g_tag("######")]],
            create:[
                [Rex["![]()"],(e)=>`<${g_tag("![]()")} src='${e[2]}' alt='${e[1]}'>`],
                [Rex["[]()"],(e)=>{
                    var j=g_tag("[]()");
                    return `<${j} href='${e[2]}'${config.a==0?"":"target='_blank'"}>${e[1]}</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`
                }]
            ],
            block:[
                [Rex["||"],k=>{
                    var j=k[0].split("\n")[0].replace("\\|","").split("|").length-1;
                    if(k[0].split("\n").every(e=>e.replace("\\|","").split("|").length-1==j)&&k[0].split("\n")[1].split("|").slice(1,-1).every(p=>[...p.trim().matchAll(":")].every(o=>[0,p.trim().length-1].includes(o["index"])))){
                        var l=k[0].split("\n").map(e=>e.replace("\\|",toHTML_Str("|"))).map(e=>e.split("|").slice(1,-1));
                        var t="<tr>";l[0].map(p=>{t+="<th>"+p+"</th>"});t+="</tr>";
                        var i=l[1].map(r=>["left","right","left"][[0,r.trim().length-1,-1].indexOf(r.trim().indexOf(":"))]);
                        l[1].map((f,d)=>{if(f.trim()[0]==":"&&f[f.trimEnd().length-1]==":"){i[d]="center"}});
                        l.slice(2).map(u=>{t+="<tr>";u.map((y,q)=>{t+=`<td style='text-align:${i[q]}'>`+y+"</td>"});t+="</tr>"});
                        return `<table>${t}</table>`;
                    }
                }],
                [Rex["n."],k=>{
                    var p=k[0].split("\n");var t=p.map(r=>r.match(/ */g)[0].length);
                    t=t.map((r,y)=>y==0?0:r-t[0]).map(e=>e<0?0:e);var r="";var f=[];
                    var u=p.map((i,j)=>[i.slice(i.search(/[0-9]\./g)+2).trimStart(),t[j]]);
                    u.map((e,q)=>{
                        if(u[q-1]){if(u[q-1][1]<e[1]){
                                r+=`<ol start='${p[q].match(/[0-9]{1,}/g)[0]}'><li>`+e[0]+"</li>";f.push("</ol>");
                            }else{r+="<li>"+e[0]+"</li>"}
                        }else{
                            r+=`<ol start='${p[q].match(/[0-9]{1,}/g)[0]}'><li>`+e[0]+"</li>";f.push("</ol>");
                        };
                        if(u[q+1]){
                            if(u[q+1][1]<e[1]){r+="</ol>";f=f.slice(1);}
                        }else{r+="</ol>";f=f.slice(1);}
                    });r+=f.join("");
                    return r;
                },1],
                [Rex["+."],k=>{
                    var p=k[0].split("\n");
                    var t=p.map(r=>r.match(/ */g)[0].length);
                    t=t.map((r,y)=>y==0?0:r-t[0]).map(e=>e<0?0:e);
                    var u=p.map((i,j)=>[i.slice(i.search(/(\+|\-|\*){1}/g)+2).trimStart(),t[j]]);
                    var r="";var f=[];
                    u.map((e,q)=>{
                        if(u[q-1]){
                            if(u[q-1][1]<e[1]){
                                r+="<ul><li>"+e[0]+"</li>";
                                f.push("</ul>");
                            }else{r+="<li>"+e[0]+"</li>"}
                        }else{
                            r+="<ul><li>"+e[0]+"</li>";
                            f.push("</ul>");
                        };
                        if(u[q+1]){
                            if(u[q+1][1]<e[1]){r+="</ul>";f=f.slice(1);}
                        }else{r+="</ul>";f=f.slice(1);}
                    });r+=f.join("");
                    return r;
                },1],
                [Rex[">"],l_k=>{
                    var k=l_k;
                    var p=k[0].split("\n").filter(i=>i!="");
                    var t=p.map(r=>r.match(/(>| {0,4})+/g)[0].replaceAll(" ","").length);
                    var g=0;
                    t=t.map((r,y)=>{if(r>g){g=r;return r}else{return g}});
                    var u=p.map((i,j)=>[i.slice(i.search(/ *>+/g)+i.match(/ *>+/g)[0].length).trimStart(),t[j]]);
                    var r="";var f=[];
                    u.map((e,q)=>{
                        if(u[q-1]){
                            if(u[q-1][1]<e[1]){
                                r+="<blockquote><div>"+e[0]+"</div>";
                                f.push("</blockquote>");
                            }else{r+="<div>"+e[0]+"</div>"}
                        }else{
                            r+="<blockquote><div>"+e[0]+"</div>";
                            f.push("</blockquote>");
                        };
                        if(!u[q+1]){r+="</blockquote>";f=f.slice(1);}
                    });r+=f.join("");
                    return r
                },1]
            ]
        };
        if(config.block){config.block=config.block.concat(config_d.block)}else{config.block=config_d.block};
        if(config.make){config.make=config.make.concat(config_d.make)}else{config.make=config_d.make};
        if(config.do){config.do=config.do.concat(config_d.do)}else{config.do=config_d.do};
        if(config.create){config.create=config.create.concat(config_d.create)}else{config.create=config_d.create};
        if(config.make){
            config.make.map(e=>{if(["&#","&","#",";",";&",";&#"].includes(e[0])){throw "Error on toHTML"}})
        };
        var splice=(str,a,b,c)=>{var g=str.split("");g.splice(a,b,c);return g.join("")};
        var toHTML_Str=(str)=>str.split("").map(e=>"&#"+e.charCodeAt(0)+";").join("");
        var isASCII=(s)=>s.charCodeAt(0)<127;
        var sl=(e)=>{
            var a0=e.match(/^(<[^<>]+?>)*/g)[0];
            var a1=e.match(/(<[^><]+?>)*$/g)[0];
            return [a0,e.slice(a0.length,e.length-(a1.length)),a1]
        };
        var pre_make=false;
        var block_pre_make=false;
        var h_making=this.n.join("\n");//结构化
        h_making=h_making.replaceAll("\r","");
        if(!config.pre){h_making=h_making.replaceAll("\n    ","&#10;")};
        var b=0;
        var Smake_list={};//脚注列表
        [...h_making.matchAll(/\\.{1}/g)].map(e=>{
            h_making=splice(h_making,e["index"]+b,e[0].length,isASCII(e[0].replaceAll("\\",""))?toHTML_Str(e[0].replaceAll("\\","")):e[0].replaceAll("\\",""));
            b+=(isASCII(e[0].replaceAll("\\",""))?toHTML_Str(e[0].replaceAll("\\","")):e[0].replaceAll("\\","")).length-e[0].length;
        });//  \ASCII字符转义 example:\\<div>=>&#60;div>
        if(config.block){//block:[RegExp,(e)=>{},type=0|1]
            config.block.map(w=>{
                var o=w;
                if(Object.prototype.toString.call(w[0]).slice(8,-1)=="String"){o[0]=o[0][o[0].length-1]=="g"?eval(o[0]):RegExp(o[0],"g")};
                if(Object.prototype.toString.call(w[1]).slice(8,-1)=="String"){o[1]=eval(o[1])};
                if(o[2]){
                    while([...h_making.matchAll(o[0])].length>0){
                        var b=0;
                        [...h_making.matchAll(o[0])].map(l=>{
                            var f_1=h_making.length;
                            h_making=splice(h_making,l["index"]+b,l[0].length,o[1](l));
                            var f_2=h_making.length;
                            b+=f_2-f_1;
                        })
                    }
                }else{
                    var b=0;
                    [...h_making.matchAll(o[0])].map(l=>{
                        var f_1=h_making.length;
                        h_making=splice(h_making,l["index"]+b,l[0].length,o[1](l));
                        var f_2=h_making.length;
                        b+=f_2-f_1;
                    })
                }
            })
        };
        this.n=h_making.split("\n");
        this.n=this.n.map((e,q)=>{
        doable=true;
        if(sl(e)[1].slice(0,4)=="    "&&block_pre_make==false&&config.pre){
            e=e.slice(4);
            if(!pre_make){e="<pre>"+toHTML_Str(e);}else{e=toHTML_Str(e)};
            if(this.n[q+1]){
                if(this.n[q+1].slice(0,4)=="    "){
                    pre_make=true;
                    e+="\n"
                }else{
                    e=e+"</pre>";
                    pre_make=false;
                }
            }else{
                e=e+"</pre>";
                pre_make=false;
            }
            return e;
        }else{
            if(config.do){
                config.do.map(p=>{
                    if(doable){
                        var o=p[1].replace(">","").replace("<","");
                        try{var d_m=new RegExp(" *"+p[0]+" +","g")}catch(err){var d_m=new RegExp(" *["+p[0][0]+"]{"+p[0].length+"} {1,}","g")};
                        if(sl(e)[1].search(d_m)==0){
                            e=sl(e)[0]+sl(e)[1].replace(d_m,e.match(new RegExp(" *"+p[0][0],"g"))[0].slice(0,-1)+`<${o}>`)+`</${o.indexOf(" ")==-1?o:o.slice(0,o.indexOf(" "))}>`+sl(e)[2];
                            if(p.length>2){
                            if(p[2]==1){
                                e+="<br>"
                            }else if(p[2]==2){
                                e="<br>"+e;
                            }else if(p[2]==3){
                                e="<br>"+e+"<br>";
                            }
                            }
                            doable=false;
                            return e;
                        }
                    }
                })
            }
            return e
        }});// config.do[]=><any>
        var amake_0=(str)=>{
            var g=str;
            if(config.make){//[<char>,<html>],example:["&&",<mark>] &&=><mark>
                config.make.filter(e=>e[0].match(new RegExp("\\"+e[0][0]+"{1,}","g"))[0]==e[0]&&e.length==2).map(e=>{
                    b=0;
                    var m=e[1].replace(">","").replace("<","");
                    var o=eval(`\/[\\${e[0][0]}]{${e[0].length}}([^\\${e[0][0]}]{1,}|[^\\${e[0][0]}]{1,}.{1,}[^\\${e[0][0]}]{1,})${"\\"+e[0].split("").join("\\")}\/g`);
                    [...g.matchAll(o)].map(e=>{
                        g=splice(g,e["index"]+b,e[0].length,"<"+m+">"+e[1].replaceAll(e[0][0],toHTML_Str(e[0][0]))+"</"+(m.indexOf(" ")==-1?m:m.slice(0,m.indexOf(" ")))+">");
                        b+=("<"+m+">"+e[1].replaceAll(e[0][0],toHTML_Str(e[0][0]))+"</"+(m.indexOf(" ")==-1?m:m.slice(0,m.indexOf(" ")))+">").length-e[0].length;
                    });//<char>=><html>
                })
            };
            if(config.create){//[RegExp,(e)=>{处理函数}]
                config.create.map(w=>{
                    var t=w;
                    if(Object.prototype.toString.call(w[0]).slice(8,-1)=="String"){t[0]=t[0][t[0].length-1]=="g"?eval(t[0]):RegExp(t[0],"g")};
                    if(Object.prototype.toString.call(w[1]).slice(8,-1)=="String"){t[1]=eval(t[1])};
                    b=0;
                    [...g.matchAll(t[0])].map(e=>{
                        var l_1=g.length;
                        g=splice(g,e["index"]+b,e[0].length,t[1](e));
                        var l_2=g.length;
                        b+=l_2-l_1;
                    })//[RegExp]=>(e)
                })
            }
            return g
        };
        for(var i=0;i<this.n.length;i++){
            this.n[i]=amake_0(this.n[i]);//**=><b>;*=><i>;~~=><s>...
            if(this.n[i].search(Rex["---"])!=-1&&i>0){
                if(this.n[i].trim().replaceAll("-","")==""&&this.n[i].split("").filter(e=>e=="-").length>=3&&this.n[i-1]!=""&&this.n[i-1].search(/<h[1-9]{1}>/g)!=0){//---=><h2>
                    var j=config.list["##"]?config.list["##"].replace(">","").replace("<",""):"h2";
                    this.n[i-1]=`<${j}>`+this.n[i-1]+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`;
                    this.n[i]="";
                }else if(this.n[i].match(Rex["---"])[0]==this.n[i]){//---=><hr>
                    var j=config.list["---"]?config.list["---"].replace(">","").replace("<",""):"hr";
                    this.n[i]=`<${j}>`;
                }
            }else if(this.n[i].trim().replaceAll("=","")==""&&this.n[i].split("").filter(e=>e=="=").length>=3&&i>0){// === =><h1>
                if(this.n[i-1]!=""&&this.n[i-1].search(/<h[1-9]{1}>/g)!=0){
                    var j=config.list["==="]?config.list["==="].replace(">","").replace("<",""):"h1";
                    this.n[i-1]=`<${j}>`+this.n[i-1]+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`;
                    this.n[i]="";
                }
            }else if(this.n[i].search(Rex["***"])!=-1){
                if(this.n[i].match(Rex["***"])[0]==this.n[i]){//***=><hr> */
                    var j=config.list["***"]?config.list["***"].replace(">","").replace("<",""):"hr";
                    this.n[i]=`<${j}>`;
                }
            }else if(this.n[i].search(Rex["___"])!=-1){
                if(this.n[i].match(Rex["___"])[0]==this.n[i]){//___=><hr> */
                    var j=config.list["___"]?config.list["___"].replace(">","").replace("<",""):"hr";
                    this.n[i]=`<${j}>`;
                }
            }else if(i==0&&this.n[i]=="---"){
                var j=config.list["---"]?config.list["---"].replace(">","").replace("<",""):"hr";
                this.n[i]=`<${j}>`;
            }//[0]---=><hr>
            else if(i==block_pre_make&&block_pre_make!=false){this.n[i]="</pre>";block_pre_make=false;}
            else if(this.n[i].search(Rex["```"])==0&&i!=this.n.length&&!block_pre_make){
                if(this.n[i].match(Rex["```"])==this.n[i]){
                    var o=[...this.n[i].matchAll(Rex["```"])][0][2];
                }
                for(var g=i+1;g<this.n.length;g++){
                    if(this.n[g].search(/ {0,}`{3} {0,}/g)==0){
                        if(this.n[g].match(/ {0,}`{3} {0,}/g)[0]==this.n[g]){
                            this.n[i]=this.n[i].match(/( |<[A-z \=\'\"]{1,}>){0,}`/g)[0].slice(0,-1)+`<pre class='${o?"pre "+o:"pre"}'>`;
                            block_pre_make=g;
                            for(var y=i+1;y<g;y++){
                                this.n[y]=toHTML_Str(this.n[y])+"\n"
                            };
                            break
                        }
                    }
                }
            }
        }
        this.n.map((e,q)=>{if(e==""){this.n[q]="<br>"};
            if(e.search(Rex["[^]"])==0){
                if(e.match(Rex["[^]"])==this.n[q]){
                    var b_i=e.slice(e.match(/\[\^.{1,}\] *\: */g)[0].length).trimEnd();
                    Smake_list[e.match(/\[\^.{1,}\]/g)[0].slice(2,-1)]=b_i;
                    this.n[q]+=`<a href='${config.footer?config.footer(Object.keys(Smake_list).length-1):("#footor-m"+(Object.keys(Smake_list).length-1))}'>↩︎</a>`;
                }
            }
        });
        this.n.forEach((e,q)=>{
            if(e.search(/\[\^.{1,}\]/g)!=0&&e.search(Rex["[^]"])!=0){
                var b=0;
                [...e.matchAll(/\[\^.{1,}\]/g)].map(k=>{
                    if(Smake_list[k[0].slice(2,-1)]){
                        var g_1=this.n[q].length;
                        this.n[q]=splice(e,k["index"]+b,k[0].length,`<sup><abbr id='${config.footer?config.footer(Object.keys(Smake_list).indexOf(k[0].slice(2,-1))):("footor-m"+Object.keys(Smake_list).indexOf(k[0].slice(2,-1)))}' title='${Smake_list[k[0].slice(2,-1)]}'>${k[0].slice(2,-1)}</abbr></sup>`);
                        var g_2=this.n[q].length;
                        b+=g_2-g_1;
                    }
                })
            }
        });
        return this;
    }
    r(t=1,k=0){
        return t?'<!DOCTYPE html>\n<html>\n<head><meta charset="UTF-8">\n<meta http-equiv="X-UA-Compatible" content="IE=edge">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'+(k?('<title>'+(this.name?this.name:"Document")+'</title>'):"")+'\n</head>\n<body>'+this.n.join("")+'</body>\n</html>':this.n.join("")
    }
    name(s){this.name=s;return this;}
    bind(el){
        if(this.n){el.innerHTML=this.n.join("");console.log(this.md.join("\n"));console.log(this.n);console.log(this.n.join(""));}else{throw "NONE DOM or MD"};
        return this;
    }
    mount(q){
        if(this.n){document.querySelector(q).innerHTML=this.n.join("");console.log(this.md.join("\n"));console.log(this.n);console.log(this.n.join(""));
        }else{throw "NONE DOM or MD"};
        return this;
    }
};
try{module.exports=Femd}catch(err){};