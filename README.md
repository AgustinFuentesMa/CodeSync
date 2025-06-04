# Task Manager Colaborativo

Este es un gestor de tareas colaborativo desarrollado como proyecto final universitario. La aplicación permite a los usuarios registrarse, iniciar sesión, crear tareas, asignarlas a otros usuarios y realizar un seguimiento del estado de las tareas.

## Características

- Autenticación de usuarios (registro e inicio de sesión)
- Creación y gestión de tareas
- Asignación de tareas a usuarios
- Filtrado de tareas por estado
- Interfaz de usuario moderna y responsive
- Almacenamiento de datos en archivos JSON

## Tecnologías utilizadas

- Node.js
- Express.js
- HTML5
- CSS3
- JavaScript (Vanilla)
- JSON (para almacenamiento de datos)

## Requisitos previos

- Node.js (versión 12 o superior)
- npm (viene con Node.js)

## Instalación

1. Clona este repositorio o descarga los archivos
2. Abre una terminal en el directorio del proyecto
3. Instala las dependencias:
   ```bash
   npm install
   ```

## Ejecución

1. Inicia el servidor:
   ```bash
   node server.js
   ```
2. Abre tu navegador y visita:
   ```
   http://localhost:3000
   ```

## Estructura del proyecto

```
/
├── data/               # Archivos JSON para almacenamiento
│   ├── users.json
│   └── tasks.json
├── public/            # Archivos estáticos
│   ├── login.html
│   ├── dashboard.html
│   └── styles.css
├── server.js         # Servidor Express
├── package.json      # Dependencias y scripts
└── README.md        # Este archivo
```

## Uso

1. Regístrate con un nombre de usuario y contraseña
2. Inicia sesión con tus credenciales
3. En el dashboard, puedes:
   - Crear nuevas tareas
   - Asignar tareas a usuarios
   - Ver todas las tareas
   - Filtrar tareas por estado
   - Actualizar el estado de las tareas

## Próximos pasos

Este proyecto está diseñado para ser migrado a una arquitectura de tres capas en el futuro, separando:

1. Capa de Presentación (Frontend)
2. Capa de Lógica de Negocio (Backend)
3. Capa de Datos (Base de datos)

## Contribución

Este es un proyecto educativo. Si encuentras algún problema o tienes sugerencias de mejora, no dudes en crear un issue o enviar un pull request. 