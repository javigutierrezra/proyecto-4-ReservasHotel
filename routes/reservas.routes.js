const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservas.controller');

// POST /api/reservas - crear reserva
router.post('/', controller.crearReserva);

// GET /api/reservas - listar (con filtros por query params)
router.get('/', controller.listarReservas);

// GET /api/reservas/:id - obtener por id
router.get('/:id', controller.obtenerReserva);

// PUT /api/reservas/:id - actualizar
router.put('/:id', controller.actualizarReserva);

// DELETE /api/reservas/:id - eliminar
router.delete('/:id', controller.eliminarReserva);

module.exports = router;