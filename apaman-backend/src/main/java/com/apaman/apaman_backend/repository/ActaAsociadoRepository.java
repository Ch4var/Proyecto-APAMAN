package com.apaman.apaman_backend.repository;

import com.apaman.apaman_backend.model.ActaAsociado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

/**
 * Repositorio JPA para la entidad {@link ActaAsociado}.
 * <p>
 *  • PK = {@code Long id} (AUTO_INCREMENT).<br>
 *  • Permite búsquedas por cédula del asociado, por número de acta/acuerdo
 *    y por rangos de fechas de sesión.
 */
public interface ActaAsociadoRepository extends JpaRepository<ActaAsociado, Long> {

    /*───────────────────────────────────────────────
     * Consultas derivadas
     *───────────────────────────────────────────────*/

    /** Lista todas las actas de un asociado por cédula (orden cronológico). */
    List<ActaAsociado> findByAsociadoCedulaOrderByFechaSesionAsc(String cedula);

    /** Obtiene acta específica por número de acta y acuerdo. */
    ActaAsociado findByNumActaAndNumAcuerdo(String numActa, String numAcuerdo);

    /** Lista actas cuyo número contenga la secuencia indicada (LIKE %num%). */
    List<ActaAsociado> findByNumActaContaining(String numActa);

    /*───────────────────────────────────────────────
     * Consultas JPQL personalizadas
     *───────────────────────────────────────────────*/

    /** Actas celebradas en el rango [inicio, fin] (inclusive). */
    @Query("""
           SELECT a
           FROM ActaAsociado a
           WHERE a.fechaSesion BETWEEN :inicio AND :fin
           ORDER BY a.fechaSesion
           """)
    List<ActaAsociado> findByFechaSesionBetween(@Param("inicio") LocalDate inicio,
                                                @Param("fin")    LocalDate fin);

    /** Actas de un asociado dentro de un rango de fechas. */
    @Query("""
           SELECT a
           FROM ActaAsociado a
           WHERE a.asociado.cedula = :cedula
             AND a.fechaSesion BETWEEN :inicio AND :fin
           ORDER BY a.fechaSesion
           """)
    List<ActaAsociado> findByCedulaAndFechaBetween(@Param("cedula") String cedula,
                                                   @Param("inicio") LocalDate inicio,
                                                   @Param("fin")    LocalDate fin);
}
