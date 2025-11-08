const { v4: uuidv4 } = require('uuid');

/**
 * Cada reserva tiene:
 * id, hotel, tipo_habitacion, num_huespedes, estado, check_in, check_out, nombre_cliente, contacto, notas
 * fechas en formato ISO (YYYY-MM-DD)
 */
const reservas = [
{
    id: uuidv4(),
    hotel: "Hotel Paraíso",
    tipo_habitacion: "doble",
    num_huespedes: 3,
    estado: "confirmada", // confirmada, pendiente, cancelada, pagada
    check_in: "2025-12-15",
    check_out: "2025-12-20",
    nombre_cliente: "María Pérez",
    contacto: "maría@example.com",
    notas: "1 cuna"
},
{
    id: uuidv4(),
    hotel: "Hotel Paraíso",
    tipo_habitacion: "suite familiar",
    num_huespedes: 5,
    estado: "pendiente",
    check_in: "2025-12-24",
    check_out: "2025-12-27",
    nombre_cliente: "Familia Gómez",
    contacto: "+56999999999",
    notas: ""
},
{
    id: uuidv4(),
    hotel: "Hostal Centro",
    tipo_habitacion: "individual",
    num_huespedes: 1,
    estado: "pagada",
    check_in: "2025-11-10",
    check_out: "2025-11-12",
    nombre_cliente: "Carlos R.",
    contacto: "carlos@example.com",
    notas: ""
}
];

module.exports = reservas;