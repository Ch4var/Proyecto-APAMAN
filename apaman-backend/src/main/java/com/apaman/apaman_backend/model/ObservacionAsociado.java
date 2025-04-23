package com.apaman.apaman_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "observacion_asociado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ObservacionAsociado {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
  
    @Column(name = "contenido", columnDefinition = "TEXT", nullable = false)
    private String observacion;
  
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asociado_cedula", nullable = false)
    private Asociado asociado;
  
  }
