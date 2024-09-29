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
  const [dateLimit, setDateLimit] = useState('');
  const [employee, setEmployee] = useState('');
  const [dataEmployee, setDataEmployee] = useState([]);
  const [task, setTask] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState({ id: null, task: '' });
  //const [isAddingTask, setIsAddingTask] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [searchTerms, setSearchTerms] = useState({ task: '' });
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    fetchTasks();
    getEmployee();

  }, [user]);

  const fetchTasks = async (username) => {
    try {
      const response = await axios.get('http://localhost:3001/tasks', {

        withCredentials: true
      });

      setTasks(response.data);
      //console.log(response);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const getEmployee = async (username) => {
    try {
      const response = await axios.get('http://localhost:3001/getEmployee', {

        withCredentials: true
      });

      setDataEmployee(response.data);
      //console.log(response);
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
    const currentDate = new Date();
    const dateNow = currentDate.toISOString().slice(0, 19);
    console.log(dateNow);
    if (task !== '' && dateLimit !== '' && employee !== '' && dateLimit > dateNow) {
      await fetch('http://localhost:3001/addTasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, dateLimit, employee }),
      });

      toast.success('Tarea agregada con éxito!');
      setTask('');
      setDateLimit('');
      setEmployee('');
      fetchTasks();
      handleCloseModal();
    } else {
      Swal.fire("Los campos no pueden estar vacíos y la fecha no puede ser menor a la actual!");
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
        toast.success('Tarea eliminada con éxito!');
      }
    });
  };

  const deleteTask = async (id) => {
    await fetch('http://localhost:3001/', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchTasks();
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
    await fetch('http://localhost:3001/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, task: newTask, isedit }),
    });
    toast.success('Tarea editada con éxito!');
    fetchTasks();
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
    await fetch('http://localhost:3001/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: 1 }),
    });
    fetchTasks();
  };

  const markProgress = async (id) => {
    await fetch('http://localhost:3001/markProgress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchTasks();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className={`content ${isOpen ? 'content-shift' : ''}`}>
        <div className="container mt-5">




          <div>


            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '120px' }}>
              <h1 style={{ paddingTop: '14px' }} className="mb-4">Bienvenido, <span style={{ color: 'skyBlue' }} id='efectoEscritura'>Administrador</span></h1>
              <ProfileMenu onLogout={handleLogout} />
            </div>

            <DropExport tableId="taskTable" />
            <h2 style={{ textAlign: 'center' }}>Tasks</h2>
            <ToastContainer />
            <div className="mb-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0px' }}>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div>
                    <button className="btn btn-success" onClick={handleOpenModal}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>

                    { }
                    <div className={`modal fade ${isModalOpen ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Agregar Nueva Tarea</h5>


                          </div>

                          <div className="modal-body">
                            <div className="form-group">
                              <label htmlFor="inputTarea">Nueva tarea</label>
                              <input
                                id="inputTarea"
                                type="text"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                                className="form-control"
                                placeholder="Escribe la tarea"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="inputTarea">Responsable:</label>
                              <select
                                id="inputResponsable"
                                type="text"
                                value={employee}
                                onChange={(e) => setEmployee(e.target.value)}
                                className="form-control"
                                placeholder="Escribe la tarea"
                              >
                                <option value="" >selecciona</option>
                                {dataEmployee.map((dEmployee) => (
                                  <option key={dEmployee.id} value={dEmployee.id}>
                                    {dEmployee.name}
                                  </option>
                                ))}

                              </select>
                            </div>
                            <div className="form-group">
                              <label htmlFor="inputTarea">Fecha limite</label>
                              <input
                                id="inputFechaLimite"
                                type="datetime-local"
                                value={dateLimit}
                                onChange={(e) => setDateLimit(e.target.value)}
                                className="form-control"

                              />
                            </div>
                          </div>

                          <div className="modal-footer">
                            <button className="btn btn-success" onClick={addTask}>

                              Agregar
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>Cerrar</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="align-right">

                  <div className="input-group flex-nowrap">
                    <button className="btn btn-success" style={{ marginRight: '5px' }} onClick={handleOpenModal}>
                      Agregar Empleado
                    </button>
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
                    <th>Estado</th>
                    <th>Responsable</th>
                    <th>Limite</th>
                    <th>Dias rest.</th>
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

                      <td>{task.name}</td>
                      <td>{task.dateTime}</td>
                      <td>{task.totalDays}</td>
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
                            <button className="btn btn-success" id='boton' style={{ marginRight: '3px', display: task.completed === 'Hecha' ? 'none' : '' }} onClick={() => markTask(task.id)}>
                              <span className="button-text">Hecha</span>
                              <FontAwesomeIcon icon={faCheck} className="button-icon" />
                            </button>
                            <button className="btn btn-primary" id='boton' style={{ marginRight: '3px', display: task.completed === 'Hecha' ? 'none' : '' }} onClick={() => markProgress(task.id)}>
                              <span className="button-text">Empezar</span>
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
