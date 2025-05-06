package com.apaman.apaman_backend.repository;
import com.apaman.apaman_backend.model.HistoriaMedicaMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoriaMedicaMediaRepository
        extends JpaRepository<HistoriaMedicaMedia, Long> {

    List<HistoriaMedicaMedia> findByHistoriaId(Long historiaId);
}
