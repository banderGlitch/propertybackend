import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";
import e from "express";


export const createUser = asyncHandler(async (req, res) => {
    console.log("create a user")
    let { email } = req.body
    const userExists = await prisma.user.findUnique({ where: { email: email } })
    console.log("User already exists in the database we have", userExists)
    if (!userExists) {
        const user = await prisma.user.create({ data: req.body })
        res.send({
            message: "User registered successfully",
            user: user,
        });
    } else res.status(201).send({ message: "User already registered" });
})

// Function to book a visit to the nearest hospital we
export const bookVisit = asyncHandler(async (req, res) => {
    console.log("create a user");
    const { email, date } = req.body;
    const { id } = req.params;
    // Check if email is provided
    if (!email || !date) {
        return res.status(400).json({ message: "Email or date not provided" });
    }

    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true }
        });

        if (!user) {
            return res.status(404).json({ message: "Email is not valid" });
        }

        // Check if the user has already booked the visit
        if (user.bookedVisits.some((visit) => visit.id === id)) {
            return res.status(400).json({ message: "This residency is already booked by you" });
        } else {
            // Update the user's booked visits
            await prisma.user.update({
                where: { email },
                data: {
                    bookedVisits: {
                        push: { id, date }
                    }
                }
            });
            return res.status(200).json({ message: "Your visit is booked successfully" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

})
// funtion to get all booking of the customer

export const getAllBookings = asyncHandler(async (req, res) => {
    const { email } = req.body;
    console.log("email", email)
    if (!email) {
        res.status(200).send({
            message:"Not a valid email"
        })
    }
    try {
        const bookings = await prisma.user.findUnique({
            where: {email},
            select: { bookedVisits: true }
        })
        if (!bookings) {
            res.status(200).send({
                message: "No booking found"
            })
        } else {
            res.status(200).send(bookings)

        }

    } catch (e) {
        console.log(e)
        throw new Error(e.message)
    }
})

// funtion to cancel a perticular booking

export const cancelBookings = asyncHandler(async(req , res) => {
    const {id} = req.params 
    const {email} = req.body

    if  (!id || !email ) {
        res.status(400).send({
            message:"id and email are not set properly please have a look"
        })
    }
    try{
        const user = await prisma.user.findUnique({
            where: {email}, 
            select: { bookedVisits: true }
        })
        const index = user.bookedVisits.findIndex((visit) => visit.id === id)
        // now we have to delete this index we have
        if (index === -1 ) {
            res.status(200).send({
                message:"Bookings not found"
            }) 
        } else {
            user.bookedVisits.splice(index,1)
            await prisma.user.update({
                where:{email}, 
                data : {
                    bookedVisits : user.bookedVisits
                }
            })
            console.log("booked----------visits", user.bookedVisits)
            res.status(200).send({
                message:"Booking Deleted succefully"
            })
        }

    } catch(err) {
        console.log(err)
        res.status(400).send({
            message: "Error"
        })
    }

})

// Function to add a resd in favourite list of a user
 export const toFav = asyncHandler(async(req, res) => {
    const { email } = req.body
    const { rid } = req.params

    try {
        const user = await prisma.user.findUnique({
            where:{email}
        })
        if (user.favResidenciesID.includes(rid)) {
            const updateUser = await prisma.user.update({
                where : {email},
                data : {
                    favResidenciesID : {
                        set : user.favResidenciesID.filter((id)=> id !== rid)
                    }
                }
            })
            res.send({message : "Removed from favourites", user:updateUser})
        } else {
            const updateUser = await prisma.user.update({
                where : {email},
                data : {
                    favResidenciesID: {
                        push:rid
                    }
                }
            })
            res.send({ message : "Updated favorites", user:updateUser})
        }
    } catch (err) {
        throw new Error(err.message)
    }
 })

 export const allFav = asyncHandler(async(req, res) => {
    const {email} = req.body

    try {
       const favResd = await prisma.user.findUnique({
        where:{email},
        select:{favResidenciesID:true}
       })
       res.status(200).send(favResd)
      
    } catch (err) {
        throw new Error(err.message)
    }
 })


