package com.apaman.apaman_backend.repository;

import com.apaman.apaman_backend.model.Asociado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AsociadoRepository extends JpaRepository<Asociado, String> {
}
