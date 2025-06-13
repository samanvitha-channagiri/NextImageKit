import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import User from "@/models/User";

import { connectToDatabase } from "@/lib/db";
import { log } from "node:console";

/*
--Get data from frontend
--validate the data
--checking for duplicate users
--create user in DB
--return success response
*/
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "No field can be empty",
        },
        {
          status: 400,
        }
      );
    }


    //check for db connnection
    await connectToDatabase()
    const existingUser=await User.findOne({email})

    if(existingUser){
          return NextResponse.json(
        {
          error: "User already registered",
        },
        {
          status: 400,
        }
      );
   
    }

    await User.create({email,password})

    return NextResponse.json(
        {error:"User registration successfuly done!"},
        {status:400}
    )
  } catch (error) {
    console.log("Registration error",error)

    return NextResponse.json(
        {error:"failed to register user"},
        {status:500}
    )

  }
}
