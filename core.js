/**
 * FemdCore v2.2.0 - A tool for markdown++.
 * Copyright (c) 2011-2023, Sifer. (MIT Licensed)
 * https://github.com/femarkdown/Extensible-Markdown
 */
class FemdCore{
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
    to(config={}){
        /*
        config[block,do,make,create]
        */
        var doable=true;
        var splice=(str,a,b,c)=>{var g=str.split("");g.splice(a,b,c);return g.join("")};
        var toHTML_Str=(str)=>str.split("").map(e=>"&#"+e.charCodeAt(0)+";").join("");
        var sl=(e)=>{
            var a0=e.match(/^(<[^<>]+?>)*/g)[0];
            var a1=e.match(/(<[^><]+?>)*$/g)[0];
            return [a0,e.slice(a0.length,e.length-(a1.length)),a1];
        };
        var h_making=this.n.join("\n");
        h_making=h_making.replaceAll("\r","");
        var b=0;
        if(config.block){
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
                        });
                    };
                }else{
                    var b=0;
                    [...h_making.matchAll(o[0])].map(l=>{
                        var f_1=h_making.length;
                        h_making=splice(h_making,l["index"]+b,l[0].length,o[1](l));
                        var f_2=h_making.length;
                        b+=f_2-f_1;
                    });
                };
            });
        };
        this.n=h_making.split("\n");
        for(var i=0;i<this.n.length;i++){
            doable=true;
            var e=this.n[i];
            if(config.do){
                config.do.map(p=>{
                    if(doable){
                        var o=p[1].replace(">","").replace("<","");
                        try{var d_m=new RegExp(" *"+p[0]+" +","g")}catch(err){var d_m=new RegExp(" *["+p[0][0]+"]{"+p[0].length+"} {1,}","g")};
                        if(sl(e)[1].search(d_m)==0){
                            e=sl(e)[0]+sl(e)[1].replace(d_m,e.match(new RegExp(" *"+p[0][0],"g"))[0].slice(0,-1)+`<${o}>`)+`</${o.indexOf(" ")==-1?o:o.slice(0,o.indexOf(" "))}>`+sl(e)[2];
                            if(p.length>2){
                            if(p[2]==1){
                                e+="<br>";
                            }else if(p[2]==2){
                                e="<br>"+e;
                            }else if(p[2]==3){
                                e="<br>"+e+"<br>";
                            }
                            }
                            doable=false;
                            return e;
                        };
                    };
                });
            };
            this.n[i]=e;
            var g=this.n[i];
            if(config.make){
                config.make.filter(e=>e[0].match(new RegExp("\\"+e[0][0]+"{1,}","g"))[0]==e[0]&&e.length==2).map(e=>{
                    b=0;
                    var m=e[1].replace(">","").replace("<","");
                    var o=eval(`\/[\\${e[0][0]}]{${e[0].length}}([^\\${e[0][0]}]{1,}|[^\\${e[0][0]}]{1,}.{1,}[^\\${e[0][0]}]{1,})${"\\"+e[0].split("").join("\\")}\/g`);
                    [...g.matchAll(o)].map(e=>{
                        g=splice(g,e["index"]+b,e[0].length,"<"+m+">"+e[1].replaceAll(e[0][0],toHTML_Str(e[0][0]))+"</"+(m.indexOf(" ")==-1?m:m.slice(0,m.indexOf(" ")))+">");
                        b+=("<"+m+">"+e[1].replaceAll(e[0][0],toHTML_Str(e[0][0]))+"</"+(m.indexOf(" ")==-1?m:m.slice(0,m.indexOf(" ")))+">").length-e[0].length;
                    });
                });
            };
            if(config.create){
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
                    })
                })
            }
            this.n[i]=g;
        }
        return this;
    }
    over(){
        return this.n.join("");
    }
};
try{module.exports=FemdCore}catch(err){}