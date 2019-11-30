module.exports = (req,res,next)=>{
    //如果用户传递了_page,_limit,q,_sort参数的值那么就使用用户传递的值，如果没有的话就使用默认的值
    //因为不知道用户是使用地址栏传输数据还是使用非地址栏数据传输，所以需要给地址栏和非地址栏都做判断

    //地址栏
    req.query._page = req.query._page ? req.query._page-1 : require('../../config/params')._page - 0; //减零是为了进行隐式转换成number类型，因为经过地址栏传递过后会变成字符串
    req.query._limit = req.query._limit ? req.query._limit-0 : require('../../config/params')._limit - 0;
    req.query.q = req.query.q ? req.query.q : require('../../config/params').q;
    req.query._sort = req.query._sort ? req.query._sort : require('../../config/params')._sort;

    //非地址栏

    req.body._page = req.body._page ? req.body._page-1 : require('../../config/params')._page - 0; //减零是为了进行隐式转换成number类型，因为经过地址栏传递过后会变成字符串
    req.body._limit = req.body._limit ? req.body._limit-0 : require('../../config/params')._limit - 0;
    req.body.q = req.body.q ? req.body.q : require('../../config/params').q;
    req.body._sort = req.body._sort ? req.body._sort : require('../../config/params')._sort;

    next();
}