# HappyPaws

HappyPaws es una aplicación web educativa que muestra el flujo completo de un portal de adopción de mascotas. Incluye pantallas y lógica básica para personas interesadas en adoptar, además de un módulo independiente para refugios. Aunque actualmente funciona con datos persistidos en `localStorage` y scripts SQL de ejemplo, la estructura está pensada para que otro equipo pueda extenderla fácilmente a un backend real.

## Propósito y objetivos
- **Facilitar la adopción responsable:** ofrece a los visitantes un catálogo navegable de mascotas con fichas detalladas y un flujo de contacto simulado.
- **Dar visibilidad a los refugios:** cada refugio puede registrarse, administrar su perfil y sus mascotas desde un panel dedicado.
- **Servir como base de aprendizaje:** el proyecto reúne HTML, CSS, JavaScript y SQLite para que estudiantes practiquen cómo conectar una interfaz moderna con una base de datos ligera.

## Visión general de la arquitectura
| Capa | Descripción |
| --- | --- |
| **Frontend estático** | Archivos HTML, CSS y JavaScript sin framework que se pueden abrir directamente en el navegador. Los módulos `script.js` (usuarios) y `refugio.js` (refugios) gestionan la navegación entre secciones y el almacenamiento local. |
| **Persistencia en el navegador** | Tanto las cuentas de usuario como las de refugio se guardan en `localStorage` para simular un backend. Las mascotas y refugios pre cargados se definen en arreglos locales. |
| **Base de datos de referencia** | `db/schema.sql` y `db/seed.sql` definen el modelo relacional real que se espera implementar en SQLite cuando se conecte un backend. |

La separación clara entre la capa visual y la persistencia hace posible migrar paulatinamente desde `localStorage` a solicitudes HTTP contra una API real.

## Estructura del repositorio
```
HappyPaws_FInal/
├── frontend/
│   ├── css/
│   │   ├── style.css
│   │   ├── style_refugio.css
│   │   ├── styles.css
│   │   └── usuario.css
│   └── html/
│       ├── index.html
│       ├── login_usuario.html
│       ├── menu.js
│       ├── refugio.html
│       ├── refugio.js
│       ├── script.js
│       └── usuario.html
├── db/
│   ├── schema.sql
│   └── seed.sql
├── makefile
├── package.json
└── package-lock.json
```

## Frontend
### Páginas HTML
- **`frontend/html/index.html`**: página de aterrizaje que explica el proyecto, ofrece CTA para registrarse/iniciar sesión y añade un preloader animado que muestra la identidad visual de la marca.【F:frontend/html/index.html†L1-L104】
- **`frontend/html/login_usuario.html` y `frontend/html/usuario.html`**: formularios y panel de usuario que reutilizan los componentes definidos en `script.js` para alternar secciones de forma dinámica.
- **`frontend/html/refugio.html`**: flujo completo para los refugios, con tarjetas de mascotas, formularios de registro y un panel con secciones de configuración, adopciones y estadísticas.

Cada documento importa únicamente los estilos y scripts necesarios, lo que facilita reutilizar los módulos de JavaScript en caso de dividir las vistas en un framework posterior.

### Estilos CSS
El directorio `frontend/css/` contiene hojas separadas por contexto:
- `style.css` controla la página de inicio e incluye animaciones para el preloader y tarjetas responsivas.
- `styles.css` se enfoca en el panel de usuario y sus tarjetas de mascota.
- `usuario.css` y `style_refugio.css` aíslan las variaciones visuales específicas para cada módulo.

Esta separación simplifica la migración a un sistema de diseño o a un preprocesador sin mezclar responsabilidades.

### Lógica de usuarios (`script.js`)
El archivo `script.js` encapsula toda la experiencia del adoptante:
- Administra el estado de las secciones visibles (`inicio`, `login`, `registro` y `panelUsuario`) mediante la función `mostrarSolo` para imitar un SPA sin frameworks.【F:frontend/html/script.js†L9-L24】
- Permite registrar usuarios y mantener la sesión en `localStorage`, validando duplicados y mostrando mensajes contextualizados en pantalla.【F:frontend/html/script.js†L29-L69】
- Carga un catálogo predefinido de refugios y mascotas, los representa como tarjetas animadas y permite ver detalles, filtrar por especie, ciudad o refugio, y registrar solicitudes de adopción que quedan almacenadas localmente.【F:frontend/html/script.js†L85-L157】【F:frontend/html/script.js†L175-L307】
- Gestiona un bandeja de solicitudes donde el usuario puede dar seguimiento o cancelar su interés en una mascota.【F:frontend/html/script.js†L266-L321】

El patrón general es mantener todos los datos en memoria y reflejarlos en el DOM. Sustituir estas operaciones por llamadas `fetch` sería el primer paso para conectar con una API real.

### Lógica de refugios (`refugio.js`)
`refugio.js` replica la arquitectura anterior enfocada en los refugios:
- Registra y autentica refugios en `localStorage`, persiste la sesión activa y controla la navegación entre vistas de inicio, login, registro y panel.【F:frontend/html/refugio.js†L5-L80】
- Permite que cada refugio mantenga su perfil, edite datos de contacto y contraseña, y sincroniza los cambios tanto en la sesión como en la “base de datos” local.【F:frontend/html/refugio.js†L112-L192】
- Incluye utilidades para administrar el catálogo de mascotas del refugio, revisar solicitudes y responderlas, lo que resulta útil como especificación del comportamiento esperado para un backend futuro.【F:frontend/html/refugio.js†L194-L356】

### Utilidades comunes
- `menu.js` controla el menú hamburguesa y cierra el desplegable cuando se hace clic fuera del componente.【F:frontend/html/menu.js†L1-L17】
- `usuario.js` ofrece una versión independiente del panel de usuarios con datos simulados, carga inicial del perfil y acciones básicas como adoptar (alertas) o cerrar sesión.【F:frontend/html/usuario.js†L1-L55】

## Base de datos de referencia
El proyecto incluye scripts de SQLite que sirven como contrato de datos:
- `schema.sql` define tablas para usuarios, responsables de refugio, administradores, refugios, mascotas y vacunas, con claves foráneas y restricciones mínimas.【F:db/schema.sql†L1-L48】
- `seed.sql` proporciona datos de ejemplo coherentes con el catálogo simulado en el frontend, útiles para demos o pruebas iniciales.【F:db/seed.sql†L1-L34】

Para inicializar la base de datos basta con ejecutar:
```bash
sqlite3 happypaws.db < db/schema.sql
sqlite3 happypaws.db < db/seed.sql
```
Esto genera un archivo `happypaws.db` listo para conectar desde un backend Node, Python u otro lenguaje.

## Puesta en marcha
1. Clona el repositorio y abre `frontend/html/index.html` en tu navegador. No se requiere servidor web gracias a que todo es estático.
2. Opcionalmente, utiliza la extensión “Live Server” de VS Code o cualquier servidor estático para habilitar navegación relativa limpia.
3. Para simular un backend, abre las herramientas de desarrollador → pestaña “Application/Storage” y resetea `localStorage` entre sesiones.
4. Si vas a conectar un backend real, crea el archivo `happypaws.db` con los comandos anteriores y actualiza los scripts frontend para consultar tu API.

## Flujo funcional resumido
1. **Visitante** entra al landing (`index.html`), conoce la misión y decide registrarse.
2. **Registro/Iniciar sesión**: se crea o valida la cuenta y se persiste en `localStorage`.
3. **Exploración**: el usuario ve mascotas, filtra por criterios y solicita adopciones.
4. **Refugio**: mediante `refugio.html`, puede registrar su organización, actualizar datos y revisar solicitudes entrantes.
5. **Administrador futuro**: gracias al esquema SQL, es posible añadir un módulo de super administración con métricas globales.

## Recomendaciones para extender el proyecto
- Sustituir el almacenamiento local por una API REST, replicando los endpoints sugeridos por las tablas SQL.
- Centralizar estilos en un diseño de componentes reutilizables para mantener consistencia.
- Integrar un sistema de autenticación real (JWT, sesiones) aprovechando las tablas `Usuario`, `Responsables_de_Refugio` y `SupAdmin`.
- Agregar pruebas unitarias para la lógica de filtrado y validación antes de migrar a un framework más robusto.

## Créditos
Proyecto desarrollado por el equipo HappyPaws como base para prácticas de desarrollo web full-stack.
