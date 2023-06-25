const User = require("../models/User")
const router = require("express").Router()
const bcrypt = require("bcrypt")

//注册
router.post("/register", async (req, res) => {
  try {
    //生成密码
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //创建新用户
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    })

    //保存用户
    const user = await newUser.save()
    res.status(200).json(user._id)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

//登录
router.post("/login", async (req, res) => {
  try {
    //鉴定用户
    const user = await User.findOne({ username: req.body.username })
    !user && res.status(400).json("Wrong username or password")

    //验证密码
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    )
    !validPassword && res.status(400).json("Wrong username or password")

    //响应
    res.status(200).json({ _id: user._id, username: user.username })
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router