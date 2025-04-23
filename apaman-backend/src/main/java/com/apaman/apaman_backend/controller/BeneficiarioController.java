package com.apaman.apaman_backend.controller;

import com.apaman.apaman_backend.exception.BeneficiarioNotFoundException;
import com.apaman.apaman_backend.model.Beneficiario;
import com.apaman.apaman_backend.model.Fondo;
import com.apaman.apaman_backend.model.Pension;
import com.apaman.apaman_backend.repository.BeneficiarioRepository;
import com.apaman.apaman_backend.repository.FondoRepository;
import com.apaman.apaman_backend.repository.PensionRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
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

}
