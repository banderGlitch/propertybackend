import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";


export const createUser = asyncHandler(async(req ,res) => {
    console.log("create a user")
    let { email } = req.body
    const userExists = await prisma.user.findUnique({where : {email:email}})
    console.log("User already exists in the database we have", userExists)
    if (!userExists) {
        const user = await prisma.user.create({data:req.body})
        res.send({
            message: "User registered successfully",
            user: user,
          });
    } else res.status(201).send({ message: "User already registered" });
})