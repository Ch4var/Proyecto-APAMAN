package com.apaman.apaman_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "expediente_administrativo_beneficiario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpedienteAdministrativoBeneficiario {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cedula_beneficiario", nullable = false)
    @JsonIgnore
    private Beneficiario beneficiario;

    @Column(name = "nombre_archivo", nullable = false, length = 255)
    @NotBlank
    private String nombreArchivo;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGBLOB")
    private byte[] contenido;

    @Column(name = "fecha_subida", nullable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaSubida;

    @PrePersist
    protected void onCreate() {
        this.fechaSubida = LocalDateTime.now();
    }
}
