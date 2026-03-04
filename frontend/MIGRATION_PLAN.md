# Estructura de Archivos - ShortURL

## 📁 Nueva Organización de Componentes

### `/src/components/ui/`
Componentes de Shadcn-VUE (reutilizables y sin lógica de negocio)
- `button.vue` - Botones base
- `input.vue` - Campos de entrada
- `card.vue` - Tarjetas
- `dialog.vue` - Modales
- `tabs.vue` - Sistema de pestañas
- `table.vue` - Tablas
- `badge.vue` - Etiquetas
- `tooltip.vue` - Tooltips
- `skeleton.vue` - Placeholders de carga
- `sheet.vue` - Paneles laterales

### `/src/components/features/`
Componentes específicos de la funcionalidad de ShortURL
- `url-shortener/` - Acortamiento de URLs
  - `ShortenUrlForm.vue`
  - `ShortenUrlResult.vue`
- `url-info/` - Información de URLs
  - `UrlInfoForm.vue`
  - `UrlInfoDisplay.vue`
- `my-urls/` - URLs guardadas del usuario
  - `MyUrlsList.vue`
  - `UrlCard.vue`
  - `QRGenerator.vue`
- `url-list/` - Lista pública de URLs
  - `PublicUrlsList.vue`
  - `UrlSearchBar.vue`

### `/src/components/layout/`
Componentes de layout y navegación
- `AppHeader.vue` - Header principal
- `AppNavigation.vue` - Navegación por pestañas
- `AppFooter.vue` - Footer
- `HeroSection.vue` - Sección principal

### `/src/stores/`
Estado global de la aplicación
- `index.ts` - Configuración de Pinia
- `urlStore.ts` - Manejo de URLs y sesión de usuario
- `notificationStore.ts` - Sistema de notificaciones

### `/src/composables/`
Lógica reutilizable
- `useCopyToClipboard.ts` - Copiar al portapapeles
- `useUrlShortener.ts` - Acortamiento de URLs
- `useQRGenerator.ts` - Generación de códigos QR
- `useUrlValidation.ts` - Validación de URLs

### `/src/lib/`
Utilidades y configuraciones
- `utils.ts` - Funciones de utilidad
- `constants.ts` - Constantes de la aplicación
- `api-config.ts` - Configuración de la API

## 🎯 Plan de Migración
ELIMINAR TODO TIPO DE ESTILOS PERSONALIADOS Y DEGRADADOS Y USAR LOS COMPONENTES DE SHADCN-VUE TAL CUAL

USAR SIEMPRE MODO OSCURO Y MODO CLARO

PARA LOS ICONOS USAR UNICAMENTE LUCIDE-NEXT-VUE

### Fase 1: Configuración Base ✅
- [x] Pinia Stores creados
- [x] Estructura de archivos organizada
- [x] Composables base creados
- [x] Configuración en main.ts

### Fase 2: Componentes Base ⏭️
- [SKIP] Usar componentes Shadcn-VUE directamente
- [SKIP] No necesario crear wrappers adicionales

### Fase 3: Componentes de Funcionalidad ✅
- [x] Migrar ShortenUrl usando stores → ShortenUrlForm.vue
- [x] Migrar UrlInfo → UrlInfoForm.vue  
- [x] Migrar MyUrls con nueva estructura → MyUrlsList.vue
- [x] Migrar UrlList → PublicUrlsList.vue
- [x] Integrar Sonner para notificaciones
- [x] Actualizar App.vue con nuevos componentes
- [x] Eliminar componentes obsoletos
- [x] Actualizar NavbarHeader con Dialog de Shadcn-VUE

### Fase 4: Layout y Navegación ✅
- [x] Migrar navegación a Shadcn Tabs
- [x] Migrar header sin estilos personalizados  
- [x] Refactorizar App.vue con diseño limpio
- [x] **TEMA**: Implementar modo claro/oscuro con @vueuse/core
- [x] Crear ThemeToggle component
- [x] Integrar selector de tema en NavbarHeader

### Fase 5: Optimizaciones ✅
- [x] Eliminar código legacy restante
- [x] Usar Shadcn-VUE puro sin customizaciones
- [x] Implementar sistema de temas completo
- [x] Optimizar imports y estructura
- [x] **COMPLETADO**: Migración total a Shadcn-VUE con soporte de temas