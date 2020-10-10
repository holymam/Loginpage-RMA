const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/express-auth',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
//定义一个用户模型
const UserSchema = new mongoose.Schema({
    username: { type:String,unique:true},//用户名唯一值
    password: { 
        type:String,
        set(val){//存入数据库的时候就进行加密 需要安装npm i bcrypt
            return require('bcrypt').hashSync(val,10)
        }
    },
})
const User =mongoose.model('User',UserSchema)
module.exports = { User }

//User.db.dropCollection('user1')//删掉之前的user
//