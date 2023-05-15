import config from "./config";

const jWt = require('jsonwebtoken');
const conFig = require('./config');

const auth= () => {
    return (req:any, res:any, next:any) => {
    
    //Find jwt in headers
    const token = req.headers['authorization'];
    
        if(!token){
            return res.status(401).send("Please click authorization");
        }else{
            //validate jwt
            const tokenBody = token.slice(7);
            jWt.verify(tokenBody, config.JWT_SECRET_KEY, (err:any, decoded:any) => {
                if (err) {
                    console.log(`JWT Error: ${err}`);
                    return res.status(401).send("Error: Access Denied");
                }
                next();
            });      
        }
    };
};

export default auth;