export const siteConfig = {
  name: "JUNUBA",
  displayName: "JUNUBA",
  tagline: "Repuestos nuevos y usados para Starex, Staria, Porter y Bongo",
  description:
    "JUNUBA es especialista en repuestos nuevos y usados para vehículos comerciales Hyundai Starex, Hyundai Staria, Hyundai Porter y Kia Bongo, con foco en motores usados.",
  url: "https://junubadiesel.com",
  logoSrc: "/images/logo.png",
  logoAlt: "JUNUBA Corea Diesel — Repuestos",
  instagram: "https://www.instagram.com/junuba.korea/",
  instagramHandle: "@junuba.korea",
  phones: ["+1-809-932-3232", "+1829-262-3233", "+1-809-730-3499"] as const,
  officePhone: "+1-809-730-3499",
  phone: "+1-809-932-3232",
  whatsapp: "https://wa.me/18099323232",
  email: "ventas@junubadiesel.com",
  emails: ["ventas@junubadiesel.com", "junubacoreadiesel@gmail.com"] as const,
  country: "República Dominicana",
  address:
    "Autopista Duarte Km 22, No. 123, La Guayiga, Pedro Brand, Santo Domingo, Rep. Dominicana",
  mapsUrl:
    "https://www.google.com/maps/place/Junuba+Corea+Diesel/@18.5504336,-70.0536296,19z/data=!3m1!4b1!4m6!3m5!1s0x8eaff536f2be783f:0xaf79d35e227f63d7!8m2!3d18.5504323!4d-70.0529859!16s%2Fg%2F11vk32blvr?entry=ttu",
  businessNumber: "Registro comercial RD",
  ceo: "Junuba Corea Diesel",
  hours:
    "Lun–Vie 8:30 a.m.–5:30 p.m. · Sáb 8:30 a.m.–1:30 p.m. (cerrado dom y festivos)",
} as const;

export const navLinks = [
  { href: "/#about", label: "Nosotros" },
  { href: "/#vehicles", label: "Vehículos" },
  { href: "/recursos", label: "Recursos" },
  { href: siteConfig.instagram, label: "Instagram", external: true },
  { href: "/#contact", label: "Contacto" },
] as const;

export type VehicleId = "starex" | "staria" | "porter" | "bongo";
export type ConditionId = "new" | "used";
export type CategoryId =
  | "engine"
  | "transmission"
  | "exterior"
  | "electrical"
  | "other";

export const vehicleLabels: Record<VehicleId, string> = {
  starex: "Hyundai Starex",
  staria: "Hyundai Staria",
  porter: "Hyundai Porter",
  bongo: "Kia Bongo",
};

export const conditionLabels: Record<ConditionId, string> = {
  new: "Nuevo",
  used: "Usado",
};

export const categoryLabels: Record<CategoryId, string> = {
  engine: "Motor",
  transmission: "Transmisión",
  exterior: "Carrocería",
  electrical: "Eléctrico",
  other: "Otros",
};

export const vehicleKeywords: Record<VehicleId, string[]> = {
  starex: ["Motor D4CB", "Transmisión", "Faro", "Paragolpes"],
  staria: ["Motor G4KD", "Puerta", "Espejo", "ECU"],
  porter: ["Motor D4BH", "Motor J3", "Paragolpes del.", "Radiador"],
  bongo: ["Motor J3", "D4BH", "Culata", "Suspensión"],
};

export const ui = {
  viewParts: "Ver stock JUNUBA",
  viewCatalog: "Ver stock",
  viewStock: "Ver stock",
  consultarRepuesto: "Consultar repuesto",
  solicitarConsulta: "Solicitar consulta",
  piezasFrecuentes: "Piezas frecuentes OEM",
  buscarRepuesto: "Buscar repuesto",
  guiasVideos: "Guías y videos",
  partsInStock: "Repuestos en stock",
  partsBanner:
    "Piezas disponibles en nuestro almacén. Precio y envío por consulta.",
  noOemCode: "¿No encuentra el código?",
  recursosTitle: "Guías y recursos",
  recursosDesc:
    "Mantenimiento, consejos y videos para Starex, Staria, Porter y Bongo.",
  followInstagram: "Seguir en Instagram",
  viewDetails: "Ver detalles",
  requestQuote: "Solicitar cotización",
  filter: "Filtros",
  clearFilters: "Limpiar filtros",
  totalParts: "repuestos en total",
  noPartsFound: "No hay repuestos que coincidan con los filtros.",
  noPartsHint: "Cambie los filtros o contáctenos directamente.",
  loadingFilters: "Cargando filtros...",
  relatedParts: "Repuestos relacionados",
  specs: "Especificaciones",
  quoteNote: "Stock, precio y envío se confirman por consulta.",
  year: "Año compatible",
  home: "Inicio",
  parts: "Repuestos",
  notFoundTitle: "404",
  notFoundMessage: "No se encontró la página solicitada.",
  backHome: "Volver al inicio",
  partsNotFound: "Repuesto no encontrado",
  footerQuickLinks: "Enlaces",
  footerBusiness: "Información comercial",
  footerTerms: "Términos de servicio",
  footerPrivacy: "Política de privacidad",
  companyName: "JUNUBA",
  allEngines: "Ver todos los motores",
  commercialParts: "Especialistas en repuestos comerciales",
  selectVehicle: "Seleccionar vehículo",
  searchOemNumber: "Buscar código OEM",
  searchOemPlaceholder: "Ej: 391002A000",
  loading: "Cargando…",
  contactAboutOem: "Consultar esta categoría",
  contactJunuba: "Consultar con JUNUBA",
  popupBlocked: "El navegador bloqueó la ventana emergente. Use el botón o copie el enlace.",
  buscarCodigoOem: "Buscar código OEM",
  stockJUNUBA: "Stock JUNUBA",
  inStock: "En stock",
  lowStock: "Pocas unidades",
  outOfStock: "Agotado",
  unitsInStock: "unidades en stock",
  noStockJunuba: "No en stock — Solicitar cotización",
  viewPart: "Ver repuesto",
  erpSyncTitle: "Sincronización ERP",
  erpSyncDesc:
    "Suba el CSV de YUHAN ERP o el Excel JUNUBA INFORMAR PIEZAS.xlsx (Ventas) para actualizar el catálogo web.",
  uploadCsv: "Subir archivo",
  uploadExcelHint: "JUNUBA INFORMAR PIEZAS.xlsx — incluye fotos embebidas",
  imagesExtracted: "Imágenes extraídas",
  sheetsProcessed: "Hojas procesadas",
  downloadTemplate: "Descargar plantilla CSV",
  lastSync: "Última sincronización",
  syncSuccess: "Sincronización completada",
  syncError: "Error de sincronización",
  adminPassword: "Contraseña de administrador",
  syncedProducts: "Productos sincronizados",
  inStockProducts: "Con stock",
  adminLogin: "Acceder",
  partsWithPhotos: "Repuestos con foto",
  partsWithPhotosDesc: "Catálogo sincronizado desde Ventas — fotos reales del almacén.",
  viewOnGoogleMaps: "Ver en Google Maps",
  contactWhatsApp: "WhatsApp",
  notes: "Notas",
  remove: "Eliminar",
  linkCopied: "Enlace copiado",
  listCopied: "Lista copiada al portapapeles",
  searchParts: "Buscar repuestos",
  searchPartsPlaceholder: "Nombre, OEM o código de pieza",
  searchPartsHint: "Presione Enter para buscar en el catálogo",
  contactSubmit: "Enviar consulta",
  contactSuccess: "Consulta enviada correctamente",
  contactError: "No se pudo enviar la consulta",
  loadMoreParts: "Cargar más repuestos",
  pageLabel: "Página",
  aiQuote: "Generar cotización con IA",
  aiQuoteGenerating: "Generando cotización...",
} as const;
