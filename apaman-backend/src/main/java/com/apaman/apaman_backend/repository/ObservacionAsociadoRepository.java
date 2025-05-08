package com.apaman.apaman_backend.repository;

import com.apaman.apaman_backend.model.ObservacionAsociado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio JPA para las observaciones registradas sobre un {@code Asociado}.
 *
 * PK: {@code Long id}
 */
public interface ObservacionAsociadoRepository extends JpaRepository<ObservacionAsociado, Long> {

    /*─────────────────────────────
     * Consultas derivadas
     *────────────────────────────*/

    /** Todas las observaciones de un asociado, más recientes primero. */
    List<ObservacionAsociado> findByAsociadoCedulaOrderByFechaDesc(String cedula);

    /** Conteo rápido de observaciones de un asociado. */
    long countByAsociadoCedula(String cedula);
}
