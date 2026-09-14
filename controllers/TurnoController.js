import Turno from "../models/Turno.js";
import Paciente from "../models/Paciente.js";

class TurnoController{

    async getAll(req, res){
        try {
            const {estadoTurno, fecha} = req.query;
            const filtro = {};

                if(estadoTurno){
                    filtro.estadoTurno = estadoTurno;
                }

                if(fecha){

                    const inicioDelDia = new Date(fecha);
                    const finDelDia = new Date(fecha);

                    finDelDia.setDate(finDelDia.getDate() + 1); // tiene un rango de 24hs 

                //$gte --> mayor o igual | $lt (less than) menor que.
                    filtro.fechaHora = {$gte: inicioDelDia, $lt: finDelDia};  
                    
                }
            
            const turnos = await Turno.find(filtro).populate('paciente');
            res.json({message: 'Turnos fueron obtenidos con exito', data: turnos});

        } catch (error) {
            res.status(500).json({message: 'Error al obtener turnos', error: error.message});
        }
    }

    async getById(req, res){
        try {
            const {id} = req.params;
            const turno = await Turno.findById(id).populate('paciente');

            if(!turno){
                return res.status(404).json({message: 'turno no encontrado'});

            }

            res.json({message: 'Turno obtenido correctamente', data: turno});

        } catch (error) {
            res.status(500).json({message: 'error al obtener el turno', error: error.message});
        }
    }

    async create(req, res){
        try {
            const {paciente, profesional, fechaHora, motivoConsulta, estadoTurno, primeraVez} = req.body;

                if (!paciente || !profesional || !fechaHora || !motivoConsulta) {

                    return res.status(400).json({message: 'Faltan campos obligatorios'});
                }

            const pacienteExiste = await Paciente.findById(paciente);
                if (!pacienteExiste) {

                    return res.status(404).json({message: 'El paciente indicado no existe'});
                 }


            const nuevoTurno = await Turno.create({paciente, profesional, fechaHora, motivoConsulta, estadoTurno, primeraVez});
            res.status(201).json({message: 'Turno creado correctamente', data: nuevoTurno});

        } catch (error) {
            res.status(500).json({message: 'error al crear el turno', error: error.message});
        }
    }


    async update(req, res) {
        try {
            const {id} = req.params;
            const turnoActualizado = await Turno.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});

            if (!turnoActualizado){
                return res.status(404).json({message: 'Turno no encontrado'});
            }

            res.json({message: 'Turno actualizado correctamente', data: turnoActualizado});
            
        } catch (error) {
            res.status(500).json({message: 'Hubo un error al actualizar el turno', error: error.message});
        }
    }


    async delete(req, res) {
        try {
                const {id} = req.params;
                const turnoEliminado = await Turno.findByIdAndDelete(id);


                    if (!turnoEliminado){
                        return res.status(404).json({ message: 'turno no encontrado'});
                    }

                res.json({message: 'Turno eliminado correctamente', data: turnoEliminado});

        } catch (error) {

                res.status(500).json({message: 'Error al eliminar el turno', error: error.message});
        }
    }


}

export default TurnoController;