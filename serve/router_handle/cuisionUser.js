const db = require('../db/index')

exports.regCuisionUser = (req,res)=>{
    let user_id = req.params.user_id 
    const sql = `select * from cuision_user where user_id = ?`
    db.query(sql,user_id,function(err,results){
        if(err){
            return res.cc(err)
        }
        return res.cc(results,200)
    })


}
exports.regAddCuisionUser = (req,res)=>{
    let {user_id,cuision_id} = req.params
    const pdsql = `select * from cuision_user where user_id = ? and cuision_id = ?`
    db.query(pdsql,[user_id,cuision_id],function(err,results){
        if(results.length != 0){
            return res.cc('已存在')
        }else{
            const addsql = `update food set food_recived_num = food_recived_num + 1 where id = ?`
            db.query(addsql,cuision_id,function(err,results){
                if(err){
                    return res.cc(err)
                }else{
                    const sql = `insert into cuision_user set ?`
                    db.query(sql,{cuision_id:cuision_id,user_id:user_id},function(err,results){
                        if(err){
                            return res.cc(err)
                        }
                        return res.cc('ok',200)
                   
                    })
                }
            })

        }
    
    })


}
exports.userinfo = (req,res) => {
    // let token = req.headers.authorization
    // console.log(req.user);
    let user_phone = req.user.user_phone
    const sql = `select id from user where user_phone=?`
    db.query(sql,user_phone,function(err,results){
        if(err){
            return res.cc(err)
        }
        let user_id = results[0].id
        return res.cc({user_phone,user_id},200)
   
    })
    
}

exports.remarks = (req,res) => {
    let user_id = req.body.user_id 
    let cuision_id = req.body.cuision_id
    let remark = req.body.remark
    const sql = `update cuision_user set remarks = ? where user_id = ? and cuision_id = ?`
    db.query(sql,[remark,user_id,cuision_id],function(err,results){
        if(err){
            return res.cc(err)
        }
        return res.cc('ok',200)
    })
}