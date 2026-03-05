# AGENTS.md - Guía para Agentes de IA

Este documento proporciona información esencial para agentes de IA (como Cursor AI, GitHub Copilot, etc.) que trabajan en el frontend de shorturl.

## 📋 Resumen del Proyecto

**shorturl Frontend** es una aplicación web construida con Vue 3 que permite:
- Acortar URLs largas
- Ver información de URLs acortadas
- Gestionar URLs guardadas del usuario
- Ver lista pública de URLs acortadas

## 🛠️ Stack Tecnológico

### Core
- **Vue 3** (Composition API con `<script setup>`)
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Pinia** - Gestión de estado global

### UI/Estilos
- **Tailwind CSS v4** - Framework de utilidades CSS
- **Shadcn-VUE** - Componentes UI reutilizables
- **Radix Vue** - Componentes primitivos accesibles
- **Lucide Vue Next** - Iconos (ÚNICO sistema de iconos permitido)
- **Vue Sonner** - Sistema de notificaciones toast

### Validación y Formularios
- **Vee-Validate** - Validación de formularios
- **Zod** - Schema validation

### Utilidades
- **Axios** - Cliente HTTP
- **VueUse** - Colección de composables Vue
- **QRCode Generator** - Generación de códigos QR

### Herramientas de Desarrollo
- **Biome** - Linter y formateador (reemplaza ESLint/Prettier)
- **Vue TSC** - Type checking

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/              # Configuración de API y tipos
│   │   ├── http.ts       # Instancia de Axios y funciones de API
│   │   └── types.ts      # Tipos TypeScript para API
│   │
│   ├── components/       # Componentes Vue
│   │   ├── features/     # Componentes específicos de funcionalidad
│   │   │   ├── url-shortener/    # Acortamiento de URLs
│   │   │   ├── url-info/         # Información de URLs
│   │   │   ├── my-urls/          # URLs del usuario
│   │   │   └── url-list/         # Lista pública
│   │   │
│   │   ├── layout/       # Componentes de layout
│   │   │   └── FooterComponent.vue
│   │   │
│   │   ├── ui/           # Componentes Shadcn-VUE (NO modificar estilos)
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── dialog/
│   │   │   ├── form/
│   │   │   ├── tabs/
│   │   │   └── ... (más componentes)
│   │   │
│   │   ├── NavbarHeader.vue
│   │   ├── Principal.vue
│   │   └── ThemeToggle.vue
│   │
│   ├── composables/      # Composables reutilizables
│   │   ├── useCopyToClipboard.ts
│   │   ├── useToast.ts
│   │   └── useUrlShortener.ts
│   │
│   ├── stores/           # Stores de Pinia
│   │   ├── index.ts      # Configuración de Pinia
│   │   ├── urlStore.ts   # Store principal de URLs y sesión
│   │   └── notificationStore.ts
│   │
│   ├── lib/              # Utilidades
│   │   └── utils.ts      # Funciones helper
│   │
│   ├── App.vue           # Componente raíz
│   ├── main.ts           # Punto de entrada
│   └── style.css         # Estilos globales
│
├── public/               # Archivos estáticos
├── package.json
├── vite.config.ts
├── tsconfig.json
└── biome.json            # Configuración de Biome
```

## 🎯 Convenciones y Reglas Importantes

### ⚠️ REGLAS CRÍTICAS (NO VIOLAR)

1. **NO modificar estilos de componentes Shadcn-VUE**
   - Los componentes en `/src/components/ui/` deben usarse tal cual
   - NO agregar estilos personalizados, degradados o customizaciones
   - Usar solo las variantes y props que proporcionan

2. **Sistema de Iconos ÚNICO**
   - **SOLO usar `lucide-vue-next`** para iconos
   - NO usar otros sistemas de iconos (FontAwesome, Heroicons, etc.)
   - Importar desde: `import { IconName } from "lucide-vue-next"`

3. **Sistema de Temas**
   - La app soporta modo claro y oscuro
   - Usar `@vueuse/core` con `useColorMode()` para manejar temas
   - Los componentes Shadcn-VUE ya soportan temas automáticamente
   - NO crear estilos personalizados para temas

4. **Estructura de Componentes**
   - Componentes de funcionalidad → `/src/components/features/`
   - Componentes UI reutilizables → `/src/components/ui/` (Shadcn-VUE)
   - Componentes de layout → `/src/components/layout/`

5. **Gestión de Estado**
   - Usar Pinia stores para estado global
   - NO usar `provide/inject` para estado compartido
   - El store principal es `urlStore.ts`

6. **Notificaciones**
   - Usar **Vue Sonner** para todas las notificaciones
   - NO usar `alert()`, `confirm()`, o sistemas de notificación personalizados
   - Importar: `import { toast } from "vue-sonner"`

## 🔧 Configuración de API

### Variables de Entorno
- `VITE_API_BASE_URL` - URL base de la API (opcional)
- `VITE_API_KEY` - API key para autenticación (opcional)

### Configuración Dinámica
- La URL de la API se puede configurar desde localStorage con la clave `apiUrl`
- Prioridad: `VITE_API_BASE_URL` → `localStorage.apiUrl` → fallback por defecto

### Instancia de Axios
- Usar `getAxiosInstance()` de `/src/api/http.ts`
- Incluye headers automáticos (`Content-Type`, `x-api-key`)

## 📝 Patrones de Código

### Componentes Vue
```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from "vue";
import { useUrlStore } from "@/stores/urlStore";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";

// 2. Props/Emits
const props = defineProps<{ /* ... */ }>();
const emit = defineEmits<{ /* ... */ }>();

// 3. Stores
const urlStore = useUrlStore();

// 4. Estado local
const isLoading = ref(false);

// 5. Computed
const canSubmit = computed(() => !isLoading.value);

// 6. Funciones
async function handleSubmit() {
  // ...
}

// 7. Lifecycle
onMounted(() => {
  // ...
});
</script>

<template>
  <!-- Usar componentes Shadcn-VUE -->
  <Button @click="handleSubmit">Submit</Button>
</template>
```

### Composables
- Crear composables en `/src/composables/` para lógica reutilizable
- Usar el prefijo `use` (ej: `useUrlShortener.ts`)
- Retornar objetos reactivos y funciones

### Stores de Pinia
- Usar Composition API style (`defineStore` con función)
- Separar estado, getters y acciones claramente
- Persistir en localStorage cuando sea necesario

## 🚀 Tareas Comunes

### Agregar un Nuevo Componente de Funcionalidad

1. Crear carpeta en `/src/components/features/[feature-name]/`
2. Crear componente Vue con `<script setup lang="ts">`
3. Usar componentes Shadcn-VUE para UI
4. Usar stores de Pinia para estado
5. Usar composables para lógica reutilizable
6. Agregar a `App.vue` si es necesario

### Agregar una Nueva Petición API

1. Agregar función en `/src/api/http.ts`
2. Usar `getAxiosInstance()` para obtener instancia de Axios
3. Definir tipos en `/src/api/types.ts` si es necesario
4. Manejar errores con try/catch
5. Usar `toast` para notificar errores al usuario

### Agregar un Nuevo Store

1. Crear archivo en `/src/stores/[storeName].ts`
2. Usar `defineStore` con Composition API
3. Exportar el store
4. Importar en componentes que lo necesiten

### Modificar Estilos

1. **NO modificar componentes UI** (Shadcn-VUE)
2. Usar clases de Tailwind CSS directamente en componentes de features
3. Agregar estilos globales en `style.css` solo si es absolutamente necesario
4. Usar variables CSS de Tailwind para temas

## 🐛 Debugging

### Información de Debug
El store `urlStore` incluye una función `getDebugInfo()` que retorna:
- Estado de la sesión
- Conteo de URLs
- Si puede usar el servicio
- Si necesita reset

### Herramientas
- **Vue DevTools** - Para inspeccionar componentes y stores
- **Browser DevTools** - Para inspeccionar localStorage y network
- **TypeScript** - Para verificar tipos en tiempo de desarrollo

## 📦 Scripts Disponibles

```bash
# Desarrollo
bun dev               # Inicia servidor de desarrollo

# Build
bun build             # Construye para producción

# Preview
bun preview           # Previsualiza build de producción

# Linting y Formateo
bun check             # Verifica código con Biome
bun format            # Formatea código con Biome
bun lint              # Lint y auto-fix con Biome
```

## 🔍 Búsqueda de Código

### Archivos Clave para Entender el Proyecto

1. **`src/App.vue`** - Componente raíz, estructura principal
2. **`src/stores/urlStore.ts`** - Lógica de negocio principal
3. **`src/api/http.ts`** - Configuración de API
4. **`src/components/features/`** - Funcionalidades principales
5. **`package.json`** - Dependencias del proyecto

### Cómo Buscar Funcionalidad

- **Acortar URL**: `ShortenUrlForm.vue` + `useUrlShortener.ts`
- **Información de URL**: `UrlInfoForm.vue`
- **URLs guardadas**: `MyUrlsList.vue` + `urlStore.ts`
- **Lista pública**: `PublicUrlsList.vue`
- **Notificaciones**: `useToast.ts` + Vue Sonner
- **Temas**: `ThemeToggle.vue` + `@vueuse/core`

## ⚡ Mejores Prácticas para Agentes de IA

1. **Leer primero, modificar después**
   - Siempre leer archivos relevantes antes de hacer cambios
   - Entender la estructura existente

2. **Seguir convenciones existentes**
   - Usar el mismo estilo de código que ya existe
   - Seguir los patrones establecidos

3. **No romper funcionalidad existente**
   - Verificar que los cambios no afecten otras partes
   - Mantener compatibilidad con stores y composables existentes

4. **Usar TypeScript correctamente**
   - Definir tipos para props, emits, y funciones
   - No usar `any` a menos que sea absolutamente necesario

5. **Manejar errores apropiadamente**
   - Usar try/catch en funciones async
   - Mostrar mensajes de error al usuario con `toast`

6. **Optimizar imports**
   - Importar solo lo necesario
   - Usar alias `@/` para imports desde `src/`

7. **Comentarios cuando sea necesario**
   - Agregar comentarios para lógica compleja
   - Documentar funciones no obvias

## 🎨 Sistema de Diseño

### Colores y Temas
- Los componentes Shadcn-VUE usan variables CSS de Tailwind
- Los temas (claro/oscuro) se manejan automáticamente
- NO crear paletas de colores personalizadas

### Espaciado
- Usar sistema de espaciado de Tailwind (4px base)
- `p-4` = 16px, `p-2` = 8px, etc.

### Tipografía
- Usar clases de Tailwind para tipografía
- `text-sm`, `text-base`, `text-lg`, etc.

## 📚 Recursos Adicionales

- **Vue 3 Docs**: https://vuejs.org/
- **Shadcn-VUE**: https://www.shadcn-vue.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Pinia**: https://pinia.vuejs.org/
- **VueUse**: https://vueuse.org/
- **Lucide Icons**: https://lucide.dev/

## ⚠️ Errores Comunes a Evitar

1. ❌ Modificar estilos de componentes Shadcn-VUE
2. ❌ Usar iconos que no sean de `lucide-vue-next`
3. ❌ Crear estilos personalizados para temas
4. ❌ Usar `alert()` o `confirm()` en lugar de Sonner
5. ❌ Crear stores duplicados cuando ya existe uno
6. ❌ No manejar errores en funciones async
7. ❌ Usar `any` en TypeScript sin justificación
8. ❌ Importar todo el módulo cuando solo se necesita una función

---

**Última actualización**: Este documento refleja el estado del proyecto después de la migración completa a Shadcn-VUE con soporte de temas.

