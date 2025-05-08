package com.apaman.apaman_backend.service;

import com.apaman.apaman_backend.model.Usuario;
import java.util.List;

public interface UsuarioService {
    Usuario login(String cedula, String contrasena);
    List<Usuario> findAll();
}
