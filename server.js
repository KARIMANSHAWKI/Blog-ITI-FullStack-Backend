const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();

// ***************** Bring Routes *****************
// const BlogRoutes = require('./routes/blog')
const authRoutes = require('./routes/auth.route');



// ***************** app ******************** 
const app = express();


// ***************** middelwares ***************** 
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(cookieParser());

// ***************** cors ***************** 
if(process.env.NODE_ENV === 'development'){
    app.use(cors({origin : `${process.env.CLIENT_URL}`}));
}
app.use(cors());

// ***************** DB Connection ***************** 
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true})
    .then(()=>console.log('DB Connected'));


    
// ***************** using routes *****************
app.use('/api',authRoutes);




// ***************** port ***************** 
const port = process.env.PORT || 3300;
app.listen(port,()=>{
    console.log(`Server Listen On Port ${port} `)
})