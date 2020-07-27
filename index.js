const express = require('express')
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key')

const { User } = require('./models/User')


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(cookieParser())

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hello World!'))
app.post('/register', (req, res) => {
    // 회원가입
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user)=> {
        if(!user) {
            return res.json({
                loginSuccess: false,
                massage: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        user.comparePassword(req.body.password, (err, isMatch)=> {
            if(!isMatch) {
                return res.json({ loginSuccess: false, massage: "비밀2번호가 틀렸습니다." });
            }

            user.generateToken((err, user)=>{
                if(err) return res.status(400).send(err);
                
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))