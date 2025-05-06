package com.apaman.apaman_backend.service;

import com.apaman.apaman_backend.model.Usuario;
import com.apaman.apaman_backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Optional<Usuario> autenticar(String cedula, String contrasena) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCedula(cedula);

        System.out.println("Buscando usuario con cédula: " + cedula);
        System.out.println("Resultado: " + usuarioOpt);

        usuarioOpt.ifPresent(usuario -> {
            System.out.println("Contraseña recibida: >" + contrasena + "<");
            System.out.println("Contraseña en BD:   >" + usuario.getContrasena() + "<");
        });

        return usuarioOpt.filter(usuario -> usuario.getContrasena().equals(contrasena));
    }

}

