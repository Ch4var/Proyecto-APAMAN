-- Crear base de datos y conectarse
CREATE DATABASE IF NOT EXISTS apaman;
USE apaman;

-- =====================================================
-- Seccion Asociados
-- =====================================================

-- -----------------------------------------------------
-- Tabla `asociado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asociado` (
  `cedula` VARCHAR(9) NOT NULL,
  `nombre` VARCHAR(20) NOT NULL,
  `apellido_1` VARCHAR(20) NOT NULL,
  `apellido_2` VARCHAR(20) NOT NULL,
  `sexo` ENUM('Masculino', 'Femenina', 'Otro') NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `edad` INT NOT NULL,
  `estado` BOOLEAN DEFAULT TRUE,
  
  `fecha_asociacion` DATE NOT NULL,
  
  `cuota_mensual` DECIMAL(10,2) NOT NULL,
  `estado_morosidad` BOOLEAN DEFAULT FALSE,
  `meses_adeudo` INT NOT NULL DEFAULT '0',
  `cantidad_adeudo` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  
  `correo` VARCHAR(100) NOT NULL,
  `telefono` INT NOT NULL,
  `direccion` VARCHAR(200) NOT NULL,
  
  PRIMARY KEY (`cedula`)
);

-- -----------------------------------------------------
-- Tabla `acta_asociado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `acta_asociado` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha_sesion` DATE NOT NULL,
  `num_acta` VARCHAR(20) NOT NULL,
  `num_acuerdo` VARCHAR(20) NOT NULL,
  
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Tabla `referente_asociado`
-- -----------------------------------------------------
CREATE TABLE referente_asociado (
  id                INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  asociado_cedula   VARCHAR(9) NOT NULL,
  referente_cedula  VARCHAR(9) NOT NULL,
  
  INDEX idx_asoc_ced (asociado_cedula),
  INDEX idx_refe_ced (referente_cedula),
  
  CONSTRAINT referente_asociado_ibfk_1
    FOREIGN KEY (asociado_cedula)
    REFERENCES asociado(cedula)
    ON DELETE CASCADE,
  CONSTRAINT referente_asociado_ibfk_2
    FOREIGN KEY (referente_cedula)
    REFERENCES asociado(cedula)
    ON DELETE CASCADE
);


-- =====================================================
-- Seccion Beneficiarios
-- =====================================================

-- -----------------------------------------------------
-- Tabla `fondo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fondo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo` ENUM('Familiar', 'CONAPAM', 'Junta_Protección_Social') NOT NULL,
  
  PRIMARY KEY (`id`)
);

INSERT INTO fondo VALUES (1, 'Familiar');
INSERT INTO fondo VALUES (2, 'CONAPAM');
INSERT INTO fondo VALUES (3, 'Junta_Protección_Social');

-- -----------------------------------------------------
-- Tabla `pension`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pension` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo` ENUM('RNC', 'IVM'),
  
  PRIMARY KEY (`id`)
);

INSERT INTO pension VALUES (1, 'RNC');
INSERT INTO pension VALUES (2, 'IVM');

-- -----------------------------------------------------
-- Tabla `beneficiario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `beneficiario` (
  `cedula` VARCHAR(9) NOT NULL,
  `nombre` VARCHAR(20) NOT NULL,
  `apellido_1` VARCHAR(20) NOT NULL,
  `apellido_2` VARCHAR(20) NOT NULL,
  `sexo` ENUM('Masculino', 'Femenino', 'Otro') NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `edad` INT,
  `religion` ENUM('Cristianismo_Católico', 'Cristianismo_Protestante', 'Budaísmo', 'Judaísmo', 'Islam', 'Otro') NOT NULL,
  `escolaridad` ENUM('Ninguno', 'Preescolar', 'Primaria', 'Secundaria', 'Educación_Superior') NOT NULL,
  `estado_dependencia` ENUM('Dependiente', 'Moderadamente_Dependiente', 'Independiente') NOT NULL,
  `fecha_ingreso` DATE NOT NULL,
  `foto` BLOB,
  `estado` BOOLEAN DEFAULT TRUE,
  
  `responsable_nombre` VARCHAR(20) NOT NULL,
  `responsable_apellido_1` VARCHAR(20) NOT NULL,
  `responsable_apellido_2` VARCHAR(20) NOT NULL,
  `responsable_telefono` INT NOT NULL,
  `responsable_direccion` VARCHAR(200) NOT NULL,
  
  `id_pension` INT NOT NULL,
  `id_fondo` INT NOT NULL,
  `presupuesto` DECIMAL(10,2) NOT NULL,
  
  PRIMARY KEY (`cedula`),
  INDEX `id_fondo` (`id_fondo` ASC) VISIBLE,
  CONSTRAINT `beneficiario_ibfk_1`
    FOREIGN KEY (`id_fondo`)
    REFERENCES `fondo` (`id`),
  CONSTRAINT `beneficiario_ibfk_2`
    FOREIGN KEY (`id_pension`)
    REFERENCES `pension` (`id`)
);

-- -----------------------------------------------------
-- Tabla `observacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS observacion (
  id                   INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  asociado_cedula      VARCHAR(9) NOT NULL,
  beneficiario_cedula  VARCHAR(9) NOT NULL,
  fecha                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  contenido            VARCHAR(200),
  
  INDEX idx_obs_asoc   (asociado_cedula),
  INDEX idx_obs_bene   (beneficiario_cedula),
  
  CONSTRAINT fk_obs_asoc FOREIGN KEY (asociado_cedula)
    REFERENCES asociado(cedula)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_obs_bene FOREIGN KEY (beneficiario_cedula)
    REFERENCES beneficiario(cedula)
    ON DELETE CASCADE,
    
  CHECK (
    (asociado_cedula IS NOT NULL AND beneficiario_cedula IS NULL)
    OR
    (asociado_cedula IS NULL  AND beneficiario_cedula IS NOT NULL)
  )
);

-- -----------------------------------------------------
-- Table `observaciones_beneficiario`
-- -----------------------------------------------------
CREATE TABLE observaciones_beneficiario (
  id                   BIGINT NOT NULL AUTO_INCREMENT,
  cedula_beneficiario  VARCHAR(9) NOT NULL,
  observacion          TEXT    NOT NULL,
  fecha                TIMESTAMP NOT NULL
                        DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_obs_benef (cedula_beneficiario),
  CONSTRAINT fk_obs_benef
    FOREIGN KEY (cedula_beneficiario)
    REFERENCES beneficiario(cedula)
    ON DELETE CASCADE
);

CREATE TABLE formulario_salud_beneficiario (
  id                       BIGINT       NOT NULL AUTO_INCREMENT,
  cedula_beneficiario      VARCHAR(9)   NOT NULL,
  limitacion               ENUM('Física','Mental','Ninguna')  NOT NULL,
  padecimientos            TEXT         NULL,
  lugares_atencion         TEXT         NULL,
  reconoce_medicamentos    BOOLEAN      NOT NULL,
  medicamentos             TEXT         NULL,
  tiene_dieta              BOOLEAN      NOT NULL,
  dieta                    TEXT         NULL,
  utiliza_ortopedicos      BOOLEAN      NOT NULL,
  ortopedicos              TEXT         NULL,
  utiliza_anteojos         BOOLEAN      NOT NULL,
  utiliza_audifonos        BOOLEAN      NOT NULL,
  otro                     TEXT         NULL,
  fecha_actualizacion      TIMESTAMP    NOT NULL
                             DEFAULT CURRENT_TIMESTAMP
                             ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_salud_benef (cedula_beneficiario),
  CONSTRAINT fk_salud_benef
    FOREIGN KEY (cedula_beneficiario)
    REFERENCES beneficiario(cedula)
    ON DELETE CASCADE
);

USE apaman;

CREATE TABLE formulario_economico_beneficiario (
  id                         BIGINT     NOT NULL AUTO_INCREMENT,
  cedula_beneficiario        VARCHAR(9) NOT NULL,

  pension_rnc                BOOLEAN    NOT NULL,
  monto_pension_rnc          DECIMAL(10,2) NULL,

  pension_ivm                BOOLEAN    NOT NULL,
  monto_pension_ivm          DECIMAL(10,2) NULL,

  pension_otro               BOOLEAN    NOT NULL,
  monto_pension_otro         DECIMAL(10,2) NULL,

  aporte_familiar            BOOLEAN    NOT NULL,
  monto_aporte_familiar      DECIMAL(10,2) NULL,

  ingresos_propios           BOOLEAN    NOT NULL,
  monto_ingresos_propios     DECIMAL(10,2) NULL,

  aporte_hogar               BOOLEAN    NOT NULL,
  monto_aporte_hogar         DECIMAL(10,2) NULL,

  fecha_actualizacion        TIMESTAMP  NOT NULL
                                DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY ux_econ_benef (cedula_beneficiario),
  CONSTRAINT fk_econ_benef
    FOREIGN KEY (cedula_beneficiario)
    REFERENCES beneficiario(cedula)
    ON DELETE CASCADE
);

CREATE TABLE expediente_administrativo_beneficiario (
  id                       BIGINT       NOT NULL AUTO_INCREMENT,
  cedula_beneficiario      VARCHAR(9)   NOT NULL,
  nombre_archivo           VARCHAR(255) NOT NULL,
  contenido                LONGBLOB     NOT NULL,
  fecha_subida             TIMESTAMP    NOT NULL
                               DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_exped_bene (cedula_beneficiario),
  CONSTRAINT fk_exped_bene
    FOREIGN KEY (cedula_beneficiario)
    REFERENCES beneficiario(cedula)
    ON DELETE CASCADE
);

CREATE TABLE historia_medica_beneficiario (
  id                        BIGINT       NOT NULL AUTO_INCREMENT,
  cedula_beneficiario       VARCHAR(9)   NOT NULL,
  nombre_personal_salud     VARCHAR(100) NOT NULL,
  tipo_terapia              VARCHAR(100) NOT NULL,
  detalle                   TEXT         NOT NULL,
  fecha_registro            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_hist_bene (cedula_beneficiario),
  CONSTRAINT fk_hist_bene FOREIGN KEY (cedula_beneficiario)
    REFERENCES beneficiario(cedula)
    ON DELETE CASCADE
);

CREATE TABLE historia_medica_media (
  id                   BIGINT     NOT NULL AUTO_INCREMENT,
  historia_id          BIGINT     NOT NULL,
  nombre_archivo       VARCHAR(255) NOT NULL,
  tipo_media           ENUM('foto','video') NOT NULL,
  contenido            LONGBLOB   NOT NULL,
  fecha_subida         TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_media_hist   (historia_id),
  CONSTRAINT fk_media_hist FOREIGN KEY (historia_id)
    REFERENCES historia_medica_beneficiario(id)
    ON DELETE CASCADE
);

-- =====================================================
-- Seccion Usuarios
-- =====================================================

-- -----------------------------------------------------
-- Table `usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuario` (
  `cedula` VARCHAR(9) NOT NULL,
  `rol` VARCHAR(10) NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `contrasena` VARCHAR(45) NOT NULL,
  
  PRIMARY KEY (`cedula`)
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

-- =====================================================
-- Seccion Roles
-- =====================================================
-- 1) Crear tabla de roles si no existe
CREATE TABLE IF NOT EXISTS roles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

-- 2) Insertar los roles invariables (no duplicará si ya existen)
INSERT IGNORE INTO roles (nombre) VALUES
  ('Administrador'),
  ('Asistente'),
  ('ProfesionalSalud'),
  ('Revisor');
