package com.apaman.apaman_backend.controller;

import com.apaman.apaman_backend.model.LoginRequest;
import com.apaman.apaman_backend.model.Usuario;
import com.apaman.apaman_backend.repository.UsuarioRepository;
import com.apaman.apaman_backend.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioRepository usuarioRepository, UsuarioService usuarioService) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest request) {
        return usuarioService.autenticar(request.getCedula(), request.getContrasena())
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("Credenciales inválidas"));
    }

    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{cedula}")
    public ResponseEntity<Usuario> getUsuarioPorCedula(@PathVariable String cedula) {
        return usuarioRepository.findByCedula(cedula)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @PutMapping("/{cedula}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable String cedula, @RequestBody Usuario nuevoUsuario) {
        return usuarioRepository.findById(cedula)
                .map(usuarioExistente -> {
                    usuarioExistente.setCorreo(nuevoUsuario.getCorreo());
                    usuarioExistente.setContrasena(nuevoUsuario.getContrasena());
                    usuarioExistente.setRol(nuevoUsuario.getRol());
                    return ResponseEntity.ok(usuarioRepository.save(usuarioExistente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{cedula}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable String cedula) {
        if (usuarioRepository.existsById(cedula)) {
            usuarioRepository.deleteById(cedula);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}


