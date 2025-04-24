package com.apaman.apaman_backend.repository;

import com.apaman.apaman_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    Optional<Usuario> findByCedula(String cedula);
}
