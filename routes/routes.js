const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../model/user");
const fs = require('fs');

// IMAGE upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) { 
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

router.post("/add", upload, async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.path,
  });

  try {
    await user.save();
    req.session.message = {
      type: 'success',
      message: 'User Added Successfully',
    };
    res.redirect('/');
  } catch (err) {
    res.json({ message: err.message, type: 'danger' });
  }
});

// Get all Users Route
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Use await instead of exec with a callback
    res.render('index', {
      title: 'Home Page',
      users: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});



router.get('/edit/:id', async (req, res) => {
  try {
      const user = await User.findById(req.params.id); // Use your actual model name
      if (!user) {
          return res.status(404).send('User not found');
      }
      res.render('edit_user', { user });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


// UPDATE USER ROUTE

router.post('/update/:id', upload, async (req, res) => {
  let id = req.params.id;
  let new_image = '';

  try {
    // If a new file is uploaded
    if (req.file) {
      new_image = req.file.filename;

      // Attempt to delete the old image file
      try {
        const oldImagePath = path.join(__dirname, 'uploads', req.body.old_image);
        fs.unlinkSync(oldImagePath);
      } catch (err) {
        console.log('Error deleting old image:', err);
      }
    } else {
      // Use the old image if no new file is uploaded
      new_image = req.body.old_image;
    }

    // Update the user in the database
    const result = await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    }, { new: true }); // Return the updated document

    req.session.message = {
      type: 'success',
      message: 'User Updated Successfully'
    };
    res.redirect('/');
  } catch (err) {
    console.error('Error updating user:', err);
    req.session.message = {
      type: 'danger',
      message: 'Error updating user: ' + err.message
    };
    res.redirect('/edit/' + id); // Redirect back to edit page on error
  }
});


// DELET USER ROUTE SECTION
router.get('/delete/:id', async (req, res) => {
  let id = req.params.id.trim(); // Remove any extra whitespace

  try {
    // Find the user by ID
    const result = await User.findByIdAndDelete(id);

    // Check if the user exists and has an associated image
    if (result && result.image) {
      // Construct the full image path
      const imagePath = path.join(__dirname, 'uploads', result.image);

      // Attempt to delete the image file
      try {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image: ${imagePath}`);
      } catch (err) {
        console.error(`Failed to delete image: ${err.message}`);
      }
    }

    req.session.message = {
      type: 'info',
      message: 'User Deleted Successfully'
    };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: 'danger',
      message: 'Error deleting user: ' + err.message
    };
    res.redirect('/');
  }
});


module.exports = router;
