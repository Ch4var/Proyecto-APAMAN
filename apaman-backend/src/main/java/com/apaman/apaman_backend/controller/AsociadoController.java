package com.apaman.apaman_backend.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import com.apaman.apaman_backend.model.Asociado;
import com.apaman.apaman_backend.service.AsociadoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/asociados")
public class AsociadoController {

    private final AsociadoService asociadoService;

    public AsociadoController(AsociadoService asociadoService) {
        this.asociadoService = asociadoService;
    }

    @GetMapping
    public List<Asociado> obtenerTodos() {
        return asociadoService.getAllAsociados();
    }

    @GetMapping("/{cedula}")
    public ResponseEntity<Asociado> obtenerPorCedula(@PathVariable String cedula) {
        try {
            return ResponseEntity.ok(asociadoService.getAsociado(cedula));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Asociado> crear(@Valid @RequestBody Asociado asociado,
                                          UriComponentsBuilder uriBuilder) {
        Asociado creado = asociadoService.createAsociado(asociado);
        URI location = uriBuilder.path("/api/asociados/{cedula}")
                                 .buildAndExpand(creado.getCedula())
                                 .toUri();
        return ResponseEntity.created(location).body(creado);
    }

    @PutMapping("/{cedula}")
    public ResponseEntity<Asociado> actualizar(@PathVariable String cedula,
                                               @Valid @RequestBody Asociado asociado) {
        try {
            return ResponseEntity.ok(asociadoService.updateAsociado(cedula, asociado));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @DeleteMapping("/{cedula}")
    public ResponseEntity<Void> eliminar(@PathVariable String cedula) {
        asociadoService.deleteAsociado(cedula);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<Asociado> buscar(
            @RequestParam(required = false) String cedula,
            @RequestParam(required = false) String nombre,
            @RequestParam(defaultValue = "false") boolean partial) {
        return asociadoService.searchAsociados(cedula, nombre, partial);
    }
}
