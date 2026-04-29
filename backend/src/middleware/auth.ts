import {Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET || '100';

export const authenticateToken = (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){ 
        
        return res.status(401).json({error: 'Token is missing'});
    }
    try {
        
        const decoded = jwt.verify(token, secretKey);
        req.app.locals.userid = decoded;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }

}

