package com.apaman.apaman_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "formulario_salud_beneficiario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormularioSaludBeneficiario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cedula_beneficiario", nullable = false, unique = true)
    @NotNull
    private Beneficiario beneficiario;

    public enum Limitacion { Física, Mental, Ninguna }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Limitacion limitacion;

    @Column(columnDefinition = "TEXT")
    private String padecimientos;

    @Column(columnDefinition = "TEXT")
    private String lugaresAtencion;

    @Column(nullable = false)
    private Boolean reconoceMedicamentos;

    @Column(columnDefinition = "TEXT")
    private String medicamentos;

    @Column(nullable = false)
    private Boolean tieneDieta;

    @Column(columnDefinition = "TEXT")
    private String dieta;

    @Column(nullable = false)
    private Boolean utilizaOrtopedicos;

    @Column(columnDefinition = "TEXT")
    private String ortopedicos;

    @Column(nullable = false)
    private Boolean utilizaAnteojos;

    @Column(nullable = false)
    private Boolean utilizaAudifonos;

    @Column(columnDefinition = "TEXT")
    private String otro;

    @Column(nullable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
