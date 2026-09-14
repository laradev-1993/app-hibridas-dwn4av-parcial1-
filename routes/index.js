import pacienteRouter from './pacienteRouter.js';
import turnoRouter from './turnoRouter.js';
import usuarioRouter from './usuarioRouter.js';




const routerAPI = (app) =>{
      app.use('/api/pacientes', pacienteRouter);
    app.use('/api/turnos', turnoRouter);
    app.use('/api/usuarios', usuarioRouter);
}

export default routerAPI;