package com.apaman.apaman_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.apaman.apaman_backend.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {
}
