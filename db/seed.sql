-- Datos iniciales

-- Usuarios
INSERT INTO Usuario (nombreComp, email, password, telefono, ciudad)
VALUES 
('Myrna Leal', 'myrna.leal@iest.edu.mx', 'drake', '8331234567', 'Tampico'),
('Carlos Ruiz', 'carlos.ruiz@mail.com', 'pass123', '8335551122', 'Madero');

-- Responsables de Refugio
INSERT INTO Responsables_de_Refugio (nombreRes, direccionRes, email, telefono, password)
VALUES 
('Laura Gómez', 'Calle 10 #45', 'laura.gomez@mail.com', '8337891234', 'secure1'),
('Andrés López', 'Av. Hidalgo 1234', 'andres.lopez@mail.com', '8336547890', 'secure2');

-- Super Administradores
INSERT INTO SupAdmin (nombreAdm, email, password, ciudad)
VALUES 
('Admin General', 'admin@mail.com', 'root123', 'Altamira');

-- Refugios
INSERT INTO Refugio (nombreRef, direccionRef, horarioAtenc, tipoRef)
VALUES 
('Refugio Esperanza', 'Av. Universidad 123', 'L-V 9am-6pm', 'Canino'),
('Hogar Feliz', 'Calle Central 45', 'L-S 8am-5pm', 'Felino');

-- Mascotas
INSERT INTO Mascota (idRefugio, nombreMasc, especie, raza, sexo, edadY)
VALUES 
(1, 'Luna', 'Perro', 'Labrador', 'Hembra', 3),
(2, 'Michi', 'Gato', 'Siames', 'Macho', 2);

-- Vacunas
INSERT INTO Vacunas (idMascota, nombreVac, fechaAplicacion)
VALUES 
(1, 'Rabia', '2024-02-15'),
(1, 'Parvovirus', '2024-06-10'),
(2, 'Triple Felina', '2024-03-20');
