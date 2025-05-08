package com.apaman.apaman_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "acta_asociado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActaAsociado {

    // ──────────────────────────────────────────
    // Clave primaria
    // ──────────────────────────────────────────
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // ──────────────────────────────────────────
    // Datos del acta
    // ──────────────────────────────────────────
    @Column(name = "fecha_sesion", nullable = false)
    @NotNull
    @PastOrPresent
    private LocalDate fechaSesion;

    @Column(name = "num_acta", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String numActa;

    @Column(name = "num_acuerdo", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String numAcuerdo;

    // ──────────────────────────────────────────
    // Relación con Asociado
    // ──────────────────────────────────────────
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "asociado_cedula", nullable = false)
    @NotNull
    private Asociado asociado;
}
