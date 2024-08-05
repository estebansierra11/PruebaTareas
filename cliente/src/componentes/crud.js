/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Crud({ loggedInUser, loggedInId }) {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [loggedInUser]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost/prueba/servidor/api.php', {
        params: { username: loggedInUser }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const addTask = async () => {
    if (task !== '') {
      await axios.post('http://localhost/prueba/servidor/api.php', { task, id: loggedInId });
      setTask('');
      fetchTasks();
    } else {
      Swal.fire("El campo no puede estar vacío!");
    }
  };

  const confirmDeleteTask = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask(id);
        Swal.fire('Eliminado!', 'La tarea ha sido eliminada.', 'success');
      }
    });
  };

  const deleteTask = async (id) => {
    await axios.delete('http://localhost/prueba/servidor/api.php', {
      data: { id }
    });
    fetchTasks();
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Bienvenido, {loggedInUser}</h1>
      <div className="mb-3">
        <div className="d-flex align-items-center">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="form-control"
            placeholder="Agregar tarea"
            style={{ marginRight: '20px' }}
          />
          <button className="btn btn-success" onClick={addTask}>Insertar</button>
        </div>
      </div>
      {tasks.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tarea</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.task}</td>
                <td><button className="btn btn-danger" onClick={() => confirmDeleteTask(task.id)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
}

export default Crud;
*/