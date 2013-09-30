var apis;
function parseQS(a){
    var e=[],d;
    var b=a.split("&");
    for(var c=0;c<b.length;c++){
        d=b[c].split("=");
        e.push(d[0]);
        e[d[0]]=d[1]
    }
    return e}

function get_request_token(){
    if($("#consumer_key").val()==""){alert("Please input your Plurk application key");$("#consumer_key").focus();return}
    if($("#consumer_secret").val()==""){alert("Please input your Plurk application secret");$("#consumer_secret").focus();return}
    
    var a={
        oauth_consumer_key:$("#consumer_key").val(),
        oauth_consumer_secret:$("#consumer_secret").val()
    };
    
    $("#token_key").val("");
    $("#token_secret").val("");
    
    $("#sigbase").text("");
    $("#response").text("");
    $("#header").text("");
    $("#request").text("[GET] http://www.plurk.com/OAuth/request_token");

    $.post("/OAuth/test/get_request_token",a,function(c){
        var b=$.parseJSON(c);
        $("#sigbase").text(b.sigbase);
        $("#response").text(b.response[1]);
        $("#header").text(b.header);
        x=parseQS(b.response[1]);
        $("#token_key").hide().val(x.oauth_token).fadeIn(1000);
        $("#token_secret").hide().val(x.oauth_token_secret).fadeIn(1000)
    })
}

function open_authorization_url(){
    var a=base_url+"/OAuth/authorize?oauth_token="+$("#token_key").val();
    $("#request").text("Redirect user to: "+a);
    $("#sigbase").text("");
    $("#response").text("");
    $("#header").text("");
    window.open(a)
}

function get_access_token(){
    if($("#consumer_key").val()==""){alert("Please input your Plurk application key");$("#consumer_key").focus();return}
    if($("#consumer_secret").val()==""){alert("Please input your Plurk application secret");$("#consumer_secret").focus();return}
    
    if($("#token_key").val()==""){alert("Please retrieve request token first");return}
    if($("#token_secret").val()==""){alert("Please retrieve request token first");return}
    
    $("#sigbase").text("");
    $("#response").text("");
    $("#header").text("");
    $("#request").text("[GET] http://www.plurk.com/OAuth/access_token");
    
    var a=prompt("please input the verification number: ");
    var b={
        oauth_consumer_key:$("#consumer_key").val(),
        oauth_consumer_secret:$("#consumer_secret").val(),
        oauth_token:$("#token_key").val(),
        oauth_token_secret:$("#token_secret").val(),
        oauth_verifier:a};

        $.post("/OAuth/test/get_access_token",b,function(d){
            var c=$.parseJSON(d);
            $("#sigbase").text(c.sigbase);
            $("#header").text(c.header);
            $("#response").text(c.response[1]);
            x=parseQS(c.response[1]);
            $("#token_key").hide().val(x.oauth_token).fadeIn(1000);
            $("#token_secret").hide().val(x.oauth_token_secret).fadeIn(1000)}
        )}
        
function access_resource(){
    if($("#consumer_key").val()==""){alert("Please input your Plurk application key");$("#consumer_key").focus();return}
    if($("#consumer_secret").val()==""){alert("Please input your Plurk application secret");$("#consumer_secret").focus();return}
    
    $("#sigbase").text("");
    $("#response").text("");
    $("#header").text("");
    
    var a=base_url+$("#api").val();
    var c="";
    var d=$("#method").val();
    
    $("#params input").each(function(){
        if($(this).attr("value")!=""){
            if(c!=""){
                c+="&"
            }
            c+=$(this).attr("name")+"="+encodeURIComponent($(this).attr("value"))
        }
    });
    
    if(d=="GET"&&c!=""){
        a+="?"+c
    }
    
    $("#request").val("["+d+"] "+a);
    var b={
        oauth_consumer_key:$("#consumer_key").val(),
        oauth_consumer_secret:$("#consumer_secret").val(),
        oauth_token:$("#token_key").val(),
        oauth_token_secret:$("#token_secret").val(),
        resource:a,query:c,method:d
    };
    
    $.post("/OAuth/test/access_resource",b,function(f){var e=$.parseJSON(f);if(e.response[1][0]=="{"){$("#response").text(JSON.stringify($.parseJSON(e.response[1]),{},"    "))}else{$("#response").text(e.response[1])}if(e.response[0]=="error"){return}$("#sigbase").text(e.sigbase);$("#header").text(e.header)})}$(document).ready(function(){$("input[type=text][title],textarea[title]").each(function(b){$(this).addClass("hint-"+b);var a=$('<span class="hint"/>');$(a).attr("id","hint-"+b);$(a).append($(this).attr("title"));$(a).click(function(){$(this).hide();$("."+$(this).attr("id")).focus()});if($(this).val()!=""){$(a).hide()}$(this).before(a);$(this).focus(function(){$("#hint-"+b).hide()});$(this).blur(function(){if($(this).val()==""){$("#hint-"+b).show()}})});$.getJSON("/API/2/list",function(d){apis=d;var a=$("#api")[0].options;var c=[];for(key in d){c.push(key)}c.sort();for(var b=0;b<c.length;++b){a[a.length]=new Option(c[b],c[b]);if(c[b]=="/APP/Profile/getOwnProfile"){$("#api")[0].selectedIndex=b}}select_api("/APP/Profile/getOwnProfile")})});function select_api(c){if(apis[c]===undefined){return}var a=apis[c];params="";for(var b=0;b<a.length;++b){arg=a[b].split(":");params+='<tr><td class="arg_name">'+arg[0]+': </td><td> <input class="arg_input" name="'+arg[0]+'" /> '+((arg[1]===undefined)?"":"(default: "+arg[1]+")")+"</td></tr>"}$("#params").html(params)}function show_dialog(a){$("#help_"+a).dialog({show:"fade",width:500})};
