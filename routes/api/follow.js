let express = require('express');

let router = express.Router();
let mgdb = require('../../utils/mongodb');

//访问列表接口
router.get('/',(req,res,next)=>{
    console.log('follow');
    //拿到携带参数
    let _id = req.query._id;
    if(_id){
        console.log('详情');
        getDetail(req,res,next,_id);
    }else{
        console.log('列表');
        let {_page,_limit,_sort,q} = req.query;
        q = q ? {_id:eval('/'+q+"/")} : {}
    
    //兜库
    mgdb({
        collectionName:'news',
        success:({collection,client})=>{
            collection.find(q,
                {
                limit:_limit,
                skip:_page*_limit,
                sort:{[_sort]:-1}
            }).toArray((err,result)=>{
                console.log('err',err);
                console.log('result',result);
                if(err){
                    res.send({err:1,msg:'follow集合操作错误'})
                }else{
                    res.send({err:0,data:result});
                }
                client.close();
            })
        }
    })
}
    //返回给浏览器
})
//访问详情页接口
router.get('/:id',(req,res,next)=>{
    console.log('follow');
    //拿到携带参数
    getDetail(req,res,next,req.params.id);
    //兜库
    //返回给浏览器
})


let getDetail = (req,res,next,_id)=>{
    mgdb({
        collectionName:'news',
        success:({collection,client,ObjectID})=>{
            collection.find({
                _id:ObjectID(_id)
            },{}).toArray((err,result)=>{
                console.log('err',err);
                console.log('result',result);
                if(err){
                    res.send({err:1,msg:'follow集合操作错误'})
                }else{
                    if(result.length>0){
                        res.send({err:0,data:result});
                    }else{
                        res.send({err:1,msg:'错误的ID或者数据不存在'});
                    }
                }
                client.close();
            })
        }
    })
}

module.exports = router;