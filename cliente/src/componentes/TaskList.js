import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faSave, faCancel, faEdit, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
//import ExportToPDF from '../componentes/exportPdf';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import ProfileMenu from '../componentes/profileMenu';
import DropExport from '../componentes/dropExport';
import '../App.css';


function TaskList() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInId, setLoggedInId] = useState(null);
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [editTask, setEditTask] = useState({ id: null, task: '' });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [searchTerms, setSearchTerms] = useState({
    id: '',
    task: '',
    completed: '',
  });

  useEffect(() => {
    axios.get('http://localhost/prueba/servidor/api.php',{ withCredentials: true })
      .then(response => {
        if (response.data.username) {
          setLoggedInUser(response.data.username);

        }
      })
      .catch(error => {
        console.error('There was an error fetching the user!', error);
      });
  }, []);

  const fetchTasks = async (username) => {
    //console.log('recibo ' + username);

    try {
      const response = await axios.get('http://localhost/prueba/servidor/api.php', {
        params: {
          username: username
        },
        withCredentials: true
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const handleLogin = () => {
    axios.post('http://localhost/prueba/servidor/api.php?action=login',
      {
        username,
        password
      })
      .then(response => {
        setMessage(response.data.message);
        if (response.data.username) {
          setLoggedInUser(response.data.username);
          setLoggedInId(response.data.id);
          fetchTasks(username);


        }
      })
      .catch(error => {
        console.error('There was an error logging in!', error);
      });
  };

  const handleRegister = () => {
    axios.post('http://localhost/prueba/servidor/api.php?action=register', { username, password })
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error registering!', error);
      });
  };

  const handleLogout = () => {
    axios.get('http://localhost/prueba/servidor/api.php?action=logout')
      .then(response => {
        setMessage(response.data.message);
        setLoggedInUser(null);
        setTasks([]);
        setUsername('');
        setPassword('');
      })
      .catch(error => {
        console.error('There was an error logging out!', error);
      });
  };

  const addTask = async () => {
    //console.log(loggedInId);
    if (task !== '') {
      await fetch('http://localhost/prueba/servidor/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task, id: loggedInId }),
      });

      toast.success('Tarea agregada con éxito!');
      setTask('');
      fetchTasks(username);
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
    })
  };
  const deleteTask = async (id) => {
    await fetch('http://localhost/prueba/servidor/api.php', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    fetchTasks(username);
  };

  const startEditTask = (task) => {
    setEditTask({ id: task.id, task: task.task });
    setIsBlinking(task.id);
    setTimeout(() => {
      setIsBlinking(null); // Detener el parpadeo después de 5 segundos
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


    setEditTask('');
  };

  const updateTask = async (id, newTask, isedit) => {
    await fetch('http://localhost/prueba/servidor/api.php', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, task: newTask, isedit }),
    });
    toast.success('Tarea editada con éxito!');
    fetchTasks(username);
    setEditTask({ id: null, task: '' });
  };

  const handleSearchTermChange = (e, column) => {
    setSearchTerms({
      ...searchTerms,
      [column]: e.target.value,
    });
  };

  const filteredTasks = tasks.filter(task =>
    task.task.toLowerCase().includes(searchTerms.task.toLowerCase()),
    //console.log(tasks)
  );


  const markTask = async (id) => {
    await fetch('http://localhost/prueba/servidor/api.php', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, completed: 1 }),
    });
    fetchTasks(username);
  };








  return (
    <div className="container mt-5">
      {loggedInUser ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '120px' }}>
            <div style={{}}>
              <h1 style={{ paddingTop: '14px' }} className="mb-4">Bienvenido, <span style={{ color: 'skyBlue' }} id='efectoEscritura'>{loggedInUser}</span></h1>
            </div>
            <div style={{}}>
              <ProfileMenu onLogout={handleLogout} />
            </div>
          </div>
          


          <DropExport tableId="taskTable"/>
          <h2>Tasks</h2>
          <ToastContainer />
          <div className="mb-3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0px' }}>
              <div style={{ flex: 1, textAlign: 'left' }}>
                {!isAddingTask ? (
                  <button

                    className="btn btn-success"
                    style={{ display: 'flex' }}
                    onClick={() => setIsAddingTask(true)}
                  >
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
                      placeholder="Agregar tarea"
                      style={{
                        marginRight: '20px',
                        width: '400px'
                      }}
                    />
                    <button className="btn btn-success" id='liveToastBtn' onClick={addTask} style={{ marginRight: '5px' }}>Insertar</button>
                    <button className="btn btn-secondary" onClick={cancelAddTask}>Cancelar</button>
                  </div>


                )}
              </div>
              <div className="align-right">
                <div className="input-group flex-nowrap">
                  <input
                    
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
            <p>No hay tarea</p>
          )}
        </div>








        //////////////////////LOGIN////////////////////////////////

      ) : (
        <div className="card p-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h1 className="mb-4">Login</h1>
          <div className="form-group">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary mb-2" onClick={handleLogin}>Login</button>
          <button className="btn btn-secondary mb-2" onClick={handleRegister}>Register</button>
          <p>{message}</p>
        </div>

      )}
    </div>
  );
}

export default TaskList;
