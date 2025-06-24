const bcrypt = require('bcryptjs');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const secret = "1d833b1c-a68b-4be3-a4c0-6a23a011c5d5";
const Users = require('../model/Users'); 
const authController={
    login: async(request,response)=>{
        try{
            const {email,password} = request.body;
            const data = await Users.findOne({email:email});
            if(!data){
                return response.status(401).json({message:'Invalid Credentials'});
            }
            const isMatch = await bcrypt.compare(password, data.password);
            if(!isMatch){
                return response.status(401).json({message:'Invalid Credentials'});
            }
            const userDetails = {
                id: data._id,
                email: data.email,
                name: data.name
            };
            const token = jwt.sign(userDetails, secret, { expiresIn: '1h' });
            response.cookie('jwtToken',token,{
                httpOnly:true,
                path:'/'
            });
            response.json({message: 'Login successful', userDetails: userDetails});
        }catch(error){
            console.error('Error during login:', error);
            return response.status(500).json({message:'Internal server error'});
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
    },
    register: async (request,response)=>{
        try{
            const {email,password,name} = request.body;
            const data = await Users.findOne({email:email});
            if(data){
                return response.status(400).json({message:'User already exists'});
            }
            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = new Users({
                email:email,
                password:encryptedPassword,
                name:name
            });
            await user.save();
            response.status(201).json({message:'User registered successfully'});
        }catch(error){
            console.error('Error during registration:', error);
            response.status(500).json({message:'Internal server error'});
        }
    }
};

module.exports = authController;