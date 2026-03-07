<script setup lang="ts">
import { Settings, TestTube, Info } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ApiConfig from "@/components/ApiConfig.vue";
import RedirectTest from "@/components/RedirectTest.vue";
import { getApiBaseUrl } from "@/api/http";
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium">Configuración y Pruebas</h3>
    
    <div class="flex gap-2 flex-wrap">
      <!-- Dialog para Configuración de API -->
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="outline" class="flex items-center gap-2">
            <Settings class="w-4 h-4" />
            Configurar API
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-md">
          <ApiConfig />
        </DialogContent>
      </Dialog>

      <!-- Dialog para Pruebas de Redirección -->
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="outline" class="flex items-center gap-2">
            <TestTube class="w-4 h-4" />
            Probar Redirección
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-md">
          <RedirectTest />
        </DialogContent>
      </Dialog>
    </div>

    <!-- Versión en Tabs (alternativa) -->
    <div class="mt-8">
      <h4 class="text-md font-medium mb-4">Versión con Tabs</h4>
      <Tabs default-value="config" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="config" class="flex items-center gap-2">
            <Settings class="w-4 h-4" />
            <span class="hidden sm:inline">Configuración</span>
          </TabsTrigger>
          <TabsTrigger value="test" class="flex items-center gap-2">
            <TestTube class="w-4 h-4" />
            <span class="hidden sm:inline">Pruebas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" class="mt-6">
          <div class="border rounded-lg p-6">
            <div class="space-y-6">
              <div class="space-y-2">
                <h3 class="text-lg font-medium flex items-center gap-3">
                  <Settings class="w-5 h-5" />
                  Configuración de API
                </h3>
                <p class="text-sm text-muted-foreground">
                  Configura la URL base de la API para el acortador de URLs
                </p>
              </div>
              
              <Alert>
                <Info class="w-4 h-4" />
                <AlertTitle>Información</AlertTitle>
                <AlertDescription>
                  El acortador de urls utiliza una clave de API para autenticarse. 
                  <strong>Puede probar el acortador un máximo de 3 veces.</strong>
                </AlertDescription>
              </Alert>

              <div class="space-y-2">
                <Label for="api-url-tab">URL Base de la API</Label>
                <Input 
                  id="api-url-tab"
                  :value="getApiBaseUrl()"
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
        </TabsContent>
        
        <TabsContent value="test" class="mt-6">
          <div class="border rounded-lg p-6">
            <RedirectTest />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>