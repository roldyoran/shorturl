# Acortador de URLs con Cloudflare Workers

Este proyecto es un servicio de acortamiento de URLs implementado con Cloudflare Workers y D1 Database. Permite crear URLs cortas a partir de URLs largas y redirigir a los usuarios a las URLs originales.

## Características

- Creación de URLs cortas a partir de URLs largas
- Redirección a URLs originales
- Seguimiento de clics en URLs cortas
- API protegida con clave de API
- Validación de formato de URL

## Estructura del Proyecto (Patrón MVC)

Este proyecto ha sido reorganizado siguiendo el patrón Modelo-Vista-Controlador (MVC) para mejorar la separación de responsabilidades y hacer el código más mantenible.

```
src/
├── controllers/          # Controladores (lógica de negocio)
│   └── url.controller.ts # Controlador para operaciones de URL
├── html/
│   └── not-found.ts      # Página HTML para URLs no encontradas
├── middlewares/
│   ├── api-key.middleware.ts    # Middleware para validación de API key
│   ├── cors.middleware.ts       # Middleware para configuración CORS
│   ├── url-service.middleware.ts # Middleware para servicio de URL
│   └── index.ts                 # Exportación de middlewares
├── routes/
│   └── url.routes.ts     # Definición de rutas (sin lógica de negocio)
├── schemas/
│   └── index.ts          # Esquemas de validación con Zod
├── services/
│   └── url.service.ts    # Servicio para operaciones con URLs (Modelo)
├── types/
│   └── index.ts          # Definiciones de tipos TypeScript
├── utils/
│   └── index.ts          # Funciones de utilidad
└── index.ts              # Punto de entrada de la aplicación
```

### Patrón MVC Implementado

- **Modelo**: Representado por los servicios en la carpeta `services/` que manejan la interacción con la base de datos.
- **Vista**: En este caso, al ser una API, las vistas son las respuestas JSON que se envían al cliente.
- **Controlador**: Los controladores en `controllers/` contienen la lógica de negocio y conectan las rutas con los servicios.

### Flujo de la Aplicación

1. Las solicitudes llegan a través de las rutas definidas en `routes/`
2. Las rutas dirigen las solicitudes a los controladores apropiados
3. Los controladores procesan la lógica de negocio y utilizan los servicios para interactuar con los datos
4. Los servicios realizan operaciones en la base de datos
5. Los controladores formatean las respuestas y las envían de vuelta al cliente

## Tecnologías Utilizadas

- **Cloudflare Workers**: Plataforma serverless para ejecutar el servicio
- **D1 Database**: Base de datos SQL de Cloudflare
- **Hono**: Framework ligero para aplicaciones web
- **TypeScript**: Lenguaje de programación tipado
- **Zod**: Biblioteca para validación de esquemas

## Endpoints de la API

- `GET /`: Página de bienvenida
- `POST /shorten`: Crear una URL corta (requiere API key)
- `GET /info/:short_url`: Obtener información de una URL corta (requiere API key)
- `GET /:short_url`: Redirigir a la URL original

## Configuración

El proyecto utiliza Wrangler para la configuración y despliegue. La configuración se encuentra en el archivo `wrangler.toml`.

## Desarrollo Local

1. Instalar dependencias:

    ```
    npm install
    ```

2. Iniciar el servidor de desarrollo:
    ```
    npm run dev
    ```

## Despliegue

Para desplegar la aplicación en Cloudflare Workers:

```
npm run deploy
```

## Uso de la API

### Crear una URL corta

```bash
curl -X POST https://tu-worker.workers.dev/shorten \
  -H "Content-Type: application/json" \
  -H "x-api-key: TU_API_KEY" \
  -d '{"original_url": "https://ejemplo.com/pagina-muy-larga"}'
```

### Obtener información de una URL corta

```bash
curl -X GET https://tu-worker.workers.dev/info/abc123 \
  -H "x-api-key: TU_API_KEY"
```

### Acceder a una URL corta

```
https://tu-worker.workers.dev/abc123
```

## D1DATABASE

```bash
pnpx wrangler d1 create prod-d1-shorturl

pnpx wrangler d1 execute prod-d1-shorturl --local --file=./schema.sql

pnpx wrangler d1 execute prod-d1-shorturl --local --command="SELECT * FROM URLS"
```

```bash
pnpx wrangler d1 execute prod-d1-shorturl --remote --file=./schema.sql

pnpx wrangler d1 execute prod-d1-shorturl --remote --command="SELECT * FROM URLS"

pnpm run deploy
```
