package com.apaman.apaman_backend.controller;

import com.apaman.apaman_backend.model.*;
import com.apaman.apaman_backend.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Endpoints REST para gestionar el módulo de Asociados.
 * <p>
 * Rutas base: <b>/asociados</b>
 */
@RestController
@RequestMapping("/asociados")
@CrossOrigin("http://localhost:3000")
public class AsociadoController {

    // ──────────────────────────────────────────
    // Repositorios
    // ──────────────────────────────────────────
    @Autowired private AsociadoRepository asociadoRepo;
    @Autowired private ActaAsociadoRepository actaRepo;
    @Autowired private ReferenteAsociadoRepository refRepo;
    @Autowired private ObservacionAsociadoRepository obsRepo;

    // ──────────────────────────────────────────
    // CRUD básico
    // ──────────────────────────────────────────

    /** Crear asociado */
    @PostMapping
    public Asociado createAsociado(@RequestBody @Valid Asociado nuevo) {
        if (asociadoRepo.existsById(nuevo.getCedula())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Ya existe un asociado con la cédula " + nuevo.getCedula());
        }
        return asociadoRepo.save(nuevo);
    }

    /** Listar todos los asociados */
    @GetMapping
    public List<Asociado> getAllAsociados() {
        return asociadoRepo.findAll();
    }

    /** Buscar asociado por cédula */
    @GetMapping("/{cedula}")
    public Asociado getByCedula(@PathVariable String cedula) {
        return asociadoRepo.findById(cedula)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Asociado no encontrado: " + cedula));
    }

    /** Actualizar asociado */
    @PutMapping("/{cedula}")
    public Asociado updateAsociado(
            @PathVariable String cedula,
            @RequestBody @Valid Asociado datos) {

        Asociado a = asociadoRepo.findById(cedula)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Asociado no encontrado: " + cedula));

        // Copiar campos
        a.setNombre(datos.getNombre());
        a.setApellido1(datos.getApellido1());
        a.setApellido2(datos.getApellido2());
        a.setSexo(datos.getSexo());
        a.setFechaNacimiento(datos.getFechaNacimiento());
        a.setFechaAsociacion(datos.getFechaAsociacion());
        a.setCuotaMensual(datos.getCuotaMensual());
        a.setEstadoMorosidad(datos.getEstadoMorosidad());
        a.setMesesAdeudo(datos.getMesesAdeudo());
        a.setCantidadAdeudo(datos.getCantidadAdeudo());
        a.setCorreo(datos.getCorreo());
        a.setTelefono(datos.getTelefono());
        a.setDireccion(datos.getDireccion());
        a.setEstado(datos.getEstado());

        return asociadoRepo.save(a);
    }

    /** Eliminar asociado */
    @DeleteMapping("/{cedula}")
    public ResponseEntity<Void> deleteAsociado(@PathVariable String cedula) {
        if (!asociadoRepo.existsById(cedula)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Asociado no encontrado: " + cedula);
        }
        asociadoRepo.deleteById(cedula);
        return ResponseEntity.noContent().build();
    }

    // ──────────────────────────────────────────
    // Búsquedas
    // ──────────────────────────────────────────

    @GetMapping("/search")
    public List<Asociado> search(
            @RequestParam(required = false) String cedula,
            @RequestParam(required = false) String nombre) {

        if (cedula != null && !cedula.isBlank()) {
            if (nombre != null && !nombre.isBlank()) {
                throw new IllegalArgumentException("Solo se puede buscar por cédula o por nombre, no ambos.");
            }
            return asociadoRepo.findByCedulaContaining(cedula);
        }
        if (nombre != null && !nombre.isBlank()) {
            return asociadoRepo.findByNombreContainingIgnoreCase(nombre);
        }
        return asociadoRepo.findAll();
    }

    // ──────────────────────────────────────────
    // Observaciones
    // ──────────────────────────────────────────

    @GetMapping("/{cedula}/observaciones")
    public List<ObservacionAsociado> listarObservaciones(@PathVariable String cedula) {
        return obsRepo.findByAsociadoCedulaOrderByFechaDesc(cedula);
    }

    @PostMapping("/{cedula}/observaciones")
    public ObservacionAsociado agregarObservacion(
            @PathVariable String cedula,
            @RequestBody @Valid ObservacionDTO dto) {

        Asociado a = getByCedula(cedula);
        ObservacionAsociado obs = ObservacionAsociado.builder()
                .asociado(a)
                .observacion(dto.getObservacion())
                .build();
        return obsRepo.save(obs);
    }

    @PutMapping("/{cedula}/observaciones/{obsId}")
    public ObservacionAsociado editarObservacion(
            @PathVariable String cedula,
            @PathVariable Long obsId,
            @RequestBody @Valid ObservacionDTO dto) {

        ObservacionAsociado obs = obsRepo.findById(obsId)
                .filter(o -> o.getAsociado().getCedula().equals(cedula))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Observación no encontrada: " + obsId));

        obs.setObservacion(dto.getObservacion());
        return obsRepo.save(obs);
    }

    @DeleteMapping("/{cedula}/observaciones/{obsId}")
    public ResponseEntity<Void> borrarObservacion(
            @PathVariable String cedula,
            @PathVariable Long obsId) {

        ObservacionAsociado obs = obsRepo.findById(obsId)
                .filter(o -> o.getAsociado().getCedula().equals(cedula))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Observación no encontrada: " + obsId));

        obsRepo.delete(obs);
        return ResponseEntity.noContent().build();
    }

    // DTO interno
    @Data
    public static class ObservacionDTO {
        @NotBlank
        private String observacion;
    }

    // ──────────────────────────────────────────
    // Actas
    // ──────────────────────────────────────────

    @GetMapping("/{cedula}/actas")
    public List<ActaAsociado> listarActas(@PathVariable String cedula) {
        return actaRepo.findByAsociadoCedulaOrderByFechaSesionAsc(cedula);
    }

    @PostMapping("/{cedula}/actas")
    public ActaAsociado crearActa(
            @PathVariable String cedula,
            @RequestBody @Valid ActaDTO dto) {

        Asociado a = getByCedula(cedula);

        ActaAsociado acta = new ActaAsociado(
                null,
                dto.getFechaSesion(),
                dto.getNumActa(),
                dto.getNumAcuerdo(),
                a
        );
        return actaRepo.save(acta);
    }

    @PutMapping("/{cedula}/actas/{actaId}")
    public ActaAsociado editarActa(
            @PathVariable String cedula,
            @PathVariable Long actaId,
            @RequestBody @Valid ActaDTO dto) {

        ActaAsociado acta = actaRepo.findById(actaId)
                .filter(ac -> ac.getAsociado().getCedula().equals(cedula))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Acta no encontrada: " + actaId));

        acta.setFechaSesion(dto.getFechaSesion());
        acta.setNumActa(dto.getNumActa());
        acta.setNumAcuerdo(dto.getNumAcuerdo());

        return actaRepo.save(acta);
    }

    @DeleteMapping("/{cedula}/actas/{actaId}")
    public ResponseEntity<Void> borrarActa(
            @PathVariable String cedula,
            @PathVariable Long actaId) {

        ActaAsociado acta = actaRepo.findById(actaId)
                .filter(ac -> ac.getAsociado().getCedula().equals(cedula))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Acta no encontrada: " + actaId));

        actaRepo.delete(acta);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class ActaDTO {
        @NotBlank private String numActa;
        @NotBlank private String numAcuerdo;
        private LocalDate fechaSesion = LocalDate.now();
    }

    // ──────────────────────────────────────────
    // Referentes
    // ──────────────────────────────────────────

    @GetMapping("/{cedula}/referentes")
    public List<ReferenteAsociado> listarReferentes(@PathVariable String cedula) {
        return refRepo.fetchReferentesByAsociado(cedula);
    }

    @PostMapping("/{cedula}/referentes/{refCedula}")
    public ReferenteAsociado agregarReferente(
            @PathVariable String cedula,
            @PathVariable String refCedula) {

        if (refRepo.existsByAsociadoCedulaAndReferenteCedula(cedula, refCedula)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "El referente ya está asignado.");
        }
        if (cedula.equals(refCedula)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Un asociado no puede ser su propio referente.");
        }

        Asociado asociado = getByCedula(cedula);
        Asociado referente = getByCedula(refCedula);

        ReferenteAsociado rel = new ReferenteAsociado(null, asociado, referente);
        return refRepo.save(rel);
    }

    @DeleteMapping("/{cedula}/referentes/{refCedula}")
    public ResponseEntity<Void> borrarReferente(
            @PathVariable String cedula,
            @PathVariable String refCedula) {

        ReferenteAsociado rel = refRepo.findByAsociadoCedulaAndReferenteCedula(cedula, refCedula)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Relación asociado‑referente no encontrada."));

        refRepo.delete(rel);
        return ResponseEntity.noContent().build();
    }
}
