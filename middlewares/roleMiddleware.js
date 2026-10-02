const roleMiddleware = (req, res, next) => {
    const role = req.user.role;

    if (role !== 'admin' && role !== 'superAdmin') {
        return res.status(403).json({
            message: 'Acceso denegado'
        })
    }

    next();
}

export default roleMiddleware