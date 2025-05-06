package com.apaman.apaman_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apaman.apaman_backend.model.Asociado;

@Repository
public interface AsociadoRepository extends JpaRepository<Asociado, Integer> {

    // -------------------------
    // BÚSQUEDAS EXACTAS
    // -------------------------

    /** Cédula exacta */
    List<Asociado> findByCedula(Integer cedula);

    /** Nombre exacto (ignore case) */
    List<Asociado> findByNombreIgnoreCase(String nombre);

    /** Cédula o nombre exactos (ignore case en nombre) */
    List<Asociado> findByCedulaOrNombreIgnoreCase(Integer cedula, String nombre);


    // -------------------------
    // BÚSQUEDAS PARCIALES
    // -------------------------

    /** Nombre contenga (ignore case) */
    List<Asociado> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Cédula parcial (transformada a cadena)
     * Nota: puede requerir soporte de tu dialecto JPA para función de conversión a String.
     */
    @Query("SELECT a FROM Asociado a WHERE str(a.cedula) LIKE %:cedula%")
    List<Asociado> findByCedulaContaining(@Param("cedula") String cedula);

    /**
     * Cédula parcial o nombre parcial (ignore case en nombre)
     */
    @Query("""
        SELECT a FROM Asociado a
         WHERE str(a.cedula) LIKE %:cedula%
           OR lower(a.nombre) LIKE lower(concat('%', :nombre, '%'))
        """)
    List<Asociado> findByCedulaContainingOrNombreContainingIgnoreCase(
        @Param("cedula") String cedula,
        @Param("nombre") String nombre
    );
}
