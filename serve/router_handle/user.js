// 导入数据库操作模块：
const db = require('../db/index')
// 在当前项目中，使用 bcryptjs 对用户密码进行加密
const bcrypt = require('bcryptjs')

//导入生成token包
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.regUser = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // 判断数据是否合法
    if (!userinfo.user_phone || !userinfo.user_pwd) {
        return res.cc('号码或密码不能为空!')
    }

    const sql = `select * from user where user_phone=?`
    db.query(sql, [userinfo.user_phone], function (err, results) {

        // 执行 SQL 语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        // 用户名被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
            return res.cc('号码已存在，请更换其他号码！')
        }
        // TODO: 用户名可用，继续后续流程...
        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        // 在注册用户的处理函数中，确认用户名可用之后，调用 bcrypt.hashSync(明文密码, 随机盐的长度) 方法，对用户的密码进行加密处理
        userinfo.user_pwd = bcrypt.hashSync(userinfo.user_pwd, 10)

        const sql = 'insert into user set ?'
        db.query(sql, { user_phone: userinfo.user_phone, user_pwd: userinfo.user_pwd }, function (err, results) {
            // 执行 SQL 语句失败
            // if (err) return res.send({ status: 1, message: err.message })
            if (err) return res.cc(err)
            // SQL 语句执行成功，但影响行数不为 1
            if (results.affectedRows !== 1) {
                // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
                return res.cc('注册用户失败，请稍后再试！')
            }
            // 注册成功
            //  res.send({ status: 0, message: '注册成功！' })
            res.cc('注册成功！', 200)
        })

    })


}
exports.login = (req, res) => {
    const userinfo = req.body
    const sql = `select * from user where user_phone=?`
    db.query(sql, userinfo.user_phone, function (err, results) {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc('登录失败！')
        // TODO：判断用户输入的登录密码是否和数据库中的密码一致
        // 拿着用户输入的密码,和数据库中存储的密码进行对比
        //         核心实现思路：调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致

        // 返回值是布尔值（true 一致、false 不一致）
        const compareResult = bcrypt.compareSync(userinfo.user_pwd, results[0].user_pwd)
        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult) {
            return res.cc('登录失败！')
        }

        //         核心注意点：在生成 Token 字符串的时候，一定要剔除 密码 和 头像 的值

        // 通过 ES6 的高级语法，快速剔除 密码 和 头像 的值：
        const user = {user_phone:userinfo.user_phone}
        //对用户信息进行加密，生成token
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})
        //将token响应给客户端
        res.cc('Bearer ' + tokenStr,200)
    })

}
