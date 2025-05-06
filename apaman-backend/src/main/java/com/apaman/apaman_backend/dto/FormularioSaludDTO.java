package com.apaman.apaman_backend.dto;

import com.apaman.apaman_backend.model.FormularioSaludBeneficiario.Limitacion;
import lombok.*;

import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormularioSaludDTO {
    @NotNull private Limitacion limitacion;
    private String padecimientos;
    private String lugaresAtencion;
    @NotNull private Boolean reconoceMedicamentos;
    private String medicamentos;
    @NotNull private Boolean tieneDieta;
    private String dieta;
    @NotNull private Boolean utilizaOrtopedicos;
    private String ortopedicos;
    @NotNull private Boolean utilizaAnteojos;
    @NotNull private Boolean utilizaAudifonos;
    private String otro;
}
