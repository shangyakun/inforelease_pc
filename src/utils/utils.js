var utils = {};
utils.getCookie = function(objname){
    var cookie = document.cookie.replace(/\s/g,"");
    var arrstr = cookie.split(";");
    for(var i = 0; i < arrstr.length; i++) {
        var temp = arrstr[i].split("=");
        if(temp[0] == objname) {
            return unescape(temp[1])
        }   
    };
};
utils.getRequest = function() {
    var url = location.href.split('?')[1]; 
    var theRequest = {};  
    var strs = url.split("&"); 
    for(var i = 0; i < strs.length; i ++) {  
        theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
    }  
    return theRequest;  
}; 
utils.getDateFormat = function(time) {
    let date = new Date(time);
    let y = date.getFullYear();
    let m = date.getMonth()+1;
    let d = date.getDate();
    m = m<10?"0"+m:m;
    d = d<10?"0"+d:d;
    return y+'-'+m+'-'+d;  
}; 
utils.getDateFormatMinute = function(time) {
    let date = new Date(time);
    let y = date.getFullYear();
    let m = date.getMonth()+1;
    let d = date.getDate();
    let h = date.getHours();
    let mi = date.getMinutes();
    let s = date.getSeconds();
    m = m<10?"0"+m:m;
    d = d<10?"0"+d:d;
    h = h<10?"0"+h:h;
    mi = mi<10?"0"+mi:mi;
    s = s<10?"0"+s:s;
    return y+'-'+m+'-'+d+' '+h+':'+mi+':'+s;  
};
export default utils;