<template>
  <div>
    <DialogHeader>
      <DialogTitle class="flex items-center gap-3">
        <Info class="w-6 h-6" />
        Información de la API
      </DialogTitle>
      <DialogDescription>
        Información sobre el acortador de URLs
      </DialogDescription>
    </DialogHeader>

    <div class="space-y-6 mt-6">
      <Alert>
        <Info class="w-4 h-4" />
        <AlertTitle>Información</AlertTitle>
        <AlertDescription>
          El acortador de urls utiliza una clave de API para autenticarse. 
          <strong>Puede probar el acortador un máximo de 3 veces.</strong>
        </AlertDescription>
      </Alert>

      <div class="space-y-2">
        <Label for="api-url">URL Base de la API</Label>
        <Input 
          id="api-url"
          v-model="apiUrl" 
          placeholder="https://tu-worker.workers.dev"
          type="url"
          readonly
        />
        <p class="text-xs text-muted-foreground">
          URL configurada para el acortador de enlaces
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Info } from "lucide-vue-next";
import {
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const apiKey = ref<string>(
	import.meta.env.VITE_API_KEY || localStorage.getItem("apiKey") || "",
);

import { getApiBaseUrl } from "@/api/http";

const apiUrl = ref<string>(getApiBaseUrl());

watch(apiKey, (val) => {
	try {
		localStorage.setItem("apiKey", val);
	} catch (e) {
		console.error("Error guardando apiKey en localStorage:", e);
	}
});
</script>