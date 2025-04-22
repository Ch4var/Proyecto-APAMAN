package com.apaman.apaman_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "referente_asociado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReferenteAsociado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asociado_cedula", nullable = false)
    private Asociado asociado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referente_cedula", nullable = false)
    private Asociado referente;
}
