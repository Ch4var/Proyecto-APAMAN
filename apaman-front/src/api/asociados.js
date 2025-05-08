import api from './axios';      // axios.create({ baseURL: 'http://localhost:8080' })

export const listAsociados = () => api.get('/asociados');
export const getAsociado   = (cedula) => api.get(`/asociados/${cedula}`);
export const createAsociado = (data) => api.post('/asociados', data);
export const updateAsociado = (cedula, data) => api.put(`/asociados/${cedula}`, data);
export const deleteAsociado = (cedula) => api.delete(`/asociados/${cedula}`);

// sub‑recursos
export const listObservaciones = (cedula) => api.get(`/asociados/${cedula}/observaciones`);
export const addObservacion    = (cedula, body) => api.post(`/asociados/${cedula}/observaciones`, body);
export const updateObservacion = (cedula, id, body) => api.put(`/asociados/${cedula}/observaciones/${id}`, body);
export const deleteObservacion = (cedula, id) => api.delete(`/asociados/${cedula}/observaciones/${id}`);
