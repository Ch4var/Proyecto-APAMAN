package com.apaman.apaman_backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Entidad que representa a un asociado en el sistema.
 * Basada en la tabla `asociado` de la BD.
 */
@Entity
@Table(name = "asociado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asociado {

    @Id
    @NotNull @Positive
    @Column(name = "cedula", nullable = false)
    private Integer cedula;

    @NotBlank @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotBlank @Size(max = 20)
    @Column(name = "apellido_1", nullable = false, length = 20)
    private String apellido1;

    @NotBlank @Size(max = 20)
    @Column(name = "apellido_2", nullable = false, length = 20)
    private String apellido2;

    public enum Sexo { Masculino, Femenina, Otro }

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Sexo sexo;

    @NotNull @Past
    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @NotNull @Min(0)
    @Column(nullable = false)
    private Integer edad;

    @NotNull
    @Column(nullable = false)
    private Boolean estado = true;

    @NotNull
    @Column(name = "fecha_asociacion", nullable = false)
    private LocalDate fechaAsociacion;

    /**
     * Relación One-to-One obligatoria:
     * este es el lado dueño de la relación.
     */
    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acta_asociado_id", nullable = false, unique = true)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private ActaAsociado actaAsociado;

    @NotNull @DecimalMin("0.00")
    @Column(name = "cuota_mensual", nullable = false, precision = 10, scale = 2)
    private BigDecimal cuotaMensual;

    @NotNull
    @Column(name = "estado_morosidad", nullable = false)
    private Boolean estadoMorosidad = false;

    @NotNull @Min(0)
    @Column(name = "meses_adeudo", nullable = false)
    private Integer mesesAdeudo = 0;

    @NotNull @DecimalMin("0.00")
    @Column(name = "cantidad_adeudo", nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidadAdeudo = BigDecimal.ZERO;

    @NotBlank @Email @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String correo;

    @NotNull
    @Column(nullable = false)
    private Integer telefono;

    @NotBlank @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String direccion;

    /**
     * Observaciones asociadas al asociado.
     */
    @OneToMany(mappedBy = "asociado", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private List<Observacion> observaciones = new ArrayList<>();

    /**
     * Referencias a los referentes de este asociado.
     */
    @OneToMany(mappedBy = "asociado", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private List<ReferenteAsociado> referentes = new ArrayList<>();

    /**
     * Asociados que tienen como referente a este asociado.
     */
    @OneToMany(mappedBy = "referente", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private List<ReferenteAsociado> asociadosReferidos = new ArrayList<>();
}
