# Quilla Frontend 🎨✨

Este es el repositorio oficial para el frontend del proyecto Quilla. Construido con Vue.js 3, Vite y pnpm, este proyecto busca ser una aplicación web moderna, rápida y escalable.

## 📋 Prerrequisitos

Antes de empezar, asegúrate de tener instalado el siguiente software en tu sistema:

1.  **Node.js**: Este proyecto requiere una versión específica de Node.js para funcionar correctamente con Vite.
    - **Versión requerida:** `^20.19.0` o `>=22.12.0`
    - **Recomendación:** Usa un gestor de versiones como [nvm](https://github.com/nvm-sh/nvm) o [fnm](https://github.com/schniz/fnm) para instalar y cambiar fácilmente entre versiones de Node.

    ```bash
    # Ejemplo usando nvm para instalar y usar una versión compatible
    nvm install 22.12.0
    nvm use 22.12.0
    ```

2.  **pnpm**: Este proyecto utiliza `pnpm` como gestor de paquetes para ser más rápido y eficiente con el espacio en disco.
    - Si no lo tienes, instálalo globalmente con npm (que viene con Node.js):

    ```bash
    npm install -g pnpm
    ```

## 🚀 Puesta en Marcha Local

Sigue estos pasos para tener una copia del proyecto corriendo en tu máquina local.

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/antonyayansi/taller-proyectos-1/
    ```

2.  **Navega al directorio del proyecto:**

    ```bash
    cd quilla_frontend
    ```

3.  **Instala las dependencias:**
    Este comando leerá el archivo `pnpm-lock.yaml` y descargará todas las librerías necesarias.

    ```bash
    pnpm install
    ```

4.  **Inicia el servidor de desarrollo:**
    ¡Y listo! La aplicación estará corriendo en `http://localhost:5173`.
    ```bash
    pnpm dev
    ```

## 🛠️ Scripts Disponibles

En este proyecto, puedes correr los siguientes scripts desde la terminal:

- `pnpm dev`: Inicia el servidor de desarrollo con Hot-Module Replacement (HMR).
- `pnpm build`: Compila y empaqueta la aplicación para producción en la carpeta `dist/`.
- `pnpm preview`: Sirve el contenido de la carpeta `dist/` para previsualizar la versión de producción localmente.
- `pnpm format`: Formatea todo el código del proyecto usando Prettier para mantener un estilo consistente. Se recomienda correr este comando antes de hacer un `commit`.

## 💻 Tecnologías Utilizadas

Este proyecto fue creado con las siguientes tecnologías:

- **Vue.js 3**: El framework progresivo de JavaScript.
- **Vite**: La herramienta de compilación frontend de nueva generación.
- **Vue Router**: Para el manejo de rutas en esta Single Page Application (SPA).
- **Pinia** 🍍: La librería recomendada para el manejo de estado global.
- **Prettier** 💅: Para asegurar un formato de código consistente en todo el equipo.
- **pnpm** 📦: El gestor de paquetes rápido y eficiente.

---

_Este README fue generado para el equipo de Taller de Proyectos. ¡Feliz codificación!_
