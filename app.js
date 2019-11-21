const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressMessages = require('express-messages');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/node-rest-api', {useNewUrlParser : true});

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const contactAppRoutes = require('./contactApp/routes/contact');
const userRoutes = require('./api/routes/user');
const contactAppUserRoutes = require('./contactApp/routes/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')))


app.use(cookieParser());

//Session
app.use(session({
    secret : 'keyboard cat',
    cookie : { maxAge : 60000},
    resave : true,
    saveUninitialized : true,
    
}))

//flash
app.use(flash());

//express messages
app.use((req,res,next)=>{
    res.locals.messages = expressMessages(req,res);
    next();
});

//Passport

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//setting user global variable for all get and post routes
app.get('*', (req,res,next) => {
    res.locals.user = req.user || null
    next()
})

app.post('*', (req,res,next) => {
    res.locals.user = req.user || null
    next()
})


//Routes
//app.get()
app.use('/api/products', productRoutes);
app.use('/user', userRoutes);
app.use('/contactApp', contactAppRoutes);
app.use('/contactApp/user', contactAppUserRoutes);


//Error Handling
app.use((req,res,next)=>{
    let error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message ,
            url : req.url
        }
    });
})



app.listen(3000);
