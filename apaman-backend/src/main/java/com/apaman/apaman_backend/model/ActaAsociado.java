package com.apaman.apaman_backend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "acta_asociado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActaAsociado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fecha_sesion", nullable = false)
    @NotNull
    private LocalDate fechaSesion;

    @Column(name = "num_acta", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String numActa;

    @Column(name = "num_acuerdo", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String numAcuerdo;
}
