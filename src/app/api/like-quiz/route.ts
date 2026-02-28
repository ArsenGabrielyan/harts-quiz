import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
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
     const existingUser = await getUserById(user?.id as string);
     if(!existingUser){
          return NextResponse.json({error: "Օգտատերը մուտք չի գործել"},{status: 401});
     }
     const isLiked = existingUser.favorites.includes(quizId);
     return NextResponse.json({isLiked});
}