let express = require('express');
let mgdb = require('../../utils/mongodb');
let bcrypt = require('bcrypt');
let router = express.Router();

router.post('/',(req,res,next)=>{
    console.log('login');
    let {name,password} = req.body;
    mgdb({
        collectionName: 'user',
        success: ({collection,client}) => {
            collection.find({
                name
            },{
            }).toArray((err,result) => {
                console.log('用户数据',result);
                if(err){
                    res.send({err:1,msg:'集合操作错误'})
                }else{
                    if(result.length>0){
                        let b1 = bcrypt.compareSync(password,result[0].password);
                        // let b1 = true;
                        if(b1){
                            //返回当前数据的时候不需要给前端传输用户名和密码，所以删掉
                            delete result[0].name;
                            delete result[0].password;
                            //种cookie,留session
                            req.session['1909_newsapp'] = result[0]._id;
                            res.send({err:0,msg:'登陆成功',data:result[0]});
                        }else{
                            res.send({err:1,msg:'用户名或密码有误'});
                        }
                    }else{
                        res.send({err:1,msg:'用户名不存在或密码有误'})
                    }
                }
                client.close();
            })
        }
    })
})

module.exports = router;