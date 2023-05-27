const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const otpGenerator = require('otp-generator')
const _ = require('lodash')
const { lowerCase } = require('lodash');
dotenv.config();


router.get('/',(req,res)=>{
    
    User.find({}).select('email image createdAt')
    .then((users)=>{
        if(users){
            return res.status(200).json({users:users})
        }else{
            return res.status(404).json({error:'Not found'})
        }
    })
    .catch(err=>{
        return res.status(500).json({error:'something went wrong'})
    })
})

router.get('/:id',(req,res)=>{
    User.findOne({_id:req.params.id}).select('email image createdAt')
    .then((user)=>{
        console.log(req.admin)

        if(users){
            return res.status(200).json({user:user})
        }else{
            return res.status(404).json({error:'Not found'})
        }
    })
    .catch(err=>{
        return res.status(500).json({error:'something went wrong'})
    })
})


router.delete('/delete/:id',(req,res)=>{
    const paramid = req.params.id
    
    if(mongoose.isValidObjectId(paramid)){
        if(req.user === paramid){
            User.findByIdAndDelete(paramid)
            .then((deletedUser)=>{
                if(deletedUser){
                    return res.status(200).json({
                        success:true,
                        message:"product deleted successfully"
                    })
                }else{
                    return res.status(404).json({
                        success:false,
                        message:'product not found'
                    })
                }
            })
            .catch(err=>{
                return res.status(500).json({error:'something went wrong'})
            })
        }else{
            return res.status(401).json({error:'Something Went Wrong, try again later!'})
        }
        
    }else{
        return res.status(500).json({error:'Something Went wrong'})
    }
    
})
router.post('/checkmail', (req,res)=>{
    if(!req.body.email){
        return res.status(500).json({error:'please fill in valid email'})
    }
    User.findOne({email:req.body.email.toLowerCase()})
    .then((usermail)=>{
        if(usermail){
            return res.status(401).json({error:'email is taken', success: false})
        }else{
            return res.status(200).json({message:'email found', success:true})
        }
    })
    .catch(err=>{
        return res.status(500).json({error:'Something went wrong'})
    })
})

router.post('/register',(req,res)=>{
    console.log(req.body)
    if(!req.body.email || !req.body.password){
        return res.status(500).json({error:'Fill in all fields'})
    }
    User.findOne({email:req.body.email.toLowerCase()})
    .then((emailuser)=>{
        if(!emailuser){
            bcrypt.hash(req.body?.password,10)
            .then((hashedPsd)=>{
                const newUser = new User({
                    
                    password:hashedPsd,
                    email:req.body.email.toLowerCase(),
                    
                })
                newUser.save()
                .then((user)=>{
                    if(user){
                        return res.status(201).json({message:'Account Created Successfully'})
                    }
                }).catch((err)=>{
                    return res.status(500).json({error:'user not created. Try Again Later!'})
                })
            }).catch(err=>{
                return res.status(500).json({error:'something went wrong'})
            })
        }else{
            return res.status(401).json({error:'Email is taken'})
        }
    }).catch((err)=>{
        return res.status(500).json({error:'Something went wrong'})
    })
    
})

router.post('/login',(req,res)=>{
    if(!req.body.email || !req.body.password){
        return res.status(500).json({error:'Fill in all fields'})
    }
    const admin = process.env.ADMIN
    User.findOne({email:req.body.email.toLowerCase()})
    .then((logUser)=>{
        if(logUser){
            
            bcrypt.compare(req.body.password, logUser.password)
            .then((verifiedUser)=>{
                console.log(verifiedUser)
                if(verifiedUser){
                    const token = jwt.sign(
                        {
                            id:logUser._id
                        },
                        process.env.TOKEN_SECRET,
                        {expiresIn:'1440h'}
                    )
                    
                    User.findByIdAndUpdate(logUser._id,{
                        token:token
                    },{
                        new:true
                    }).then((updatedUser)=>{
                        return res.status(200).json({user:updatedUser})
                    }).catch(error=>{
                        return res.status(500).json({error:'Something went wrong3'})
                    })
                }else{
                    return res.status(401).json({error:'credential error'})
                }
            }).catch((err)=>{
                return res.status(500).json({error:'Something went wrong2'})
            })
        }else{
            return res.status(404).json({error:'Credential Error'})
        }
    }).catch(err=>{
        return res.status(500).json({error:'something went wrong'})
    })
})

router.post('/verify/phone', (req,res)=>{
    User.findOne({userid:req.userid})
    .then((user)=>{
        if(user){
            const number = req.body.number
           const OTP = otpGenerator.generate(4,{
                digits:true,alphabets:false,upperCaseAlphabets:false,specialChars:false
            })
            const otp = new Phone({number:number, otp:OTP})
            otp.otp = bcrypt.hash(otp)
        }else{
            return res.status(404).json({error:'Not Authorized'})
        }
    }).catch((err)=>{
        res.status(500).json({error:'Something Went Wrong'})
    })
})

module.exports = router;