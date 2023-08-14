const express = require('express')
const db = require('./db/index')
const multer  = require('multer')

var moment = require('moment')

const app = express()
// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())
//解析body unlencoded 的数据
app.use(express.urlencoded({ extended: false }))

app.use(express.static('picture'))

const home_handle = require('./router/home')
const user_handle = require('./router/user')
const cuisionUser_handle = require('./router/cuisionUser')





app.use((req,res,next)=>{
    res.cc = function (err,code = 500){
        res.send({
            code,
            message:err instanceof Error ? err.message : err
        })
    }
    next()
})

// 导入配置文件
const config = require('./config')
// 解析 token 的中间件
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
//只有配置成功了就可以把解析出来的用户信息，挂载到 req.user 属性上(自动生成)
app.use(expressJWT({ secret: config.jwtSecretKey,algorithms:['HS256']}).unless({path:[/^\/api\//]}))



app.use('/api',home_handle)
app.use('/api',user_handle)
app.use('/user',cuisionUser_handle)

// 设置 Multer 存储配置
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      // 指定存储目录
      cb(null, './picture');
    },
    filename: function(req, file, cb) {
      // 指定文件名
      cb(null, Date.now() + '_' + file.originalname);
    }
  });
  
  // 创建 Multer 实例
  const upload = multer({
    storage: storage
  });
  
  // 处理图片上传的 POST 请求
  // app.post('/upload', upload.single('image'), (req, res) => {
  //   // 处理上传成功后的逻辑
  //   res.cc('ok',200);
  // });

  // 处理POST请求并上传多个文件
app.post('/upload/:cuision_id/:user_phone', upload.array('files', 5), function (req, res, next) {
  // 文件上传成功后的处理逻辑，可以在req.files数组中获取上传的文件信息
  const files = req.files;
  // 进行相关的业务处理
  // ...
  var time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  let cuision_id = req.params.cuision_id
  let user_phone = req.params.user_phone
  const sql = 'insert into comment set ?'
  let paths = ''
  for(let file of files){
    let path = file.path+','
    paths = paths.concat(path)
  }
  paths = paths.slice(0,-1)
  db.query(sql, { user_phone: user_phone, cuision_id: cuision_id,content:paths,comment_time:time }, function (err, results) {
    if (err) return res.cc(err)
    // SQL 语句执行成功，但影响行数不为 1
    if (results.affectedRows !== 1) {
        // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
        return res.cc('发表失败！')
    }
})
  

  // 返回响应
  res.cc('ok',200);
});
  
app.get('/api/img', (req, res) => { 
  let cuision_id = req.query.cuision_id
  const sql = `select * from comment where cuision_id = ?`
  db.query(sql,cuision_id,function (err, results) {
    if (err) return res.cc(err)
    // SQL 语句执行成功，但影响行数不为 1
    // if (results.affectedRows !== 1) {
    //     // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
    //     return res.cc('发表失败！')
    // }
    // console.log(results);
    let cominfo = []
    for(let result of results){
      cominfo.push({id:result.id,user_phone:result.user_phone,content:result.content})
    }
     res.cc(cominfo,200 );
  })

  //  res.cc('ok',200)
})

// 全局错误处理中间件，捕获解析JWT失败产生的错误
app.use((err,req,res,next)=>{

    // token解析失败
        if(err.name==='UnauthorizedError'){
            return res.send({
                status:401,
                message:'无效token'
            })
        }
    // 其他错误
        res.send({status:500,message:'未知错误'})
    })


app.listen(4001,function(){
    console.log("express server running at http://127.0.0.1:4001");
})

