# 📢 Sistema de Notificaciones con Sonner (Shadcn-VUE)

## 🎯 Introducción

Este proyecto utiliza **Sonner** de Shadcn-VUE como sistema principal de notificaciones. Sonner es una librería moderna de toast/notificaciones que se integra perfectamente con el sistema de temas y proporciona una excelente experiencia de usuario.

## ⚙️ Configuración Actual

### 1. Dependencias Instaladas
```json
{
  "vue-sonner": "^2.0.8"
}
```

### 2. Componente Principal (App.vue)
```vue
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Toaster con pointer-events-auto para compatibilidad con diálogos -->
    <Toaster class="pointer-events-auto" />
    <!-- resto del contenido -->
  </div>
</template>

<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import 'vue-sonner/style.css'; // ⚠️ IMPORTANTE: CSS requerido para v2
</script>
```

### 3. Composable Personalizado (`useToast.ts`)
Ubicación: `src/composables/useToast.ts`

```typescript
export interface ToastOptions {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

export function useToast() {
  const showSuccess = (message: string, options?: ToastOptions) => { /* ... */ }
  const showError = (message: string, options?: ToastOptions) => { /* ... */ }
  const showWarning = (message: string, options?: ToastOptions) => { /* ... */ }
  const showInfo = (message: string, options?: ToastOptions) => { /* ... */ }
  const showPromise = <T>(promise: Promise<T>, messages: {...}) => { /* ... */ }
  
  return {
    toast, // toast original de vue-sonner
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPromise,
  }
}
```

## 🚀 Cómo Usar

### Uso Básico
```vue
<script setup lang="ts">
import { toast } from 'vue-sonner'

// Toast simple
const showBasicToast = () => {
  toast('Mensaje básico')
}

// Toast con descripción y acción
const showAdvancedToast = () => {
  toast('Título del mensaje', {
    description: 'Descripción adicional del mensaje',
    action: {
      label: 'Deshacer',
      onClick: () => console.log('Acción ejecutada'),
    },
    duration: 4000, // 4 segundos
  })
}
</script>
```

### Uso con el Composable (Recomendado)
```vue
<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { showSuccess, showError, showWarning, showInfo, showPromise } = useToast()

// Notificación de éxito
const handleSuccess = () => {
  showSuccess('¡Operación exitosa!', {
    description: 'Los datos se han guardado correctamente'
  })
}

// Notificación de error
const handleError = () => {
  showError('Error en la operación', {
    description: 'Por favor, intenta de nuevo más tarde'
  })
}

// Toast para operaciones asíncronas
const handleAsyncOperation = () => {
  const promise = fetch('/api/data')
  
  showPromise(promise, {
    loading: 'Cargando datos...',
    success: 'Datos cargados correctamente',
    error: 'Error al cargar los datos',
  })
}
</script>
```

## 🎨 Tipos de Notificaciones

### 1. Toast Básico
```typescript
toast('Mensaje simple')
```

### 2. Toast de Éxito
```typescript
toast.success('Operación completada')
// O usando el composable:
showSuccess('Operación completada')
```

### 3. Toast de Error
```typescript
toast.error('Algo salió mal')
// O usando el composable:
showError('Algo salió mal')
```

### 4. Toast de Advertencia
```typescript
toast.warning('Cuidado con esta acción')
// O usando el composable:
showWarning('Cuidado con esta acción')
```

### 5. Toast Informativo
```typescript
toast.info('Información importante')
// O usando el composable:
showInfo('Información importante')
```

### 6. Toast con Promise (Loading states)
```typescript
const promise = new Promise((resolve) => {
  setTimeout(() => resolve('Completado'), 2000)
})

toast.promise(promise, {
  loading: 'Cargando...',
  success: 'Completado exitosamente',
  error: 'Error en la operación',
})
```

## 🔧 Configuración Avanzada

### Personalizar Duración Global
```typescript
// En el componente Toaster
<Toaster 
  class="pointer-events-auto"
  :duration="5000"  // 5 segundos por defecto
/>
```

### Personalizar Posición
```typescript
<Toaster 
  class="pointer-events-auto"
  position="top-right"  // top-left, top-right, bottom-left, bottom-right, top-center, bottom-center
/>
```

### Personalizar Tema
```typescript
<Toaster 
  class="pointer-events-auto"
  theme="system"  // light, dark, system
/>
```

## 🚀 Extensiones Futuras

### 1. Toast con Iconos Personalizados
```typescript
// Extender el composable useToast.ts
const showCustomToast = (message: string, icon: string) => {
  toast(message, {
    icon: icon, // Usar lucide-vue-next icons
  })
}

// Uso
showCustomToast('Archivo descargado', '📁')
```

### 2. Toast con Componentes Vue
```typescript
// Crear un toast que renderize un componente Vue
import { h } from 'vue'
import CustomComponent from './CustomComponent.vue'

const showComponentToast = () => {
  toast(h(CustomComponent, { prop: 'value' }))
}
```

### 3. Toast Persistente (No se cierra automáticamente)
```typescript
const showPersistentToast = () => {
  toast('Mensaje importante', {
    duration: Infinity, // No se cierra automáticamente
    action: {
      label: 'Cerrar',
      onClick: (id) => toast.dismiss(id),
    },
  })
}
```

### 4. Toast con Progreso
```typescript
const showProgressToast = () => {
  const id = toast('Subiendo archivo...', {
    duration: Infinity,
  })
  
  // Simular progreso
  let progress = 0
  const interval = setInterval(() => {
    progress += 10
    toast('Subiendo archivo...', {
      id, // Actualizar el mismo toast
      description: `${progress}% completado`,
    })
    
    if (progress >= 100) {
      clearInterval(interval)
      toast.success('Archivo subido correctamente', { id })
    }
  }, 500)
}
```

### 5. Toast con Rich Content
```typescript
const showRichToast = () => {
  toast('Nuevo mensaje', {
    description: 'Tienes un mensaje de Juan Pérez',
    action: {
      label: 'Ver mensaje',
      onClick: () => router.push('/messages'),
    },
    // Agregar datos personalizados
    data: {
      userId: '123',
      messageId: '456',
    },
  })
}
```

### 6. Sistema de Notificaciones Push
```typescript
// Extender useToast para notificaciones del sistema
const useNotifications = () => {
  const { showInfo } = useToast()
  
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }
  
  const showSystemNotification = (title: string, options?: NotificationOptions) => {
    if (document.hidden && 'Notification' in window) {
      new Notification(title, options)
    } else {
      // Fallback a toast si la ventana está visible
      showInfo(title, { description: options?.body })
    }
  }
  
  return {
    requestPermission,
    showSystemNotification,
  }
}
```

### 7. Toast Queue System
```typescript
// Para manejar múltiples toasts de manera inteligente
class ToastQueue {
  private queue: Array<() => void> = []
  private isProcessing = false
  
  add(toastFn: () => void) {
    this.queue.push(toastFn)
    this.process()
  }
  
  private async process() {
    if (this.isProcessing || this.queue.length === 0) return
    
    this.isProcessing = true
    const toastFn = this.queue.shift()!
    toastFn()
    
    // Esperar antes del siguiente toast
    await new Promise(resolve => setTimeout(resolve, 1000))
    this.isProcessing = false
    this.process()
  }
}

const toastQueue = new ToastQueue()

// Uso
toastQueue.add(() => showSuccess('Primer mensaje'))
toastQueue.add(() => showSuccess('Segundo mensaje'))
toastQueue.add(() => showSuccess('Tercer mensaje'))
```

## 🎨 Integración con Temas

El Sonner se integra automáticamente con el sistema de temas de Shadcn-VUE:

```css
/* Los estilos se adaptan automáticamente */
.toaster {
  --normal-bg: var(--popover);
  --normal-text: var(--popover-foreground);
  --normal-border: var(--border);
}
```

## 📋 Best Practices

### ✅ Hacer
- Usar el composable `useToast` para consistencia
- Mantener mensajes cortos y claros
- Usar los tipos correctos (success, error, warning, info)
- Agregar descripciones cuando sea necesario
- Usar acciones para interacciones importantes

### ❌ Evitar
- Mostrar demasiados toasts simultáneamente
- Usar toasts para errores críticos (usar modales)
- Mensajes muy largos
- Toasts persistentes sin forma de cerrarlos
- Spam de notificaciones

## 🔍 Debugging

### Verificar Toasts Activos
```typescript
// En la consola del navegador
console.log(document.querySelectorAll('[data-sonner-toaster]'))
```

### Limpiar Todos los Toasts
```typescript
import { toast } from 'vue-sonner'

const clearAllToasts = () => {
  toast.dismiss() // Sin ID = limpia todos
}
```

## 🚧 Casos de Uso Específicos en la App

### 1. URL Shortener
```typescript
const shortenUrl = async (url: string) => {
  const promise = api.shortenUrl(url)
  
  showPromise(promise, {
    loading: 'Acortando URL...',
    success: (data) => `URL acortada: ${data.shortUrl}`,
    error: 'Error al acortar la URL',
  })
}
```

### 2. Copy to Clipboard
```typescript
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    showSuccess('Copiado al portapapeles', {
      description: text,
      duration: 2000,
    })
  })
}
```

### 3. API Errors
```typescript
const handleApiError = (error: ApiError) => {
  showError('Error del servidor', {
    description: error.message,
    action: {
      label: 'Reintentar',
      onClick: () => retryLastAction(),
    },
  })
}
```

---

## 📚 Referencias

- [Vue Sonner Documentation](https://vue-sonner.vercel.app/)
- [Shadcn-VUE Sonner](https://www.shadcn-vue.com/docs/components/sonner)
- [Composables Pattern](https://vuejs.org/guide/reusability/composables.html)

---

**Nota**: Este sistema está completamente integrado con el tema claro/oscuro de la aplicación y es compatible con todos los componentes de Shadcn-VUE.