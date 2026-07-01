-- Script SQL para crear la base de datos del Sistema IA
-- Ejecutar en phpMyAdmin (XAMPP) antes de usar Prisma

CREATE DATABASE IF NOT EXISTS sistema_ia_depresion
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE sistema_ia_depresion;

-- Las tablas serán creadas automáticamente por Prisma migrate
-- Este script solo crea la base de datos

SELECT 'Base de datos sistema_ia_depresion creada correctamente' AS resultado;
