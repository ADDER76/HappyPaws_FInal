// ======================================================
// 🐾 HappyPaws – Módulo de Refugios
// ======================================================

// ===== Simulación de base de datos local =====
let refugios = JSON.parse(localStorage.getItem("refugios")) || [];
let refugioActivo = JSON.parse(localStorage.getItem("refugioActivo")) || null;

// ====== Referencias a secciones ======
const inicioSection = document.getElementById("inicioSection");
const loginSection = document.getElementById("loginSection");
const registroSection = document.getElementById("registroSection");
const panelRefugio = document.getElementById("panelRefugio");
const perfilRefugio = document.getElementById("perfilRefugio");

// ======================================================
// === FUNCIONES DE CAMBIO DE VISTA ===
// ======================================================
function ocultarTodo() {
  [inicioSection, loginSection, registroSection, panelRefugio].forEach(
    (s) => (s.style.display = "none")
  );
}

function mostrarSolo(seccionActiva) {
  ocultarTodo();
  seccionActiva.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarLogin() {
  mostrarSolo(loginSection);
}

function mostrarRegistro() {
  mostrarSolo(registroSection);
}

function mostrarInicio() {
  mostrarSolo(inicioSection);
}

// ======================================================
// === MOSTRAR PANEL DEL REFUGIO ===
// ======================================================
function mostrarPanelRefugio() {
  ocultarTodo();
  panelRefugio.style.display = "block";

  const refugio = JSON.parse(localStorage.getItem("refugioActivo"));
  perfilRefugio.innerHTML = `
    <p><strong>Nombre:</strong> ${refugio.nombre}</p>
    <p><strong>Email:</strong> ${refugio.email}</p>
    <p><strong>Teléfono:</strong> ${refugio.telefono || "No registrado"}</p>
    <p><strong>Ciudad:</strong> ${refugio.ciudad || "No especificada"}</p>
    <p><strong>Responsable:</strong> ${refugio.responsable || "No registrado"}</p>
  `;

  // Mostrar la vista principal al entrar
  mostrarSeccion("principal");

  // Precargar datos en Configuración
  const tel = document.getElementById("cfgTelefono");
  if (tel) {
    document.getElementById("cfgTelefono").value = refugio.telefono || "";
    document.getElementById("cfgCiudad").value = refugio.ciudad || "";
    document.getElementById("cfgResponsable").value = refugio.responsable || "";
  }
}

// ======================================================
// === REGISTRO DE NUEVO REFUGIO ===
// ======================================================
function registrarRefugio() {
  const nombre = document.getElementById("nombreRefugio").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const ciudad = document.getElementById("ciudad").value.trim();
  const responsable = document.getElementById("responsable").value.trim();

  if (!nombre || !email || !password) {
    return mostrarAlerta("Por favor completa los campos obligatorios.", "error");
  }

  if (refugios.find((r) => r.email === email)) {
    return mostrarAlerta("Ya existe un refugio con este correo.", "error");
  }

  const nuevoRefugio = {
    idRefugio: Date.now(),
    nombre,
    email,
    password,
    telefono,
    ciudad,
    responsable,
  };

  refugios.push(nuevoRefugio);
  localStorage.setItem("refugios", JSON.stringify(refugios));

  mostrarAlerta("Registro exitoso 🐾 Ahora puedes iniciar sesión.", "success");
  mostrarLogin();

  // Limpiar formulario
  document.getElementById("registroForm").reset();
}

// ======================================================
// === INICIO DE SESIÓN DE REFUGIO ===
// ======================================================
function iniciarSesion() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    return mostrarAlerta("Completa todos los campos.", "error");
  }

  const refugio = refugios.find(
    (r) => r.email === email && r.password === password
  );

  if (!refugio) {
    return mostrarAlerta("Credenciales incorrectas.", "error");
  }

  refugioActivo = refugio;
  localStorage.setItem("refugioActivo", JSON.stringify(refugio));

  mostrarAlerta(`¡Bienvenido, ${refugio.nombre}! 💙`, "success");
  setTimeout(mostrarPanelRefugio, 800);
}

// ======================================================
// === CERRAR SESIÓN ===
// ======================================================
function cerrarSesion() {
  localStorage.removeItem("refugioActivo");
  mostrarInicio();
  mostrarAlerta("Sesión cerrada correctamente.", "info");
}

// ======================================================
// === GUARDAR CONFIGURACIÓN ===
// ======================================================
function guardarConfiguracion(ev) {
  ev.preventDefault();

  const pass1 = document.getElementById("cfgPass1").value.trim();
  const pass2 = document.getElementById("cfgPass2").value.trim();
  const tel = document.getElementById("cfgTelefono").value.trim();
  const ciudad = document.getElementById("cfgCiudad").value.trim();
  const responsable = document.getElementById("cfgResponsable").value.trim();

  if (pass1 || pass2) {
    if (pass1.length < 6) {
      return mostrarAlerta("La contraseña debe tener al menos 6 caracteres.", "error");
    }
    if (pass1 !== pass2) {
      return mostrarAlerta("Las contraseñas no coinciden.", "error");
    }
  }

  let ra = JSON.parse(localStorage.getItem("refugioActivo"));
  if (!ra) return mostrarAlerta("No hay sesión activa.", "error");

  // Actualizar campos
  ra.telefono = tel;
  ra.ciudad = ciudad;
  ra.responsable = responsable;
  if (pass1) ra.password = pass1;

  // Actualizar lista de refugios
  let lista = JSON.parse(localStorage.getItem("refugios")) || [];
  const idx = lista.findIndex((x) => x.email === ra.email);
  if (idx >= 0) {
    lista[idx] = ra;
    localStorage.setItem("refugios", JSON.stringify(lista));
  }

  // Actualizar sesión activa
  localStorage.setItem("refugioActivo", JSON.stringify(ra));
  refugioActivo = ra;

  // Refrescar perfil
  if (perfilRefugio) {
    perfilRefugio.innerHTML = `
      <p><strong>Nombre:</strong> ${ra.nombre}</p>
      <p><strong>Email:</strong> ${ra.email}</p>
      <p><strong>Teléfono:</strong> ${ra.telefono || "No registrado"}</p>
      <p><strong>Ciudad:</strong> ${ra.ciudad || "No especificada"}</p>
      <p><strong>Responsable:</strong> ${ra.responsable || "No registrado"}</p>
    `;
  }

  // Limpiar contraseñas
  document.getElementById("cfgPass1").value = "";
  document.getElementById("cfgPass2").value = "";

  mostrarAlerta("Configuración guardada correctamente.", "success");
}

// ======================================================
// === SUBSECCIONES DEL PANEL ===
// ======================================================
function mostrarSeccion(seccion) {
  document.querySelectorAll(".subpanel").forEach((sec) => (sec.style.display = "none"));

  const id = "seccion" + seccion.charAt(0).toUpperCase() + seccion.slice(1);
  const target = document.getElementById(id);

  if (target) target.style.display = "block";

  // Cerrar menú desplegable si estaba abierto
  const menu = document.getElementById("dropdownMenu");
  if (menu) menu.classList.remove("show");
}

// ======================================================
// === MENÚ DESPLEGABLE (HEADER) ===
// ======================================================
function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("show");
}

window.addEventListener("click", function (e) {
  const menu = document.getElementById("dropdownMenu");
  const btn = document.querySelector(".menu-btn");
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove("show");
  }
});

// ======================================================
// === ALERTAS BONITAS ===
// ======================================================
function mostrarAlerta(mensaje, tipo = "info") {
  const colores = {
    success: "#c1f4d3",
    error: "#f8caca",
    info: "#d7e7ff",
  };

  const alerta = document.createElement("div");
  alerta.textContent = mensaje;
  Object.assign(alerta.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 18px",
    borderRadius: "10px",
    background: colores[tipo] || "#eee",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    zIndex: "9999",
    fontWeight: "600",
    transition: "all 0.4s ease",
  });
  document.body.appendChild(alerta);

  setTimeout(() => {
    alerta.style.opacity = "0";
    alerta.style.transform = "translateY(-10px)";
    setTimeout(() => alerta.remove(), 400);
  }, 2500);
}

// ======================================================
// === GESTIÓN DE MASCOTAS ===
// ======================================================

// Abre el modal
function abrirFormularioMascota() {
  document.getElementById("modalMascota").style.display = "flex";
}

// Cierra el modal
function cerrarModalMascota() {
  document.getElementById("modalMascota").style.display = "none";
  document.getElementById("formMascota").reset();
}

// Guarda la mascota
function guardarMascota(event) {
  event.preventDefault();

  const refugio = JSON.parse(localStorage.getItem("refugioActivo"));
  if (!refugio) return mostrarAlerta("No hay sesión activa.", "error");

  const nombre = document.getElementById("nombreMascota").value.trim();
  const edad = document.getElementById("edadMascota").value.trim();
  const tamano = document.getElementById("tamanoMascota").value;
  const estado = document.getElementById("estadoMascota").value;
  const descripcion = document.getElementById("descripcionMascota").value.trim();
  const archivo = document.getElementById("fotoMascota").files[0];

  let fotoBase64 = "";
  if (archivo) {
    const reader = new FileReader();
    reader.onload = function (e) {
      fotoBase64 = e.target.result;
      guardar();
    };
    reader.readAsDataURL(archivo);
  } else {
    guardar();
  }

  function guardar() {
    const nuevaMascota = {
      idMascota: Date.now(),
      idRefugio: refugio.idRefugio,
      nombre,
      edad,
      tamano,
      estado,
      descripcion,
      foto: fotoBase64 || "",
    };

    let mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];
    mascotas.push(nuevaMascota);
    localStorage.setItem("mascotas", JSON.stringify(mascotas));

    mostrarAlerta("Mascota registrada correctamente 🐶", "success");
    cerrarModalMascota();
    mostrarMascotasRefugio();
  }
}

// Muestra las mascotas del refugio activo
function mostrarMascotasRefugio() {
  const lista = document.getElementById("listaMascotasRefugio");
  const refugio = JSON.parse(localStorage.getItem("refugioActivo"));
  const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

  const propias = mascotas.filter((m) => m.idRefugio === refugio.idRefugio);

  if (!propias.length) {
    lista.innerHTML = "<p>No hay mascotas registradas aún 🐾</p>";
    return;
  }

  lista.innerHTML = propias
    .map(
      (m) => `
      <div class="tarjeta-mascota">
        ${m.foto ? `<img src="${m.foto}" alt="${m.nombre}" class="foto-mascota">` : ""}
        <h4>${m.nombre}</h4>
        <p><strong>Edad:</strong> ${m.edad}</p>
        <p><strong>Tamaño:</strong> ${m.tamano}</p>
        <p><strong>Estado:</strong> ${m.estado}</p>
        <p>${m.descripcion || ""}</p>
      </div>
    `
    )
    .join("");
}

// Vista previa de imagen seleccionada
function mostrarPreview(event) {
  const archivo = event.target.files[0];
  const preview = document.getElementById("previewFotoMascota");
  if (archivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(archivo);
  }
}


// ======================================================
// === AUTOEJECUCIÓN AL CARGAR ===
// ======================================================
window.onload = () => {
  if (refugioActivo) {
    mostrarPanelRefugio();
    mostrarAlerta(`Bienvenido de nuevo, ${refugioActivo.nombre}`, "info");
  } else {
    mostrarInicio();
  }
};
