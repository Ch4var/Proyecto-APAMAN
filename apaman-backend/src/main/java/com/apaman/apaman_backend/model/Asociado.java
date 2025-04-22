package com.apaman.apaman_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "asociado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asociado {

    @Id
    @Column(length = 20)
    @NotBlank
    @Size(max = 20)
    private String cedula;

    @Column(nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 5)
    @NotNull
    private Sexo sexo;

    @Column(name = "fecha_nacimiento", nullable = false)
    @NotNull
    @Past
    private LocalDate fechaNacimiento;

    @Column(nullable = false)
    @NotNull
    @Min(0)
    private Integer edad;

    @Column(nullable = false)
    @NotNull
    private Boolean estado = true;

    @Column(name = "fecha_asociacion", nullable = false)
    @NotNull
    private LocalDate fechaAsociacion;

    @Column(name = "fecha_sesion", nullable = false)
    @NotNull
    private LocalDate fechaSesion;

    @Column(name = "num_acta", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String numActa;

    @Column(name = "num_acuerdo", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String numAcuerdo;

    @Column(name = "cuota_mensual", nullable = false, precision = 10, scale = 2)
    @NotNull
    @DecimalMin("0.00")
    private BigDecimal cuotaMensual;

    @Column(name = "estado_morosidad", nullable = false)
    @NotNull
    private Boolean estadoMorosidad = false;

    @Column(name = "meses_adeudo", nullable = false)
    @NotNull
    @Min(0)
    private Integer mesesAdeudo = 0;

    @Column(name = "cantidad_adeudo", nullable = false, precision = 10, scale = 2)
    @NotNull
    @DecimalMin("0.00")
    private BigDecimal cantidadAdeudo = BigDecimal.ZERO;

    @Column(nullable = false, length = 100)
    @NotBlank
    @Email
    @Size(max = 100)
    private String correo;

    @Column(nullable = false, length = 20)
    @NotBlank
    @Pattern(regexp = "\\+?[0-9]{7,20}")
    private String telefono;

    @Column(columnDefinition = "TEXT", nullable = false)
    @NotBlank
    private String direccion;

    @OneToMany(mappedBy = "asociado", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ObservacionAsociado> observaciones = new ArrayList<>();

    @OneToMany(mappedBy = "asociado", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ReferenteAsociado> referentes = new ArrayList<>();

    @OneToMany(mappedBy = "referente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ReferenteAsociado> asociadosReferidos = new ArrayList<>();

    public enum Sexo {
        M, F, Otro
    }
}