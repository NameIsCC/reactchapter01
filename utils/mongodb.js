let mongodb = require('mongodb');
let mongoCt = mongodb.MongoClient;
let ObjectID = mongodb.ObjectID;
//结构，函数的参数可以直接用对象
// function show({a,b,c}){
//     a+b+c
// }
// show({a:1,b:2,c:3})

module.exports = ({ url, dbName, collectionName, success, error }) => {
    url = url || 'mongodb://127.0.0.1:27017';
    dbName = dbName || 'benzi';

    mongoCt.connect(url,{ useUnifiedTopology: true },(err, client) => {
        if (err){
            error && error('连接失败');
        }else{
            let db = client.db(dbName);//连接库
            let collection = db.collection(collectionName);//连接集合
            success && success({collection,client,ObjectID})//key 和 value 的值一致可以简写

            // client.close();//关闭数据库
        }
    })
}
