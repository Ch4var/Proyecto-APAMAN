package com.apaman.apaman_backend.repository;

import com.apaman.apaman_backend.model.ReferenteAsociado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la relación «referente» entre asociados.
 *
 *  • PK = {@code Long id}.<br>
 *  • Incluye búsquedas por cédula del asociado principal y del referente.<br>
 *  • Métodos de conveniencia para validar si ya existe una relación.
 */
public interface ReferenteAsociadoRepository extends JpaRepository<ReferenteAsociado, Long> {

    /*───────────────────────────────────────────────
     * Consultas derivadas simples
     *───────────────────────────────────────────────*/

    /** Todas las referencias que tiene un asociado (por su cédula). */
    List<ReferenteAsociado> findByAsociadoCedula(String cedula);

    /** Todos los asociados a los que una persona sirve de referente. */
    List<ReferenteAsociado> findByReferenteCedula(String cedula);

    /** Relación exacta asociado‑referente (si existe). */
    Optional<ReferenteAsociado> findByAsociadoCedulaAndReferenteCedula(String asociadoCedula,
                                                                       String referenteCedula);

    /** Verifica existencia de la relación sin necesidad de traer la entidad. */
    boolean existsByAsociadoCedulaAndReferenteCedula(String asociadoCedula,
                                                     String referenteCedula);

    /*───────────────────────────────────────────────
     * Consultas JPQL con JOIN FETCH (evita N+1)
     *───────────────────────────────────────────────*/

    /**
     * Devuelve las relaciones del asociado con la entidad
     * referente cargada (eager) en la misma consulta.
     */
    @Query("""
           SELECT r
           FROM ReferenteAsociado r
           JOIN FETCH r.referente
           WHERE r.asociado.cedula = :cedula
           """)
    List<ReferenteAsociado> fetchReferentesByAsociado(@Param("cedula") String asociadoCedula);

    /**
     * Devuelve las relaciones donde una persona actúa como referente,
     * cargando el asociado principal en la misma consulta.
     */
    @Query("""
           SELECT r
           FROM ReferenteAsociado r
           JOIN FETCH r.asociado
           WHERE r.referente.cedula = :cedula
           """)
    List<ReferenteAsociado> fetchAsociadosByReferente(@Param("cedula") String referenteCedula);
}
