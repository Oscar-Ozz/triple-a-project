CREATE DATABASE IF NOT EXISTS inventario_db;
USE inventario_db;

-- Tabla de Luchadores
CREATE TABLE IF NOT EXISTS luchadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    bando VARCHAR(50) NOT NULL, -- Si es Tecnico o Rudo
    categoria VARCHAR(100) NOT NULL,
    titulos TEXT,
    exp VARCHAR(50), -- Experiencia o años de trayectoria
    imagen VARCHAR(255)
);

-- Tabla de la Tienda (Productos)
CREATE TABLE IF NOT EXISTS tienda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto VARCHAR(150) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    descripcion TEXT,
    imagen VARCHAR(255)
);

-- Tabla de Usuarios Administradores (para el Login)
CREATE TABLE IF NOT EXISTS usuarios_admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- --- INSERCIÓN DE DATOS INICIALES (TEST) ---

INSERT INTO usuarios_admin (usuario, password) 
VALUES ('admin', '12345')
ON DUPLICATE KEY UPDATE usuario=usuario;

-- Insercion de un luchador de prueba
INSERT INTO luchadores (nombre, bando, categoria, titulos, exp, imagen)
VALUES ('Psycho Clown', 'TÉCNICO', 'Estelar', 'Campeonato Mundial de Tríos', '15 años', '')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Insecion de un producto de prueba en la tienda
INSERT INTO tienda (producto, precio, categoria, stock, descripcion, imagen)
VALUES ('Máscara Oficial', 450.00, 'Máscaras', 10, 'Máscara ajustable de luchador profesional.', '')
ON DUPLICATE KEY UPDATE producto=producto;