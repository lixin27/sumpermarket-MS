const express = require('express');
const router = express.Router();

// 引入连接数据模块
const connection = require('./connect')

// 引入jwt
const jwt = require('jsonwebtoken');
// 定义秘钥
const secretKey = 'itsource';


// 统一设置响应头 解决跨域问题
router.all('*', (req, res, next) => {
  // 设置响应头 解决跨域(目前最主流的方式)
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

router.post('/logincheck', (req, res)=> {
  // 接收前端传来的数据
  let {username,password}=req.body;
  // 构造查询账户数据的sql语句
  const sqlStr=`select * from account where username='${username}' and password='${password}'`;
  // 执行sql语句
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    // 判断是否账号是否存在
    // console.log(data);//data是一个数组
    if(!data.length){//不存在
      res.send({'error_code': 1, 'reason': '请检查用户名或密码!'})
    }else{//存在
      // 验证用户的登录状态（token）
      // 当前登录的账号数据
      const obj=data[0];//数据库的一个其他类型的对象，需要转换为标准的对象
      const objStr=JSON.stringify(obj);//转为字符串
      const userInfo=JSON.parse(objStr);//转为一个全新的对象
      // 生成token
      const token=jwt.sign(userInfo,secretKey,{expiresIn:60*60})
      // console.log(token)
      res.send({'error_code': 0, 'reason': '欢迎您!登录成功！',token,'username':userInfo.username})
    }
  })
  
});


module.exports = router;
