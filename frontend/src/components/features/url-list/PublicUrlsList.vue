<template>
  <TooltipProvider>
    <Card>
    <CardHeader>
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle class="flex items-center gap-3">
            <Globe class="w-6 h-6" />
            Lista Pública de URLs
          </CardTitle>
          <CardDescription>Todas las URLs acortadas públicamente</CardDescription>
        </div>
        
        <!-- Barra de búsqueda -->
        <div class="relative w-full sm:w-80">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar URLs..."
            class="pl-10"
          />
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <!-- Estado de carga -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="flex flex-col items-center space-y-4">
          <svg class="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div class="space-y-2">
            <p class="text-lg font-semibold">Cargando URLs...</p>
            <p class="text-muted-foreground">Obteniendo las URLs más recientes</p>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else-if="shortUrls.length === 0" class="text-center py-12">
        <Globe class="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 class="text-lg font-semibold mb-2">No hay URLs disponibles</h3>
        <p class="text-muted-foreground">Las URLs aparecerán aquí una vez que sean creadas</p>
      </div>

      <!-- Estado sin resultados de búsqueda -->
      <div v-else-if="filteredUrls.length === 0" class="text-center py-12">
        <Search class="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 class="text-lg font-semibold mb-2">No se encontraron resultados</h3>
        <p class="text-muted-foreground">Intenta con otros términos de búsqueda</p>
      </div>

      <!-- Lista de URLs -->
      <div v-else class="space-y-6">
        <!-- Vista móvil: Cards con scroll -->
        <div class="block sm:hidden max-h-[70vh] overflow-y-auto space-y-3 pr-1 scroll-smooth scroll-container">
          <Card 
            v-for="url in filteredUrls" 
            :key="`${url.short_url}-${url.original_url}`"
            class="p-4"
          >
            <div class="space-y-3">
              <div class="space-y-2">
                <div class="flex items-start gap-2">
                  <Hash class="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-muted-foreground">URL Corta:</p>
                    <p class="font-mono text-sm break-all text-primary hover:underline" :title="baseUrl.replace(/\/$/, '') + '/' + url.short_url">{{ baseUrl.replace(/\/$/, '') + '/' + url.short_url }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-2">
                  <Globe class="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-muted-foreground">URL Original:</p>
                    <p class="text-sm break-all" :title="url.original_url">{{ truncateText(url.original_url, 60) }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <Hash class="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p class="text-xs text-muted-foreground">Código:</p>
                    <p class="font-mono">{{ url.short_url }}</p>
                  </div>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Clock class="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p class="text-xs text-muted-foreground">Creada:</p>
                      <p class="text-sm">{{ formatDate(url.created_at) }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <MousePointer class="w-4 h-4 text-muted-foreground" />
                    <div class="text-right">
                      <p class="text-xs text-muted-foreground">Clicks:</p>
                      <p class="text-sm font-semibold">{{ url.clicks || 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-between pt-2 border-t">
                <div class="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger :asChild="true">
                      <Button @click="copyFullUrl(url.short_url)" variant="outline" size="sm">
                        <Copy class="w-4 h-4 mr-1" />
                        URL
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copiar URL</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger :asChild="true">
                      <Button @click="copyCode(url.short_url)" variant="outline" size="sm">
                        <Hash class="w-4 h-4 mr-1" />
                        Código
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copiar código</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger :asChild="true">
                      <Button @click="generateQR(url.short_url)" variant="outline" size="sm">
                        <QrCode class="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Generar QR</TooltipContent>
                  </Tooltip>
                </div>

                <Tooltip>
                  <TooltipTrigger :asChild="true">
                    <Button 
                      @click="openExternal(baseUrl.replace(/\/$/, '') + '/' + url.short_url)"
                      variant="outline" 
                      size="sm"
                    >
                      <ExternalLink class="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Abrir en nueva pestaña</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </Card>
        </div>

        <!-- Vista desktop: Table con scroll -->
        <div class="hidden sm:block max-h-[60vh] overflow-y-auto border rounded-lg scroll-smooth scroll-container">
          <Table>
            <TableHeader class="sticky top-0 bg-background z-10 sticky-header">
              <TableRow>
                <TableHead>URLs</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Creada</TableHead>
                <TableHead class="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="url in filteredUrls" 
                :key="`${url.short_url}-${url.original_url}`"
              >
                <TableCell>
                  <div class="space-y-1 max-w-md">
                    <div class="flex items-center gap-2">
                      <Hash class="w-4 h-4 text-muted-foreground" />
                      <span class="font-mono text-sm truncate text-primary" :title="baseUrl.replace(/\/$/, '') + '/' + url.short_url">{{ baseUrl.replace(/\/$/, '') + '/' + url.short_url }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Globe class="w-4 h-4 text-muted-foreground" />
                      <span class="font-mono text-sm truncate text-muted-foreground" :title="url.original_url">{{ truncateText(url.original_url, 50) }}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Hash class="w-4 h-4 text-muted-foreground" />
                    <span class="font-mono">{{ url.short_url }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <MousePointer class="w-4 h-4 text-muted-foreground" />
                    <span class="font-semibold">{{ url.clicks || 0 }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Clock class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">{{ formatDate(url.created_at) }}</span>
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex items-center justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger :asChild="true">
                          <Button @click="copyFullUrl(url.short_url)" variant="outline" size="sm">
                            <Copy class="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copiar URL</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger :asChild="true">
                          <Button @click="copyCode(url.short_url)" variant="outline" size="sm">
                            <Hash class="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copiar código</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger :asChild="true">
                          <Button @click="generateQR(url.short_url)" variant="outline" size="sm">
                            <QrCode class="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Generar QR</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger :asChild="true">
                          <Button 
                            @click="openExternal(baseUrl.replace(/\/$/, '') + '/' + url.short_url)"
                            variant="outline" 
                            size="sm"
                          >
                            <ExternalLink class="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Abrir en nueva pestaña</TooltipContent>
                      </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <!-- QR Modal -->
      <Dialog :open="showQRModal" @update:open="showQRModal = $event">
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Código QR</DialogTitle>
            <DialogDescription>
              Escanea este código para acceder a: {{ currentQRUrl }}
            </DialogDescription>
          </DialogHeader>
          <div class="flex items-center justify-center py-4">
            <canvas ref="qrCanvas" class="border rounded-lg"></canvas>
          </div>
          <div class="flex justify-center">
            <Button @click="downloadQR" variant="outline">
              <Download class="w-4 h-4 mr-2" />
              Descargar QR
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </CardContent>
    </Card>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
	Globe,
	Search,
	ExternalLink,
	Clock,
	MousePointer,
	Copy,
	Hash,
	QrCode,
	Download,
} from "lucide-vue-next";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { getUrlsRequest, getApiBaseUrl } from "@/api/http";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import QRCode from "qrcode-generator";
import { useCopyToClipboard } from "@/composables/useCopyToClipboard";
import { useNotificationStore } from "@/stores/notificationStore";
import { formatDate, truncateText } from "@/lib/utils";
import type { UrlInfoResponse } from "@/api/types";

// Composables
const { copyToClipboard } = useCopyToClipboard();
const notificationStore = useNotificationStore();

// Estado reactivo
const shortUrls = ref<UrlInfoResponse[]>([]);
const searchQuery = ref<string>("");
const isLoading = ref<boolean>(false);
const baseUrl = getApiBaseUrl();

// Estado del modal QR
const showQRModal = ref(false);
const qrCanvas = ref<HTMLCanvasElement>();
const currentQRUrl = ref<string>("");

// Computed
const filteredUrls = computed(() => {
	if (!searchQuery.value.trim()) {
		return shortUrls.value;
	}

	const query = searchQuery.value.toLowerCase();
	return shortUrls.value.filter(
		(url) =>
			url.short_url.toLowerCase().includes(query) ||
			url.original_url.toLowerCase().includes(query),
	);
});

// Methods
const copyFullUrl = (shortCode: string) => {
  const fullUrl = baseUrl.replace(/\/$/, "") + '/' + shortCode;
  copyToClipboard(fullUrl, "URL completa copiada");
};

const copyCode = (shortCode: string) => {
	copyToClipboard(shortCode, "Código copiado");
};

// QR Code functions
const generateQR = (shortCode: string) => {
	const fullUrl = baseUrl.replace(/\/$/, "") + '/' + shortCode;
	currentQRUrl.value = fullUrl;
	showQRModal.value = true;

	// Esperar a que el modal se renderice
	setTimeout(() => {
		createQRCode(fullUrl);
	}, 100);
};

const createQRCode = (url: string) => {
	if (!qrCanvas.value) return;

	const qr = QRCode(0, "M");
	qr.addData(url);
	qr.make();

	const canvas = qrCanvas.value;
	const ctx = canvas.getContext("2d");

	if (!ctx) return;

	const moduleCount = qr.getModuleCount();
	const moduleSize = 6;
	const margin = 4;
	canvas.width = canvas.height = moduleCount * moduleSize + margin * 2;

	// Fondo blanco
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Dibujar el QR
	ctx.fillStyle = "#000000";
	const offset = margin;

	for (let y = 0; y < moduleCount; y++) {
		for (let x = 0; x < moduleCount; x++) {
			if (qr.isDark(y, x)) {
				ctx.fillRect(
					offset + x * moduleSize,
					offset + y * moduleSize,
					moduleSize,
					moduleSize,
				);
			}
		}
	}
};

const downloadQR = () => {
	if (!qrCanvas.value) {
		notificationStore.showError("Error", "No se encontró el código QR");
		return;
	}

	try {
		const dataUrl = qrCanvas.value.toDataURL("image/png");
		const cleanUrl = currentQRUrl.value
			.replace(/^https?:\/\//, "")
			.replace(/\//g, "-")
			.slice(0, 50);

		const fileName = `qr-${cleanUrl || "codigo"}.png`;
		const link = document.createElement("a");
		link.download = fileName;
		link.href = dataUrl;

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		notificationStore.showSuccess(
			"QR descargado",
			"El código QR se ha descargado correctamente",
		);
	} catch (error) {
		console.error("Error al descargar el QR:", error);
		notificationStore.showError(
			"Error al descargar",
			"No se pudo descargar el código QR",
		);
	}
};

const loadUrls = async () => {
	isLoading.value = true;

	try {
		const response = await getUrlsRequest();
		if (response.data && Array.isArray(response.data)) {
			shortUrls.value = response.data.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);
			notificationStore.showSuccess(
				"URLs cargadas",
				"Lista de URLs actualizada correctamente",
			);
		} else {
			shortUrls.value = [];
			notificationStore.showWarning(
				"Sin URLs",
				"No se encontraron URLs disponibles",
			);
		}
	} catch (error: any) {
		console.error("Error loading URLs:", error);
		const errorMessage =
			error?.response?.data?.message || "Error al cargar las URLs";
		notificationStore.showError("Error al cargar", errorMessage);
		shortUrls.value = [];
	} finally {
		isLoading.value = false;
	}
};

onMounted(() => {
	loadUrls();
});

// Abre una URL externa en nueva pestaña (expuesto al template)
const openExternal = (url: string) => {
  window.open(url, "_blank");
};
</script>

<style scoped>
/* Estilos personalizados para scrollbar en navegadores webkit */
.scroll-smooth::-webkit-scrollbar {
  width: 8px;
}

.scroll-smooth::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.scroll-smooth::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: background-color 0.2s ease-in-out;
}

.scroll-smooth::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.35);
}

/* Para dispositivos móviles - scrollbar más fino */
@media (max-width: 640px) {
  .scroll-smooth::-webkit-scrollbar {
    width: 6px;
  }
  
  .scroll-smooth::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
  }
  
  .scroll-smooth::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
  }
}

/* Soporte para modo oscuro */
@media (prefers-color-scheme: dark) {
  .scroll-smooth::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  .scroll-smooth::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }

  .scroll-smooth::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.35);
  }

  @media (max-width: 640px) {
    .scroll-smooth::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
    }
    
    .scroll-smooth::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }
}

/* Animación suave para el scroll */
.scroll-smooth {
  scroll-behavior: smooth;
}

/* Efecto de fade en los bordes para indicar scroll */
.scroll-container {
  position: relative;
}

.scroll-container::before,
.scroll-container::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 20px;
  pointer-events: none;
  z-index: 5;
  transition: opacity 0.3s ease;
}

/* Gradientes para modo claro */
.scroll-container::before {
  top: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, transparent 100%);
}

.scroll-container::after {
  bottom: 0;
  background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, transparent 100%);
}

/* Gradientes para modo oscuro */
@media (prefers-color-scheme: dark) {
  .scroll-container::before {
    background: linear-gradient(to bottom, rgba(15, 15, 15, 1) 0%, transparent 100%);
  }

  .scroll-container::after {
    background: linear-gradient(to top, rgba(15, 15, 15, 1) 0%, transparent 100%);
  }
}

/* Mejorar la visibilidad del header sticky */
.sticky-header {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
  .sticky-header {
    background: rgba(15, 15, 15, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>