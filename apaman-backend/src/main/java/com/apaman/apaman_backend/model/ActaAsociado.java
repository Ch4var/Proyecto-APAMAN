package com.apaman.apaman_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name="acta_asociado")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActaAsociado {

    // ──────────────────────────────────────────
    // Clave primaria
    // ──────────────────────────────────────────
    @Id
    @Column(name="asociado_cedula", length=9)
    private String asociadoCedula;

    // ──────────────────────────────────────────
    // Relación con Asociado
    // ──────────────────────────────────────────
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval=true)
    @MapsId                // PK = FK
    @JoinColumn(name="asociado_cedula")
    private Asociado asociado;

    // ──────────────────────────────────────────
    // Datos del acta
    // ──────────────────────────────────────────
    @NotNull
    @Column(name="fecha_solicitud")
    private LocalDate fechaSolicitud;

    @NotNull
    @Column(name="fecha_aprobacion")
    private LocalDate fechaAprobacion;

    @NotBlank @Size(max=20)
    @Column(name="num_acta")
    private String numActa;

    @NotBlank @Size(max=20)
    @Column(name="num_acuerdo")
    private String numAcuerdo;
}