// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const session = require('express-session')

// dotenv.config();
// const app = express();


// app.use(express.urlencoded({extended:false}));
// app.use(express.json());
// app.use(session({
//     secret: "my secret key",
//     saveUnitialized:true ,
//     resave: false,
// })
// );

// app.use((req,res,next) =>{
//     res.locals.message = req.session.message;
//     delete req.session.message;
//     next();
// })

// app.set('view engine', "ejs");


// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

// const PORT = process.env.PORT || 5000;  
// const MONGOURl = process.env.MONGO_URL; 

// mongoose.connect(MONGOURl, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("DATABASE CONNECTED SUCCESSFULLY");
//     })
//     .catch((error) => {
//         console.error("DATABASE CONNECTION ERROR:", error);
//     });


//     // app.get("/",(req,res)=>{
//     //     res.send("hello Worlfd")
//     // })
//     // reoute prefix

//     app.use("",require('./routes/routes'))

//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });


const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

//Setting Template Engine .

app.set('view engine', "ejs");

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;  
const MONGOURl = process.env.MONGO_URL; 

mongoose.connect(MONGOURl)
    .then(() => {
        console.log("DATABASE CONNECTED SUCCESSFULLY");
    })
    .catch((error) => {
        console.error("DATABASE CONNECTION ERROR:", error);
    });

// Route prefix
app.use("", require('./routes/routes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});