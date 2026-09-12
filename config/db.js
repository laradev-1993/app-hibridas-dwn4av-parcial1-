import mongoose from "mongoose";

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