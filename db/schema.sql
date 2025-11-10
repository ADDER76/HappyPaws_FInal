-- Activar claves foráneas
PRAGMA foreign_keys = ON;

-- Eliminamos tablas existentes en orden inverso a dependencias
DROP TABLE IF EXISTS Vacunas;
DROP TABLE IF EXISTS Mascota;
DROP TABLE IF EXISTS Refugio;
DROP TABLE IF EXISTS SupAdmin;
DROP TABLE IF EXISTS Responsables_de_Refugio;
DROP TABLE IF EXISTS Usuario;

-- Tabla Usuario
CREATE TABLE Usuario (
    idUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreComp TEXT,
    email TEXT,
    password TEXT,
    telefono TEXT,
    ciudad TEXT
);

-- Tabla Responsables_de_Refugio
CREATE TABLE Responsables_de_Refugio (
    idRes INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreRes TEXT,
    direccionRes TEXT,
    email TEXT,
    telefono TEXT,
    password TEXT
);

-- Tabla SupAdmin
CREATE TABLE SupAdmin (
    idAdmin INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreAdm TEXT,
    email TEXT,
    password TEXT,
    ciudad TEXT
);

-- Tabla Refugio
CREATE TABLE Refugio (
    idRefugio INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreRef TEXT,
    direccionRef TEXT,
    horarioAtenc TEXT,
    tipoRef TEXT
);

-- Tabla Mascota
CREATE TABLE Mascota (
    idMascota INTEGER PRIMARY KEY AUTOINCREMENT,
    idRefugio INTEGER,
    nombreMasc TEXT,
    especie TEXT,
    raza TEXT,
    sexo TEXT,
    edadY INTEGER,
    FOREIGN KEY (idRefugio) REFERENCES Refugio(idRefugio)
);

-- Tabla Vacunas
CREATE TABLE Vacunas (
    idVacuna INTEGER PRIMARY KEY AUTOINCREMENT,
    idMascota INTEGER,
    nombreVac TEXT,
    fechaAplicacion TEXT,
    FOREIGN KEY (idMascota) REFERENCES Mascota(idMascota)
);
