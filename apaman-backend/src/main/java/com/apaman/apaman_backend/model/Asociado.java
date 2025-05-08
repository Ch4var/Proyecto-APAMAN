package com.apaman.apaman_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;

@Entity
@Table(name = "asociado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asociado {

    // ──────────────────────────────────────────
    // Identificación y datos personales
    // ──────────────────────────────────────────
    /** Identificador: cédula costarricense (formato 9 dígitos máx.). **/
    @Id
    @Column(name = "cedula", nullable = false, length = 9)
    @NotBlank
    @Size(max = 9)
    private String cedula;

    @Column(nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String nombre;

    @Column(name = "apellido_1", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String apellido1;

    @Column(name = "apellido_2", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String apellido2;

    // ENUM coincide con los valores definidos en la BD
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull
    private Sexo sexo;

    public enum Sexo {
        Masculino,
        Femenina,
        Otro
    }

    @Column(name = "fecha_nacimiento", nullable = false)
    @NotNull
    @Past
    private LocalDate fechaNacimiento;

    @Column(name = "edad", nullable = false)
    @Min(0)
    private Integer edad;

    // ──────────────────────────────────────────
    // Información de asociación
    // ──────────────────────────────────────────
    @Column(name = "fecha_asociacion", nullable = false)
    @NotNull
    private LocalDate fechaAsociacion;

    @Column(name = "estado", nullable = false)
    @NotNull
    private Boolean estado = true;

    // ──────────────────────────────────────────
    // Información de pagos / morosidad
    // ──────────────────────────────────────────
    @Column(name = "cuota_mensual", nullable = false, precision = 10, scale = 2)
    @NotNull
    @DecimalMin("0.00")
    private BigDecimal cuotaMensual;

    @Column(name = "estado_morosidad", nullable = false)
    @NotNull
    private Boolean estadoMorosidad = false;

    @Column(name = "meses_adeudo", nullable = false)
    @Min(0)
    private Integer mesesAdeudo = 0;

    @Column(name = "cantidad_adeudo", nullable = false, precision = 10, scale = 2)
    @DecimalMin("0.00")
    private BigDecimal cantidadAdeudo = BigDecimal.ZERO;

    // ──────────────────────────────────────────
    // Contacto
    // ──────────────────────────────────────────
    @Column(name = "correo", nullable = false, length = 100)
    @Email
    @NotBlank
    private String correo;

    @Column(name = "telefono", nullable = false, length = 20)
    @NotBlank
    @Pattern(regexp = "\\+?[0-9]{7,20}")
    private String telefono;

    @Column(name = "direccion", nullable = false, length = 200)
    @NotBlank
    @Size(max = 200)
    private String direccion;

    // ──────────────────────────────────────────
    // Cálculo automático de la edad
    // ──────────────────────────────────────────
    @PrePersist
    @PreUpdate
    private void calcularEdad() {
        if (fechaNacimiento != null) {
            this.edad = Period.between(fechaNacimiento, LocalDate.now()).getYears();
        }
    }
}
