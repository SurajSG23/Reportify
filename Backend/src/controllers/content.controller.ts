import { generateSectionContent } from "../utils/reportMdxGenerator";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Request, Response } from "express";
import User from "../models/user.model";
export const generateContent = asyncHandler(async (req: Request, res: Response) => {
    const { title, promptContent, firstSection, lastSection, subject, description } = req.body;
    if(firstSection){
        const user = await User.findById(req.user._id);
        if(!user) throw new ApiError(500, "Error while fetching user");
        if(user.creditsUsed >= user.maxCredits) throw new ApiError(400, "You have reached your credits limit");
    }
    if (!title || !promptContent) throw new ApiError(400, "Missing required fields");
    const response = await generateSectionContent(title, subject, promptContent, lastSection, description);
    return res.status(200).json(new ApiResponse(200, "Content generated successfully", response.content, response.success));
});