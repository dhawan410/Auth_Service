const express=require('express');
const  bodyParser=require('body-parser');

const {PORT, JWT_KEY}=require('./config/serverConfig');
const apiRoutes=require('./routes/index');
const app=express();
const db=require('./models/index');
const {User,Role}=require('./models/index');
const  UserService=require('./services/user-service');
const prepareAndStartServer=()=>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use('/api',apiRoutes);

    app.listen(PORT,async ()=>{
        console.log(`Server Started ${PORT}`);
        
        if(process.env.DB_SYNC){
            db.sequelize.sync({alter:true});

        };
        const u1=await User.findByPk(4);
        const r1=await Role.findByPk(2);
        u1.addRole(r1);


        //const newToken=service.createToken({email:'aman@gmail.com',id:1});
        //console.log("new token is",newToken);
        //const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtYW5AZ21haWwuY29tIiwiaWQiOjEsImlhdCI6MTY5ODM0NzQyMSwiZXhwIjoxNjk4MzQ3NDIxfQ.ftPaPRQKCOVLODtabazcgilEBdR6M16ajVIarU7iUOo';

        //const response=service.verifyToken(token,JWT_KEY);
        //console.log(response);
    });
}
prepareAndStartServer();