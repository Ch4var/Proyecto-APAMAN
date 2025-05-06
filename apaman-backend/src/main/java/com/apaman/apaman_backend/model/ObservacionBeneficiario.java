package com.apaman.apaman_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "observaciones_beneficiario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ObservacionBeneficiario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cedula_beneficiario", nullable = false)
    @JsonIgnore
    private Beneficiario beneficiario;

    @Lob
    @Column(nullable = false)
    private String observacion;


    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime fecha;

    @PrePersist
    protected void onCreate() {
        this.fecha = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.fecha = LocalDateTime.now();
    }

}
