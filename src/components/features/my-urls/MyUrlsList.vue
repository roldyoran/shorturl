<template>
  <TooltipProvider>
    <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <CardTitle class="flex items-center gap-3">
            <Database class="w-6 h-6" />
            Mis URLs
          </CardTitle>
        </div>
        <Button 
          @click="confirmClearUrls"
          variant="destructive"
          size="sm"
          :disabled="urlStore.savedUrls.length === 0"
        >
          <Trash class="w-4 h-4 mr-2" />
          Borrar Todo
        </Button>
      </div>
      <CardDescription>
        Tus URLs acortadas guardadas localmente ({{ urlStore.savedUrls.length }})
      </CardDescription>
    </CardHeader>

    <CardContent>
      <!-- Estado vacío -->
      <div v-if="urlStore.savedUrls.length === 0" class="text-center py-12">
        <Database class="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 class="text-lg font-semibold mb-2">No hay URLs guardadas</h3>
        <p class="text-muted-foreground">Las URLs acortadas aparecerán aquí automáticamente</p>
      </div>

      <!-- Lista de URLs -->
      <div v-else class="space-y-6">
        <!-- Vista desktop: Tabla -->
        <div class="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL Corta</TableHead>
                <TableHead>URL Original</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead class="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="url in paginatedUrls" :key="`${url.original}-${url.short}`">
                <TableCell>
                  <div class="flex items-center gap-2 max-w-md">
                    <Hash class="w-4 h-4 text-muted-foreground" />
                    <span class="font-mono text-sm truncate" :title="getFullShortUrl(url.short)">{{ getFullShortUrl(url.short) }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2 max-w-md">
                    <Globe class="w-4 h-4 text-muted-foreground" />
                    <span class="font-mono text-sm truncate" :title="url.original">{{ truncateText(url.original, 40) }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Clock class="w-4 h-4 text-muted-foreground" />
                    <span class="text-sm">{{ formatDate(url.date) }}</span>
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex items-center justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger :asChild="true">
                        <Button @click="copyFullUrl(url.short)" variant="outline" size="sm">
                          <Copy class="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copiar URL</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger :asChild="true">
                        <Button @click="generateQR(url.short)" variant="outline" size="sm">
                          <QrCode class="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Generar QR</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger :asChild="true">
                        <Button @click="removeUrl(url.original, url.short)" variant="destructive" size="sm">
                          <Trash class="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Eliminar</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Vista móvil: Cards -->
        <div class="md:hidden space-y-4">
          <Card v-for="url in paginatedUrls" :key="`${url.original}-${url.short}`">
            <CardContent class="p-4 space-y-3">
              <div class="space-y-2">
                <div class="flex items-start gap-2">
                  <Hash class="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-muted-foreground">URL Corta:</p>
                    <p class="font-mono text-sm break-all text-primary hover:underline" :title="getFullShortUrl(url.short)">{{ getFullShortUrl(url.short) }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-2">
                  <Globe class="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-muted-foreground">URL Original:</p>
                    <p class="text-sm break-all" :title="url.original">{{ truncateText(url.original, 60) }}</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <Clock class="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p class="text-xs text-muted-foreground">Creada:</p>
                    <p class="text-sm">{{ formatDate(url.date) }}</p>
                  </div>
                </div>
              </div>

              <div class="flex justify-between pt-2 border-t">
                <div class="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger :asChild="true">
                      <Button @click="copyFullUrl(url.short)" variant="outline" size="sm">
                        <Copy class="w-4 h-4 mr-1" />
                        URL
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copiar URL</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger :asChild="true">
                      <Button @click="copyCode(url.short)" variant="outline" size="sm">
                        <Hash class="w-4 h-4 mr-1" />
                        Código
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copiar código</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger :asChild="true">
                      <Button @click="generateQR(url.short)" variant="outline" size="sm">
                        <QrCode class="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Generar QR</TooltipContent>
                  </Tooltip>
                </div>
                <Tooltip>
                  <TooltipTrigger :asChild="true">
                    <Button @click="removeUrl(url.original, url.short)" variant="destructive" size="sm">
                      <Trash class="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Eliminar</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="flex items-center justify-between">
          <p class="text-sm text-muted-foreground">
            Página {{ currentPage }} de {{ totalPages }}
          </p>
          <div class="flex items-center gap-2">
            <Button 
              @click="previousPage" 
              :disabled="currentPage === 1"
              variant="outline"
              size="sm"
            >
              <ChevronLeft class="w-4 h-4" />
            </Button>
            
            <div class="flex gap-1">
              <Button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :variant="currentPage === page ? 'default' : 'outline'"
                size="sm"
                class="w-8 h-8 p-0"
              >
                {{ page }}
              </Button>
            </div>
            
            <Button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              variant="outline"
              size="sm"
            >
              <ChevronRight class="w-4 h-4" />
            </Button>
          </div>
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
  Database,
  Globe,
  Clock,
  Copy,
  Hash,
  QrCode,
  Trash,
  ChevronLeft,
	ChevronRight,
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import { useUrlStore } from "@/stores/urlStore";
import { useCopyToClipboard } from "@/composables/useCopyToClipboard";
import { useNotificationStore } from "@/stores/notificationStore";
import { formatDate, truncateText } from "@/lib/utils";
import QRCode from "qrcode-generator";
import { getApiBaseUrl } from "@/api/http";

// Stores y composables
const urlStore = useUrlStore();
const { copyToClipboard } = useCopyToClipboard();
const notificationStore = useNotificationStore();

// Estado de paginación
const currentPage = ref(1);
const itemsPerPage = 10;

// Estado del modal QR
const showQRModal = ref(false);
const qrCanvas = ref<HTMLCanvasElement>();
const currentQRUrl = ref<string>("");

// Computed
const totalPages = computed(() =>
	Math.ceil(urlStore.savedUrls.length / itemsPerPage),
);
const paginatedUrls = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	return urlStore.savedUrls.slice(start, end);
});

const visiblePages = computed(() => {
	const pages: number[] = [];
	const maxVisible = 5;
	let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
	let end = Math.min(totalPages.value, start + maxVisible - 1);

	if (end - start + 1 < maxVisible) {
		start = Math.max(1, end - maxVisible + 1);
	}

	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	return pages;
});

// Methods
const getFullShortUrl = (shortCode: string): string => {
  return `${getApiBaseUrl().replace(/\/$/, "")}/${shortCode}`;
};

const copyFullUrl = (shortCode: string) => {
	const fullUrl = getFullShortUrl(shortCode);
	copyToClipboard(fullUrl, "URL completa copiada");
};

const copyCode = (shortCode: string) => {
	copyToClipboard(shortCode, "Código copiado");
};

const removeUrl = (original: string, short: string) => {
	if (confirm("¿Estás seguro de que quieres eliminar esta URL?")) {
		urlStore.removeUrl(original, short);

		// Ajustar página si es necesario
		if (paginatedUrls.value.length === 0 && currentPage.value > 1) {
			currentPage.value--;
		}

		notificationStore.showSuccess(
			"URL eliminada",
			"La URL ha sido eliminada correctamente",
		);
	}
};

const confirmClearUrls = () => {
	if (
		confirm(
			"¿Estás seguro de que quieres borrar todo el historial de URLs? Esta acción no se puede deshacer.",
		)
	) {
		urlStore.clearAllUrls();
		currentPage.value = 1;
		notificationStore.showWarning(
			"Historial borrado",
			"Se ha eliminado todo el historial de URLs",
		);
	}
};

const previousPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
	}
};

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
	}
};

// QR Code functions
const generateQR = (shortCode: string) => {
	const fullUrl = getFullShortUrl(shortCode);
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

onMounted(() => {
	// Las URLs ya se cargan automáticamente desde el store
});
</script>