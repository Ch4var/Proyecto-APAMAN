package com.apaman.apaman_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "usuario")
@Data
public class Usuario {

    @Id
    @Column(name = "cedula")
    private String cedula;

    private String rol;
    private String correo;

    @Column(name = "contrasena")
    private String contrasena;
}