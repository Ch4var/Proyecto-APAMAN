package com.apaman.apaman_backend.controller;

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

}
