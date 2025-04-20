-- Crear base de datos y conectarse
CREATE DATABASE IF NOT EXISTS APAMAN_BD;
USE APAMAN_BD;

-- =====================================================
-- Seccion Asociados
-- =====================================================

-- -----------------------------------------------------
-- Drops de Tablas
-- -----------------------------------------------------
DROP TABLE IF EXISTS `observacion_asociado`;
DROP TABLE IF EXISTS `referente_asociado`;
DROP TABLE IF EXISTS `asociado`;

-- -----------------------------------------------------
-- Tabla `asociado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asociado` (
  `cedula` VARCHAR(20) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `sexo` ENUM('M', 'F', 'Otro') NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `edad` INT NOT NULL,
  `estado` BOOLEAN DEFAULT TRUE,
  
  `fecha_asociacion` DATE NOT NULL,
  `fecha_sesion` DATE NOT NULL,
  `num_acta` VARCHAR(20) NOT NULL,
  `num_acuerdo` VARCHAR(20) NOT NULL,
  
  `cuota_mensual` DECIMAL(10,2) NOT NULL,
  `estado_morosidad` BOOLEAN DEFAULT FALSE,
  `meses_adeudo` INT NOT NULL DEFAULT '0',
  `cantidad_adeudo` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  
  `correo` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `direccion` TEXT NOT NULL,
  
  PRIMARY KEY (`cedula`)
);
  
-- -----------------------------------------------------
-- Tabla `referente_asociado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `referente_asociado` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `asociado_cedula` VARCHAR(20) NOT NULL,
  `referente_cedula` VARCHAR(20) NOT NULL,
  
  PRIMARY KEY (`id`),
  INDEX `asociado_cedula` (`asociado_cedula` ASC) VISIBLE,
  INDEX `referente_cedula` (`referente_cedula` ASC) VISIBLE,
  CONSTRAINT `referente_asociado_ibfk_1`
    FOREIGN KEY (`asociado_cedula`)
    REFERENCES `asociado` (`cedula`),
  CONSTRAINT `referente_asociado_ibfk_2`
    FOREIGN KEY (`referente_cedula`)
    REFERENCES `asociado` (`cedula`)
);

-- -----------------------------------------------------
-- Tabla `observacion_asociado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `observacion_asociado` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `asociado_cedula` VARCHAR(20) NOT NULL,
  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `contenido` TEXT NOT NULL,
  
  PRIMARY KEY (`id`),
  INDEX `asociado_cedula` (`asociado_cedula` ASC) VISIBLE,
  CONSTRAINT `observacion_asociado_ibfk_1`
    FOREIGN KEY (`asociado_cedula`)
    REFERENCES `apaman_bd`.`asociado` (`cedula`)
);

-- =====================================================
-- Seccion Beneficiarios
-- =====================================================

-- -----------------------------------------------------
-- Drops de Tablas
-- -----------------------------------------------------
DROP TABLE IF EXISTS `observacion_beneficiario`;
DROP TABLE IF EXISTS `beneficiario`;
DROP TABLE IF EXISTS `fondo`;

-- -----------------------------------------------------
-- Tabla `fondo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fondo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo` ENUM('Familiar', 'CONAPAM', 'Junta Protección Social') NOT NULL,
  `descripcion` TEXT NOT NULL,
  `monto` DECIMAL(10,2) NOT NULL,
  
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Tabla `beneficiario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `beneficiario` (
  `cedula` VARCHAR(20) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `sexo` ENUM('M', 'F', 'Otro') NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `edad` INT NOT NULL,
  `religion` VARCHAR(50) NOT NULL,
  `escolaridad` VARCHAR(100) NOT NULL,
  `estado_dependencia` ENUM('Dependiente', 'Moderadamente Dependiente', 'Independiente') NOT NULL,
  `fecha_ingreso` DATE NOT NULL,
  `foto` VARCHAR(2000) NOT NULL, -- OTRA OPCION POSIBLE: USAR LONGBLOB
  `estado` BOOLEAN DEFAULT TRUE,
  
  `responsable_nombre` VARCHAR(100) NOT NULL,
  `responsable_telefono` VARCHAR(20) NOT NULL,
  `responsable_direccion` TEXT NOT NULL,
  
  `pensionado` BOOLEAN DEFAULT FALSE,
  `tipo_pension` ENUM('RNC', 'IVM'),
  `id_fondo` INT NOT NULL,
  `presupuesto` DECIMAL(10,2) NOT NULL,
  
  PRIMARY KEY (`cedula`),
  INDEX `id_fondo` (`id_fondo` ASC) VISIBLE,
  CONSTRAINT `beneficiario_ibfk_1`
    FOREIGN KEY (`id_fondo`)
    REFERENCES `fondo` (`id`)
);

-- -----------------------------------------------------
-- Tabla `observacion_beneficiario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `observacion_beneficiario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `beneficiario_cedula` VARCHAR(20) NOT NULL,
  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `contenido` TEXT NOT NULL,
  
  PRIMARY KEY (`id`),
  INDEX `beneficiario_cedula` (`beneficiario_cedula` ASC) VISIBLE,
  CONSTRAINT `observacion_beneficiario_ibfk_1`
    FOREIGN KEY (`beneficiario_cedula`)
    REFERENCES `apaman_bd`.`beneficiario` (`cedula`)
);

-- =====================================================
-- Seccion Usuarios
-- =====================================================

-- -----------------------------------------------------
-- Drops de Tablas
-- -----------------------------------------------------
DROP TABLE IF EXISTS `usuario`;

-- -----------------------------------------------------
-- Table `usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuario` (
  `idusuario` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `cedula` VARCHAR(20) NULL,
  `contraseña` VARCHAR(45) NOT NULL,
  
  PRIMARY KEY (`idusuario`),
  UNIQUE INDEX `contraseña_UNIQUE` (`contraseña` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `idusuario_UNIQUE` (`idusuario` ASC) VISIBLE
);

-- Habilitar eventos (si no lo están)
SET GLOBAL event_scheduler = ON;

-- Evento: actualizar edad de asociados y beneficiarios mensualmente
DELIMITER $$
CREATE EVENT IF NOT EXISTS actualizar_edad
ON SCHEDULE EVERY 1 MONTH
DO
BEGIN
  UPDATE asociado
  SET edad = TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE());

  UPDATE beneficiario
  SET edad = TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE());
END$$
DELIMITER ;

-- Evento: actualizar morosidad mensual
DELIMITER $$
CREATE EVENT IF NOT EXISTS actualizar_morosidad
ON SCHEDULE EVERY 1 MONTH
DO
BEGIN
  UPDATE asociado
  SET 
    meses_adeudo = meses_adeudo + 1,
    cantidad_adeudo = cantidad_adeudo + cuota_mensual
  WHERE estado_morosidad = TRUE;
END$$
DELIMITER ;

-- Trigger: reset de adeudo si cambia estado de moroso a no moroso
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS reset_adeudo
BEFORE UPDATE ON asociado
FOR EACH ROW
BEGIN
  IF NEW.estado_morosidad = FALSE THEN
    SET NEW.meses_adeudo = 0;
    SET NEW.cantidad_adeudo = 0.00;
  END IF;
END$$
DELIMITER ;
