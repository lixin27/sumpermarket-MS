//账号路由管理模块
const express = require('express');
const router = express.Router();

// 引入连接数据库模块
const connection = require('./connect')

// 统一设置响应头 解决跨域问题
router.all('*', (req, res, next) => {
    // 设置响应头 解决跨域(目前最主流的方式)
    res.header('Access-Control-Allow-Origin', '*');
    next();
})
/*
添加账号的路由 /accountadd
*/
router.post('/accountadd', (req, res) => {
    // 接收前端发送的添加账号的数据
    let { username, password, usergroup } = req.body;
    console.log('接收到前端发送过来的数据：', username, password, usergroup)

    //  把数据存入数据库
    // 构造添加账号的sql语句
    const sqlStr = `insert into account(username, password, usergroup) values('${username}', '${password}', '${usergroup}')`;
    // 执行sql语句
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        // 判断数据库中受影响的行数
        if (data.affectedRows > 0) {
            // 添加数据到数据库成功，给前端返回成功的数据对象
            res.send({ "error_code": 0, "reason": "添加账号成功" });
        } else {
            //失败，返回给前端失败的数据对象
            res.send({ "error_code": 1, "reason": "添加账号失败" })
        }
    })
})

/*
显示账号列表的路由 /accountlist
*/
router.get('/accountlist', (req, res) => {
    // 构造查询所有账号数据的sql语句，并按照时间排序
    const sqlStr = 'select * from account order by ctime desc';
    // 执行sql语句
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        // 把查询到的数据响应给前端
        res.send(data)
    })
})

/*
按照分页显示列表的路由 /accountlistbypage
*/
router.get('/accountlistbypage', (req, res) => {
    // 接收前端发来的页码和每页条数的数据
    let {pageSize, currentPage} = req.query;
    // 默认值
    pageSize = pageSize ? pageSize : 3;
    currentPage = currentPage ? currentPage : 1
    // 构造查询所有数据的sql语句
    let sqlStr = `select * from account order by ctime desc`;
    // 执行sql语句
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        let total = data.length;
        console.log('数据总数：', total)
        //跳过条数
        let n = (currentPage - 1) * pageSize;
        // 实际需要查询的当前页对应数据的sql语句
        sqlStr += ` limit ${n}, ${pageSize}`;
        // 执行sql语句
        connection.query(sqlStr, (err, data) => {
            if (err) throw err;
            // 发送最终需要显示的数据给前端
            res.send({total,data})
           
        })
    })
})




/*
删除账号的路由 /accountdel
*/
router.get('/accountdel', (req, res) => {
    // 接收id
    let { id } = req.query;
    // 根据id 执行删除
    // 构造删除数据的sql语句
    const sqlStr = `delete from account where id = ${id}`;
    // 执行sql语句
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        //  console.log(data)
        // 根据删除结果判断返回的数据
        if (data.affectedRows > 0) {
            // 受影响的数据行数大于0 ，则删除成功，就返回成功的数据对象给前端
            res.send({ "error_code": 0, "reason": "删除账号成功" });
        } else { // 删除失败，就返回成功的数据对象给前端
            res.send({ "error_code": 1, "reason": "删除账号失败" })
        }
    })
})
/*
修改账号的路由  /accountedit
*/
router.get('/accountedit', (req, res) => {
    // 接收前端发来的id
    let { id } = req.query;
    // 构造查询对应id账号数据sql语句
    const sqlStr = `select * from account where id = ${id}`;
    // 执行sql语句
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        // 把查询到的数据返回给前端（是一个数组）
        res.send(data)
    })
})
/*
接收修改后的数据，并根据id在数据库修改对应账号的数据 的路由  /accounteditsave
*/
router.post('/accounteditsave', (req, res) => {
    // 接收新数据和原来的id
    let { username, usergroup, editId } = req.body;
    // 构造修改保存数据的sql语句
    const sqlStr = `update account set username='${username}',usergroup='${usergroup}' where id=${editId}`;

    // 执行sql语句
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        // 受影响行数大于0 就是修改成功
        if (data.affectedRows > 0) {
            // 返回成功的数据对象给前端
            res.send({ "error_code": 0, "reason": "修改账号成功" });
        } else {
            // 返回失败的数据对象给前端
            res.send({ "error_code": 1, "reason": "修改账号失败" });
        }
    })
})
/*
批量删除的路由 /batchdelete
*/
router.get('/batchdelete', (req, res) => {
    // 接收前端发来的id
    let { selectedId } = req.query;
    // console.log('接到前端发来的id数组',selectedId)
    // 构造批量删除的sql语句
    const sqlStr = `delete from account where id in (${selectedId})`;
    // 执行sql语句
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        // 判断执行结果，反馈提示信息
        if (data.affectedRows > 0) {
            // 删除成功
            res.send({ "error_code": 0, "reason": "批量删除成功" })
        } else {
            res.send({ "error_code": 1, "reason": "批量删除失败" })
        }
    })
})

/*
修改密码的检查旧密码正确性的路由 /checkOldPwd
*/
router.get('/checkOldPwd',(req,res)=>{
    // 接收前端发来的用户输入的旧密码和当前账户名
    let{oldPwd,username}=req.query;
    // 构造查询密码和账户名一致的账户数据的sql语句
    const sqlStr=`select * from account where username='${username}' and password='${oldPwd}'`;
    // 执行sql语句
    connection.query(sqlStr,(err,data)=>{
        if (err) throw err;
        // 判断密码是否正确（是否有查询到账户数据）
        if(data.length){
            // 发送正确提示
            res.send({"error_code":0,"reason":"旧密码正确！"});
        }else{
            // 发送错误提示
            res.send({"error_code":1,"reason":"旧密码错误！"});
        }
    })

})

/*
保存修改后的账户密码的路由， /savenewpwd
*/ 
router.post('/savenewpwd',(req,res)=>{
    // 接收前端发来的用户名，新密码，旧密码
    let {username,oldPassword,newPassword}=req.body;
    console.log('新密码',newPassword)
    // 构造sql语句修改对应账户的密码
    const sqlStr=`update account set password='${newPassword}' where username='${username}' and password='${oldPassword}'`;
    // 执行sql语句
    connection.query(sqlStr,(err,data)=>{
        // 判断修改是否成功
        if(data.affectedRows>0){
            // 发送修改成功信息
            res.send({"error_code":0,"reason":"密码修改成功，请重新登录"});
        }else{
            // 发送失败信息
            res.send({"error_code":1,"reason":"密码修改失败！"});
        }
    })
})


// 暴露路由
module.exports = router;