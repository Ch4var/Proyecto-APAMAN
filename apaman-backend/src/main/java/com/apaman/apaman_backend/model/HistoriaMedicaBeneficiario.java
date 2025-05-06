package com.apaman.apaman_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "historia_medica_beneficiario")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class HistoriaMedicaBeneficiario {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cedula_beneficiario", nullable = false)
    @JsonIgnore
    private Beneficiario beneficiario;

    @Column(name = "nombre_personal_salud", nullable = false, length = 100)
    @NotBlank
    private String nombrePersonalSalud;

    @Column(name = "tipo_terapia", nullable = false, length = 100)
    @NotBlank
    private String tipoTerapia;

    @Lob @Column(nullable = false) @NotBlank
    private String detalle;

    @Column(name = "fecha_registro", nullable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaRegistro;

    @OneToMany(mappedBy = "historia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistoriaMedicaMedia> media;

    @PrePersist
    protected void onCreate() {
        this.fechaRegistro = LocalDateTime.now();
    }
}