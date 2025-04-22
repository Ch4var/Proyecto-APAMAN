package com.apaman.apaman_backend.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import org.springframework.stereotype.Service;

import com.apaman.apaman_backend.model.Asociado;
import com.apaman.apaman_backend.repository.AsociadoRepository;
import com.apaman.apaman_backend.service.AsociadoService;

@Service
public class AsociadoServiceImpl implements AsociadoService {

    private final AsociadoRepository repository;

    public AsociadoServiceImpl(AsociadoRepository repository) {
        this.repository = repository;
    }

    @Override
    public Asociado createAsociado(Asociado asociado) {
        actualizarEdad(asociado);
        return repository.save(asociado);
    }

    @Override
    public Asociado updateAsociado(String cedula, Asociado updated) {
        Asociado existing = repository.findById(cedula)
                .orElseThrow(() -> new IllegalArgumentException("Asociado no encontrado"));

        // Actualizar campos
        existing.setNombre(updated.getNombre());
        existing.setSexo(updated.getSexo());
        existing.setFechaNacimiento(updated.getFechaNacimiento());
        existing.setFechaAsociacion(updated.getFechaAsociacion());
        existing.setFechaSesion(updated.getFechaSesion());
        existing.setNumActa(updated.getNumActa());
        existing.setNumAcuerdo(updated.getNumAcuerdo());
        existing.setCuotaMensual(updated.getCuotaMensual());
        existing.setEstado(updated.getEstado());

        // Morosidad: si cambió a no moroso, resetear adeudos
        if (existing.getEstadoMorosidad() && !updated.getEstadoMorosidad()) {
            updated.setMesesAdeudo(0);
            updated.setCantidadAdeudo(BigDecimal.ZERO);
        }
        existing.setEstadoMorosidad(updated.getEstadoMorosidad());
        existing.setMesesAdeudo(updated.getMesesAdeudo());
        existing.setCantidadAdeudo(updated.getCantidadAdeudo());

        existing.setCorreo(updated.getCorreo());
        existing.setTelefono(updated.getTelefono());
        existing.setDireccion(updated.getDireccion());

        // Recalcular edad
        actualizarEdad(existing);

        return repository.save(existing);
    }

    @Override
    public Asociado getAsociado(String cedula) {
        return repository.findById(cedula)
                .orElseThrow(() -> new IllegalArgumentException("Asociado no encontrado"));
    }

    @Override
    public List<Asociado> getAllAsociados() {
        return repository.findAll();
    }

    @Override
    public void deleteAsociado(String cedula) {
        repository.deleteById(cedula);
    }

    // Lógica de negocio: calcular edad
    private void actualizarEdad(Asociado a) {
        if (a.getFechaNacimiento() != null) {
            int years = Period.between(a.getFechaNacimiento(), LocalDate.now()).getYears();
            a.setEdad(years);
        }
    }
}
