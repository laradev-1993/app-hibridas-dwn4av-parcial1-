import mongoose from "mongoose";
import dns from "node:dns";

// Usar DNS públicos para resolver MongoDB Atlas
dns.setServers(["1.1.1.1", "8.8.8.8"]);





export const connectDB = async() => {
    try {
       const MONGODB_URI = process.env.MONGODB_URI;

        await mongoose.connect(MONGODB_URI);
        console.log('Conección con MongoDB exitosa!! ✅');

    } catch (error) {
        console.error('❌ Error al conectarse a MongoDB');
        console.error(error);

        //el programa terminó por una falla p error 
        process.exit(1);
        
    }
}