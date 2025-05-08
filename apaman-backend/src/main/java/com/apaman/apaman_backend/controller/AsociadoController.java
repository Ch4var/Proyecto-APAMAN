package com.apaman.apaman_backend.controller;

import com.apaman.apaman_backend.dto.AsociadoAltaDTO;
import com.apaman.apaman_backend.model.*;
import com.apaman.apaman_backend.repository.*;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/asociados")
@CrossOrigin("http://localhost:3000")
public class AsociadoController {

    /* Repositorios */
    @Autowired private AsociadoRepository           asociadoRepo;
    @Autowired private ActaAsociadoRepository       actaRepo;
    @Autowired private ReferenteAsociadoRepository  refRepo;
    @Autowired private ObservacionAsociadoRepository obsRepo;

    /*───────────────────────────────  CRUD  ───────────────────────────────*/

    /** Alta de asociado + acta (DTO unificado). */
    @PostMapping
    @Transactional
    public Asociado create(@RequestBody @Valid AsociadoAltaDTO dto) {

        if (asociadoRepo.existsById(dto.getCedula())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Ya existe un asociado con la cédula " + dto.getCedula());
        }
        /* 1) Construir entidades desde el DTO */
        Asociado asociado = dto.toAsociado();
        ActaAsociado acta = dto.toActaAsociado(asociado);

        /* 2) Persistir (cascade = ALL en @OneToOne basta) */
        asociadoRepo.save(asociado);   // salva el acta también
        return asociado;
    }

    @GetMapping
    public List<Asociado> findAll() { return asociadoRepo.findAll(); }

    @GetMapping("/{cedula}")
    public Asociado findById(@PathVariable String cedula) {
        return asociadoRepo.findById(cedula)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Asociado no encontrado: " + cedula));
    }

    /** Actualiza datos del asociado (no toca acta). */
    @PutMapping("/{cedula}")
    public Asociado update(@PathVariable String cedula,
                           @RequestBody @Valid Asociado body) {
        Asociado a = findById(cedula);

        /* copiar campos permitidos */
        a.setNombre(body.getNombre());
        a.setApellido1(body.getApellido1());
        a.setApellido2(body.getApellido2());
        a.setSexo(body.getSexo());
        a.setFechaNacimiento(body.getFechaNacimiento());
        a.setCuotaMensual(body.getCuotaMensual());
        a.setEstadoMorosidad(body.getEstadoMorosidad());
        a.setMesesAdeudo(body.getMesesAdeudo());
        a.setCantidadAdeudo(body.getCantidadAdeudo());
        a.setCorreo(body.getCorreo());
        a.setTelefono(body.getTelefono());
        a.setDireccion(body.getDireccion());
        a.setEstado(body.getEstado());

        return asociadoRepo.save(a);
    }

    @DeleteMapping("/{cedula}")
    public ResponseEntity<Void> delete(@PathVariable String cedula) {
        if (!asociadoRepo.existsById(cedula)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Asociado no encontrado: " + cedula);
        }
        asociadoRepo.deleteById(cedula);
        return ResponseEntity.noContent().build();
    }

    /*──────────────────────────  BÚSQUEDAS  ──────────────────────────*/

    @GetMapping("/search")
    public List<Asociado> search(@RequestParam(required = false) String cedula,
                                 @RequestParam(required = false) String nombre) {

        if (cedula != null && !cedula.isBlank()) {
            if (nombre != null && !nombre.isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Solo cédula o nombre, no ambos.");
            }
            return asociadoRepo.findByCedulaContaining(cedula);
        }
        if (nombre != null && !nombre.isBlank()) {
            return asociadoRepo.findByNombreContainingIgnoreCase(nombre);
        }
        return asociadoRepo.findAll();
    }

    /*────────────────────────  OBSERVACIONES  ───────────────────────*/

    @GetMapping("/{cedula}/observaciones")
    public List<ObservacionAsociado> listarObs(@PathVariable String cedula) {
        return obsRepo.findByAsociadoCedulaOrderByFechaDesc(cedula);
    }

    @PostMapping("/{cedula}/observaciones")
    public ObservacionAsociado addObs(@PathVariable String cedula,
                                      @RequestBody @Valid ObservacionDTO dto) {
        Asociado a = findById(cedula);
        ObservacionAsociado obs = ObservacionAsociado.builder()
                .asociado(a)
                .observacion(dto.getObservacion())
                .build();
        return obsRepo.save(obs);
    }

    @PutMapping("/{cedula}/observaciones/{id}")
    public ObservacionAsociado editObs(@PathVariable String cedula,
                                       @PathVariable Long id,
                                       @RequestBody @Valid ObservacionDTO dto) {
        ObservacionAsociado obs = obsRepo.findById(id)
                .filter(o -> o.getAsociado().getCedula().equals(cedula))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Observación no encontrada."));
        obs.setObservacion(dto.getObservacion());
        return obsRepo.save(obs);
    }

    @DeleteMapping("/{cedula}/observaciones/{id}")
    public ResponseEntity<Void> delObs(@PathVariable String cedula,
                                       @PathVariable Long id) {
        ObservacionAsociado obs = obsRepo.findById(id)
                .filter(o -> o.getAsociado().getCedula().equals(cedula))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Observación no encontrada."));
        obsRepo.delete(obs);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class ObservacionDTO { @NotBlank private String observacion; }

    /*──────────────────────────────  ACTA  ───────────────────────────*/

    /** Devuelve el acta única del asociado (404 si no existe). */
    @GetMapping("/{cedula}/acta")
    public ActaAsociado getActa(@PathVariable String cedula) {
        return actaRepo.findByAsociadoCedula(cedula)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Acta no encontrada."));
    }

    /** Crea el acta (si ya existe, 409). */
    @PostMapping("/{cedula}/acta")
    public ActaAsociado crearActa(@PathVariable String cedula,
                                  @RequestBody @Valid ActaDTO dto) {

        if (actaRepo.findByAsociadoCedula(cedula).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "El asociado ya posee un acta.");
        }
        Asociado a = findById(cedula);

        ActaAsociado acta = ActaAsociado.builder()
                .asociado(a)
                .asociadoCedula(cedula)
                .fechaSolicitud(dto.getFechaSesion())
                .fechaAprobacion(dto.getFechaSesion())
                .numActa(dto.getNumActa())
                .numAcuerdo(dto.getNumAcuerdo())
                .build();

        return actaRepo.save(acta);
    }

    /** Edita el acta existente. */
    @PutMapping("/{cedula}/acta")
    public ActaAsociado editarActa(@PathVariable String cedula,
                                   @RequestBody @Valid ActaDTO dto) {

        ActaAsociado acta = actaRepo.findByAsociadoCedula(cedula)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Acta no encontrada."));

        acta.setFechaSolicitud(dto.getFechaSesion());
        acta.setFechaAprobacion(dto.getFechaSesion());
        acta.setNumActa(dto.getNumActa());
        acta.setNumAcuerdo(dto.getNumAcuerdo());

        return actaRepo.save(acta);
    }

    @DeleteMapping("/{cedula}/acta")
    public ResponseEntity<Void> borrarActa(@PathVariable String cedula) {
        ActaAsociado acta = actaRepo.findByAsociadoCedula(cedula)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Acta no encontrada."));
        actaRepo.delete(acta);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class ActaDTO {
        @NotBlank private String numActa;
        @NotBlank private String numAcuerdo;
        private LocalDate fechaSesion = LocalDate.now();
    }

    /*────────────────────────  REFERENTES  ──────────────────────────*/

    @GetMapping("/{cedula}/referentes")
    public List<ReferenteAsociado> listarRef(@PathVariable String cedula) {
        return refRepo.fetchReferentesByAsociado(cedula);
    }

    @PostMapping("/{cedula}/referentes/{refCedula}")
    public ReferenteAsociado addRef(@PathVariable String cedula,
                                    @PathVariable String refCedula) {

        if (cedula.equals(refCedula)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Un asociado no puede ser su propio referente.");
        }
        if (refRepo.existsByAsociadoCedulaAndReferenteCedula(cedula, refCedula)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "El referente ya está asignado.");
        }

        Asociado asociado  = findById(cedula);
        Asociado referente = findById(refCedula);

        return refRepo.save(new ReferenteAsociado(null, asociado, referente));
    }

    @DeleteMapping("/{cedula}/referentes/{refCedula}")
    public ResponseEntity<Void> delRef(@PathVariable String cedula,
                                       @PathVariable String refCedula) {

        ReferenteAsociado rel = refRepo.findByAsociadoCedulaAndReferenteCedula(cedula, refCedula)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Relación no encontrada."));

        refRepo.delete(rel);
        return ResponseEntity.noContent().build();
    }
}
