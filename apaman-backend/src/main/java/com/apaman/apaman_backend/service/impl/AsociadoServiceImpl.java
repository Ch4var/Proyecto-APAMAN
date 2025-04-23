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
        // Actualizar campos básicos
        existing.setNombre(updated.getNombre());
        existing.setApellido1(updated.getApellido1());
        existing.setApellido2(updated.getApellido2());
        existing.setSexo(updated.getSexo());
        existing.setFechaNacimiento(updated.getFechaNacimiento());
        existing.setFechaAsociacion(updated.getFechaAsociacion());
        existing.setCuotaMensual(updated.getCuotaMensual());
        existing.setEstado(updated.getEstado());

        // Morosidad
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

    @Override
    public List<Asociado> searchAsociados(String cedula, String nombre, boolean partial) {
        boolean hasCedula = cedula != null && !cedula.isBlank();
        boolean hasNombre = nombre != null && !nombre.isBlank();
        if (!hasCedula && !hasNombre) {
            return getAllAsociados();
        }
        if (partial) {
            if (hasCedula && hasNombre) {
                return repository.partial(cedula, nombre);
            } else if (hasCedula) {
                return repository.partialByCedula(cedula);
            } else {
                return repository.partialByNombre(nombre);
            }
        } else {
            if (hasCedula && hasNombre) {
                return repository.exact(cedula, nombre);
            } else if (hasCedula) {
                return repository.exactByCedula(cedula);
            } else {
                return repository.exactByNombre(nombre);
            }
        }
    }

    // Recalcular edad basada en fecha de nacimiento
    private void actualizarEdad(Asociado a) {
        if (a.getFechaNacimiento() != null) {
            int years = Period.between(a.getFechaNacimiento(), LocalDate.now()).getYears();
            a.setEdad(years);
        }
    }
}
