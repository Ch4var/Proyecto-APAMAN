package com.apaman.apaman_backend.dto;

import lombok.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class FormularioEconomicoDTO {
    @NotNull private Boolean pensionRnc;
    private BigDecimal montoPensionRnc;

    @NotNull private Boolean pensionIvm;
    private BigDecimal montoPensionIvm;

    @NotNull private Boolean pensionOtro;
    private BigDecimal montoPensionOtro;

    @NotNull private Boolean aporteFamiliar;
    private BigDecimal montoAporteFamiliar;

    @NotNull private Boolean ingresosPropios;
    private BigDecimal montoIngresosPropios;

    @NotNull private Boolean aporteHogar;
    private BigDecimal montoAporteHogar;
}
