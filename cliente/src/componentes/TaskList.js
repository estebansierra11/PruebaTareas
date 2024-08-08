import React, { useState, useEffect } from 'react';
import SideBar from '../componentes/SideBar';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass, faSave, faCancel, faEdit, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import ProfileMenu from '../componentes/profileMenu';
import DropExport from '../componentes/dropExport';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const TaskList = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [editTask, setEditTask] = useState({ id: null, task: '' });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [searchTerms, setSearchTerms] = useState({ task: '' });
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchTasks(user.username);
    }
  }, [user]);

  const fetchTasks = async (username) => {
    try {
      const response = await axios.get('http://localhost/prueba/servidor/api.php', {
        params: { username },
        withCredentials: true
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const handleLogout = () => {
    axios.get('http://localhost/prueba/servidor/api.php?action=logout')
      .then(response => {
        onLogout();
        navigate('/login');
      })
      .catch(error => {
        console.error('Error logging out!', error);
      });
  };

  const addTask = async () => {
    if (task !== '') {
      await fetch('http://localhost/prueba/servidor/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, id: user.id }),
      });

      toast.success('Tarea agregada con éxito!');
      setTask('');
      fetchTasks(user.username);
    } else {
      Swal.fire("El campo no puede estar vacío!");
    }
  };

  const cancelAddTask = () => {
    setTask('');
    setIsAddingTask(false);
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
        toast.success('Tarea eliminada con éxito!');
      }
    });
  };

  const deleteTask = async (id) => {
    await fetch('http://localhost/prueba/servidor/api.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchTasks(user.username);
  };

  const startEditTask = (task) => {
    setEditTask({ id: task.id, task: task.task });
    setIsBlinking(task.id);
    setTimeout(() => {
      setIsBlinking(null);
    }, 5000);
  };

  const handleEditTaskChange = (e) => {
    setEditTask({ ...editTask, task: e.target.value });
  };

  const saveTask = async () => {
    if (editTask.id !== null) {
      await updateTask(editTask.id, editTask.task, 1);
    }
  };

  const cancelEditTask = () => {
    setEditTask({ id: null, task: '' });
  };

  const updateTask = async (id, newTask, isedit) => {
    await fetch('http://localhost/prueba/servidor/api.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, task: newTask, isedit }),
    });
    toast.success('Tarea editada con éxito!');
    fetchTasks(user.username);
    setEditTask({ id: null, task: '' });
  };

  const handleSearchTermChange = (e) => {
    setSearchTerms({
      ...searchTerms,
      task: e.target.value,
    });
  };

  const filteredTasks = tasks.filter(task =>
    task.task.toLowerCase().includes(searchTerms.task.toLowerCase())
  );

  const markTask = async (id) => {
    await fetch('http://localhost/prueba/servidor/api.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: 1 }),
    });
    fetchTasks(user.username);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className={`content ${isOpen ? 'content-shift' : ''}`}>
        <div className="container mt-5">




          <div>


            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '120px' }}>
              <h1 style={{ paddingTop: '14px' }} className="mb-4">Bienvenido, <span style={{ color: 'skyBlue' }} id='efectoEscritura'>{user.username}</span></h1>
              <ProfileMenu onLogout={handleLogout} />
            </div>

            <DropExport tableId="taskTable" />
            <h2>Tasks</h2>
            <ToastContainer />
            <div className="mb-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0px' }}>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  {!isAddingTask ? (
                    <button className="btn btn-success" style={{ display: 'flex' }} onClick={() => setIsAddingTask(true)}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  ) : (
                    <div className="d-flex align-items-start">
                      <input
                        id='inputTarea'
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        className="form-control"
                        placeholder="Nueva tarea"
                        style={{ marginRight: '10px', width: '300px' }}
                      />
                      <button className="btn btn-success mr-1" id='boton' onClick={addTask} style={{ marginRight: '10px' }}>
                        <span className="button-text">Agregar</span>
                        <FontAwesomeIcon icon={faSave} className="button-icon" />
                      </button>
                      <button className="btn btn-secondary" id='boton' onClick={cancelAddTask}>
                        <span className="button-text">Cancelar</span>
                        <FontAwesomeIcon icon={faCancel} className="button-icon" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="align-right">
                  <div className="input-group flex-nowrap">
                    <input
                      id='inputBuscar'
                      type="text"
                      className="form-control"
                      placeholder="Buscar"
                      aria-label="Buscar"
                      aria-describedby="addon-wrapping"
                      value={searchTerms.task}
                      onChange={(e) => handleSearchTermChange(e, 'task')}
                      style={{ width: '250px' }}
                    />
                    <span className="input-group-text" id="addon-wrapping">
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {filteredTasks.length > 0 ? (
              <table id='taskTable' className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tarea</th>
                    <th>Completada</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.id}>
                      <td>{task.id}</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          id={isBlinking === task.id ? 'blinking' : ''}
                          value={editTask.id === task.id ? editTask.task : task.task}
                          onChange={editTask.id === task.id ? handleEditTaskChange : null}
                          style={{ backgroundColor: task.completed === 'Hecha' ? 'green' : 'white' }}
                          disabled={editTask.id !== task.id}
                        />
                      </td>
                      <td>{task.completed}</td>
                      <td>
                        {editTask.id === task.id ? (
                          <>
                            <button className="btn btn-success mr-1" id='boton' onClick={saveTask} style={{ marginRight: '10px' }}>
                              <span className="button-text">Guardar</span>
                              <FontAwesomeIcon icon={faSave} className="button-icon" />
                            </button>
                            <button className="btn btn-secondary" id='boton' onClick={cancelEditTask}>
                              <span className="button-text">Cancelar</span>
                              <FontAwesomeIcon icon={faCancel} className="button-icon" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn-warning" id='boton' style={{ marginRight: '3px', display: task.completed === 'Hecha' ? 'none' : '' }} onClick={() => startEditTask(task)}>
                              <span className="button-text">Editar</span>
                              <FontAwesomeIcon icon={faEdit} className="button-icon" />
                            </button>
                            <button className="btn btn-primary" id='boton' style={{ marginRight: '3px', display: task.completed === 'Hecha' ? 'none' : '' }} onClick={() => markTask(task.id)}>
                              <span className="button-text">Hecha</span>
                              <FontAwesomeIcon icon={faCheck} className="button-icon" />
                            </button>
                            <button className="btn btn-danger" id='boton' onClick={() => confirmDeleteTask(task.id)}>
                              <span className="button-text">Eliminar</span>
                              <FontAwesomeIcon icon={faTrash} className="button-icon" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay tareas</p>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default TaskList;
