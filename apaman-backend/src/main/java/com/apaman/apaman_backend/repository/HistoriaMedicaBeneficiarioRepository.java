package com.apaman.apaman_backend.repository;
import com.apaman.apaman_backend.model.HistoriaMedicaBeneficiario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoriaMedicaBeneficiarioRepository
        extends JpaRepository<HistoriaMedicaBeneficiario, Long> {

    List<HistoriaMedicaBeneficiario> findByBeneficiarioCedula(Integer cedula);
}
