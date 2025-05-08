// src/main/java/com/apaman/apaman_backend/dto/AsociadoAltaDTO.java
package com.apaman.apaman_backend.dto;

import com.apaman.apaman_backend.model.ActaAsociado;
import com.apaman.apaman_backend.model.Asociado;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Data
public class AsociadoAltaDTO {

    /* ── Datos básicos del Asociado ───────────────────────── */
    @NotBlank @Size(max = 9)
    private String cedula;

    @NotBlank @Size(max = 20)
    private String nombre;

    @NotBlank @Size(max = 20)
    private String apellido1;

    @NotBlank @Size(max = 20)
    private String apellido2;

    @NotNull
    private Asociado.Sexo sexo;                // Enum heredado del modelo

    @NotNull @Past
    private LocalDate fechaNacimiento;

    /** Fecha en la que el solicitante envió su solicitud para volverse asociado. */
    @NotNull
    private LocalDate fechaSolicitud;

    /** Cuota mensual acordada. */
    @NotNull
    @Digits(integer = 8, fraction = 2)
    @Positive
    private BigDecimal cuotaMensual;

    /** Datos de contacto */
    @NotBlank
    @Email @Size(max = 100)
    private String correo;

    @NotBlank
    @Pattern(regexp = "[0-9]{8}")
    private String telefono;

    @NotBlank @Size(max = 200)
    private String direccion;

    /* ── Campos iniciales de morosidad (opcionales) ──────── */
    @Min(0)
    private Integer mesesAdeudo = 0;

    @Digits(integer = 8, fraction = 2)
    @PositiveOrZero
    private BigDecimal cantidadAdeudo = BigDecimal.ZERO;

    /* ── Datos del Acta de aprobación ─────────────────────── */
    /** Fecha en la que se aprueba la solicitud para volverse asociado. */
    @NotNull
    private LocalDate fechaAprobacion;

    @NotBlank @Size(max = 20)
    private String numActa;

    @NotBlank @Size(max = 20)
    private String numAcuerdo;

    /* ═════════════════ Métodos auxiliares ═════════════════ */

    /** Permite que el front envíe fechas como "dd/MM/yyyy". */
    private static final DateTimeFormatter DF = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public void setFechaNacimiento(String ddMMyyyy) { this.fechaNacimiento = LocalDate.parse(ddMMyyyy, DF); }
    public void setFechaSolicitud(String ddMMyyyy)  { this.fechaSolicitud = LocalDate.parse(ddMMyyyy, DF); }
    public void setFechaAprobacion(String ddMMyyyy) { this.fechaAprobacion = LocalDate.parse(ddMMyyyy, DF); }

    /* ── Conversión a entidades JPA ──────────────────────── */

    /** Genera un objeto Asociado con los valores del DTO. */
    public Asociado toAsociado() {
        return Asociado.builder()
                .cedula(cedula)
                .nombre(nombre)
                .apellido1(apellido1)
                .apellido2(apellido2)
                .sexo(sexo)
                .fechaNacimiento(fechaNacimiento)
                .cuotaMensual(cuotaMensual)
                .correo(correo)
                .telefono(telefono)
                .direccion(direccion)
                .estado(true)               // por defecto activo
                .estadoMorosidad(false)     // sin morosidad inicial
                .mesesAdeudo(mesesAdeudo)
                .cantidadAdeudo(cantidadAdeudo)
                .build();
    }

    /** Genera el ActaAsociado enlazado al Asociado recién creado. */
    public ActaAsociado toActaAsociado(Asociado asociado) {
        return ActaAsociado.builder()
                .asociado(asociado)
                .asociadoCedula(asociado.getCedula())
                .fechaSolicitud(fechaSolicitud)
                .fechaAprobacion(fechaAprobacion)   // mismo día de la sesión
                .numActa(numActa)
                .numAcuerdo(numAcuerdo)
                .build();
    }
}
