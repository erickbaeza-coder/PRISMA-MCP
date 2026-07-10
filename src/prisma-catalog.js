// ============================================================
// Prisma Catalog — Catálogo de componentes de Prisma-Components
// Fuente: referencia rápida de DS3 SKILL.md + componentes conocidos
// ============================================================

// Catálogo base extraído del skill DS3 (referencia real de Figma)
const BASE_CATALOG = [
  // Nav Bar
  { group: 'Nav Bar', name: 'Nav Bar > Header · Color=White · Type=Home · State=Default',       tags: ['header', 'navigation', 'home', 'navbar', 'top'] },
  { group: 'Nav Bar', name: 'Nav Bar > Header · Color=Color · Type=Brand · State=Default',       tags: ['header', 'navigation', 'brand', 'colored', 'top'] },
  { group: 'Nav Bar', name: 'Nav Bar > NavBar · Color=Color · Type=Home · State=Default',        tags: ['navbar', 'bottom', 'navigation', 'tabs', 'footer', 'nav inferior'] },
  { group: 'Nav Bar', name: 'Nav Bar > Search_header · State=Default',                           tags: ['search', 'header', 'buscar', 'búsqueda'] },

  // Top bar
  { group: 'Top bar', name: 'Top bar > TopBar · State=Default · Type=Icon action_no title',      tags: ['topbar', 'back', 'atrás', 'flecha', 'navigation', 'top', 'sin título'] },
  { group: 'Top bar', name: 'Top bar > TopBar_title · Type=Default',                             tags: ['topbar', 'title', 'título', 'navigation', 'top'] },

  // Buttons
  { group: 'Buttons', name: 'Buttons > Button-Primary · Size=Lg · State=Default',               tags: ['button', 'botón', 'primary', 'primario', 'cta', 'lg', 'large', 'grande', 'action'] },
  { group: 'Buttons', name: 'Buttons > Button-Secondary · Size=Md · State=Default',             tags: ['button', 'botón', 'secondary', 'secundario', 'md', 'medium'] },
  { group: 'Buttons', name: 'Buttons > Button-Tertiary · Size=Md · State=Default',              tags: ['button', 'botón', 'tertiary', 'terciario', 'ghost', 'link', 'md'] },

  // Product Card
  { group: 'Product Card', name: 'Product Card > Product_card · Size=Md · State=Default',       tags: ['product', 'card', 'tarjeta', 'producto', 'grid', 'vertical'] },
  { group: 'Product Card', name: 'Product Card > Product card_list · State=Default',             tags: ['product', 'card', 'tarjeta', 'producto', 'list', 'horizontal', 'lista'] },

  // ProductCard Details
  { group: 'ProductCard_Details', name: 'ProductCard_Details > ProductCard_Detail · Size=Md · State=Default', tags: ['product', 'detail', 'detalle', 'producto', 'pdp'] },

  // Title Section
  { group: 'Title_section', name: 'Title_section > Title_section · Skeleton=No · CTA=Yes',      tags: ['title', 'section', 'título', 'sección', 'cta', 'header', 'heading', 'ver más'] },
  { group: 'Title_section', name: 'Title_section > Title_section · Skeleton=No · CTA=No',       tags: ['title', 'section', 'título', 'sección', 'heading', 'sin cta'] },

  // Banners Cards
  { group: 'Banners Cards', name: 'Banners Cards > Banner_principal · Size=Sm · Skeleton=False', tags: ['banner', 'imagen', 'hero', 'promo', 'small', 'sm', 'pequeño'] },
  { group: 'Banners Cards', name: 'Banners Cards > Banner_principal · Size=Md · Skeleton=False', tags: ['banner', 'imagen', 'hero', 'promo', 'medium', 'md'] },
  { group: 'Banners Cards', name: 'Banners Cards > Banner_principal · Size=Lg · Skeleton=False', tags: ['banner', 'imagen', 'hero', 'promo', 'large', 'lg', 'grande', 'full'] },
  { group: 'Banners Cards', name: 'Banners Cards > _Banners terciarios (Carruseles) · Size=Md · Skeleton=False', tags: ['banner', 'carousel', 'carrusel', 'terciario', 'thumbnail', 'imagen pequeña'] },

  // Carrusels
  { group: 'Carrusels', name: 'Carrusels > Hero_banner · State=Default',                        tags: ['hero', 'carousel', 'carrusel', 'slider', 'banner hero', 'destacado'] },

  // Categorys
  { group: 'Categorys', name: 'Categorys > Category-carousel · State=Default',                  tags: ['category', 'categoría', 'carousel', 'carrusel', 'chips', 'filtros'] },

  // Quantity selector
  { group: 'Quantity selector', name: 'Quantity selector > Quantity Selector · Size=Md · State=Default', tags: ['quantity', 'cantidad', 'selector', 'counter', 'add', 'agregar', 'más menos'] },

  // Bottom sheet
  { group: 'Bottom sheet', name: 'Bottom sheet > Bottom_Sheet · State=Collapsed',               tags: ['bottom sheet', 'modal', 'drawer', 'sheet', 'panel', 'collapsed'] },

  // Totalizer
  { group: 'Totalizer', name: 'Totalizer > Totalizer · State=Default',                          tags: ['totalizer', 'total', 'precio total', 'resumen', 'checkout', 'suma'] },

  // Sticky Button
  { group: 'Sticky Button', name: 'Sticky Button > Sticky-button · Type=Horizontal',            tags: ['sticky', 'button', 'cta', 'fixed', 'bottom', 'fijo', 'agregar al carrito', 'comprar'] },

  // Alerts
  { group: 'Alerts', name: 'Alerts > Alert · Type=Info · Border=False',                         tags: ['alert', 'info', 'mensaje', 'información', 'aviso'] },
  { group: 'Alerts', name: 'Alerts > Alert · Type=Error · Border=False',                        tags: ['alert', 'error', 'mensaje error', 'warning', 'advertencia'] },

  // Snackbar
  { group: 'Snackbar', name: 'Snackbar > Snackbar · Type=Success',                              tags: ['snackbar', 'toast', 'success', 'éxito', 'notificación', 'confirmación'] },

  // Dialog
  { group: 'Dialog', name: 'Dialog > Dialog · State=Default',                                   tags: ['dialog', 'modal', 'popup', 'alert dialog', 'confirmación'] },

  // Empty States
  { group: 'Empty States', name: 'Empty States > Empty state · Type=Empty',                     tags: ['empty', 'vacío', 'no hay datos', 'sin resultados', 'sin contenido'] },

  // Tags
  { group: 'Tags', name: 'Tags > Tag · Color=Green',                                            tags: ['tag', 'badge', 'chip', 'etiqueta', 'verde', 'green', 'members', 'miembros'] },
  { group: 'Tags', name: 'Tags > Tag · Color=Orange',                                           tags: ['tag', 'badge', 'chip', 'etiqueta', 'naranja', 'orange', 'promo', 'oferta'] },
  { group: 'Tags', name: 'Tags > Tag · Color=Red',                                              tags: ['tag', 'badge', 'chip', 'etiqueta', 'rojo', 'red', 'descuento', 'urgente'] },
  { group: 'Tags', name: 'Tags > Tag · Color=Blue',                                             tags: ['tag', 'badge', 'chip', 'etiqueta', 'azul', 'blue', 'nuevo', 'new'] },
  { group: 'Tags', name: 'Tags > Tag · Color=Neutral',                                          tags: ['tag', 'badge', 'chip', 'etiqueta', 'neutral', 'gris', 'gray'] },

  // Chips
  { group: 'Chips', name: 'Chips > pds-chip · State=Default',                                  tags: ['chip', 'filter', 'filtro', 'selección', 'toggle', 'categoría'] },

  // Inputs
  { group: 'Inputs', name: 'Inputs > Input · State=Default',                                    tags: ['input', 'field', 'text field', 'campo', 'formulario', 'texto', 'escribir'] },

  // Select list
  { group: 'Select list', name: 'Select list > Select_list · Type=Check',                       tags: ['select', 'list', 'lista', 'checkbox', 'check', 'selección múltiple'] },

  // Location
  { group: 'Location', name: 'Location > location · Type=Recibe',                               tags: ['location', 'ubicación', 'recibe', 'delivery', 'domicilio', 'dirección'] },
  { group: 'Location', name: 'Location > location · Type=Retira',                               tags: ['location', 'ubicación', 'retira', 'pickup', 'tienda', 'retiro'] },
  { group: 'Location', name: 'Location > location · Type=Brand',                                tags: ['location', 'ubicación', 'brand', 'info row', 'fila info', 'detalle', 'metadata'] },
  { group: 'Location', name: 'Location > location · Type=Ofertas',                              tags: ['location', 'ubicación', 'ofertas', 'deals', 'tienda ofertas'] },

  // Payments
  { group: 'Payments', name: 'Payments > Payment · Type=VISA',                                  tags: ['payment', 'pago', 'tarjeta', 'visa', 'credit card', 'método de pago'] },

  // Levels Cards
  { group: 'LevelsCards', name: 'LevelsCards > CardNivele · Type=Plus',                         tags: ['loyalty', 'levels', 'niveles', 'membership', 'membresía', 'plus', 'tier'] },

  // Promo Card
  { group: 'Promo Card', name: 'Promo Card > Promo_card · State=Default · Type=Arrow',          tags: ['promo', 'card', 'tarjeta promo', 'arrow', 'flecha', 'link', 'cupón'] },
  { group: 'Promo Card', name: 'Promo Card > Promo_card · State=Default · Type=Button',         tags: ['promo', 'card', 'tarjeta promo', 'button', 'botón', 'cupón', 'reward', 'canjear'] },

  // Information Card
  { group: 'Information Card', name: 'Information Card > InformationCard · State=Brand · Skeleton=False',   tags: ['information', 'card', 'info', 'brand', 'cta', 'membresía', 'conversión', 'gate', 'unirse', 'registro'] },
  { group: 'Information Card', name: 'Information Card > InformationCard · State=Default · Skeleton=False', tags: ['information', 'card', 'info', 'default', 'neutral', 'informativo'] },
];

// Patrones de pantalla frecuentes (para infer from prompt)
export const SCREEN_PATTERNS = {
  feed: [
    { order: 1, component: 'Top bar > TopBar_title · Type=Default', role: 'navegación' },
    { order: 2, component: 'Title_section > Title_section · Skeleton=No · CTA=No', role: 'separador de sección' },
    { order: 3, tipo: 'composicion', nombre_intencional: 'ItemCard', role: 'tarjeta de ítem' },
    { order: 4, component: 'Nav Bar > NavBar · Color=Color · Type=Home · State=Default', role: 'nav inferior' }
  ],
  detail: [
    { order: 1, component: 'Top bar > TopBar · State=Default · Type=Icon action_no title', role: 'back navigation' },
    { order: 2, component: 'Banners Cards > Banner_principal · Size=Lg · Skeleton=False', role: 'imagen hero' },
    { order: 3, component: 'Tags > Tag · Color=Green', role: 'badge de categoría' },
    { order: 4, component: 'Title_section > Title_section · Skeleton=No · CTA=No', role: 'título y descripción' },
    { order: 5, component: 'Sticky Button > Sticky-button · Type=Horizontal', role: 'CTA principal' }
  ],
  home: [
    { order: 1, component: 'Nav Bar > Header · Color=White · Type=Home · State=Default', role: 'header principal' },
    { order: 2, component: 'Nav Bar > Search_header · State=Default', role: 'búsqueda' },
    { order: 3, component: 'Carrusels > Hero_banner · State=Default', role: 'banner hero' },
    { order: 4, component: 'Categorys > Category-carousel · State=Default', role: 'categorías' },
    { order: 5, component: 'Nav Bar > NavBar · Color=Color · Type=Home · State=Default', role: 'nav inferior' }
  ],
  gate: [
    { order: 1, component: 'Top bar > TopBar · State=Default · Type=Icon action_no title', role: 'back' },
    { order: 2, component: 'Banners Cards > Banner_principal · Size=Lg · Skeleton=False', role: 'imagen hero' },
    { order: 3, component: 'Title_section > Title_section · Skeleton=No · CTA=No', role: 'título' },
    { order: 4, component: 'Information Card > InformationCard · State=Brand · Skeleton=False', role: 'soft gate membresía' },
    { order: 5, component: 'Nav Bar > NavBar · Color=Color · Type=Home · State=Default', role: 'nav inferior' }
  ],
  empty: [
    { order: 1, component: 'Top bar > TopBar_title · Type=Default', role: 'navegación' },
    { order: 2, component: 'Empty States > Empty state · Type=Empty', role: 'estado vacío' },
    { order: 3, component: 'Nav Bar > NavBar · Color=Color · Type=Home · State=Default', role: 'nav inferior' }
  ]
};

export class PrismaCatalog {
  constructor() {
    // Catálogo base (siempre disponible)
    this._catalog = [...BASE_CATALOG];
    // Keys de Figma (enriquecidos via sync)
    this._keyMap = {};
  }

  /** Enriquecer catálogo con keys reales de Figma */
  updateFromFigma(components) {
    let newCount = 0;
    for (const comp of components) {
      // Intentar matchear con el catálogo base
      const existing = this._catalog.find(c => normStr(c.name) === normStr(comp.name));
      if (existing) {
        existing.figmaKey = comp.key;
      } else {
        // Componente nuevo no en el catálogo base
        this._catalog.push({
          group: comp.group || 'Other',
          name: comp.name,
          tags: [comp.name.toLowerCase()],
          figmaKey: comp.key
        });
        newCount++;
      }
      this._keyMap[normStr(comp.name)] = comp.key;
    }
    return newCount;
  }

  /** Buscar key de Figma para un nombre de componente */
  getKey(name) {
    return this._keyMap[normStr(name)] || null;
  }

  /** Listar componentes (con filtro opcional) */
  list(filter, group) {
    let result = [...this._catalog];
    if (group) {
      result = result.filter(c => normStr(c.group).includes(normStr(group)));
    }
    if (filter) {
      const f = normStr(filter);
      result = result.filter(c =>
        normStr(c.name).includes(f) ||
        c.tags.some(t => normStr(t).includes(f))
      );
    }
    return result;
  }

  /** Obtener todos los grupos */
  getGroups() {
    return [...new Set(this._catalog.map(c => c.group))];
  }

  /** Obtener todos los componentes */
  getAll() {
    return [...this._catalog];
  }

  /** Verificar si un componente existe (fuzzy) */
  exists(name) {
    const n = normStr(name);
    return this._catalog.some(c => normStr(c.name) === n || normStr(c.name).includes(n));
  }

  /** Obtener componente por nombre exacto o similar */
  get(name) {
    const n = normStr(name);
    return this._catalog.find(c => normStr(c.name) === n) ||
           this._catalog.find(c => normStr(c.name).includes(n));
  }
}

function normStr(str) {
  return (str || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[_\-\s·>]/g, '')
    .replace(/[^a-z0-9=]/g, '');
}
