package com.apaman.apaman_backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class LoginRequest {

    @NotBlank(message = "La cédula es requerida")
    private String cedula;

    @NotBlank(message = "La contraseña es requerida")
    private String contrasena;
}
