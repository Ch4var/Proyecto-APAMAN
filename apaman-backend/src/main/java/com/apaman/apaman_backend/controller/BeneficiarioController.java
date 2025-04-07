package com.apaman.apaman_backend.controller;

import com.apaman.apaman_backend.exception.BeneficiarioNotFoundException;
import com.apaman.apaman_backend.model.Beneficiario;
import com.apaman.apaman_backend.repository.BeneficiarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class BeneficiarioController {

    @Autowired
    private BeneficiarioRepository beneficiarioRepository;

    @PostMapping("/agregarBeneficiario")
    Beneficiario newBeneficiario(@RequestBody Beneficiario newBeneficiario){
        return beneficiarioRepository.save(newBeneficiario);
    }

    @GetMapping("/Beneficiarios")
    List<Beneficiario> getAllBeneficiarios(){
        return beneficiarioRepository.findAll();
    }

    @GetMapping("/Beneficiario/{id}")
    Beneficiario getBeneficiarioById(@PathVariable Long id){
        return beneficiarioRepository.findById(id)
                .orElseThrow(()->new BeneficiarioNotFoundException(id));
    }

    @PutMapping("/Beneficiario/{id}")
    public Beneficiario updateBeneficiario(@RequestBody Beneficiario newBeneficiario, @PathVariable Long id) {
        return beneficiarioRepository.findById(id)
                .map(beneficiario -> {
                    beneficiario.setNombre(newBeneficiario.getNombre());
                    beneficiario.setSexo(newBeneficiario.getSexo());
                    beneficiario.setFechaNacimiento(newBeneficiario.getFechaNacimiento());
                    beneficiario.setReligion(newBeneficiario.getReligion());
                    beneficiario.setGradoEscolaridad(newBeneficiario.getGradoEscolaridad());
                    beneficiario.setEstadoDependencia(newBeneficiario.getEstadoDependencia());
                    beneficiario.setFechaIngreso(newBeneficiario.getFechaIngreso());
                    beneficiario.setFoto(newBeneficiario.getFoto());
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
                .orElseThrow(()->new BeneficiarioNotFoundException(id));
    }

    @DeleteMapping("/Beneficiario/{id}")
    String deleteUser(@PathVariable Long id){
        if(!beneficiarioRepository.existsById(id)){
            throw new BeneficiarioNotFoundException(id);
        }
        beneficiarioRepository.deleteById(id);
        return "El beneficiario con la cedula "+id+" ha sido borrado exitosamente";
    }
}
