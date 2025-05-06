package com.apaman.apaman_backend.dto;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class HistoriaMedicaDTO {
    private Long id;
    private String nombrePersonalSalud;
    private String tipoTerapia;
    private String detalle;
    private LocalDateTime fechaRegistro;
    private List<HistoriaMediaDTO> media;
}
