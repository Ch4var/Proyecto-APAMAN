package com.apaman.apaman_backend.controller;

import com.apaman.apaman_backend.exception.BeneficiarioNotFoundException;
import com.apaman.apaman_backend.model.Beneficiario;
import com.apaman.apaman_backend.repository.BeneficiarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class BeneficiarioController {

    @Autowired
    private BeneficiarioRepository beneficiarioRepository;

    @PostMapping("/agregarBeneficiario")
    public Beneficiario newBeneficiario(@ModelAttribute Beneficiario newBeneficiario,
                                        @RequestParam(value = "fotoFile", required = false) MultipartFile fotoFile) {
        if (fotoFile != null && !fotoFile.isEmpty()) {
            try {
                newBeneficiario.setFoto(fotoFile.getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Error al leer el archivo de foto", e);
            }
        }
        return beneficiarioRepository.save(newBeneficiario);
    }

    @GetMapping("/Beneficiarios")
    public List<Beneficiario> getAllBeneficiarios(){
        return beneficiarioRepository.findAll();
    }

    @GetMapping("/Beneficiario/{id}")
    public Beneficiario getBeneficiarioById(@PathVariable Long id){
        return beneficiarioRepository.findById(id)
                .orElseThrow(() -> new BeneficiarioNotFoundException(id));
    }

    @PutMapping("/Beneficiario/{id}")
    public Beneficiario updateBeneficiario(@ModelAttribute Beneficiario newBeneficiario,
                                           @PathVariable Long id,
                                           @RequestParam(value = "fotoFile", required = false) MultipartFile fotoFile) {
        return beneficiarioRepository.findById(id)
                .map(beneficiario -> {
                    beneficiario.setNombre(newBeneficiario.getNombre());
                    beneficiario.setSexo(newBeneficiario.getSexo());
                    beneficiario.setFechaNacimiento(newBeneficiario.getFechaNacimiento());
                    beneficiario.setReligion(newBeneficiario.getReligion());
                    beneficiario.setGradoEscolaridad(newBeneficiario.getGradoEscolaridad());
                    beneficiario.setEstadoDependencia(newBeneficiario.getEstadoDependencia());
                    beneficiario.setFechaIngreso(newBeneficiario.getFechaIngreso());
                    if (fotoFile != null && !fotoFile.isEmpty()) {
                        try {
                            beneficiario.setFoto(fotoFile.getBytes());
                        } catch (IOException e) {
                            throw new RuntimeException("Error al leer el archivo de foto", e);
                        }
                    }
                    beneficiario.setEstado(newBeneficiario.getEstado());
                    beneficiario.setInfoContacto(newBeneficiario.getInfoContacto());
                    beneficiario.setPersonaResponsable(newBeneficiario.getPersonaResponsable());
                    beneficiario.setTelefonoResponsable(newBeneficiario.getTelefonoResponsable());
                    beneficiario.setDireccionResponsable(newBeneficiario.getDireccionResponsable());
                    beneficiario.setInfoFinanciera(newBeneficiario.getInfoFinanciera());
                    beneficiario.setPensionado(newBeneficiario.getPensionado());
                    beneficiario.setPresupuesto(newBeneficiario.getPresupuesto());
                    beneficiario.setObservaciones(newBeneficiario.getObservaciones());
                    return beneficiarioRepository.save(beneficiario);
                })
                .orElseThrow(() -> new BeneficiarioNotFoundException(id));
    }

    @DeleteMapping("/Beneficiario/{id}")
    public String deleteUser(@PathVariable Long id){
        if(!beneficiarioRepository.existsById(id)){
            throw new BeneficiarioNotFoundException(id);
        }
        beneficiarioRepository.deleteById(id);
        return "El beneficiario con la cédula " + id + " ha sido borrado exitosamente";
    }

    @GetMapping("/Beneficiarios/search")
    public List<Beneficiario> searchBeneficiario(@RequestParam(required = false) String cedula,
                                                 @RequestParam(required = false) String nombre) {

        if (cedula != null && !cedula.trim().isEmpty() && nombre != null && !nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("Solo se puede buscar por cédula o por nombre, no ambos.");
        }
        if (cedula != null && !cedula.trim().isEmpty()) {
            return beneficiarioRepository.findByCedulaContaining(cedula);
        }
        if (nombre != null && !nombre.trim().isEmpty()) {
            return beneficiarioRepository.findByNombreContainingIgnoreCase(nombre);
        }
        return beneficiarioRepository.findAll();
    }
}
