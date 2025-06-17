const express = require('express');
const connection = require('./db');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

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
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Producto actualizado' });
        }
    );
});

// 🚀 Eliminar un producto
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM productos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Producto eliminado' });
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});