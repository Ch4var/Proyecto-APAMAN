package com.apaman.apaman_backend.model;

import lombok.Data;

@Data
public class LoginRequest {
    private String cedula;
    private String contrasena;

}
