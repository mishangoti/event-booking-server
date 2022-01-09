const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const user = require('../models/user');
const jwt = require('jsonwebtoken');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const db = "mongodb+srv://admin:admin@cluster0.e4ykm.mongodb.net/mishan-learning?retryWrites=true&w=majority";
// mongodb+srv://admin:<password>@cluster0.e4ykm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect(db, err => {
    if(err) {
        console.log(err);
    } else {
        console.log('mongodb connected');
    }
})

function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretkey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject
  next()
}
// routes
router.get('/', (req, res) => {
    res.send('From API route');
});
router.post('/register', (req, res) => {
    let userData = req.body;
    let user = new User(userData);
    user.save((error, registeredUser) => {
        if(error) {
            console.log(error);
        } else {
            let payload = { subject: registeredUser._id }
            let token = jwt.sign(payload, 'secretkey')
            res.status(200).send({token})
        }
    });
})
router.post('/login', (req, res) => {
    let userData = req.body;
    User.findOne({email: userData.email}, (error, user) => {
        if(error) {
            console.log(error);
        } else {
            if(!user) {
                res.status(401).send('Invalid email');
            } else {
                if (user.password !== userData.password) {
                res.status(401).send('Invalid password');
                } else {
                    let payload = { subject: user._id }
                    let token = jwt.sign(payload, 'secretkey')
                    res.status(200).send({token});
                }
            }
        }
    })
})
router.get('/events', (req, res) => {
    let events = [
        {
            "_id": "1",
            "name": "Auto Expo",
            "description": "lorem ipsom",
            "date": "21611815641"
        },
        {
            "_id": "2",
            "name": "Arms Expo",
            "description": "lorem ipsom",
            "date": "21611815641"
        },
        {
            "_id": "3",
            "name": "Defence Expo",
            "description": "lorem ipsom",
            "date": "21611815641"
        },
        {
            "_id": "4",
            "name": "Missile Expo",
            "description": "lorem ipsom",
            "date": "21611815641"
        },
        {
            "_id": "5",
            "name": "CNC Expo",
            "description": "lorem ipsom",
            "date": "21611815641"
        }
    ]
    res.json(events);
})

router.get('/special', verifyToken, (req, res) => {
    let specialEvents = [
        {
            "_id": "1",
            "name": "Premium Auto Expo",
            "description": "lorem ipsom",
            "date": "21611815641"
        },
        {
            "_id": "2",
            "name": "Premium Arms Expo",
            "description": "lorem ipsom",
            "date": "21611815641"
        },
        {
            "_id": "3",
            "name": "Premium Defence Expo",
            "description": "lorem ipsom",
            "date": "21611815641"
        },
        {
            "_id": "4",
            "name": "Premium Missile Expo",
            "description": "lorem ipsom",
            "date": "21611815641"
        },
        {
            "_id": "5",
            "name": "Premium CNC Expo",
            "description": "lorem ipsom",
            "date": "21611815641"
        }
    ]
    res.json(specialEvents);
})
module.exports = router;