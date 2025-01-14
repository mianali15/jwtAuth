import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



class UserController{

    static userRegistration = async(req,res)=>{

        const {name , email , password , password_confirmation , tc }=req.body
        // checked email exist
       const user=await UserModel.findOne({email:email})
       if (user) {
        res.send({"status": "falied", "message":"Email Already exist Try To new Email Address"})   
       }else{
           if (name && email &&  password &&  password_confirmation  && tc) {
             if (password== password_confirmation) {
                
                try {

                    const slat=await bcrypt.genSalt(10)
                    const hashPassword=await bcrypt.hash(password ,slat )

                    const newUser=new UserModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                        tc:tc
                    })
                    await newUser.save()
                    res.send({"status": "success", "message":"User registration SuccessFully"})

                } catch (error) {
                    res.send({"status": "falied", "message":"unable to registration "})
                }



              
             }else{
              res.send({"status": "falied", "message":"Password and Confirm password doesn't matched"});
             }
            

           }else{
            res.send({"status": "falied", "message":"All falied are Required"})   
   
           }


       }

    }



    
    static userLogin =async(req,res)=>{
        try {
    
            const {email , password}=req.body
            if (email && password) {
             const user=await UserModel.findOne({email:email})
                    if (user != null) {
                       
                        const isMatch=await bcrypt.compare(password ,user.password)
                        if ((user.email=== email) &&  isMatch) {
                            
                             res.send({"status":"success", "message":"user_login SuccessFully"})
                        }else{
                            res.send({ "status": "failed", "message": "Email or Password is not Valid" })
                        }
                    }else{
                        res.send({ "status": "failed", "message": "You are not a Registered User" })
                    }
                

            }else{
                res.send({"status": "falied", "message":"All falied are Required"})
            }
                
        } catch (error) {
            res.status(409).json({
                success:false,
                message:"Unable to Login"
            })
        }
    }

}



export default UserController