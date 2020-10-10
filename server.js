//token相关
const jwt = require('jsonwebtoken')
const SECRET = 'asdfasdfasdfasdf'//正常应该写在一个特殊文件中
//引入定义好的User
const { User } = require('./models')
//引入express
const express = require('express')
const app = express()
//处理json
app.use(express.json())
//监听3001
app.listen(3001,() => {
    console.log('http://localhost:3001')
})
//定义路径/
 app.get('/', async(req,res) => {
     res.send('ok')
 })
//定义路径/api/register
 app.post('/api/register', async(req,res) => {
    const user = await User.create({
        username:req.body.username,
        password:req.body.password,
    })
    res.send(user)
    //console.log(req.body)
})
//定义路径/api/login
app.post('/api/login', async(req,res) => {
    const user = await User.findOne({
        username:req.body.username,
        //password:req.body.password,
    })
    if(!user){
        return res.status(422).send({
            message: '用户名不存在'
        })
    }
    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if(!isPasswordValid){
        return res.status(422).send({
            message: '密码无效'
        })
    }
    //生成token jwt是生产token的一个函数，然后里面引入id和一个文本生成一个token
    const token = jwt.sign(
        {
        id: String(user._id),
        },
        SECRET,
    )

    res.send({
        user,
        token: token
        //生成token npm i jsonwebtoken
    })
    //console.log(req.body)
})
//定义查询页面/api/register(密码加密)被淘汰的加密，以及散列（这里可以用其他方式比如nap）
app.get('/api/users', async(req,res) => {
    const users = await User.find()
    res.send(users)
})
//中间件用于频繁调用的场景比如下面这段关于从token中获取到用户id后返回
const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop()
    const { id } = jwt.verify(raw,SECRET)
    req.user = await User.findById(id)
    next()
}

app.get('/api/profile', auth,async(req,res) => {
    //console.log(String(req.headers.authorization).split(' ').pop())
    /* const raw = String(req.headers.authorization).split(' ').pop() */ //将请求头进行
    //const tokenData = jwt.verify(raw, SECRET)
   /*  const { id } = jwt.verify(raw,SECRET) *///配合文本解密得到提取出id
    //console.log(tokenData)
    //return res.send('ok')
   /*  const user = await User.findById(id) */

    res.send(req.user)
})

