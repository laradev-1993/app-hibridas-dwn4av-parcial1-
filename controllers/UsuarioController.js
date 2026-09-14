import bcrypt from 'bcrypt';
import Usuario from "../models/Usuario.js";

class UsuarioController{

   async getAll(req, res) {
        try {
            const usuarios = await Usuario.find().select('nombre email'); //sin el password

            res.json({message: 'Usuarios fueron obtenidos correctamente', data: usuarios});

        } catch (error) {

            res.status(500).json({message: 'error al obtener usuarios', error: error.message});
        }
    }


     async getById(req, res) {
        try {
            const {id} = req.params;
            const usuario = await Usuario.findById(id).select('nombre email');

                if (!usuario) {
                    return res.status(404).json({message: 'usuario no encontrado'});
                }

            res.json({message: 'Usuario obtenido correctamente', data: usuario});


        } catch (error) {
            res.status(500).json({message: 'Error al obtener el usuario', error: error.message});

        }
    }

     async create(req, res){
        try {

            const {nombre, email, password} = req.body;

                if (!nombre || !email || !password) {
                    return res.status(400).json({message: 'Faltan campos obligatorios'});
                }

            const passwordHash = await bcrypt.hash(password, 10);

            const nuevoUsuario = await Usuario.create({nombre, email, password: passwordHash});

            res.status(201).json({message: 'el usuario fue creado correctamente', data: {id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email}});


        } catch (error) {

            res.status(500).json({message: 'Error al crear el usuario', error: error.message});
        }
    }

    async update(req, res){
        try {
            const {id} = req.params;
            const {nombre, email, password} = req.body;

            const datosActualizados = {nombre, email};

                if (password){
                    datosActualizados.password = await bcrypt.hash(password, 10);
                }

            const usuarioActualizado = await Usuario.findByIdAndUpdate(id, datosActualizados, { new: true, runValidators: true}).select('nombre email');

                if (!usuarioActualizado) {
                    return res.status(404).json({message: 'usuario no encontrado'});
                }

            res.json({message: 'Usuario actualizado correctamente', data: usuarioActualizado});

        } catch (error) {

            res.status(500).json({message: 'Error al actualizar el usuario', error: error.message});
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;

            const usuarioEliminado = await Usuario.findByIdAndDelete(id);

                if (!usuarioEliminado) {
                    return res.status(404).json({message: 'usuario no encontrado'});
                }

            res.json({message: 'Usuario eliminado correctamente'});
        } catch (error) {
            res.status(500).json({message: 'Error al eliminar el usuario', error: error.message});
        }
    }

}

export default UsuarioController;