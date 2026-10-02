
import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';

import dotenv from 'dotenv';
import Usuario from '../models/Usuario.js';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

class AuthController {
     async register(req, res) {

        try {
            const {nombre, email, password, role} = req.body;

            if (!nombre || !email || !password) {
                return res.status(400).json({message: 'Faltan campos obligatorios'});
            }

        //Verificar usuario ya no está registrado
            const usuarioExistente = await Usuario.findOne({email});
            if (usuarioExistente) {
                return res.status(400).json({message: 'Ya existe ese usuario'});
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const nuevoUsuario = await Usuario.create({
                nombre,
                email,
                password: passwordHash,
                role
            });

            res.status(201).json({
                message: 'Usuario registrado correctamente',
                data: {id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, role: nuevoUsuario.role}
            });
        } catch (error) {
            res.status(500).json({message: 'Error al registrar el usuario', error: error.message});
        }
    }

    async login(req, res) {

        try {
            const {email, password} = req.body;

            if (!email || !password) {
                return res.status(400).json({message: 'Faltan campos obligatorios'});
            }

            //Chequear si el mail existe
            const usuario = await Usuario.findOne({email});
            if (!usuario) {
                return res.status(401).json({message: 'Credenciales inválidas'});
            }

            const passwordValido = await bcrypt.compare(password, usuario.password);
            if (!passwordValido) {
                return res.status(401).json({message: 'Credenciales inválidas'});
            }

            const payload = {
                id: usuario._id,
                nombre: usuario.nombre,
                role: usuario.role
            };

           const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '1h'});

            res.json({message: 'Login exitoso', data: { token }});
        } catch (error) {
            res.status(500).json({message: 'Error al iniciar sesión', error: error.message});
        }
    }
}

export default AuthController;