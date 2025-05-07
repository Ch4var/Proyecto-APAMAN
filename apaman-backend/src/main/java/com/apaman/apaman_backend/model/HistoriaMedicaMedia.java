package com.apaman.apaman_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historia_medica_media")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class HistoriaMedicaMedia {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "historia_id", nullable = false)
    @JsonIgnore
    private HistoriaMedicaBeneficiario historia;

    @Column(name = "nombre_archivo", nullable = false, length = 255)
    @NotBlank
    private String nombreArchivo;

    @Column(name = "tipo_media", nullable = false)
    @Enumerated(EnumType.STRING)
    private MediaType tipoMedia;

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

    public enum MediaType { foto, video }
}