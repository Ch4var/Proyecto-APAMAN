package com.apaman.apaman_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "formulario_economico_beneficiario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormularioEconomicoBeneficiario {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cedula_beneficiario", nullable = false, unique = true)
    @NotNull
    @JsonIgnore
    private Beneficiario beneficiario;

    @Column(nullable = false)
    private Boolean pensionRnc;
    @Column(precision = 10, scale = 2)
    private BigDecimal montoPensionRnc;

    @Column(nullable = false)
    private Boolean pensionIvm;
    @Column(precision = 10, scale = 2)
    private BigDecimal montoPensionIvm;

    @Column(nullable = false)
    private Boolean pensionOtro;
    @Column(precision = 10, scale = 2)
    private BigDecimal montoPensionOtro;

    @Column(nullable = false)
    private Boolean aporteFamiliar;
    @Column(precision = 10, scale = 2)
    private BigDecimal montoAporteFamiliar;

    @Column(nullable = false)
    private Boolean ingresosPropios;
    @Column(precision = 10, scale = 2)
    private BigDecimal montoIngresosPropios;

    @Column(nullable = false)
    private Boolean aporteHogar;
    @Column(precision = 10, scale = 2)
    private BigDecimal montoAporteHogar;

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