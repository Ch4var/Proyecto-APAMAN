package com.apaman.apaman_backend.service;

import java.util.List;

import com.apaman.apaman_backend.model.Asociado;

public interface AsociadoService {
    Asociado createAsociado(Asociado asociado);
    Asociado updateAsociado(Integer cedula, Asociado asociado);
    Asociado getAsociado(Integer cedula);
    List<Asociado> getAllAsociados();
    void deleteAsociado(Integer cedula);

    /**
     * Busca asociados por cédula y/o nombre.
     * @param cedulaFragment si es numérico se buscará exacto (partial=false) o parcial; si no, sólo por nombre
     * @param nombre cadena a buscar en nombre
     * @param partial true = búsquedas con LIKE; false = búsquedas exactas
     */
    List<Asociado> searchAsociados(String cedulaFragment, String nombre, boolean partial);
}
