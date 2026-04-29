import express from "express";
import creatorService from "../service/creator.service";
import { CreatorSignInPayload, CreatorSignUpPayload } from "../dto/user.dto";
import jwt from 'jsonwebtoken';
import { Token } from "../../module/dto.module";

const router = express.Router();


router.post("/signup", async (req,res) =>{
    try{
        const payload = req.body as CreatorSignUpPayload;

        const newUser = await creatorService.signUp(payload);

        if(newUser == 1){
            return res.status(200).json({text:"Email already exists"});
        }
        if(newUser == 2){
            return res.status(200).json({text:"Username already exists"});
        }

        res.status(200).json({text:"success"});

    }catch(e){
        console.error(e);
        res.status(500).json({error:"Internal server error"});
    }
});

router.post("/signin", async (req,res) =>{
    try {
        const payload = req.body as CreatorSignInPayload;
        
        const user = await creatorService.signIn(payload);

        if (!user) {
            return res.status(401).json({ error: "Username or Password is wrong!" });
          }
        
        const secretKey = process.env.JWT_SECRET || '100'; 

        const token = jwt.sign({ userid: user.uuid }, secretKey);
        
        const result:Token = {
            success: true,
            message: '',
            accessToken:token,
            expireIn:3600*24
        }

        // res.cookie('token', token, {httpOnly: true });
        // req.session.user = user;
        res.status(200).json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;