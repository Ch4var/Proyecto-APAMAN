package com.apaman.apaman_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apaman.apaman_backend.model.Asociado;

/**
 * Interfaz de acceso a datos para la entidad Asociado.
 * Provee métodos de búsqueda por cédula y nombre, tanto exactas como parciales.
 */
@Repository
public interface AsociadoRepository extends JpaRepository<Asociado, String> {

    /**
     * Busca asociados cuya cédula coincide exactamente (ignore case).
     * @param cedula la cédula a buscar
     * @return lista de asociados con cédula exacta
     */
    List<Asociado> exactByCedula(String cedula);

    /**
     * Busca asociados cuyo nombre coincide exactamente (ignore case).
     * @param nombre el nombre a buscar
     * @return lista de asociados con nombre exacto
     */
    List<Asociado> exactByNombre(String nombre);

    /**
     * Busca asociados cuya cédula contiene la cadena dada (ignore case).
     * @param cedula fragmento de cédula
     * @return lista de asociados con coincidencia parcial en cédula
     */
    List<Asociado> partialByCedula(String cedula);

    /**
     * Busca asociados cuyo nombre contiene la cadena dada (ignore case).
     * @param nombre fragmento de nombre
     * @return lista de asociados con coincidencia parcial en nombre
     */
    List<Asociado> partialByNombre(String nombre);

    /**
     * Busca asociados cuya cédula o nombre coinciden exactamente (ignore case).
     * @param cedula la cédula exacta
     * @param nombre el nombre exacto
     * @return lista de asociados que cumplen cualquiera de los criterios exactos
     */
    List<Asociado> exact(String cedula, String nombre);

    /**
     * Busca asociados cuya cédula o nombre contienen la cadena dada (ignore case).
     * @param cedula fragmento de cédula
     * @param nombre fragmento de nombre
     * @return lista de asociados con coincidencia parcial en cualquiera de los campos
     */
    List<Asociado> partial(String cedula, String nombre);
}
