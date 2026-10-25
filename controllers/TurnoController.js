import Turno from "../models/Turno.js";
import Paciente from "../models/Paciente.js";
import mongoose from 'mongoose';

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

        async create(req, res) {
            try {
                const { paciente, profesional, fechaHora, motivoConsulta, estadoTurno, primeraVez } = req.body;

                if (!paciente || !profesional || !fechaHora || !motivoConsulta) {
                    return res.status(400).json({
                        message: 'Faltan campos obligatorios'
                    });
                }

                if (typeof profesional !== 'string' || typeof motivoConsulta !== 'string') {
                    return res.status(400).json({
                        message: 'profesional y motivoConsulta deben ser texto'
                    });
                }

                if (isNaN(Date.parse(fechaHora))) {
                    return res.status(400).json({
                        message: 'fechaHora no es una fecha válida'
                    });
                }

                const estadosValidos = ['Pendiente', 'Confirmado', 'Cancelado', 'Completado'];
                if (estadoTurno !== undefined && !estadosValidos.includes(estadoTurno)) {
                    return res.status(400).json({
                        message: 'estadoTurno no es un valor válido'
                    });
                }

                if (primeraVez !== undefined && typeof primeraVez !== 'boolean') {
                    return res.status(400).json({
                        message: 'primeraVez debe ser booleano'
                    });
                }

                let pacienteId;

                if (typeof paciente === 'string') {
                    // Caso 1: si el paciente existe, se manda su id
                    if (!mongoose.isValidObjectId(paciente)) {
                        return res.status(400).json({
                            message: 'El ID de paciente no tiene un formato válido'
                        });
                    }

                    const pacienteExistente = await Paciente.findById(paciente);
                    if (!pacienteExistente) {
                        return res.status(404).json({
                            message: 'Paciente no encontrado'
                        });
                    }

                    pacienteId = pacienteExistente._id;

                } else if (typeof paciente === 'object' && paciente !== null) {
                    // Caso 2: si el paciente es nuevo, se mandan sus datos
                    const { nombreCompleto, edad, telefono, obraSocial } = paciente;

                    if (!nombreCompleto || edad === undefined || !telefono || !obraSocial) {
                        return res.status(400).json({
                            message: 'Faltan campos obligatorios del paciente nuevo'
                        });
                    }

                    if (typeof nombreCompleto !== 'string' || typeof telefono !== 'string' || typeof obraSocial !== 'string') {
                        return res.status(400).json({
                            message: 'nombreCompleto, telefono y obraSocial del paciente deben ser texto'
                        });
                    }

                    if (typeof edad !== 'number') {
                        return res.status(400).json({
                            message: 'edad del paciente debe ser un número'
                        });
                    }

                    const nuevoPaciente = await Paciente.create({
                        nombreCompleto, edad, telefono, obraSocial
                    });

                    pacienteId = nuevoPaciente._id;

                } else {
                    return res.status(400).json({
                        message: 'El campo paciente debe ser un ID (string) o los datos de un paciente nuevo (objeto)'
                    });
                }

                const nuevoTurno = await Turno.create({
                    paciente: pacienteId,
                    profesional,
                    fechaHora,
                    motivoConsulta,
                    estadoTurno,
                    primeraVez
                });

                res.status(201).json({
                    message: 'success',
                    data: nuevoTurno
                });

            } catch (error) {
                res.status(500).json({
                    message: 'Error al crear el turno',
                    error: error.message
                });
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