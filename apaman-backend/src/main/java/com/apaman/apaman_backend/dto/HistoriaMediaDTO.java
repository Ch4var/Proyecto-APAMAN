package com.apaman.apaman_backend.dto;
import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class HistoriaMediaDTO {
    private Long id;
    private String nombreArchivo;
    private String tipoMedia;
    private LocalDateTime fechaSubida;
}
