# Frontend para microservicios en AWS

Este proyecto es una interfaz React para consumir un backend basado en microservicios desplegado en AWS. La aplicación se comunica con un endpoint de API Gateway y permite crear y consultar registros de diferentes entidades.

## Qué hace la aplicación

El componente principal en [src/App.js](src/App.js) define una interfaz con tres pestañas:

- Usuarios
- Cursos
- Inscripciones

Cada pestaña muestra un formulario para crear un registro y un campo para consultar por ID. La app usa `fetch` para enviar solicitudes HTTP a la API de AWS.

## Integración con AWS

La aplicación está configurada para consumir una API REST expuesta por Amazon API Gateway:

- Endpoint base: `https://61gdfto283.execute-api.us-west-2.amazonaws.com/dev`

La lógica del frontend realiza peticiones a rutas como:

- `POST /usuarios`
- `GET /usuarios/{id}`
- `POST /cursos`
- `GET /cursos/{id}`
- `POST /inscripciones`
- `GET /inscripciones/{id}`

En el backend, cada microservicio está asociado a su propia tabla en DynamoDB, lo que permite aislar los datos por dominio.

## Arquitectura esperada

- React frontend: interfaz de usuario
- Amazon API Gateway: punto de entrada HTTP para las operaciones
- AWS Lambda: procesamiento de las solicitudes
- Amazon DynamoDB: almacenamiento de los registros por servicio

## Funcionalidades del frontend

- Cambiar entre servicios desde la barra de pestañas
- Registrar datos usando formularios dinámicos
- Consultar registros por ID
- Mostrar respuestas del backend con estado HTTP y cuerpo JSON

## Ejecución local

Instala las dependencias:

```bash
npm install
```

Inicia la aplicación localmente:

```bash
npm start
```

La app quedará disponible en `http://localhost:3000`.

## Despliegue en AWS

Para usar esta UI con otro entorno de AWS, actualiza la constante `API_BASE` en [src/App.js](src/App.js) con la URL de tu API Gateway desplegada.

Opciones comunes de despliegue:

- Amazon S3 + CloudFront para el frontend estático
- AWS Amplify para despliegue continuo
- API Gateway + Lambda + DynamoDB para el backend

## Notas

El frontend no maneja la lógica de negocio directamente; solo consume los servicios expuestos por AWS y muestra las respuestas al usuario.
