const { response } = require('express');
const jwt = require('jsonwebtoken');
const secret = "1d833b1c-a68b-4be3-a4c0-6a23a011c5d5";
const authController={
    login:(request,response)=>{
        const {email,password} = request.body;

        if(email === "admin@gmail.com" && password==="admin"){
            const userDetails ={
                email:"admin@gmail.com",
                name:'Admin'
            }
            const token = jwt.sign(userDetails,secret,{expiresIn:'1h'});

            response.cookie('jwtToken',token,{
                httpOnly:true,
                secure:true,
                domain:'localhost',
                path:'/'
            });
            response.json({message:'Login successful',userDetails: userDetails});
        }else{
            response.status(401).json({message:'Invalid email or password'});
        }
    },
    logout:(request,response)=>{
        response.clearCookie('jwtToken');
        response.json({message:'Logout successful'});
    },
    isUserLoggedIn:(request,response)=>{
        const token = request.cookies.jwtToken;
        if(!token){
            return response.status(401).json({message:'User not logged in'});
        }
        jwt.verify(token,secret,(e,userDetails)=>{
            if(e){
                return response.status(401).json({message:'Unauthorized access'});
            }else{
                return response.json({
                    message:'User is logged in',
                    userDetails: userDetails
                });
            }
        })
    }
};

module.exports = authController;