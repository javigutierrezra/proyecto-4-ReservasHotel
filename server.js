require('dotenv').config();
const express = require('express');
const reservasRoutes = require('./routes/reservas.routes');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./swagger/openapi.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas API
app.use('/api/reservas', reservasRoutes);

// Swagger UI (documentación opcional)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));

// Ruta raíz
app.get('/', (req, res) => {
res.send('API de Reservas - ¡está corriendo!');
});

app.listen(PORT, () => {
console.log(`Servidor escuchando en http://localhost:${PORT}`);
console.log(`Docs: http://localhost:${PORT}/api/docs`);
});