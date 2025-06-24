require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./src/routes/authRoutes');
app.use(express.json());
app.use(cookieParser());
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected successfully')).catch((e) => console.error(`Error connecting to MongoDB: ${e.message}`));

const corsOptions ={
    origin : process.env.CLIENT_URL || 'http://localhost:3000',
    credentials : true,
}
app.use(cors(corsOptions));

app.use('/auth',authRoutes);

const PORT =5000;
app.listen(PORT, (e)=>{
    if(e){
        console.error(`Error starting server: ${e.message}`);
    }else{
        console.log(`Server is running on port ${PORT}`);
    }
})