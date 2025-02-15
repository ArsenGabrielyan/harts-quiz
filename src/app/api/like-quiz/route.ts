import { currentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb/mongoose";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export type LikeQuizResponse = {
     isLiked?: boolean
     error?: string,
}
export async function GET(req: NextRequest): Promise<NextResponse<LikeQuizResponse>>{
     const searchParams = req?.nextUrl?.searchParams;
     const quizId = searchParams.get("quizId");
     if(!quizId){
          return NextResponse.json({error: "Հարցաշարի ID-ն բացակայում է"},{status: 400});
     }
     const user = await currentUser();
     await connectDB();
     const existingUser = await User.findById(user?.id);
     if(!existingUser){
          return NextResponse.json({error: "Օգտատերը մուտք չի գործել"},{status: 401});
     }
     const isLiked = existingUser.favorites.includes(quizId);
     return NextResponse.json({isLiked});
}