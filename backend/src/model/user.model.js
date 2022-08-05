import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{type:String, minLength:3, maxLength:[30, "{VALUE is greater than 30 in length}"], required:true},
    email:{type:String, maxLength:30, required:true, unique:true},
    password:{type:String, minLength:6, maxLength:200, required:true},
    roles:{type:String, enum:["USER", "STAFF", "ADMIN", "MANAGER", "NOT ASSIGNED"], default:"NOT ASSIGNED"}
}, {timestamps:true})

export const User = mongoose.model('User', userSchema);
