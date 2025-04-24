package com.apaman.apaman_backend.model;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Entidad que representa el acta de constitución de uno o más asociados.
 */
@Entity
@Table(name = "acta_asociado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActaAsociado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Column(name = "fecha_sesion", nullable = false)
    private LocalDate fechaSesion;

    @NotBlank
    @Size(max = 20)
    @Column(name = "num_acta", length = 20, nullable = false)
    private String numActa;

    @NotBlank
    @Size(max = 20)
    @Column(name = "num_acuerdo", length = 20, nullable = false)
    private String numAcuerdo;

    /**
     * Relación One-to-One bidireccional:
     * esta es la inversa (mappedBy).
     */
    @OneToOne(mappedBy = "actaAsociado", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private Asociado asociado;
}
