const db = require('../db/index')


exports.regRegion = (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');     

    const sql = `select id,region_name from region`
    db.query(sql,function(err,results){
        if(err){
            return res.cc(err)
        }
        return res.cc(results,200)
    })

}

exports.regClassify = (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');    

    const sql = `select id,classify_name from classify`
    db.query(sql,function(err,results){
        if(err){
            return res.cc(err)
        }
        return res.cc(results,200)
    })

}

exports.regCuision = (req,res)=>{
    // res.setHeader('Access-Control-Allow-Origin','*');   
    const {region,classify} = req.query
    if(region==1 && classify==1){
        const sql = `select * from food`
        db.query(sql,function(err,results){
            if(err){
                return res.cc(err)
            }
            return res.cc(results,200)
        })
    }
    else if(region == 1){
        const sql = `select * from food where food_classify = ?`
        db.query(sql,classify,function(err,results){
            if(err){
                return res.cc(err)
            }
            return res.cc(results,200)
        })
    }
    else if(classify == 1){
        const sql = `select * from food where food_belong_region = ?`
        db.query(sql,region,function(err,results){
            if(err){
                return res.cc(err)
            }
            return res.cc(results,200)
        })
    }
    else{
        const sql = `select * from food where food_belong_region = ? and food_classify = ?`
        db.query(sql,[region,classify],function(err,results){
            if(err){
                return res.cc(err)
            }
            return res.cc(results,200)
        })
    }



    
    
}

exports.regDetail = (req,res)=>{
    let id = req.query.id 
    const sql = `select * from food where id = ?`
    db.query(sql,id,function(err,results){
        if(err){
            return res.cc(err)
        }
        return res.cc(results,200)
    })
}