package com.apaman.apaman_backend.repository;

import com.apaman.apaman_backend.model.ActaAsociado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para {@link ActaAsociado}.
 * <p>
 *  • PK = {@code String asociadoCedula} (mismo valor que la cédula del asociado).<br>
 *  • Permite búsquedas por cédula, número de acta/acuerdo y rangos de fechas.
 */
public interface ActaAsociadoRepository extends JpaRepository<ActaAsociado, String> {

    /*───────────────────────────────────────────────
     * Consultas derivadas
     *───────────────────────────────────────────────*/

    /** Obtiene (máx. 1) acta vinculada a un asociado por su cédula. */
    Optional<ActaAsociado> findByAsociadoCedula(String cedula);

    /** Busca un acta exacta por número de acta y de acuerdo. */
    Optional<ActaAsociado> findByNumActaAndNumAcuerdo(String numActa, String numAcuerdo);

    /** Lista actas cuyo número contiene la secuencia indicada (ignore‑case). */
    List<ActaAsociado> findByNumActaContainingIgnoreCase(String fragmento);

    /*───────────────────────────────────────────────
     * Consultas JPQL personalizadas
     *───────────────────────────────────────────────*/

    /** Actas cuya fechaSolicitud ∈ [inicio, fin]. */
    @Query("""
           SELECT a
             FROM ActaAsociado a
            WHERE a.fechaSolicitud BETWEEN :inicio AND :fin
            ORDER BY a.fechaSolicitud
           """)
    List<ActaAsociado> findByFechaSolicitudBetween(@Param("inicio") LocalDate inicio,
                                                   @Param("fin")    LocalDate fin);

    /** Acta de un asociado dentro de un rango de fechas (normalmente 0 o 1 resultado). */
    @Query("""
           SELECT a
             FROM ActaAsociado a
            WHERE a.asociado.cedula = :cedula
              AND a.fechaSolicitud BETWEEN :inicio AND :fin
           """)
    Optional<ActaAsociado> findByCedulaAndFechaBetween(@Param("cedula") String cedula,
                                                       @Param("inicio") LocalDate inicio,
                                                       @Param("fin")    LocalDate fin);
}
