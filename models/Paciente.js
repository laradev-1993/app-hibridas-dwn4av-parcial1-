import mongoose from "mongoose";

    const pacienteSchema = new mongoose.Schema({
        nombreCompleto: {
            type: String,
            required: true
        },
        edad:{
            type: Number,
            required: true,
            min: 0
        },
        telefono: {
            type: String,
            required: true
        },

        obraSocial: {
            type: String,
            required: true
        }


    });

const Paciente = mongoose.model('Paciente', pacienteSchema);

export default Paciente;