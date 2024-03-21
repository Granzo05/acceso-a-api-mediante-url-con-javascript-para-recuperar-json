const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "client", "index.html"));
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: ''
});

// Conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        console.log('La contraseña y el usuario tienen que ser los mismos que colocaste arriba en la constante db');
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});


// Endpoint para guardar datos en la base de datos
app.post('/cargar-paises', (req, res) => {
    const data = req.body;
    // Recibimos el array como un body y lo iteramos
    data.forEach((pais) => {
        const sql = "INSERT INTO Pais (codigoPais, nombrePais, capitalPais, region, poblacion, latitud, longitud) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [pais.codigo, pais.nombre, pais.capital, pais.region, pais.poblacion, pais.latitud, pais.longitud], (err, result) => {
            if (err) {
                console.error('Error al insertar datos:', err);
                res.status(500).send('Error al insertar datos en la base de datos');
                return;
            }
            console.log('Inserción exitosa:', result.affectedRows + ' fila(s) insertada(s)');
        });
    });

    // Cerramos la conexión a la base de datos después de completar todas las inserciones
    db.end();

    console.log('Datos recibidos:', data);
    res.send('Datos recibidos y guardados correctamente');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`El servidor ahora se está ejecutando en el puerto ${PORT}`);
});
