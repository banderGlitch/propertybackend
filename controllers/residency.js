import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

export const Residency = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        image,
        userEmail,
    } = req.body.data;
    console.log("req=======================>", req.body.data);
    // Convert facilities to a JSON string if it is an object or array
    const facilitiesString =
        typeof facilities === "string" ? facilities : JSON.stringify(facilities);

    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const residency = await prisma.residency.create({
            data: {
                title,
                description,
                price,
                address,
                country,
                city,
                facilities: facilitiesString,
                image,
                owner: { connect: { email: userEmail } },
            },
        });
        res.send({
            message: "Residency  created successfully ",
            residency,
        });
    } catch (e) {
        if (e.code === "P2002") {
            res.status(404).send({
                message: "A residency with address already there !",
            });
            // throw new Error("A residency with address already there !");
        }
        throw new Error(e.message);
    }
});

// function to get all the documents/residencies
export const getAllResidencies = asyncHandler(async (req, res) => {
    const residencies = await prisma.residency.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    res.send(residencies);
});

// function to get a specific documents/residencies
export const getResidency = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const residency = await prisma.residency.findUnique({
            where:{id}
        })
        console.log("residency",residency)
        res.status(200).send({residency})

    }catch(e) {
        res.status(400).send({
            message : "Error in Fetching Residency"
        })

    }
});
