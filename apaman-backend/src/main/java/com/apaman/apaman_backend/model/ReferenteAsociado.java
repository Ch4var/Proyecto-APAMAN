package com.apaman.apaman_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "referente_asociado",
       uniqueConstraints = @UniqueConstraint(columnNames = {"asociado_cedula", "referente_cedula"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferenteAsociado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asociado_cedula", nullable = false)
    private Asociado asociado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referente_cedula", nullable = false)
    private Asociado referente;

    @AssertTrue(message = "El referente no puede ser el mismo asociado")
    public boolean isValidReferente() {
        return asociado != null && referente != null
               && !asociado.getCedula().equals(referente.getCedula());
    }
}
