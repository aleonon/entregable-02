# Atlas de Animales Marinos

API REST temática para el Entregable 2: API de Criaturas marinas

Criaturas que habitan en los diferentes oceanos del mundo. Permite registrar sus habilidades, nivel(basado en qué tan común es) y carácter (si es amistoso o no).

Ailyn León :p
Repositorio: https://github.com/aleonon/entregable-02 

## Alcance

Backend local con Node.js, Express 5 y TypeScript 5. No incluye frontend, base de datos, autenticación ni despliegue público. El almacenamiento es un arreglo en memoria: los cambios desaparecen al reiniciar el servidor, incluso cuando el modo de desarrollo reinicia por editar un archivo. Cada proceso tendría su propio arreglo.

## Requisitos e instalación

Se recomienda Node.js 24 LTS actualizado; el proyecto declara compatibilidad con Node.js 22 o posterior. Necesitas npm y Git. Se usan herramientas instaladas dentro del proyecto, no globalmente.

Después de descomprimir, abre una terminal en la carpeta que contiene `package.json`:

```bash
node --version
npm --version
npm install
npm run check
npm run dev
```

Abre `http://127.0.0.1:3000/api/criaturas`. Detén el servidor con `Ctrl+C`.

La primera instalación genera `package-lock.json`; inclúyelo en Git. Una vez que el repositorio tenga ese archivo, quien lo clone puede instalar las versiones fijadas con `npm ci`. El ZIP de referencia no incluye un lockfile porque no fue posible descargar las dependencias en el entorno de preparación.

## Comandos

| Comando | Función |
|---|---|
| `npm run dev` | Ejecuta el código TypeScript y reinicia ante cambios. |
| `npm run check` | Revisa tipos sin generar JavaScript. |
| `npm run build` | Compila `src/` a `dist/`. |
| `npm start` | Ejecuta `dist/server.js`; requiere compilar antes. |
| `npm test` | Compila y ejecuta las pruebas de dominio y HTTP incluidas. |

Para probar el resultado compilado, detén primero el servidor de desarrollo:

```bash
npm run build
npm start
```

Puerto predeterminado: `3000`. Puede cambiarse mediante la variable de entorno `PORT`. El servidor escucha únicamente en `127.0.0.1`.

## Estructura

```text
src/
  models/criatura.ts                 # Contrato del dominio y tipo de entrada
  errors/AppError.ts                # Errores esperados con código de estado
  services/criatura.service.ts       # CRUD y estado en memoria
  validators/criatura.validator.ts   # Comprobaciones de datos en ejecución
  middlewares/requestId.ts          # Identificador de petición
  middlewares/logger.ts             # Registro de método, ruta, estado y duración
  middlewares/validarCriatura.ts     # Validación antes del controlador
  middlewares/errorHandler.ts        # Respuesta uniforme a errores
  controllers/criatura.controller.ts # Traducción de HTTP a operaciones del servicio
  routes/criatura.routes.ts          # Mapeo entre métodos, rutas y controladores
  app.ts                            # Composición de middleware y rutas
  server.ts                         # Inicio del servidor
```

## Modelo y validación

| Campo | Tipo / regla | Quién lo proporciona |
|---|---|---|
| `id` | Entero positivo autoincremental | Servidor |
| `nombre` | Texto de 2 a 80 caracteres, luego de quitar espacios exteriores | Cliente |
| `habitat` | `bosque`, `ciudad` o `cielo` | Cliente |
| `habilidad` | Texto de 3 a 160 caracteres, luego de quitar espacios exteriores | Cliente |
| `nivel` | Número entero entre 1 y 10 | Cliente |
| `amistosa` | Booleano `true` o `false`, sin comillas | Cliente |
| `creadaEn` | Fecha en formato ISO 8601 | Servidor |

POST y PUT exigen los cinco campos editables. PUT reemplaza todos los campos editables del recurso existente; conserva `id` y `creadaEn`. No se implementa PATCH. PUT sobre un id inexistente devuelve 404; no crea recursos. Los campos desconocidos, `id` y `creadaEn` en el cuerpo se rechazan. No se exige unicidad de nombres.

Los ids de ruta deben ser enteros positivos representables de forma segura. `abc`, `1abc`, `0` y `1.5` producen 400. Un entero válido no encontrado produce 404.

## Endpoints

Base: `http://127.0.0.1:3000`.

| Método | Ruta | Éxito | Operación |
|---|---|---|---|
| GET | `/api/criaturas` | 200 | Listar; un catálogo vacío devuelve `{"data":[]}`. |
| GET | `/api/criaturas/:id` | 200 | Obtener una criatura. |
| POST | `/api/criaturas` | 201 | Crear; incluye cabecera `Location`. |
| PUT | `/api/criaturas/:id` | 200 | Reemplazar los cinco campos editables. |
| DELETE | `/api/criaturas/:id` | 204 | Eliminar; respuesta sin cuerpo. |

Ejemplo de entrada válida:

```json
{
  "nombre": "Calamar",
  "habitat": "Atlántico",
  "habilidad": "Escape con tinta",
  "nivel": 30,
  "amistosa": false
}
```

Las respuestas de éxito, excepto DELETE, tienen una propiedad `data`. Los errores usan:

```json
{
  "error": {
    "mensaje": "Descripción del problema.",
    "requestId": "identificador-generado-para-esta-petición"
  }
}
```

El `requestId` coincide con la cabecera `X-Request-Id` y con el registro en la terminal.

## Middleware y errores

Orden: request id → logger → parser JSON → router → validación (POST/PUT) → controlador → servicio. Cuando algo falla, se utiliza el manejador de errores. Las rutas no implementadas producen 404 JSON después del router.

Los tres middleware personalizados de funcionamiento normal son `requestId`, `logger` y `validarCriatura`. `express.json()` es integrado de Express y no se cuenta como personalizado. `errorHandler` es el middleware centralizado de errores adicional.

Códigos de error: 400 para datos o JSON incorrectos; 404 para recursos/rutas no encontrados; 413 para cuerpo mayor de 10 KB; 415 para un formato/codificación no soportado; 500 para errores inesperados. Los detalles internos de un 500 se registran en la terminal, pero no se exponen al cliente.

## Node.js, eventos y límites

La aplicación responde a peticiones a través de callbacks. El logger escucha el evento `finish` de la respuesta. Node.js permite atender otras tareas mientras se espera por operaciones de entrada/salida no bloqueantes; esto no significa que todo código sea asíncrono o que cualquier cálculo pesado deje de bloquear.

Las operaciones de este arreglo son síncronas y pequeñas. `find`, `map` y `filter` recorren elementos y no son una solución para volúmenes grandes. No se añade `async` artificialmente: en una futura versión con base de datos se elegiría una API de entrada/salida apropiada.

## Referencias técnicas

- Node.js, versiones: https://nodejs.org/en/about/previous-releases
- Node.js, event loop: https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop
- Express, middleware: https://expressjs.com/en/guide/writing-middleware.html
- Express, errores: https://expressjs.com/en/guide/error-handling.html
- TypeScript, tipos y compilación: https://www.typescriptlang.org/docs/handbook/2/basic-types.html
- TypeScript, módulos: https://www.typescriptlang.org/docs/handbook/modules/reference.html
- TypeScript, tipos utilitarios: https://www.typescriptlang.org/docs/handbook/utility-types.html
- HTTP, RFC 9110: https://www.rfc-editor.org/rfc/rfc9110.html
- GitHub, subir código local: https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
