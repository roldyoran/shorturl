<template>
  <!-- Header -->
  <header class="border-b">
    <div class="container mx-auto px-4 py-4">
      <Collapsible v-slot="{ open }">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex items-center gap-2 p-2 rounded-lg border">
              <Link2 class="h-5 w-5" />
              <span class="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <div>
              <h1 class="text-lg font-bold">ShortURL</h1>
              <p class="text-xs text-muted-foreground">by roldyoran</p>
            </div>
            <div class="ml-4 px-3 py-1 rounded-md border flex flex-col items-center space-x-3 hidden sm:flex md:text-sm">
              <p class="text-sm">URLs Acortadas: <span class="font-mono">{{ attempts }}</span></p>
              <div class="text-sm text-muted-foreground">Intentos restantes: <span class="font-mono">{{ remainingAttempts }}</span></div>
            </div>
            <div v-if="isAdmin" class="text-sm text-green-500 font-semibold">ADMIN</div>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="ghost" size="sm">
                  <Settings class="h-4 w-4 mr-2" />
                  Configuración
                </Button>
              </DialogTrigger>
              <DialogContent class="max-w-2xl">
                <ApiConfig />
              </DialogContent>
            </Dialog>

            <!-- Admin Dialog Trigger -->
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="ghost" size="sm">
                  <User />  
                  Admin
                </Button>
              </DialogTrigger>
              <DialogContent class="max-w-md">
                <div class="space-y-4">
                  <Label for="admin-pass">Contraseña Admin</Label>
                  <Input id="admin-pass" v-model="adminPassword" type="password" placeholder="Ingresa contraseña" />
                  <div class="flex justify-end">
                    <Button @click="submitAdmin">Iniciar sesión</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger as-child>
                <Button variant="ghost" size="sm">
                  <ExternalLink class="h-4 w-4 mr-2" />
                  Probar Redirección
                </Button>
              </DialogTrigger>
              <DialogContent class="max-w-2xl">
                <RedirectTest />
              </DialogContent>
            </Dialog>

            <Button variant="ghost" size="sm" as-child>
              <a
                href="https://github.com/roldyoran/shorturl"
                target="_blank"
                class="flex items-center"
              >
                <Github class="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
          </div>

          <!-- Mobile attempts indicator (compact) -->
          <div class="flex items-center space-x-3 md:hidden mr-2">
            <div class="text-xs text-muted-foreground">A: <span class="font-mono">{{ attempts }}</span></div>
            <div class="text-xs text-muted-foreground">R: <span class="font-mono">{{ remainingAttempts }}</span></div>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <CollapsibleTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="md:hidden"
              >
                <X v-if="open" class="h-5 w-5" />
                <Menu v-else class="h-5 w-5" />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

  <!-- Mobile Navigation -->
  <CollapsibleContent class="w-full block">
          <div class="md:hidden mt-4 pt-4 border-t px-3">
            <div class="flex flex-col space-y-4">
              <div class="flex justify-start">
                <ThemeToggle />
              </div>

              <div class="space-y-1">
                <Label for="admin-pass-mobile" class="text-sm">Admin</Label>
                <div class="flex flex-col sm:flex-row gap-2">
                  <Input id="admin-pass-mobile" v-model="adminPassword" type="password" placeholder="Contraseña" class="flex-1 w-full" />
                  <Button class="w-full sm:w-auto" @click="submitAdmin">OK</Button>
                </div>
              </div>

              <Dialog>
                <DialogTrigger as-child>
                  <Button variant="ghost" class="w-full justify-start">
                    <Settings class="h-4 w-4 mr-2" />
                    Configuración
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <ApiConfig />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger as-child>
                  <Button variant="ghost" class="w-full justify-start">
                    <ExternalLink class="h-4 w-4 mr-2" />
                    Probar Redirección
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <RedirectTest />
                </DialogContent>
              </Dialog>

              <Button variant="ghost" class="w-full justify-start" as-child>
                <a
                  href="https://github.com/roldyoran/shorturl"
                  target="_blank"
                  class="flex items-center w-full"
                >
                  <Github class="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  </header>
</template>



<script setup lang="ts">
// No local refs needed; Collapsible handles state
import {
	Link2,
	Settings,
	ExternalLink,
	Github,
	Menu,
	X,
  User,
} from "lucide-vue-next";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle.vue";
import ApiConfig from "./ApiConfig.vue";
import RedirectTest from "./RedirectTest.vue";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ref, computed } from "vue";
import { useUrlStore } from "@/stores/urlStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";

defineProps<{
	attempts: number;
}>();

// State handled by Collapsible component

// Admin state
const urlStore = useUrlStore();
const adminPassword = ref("");
// Read admin password from Vite env to avoid hardcoding
const ADMIN_PASS = (import.meta as any).env?.VITE_ADMIN_PASS ?? "";
const isAdmin = computed(() => urlStore.userSession?.isAdmin ?? false);
const remainingAttempts = computed(() => urlStore.userSession?.remainingAttempts ?? 0);

function submitAdmin() {
  if (adminPassword.value === ADMIN_PASS) {
    urlStore.setAdminStatus(true);
    toast.success("Modo admin activado", { description: "Tienes intentos ilimitados." });
  } else {
    urlStore.setAdminStatus(false);
    toast.error("Contraseña incorrecta", { description: "La contraseña admin es incorrecta." });
  }
  adminPassword.value = "";
}
</script>