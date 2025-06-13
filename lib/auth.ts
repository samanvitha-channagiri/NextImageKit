import { NextAuthOptions } from "next-auth";
import CredentialProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { log } from "node:console";
export const authOptions:NextAuthOptions={

    providers:[
      CredentialProvider({
        name:"Credentials",
        credentials:{
           email: {label:"Email",type:"text"},
           password:{label:"Password",type:"password"}
        },
        async authorize(credentials){
            if(!credentials?.email||!credentials?.password){
                throw new Error("missing email or password"
                )
            }

            try{
                await connectToDatabase()
               const user = await User.findOne({email:credentials.email})
               if(!user){
                throw new Error("login failed")
               }

            const isValid =   await bcrypt.compare(credentials.password,user.password)

            if(!isValid){
                throw new Error("login failed")
            }

            return {
                id:user._id.toString(),
                email:user.email
            }
            }catch(error){
                console.log("Auth error :",error)
                throw error 
            

            }
        }


      })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id=user.id
            }
            return token //this returning is imp
        },
        async session({session,user,token}){
            if(session.user){
                session.user.id=token.id as string


            }
            return session;
        }
    },
    pages:{
        signIn:'/login',
        error:'/login'
    },
    session:{
        strategy:'jwt',
        maxAge:30*24*60*60
    },
    secret:process.env.NEXTAUTH_SECRET

}

