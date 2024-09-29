const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'listatarea'
});

db.connect((err) => {
    if (err) throw err;
    console.log('conectado');
});


function getTasks(req, res) {
    const { username } = req.query;
    const sql = `
        SELECT 
  t.id, 
  t.task, 
  t.completed, 
  e.name, 
  DATE_FORMAT(t.dateTime, '%d-%m-%Y %H:%i') as dateTime,
  TIMESTAMPDIFF(DAY,NOW(), t.dateTime) as totalDays
FROM tasks t
INNER JOIN employee e ON t.employee = e.id
ORDER BY totalDays ASC;


`;

    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ message: 'Error' });
        }
        res.json(result);
    });
}

function getEmployee(req, res) {
    //const { username } = req.query;
    const sql = `
        SELECT * FROM employee`;

    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ message: 'Error' });
        }
        res.json(result);
    });
}


function updateTask(req, res) {
    const { id, task, completed } = req.body;
    const sql = completed === 1 ?
        `UPDATE tasks SET completed='Hecha' WHERE id=${id}` :
        `UPDATE tasks SET task='${task}' WHERE id=${id}`;

    db.query(sql, (err) => {
        if (err) {
            return res.json({ message: 'Error' });
        }
        res.json({ message: 'Tarea actualizada' });
    });
}

function markProgress(req, res) {
    const { id} = req.body;
    const sql =
        `UPDATE tasks SET completed='En progreso' WHERE id=${id}`;
        

    db.query(sql, (err) => {
        if (err) {
            return res.json({ message: 'Error' });
        }
        res.json({ message: 'actualizada' });
    });
}

function addTask(req, res) {
    const { task, id, dateLimit, employee } = req.body;
    //const date = dateLimit.replace('T', ' ');
    const sql = `INSERT INTO tasks (task, employee, completed, dateTime) VALUES ('${task}', '${employee}', 'Pendiente', '${dateLimit}')`;
    console.log(sql);

    db.query(sql, (err) => {
        if (err) {
            return res.json({ message: 'Error' });
        }
        res.json({ message: 'Tarea agregada' });
    });
}

function addEmployee(req, res) {
    const {newName, newLastName } = req.body;
    const sql = `INSERT INTO employee (name, lastname) VALUES ('${newName}', '${newLastName}')`;
    //console.log(sql);

    db.query(sql, (err) => {
        if (err) {
            return res.json({ message: 'Error' });
        }
        res.json({ message: 'Empleado agregada' });
    });
}





function deleteTask(req, res) {
    const { id } = req.body;
    const sql = `DELETE FROM tasks WHERE id=${id}`;

    db.query(sql, (err) => {
        if (err) {
            return res.json({ message: 'Error' });
        }
        res.json({ message: 'Tarea eliminada' });
    });
}

app.delete('/', (req, res) => {
    deleteTask(req, res);
});

app.get('/tasks', (req, res) => {
    getTasks(req, res);
});

app.get('/getEmployee', (req, res) => {
    getEmployee(req, res);
});

app.post('/addTasks', (req, res) => {
    addTask(req, res);
});

app.post('/addEmployee', (req, res) => {
    addEmployee(req, res);
});

app.put('/', (req, res) => {
    updateTask(req, res);
});

app.put('/markProgress', (req, res) => {
    markProgress(req, res);
});


app.listen(3001, () => {
    console.log("corriendo: 3001");
});
