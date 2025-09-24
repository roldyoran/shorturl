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
        <!-- Vista móvil: Cards -->
        <div class="block sm:hidden space-y-3">
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
                    <p class="font-mono text-sm break-all text-primary hover:underline">{{ baseUrl.replace(/\/$/, '') + '/' + url.short_url }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-2">
                  <Globe class="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-muted-foreground">URL Original:</p>
                    <p class="text-sm break-all">{{ truncateText(url.original_url, 60) }}</p>
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

        <!-- Vista desktop: Table -->
        <div class="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL Corta</TableHead>
                <TableHead>URL Original</TableHead>
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
                  <div class="flex items-center gap-2 max-w-md">
                    <Hash class="w-4 h-4 text-muted-foreground" />
                    <span class="font-mono text-sm truncate">{{ baseUrl.replace(/\/$/, '') + '/' + url.short_url }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2 max-w-md">
                    <Globe class="w-4 h-4 text-muted-foreground" />
                    <span class="font-mono text-sm truncate">{{ truncateText(url.original_url, 50) }}</span>
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
import { getUrlsRequest, getApiBaseUrl } from "@/api/http";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
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