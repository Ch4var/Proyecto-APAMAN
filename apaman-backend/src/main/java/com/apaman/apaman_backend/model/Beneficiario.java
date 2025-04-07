package com.apaman.apaman_backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.Period;

@Entity
@Table(name = "beneficiarios")
public class Beneficiario {

    @Id
    private Long cedula;

    private String nombre;

    private String sexo;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Transient
    private Integer edad;

    private String religion;

    @Column(name = "grado_escolaridad")
    private String gradoEscolaridad;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_dependencia")
    private Dependencia estadoDependencia;

    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;

    @Lob
    private byte[] foto;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    @Column(name = "info_contacto")
    private String infoContacto;

    // Información de la persona responsable
    @Column(name = "persona_responsable")
    private String personaResponsable;

    @Column(name = "telefono_responsable")
    private String telefonoResponsable;

    @Column(name = "direccion_responsable")
    private String direccionResponsable;

    @Column(name = "info_financiera")
    private String infoFinanciera;

    private String pensionado;

    private Double presupuesto;

    @Column(length = 1000)
    private String observaciones;

    public Integer getEdad() {
        if (fechaNacimiento == null) {
            return null;
        }
        return Period.between(fechaNacimiento, LocalDate.now()).getYears();
    }

    // Getters y setters
    public Long getCedula() {
        return cedula;
    }

    public void setCedula(Long cedula) {
        this.cedula = cedula;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public String getGradoEscolaridad() {
        return gradoEscolaridad;
    }

    public void setGradoEscolaridad(String gradoEscolaridad) {
        this.gradoEscolaridad = gradoEscolaridad;
    }

    public Dependencia getEstadoDependencia() {
        return estadoDependencia;
    }

    public void setEstadoDependencia(Dependencia estadoDependencia) {
        this.estadoDependencia = estadoDependencia;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public byte[] getFoto() {
        return foto;
    }

    public void setFoto(byte[] foto) {
        this.foto = foto;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public String getInfoContacto() {
        return infoContacto;
    }

    public void setInfoContacto(String infoContacto) {
        this.infoContacto = infoContacto;
    }

    public String getPersonaResponsable() {
        return personaResponsable;
    }

    public void setPersonaResponsable(String personaResponsable) {
        this.personaResponsable = personaResponsable;
    }

    public String getTelefonoResponsable() {
        return telefonoResponsable;
    }

    public void setTelefonoResponsable(String telefonoResponsable) {
        this.telefonoResponsable = telefonoResponsable;
    }

    public String getDireccionResponsable() {
        return direccionResponsable;
    }

    public void setDireccionResponsable(String direccionResponsable) {
        this.direccionResponsable = direccionResponsable;
    }

    public String getInfoFinanciera() {
        return infoFinanciera;
    }

    public void setInfoFinanciera(String infoFinanciera) {
        this.infoFinanciera = infoFinanciera;
    }

    public String getPensionado() {
        return pensionado;
    }

    public void setPensionado(String pensionado) {
        this.pensionado = pensionado;
    }

    public Double getPresupuesto() {
        return presupuesto;
    }

    public void setPresupuesto(Double presupuesto) {
        this.presupuesto = presupuesto;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
