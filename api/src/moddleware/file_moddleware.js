const multer = require('koa-multer')

try {
// 配置
  let storage = multer.diskStorage({
    // 文件保存路径, 这里需要自己手动到public下面新建upload文件夹。
    destination: function(req, file, cb) {
      console.log(file);
      

      // this.fieldname = fieldname
      cb(null, "./uploads/avatar");
    },
    // 修改文件名称
    filename: function(req, file, cb) {
      const {fieldname} = file
       console.log(fieldname+' mimetype');
      let fileFormat = file.originalname.split("."); //以点分割成数组，数组的最后一项就是后缀名
      if(fileFormat[0] === 'avatar118926'){
        console.log('我是头像图片');
        cb(null, Date.now() + fileFormat[0] + "." + fileFormat[fileFormat.length - 1]);
      }else{
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
      }
      
    }
  });
  
  // 加载配置 
  let upload = multer({ 
    storage: storage
  }); 

  const avatarHandler = upload.single('file') 
  module.exports = {   
    avatarHandler,
    
  }

} catch (error) { 
  console.log(error);
}

