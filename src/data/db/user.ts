import User from "@/model/user"

export const getUserById = async (id: string) => {
     try{
          const user = await User.findById(id);
          return user
     } catch {
          return null
     }
}

export const getUserByEmail = async (email: string) => {
     try{
          const user = await User.findOne({email});
          return user;
     } catch{
          return null
     }
}