import api from '../axios';

export const login = credentials => api.post('/login', credentials);
export const listUsuarios = () => api.get('/users');
