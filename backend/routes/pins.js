const router = require("express").Router()
const Pin = require("../models/Pin")

//创建一个标记点
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body)
  try {
    const savedPin = await newPin.save()
    res.status(200).json(savedPin)
  } catch (err) {
    res.status(500).json(err)
  }
})

//获取所有标记点
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find()
    res.status(200).json(pins)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router