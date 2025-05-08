package com.apaman.apaman_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "observacion")        // ← tabla definida en el script SQL
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ObservacionAsociado {

    // ──────────────────────────────────────────
    // Clave primaria
    // ──────────────────────────────────────────
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ──────────────────────────────────────────
    // Relación con Asociado
    // ──────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "asociado_cedula", nullable = false)
    @JsonIgnore
    private Asociado asociado;

    // ──────────────────────────────────────────
    // Contenido de la observación
    // ──────────────────────────────────────────
    @Lob
    @NotBlank
    @Column(name = "contenido", nullable = false)
    private String observacion;

    // ──────────────────────────────────────────
    // Marca temporal
    // ──────────────────────────────────────────
    @Column(
            nullable        = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP " +
                    "ON UPDATE CURRENT_TIMESTAMP"
    )
    private LocalDateTime fecha;

    // ──────────────────────────────────────────
    // Hooks de ciclo de vida
    // ──────────────────────────────────────────
    @PrePersist
    protected void onCreate() {
        this.fecha = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.fecha = LocalDateTime.now();
    }
}
