package com.apaman.apaman_backend.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.apaman.apaman_backend.model.ActaAsociado;
import com.apaman.apaman_backend.model.Asociado;
import com.apaman.apaman_backend.repository.AsociadoRepository;
import com.apaman.apaman_backend.service.AsociadoService;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class AsociadoServiceImpl implements AsociadoService {

    private final AsociadoRepository repository;

    public AsociadoServiceImpl(AsociadoRepository repository) {
        this.repository = repository;
    }

    @Override
    public Asociado createAsociado(Asociado asociado) {
        if (repository.existsById(asociado.getCedula())) {
            throw new IllegalArgumentException("Ya existe un asociado con cédula " + asociado.getCedula());
        }
        // inicializar adeudos
        asociado.setMesesAdeudo(0);
        asociado.setCantidadAdeudo(BigDecimal.ZERO);
        // recalcular edad
        recalcularEdad(asociado);
        return repository.save(asociado);
    }

    @Override
    public Asociado updateAsociado(Integer cedula, Asociado updated) {
        Asociado existing = repository.findById(cedula)
            .orElseThrow(() -> new EntityNotFoundException("Asociado no encontrado (cédula " + cedula + ")"));

        // — Datos personales y de asociación —
        existing.setNombre(updated.getNombre());
        existing.setApellido1(updated.getApellido1());
        existing.setApellido2(updated.getApellido2());
        existing.setSexo(updated.getSexo());
        existing.setFechaNacimiento(updated.getFechaNacimiento());
        existing.setFechaAsociacion(updated.getFechaAsociacion());

        // Sincronizar ActaAsociado
        ActaAsociado actaExistente = existing.getActaAsociado();
        ActaAsociado actaNueva = updated.getActaAsociado();
        if (actaNueva != null) {
            actaExistente.setFechaSesion(actaNueva.getFechaSesion());
            actaExistente.setNumActa(actaNueva.getNumActa());
            actaExistente.setNumAcuerdo(actaNueva.getNumAcuerdo());
        }

        // — Datos financieros —
        existing.setCuotaMensual(updated.getCuotaMensual());
        existing.setEstado(updated.getEstado());

        // Si marcamos de moroso→no moroso, reseteamos adeudo
        if (existing.getEstadoMorosidad() && !updated.getEstadoMorosidad()) {
            existing.setMesesAdeudo(0);
            existing.setCantidadAdeudo(BigDecimal.ZERO);
        }
        existing.setEstadoMorosidad(updated.getEstadoMorosidad());
        existing.setMesesAdeudo(updated.getMesesAdeudo());
        existing.setCantidadAdeudo(updated.getCantidadAdeudo());

        // — Contacto / dirección —
        existing.setCorreo(updated.getCorreo());
        existing.setTelefono(updated.getTelefono());
        existing.setDireccion(updated.getDireccion());

        // — Observaciones (reemplaza lista completa si viene) —
        if (updated.getObservaciones() != null) {
            existing.getObservaciones().clear();
            existing.getObservaciones().addAll(
                updated.getObservaciones().stream()
                       .peek(obs -> obs.setAsociado(existing))
                       .collect(Collectors.toList())
            );
        }

        // — Referentes (reemplaza lista completa si viene) —
        if (updated.getReferentes() != null) {
            existing.getReferentes().clear();
            existing.getReferentes().addAll(
                updated.getReferentes().stream()
                       .peek(ref -> ref.setAsociado(existing))
                       .collect(Collectors.toList())
            );
        }

        // recalcular edad si cambió fechaNacimiento
        recalcularEdad(existing);
        return repository.save(existing);
    }

    @Override
    @Transactional(readOnly = true)
    public Asociado getAsociado(Integer cedula) {
        return repository.findById(cedula)
            .orElseThrow(() -> new EntityNotFoundException("Asociado no encontrado (cédula " + cedula + ")"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Asociado> getAllAsociados() {
        return repository.findAll();
    }

    @Override
    public void deleteAsociado(Integer cedula) {
        if (!repository.existsById(cedula)) {
            throw new EntityNotFoundException("No existe asociado con cédula " + cedula);
        }
        repository.deleteById(cedula);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Asociado> searchAsociados(String cedulaFragment, String nombre, boolean partial) {
        boolean hasCedula = StringUtils.hasText(cedulaFragment);
        boolean hasNombre = StringUtils.hasText(nombre);

        if (!hasCedula && !hasNombre) {
            return getAllAsociados();
        }

        if (partial) {
            if (hasCedula && hasNombre) {
                return repository.findByCedulaContainingOrNombreContainingIgnoreCase(cedulaFragment, nombre);
            } else if (hasCedula) {
                return repository.findByCedulaContaining(cedulaFragment);
            } else {
                return repository.findByNombreContainingIgnoreCase(nombre);
            }
        } else {
            if (hasCedula && hasNombre) {
                try {
                    Integer ced = Integer.valueOf(cedulaFragment);
                    return repository.findByCedulaOrNombreIgnoreCase(ced, nombre);
                } catch (NumberFormatException e) {
                    return repository.findByNombreIgnoreCase(nombre);
                }
            } else if (hasCedula) {
                try {
                    Integer ced = Integer.valueOf(cedulaFragment);
                    return repository.findByCedula(ced);
                } catch (NumberFormatException e) {
                    return List.of();
                }
            } else {
                return repository.findByNombreIgnoreCase(nombre);
            }
        }
    }

    /** Recalcula y asigna la edad en base a la fecha de nacimiento */
    private void recalcularEdad(Asociado a) {
        if (a.getFechaNacimiento() != null) {
            int años = Period.between(a.getFechaNacimiento(), LocalDate.now()).getYears();
            a.setEdad(años);
        }
    }
}
