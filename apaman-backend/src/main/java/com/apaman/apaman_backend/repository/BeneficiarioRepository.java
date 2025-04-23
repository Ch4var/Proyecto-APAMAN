package com.apaman.apaman_backend.repository;

import com.apaman.apaman_backend.model.Beneficiario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BeneficiarioRepository extends JpaRepository<Beneficiario, Integer> {
    Optional<Beneficiario> findByCedula(Integer cedula);

    @Query("SELECT b FROM Beneficiario b WHERE CONCAT('', b.cedula) LIKE %:cedula%")
    List<Beneficiario> findByCedulaContaining(@Param("cedula") String cedula);

    @Query("SELECT b FROM Beneficiario b WHERE LOWER(b.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Beneficiario> findByNombreContainingIgnoreCase(@Param("nombre") String nombre);
}
