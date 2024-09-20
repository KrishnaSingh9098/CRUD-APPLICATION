const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../model/user");

//IMAGE upload
var storgae = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  fileName: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storgae: storgae,
}).single("image");

router.post("/add", upload, (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.path,
  });
  user.save((err)=>{
    if(err){
        res.json({message : err.msg, type: 'danger'})
    }else{
        req.session.message = {
            type: 'success',
            message : 'User Added Successsfully'
        };
        res.redirect('/')
    }
  })
});

router.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});

module.exports = router;
