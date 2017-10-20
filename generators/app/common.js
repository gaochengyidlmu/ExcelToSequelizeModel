const path = require('path');

exports.isExist=(arg)=>{
  if(arg !== null && arg !== undefined){
    return true
  }else{
    return false
  }
};

// 为了兼容，需要获取 config 中的 cfg 文件名 （cfg / args）
exports.getCfgFileName = (projectPath) => {
  let config = require(path.join(projectPath, '/config/default'));
  if (config.cfg) return 'cfg';
  else if (config.args) return 'args';
  else throw new Error('没有对应的 config')
};
