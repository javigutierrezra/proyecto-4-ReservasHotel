const { v4: uuidv4 } = require('uuid');
const reservas = require('../data/reservas.data');

// Helper: parsear fecha ISO segura
const parseDate = (s) => {
if (!s) return null;
const d = new Date(s);
return isNaN(d.getTime()) ? null : new Date(d.toISOString().slice(0,10));
};

// Helper: comprobar si dos rangos de fechas se intersectan
const rangesIntersect = (aStart, aEnd, bStart, bEnd) => {
return aStart <= bEnd && bStart <= aEnd;
};

// Crear reserva - POST /api/reservas
const crearReserva = (req, res) => {
const {
    hotel,
    tipo_habitacion,
    num_huespedes,
    estado = 'pendiente',
    check_in,
    check_out,
    nombre_cliente,
    contacto,
    notas = ''
} = req.body;

if (!hotel || !tipo_habitacion || !num_huespedes || !check_in || !check_out || !nombre_cliente) {
    return res.status(400).json({ error: 'Faltan campos requeridos. (hotel, tipo_habitacion, num_huespedes, check_in, check_out, nombre_cliente)' });
}

const inDate = parseDate(check_in);
const outDate = parseDate(check_out);
if (!inDate || !outDate || inDate > outDate) {
    return res.status(400).json({ error: 'Fechas inválidas. Asegúrate de usar formato YYYY-MM-DD y que check_in <= check_out.' });
}

const nuevaReserva = {
    id: uuidv4(),
    hotel,
    tipo_habitacion,
    num_huespedes: Number(num_huespedes),
    estado,
    check_in: inDate.toISOString().slice(0,10),
    check_out: outDate.toISOString().slice(0,10),
    nombre_cliente,
    contacto: contacto || '',
notas
};

reservas.push(nuevaReserva);
return res.status(201).json(nuevaReserva);
};

// Obtener lista de reservas con filtros - GET /api/reservas
const listarReservas = (req, res) => {
let results = [...reservas];
const {
    hotel,
    fecha_inicio,
    fecha_fin,
    tipo_habitacion,
    estado,
    num_huespedes
} = req.query;

if (hotel) {
    results = results.filter(r => r.hotel.toLowerCase() === String(hotel).toLowerCase());
}

if (tipo_habitacion) {
    results = results.filter(r => r.tipo_habitacion.toLowerCase() === String(tipo_habitacion).toLowerCase());
}

if (estado) {
    results = results.filter(r => r.estado.toLowerCase() === String(estado).toLowerCase());
}

if (num_huespedes) {
    // permite buscar exacto o "más de" si pones >N (ej: ?num_huespedes=>5)
    const q = String(num_huespedes);
    if (q.startsWith('>')) {
    const num = Number(q.slice(1));
    results = results.filter(r => r.num_huespedes > num);
    } else {
    const num = Number(q);
    results = results.filter(r => r.num_huespedes === num);
    }
}

if (fecha_inicio || fecha_fin) {
    const fStart = parseDate(fecha_inicio) || new Date('1970-01-01');
    const fEnd = parseDate(fecha_fin) || new Date('9999-12-31');

    results = results.filter(r => {
    const rStart = parseDate(r.check_in);
    const rEnd = parseDate(r.check_out);
    return rangesIntersect(rStart, rEnd, fStart, fEnd);
    });
}

return res.json(results);
};

// Obtener reserva por id - GET /api/reservas/:id
const obtenerReserva = (req, res) => {
const { id } = req.params;
const r = reservas.find(x => x.id === id);
if (!r) return res.status(404).json({ error: 'Reserva no encontrada' });
return res.json(r);
};

// Actualizar reserva - PUT /api/reservas/:id
const actualizarReserva = (req, res) => {
const { id } = req.params;
const idx = reservas.findIndex(x => x.id === id);
if (idx === -1) return res.status(404).json({ error: 'Reserva no encontrada' });

const update = req.body;

if (update.check_in || update.check_out) {
    const inDate = parseDate(update.check_in || reservas[idx].check_in);
    const outDate = parseDate(update.check_out || reservas[idx].check_out);
    if (!inDate || !outDate || inDate > outDate) {
    return res.status(400).json({ error: 'Fechas inválidas al actualizar.' });
    }
    update.check_in = inDate.toISOString().slice(0,10);
    update.check_out = outDate.toISOString().slice(0,10);
}

  // actualizar solo campos presentes
reservas[idx] = { ...reservas[idx], ...update };
return res.json(reservas[idx]);
};

// Eliminar reserva - DELETE /api/reservas/:id
const eliminarReserva = (req, res) => {
const { id } = req.params;
const idx = reservas.findIndex(x => x.id === id);
if (idx === -1) return res.status(404).json({ error: 'Reserva no encontrada' });
const removed = reservas.splice(idx, 1)[0];
return res.json({ message: 'Reserva eliminada', reserva: removed });
};

module.exports = {
crearReserva,
listarReservas,
obtenerReserva,
actualizarReserva,
eliminarReserva
};