import { config } from "dotenv";
config({ path: process.ENV })
import jwt from 'jsonwebtoken'

export const auth =(req, res, next)=>{
    const {authorization} = req.headers;

    if(!authorization) return res.status(401).json({message:'access denied', statusCode:401})
    const [schema, token] = authorization.split(' ');

    if(schema !== 'Bearer') return res.status(401).json({message:'Token wrongly formated', statusCode:401})
    if(!token) return res.status(401).json({message:'access denied', statusCode:401})

try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
} catch (error) {
    res.status(401).json({statusCode:401, message:"access denied provided "+error.message})
}
}