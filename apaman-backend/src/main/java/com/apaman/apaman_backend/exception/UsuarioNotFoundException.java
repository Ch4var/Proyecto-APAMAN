package com.apaman.apaman_backend.exception;

public class UsuarioNotFoundException extends RuntimeException {
    public UsuarioNotFoundException(String cedula) {
        super("Usuario no encontrado: " + cedula);
    }
}
