const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
app.use(express.json());
app.use(cookieParser());

const corsOptions ={
    origin : 'http://localhost:3000',
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