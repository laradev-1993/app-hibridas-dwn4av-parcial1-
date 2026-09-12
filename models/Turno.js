import mongoose from "mongoose";

const turnoSchema = new mongoose.Schema({
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente',
        required: true
    },

      profesional: {
        type: String,
        required: true
      },
     fechaHora: {
        type: Date,
        required: true
     },
     
     motivoConsulta:{
         type: String,
        required: true
     },


      estadoTurno:{
        type: String,
        enum: ['Pendiente', 'Confirmado', 'Cancelado', 'Completado'],
        default: 'Pendiente'
      },
    
     primeraVez: {
        type: Boolean,
        default: false
     } 
});

const Turno = mongoose.model('Turno', turnoSchema);

export default Turno;
