<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-3">
        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Acortar URL
      </CardTitle>
      <CardDescription v-if="!urlStore.userSession.isAdmin">
        Puede probar el acortador un máximo de 3 veces. Intentos restantes: {{ urlStore.userSession.remainingAttempts }}
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
      <!-- Form -->
      <form @submit="handleSubmit" class="space-y-4">
        <!-- URL Input -->
        <div class="space-y-2">
          <Label for="original-url">URL Original</Label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <Input 
                id="original-url"
                v-model="originalUrl"
                type="url"
                placeholder="https://ejemplo.com/pagina-muy-larga-para-acortar"
                required
                :disabled="!urlStore.canUseService"
              />
              <Button 
                type="button"
                variant="ghost"
                size="sm"
                @click="showHashField = !showHashField"
                class="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'rotate-180': showHashField }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </div>
            <Button 
              type="submit" 
              :disabled="isLoading || !urlStore.canUseService"
            >
              <span v-if="!isLoading">Acortar</span>
              <div v-else class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Acortando...
              </div>
            </Button>
          </div>
        </div>

        <!-- Custom Hash Field -->
        <div v-if="showHashField" class="space-y-2">
          <Label for="custom-hash">Hash Personalizado (opcional)</Label>
          <Input 
            id="custom-hash"
            v-model="customHash"
            type="text"
            placeholder="Ingrese un hash personalizado"
            pattern="^[a-zA-Z0-9-_]+$"
          />
          <p class="text-xs text-muted-foreground">Solo se permiten letras, números, guiones y guiones bajos</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-destructive text-sm">
          {{ error }}
        </div>
      </form>

      <!-- Result -->
      <div v-if="shortUrl" class="space-y-4">
        <Label>URL Acortada:</Label>
        
        <div class="flex items-center space-x-2">
          <Input 
            :value="`${urlBase.replace(/\/$/, '')}/${shortUrl}`"
            readonly
            class="flex-1"
          />
          <Button @click="copyUrl()" variant="outline" size="sm">
            <Copy class="w-4 h-4 mr-1" />
            Copiar
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Copy } from "lucide-vue-next";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUrlStore } from "@/stores/urlStore";
import { useUrlShortener } from "@/composables/useUrlShortener";
import { useCopyToClipboard } from "@/composables/useCopyToClipboard";
import { getApiBaseUrl } from "@/api/http";

// Store y composables
const urlStore = useUrlStore();
const { shortenUrl, isLoading } = useUrlShortener();
const { copyToClipboard } = useCopyToClipboard();

// Reactive state
const originalUrl = ref<string>("");
const customHash = ref<string>("");
const shortUrl = ref<string>("");
const error = ref<string>("");
const showHashField = ref<boolean>(false);

// Constants
const urlBase = getApiBaseUrl();

// Emits
const emit = defineEmits<{
	"url-shortened": [];
}>();

// Methods
const handleSubmit = async (event: Event) => {
	event.preventDefault();
	error.value = "";
	shortUrl.value = "";

	if (!originalUrl.value.trim()) {
		error.value = "Por favor ingresa una URL.";
		return;
	}

	try {
		const success = await shortenUrl(
			originalUrl.value,
			customHash.value || undefined,
		);

		if (success) {
			// Obtener la última URL agregada al store
			const lastUrl = urlStore.savedUrls[0];
			if (lastUrl) {
				shortUrl.value = lastUrl.short;
				emit("url-shortened");

				// Limpiar formulario
				originalUrl.value = "";
				customHash.value = "";
				showHashField.value = false;
			}
		}
	} catch (err: any) {
		error.value = err.message || "Error inesperado al acortar la URL";
	}
};

const copyUrl = () => {
	const fullUrl = `${urlBase.replace(/\/$/, '')}/${shortUrl.value}`;
	copyToClipboard(fullUrl, "URL copiada al portapapeles");
};
</script>