package com.apaman.apaman_backend.service;

import com.apaman.apaman_backend.model.Asociado;
import java.util.List;

public interface AsociadoService {
    Asociado createAsociado(Asociado asociado);
    Asociado updateAsociado(String cedula, Asociado asociado);
    Asociado getAsociado(String cedula);
    List<Asociado> getAllAsociados();
    void deleteAsociado(String cedula);
}