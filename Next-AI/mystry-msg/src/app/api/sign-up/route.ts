import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import bcrypt from "bcryptjs"

import {sendVerificationEmail} from "@/helpers/sendVerificationEmail"

export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, email, password} = await request.json()

        const existingUserVerifiedByUsername = awaits UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(10000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            true //TODO
        } else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        //send verification email
        

    } catch (error) {
        console.error('Error registering user', error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            }
        )
    }
}