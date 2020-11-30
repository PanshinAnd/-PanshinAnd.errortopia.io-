const {Router} = require('express')
const bcrypt = require('bcryptjs') //хэширование и сравнивание паролей
const User = require('.../models/User')
const router = Router()

// /api/auth/register
router.post('/register', async (req, res) =>{
  try{

    const {email, password} = req.body

    const candidate = await.User.fingOne({email})

    if (candidate){
      return res.status(400).json({massage: 'Пользователь с таким email уже существует'})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User ({email, password: hashedPassword})

    await user.save()

    res.status(201).json({message: 'Пользователь создан'})

  } catch (e){
    res.status(500).jscon({message: 'Что-то пошло не так, попробуйте снова'})
  }
})

// /api/auth/login
router.post('/login', async (req, res) =>{

})

module.exports = router
