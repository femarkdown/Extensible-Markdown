class Femd{
    constructor(n){
        switch(Object.prototype.toString.call(n)){
            case "[object String]":
                this.n=n.split("\n");
                this.md=n.split("\n");
                break
            case "[object Array]":
                this.n=n;
                this.md=n;
                break
        }
    }
    toDOM(config={}){
        var Rex={
            "#":/( |<[A-z ='"]+>)*# +/g,
            "##":/( |<[A-z ='"]+>)*## +/g,
            "###":/( |<[A-z ='"]+>)*### +/g,
            "####":/( |<[A-z ='"]+>)*#### +/g,
            "#####":/( |<[A-z ='"]+>)*##### +/g,
            "######":/( |<[A-z ='"]+>)*###### +/g,
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
            "![]()":/\!\[([^\[\]]+)\]\(([^\(\)]+)\)/g,
            "```":/( |<[A-z]+>)*`{3} *([A-z]*) */g,
            "||":/(\|.+)+\|\n(\| *[-:]+ *)+\|(\n(\|.+)+\|)*/g,
            "n.":/(([0-9]+)\. +[^<\n]+(\n *[0-9]+\. +[^<\n]+)*)|[0-9]+\. +<.*>/g,
            "+.":/((\+|\-|\*) +[^<\n]+(\n *(\+|\-|\*) +[^<\n]+)*)|(\+|\-|\*) +<.*>/g,
            ">":/\n *(> *[^<\n]+(\n *> *[^<\n]+)*)|\n *> *<.*>/g,
            "[^]":/\[\^.{1,}\] *\: *.{1,}/g
        }
        /*
        config Grammar
        config.make=[[<char>,<html>]........],example:["&&",<mark>] &&=><mark>
        config.do=[<char>,<html>[,<num>(num为0时不操作，为1时在函数后方加<br>,2为前方,3为前后同时)]],example:["%",<p>] % ...=><p>...</p>
        config.a:控制a链接，参数为0时不在新窗口打开
        config.create=[RegExp,(e)=>{}],该方法传递e(正则捕获)将返回值作为新g
        config.list={<char>:<html>}修改html语义化标签
        config.block=[[RegExp,(e)=>{处理捕获对象}[,(type=0默认|1)]]...]处理块元素(正则需匹配\n) (type为0时只处理一次，为1时循环处理,循环后可能会死循环，这取决于用户提交的处理函数，但可以在其他内置元素中正常显示)
        config.footer=(e)=>{脚注的id名处理}
        config.pre=0|1（是否开启四空格转<pre>
        */
        if(!config.list){config.list={}}
        if(config.make){
            config.make.map(e=>{if(["&#","&","#",";",";&",";&#"].includes(e[0])){throw "Error on toHTML"}})
        }
        if([1,2].concat([8,9]).toString()==Array.from(new Set([1,2].concat([8,9]))).toString())
        var splice=(str,a,b,c)=>{var g=str.split("");g.splice(a,b,c);return g.join("")};
        var toHTML_Str=(str)=>str.split("").map(e=>"&#"+e.charCodeAt(0)+";").join("");
        var isASCII=(s)=>s.charCodeAt(0)<127;
        /*
        处理顺序
        1.#标题
        2.处理** **粗体
        */
        var pre_make=false;
        var block_pre_make=false;
        var h_making=this.n.join("\n");//结构化
        h_making=h_making.replaceAll("\r","")
        if(!config.pre){h_making=h_making.replaceAll("\n    ","&#10;")};
        var b=0;
        var Smake_list={};//脚注列表
        [...h_making.matchAll(/\\\\[^\\]/g)].map(e=>{
            h_making=splice(h_making,e["index"]+b,e[0].length,isASCII(e[0].replaceAll("\\",""))?toHTML_Str(e[0].replaceAll("\\","")):e[0].replaceAll("\\",""));
            b+=(isASCII(e[0].replaceAll("\\",""))?toHTML_Str(e[0].replaceAll("\\","")):e[0].replaceAll("\\","")).length-e[0].length;
        });//  \\ASCII字符转义 example:\\<div>=>&#60;div>
        if(config.block){//block:[RegExp,(e)=>{},type=0|1]
            config.block.map(w=>{
                var o=w;
                if(Object.prototype.toString.call(w[0]).slice(8,-1)=="String"){o[0]=o[0][o[0].length-1]=="g"?eval(o[0]):RegExp(o[0],"g")}
                if(Object.prototype.toString.call(w[1]).slice(8,-1)=="String"){o[1]=eval(o[1])}
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
        }
        var b=0;
        [...h_making.matchAll(Rex["||"])].map(k=>{
            var j=k[0].split("\n")[0].replace("\\|","").split("|").length-1;
            if(k[0].split("\n").every(e=>e.replace("\\|","").split("|").length-1==j)&&k[0].split("\n")[1].split("|").slice(1,-1).every(p=>[...p.trim().matchAll(":")].every(o=>[0,p.trim().length-1].includes(o["index"])))){
                var l=k[0].split("\n").map(e=>e.replace("\\|",toHTML_Str("|"))).map(e=>e.split("|").slice(1,-1))
                var t="<tr>";
                l[0].map(p=>{t+="<th>"+p+"</th>"});
                t+="</tr>";
                var i=l[1].map(r=>["left","right","left"][[0,r.trim().length-1,-1].indexOf(r.trim().indexOf(":"))]);
                l[1].map((f,d)=>{if(f.trim()[0]==":"&&f[f.trimEnd().length-1]==":"){i[d]="center"}})
                l.slice(2).map(u=>{t+="<tr>";u.map((y,q)=>{t+=`<td style='text-align:${i[q]}'>`+y+"</td>"});t+="</tr>"});
                h_making=splice(h_making,k["index"]+b,k[0].length,`<table>${t}</table>`);
                b+=(`<table>${t}</table>`).length-k[0].length;
            }
        })//|.|-:|.|=><table>
        while([...h_making.matchAll(Rex["n."])].length>0){
            var b=0;
            [...h_making.matchAll(Rex["n."])].map(k=>{
                var p=k[0].split("\n");
                var t=p.map(r=>r.match(/ */g)[0].length);
                t=t.map((r,y)=>y==0?0:r-t[0]).map(e=>e<0?0:e);
                var u=p.map((i,j)=>[i.slice(i.search(/[0-9]\./g)+2).trimStart(),t[j]]);
                var r="";
                var f=[];
                u.map((e,q)=>{
                    if(u[q-1]){
                        if(u[q-1][1]<e[1]){
                            r+=`<ol start='${p[q].match(/[0-9]{1,}/g)[0]}'><li>`+e[0]+"</li>";
                            f.push("</ol>");
                        }else{r+="<li>"+e[0]+"</li>"}
                    }else{
                        r+=`<ol start='${p[q].match(/[0-9]{1,}/g)[0]}'><li>`+e[0]+"</li>";
                        f.push("</ol>");
                    };
                    if(u[q+1]){
                        if(u[q+1][1]<e[1]){r+="</ol>";f=f.slice(1);}
                    }else{r+="</ol>";f=f.slice(1);}
                });r+=f.join("");
                h_making=splice(h_making,k["index"]+b,k[0].length,r);
                b+=r.length-k[0].length;
            });//n.=><ol><li>
        }
        while([...h_making.matchAll(Rex["+."])].length>0){
            var b=0;
            [...h_making.matchAll(Rex["+."])].map(k=>{
                var p=k[0].split("\n");
                var t=p.map(r=>r.match(/ */g)[0].length);
                t=t.map((r,y)=>y==0?0:r-t[0]).map(e=>e<0?0:e);
                var u=p.map((i,j)=>[i.slice(i.search(/(\+|\-|\*){1}/g)+2).trimStart(),t[j]]);
                var r="";
                var f=[];
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
                h_making=splice(h_making,k["index"]+b,k[0].length,r);
                b+=r.length-k[0].length;
            });
        }//+-*=><ul><li>
        while([...h_making.matchAll(Rex[">"])].length>0){
            var b=0;
            [...h_making.matchAll(Rex[">"])].map(l_k=>{
                var k=l_k;
                if(k["index"]==this.n[0].length&&this.n[0].search(/ *(> *[^<\n]+(\n *> *[^<\n]+)*)|\n *> *<.*>/g)+1){
                    k[0]=this.n[0]+k[0];
                    k["index"]=0
                }
                var p=k[0].split("\n").filter(i=>i!="");
                var t=p.map(r=>r.match(/(>| {0,4})+/g)[0].replaceAll(" ","").length);
                var g=0;
                t=t.map((r,y)=>{
                    if(y==0){
                        return 0
                    }else{
                        if(r[1]>g){
                            g=r[1];
                            return r[1]
                        }else{return g}
                    }
                });
                var u=p.map((i,j)=>[i.slice(i.search(/ *>+/g)+i.match(/ *>+/g)[0].length).trimStart(),t[j]]);
                var r="";
                var f=[];
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
                h_making=splice(h_making,k["index"]+b,k[0].length,"\n"+r);
                b+=("\n"+r).length-k[0].length;
            })
        }//>=><blockquote>
        this.n=h_making.split("\n")
        this.n=this.n.map((e,q)=>{
        if(e.slice(0,4)=="    "&&block_pre_make==false&&config.pre){
            e=e.slice(4);
            if(!pre_make){e="<pre>"+toHTML_Str(e);}else{e=toHTML_Str(e)}
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
        }// 4 space=><pre>
        else if(e.search(Rex["#"])==0){
            var j=config.list["#"]?config.list["#"].replace(">","").replace("<",""):"h1";
            e=e.replace(Rex["#"],e.match(new RegExp("( |<[A-z \=\'\"]{1,}>)*#","g"))[0].slice(0,-1)+`<${j}>`);
            e+=`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`;
            return e;//#=><h1>
        }else if(e.search(Rex["##"])==0){
            var j=config.list["##"]?config.list["##"].replace(">","").replace("<",""):"h2";
            e=e.replace(Rex["##"],e.match(new RegExp("( |<[A-z \=\'\"]{1,}>)*#","g"))[0].slice(0,-1)+`<${j}>`);
            e+=`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`;
            return e;//##=><h2>
        }else if(e.search(Rex["###"])==0){
            var j=config.list["###"]?config.list["###"].replace(">","").replace("<",""):"h3";
            e=e.replace(Rex["###"],e.match(new RegExp("( |<[A-z \=\'\"]{1,}>)*#","g"))[0].slice(0,-1)+`<${j}>`);
            e+=`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`;
            return e;//###=><h3>
        }else if(e.search(Rex["####"])==0){
            var j=config.list["####"]?config.list["####"].replace(">","").replace("<",""):"h4";
            e=e.replace(Rex["####"],e.match(new RegExp("( |<[A-z \=\'\"]{1,}>)*#","g"))[0].slice(0,-1)+`<${j}>`);
            e+=`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`;
            return e;//####=><h4>
        }else if(e.search(Rex["#####"])==0){
            var j=config.list["#####"]?config.list["#####"].replace(">","").replace("<",""):"h5";
            e=e.replace(Rex["#####"],e.match(new RegExp("( |<[A-z \=\'\"]{1,}>)*#","g"))[0].slice(0,-1)+`<${j}>`);
            e+=`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`;
            return e;//#####=><h5>
        }else if(e.search(Rex["######"])==0){
            var j=config.list["######"]?config.list["######"].replace(">","").replace("<",""):"h6";
            e=e.replace(Rex["######"],e.match(new RegExp("( |<[A-z \=\'\"]{1,}>)*#","g"))[0].slice(0,-1)+`<${j}>`);
            e+=`/<${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`;
            return e;//######=><h6>
        }else{
            if(config.do){
                config.do.map(p=>{
                    var o=p[1].replace(">","").replace("<","");
                    try{var d_m=new RegExp("( |<[A-z \=\'\"]{1,}>){0,}"+p[0]+" {1,}","g")}catch(err){var d_m=new RegExp("( |<[A-z \=\'\"]{1,}>){0,}["+p[0][0]+"]{"+p[0].length+"} {1,}","g")}
                    if(e.search(d_m)==0){
                        e=e.replace(d_m,e.match(new RegExp("( |<[A-z \=\'\"]{1,}>)"+p[0][0]+"{0,}","g"))[0].slice(0,-1)+"<"+o+">");
                        e+="</"+(o.indexOf(" ")==-1?o:o.slice(0,o.indexOf(" ")))+">";
                        if(p.length>2){
                           if(p[2]==1){
                            e+="<br>"
                           }else if(p[2]==2){
                            e="<br>"+e;
                           }else if(p[2]==3){
                            e="<br>"+e+"<br>";
                           }
                        }
                        return e;
                    }
                })
            }
            return e
        }});// config.do[]=><any>
        var amake_0=(str)=>{
            var g=str;
            if(config.make){//[<char>,<html>],example:["&&",<mark>] &&=><mark>
                config.make.filter(e=>e[0].match(new RegExp(e[0][0]+"{1,}","g"))[0]==e[0]&&e.length==2).map(e=>{
                    b=0;
                    var m=e[1].replace(">","").replace("<","");
                    var o=new RegExp(`[${e[0][0]}]{${e[0].length}}([^${e[0][0]}]{1,}|[^${e[0][0]}]{1,}.{1,}[^${e[0][0]}]{1,})${e[0]}`,"g");
                    [...g.matchAll(o)].map(e=>{
                        g=splice(g,e["index"]+b,e[0].length,"<"+m+">"+e[1].replaceAll(e[0][0],toHTML_Str(e[0][0]))+"</"+(m.indexOf(" ")==-1?m:m.slice(0,m.indexOf(" ")))+">");
                        b+=("<"+m+">"+e[1].replaceAll(e[0][0],toHTML_Str(e[0][0]))+"</"+(m.indexOf(" ")==-1?m:m.slice(0,m.indexOf(" ")))+">").length-e[0].length;
                    });//<char>=><html>
                })
            }
            if(config.create){//[RegExp,(e)=>{处理函数}]
                config.create.map(w=>{
                    var t=w;
                    if(Object.prototype.toString.call(w[0]).slice(8,-1)=="String"){t[0]=t[0][t[0].length-1]=="g"?eval(t[0]):RegExp(t[0],"g")}
                    if(Object.prototype.toString.call(w[1]).slice(8,-1)=="String"){t[1]=eval(t[1])}
                    b=0;
                    [...g.matchAll(t[0])].map(e=>{
                        var l_1=g.length;
                        g=splice(g,e["index"]+b,e[0].length,t[1](e))
                        var l_2=g.length;
                        b+=l_2-l_1;
                    })//[RegExp]=>(e)
                })
            }
            var b=0;
            [...g.matchAll(Rex["**"])].map(e=>{
                var j=config.list["**"]?config.list["**"].replace(">","").replace("<",""):"b";
                g=splice(g,e["index"]+b,e[0].length,`<${j}>`+e[1].replaceAll("*","&#42;").replaceAll("_","&#95;")+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`);
                b+=(`<${j}>`+e[1].replaceAll("*","&#42;").replaceAll("_","&#95;")+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`).length-e[0].length;
            });//**=><b>
            var b=0;
            [...g.matchAll(Rex["__"])].map(e=>{
                var j=config.list["__"]?config.list["__"].replace(">","").replace("<",""):"b";
                g=splice(g,e["index"]+b,e[0].length,`<${j}>`+e[1].replaceAll("_","&#95;").replaceAll("*","&#42;")+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`);
                b+=(`<${j}>`+e[1].replaceAll("_","&#95;").replaceAll("*","&#42;")+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`).length-e[0].length;
            });//__=><b>
            b=0;
            [...g.matchAll(Rex["*"])].map(e=>{
                var j=config.list["*"]?config.list["*"].replace(">","").replace("<",""):"i";
                g=splice(g,e["index"]+b,e[0].length,`<${j}>`+e[1].replaceAll("*","&#42;").replaceAll("_","&#95;")+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`);
                b+=(`<${j}>`+e[1].replaceAll("*","&#42;").replaceAll("_","&#95;")+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`).length-e[0].length;
            });//*=><i>
            b=0;
            [...g.matchAll(Rex["_"])].map(e=>{
                var j=config.list["_"]?config.list["_"].replace(">","").replace("<",""):"i";
                g=splice(g,e["index"]+b,e[0].length,`<${j}>`+e[1].replaceAll("_","&#95;").replaceAll("*","&#42;")+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`);
                b+=(`<${j}>`+e[1].replaceAll("_","&#95;").replaceAll("*","&#42;")+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`).length-e[0].length;
            });//_=><i>
            b=0;
            [...g.matchAll(Rex["`"])].map(e=>{
                var j=config.list["`"]?config.list["`"].replace(">","").replace("<",""):"code";
                g=splice(g,e["index"]+b,e[0].length,`<${j}>`+toHTML_Str(e[1])+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`);
                b+=(`<${j}>`+toHTML_Str(e[1])+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`).length-e[0].length;
            });//`=><code>
            b=0;
            [...g.matchAll(Rex["~~"])].map(e=>{
                var j=config.list["~~"]?config.list["~~"].replace(">","").replace("<",""):"s";
                g=splice(g,e["index"]+b,e[0].length,`<${j}>`+e[1].replaceAll("~","&#126;")+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`);
                b+=(`<${j}>`+e[1].replaceAll("~","&#126;")+`</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`).length-e[0].length;
            });//~~=><s>
            b=0;
            [...g.matchAll(Rex["![]()"])].map(e=>{
                var j=config.list["![]()"]?config.list["![]()"].replace(">","").replace("<",""):"img";
                g=splice(g,e["index"]+b,e[0].length,`<${j} src='${e[2]}' alt='${e[1]}'>`);
                b+=(`<${j} src='${e[2]}' alt='${e[1]}'>`).length-e[0].length;
            })//![]()=><img>
            b=0;
            [...g.matchAll(Rex["[]()"])].map(e=>{
                var j=config.list["[]()"]?config.list["[]()"].replace(">","").replace("<",""):"a";
                g=splice(g,e["index"]+b,e[0].length,`<${j} href='${e[2]}'${config.a==0?"":"target='_blank'"}>${e[1]}</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`);
                b+=(`<${j} href='${e[2]}'>${e[1]}</${j.indexOf(" ")==-1?j:j.slice(0,j.indexOf(" "))}>`).length-e[0].length;
            })//[]()=><a>
            return g
        }
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
                            this.n[i]=this.n[i].match(/( |<[A-z \=\'\"]{1,}>){0,}`/g)[0].slice(0,-1)+`<pre class='${o?"pre "+o:"pre"}'>`
                            block_pre_make=g;
                            for(var y=i+1;y<g;y++){
                                this.n[y]=toHTML_Str(this.n[y])+"\n"
                            }
                            break
                        }
                    }
                }
            }
        }
        this.n.map((e,q)=>{if(e==""){this.n[q]="<br>"};
            if(e.search(Rex["[^]"])==0){
                if(e.match(Rex["[^]"])==this.n[q]){
                    var b_i=e.slice(e.match(/\[\^.{1,}\] *\: */g)[0].length).trimEnd()
                    Smake_list[e.match(/\[\^.{1,}\]/g)[0].slice(2,-1)]=b_i;
                    this.n[q]+=`<a href='${config.footer?config.footer(Object.keys(Smake_list).length-1):("#footor-m"+(Object.keys(Smake_list).length-1))}'>To</a>`;
                }
            }
        })
        this.n.forEach((e,q)=>{
            if(e.search(/\[\^.{1,}\]/g)!=0&&e.search(Rex["[^]"])!=0){
                var b=0;
                [...e.matchAll(/\[\^.{1,}\]/g)].map(k=>{
                    if(Smake_list[k[0].slice(2,-1)]){
                        var g_1=this.n[q].length;
                        this.n[q]=splice(e,k["index"]+b,k[0].length,`<sup><abbr id='${config.footer?config.footer(Object.keys(Smake_list).indexOf(k[0].slice(2,-1))):("footor-m"+Object.keys(Smake_list).indexOf(k[0].slice(2,-1)))}' title='${Smake_list[k[0].slice(2,-1)]}'>${k[0].slice(2,-1)}</abbr></sup>`)
                        var g_2=this.n[q].length;
                        b+=g_2-g_1;
                    }
                })
            }
        })
        return this;
    }
    bind(el){
        if(this.n){
            el.innerHTML=this.n.join("");
            console.log(this.md.join("\n"));
            console.log(this.n);
            console.log(this.n.join(""));
        }else{throw "NONE DOM or MD"}
        return this;
    }
    mount(q){
        if(this.n){
            document.querySelector(q).innerHTML=this.n.join("");
            console.log(this.md.join("\n"));
            console.log(this.n);
            console.log(this.n.join(""));
        }else{throw "NONE DOM or MD"}
        return this;
    }
}