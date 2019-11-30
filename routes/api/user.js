let express = require('express');
let mgdb = require('../../utils/mongodb');
let router = express.Router();

router.get('/',(req,res,next)=>{
    console.log('user');
    //取cookie的id
    if(req.session['1909_newsapp']){
        console.log('取到cookie');
        mgdb({
            collectionName: 'user',
            success: ({ collection, client, ObjectID }) => {
              collection.find({
                _id: ObjectID(req.session['1909_newsapp'])
              }, {
                }).toArray((err, result) => {
                  if (err) {
                    res.send({ err: 1, msg: 'home集合操作错误'})
                  } else {
                    if (result.length > 0) {
                      delete result[0].username
                      delete result[0].password
                      res.send({ err: 0,msg:'直接登陆',data:result[0]})
                    } else {
                      res.send({ err: 1, msg: '用户名不存在或者密码有误'})
                    }
                  }
                  client.close()
                })
            }
          })
        // res.send({error:0,msg:'已登录'});
    }else{
        res.send({error:1,msg:'未登录'});
    }
})

module.exports = router;