const UserRepository=require('../repository/user-repository');
const jwt=require('jsonwebtoken');
const {JWT_KEY}=require('../config/serverConfig');
const bcrypt=require('bcrypt');

class UserService{
    constructor(){
        this.UserRepository=new UserRepository();
    }
    async create (data){
        try {
            const  user=await this.UserRepository.create(data);
            return user;
        } catch (error) {
            console.log("something went wrong on service layer");
            throw error;
            
        }
    }
    async signIn(email,plainPAssword){
        try {
            // step1 -> get the user by email
            const user=await this.UserRepository.getByEmail(email);
            //step2-->compare the incoming password with store encrypted password
            const  passwordMatch=this.checkPassword(plainPAssword,user.password);
            if (!passwordMatch){
                console.log("Password doesn't match");
                throw {error:"Incorrect password"};
            }
            //step3-->if pass word is correct then create jwt token and send it to user
            const newJWT=this.createToken({email:user.email,id:user.id});
            return newJWT;
            
        } catch (error) {
            console.log("something went wrong in signIn ");
            throw error;
        }

    }
    isAuthenticated(token){
        try {
            const response=this.verifyToken(token);
            if(!response){
                throw {error:'Invalid token'}
            }
            const user=this.UserRepository.getById(response.id);
            if(!user){
                throw{error:'No user with Corresponding token Exist'};
            }
            return user.id;
            
        } catch (error) {
            console.log("something went wrong in token creation ", error);
            throw error;
        }
    }

    createToken(user){
        try {
            const result=jwt.sign(user,JWT_KEY,{expiresIn:30});
            return result;
        } catch (error) {
            console.log("something went wrong in token creation ", error);
            throw error;
        }
    }
    verifyToken(token){
        try {
            const response=jwt.verify(token,JWT_KEY);
            return response;
        } catch (error) {
            console.log("something went wrong in token validation ", error);
            throw error;
            
        }
    }
    checkPassword(userPlainPassword,encryptPassword){
        try {
            return bcrypt.compareSync(userPlainPassword,encryptPassword);
        } catch (error) {
            console.log("something went wrong in password comparison");
            throw error;            
        }
    }


}
module.exports=UserService;