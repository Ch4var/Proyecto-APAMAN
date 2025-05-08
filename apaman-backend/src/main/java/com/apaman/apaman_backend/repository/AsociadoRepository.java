package com.apaman.apaman_backend.repository;

import com.apaman.apaman_backend.model.Asociado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad {@link Asociado}.
 * <p>
 *  • La clave primaria es la cédula (String de 9 dígitos).
 *  • Incluye búsquedas exactas y por coincidencia parcial de cédula y nombre.
 */
public interface AsociadoRepository extends JpaRepository<Asociado, String> {

    /** Búsqueda exacta por cédula. */
    Optional<Asociado> findByCedula(String cedula);

    /** Búsqueda por coincidencia parcial de cédula (LIKE %cedula%). */
    @Query("SELECT a FROM Asociado a WHERE a.cedula LIKE %:cedula%")
    List<Asociado> findByCedulaContaining(@Param("cedula") String cedula);

    /** Búsqueda por coincidencia parcial (insensible a mayúsculas) del nombre. */
    @Query("SELECT a FROM Asociado a WHERE LOWER(a.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Asociado> findByNombreContainingIgnoreCase(@Param("nombre") String nombre);
}
