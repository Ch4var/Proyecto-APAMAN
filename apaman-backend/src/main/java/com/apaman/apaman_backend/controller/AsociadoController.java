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

    /**
     * Obtener todos los asociados
     */
    @GetMapping
    public List<Asociado> obtenerTodos() {
        return asociadoService.getAllAsociados();
    }

    /**
     * Obtener un asociado por cédula
     */
    @GetMapping("/{cedula}")
    public ResponseEntity<Asociado> obtenerPorCedula(@PathVariable String cedula) {
        try {
            Asociado encontrado = asociadoService.getAsociado(cedula);
            return ResponseEntity.ok(encontrado);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    /**
     * Crear un nuevo asociado
     */
    @PostMapping
    public ResponseEntity<Asociado> crear(@Valid @RequestBody Asociado asociado,
                                          UriComponentsBuilder uriBuilder) {
        Asociado creado = asociadoService.createAsociado(asociado);
        URI location = uriBuilder.path("/api/asociados/{cedula}")
                                 .buildAndExpand(creado.getCedula())
                                 .toUri();
        return ResponseEntity.created(location).body(creado);
    }

    /**
     * Actualizar un asociado existente
     */
    @PutMapping("/{cedula}")
    public ResponseEntity<Asociado> actualizar(@PathVariable String cedula,
                                               @Valid @RequestBody Asociado asociado) {
        try {
            Asociado actualizado = asociadoService.updateAsociado(cedula, asociado);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    /**
     * Eliminar un asociado
     */
    @DeleteMapping("/{cedula}")
    public ResponseEntity<Void> eliminar(@PathVariable String cedula) {
        asociadoService.deleteAsociado(cedula);
        return ResponseEntity.noContent().build();
    }
}
