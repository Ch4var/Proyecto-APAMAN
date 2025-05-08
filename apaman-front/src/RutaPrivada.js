import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaPrivada = ({ children }) => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? children : <Navigate to="/login" replace />;
};

export default RutaPrivada;
