import User from "@/models/user"

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

export const getUserByUsername = async (username: string) => {
     try{
          const user = await User.findOne({username});
          return user;
     } catch {
          return null;
     }
}