package com.apaman.apaman_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.apaman.apaman_backend.dto.LoginRequest;
import com.apaman.apaman_backend.model.Usuario;
import com.apaman.apaman_backend.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")        // <-- prefijo para todas las rutas aquí
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UsuarioService service;

    @PostMapping("/login")            // ahora responde a POST /api/usuarios/login
    public ResponseEntity<Usuario> login(@RequestBody LoginRequest req) {
        Usuario u = service.login(req.getCedula(), req.getContrasena());
        return ResponseEntity.ok(u);
    }
}
