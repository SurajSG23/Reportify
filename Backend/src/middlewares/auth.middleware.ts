import express from "express";
import { verifyToken } from "../utils/auth";
import { ApiError } from "../utils/ApiError";
import { UserType } from "../config/types";
import jwt from "jsonwebtoken";

const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let token;
        const headerToken = req.headers.authorization?.split("Bearer ")?.[1]
	if(headerToken && headerToken.length > 0){
	   token = headerToken.trim();
	}
	else{
	   token = req.cookies?.token || null;
	}
  
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized");
        }

        req.user = decodedToken as UserType;
        next();
    } catch (error) {
        if(error instanceof ApiError){
             res.status(error.statusCode).json({ error: error.message });
        }
        else if(error instanceof jwt.TokenExpiredError){
             res.status(401).json({ error: "Token expired" });
        }
        else{
	     console.log("Hey error", error)
             res.status(500).json({ error: "Internal server error" });
        }
    }
    
}

export default authMiddleware
