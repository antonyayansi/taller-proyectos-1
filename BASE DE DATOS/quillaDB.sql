CREATE TABLE `usuarios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(100),
  `correo` varchar(150) UNIQUE NOT NULL,
  `password_hash` text NOT NULL,
  `foto_perfil` text,
  `intereses` text,
  `fecha_registro` timestamp
);

CREATE TABLE `sesiones` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `usuario_id` int,
  `token` text,
  `creado_en` timestamp,
  `expira_en` timestamp
);

CREATE TABLE `categorias` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(50) UNIQUE NOT NULL
);

CREATE TABLE `sitios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `categoria_id` int,
  `lat` double,
  `lng` double,
  `horarios` text,
  `tarifas` text,
  `destacado` boolean
);

CREATE TABLE `imagenes_sitio` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `sitio_id` int,
  `url` text
);

CREATE TABLE `rutas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `sitio_id` int,
  `titulo` varchar(150),
  `descripcion` text,
  `duracion_estimada` int
);

CREATE TABLE `audios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `ruta_id` int,
  `idioma` varchar(10),
  `narrador` varchar(100),
  `url_audio` text
);

CREATE TABLE `favoritos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `usuario_id` int,
  `sitio_id` int,
  `creado_en` timestamp
);

CREATE TABLE `busquedas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `usuario_id` int,
  `termino` varchar(150),
  `creado_en` timestamp
);

CREATE TABLE `recomendaciones` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `usuario_id` int,
  `sitio_id` int,
  `motivo` text,
  `creado_en` timestamp
);

CREATE TABLE `reseñas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `usuario_id` int,
  `sitio_id` int,
  `comentario` text,
  `calificacion` int,
  `creado_en` timestamp
);

CREATE TABLE `eventos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `titulo` varchar(150),
  `descripcion` text,
  `lugar` varchar(150),
  `fecha` timestamp,
  `categoria` varchar(50)
);

CREATE TABLE `notificaciones` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `usuario_id` int,
  `titulo` varchar(150),
  `mensaje` text,
  `fecha_envio` timestamp,
  `leido` boolean
);

CREATE TABLE `servicios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(150),
  `tipo` varchar(50),
  `lat` double,
  `lng` double,
  `telefono` varchar(20),
  `sitio_web` text
);

CREATE TABLE `guias` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(100),
  `telefono` varchar(20),
  `correo` varchar(150),
  `certificado` boolean
);

CREATE TABLE `reportes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `usuario_id` int,
  `tipo_objeto` varchar(50),
  `objeto_id` int,
  `motivo` text,
  `fecha` timestamp,
  `estado` varchar(20)
);

ALTER TABLE `sesiones` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `sitios` ADD FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);

ALTER TABLE `imagenes_sitio` ADD FOREIGN KEY (`sitio_id`) REFERENCES `sitios` (`id`);

ALTER TABLE `rutas` ADD FOREIGN KEY (`sitio_id`) REFERENCES `sitios` (`id`);

ALTER TABLE `audios` ADD FOREIGN KEY (`ruta_id`) REFERENCES `rutas` (`id`);

ALTER TABLE `favoritos` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `favoritos` ADD FOREIGN KEY (`sitio_id`) REFERENCES `sitios` (`id`);

ALTER TABLE `busquedas` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `recomendaciones` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `recomendaciones` ADD FOREIGN KEY (`sitio_id`) REFERENCES `sitios` (`id`);

ALTER TABLE `reseñas` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `reseñas` ADD FOREIGN KEY (`sitio_id`) REFERENCES `sitios` (`id`);

ALTER TABLE `notificaciones` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `reportes` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
