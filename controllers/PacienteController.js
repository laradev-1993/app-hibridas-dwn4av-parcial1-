import Paciente from "../models/Paciente";
import Turno from '../models/Turno.js';

class PacienteController{
    async getAll(req, res){
        try {
            const {obraSocial, edad, nombreCompleto} = req.query;
            const filtro = {};

                if(obraSocial){
                    filtro.obraSocial = obraSocial;
                }

                if(edad){
                    filtro.edad = Number(edad);
                }


              if(nombreCompleto){
                filtro.nombreCompleto = {$regex: nombreCompleto, $options: 'i'};
              } 
            
            const pacientes = await Paciente.find(filtro);
            res.json({ message: 'Los pacientes fueron obtenidos corrctamente', data: pacientes});
  
        } catch (error) {
            res.status(500).json({message: 'Error al obtener pacientes', error: error.message});
        }
    }

    async getById(req, res){
        try {
            
            const {id} = req.params;
            const paciente = await Paciente.findById(id);

                if(!paciente){
                    return res.status(404).json({message: 'El paciente no fue encontrado'});

                }

                res.json({message: 'El paciente fue obtenido correctamente', data: paciente});


        } catch (error) {
            
            res.status(500).json({message: 'Error al obtener el paciente', error: error.message});
        }
 
    }

    
    
    async create(req, res){
            try {
                const {nombreCompleto, edad, telefono, obraSocial} = req.body;

                   if(!nombreCompleto || edad === undefined || !telefono || !obraSocial){
                       
                       return res.status(400).json({message: 'Falta completar campos obligatorios'});
                   }

                const nuevoPaciente = await Paciente.create({nombreCompleto, edad, telefono, obraSocial});
                res.status(201).json({message: 'Paciente creado correctamente', data: nuevoPaciente});

            } catch (error) {
                res.status(500).json({message: 'Error al crear paciente', error: error.message});
            }
        }

    async update(req, res){
        try {
            const {id} = req.params;
             const pacienteActualizado = await Paciente.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});

              if (!pacienteActualizado) {
                return res.status(404).json({message: 'Paciente no encontrado'});
            }

            res.json({message: 'Paciente actualizado correctamente', data: pacienteActualizado});

        } catch (error) {
            res.status(500).json({message: 'error al alctualizar el paciente', error: error.message});
        }
    }    



    async delete(req, res) {
    try {
        const {id} = req.params;

        const turnosAsociados = await Turno.find({paciente: id});

        if (turnosAsociados.length > 0) {
            return res.status(400).json({ message: 'No es posible eliminar paciente, tiene turnos asociados'});
        }

        const pacienteEliminado = await Paciente.findByIdAndDelete(id);

        if (!pacienteEliminado) {
            return res.status(404).json({message: 'Paciente no encontrado'});
        }

        res.json({message: 'Paciente eliminado correctamente', data: pacienteEliminado});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar el paciente', error: error.message});
    }
}


}

export default PacienteController;