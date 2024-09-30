const { Pool } = require('pg');

const db = new Pool({
    host: 'dpg-crsv2mlds78s73e9o2k0-a',
    user: 'listatareas_user',
    password: 'tx8nhRYZ58IEs05c9459jK4raQhIiKyj',
    database: 'listatareas',
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Si Render te requiere conexiones seguras
    }
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión:', err.stack);
    } else {
        console.log('Conectado a la base de datos');
    }
});
