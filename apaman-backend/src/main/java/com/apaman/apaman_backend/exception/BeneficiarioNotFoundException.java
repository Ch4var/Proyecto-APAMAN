package com.apaman.apaman_backend.exception;

public class BeneficiarioNotFoundException extends RuntimeException{
    public BeneficiarioNotFoundException(Long id){
        super("No se pudo encontrar el beneficiario con la cedula: " + id);
    }
}
