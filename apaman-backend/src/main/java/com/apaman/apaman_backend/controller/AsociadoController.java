package com.apaman.apaman_backend.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import com.apaman.apaman_backend.model.Asociado;
import com.apaman.apaman_backend.service.AsociadoService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/asociados")
public class AsociadoController {

    private final AsociadoService service;

    public AsociadoController(AsociadoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Asociado>> obtenerTodos() {
        List<Asociado> lista = service.getAllAsociados();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{cedula}")
    public ResponseEntity<Asociado> obtenerPorCedula(@PathVariable Integer cedula) {
        try {
            Asociado a = service.getAsociado(cedula);
            return ResponseEntity.ok(a);
        } catch (EntityNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Asociado> crear(
            @Valid @RequestBody Asociado asociado,
            UriComponentsBuilder uriBuilder) {
        try {
            Asociado creado = service.createAsociado(asociado);
            URI location = uriBuilder
                .path("/api/asociados/{cedula}")
                .buildAndExpand(creado.getCedula())
                .toUri();
            return ResponseEntity.created(location).body(creado);
        } catch (IllegalArgumentException ex) {
            // caso de cédula duplicada
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        }
    }

    @PutMapping("/{cedula}")
    public ResponseEntity<Asociado> actualizar(
            @PathVariable Integer cedula,
            @Valid @RequestBody Asociado asociado) {
        try {
            Asociado actualizado = service.updateAsociado(cedula, asociado);
            return ResponseEntity.ok(actualizado);
        } catch (EntityNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @DeleteMapping("/{cedula}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer cedula) {
        try {
            service.deleteAsociado(cedula);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Asociado>> buscar(
            @RequestParam(required = false) String cedula,
            @RequestParam(required = false) String nombre,
            @RequestParam(defaultValue = "false") boolean partial) {
        List<Asociado> resultados = service.searchAsociados(cedula, nombre, partial);
        return ResponseEntity.ok(resultados);
    }
}
