package com.apaman.apaman_backend.controller;

import com.apaman.apaman_backend.dto.FormularioEconomicoDTO;
import com.apaman.apaman_backend.dto.FormularioSaludDTO;
import com.apaman.apaman_backend.dto.HistoriaMediaDTO;
import com.apaman.apaman_backend.dto.HistoriaMedicaDTO;
import com.apaman.apaman_backend.exception.BeneficiarioNotFoundException;
import com.apaman.apaman_backend.model.*;
import com.apaman.apaman_backend.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/beneficiarios")
@CrossOrigin("http://localhost:3000")
public class BeneficiarioController {

    @Autowired
    private BeneficiarioRepository beneficiarioRepository;

    @Autowired
    private FondoRepository fondoRepository;

    @Autowired
    private PensionRepository pensionRepository;

    @PostMapping
    public Beneficiario createBeneficiario(
            @Valid @ModelAttribute Beneficiario newBeneficiario,
            @RequestParam("idFondo") Integer idFondo,
            @RequestParam("idPension") Integer idPension,
            @RequestParam(value = "fotoFile", required = false) MultipartFile fotoFile) {

        Fondo fondo = fondoRepository.findById(idFondo)
                .orElseThrow(() -> new IllegalArgumentException("Fondo no encontrado: " + idFondo));
        Pension pension = pensionRepository.findById(idPension)
                .orElseThrow(() -> new IllegalArgumentException("Pensión no encontrada: " + idPension));

        newBeneficiario.setFondo(fondo);
        newBeneficiario.setPension(pension);

        if (fotoFile != null && !fotoFile.isEmpty()) {
            try {
                newBeneficiario.setFoto(fotoFile.getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Error al leer el archivo de foto", e);
            }
        }

        return beneficiarioRepository.save(newBeneficiario);
    }

    @GetMapping
    public List<Beneficiario> getAllBeneficiarios() {
        return beneficiarioRepository.findAll();
    }

    @GetMapping("/{cedula}")
    public Beneficiario getBeneficiarioById(@PathVariable Integer cedula) {
        return beneficiarioRepository.findById(cedula)
                .orElseThrow(() -> new BeneficiarioNotFoundException(cedula));
    }

    @PutMapping("/{cedula}")
    public Beneficiario updateBeneficiario(
            @Valid @ModelAttribute Beneficiario updatedData,
            @PathVariable Integer cedula,
            @RequestParam("idFondo") Integer idFondo,
            @RequestParam("idPension") Integer idPension,
            @RequestParam(value = "fotoFile", required = false) MultipartFile fotoFile) {

        return beneficiarioRepository.findById(cedula)
                .map(b -> {
                    b.setNombre(updatedData.getNombre());
                    b.setApellido1(updatedData.getApellido1());
                    b.setApellido2(updatedData.getApellido2());
                    b.setSexo(updatedData.getSexo());
                    b.setFechaNacimiento(updatedData.getFechaNacimiento());
                    b.setEdad(updatedData.getEdad());
                    b.setReligion(updatedData.getReligion());
                    b.setEscolaridad(updatedData.getEscolaridad());
                    b.setEstadoDependencia(updatedData.getEstadoDependencia());
                    b.setFechaIngreso(updatedData.getFechaIngreso());

                    if (fotoFile != null && !fotoFile.isEmpty()) {
                        try {
                            b.setFoto(fotoFile.getBytes());
                        } catch (IOException e) {
                            throw new RuntimeException("Error al leer el archivo de foto", e);
                        }
                    }

                    b.setEstado(updatedData.getEstado());
                    b.setResponsableNombre(updatedData.getResponsableNombre());
                    b.setResponsableApellido1(updatedData.getResponsableApellido1());
                    b.setResponsableApellido2(updatedData.getResponsableApellido2());
                    b.setResponsableTelefono(updatedData.getResponsableTelefono());
                    b.setResponsableDireccion(updatedData.getResponsableDireccion());
                    Fondo fondo = fondoRepository.findById(idFondo)
                            .orElseThrow(() -> new IllegalArgumentException("Fondo no encontrado: " + idFondo));
                    Pension pension = pensionRepository.findById(idPension)
                            .orElseThrow(() -> new IllegalArgumentException("Pensión no encontrada: " + idPension));
                    b.setFondo(fondo);
                    b.setPension(pension);
                    b.setPresupuesto(updatedData.getPresupuesto());
                    return beneficiarioRepository.save(b);
                })
                .orElseThrow(() -> new BeneficiarioNotFoundException(cedula));
    }

    @DeleteMapping("/{cedula}")
    public String deleteBeneficiario(@PathVariable Integer cedula) {
        if (!beneficiarioRepository.existsById(cedula)) {
            throw new BeneficiarioNotFoundException(cedula);
        }
        beneficiarioRepository.deleteById(cedula);
        return "El beneficiario con la cédula " + cedula + " ha sido borrado exitosamente";
    }

    @GetMapping("/search")
    public List<Beneficiario> searchBeneficiario(
            @RequestParam(required = false) String cedula,
            @RequestParam(required = false) String nombre) {

        if (cedula != null && !cedula.trim().isEmpty()) {
            if (nombre != null && !nombre.trim().isEmpty()) {
                throw new IllegalArgumentException("Solo se puede buscar por cédula o por nombre, no ambos.");
            }
            return beneficiarioRepository.findByCedulaContaining(cedula);
        }

        if (nombre != null && !nombre.trim().isEmpty()) {
            return beneficiarioRepository.findByNombreContainingIgnoreCase(nombre);
        }

        return beneficiarioRepository.findAll();
    }

    @Autowired
    private ObservacionBeneficiarioRepository obsRepo;

    @GetMapping("/{cedula}/observaciones")
    public List<ObservacionBeneficiario> listarObservaciones(@PathVariable Integer cedula) {
        return obsRepo.findByBeneficiarioCedula(cedula);
    }

    @PostMapping("/{cedula}/observaciones")
    public ObservacionBeneficiario agregarObservacion(
            @PathVariable Integer cedula,
            @RequestBody @Valid ObservacionDTO dto) {

        Beneficiario b = beneficiarioRepository.findById(cedula)
                .orElseThrow(() -> new BeneficiarioNotFoundException(cedula));

        ObservacionBeneficiario obs = ObservacionBeneficiario.builder()
                .beneficiario(b)
                .observacion(dto.getObservacion())
                .build();

        return obsRepo.save(obs);
    }

    @DeleteMapping("/{cedula}/observaciones/{obsId}")
    public void borrarObservacion(
            @PathVariable Integer cedula,
            @PathVariable Long obsId) {
        obsRepo.deleteById(obsId);
    }

    @PutMapping("/{cedula}/observaciones/{obsId}")
    public ObservacionBeneficiario editarObservacion(
            @PathVariable Integer cedula,
            @PathVariable Long obsId,
            @RequestBody @Valid ObservacionDTO dto) {

        return obsRepo.findById(obsId)
                .map(obs -> {
                    obs.setObservacion(dto.getObservacion());
                    return obsRepo.save(obs);
                })
                .orElseThrow(() -> new RuntimeException("Observación no encontrada: " + obsId));
    }

    @Data
    public static class ObservacionDTO {
        @NotBlank
        private String observacion;
    }

    @Autowired
    private FormularioSaludBeneficiarioRepository saludRepo;

    // Obtener o crear un formulario (GET)
    @GetMapping("/{cedula}/salud")
    public FormularioSaludDTO getFormularioSalud(@PathVariable Integer cedula) {
        Beneficiario b = beneficiarioRepository.findById(cedula)
                .orElseThrow(() -> new BeneficiarioNotFoundException(cedula));
        return saludRepo.findByBeneficiarioCedula(b.getCedula())
                .map(fs -> new FormularioSaludDTO(
                        fs.getLimitacion(),
                        fs.getPadecimientos(),
                        fs.getLugaresAtencion(),
                        fs.getReconoceMedicamentos(),
                        fs.getMedicamentos(),
                        fs.getTieneDieta(),
                        fs.getDieta(),
                        fs.getUtilizaOrtopedicos(),
                        fs.getOrtopedicos(),
                        fs.getUtilizaAnteojos(),
                        fs.getUtilizaAudifonos(),
                        fs.getOtro()
                ))
                .orElseGet(() -> FormularioSaludDTO.builder().build());
    }

    // Guardar o actualizar formulario (POST/PUT)
    @PostMapping("/{cedula}/salud")
    public FormularioSaludDTO saveFormularioSalud(
            @PathVariable Integer cedula,
            @RequestBody @Valid FormularioSaludDTO dto) {

        Beneficiario b = beneficiarioRepository.findById(cedula)
                .orElseThrow(() -> new BeneficiarioNotFoundException(cedula));

        FormularioSaludBeneficiario fs = saludRepo.findByBeneficiarioCedula(b.getCedula())
                .orElse(FormularioSaludBeneficiario.builder().beneficiario(b).build());

        // Setear campos desde el DTO
        fs.setLimitacion(dto.getLimitacion());
        fs.setPadecimientos(dto.getPadecimientos());
        fs.setLugaresAtencion(dto.getLugaresAtencion());
        fs.setReconoceMedicamentos(dto.getReconoceMedicamentos());
        fs.setMedicamentos(dto.getMedicamentos());
        fs.setTieneDieta(dto.getTieneDieta());
        fs.setDieta(dto.getDieta());
        fs.setUtilizaOrtopedicos(dto.getUtilizaOrtopedicos());
        fs.setOrtopedicos(dto.getOrtopedicos());
        fs.setUtilizaAnteojos(dto.getUtilizaAnteojos());
        fs.setUtilizaAudifonos(dto.getUtilizaAudifonos());
        fs.setOtro(dto.getOtro());

        FormularioSaludBeneficiario saved = saludRepo.save(fs);

        // Devolver DTO con datos actualizados
        return FormularioSaludDTO.builder()
                .limitacion(saved.getLimitacion())
                .padecimientos(saved.getPadecimientos())
                .lugaresAtencion(saved.getLugaresAtencion())
                .reconoceMedicamentos(saved.getReconoceMedicamentos())
                .medicamentos(saved.getMedicamentos())
                .tieneDieta(saved.getTieneDieta())
                .dieta(saved.getDieta())
                .utilizaOrtopedicos(saved.getUtilizaOrtopedicos())
                .ortopedicos(saved.getOrtopedicos())
                .utilizaAnteojos(saved.getUtilizaAnteojos())
                .utilizaAudifonos(saved.getUtilizaAudifonos())
                .otro(saved.getOtro())
                .build();
    }

    @DeleteMapping("/{cedula}/salud")
    public ResponseEntity<String> deleteFormularioSalud(@PathVariable Integer cedula) {
        FormularioSaludBeneficiario fs = saludRepo.findByBeneficiarioCedula(cedula)
                .orElseThrow(() ->
                        new BeneficiarioNotFoundException(
                               cedula
                        )
                );

        saludRepo.delete(fs);

        return ResponseEntity
                .ok("Formulario de salud del beneficiario " + cedula + " eliminado correctamente.");
    }

    @Autowired
    private FormularioEconomicoBeneficiarioRepository ecoRepo;

    @GetMapping("/{cedula}/economico")
    public FormularioEconomicoDTO getFormularioEconomico(@PathVariable Integer cedula) {
        Beneficiario b = beneficiarioRepository.findById(cedula)
                .orElseThrow(() -> new BeneficiarioNotFoundException(cedula));

        return ecoRepo.findByBeneficiarioCedula(cedula)
                .map(fs -> FormularioEconomicoDTO.builder()
                        .pensionRnc(fs.getPensionRnc())
                        .montoPensionRnc(fs.getMontoPensionRnc())
                        .pensionIvm(fs.getPensionIvm())
                        .montoPensionIvm(fs.getMontoPensionIvm())
                        .pensionOtro(fs.getPensionOtro())
                        .montoPensionOtro(fs.getMontoPensionOtro())
                        .aporteFamiliar(fs.getAporteFamiliar())
                        .montoAporteFamiliar(fs.getMontoAporteFamiliar())
                        .ingresosPropios(fs.getIngresosPropios())
                        .montoIngresosPropios(fs.getMontoIngresosPropios())
                        .aporteHogar(fs.getAporteHogar())
                        .montoAporteHogar(fs.getMontoAporteHogar())
                        .build()
                )
                .orElseGet(() -> FormularioEconomicoDTO.builder()
                        .pensionRnc(false)
                        .pensionIvm(false)
                        .pensionOtro(false)
                        .aporteFamiliar(false)
                        .ingresosPropios(false)
                        .aporteHogar(false)
                        .build()
                );
    }

    @PostMapping("/{cedula}/economico")
    public FormularioEconomicoDTO saveFormularioEconomico(
            @PathVariable Integer cedula,
            @RequestBody @Valid FormularioEconomicoDTO dto) {

        Beneficiario b = beneficiarioRepository.findById(cedula)
                .orElseThrow(() -> new BeneficiarioNotFoundException(cedula));

        FormularioEconomicoBeneficiario fe = ecoRepo
                .findByBeneficiarioCedula(cedula)
                .orElse(FormularioEconomicoBeneficiario.builder().beneficiario(b).build());

        fe.setPensionRnc(dto.getPensionRnc());
        fe.setMontoPensionRnc(dto.getMontoPensionRnc());
        fe.setPensionIvm(dto.getPensionIvm());
        fe.setMontoPensionIvm(dto.getMontoPensionIvm());
        fe.setPensionOtro(dto.getPensionOtro());
        fe.setMontoPensionOtro(dto.getMontoPensionOtro());
        fe.setAporteFamiliar(dto.getAporteFamiliar());
        fe.setMontoAporteFamiliar(dto.getMontoAporteFamiliar());
        fe.setIngresosPropios(dto.getIngresosPropios());
        fe.setMontoIngresosPropios(dto.getMontoIngresosPropios());
        fe.setAporteHogar(dto.getAporteHogar());
        fe.setMontoAporteHogar(dto.getMontoAporteHogar());

        FormularioEconomicoBeneficiario saved = ecoRepo.save(fe);

        return FormularioEconomicoDTO.builder()
                .pensionRnc(saved.getPensionRnc())
                .montoPensionRnc(saved.getMontoPensionRnc())
                .pensionIvm(saved.getPensionIvm())
                .montoPensionIvm(saved.getMontoPensionIvm())
                .pensionOtro(saved.getPensionOtro())
                .montoPensionOtro(saved.getMontoPensionOtro())
                .aporteFamiliar(saved.getAporteFamiliar())
                .montoAporteFamiliar(saved.getMontoAporteFamiliar())
                .ingresosPropios(saved.getIngresosPropios())
                .montoIngresosPropios(saved.getMontoIngresosPropios())
                .aporteHogar(saved.getAporteHogar())
                .montoAporteHogar(saved.getMontoAporteHogar())
                .build();
    }

    @DeleteMapping("/{cedula}/economico")
    public ResponseEntity<String> deleteFormularioEconomico(@PathVariable Integer cedula) {
        FormularioEconomicoBeneficiario fe = ecoRepo
                .findByBeneficiarioCedula(cedula)
                .orElseThrow(() -> new BeneficiarioNotFoundException(
                        cedula));

        ecoRepo.delete(fe);
        return ResponseEntity.ok(
                "Formulario económico del beneficiario " + cedula + " eliminado correctamente."
        );
    }

    @Autowired
    private ExpedienteAdministrativoBeneficiarioRepository expedRepo;

    public record ExpedienteDTO(
            Long id,
            String nombreArchivo,
            LocalDateTime fechaSubida
    ) {}
    @GetMapping("/{cedula}/expedientes")
    public List<ExpedienteDTO> listarExpedientes(@PathVariable Integer cedula) {
        beneficiarioRepository.findById(cedula)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Beneficiario no encontrado: " + cedula));

        return expedRepo.findByBeneficiarioCedula(cedula)
                .stream()
                .map(e -> new ExpedienteDTO(
                        e.getId(),
                        e.getNombreArchivo(),
                        e.getFechaSubida()
                ))
                .toList();
    }

    @GetMapping("/{cedula}/expedientes/{expId}")
    public ResponseEntity<byte[]> descargarExpediente(
            @PathVariable Integer cedula,
            @PathVariable Long expId) {

        ExpedienteAdministrativoBeneficiario e = expedRepo.findById(expId)
                .filter(x -> x.getBeneficiario().getCedula().equals(cedula))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Expediente no encontrado o no pertenece a " + cedula));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + e.getNombreArchivo() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(e.getContenido());
    }

    @PostMapping("/{cedula}/expedientes")
    public ResponseEntity<ExpedienteDTO> subirExpediente(
            @PathVariable Integer cedula,
            @RequestParam("file") MultipartFile file) throws IOException {

        Beneficiario b = beneficiarioRepository.findById(cedula)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Beneficiario no encontrado: " + cedula));

        ExpedienteAdministrativoBeneficiario e = ExpedienteAdministrativoBeneficiario.builder()
                .beneficiario(b)
                .nombreArchivo(file.getOriginalFilename())
                .contenido(file.getBytes())
                .build();

        ExpedienteAdministrativoBeneficiario saved = expedRepo.save(e);
        ExpedienteDTO dto = new ExpedienteDTO(
                saved.getId(),
                saved.getNombreArchivo(),
                saved.getFechaSubida()
        );
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(dto);
    }

    @DeleteMapping("/{cedula}/expedientes/{expId}")
    public ResponseEntity<Void> borrarExpediente(
            @PathVariable Integer cedula,
            @PathVariable Long expId) {

        ExpedienteAdministrativoBeneficiario e = expedRepo.findById(expId)
                .filter(x -> x.getBeneficiario().getCedula().equals(cedula))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Expediente no encontrado o no pertenece a " + cedula));

        expedRepo.delete(e);
        return ResponseEntity.noContent().build();
    }

    @Autowired
    private HistoriaMedicaBeneficiarioRepository histRepo;

    @Autowired
    private HistoriaMedicaMediaRepository mediaRepo;

    @GetMapping("/{cedula}/historia-medica")
    public List<HistoriaMedicaDTO> listarHistoria(@PathVariable Integer cedula) {
        beneficiarioRepository.findById(cedula)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Beneficiario no encontrado: " + cedula));

        return histRepo.findByBeneficiarioCedula(cedula).stream()
                .map(h -> HistoriaMedicaDTO.builder()
                        .id(h.getId())
                        .nombrePersonalSalud(h.getNombrePersonalSalud())
                        .tipoTerapia(h.getTipoTerapia())
                        .detalle(h.getDetalle())
                        .fechaRegistro(h.getFechaRegistro())
                        .media(
                                mediaRepo.findByHistoriaId(h.getId()).stream()
                                        .map(m -> new HistoriaMediaDTO(
                                                m.getId(),
                                                m.getNombreArchivo(),
                                                m.getTipoMedia().name(),
                                                m.getFechaSubida()))
                                        .toList()
                        )
                        .build()
                ).toList();
    }

    @PostMapping("/{cedula}/historia-medica")
    public HistoriaMedicaDTO crearHistoria(
            @PathVariable Integer cedula,
            @RequestBody @Valid HistoriaMedicaDTO dto) {
        Beneficiario b = beneficiarioRepository.findById(cedula)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Beneficiario no encontrado: " + cedula));

        HistoriaMedicaBeneficiario h = HistoriaMedicaBeneficiario.builder()
                .beneficiario(b)
                .nombrePersonalSalud(dto.getNombrePersonalSalud())
                .tipoTerapia(dto.getTipoTerapia())
                .detalle(dto.getDetalle())
                .build();

        HistoriaMedicaBeneficiario saved = histRepo.save(h);
        return HistoriaMedicaDTO.builder()
                .id(saved.getId())
                .nombrePersonalSalud(saved.getNombrePersonalSalud())
                .tipoTerapia(saved.getTipoTerapia())
                .detalle(saved.getDetalle())
                .fechaRegistro(saved.getFechaRegistro())
                .media(List.of())
                .build();
    }

    @PutMapping("/{cedula}/historia-medica/{histId}")
    public HistoriaMedicaDTO editarHistoria(
            @PathVariable Integer cedula,
            @PathVariable Long histId,
            @RequestBody @Valid HistoriaMedicaDTO dto) {

        HistoriaMedicaBeneficiario h = histRepo.findById(histId)
                .filter(x -> x.getBeneficiario().getCedula().equals(cedula))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Historia no encontrada: " + histId));

        h.setNombrePersonalSalud(dto.getNombrePersonalSalud());
        h.setTipoTerapia(dto.getTipoTerapia());
        h.setDetalle(dto.getDetalle());

        HistoriaMedicaBeneficiario updated = histRepo.save(h);
        List<HistoriaMediaDTO> mediaList = mediaRepo.findByHistoriaId(histId).stream()
                .map(m -> new HistoriaMediaDTO(m.getId(), m.getNombreArchivo(), m.getTipoMedia().name(), m.getFechaSubida()))
                .toList();

        return HistoriaMedicaDTO.builder()
                .id(updated.getId())
                .nombrePersonalSalud(updated.getNombrePersonalSalud())
                .tipoTerapia(updated.getTipoTerapia())
                .detalle(updated.getDetalle())
                .fechaRegistro(updated.getFechaRegistro())
                .media(mediaList)
                .build();
    }

    @DeleteMapping("/{cedula}/historia-medica/{histId}")
    public ResponseEntity<Void> borrarHistoria(
            @PathVariable Integer cedula,
            @PathVariable Long histId) {
        HistoriaMedicaBeneficiario h = histRepo.findById(histId)
                .filter(x -> x.getBeneficiario().getCedula().equals(cedula))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Historia no encontrada: " + histId));
        histRepo.delete(h);
        return ResponseEntity.noContent().build();
    }

// — Media (fotos/videos) —

    @GetMapping("/{cedula}/historia-medica/{histId}/media")
    public List<HistoriaMediaDTO> listarMedia(
            @PathVariable Integer cedula,
            @PathVariable Long histId) {

        // valida historia
        histRepo.findById(histId)
                .filter(x -> x.getBeneficiario().getCedula().equals(cedula))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Historia no encontrada: " + histId));

        return mediaRepo.findByHistoriaId(histId).stream()
                .map(m -> new HistoriaMediaDTO(
                        m.getId(), m.getNombreArchivo(), m.getTipoMedia().name(), m.getFechaSubida()))
                .toList();
    }

    @PostMapping("/{cedula}/historia-medica/{histId}/media")
    public HistoriaMediaDTO subirMedia(
            @PathVariable Integer cedula,
            @PathVariable Long histId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("tipo") String tipo) throws IOException {

        HistoriaMedicaBeneficiario h = histRepo.findById(histId)
                .filter(x -> x.getBeneficiario().getCedula().equals(cedula))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Historia no encontrada: " + histId));

        HistoriaMedicaMedia media = HistoriaMedicaMedia.builder()
                .historia(h)
                .nombreArchivo(file.getOriginalFilename())
                .tipoMedia(HistoriaMedicaMedia.MediaType.valueOf(tipo))
                .contenido(file.getBytes())
                .build();

        HistoriaMedicaMedia saved = mediaRepo.save(media);
        return new HistoriaMediaDTO(
                saved.getId(),
                saved.getNombreArchivo(),
                saved.getTipoMedia().name(),
                saved.getFechaSubida()
        );
    }

    @DeleteMapping("/{cedula}/historia-medica/{histId}/media/{mediaId}")
    public ResponseEntity<Void> borrarMedia(
            @PathVariable Integer cedula,
            @PathVariable Long histId,
            @PathVariable Long mediaId) {

        HistoriaMedicaMedia m = mediaRepo.findById(mediaId)
                .filter(x -> x.getHistoria().getId().equals(histId)
                        && x.getHistoria().getBeneficiario().getCedula().equals(cedula))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Media no encontrada: " + mediaId));

        mediaRepo.delete(m);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{cedula}/historia-medica/{histId}/media/{mediaId}/raw")
    public ResponseEntity<byte[]> descargarMediaInline(
            @PathVariable Integer cedula,
            @PathVariable Long histId,
            @PathVariable Long mediaId) {

        // Validar historia y beneficiario
        HistoriaMedicaMedia m = mediaRepo.findById(mediaId)
                .filter(x ->
                        x.getHistoria().getId().equals(histId)
                                && x.getHistoria().getBeneficiario().getCedula().equals(cedula)
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Media no encontrada: " + mediaId
                ));

        // Determinar tipo MIME
        MediaType mime;
        switch (m.getTipoMedia()) {
            case foto:
                // Asumimos jpeg/png según extensión
                if (m.getNombreArchivo().toLowerCase().endsWith(".png")) {
                    mime = MediaType.IMAGE_PNG;
                } else {
                    mime = MediaType.IMAGE_JPEG;
                }
                break;
            case video:
                // Asumimos MP4
                mime = MediaType.valueOf("video/mp4");
                break;
            default:
                mime = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + m.getNombreArchivo() + "\"")
                .contentType(mime)
                .body(m.getContenido());
    }
}
