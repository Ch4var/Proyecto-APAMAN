package com.apaman.apaman_backend.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.apaman.apaman_backend.repository.UsuarioRepository;
import com.apaman.apaman_backend.model.Usuario;
import com.apaman.apaman_backend.exception.UsuarioNotFoundException;
import com.apaman.apaman_backend.service.UsuarioService;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository repo;

    @Override
    public Usuario login(String cedula, String contrasena) {
        Usuario u = repo.findById(cedula)
            .orElseThrow(() -> new UsuarioNotFoundException(cedula));
        if (!u.getContrasena().equals(contrasena)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }
        return u;
    }

    @Override
    public List<Usuario> findAll() {
        return repo.findAll();
    }
}