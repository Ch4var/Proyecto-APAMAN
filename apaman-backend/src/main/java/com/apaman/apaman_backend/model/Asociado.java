package com.apaman.apaman_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "asociado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asociado {

    @Id
    @Column(length = 20)
    private String cedula;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 5)
    private Sexo sexo;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(nullable = false)
    private Integer edad;

    @Column(nullable = false)
    private Boolean estado = true;

    @Column(name = "fecha_asociacion", nullable = false)
    private LocalDate fechaAsociacion;

    @Column(name = "fecha_sesion", nullable = false)
    private LocalDate fechaSesion;

    @Column(name = "num_acta", nullable = false, length = 20)
    private String numActa;

    @Column(name = "num_acuerdo", nullable = false, length = 20)
    private String numAcuerdo;

    @Column(name = "cuota_mensual", nullable = false, precision = 10, scale = 2)
    private BigDecimal cuotaMensual;

    @Column(name = "estado_morosidad", nullable = false)
    private Boolean estadoMorosidad = false;

    @Column(name = "meses_adeudo", nullable = false)
    private Integer mesesAdeudo = 0;

    @Column(name = "cantidad_adeudo", nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidadAdeudo = BigDecimal.ZERO;

    @Column(nullable = false, length = 100)
    private String correo;

    @Column(nullable = false, length = 20)
    private String telefono;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String direccion;

    @OneToMany(mappedBy = "asociado", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private java.util.List<ObservacionAsociado> observaciones = new java.util.ArrayList<>();


    public enum Sexo {
        M, F, Otro
    }
}
