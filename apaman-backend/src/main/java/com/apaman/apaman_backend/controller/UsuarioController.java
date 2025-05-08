package com.apaman.apaman_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.apaman.apaman_backend.model.Usuario;
import com.apaman.apaman_backend.service.UsuarioService;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @GetMapping
    public List<Usuario> list() {
        return service.findAll();
    }
}
