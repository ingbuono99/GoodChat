const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//Ricorda che nell'url c'è già il /users prima 
// creating user
router.post('/', async(req, res)=> {
  try {
    const {name, email, password, picture} = req.body;
    console.log(req.body);
    const user = await User.create({name, email, password, picture});
    res.status(201).json(user);
  } catch (e) {
    let msg;
    if(e.code == 11000){
      msg = "User already exists"
    } else {
      msg = e.message;
    }
    console.log(e);
    res.status(400).json(msg)
  }
})

// login user

router.post('/login', async(req, res)=> {
  try {
    const {email, password} = req.body;
    const user = await User.findByCredentials(email, password); //metodo del file User.js
    user.status = 'online';
    await user.save();
    res.status(200).json(user);
  } catch (e) {
      res.status(400).json(e.message)
  }
})



router.post('/update', async(req, res)=> {
  try{
  const {name, email, password, picture} = req.body;
   const user = await User.findByEmail(email);
   if(!user) throw new Error('Errore, fare logout');

    user.password = password; //l'hashing lo fa in automatico una volta fatto user.save(), perchè invoca UserSchema.pre('save', function(next){...}
    user.picture = picture;
    user.name = name;
    await user.save();
    
    res.status(200).json(user);
  } catch (e) {
      res.status(400).json(e.message)
  
   }
  })  

  router.post('/addfriend', async(req, res)=> {
    try{
     const {user , member} = req.body;
      const amico = await User.updateOne({name: user.name}, { $push: { friends: member.name}});
      res.status(200).json(amico);   
    } 
    catch (e) {
      res.status(400).json(e.message)
  
   }
  })  

module.exports = router