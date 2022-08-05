//import project dependencies
import { config } from "dotenv";
config({ path: process.ENV })
import {User} from '../model/user.model.js'
import bcrypt from 'bcrypt'
import Joi from 'joi'
// const auth = require('../middleware/auth')
import jwt from 'jsonwebtoken'
// import validator from 'express-validator'
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
//get the root directory
const __dirname = dirname(fileURLToPath(import.meta.url));


// const {body, check, validationResult } = validator

//create the transporter instance

const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    },
    tls: {
        rejectUnAuthorized: true
    }
})

const handlebarOptions = {
    viewEngine:{
        extname:'.handlebars',
        partialsDir:path.resolve(__dirname, '../views'),
        defaultLayout:false
    },
    viewPath:path.resolve(__dirname,'../views'),
    extname:'.handlebars'
}

transporter.use('compile', hbs(handlebarOptions))

export const passwordRecovery=async(req, res)=>{
    const {email} = req.body;

    try{
        let users = await User.findOne({email});
        if(!users) return res.status(500).send('account not found for '+email);

        const salt = await bcrypt.genSalt(10);
        const password = (Math.random() * 10000000) + 'pwk@jyu2#*suy';
        const hashedPassword = await bcrypt.hash(password, salt);
        

        const options = {
            from: 'davidalimazo@gmail.com',
            to: `${email}`,
            subject: 'Password Recovery',
            template:'email',
            attachments: [{
                filename: 'logo_1.png',
                path: path.join(__dirname, '../../', 'public/images/logo_1.png'),
                cid: 'logo'
            }],
            context:{
                title:`Password Recovery`,
                name:users.name,
                email:users.email,
                password:password
            },
            
        }

        await User.updateOne({email}, {password:hashedPassword}).then(result=>{
            transporter.sendMail(options, (err, info) => {
                if (err) {
                    return res.status(500).json({message:"error sending email "+err.message});
                }
                return res.status(200).json({message:"password recovery email sent successfully "+password});
            })
        }).catch(err=> res.status(500).json({message:"error occurred while recovery your password"}))
    

       
       
    }catch(err){
        res.status(400).json({error:err.message})
    }    
}

export const staffPage=async(req, res)=>{
    const {email, role} = req.user;
    try{
        let users = await User.findOne({email}).select("-password")
        if(!users) return res.status(500).send('user not found');
        if(role === 'STAFF') return res.status(200).json({users});
        
        return res.status(401).json({message:"Authorized"});
    }catch(err){
        res.status(400).json({error:err.message})
    }    
}

export const managerPage=async(req, res)=>{
    const {email, role} = req.user;
    try{
        let users = await User.findOne({email}).select("-password")
        if(!users) return res.status(500).send('user not found');
        if(role === 'MANAGER') return res.status(200).json({users});
        
        return res.status(401).json({message:"Authorized"});
    }catch(err){
        res.status(400).json({error:err.message})
    }    
}

export const AdminPage=async(req, res)=>{
    const {email, role} = req.user;
    try{
        let users = await User.findOne({email}).select("-password")
        if(!users) return res.status(500).send('user not found');
        if(role === 'ADMIN') return res.status(200).json({users});
        
        return res.status(401).json({message:"Authorized"});
    }catch(err){
        res.status(400).json({error:err.message})
    }    
}

export const userPage=async(req, res)=>{
    const {email, role} = req.user;
    try{
        let users = await User.findOne({email}).select("-password")
        if(!users) return res.status(500).send('user not found');
        if(role === 'USER') return res.status(200).json({users});
        
        return res.status(401).json({message:"Authorized"});
    }catch(err){
        res.status(400).json({error:err.message})
    }    
}

export const getUserProfile= async(req, res)=>{
    const {email} = req.user;
    try{
        let users = await User.findOne({email}).select("-password")
        if(!users) return res.status(500).send('user not found');
        res.status(200).json({users});

    }catch(err){
        res.status(400).json({error:err.message})
    }    
}

export const logInUser= async(req, res)=>{
    const {email, password} = req.body;
    
    const schema = Joi.object({
        email:Joi.string().max(30).email().required(),
        password:Joi.string().min(6).max(200).required()
    });
        
    const {error} = schema.validate({email, password});
    if(error) return res.status(400).json({error:error.details[0].message});

    let user = await User.findOne({email});
    if(!user) return res.status(500).send({error:'email not found'});
    let hashedPassword = await bcrypt.compare(password, user.password);

    if(hashedPassword){
        const data = {name:user.name, role:user.roles, email:user.email}
        let token = jwt.sign({id:user._id, name:user.name, email, role:user.roles, isVerified:true}, process.env.JWT_SECRET, {expiresIn:3600})
         return res.status(200).json({token, data})
    }
    else{
       return res.status(500).send({error:'invalid credentials'}); 
    }
         
}

export const registerUser = async(req, res)=>{

    const {name, email, password, roles} = req.body;
    try{ 
        String(name).toLowerCase();
       String(email).toLowerCase();
    }catch(err){
        return res.send('filled must not be empty');
    }

     const schema = Joi.object({
        name:Joi.string().min(3).max(30).required(),
        email:Joi.string().max(30).email().required(),
        roles:Joi.string().valid("USER", "STAFF", "ADMIN", "MANAGER", "NOT ASSIGNED").uppercase(),
        password:Joi.string().min(6).max(200).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/).required()
    });

    
    const {error} = schema.validate(req.body);
    if(error) return res.status(400).json({error:error.details[0].message});

    let user = await User.findOne({email:req.body.email});
    if(user){ 
        return res.status(403).json({message:'user with email '+req.body.email+' already exist'});     
    }
      
        user = new User({name, email, password, roles });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        await user.save();

        res.send('user registered successfully')
}

