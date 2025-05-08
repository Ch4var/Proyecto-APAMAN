package com.apaman.apaman_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * Entidad que representa la relación “referente” entre dos asociados.
 * <p>
 * La FK {@code asociado_cedula} apunta al asociado principal y
 * {@code referente_cedula} al asociado que funge como su referente.
 */
@Entity
@Table(name = "referente_asociado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReferenteAsociado {

    // ──────────────────────────────────────────
    // Clave primaria
    // ──────────────────────────────────────────
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // ──────────────────────────────────────────
    // Asociado principal
    // ──────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "asociado_cedula", nullable = false)
    @NotNull
    private Asociado asociado;

    // ──────────────────────────────────────────
    // Asociado que funge como referente
    // ──────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "referente_cedula", nullable = false)
    @NotNull
    private Asociado referente;

    /*  ───────────────────────────────────────
        Nota: Para impedir que un asociado
        sea su propio referente, se incluye la
        validación en capa de servicio.
        ─────────────────────────────────────── */
}
