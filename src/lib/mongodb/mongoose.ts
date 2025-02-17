import mongoose, {Connection} from "mongoose";

let cachedConnection: Connection | null = null;

export async function connectDB(){
     if(cachedConnection){
          if(process.env.NODE_ENV==="development") console.info("Database Is Using Cached DB Connection");
          return cachedConnection;
     }
     try{
          const cnx = await mongoose.connect(process.env.MONGODB_URL!);
          cachedConnection = cnx.connection;
          if(process.env.NODE_ENV==="development") console.info("Database Is Connected");
          return cachedConnection;
     } catch (err: unknown){
          console.error(err);
          throw err;
     }
}