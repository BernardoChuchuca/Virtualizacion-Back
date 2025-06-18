const express = require('express');
const connection = require('./db');
const cors = require('cors');

const app = express();
app.use(express.json());

// ✅ CORS explícito para permitir todas las IPs (especialmente frontend externo)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

// 🚀 Obtener todos los productos
app.get('/productos', (req, res) => {
    connection.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 🚀 Agregar un producto
app.post('/productos', (req, res) => {
    const { codigo_barra, descripcion, cantidad } = req.body;
    connection.query(
        'INSERT INTO productos (codigo_barra, descripcion, cantidad) VALUES (?, ?, ?)',
        [codigo_barra, descripcion, cantidad],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Producto agregado', id: results.insertId });
        }
    );
});

// 🚀 Editar un producto
app.put('/productos/:id', (req, res) => {
    const { descripcion, cantidad } = req.body;
    const { id } = req.params;
    connection.query(
        'UPDATE productos SET descripcion = ?, cantidad = ? WHERE id = ?',
        [descripcion, cantidad, id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Producto actualizado' });
        }
    );
});

// 🚀 Eliminar un producto
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    connection.query(
        'DELETE FROM productos WHERE id = ?',
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Producto eliminado' });
        }
    );
});

// ✅ Escuchar en 0.0.0.0 para que sea accesible desde una IP pública
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});


