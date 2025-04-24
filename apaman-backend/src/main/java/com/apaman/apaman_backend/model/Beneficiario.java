package com.apaman.apaman_backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "beneficiario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Beneficiario {

    @Id
    @Column(name = "cedula", nullable = false)
    @NotNull
    private Integer cedula;

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

    @Column(nullable = true)
    @Transient
    @Min(0)
    private Integer edad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull
    private Religion religion;

    public enum Religion {
        Cristianismo_Católico,
        Cristianismo_Protestante,
        Budaísmo,
        Judaísmo,
        Islam,
        Otro
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "escolaridad", nullable = false)
    @NotNull
    private Escolaridad escolaridad;

    public enum Escolaridad {
        Ninguno,
        Preescolar,
        Primaria,
        Secundaria,
        Educación_Superior
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_dependencia", nullable = false)
    @NotNull
    private Dependencia estadoDependencia;

    @Column(name = "fecha_ingreso", nullable = false)
    @NotNull
    private LocalDate fechaIngreso;

    @Lob
    @Column(name = "foto", columnDefinition = "LONGBLOB")
    private byte[] foto;

    @Column(nullable = false)
    @NotNull
    private Boolean estado = true;

    // Datos del responsable
    @Column(name = "responsable_nombre", nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String responsableNombre;

    @Column(name = "responsable_apellido_1", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String responsableApellido1;

    @Column(name = "responsable_apellido_2", nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String responsableApellido2;

    @Column(name = "responsable_telefono", nullable = false, length = 20)
    @NotBlank
    @Pattern(regexp = "\\+?[0-9]{7,20}")
    private String responsableTelefono;

    @Column(name = "responsable_direccion", columnDefinition = "TEXT", nullable = false)
    @NotBlank
    private String responsableDireccion;
    // Relación con fondo y pensión
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_fondo", nullable = false)
    @NotNull
    private Fondo fondo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pension", nullable = false)
    @NotNull
    private Pension pension;

    @Column(nullable = false, precision = 10, scale = 2)
    @NotNull
    private BigDecimal presupuesto;

    public Integer getEdad() {
        if (fechaNacimiento == null) {
            return null;
        }
        return Period.between(fechaNacimiento, LocalDate.now()).getYears();
    }
}
