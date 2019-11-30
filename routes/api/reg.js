let express = require('express');
let fs = require('fs');
let router = express.Router();
let pathLib = require('path');
let mgdb = require('../../utils/mongodb');
let bcrypt = require('bcrypt');

router.post('/',(req,res,next)=>{
    console.log('reg');
    let {name,password,nikename} = req.body;
    if(!name || !password){
        res.send({err:1,msg:'用户名密码不能为空'});
        return;
    }
    console.log(req.body)
    let time = Date.now();
    nikename = nikename || '系统给的';
    let follow = 0;
    let fans = 0;
    let icon = '';
    password = bcrypt.hashSync(password,10);
    //icon 借助multer -> icon 使用用户传递的图片或者系统指定默认头像
    if(req.files && req.files.length > 0){
        //改名 整合路径 储存图片
        fs.renameSync(
            req.files[0].path,
            req.files[0].path + pathLib.parse(req.files[0].originalname).ext
            )
            icon = '/upload/user/' + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext;
        }else{
            icon = '/upload/b1.jpg';
        }
        // console.log(name,password,nikename,follow,fans,time,icon);
    mgdb({
        collectionName: 'user',
        success: ({collection,client}) => {
            collection.find({
                name
            },{
            }).toArray((err,result) => {
                if(!err){
                    if(result.length>0){
                        res.send({err:0,msg:'此用户名已经存在'});
                        if(icon.indexOf('b1') === -1){
                            //如果没有正常注册成功则删除上传的图片      unlinkSync删除文件
                            console.log(icon);
                            fs.unlinkSync('./public'+icon);
                        }
                        client.close();
                    }else{
                        //没有错误的话将数据插入到数据库中
                        collection.insertOne({
                            name,password,nikename,follow,fans,time,icon
                        },(err,result)=>{
                            if(!err){
                                delete result.ops[0].password;
                                res.send({err:0,msg:'注册成功',data:result.ops[0]});
                            }else{
                                res.send({err:1,msg:'user集合操作失败'})
                                client.close()
                            }
                            
                        })
                    }
                }else{
                    res.send({err:1,msg:'user集合操作失败'})
                    client.close()
                }
            })
        }
    })
    console.log(name,password,nikename,follow,fans,time,icon);
})

module.exports = router;