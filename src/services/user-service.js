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