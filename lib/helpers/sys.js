let sysObj = {
    getProp(obj,prop,def = null) {
        if (typeof obj!='undefined' && typeof prop == 'string' && prop.length>0) {
          return(typeof obj[prop]!=='undefined')?obj[prop]:def;
        }
        return def;
    }
    
}

module.exports = sysObj;