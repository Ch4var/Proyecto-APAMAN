package com.apaman.apaman_backend.service;

import java.util.List;

import com.apaman.apaman_backend.model.Asociado;

public interface AsociadoService {
    Asociado createAsociado(Asociado asociado);
    Asociado updateAsociado(String cedula, Asociado asociado);
    Asociado getAsociado(String cedula);
    List<Asociado> getAllAsociados();
    void deleteAsociado(String cedula);
    List<Asociado> searchAsociados(String cedula, String nombre, boolean partial);
}
