/**
 * Configuración de la Invitación de XV Años de Argelia Margarita
 * Actualizada con los datos oficiales del evento
 */

const DEFAULT_EVENT_DATA = {
  // Datos Principales
  quinceanera: {
    nombre: "Argelia Margarita",
    apellidos: "Hernández Olvera",
    monograma: "AM",
    subtitulo: "MIS XV",
    frase: "Doy gracias a Dios por estos quince años de vida, a mis padres por su amor incondicional, y a ti por formar parte de mi historia. Sería un gran honor contar con tu presencia en esta noche tan especial."
  },

  // Padres y Padrinos (Oculto temporalmente según indicación)
  padres: {
    mostrar: false,
    papa: "",
    mama: ""
  },
  padrinos: {
    mostrar: false,
    padrino: "",
    madrina: ""
  },

  // Fecha y Horarios Oficiales
  evento: {
    fechaISO: "2026-12-20T18:00:00",
    fechaDisplay: "Domingo, 20 de Diciembre de 2026",
    diaNumero: "20",
    mesNombre: "DICIEMBRE",
    anio: "2026",
    horaMisa: "6:00 PM",
    horaRecepcion: "7:00 PM"
  },

  // Ubicaciones Oficiales (Hotel Grand Royal Tampico)
  ceremonia: {
    lugar: "Anexo Grand Royal",
    complejo: "Hotel Grand Royal Tampico",
    direccion: "Av. Miguel Hidalgo #6814, Col. Arenal (Frente al Aeropuerto)",
    ciudad: "Tampico, Tamaulipas",
    googleMapsUrl: "https://maps.google.com/?q=Hotel+Grand+Royal+Tampico",
    wazeUrl: "https://waze.com/ul?q=Hotel+Grand+Royal+Tampico"
  },
  recepcion: {
    lugar: "Salón Camelia",
    complejo: "Hotel Grand Royal Tampico",
    direccion: "Av. Miguel Hidalgo #6814, Col. Arenal (Frente al Aeropuerto)",
    ciudad: "Tampico, Tamaulipas",
    googleMapsUrl: "https://maps.google.com/?q=Hotel+Grand+Royal+Tampico",
    wazeUrl: "https://waze.com/ul?q=Hotel+Grand+Royal+Tampico"
  },

  // Itinerario oficial coordinado
  itinerario: [
    { hora: "6:00 PM", titulo: "Ceremonia Religiosa", desc: "Anexo Grand Royal · Misa de acción de gracias" },
    { hora: "7:00 PM", titulo: "Recepción & Bienvenida", desc: "Salón Camelia · Asignación de mesas y bienvenida" },
    { hora: "7:30 PM", titulo: "Presentación y Vals", desc: "El momento más esperado junto a mi familia" },
    { hora: "8:00 PM", titulo: "Cena de Gala", desc: "Banquete en honor a Argelia Margarita" },
    { hora: "9:00 PM", titulo: "Apertura de Pista", desc: "Música, brindis y a celebrar toda la noche" }
  ],

  // Código de Vestimenta Oficial
  dressCode: {
    tipo: "Formal",
    descripcion: "Mujeres: Vestido formal · Hombres: Traje formal",
    detalleMujeres: "Vestido formal de gala o cóctel",
    detalleHombres: "Traje formal con corbata o camisa de vestir",
    colorReservado: "Color Rosa",
    aviso: "Agradecemos de corazón NO USAR COLOR ROSA, ya que está reservado exclusivamente para la quinceañera."
  },

  // Regalos (Sobre opcional)
  regalos: {
    lluviaDeSobres: true,
    titulo: "Mesa de Regalos & Lluvia de Sobres",
    mensajeSobres: "Tu presencia es mi mejor regalo, pero si deseas obsequiarme algo, contaremos con buzón para lluvia de sobres y mesa de regalos.",
    transferencia: {
      habilitada: false, // Deshabilitado para no forzar cuenta bancaria
      titular: "Argelia Margarita Hernández Olvera",
      banco: "BBVA México",
      clabe: "",
      tarjeta: ""
    }
  },

  // Confirmación de Asistencia (RSVP por WhatsApp)
  rsvp: {
    telefonoWhatsApp: "528332315716", // WhatsApp de mamá (Tampico: 833 231 5716)
    fechaLimite: "10 de Diciembre de 2026",
    textoBoton: "Confirmar Asistencia por WhatsApp"
  },

  // Canción de Fondo Oficial: Soy Luna - Quédate (Instrumental)
  musica: {
    activa: true,
    cancion: "Soy Luna - Quédate (Instrumental)",
    audioUrl: "assets/cancion.mp3",
    localAudio: "assets/cancion.mp3"
  },

  tema: "blush-rose"
};

function getSavedEventData() {
  const saved = localStorage.getItem("argelia_xv_data_v6");
  if (saved) {
    try {
      return { ...DEFAULT_EVENT_DATA, ...JSON.parse(saved) };
    } catch (e) {
      console.warn("Error leyendo datos guardados:", e);
    }
  }
  return DEFAULT_EVENT_DATA;
}

function persistEventData(data) {
  localStorage.setItem("argelia_xv_data_v6", JSON.stringify(data));
}
