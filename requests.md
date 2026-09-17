# Pruebas manuales — Atlas de criaturas marinas

Las capturas evidencia de estas pruebas se encuentran en el pdf con el url del repertorio

## Preparación

Base: `http://127.0.0.1:3000`.

El estado inicial incluye al tiburón cebra con id 1. Tras reiniciar el servidor se restaura ese estado. No edites archivos entre crear y consultar una criatura: el modo de desarrollo puede reiniciar y perderla.

## 1. Listar

```bash
curl -i http://127.0.0.1:3000/api/criaturas
```

Esperado: **200 OK** y cabecera `X-Request-Id`.

```json
{
  "data": [
    {
        "id": 1,
        "nombre": "Tiburón cebra",
        "habitat": "Pacífico",
        "habilidad": "Flexibilidad Extrema",
        "nivel": 5,
        "amistosa": true,
        "creadaEn": "2026-01-01T00:00:00.000Z",
    }
  ]
}
```

La lista cambia después de crear o eliminar criaturas.

## 2. Obtener por id

```bash
curl -i http://127.0.0.1:3000/api/criaturas/1
```

Esperado: **200 OK** y `data` con el objeto Lumi (no un arreglo).

```json
{
  "data": {
        "id": 1,
        "nombre": "Tiburón cebra",
        "habitat": "Pacífico",
        "habilidad": "Flexibilidad Extrema",
        "nivel": 5,
        "amistosa": true,
        "creadaEn": "2026-01-01T00:00:00.000Z",
    }
}
```

## 3. Crear

```bash
curl -i -X POST http://127.0.0.1:3000/api/criaturas \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Medusa Luna","habitat":"Índico","habilidad":"Camuflaje","nivel":9,"amistosa":true}'
```

Esperado: **201 Created**, `Location: /api/criaturas/2` si es la primera creación desde el reinicio, y:

```json
{
  "data": {
    "nombre": "Medusa Luna",
      "habitat": "Índico",
      "habilidad": "Camuflaje",
      "nivel": 9,
      "amistosa": true,
      "id": 2,
      "creadaEn": "2026-09-16T20:47:59.244Z"
  }
}
```

**Copia el id realmente recibido.** Los comandos siguientes suponen id 2: cámbialo si corresponde. La fecha y el request id también son dinámicos. Los ids no se reciclan al eliminar.


## 4. Actualizar con PUT

```bash
curl -i -X PUT http://127.0.0.1:3000/api/criaturas/2 \
  -H 'Content-Type: application/json' \
  -d '{"nombre": "Medusa Luna", "habitat": "Índico",
      "habilidad": "Camuflaje", "nivel": 9, "amistosa": true,}'
```

Esperado: **200 OK**.

```json
{
  "data": {
    "nombre": "Tiburón Ballena",
      "habitat": "Atlántico",
      "habilidad": "Piel reforzada",
      "nivel": 8,
      "amistosa": true,
      "id": 2,
      "creadaEn": "2026-09-16T20:47:59.244Z"
  }
}
```

Repite GET por ese id y verifica los cambios. PUT exige los cinco campos editables: no envíes únicamente `nivel`. `id` y `creadaEn` no deben ir en el cuerpo.

## 5. Eliminar

```bash
curl -i -X DELETE http://127.0.0.1:3000/api/criaturas/2
```

Esperado: **204 No Content**. El cuerpo está vacío; esto es correcto.

Consulta de nuevo:

```bash
curl -i http://127.0.0.1:3000/api/criaturas/2
```

Esperado: **404 Not Found**.

```json
{
  "error": {
    "mensaje": "No existe una criatura con id 2.",
    "requestId": "UUID_DE_ESTA_PETICION"
  }
}
```

Un segundo DELETE también devuelve 404 por contrato de esta API.

## 6. Nivel inválido

```bash
curl -i -X POST http://127.0.0.1:3000/api/criaturas \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Nimbo","habitat":"cielo","habilidad":"Tejer nubes","nivel":99,"amistosa":false}'
```

Esperado: **400 Bad Request**.

```json
{
  "error": {
    "mensaje": "nivel debe ser un entero entre 1 y 10.",
    "requestId": "UUID_DE_ESTA_PETICION"
  }
}
```

Prueba también `"nivel":"5"`: debe fallar porque es texto, no número. `"amistosa":"false"` debe fallar; `"amistosa":false` es válido.

## 7. PUT incompleto

```bash
curl -i -X PUT http://127.0.0.1:3000/api/criaturas/1 \
  -H 'Content-Type: application/json' \
  -d '{"nivel":9}'
```

Esperado: **400 Bad Request**, mensaje `nombre debe ser texto.`. Repite GET de id 1 para verificar que no fue modificado.

## 8. Identificador y ruta inexistentes

```bash
curl -i http://127.0.0.1:3000/api/criaturas/abc
curl -i http://127.0.0.1:3000/api/criaturas/999999
curl -i http://127.0.0.1:3000/no-existe
```

Esperados, respectivamente: **400** por formato de id, **404** por criatura no encontrada y **404** por ruta no implementada. Todos con objeto `error` y request id.

## 9. JSON mal formado

```bash
curl -i -X POST http://127.0.0.1:3000/api/criaturas \
  -H 'Content-Type: application/json' \
  -d '{"nombre":'
```

Esperado: **400 Bad Request**.

```json
{
  "error": {
    "mensaje": "El JSON enviado no tiene un formato válido.",
    "requestId": "UUID_DE_ESTA_PETICION"
  }
}
```

Esto demuestra que un error del parser también llega al manejador centralizado.

## 10. Cabecera incorrecta

```bash
curl -i -X POST http://127.0.0.1:3000/api/criaturas \
  -H 'Content-Type: text/plain' \
  -d 'hola'
```

Esperado: **415 Unsupported Media Type**, con mensaje que solicita JSON.


## 11. Evidencia de middleware

Ejecuta cualquier GET con `-i`. Copia el valor de `X-Request-Id` y localiza en la terminal del servidor la línea que contiene el mismo identificador. Ejemplo ilustrativo:

```text
[uuid-generado] GET /api/criaturas -> 200 (1.2 ms)
```