const express = require('express')
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const config = require('./config/key')

const { User } = require('./models/User')


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

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


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))