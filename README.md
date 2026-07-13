# 🛒 Proyecto: Herramientas-35670-Elegance (Tienda Web de Ropa)

Este proyecto consiste en el desarrollo de una aplicación web Full Stack para una tienda de ropa en línea. La aplicación permite la gestión de productos, usuarios, carrito de compras y demás funcionalidades relacionadas con un comercio electrónico.

La arquitectura del sistema está separada en dos módulos principales:

Frontend: Aplicación web interactiva desarrollada con React.
Backend: API REST desarrollada con Node.js y Express encargada de la lógica de negocio y comunicación con la base de datos PostgreSQL.

El proyecto utiliza Docker para facilitar la configuración del entorno de desarrollo y garantizar que todos los integrantes del equipo trabajen con una configuración uniforme.
---

## 📂 Estructura del Directorio

El repositorio está organizado bajo el siguiente árbol de directorios para separar las responsabilidades del sistema:

### 🖥️ Backend (Backend-ropa)
El backend gestiona la lógica de negocio, el acceso a datos y los endpoints de la API.

* **`src/`**: Carpeta principal del código fuente del servidor.
    * `config/`: Configuraciones de la base de datos y variables de entorno del sistema.
    * `controllers/`: Lógica operativa que procesa las peticiones (usuarios, catálogo, carrito).
    * `middleware/`: Capas de seguridad y validación (ej. autenticación mediante tokens).
    * `models/`: Estructuras y esquemas de los datos (Producto, Usuario, Carrito).
    * `routes/`: Definición de los endpoints o rutas de la API accesibles para el cliente.
* **`index.js`**: Punto de entrada de la aplicación que inicializa el servidor Express.
* **`.env.example`**: Archivo de guía con las variables de entorno necesarias para la conexión local.

### 🎨 Frontend (Frontend/src)
El frontend contiene la interfaz de usuario interactiva creada para consumir los servicios del backend.

* **`Components/`**: Bloques de interfaz reutilizables (botones, barras de navegación, tarjetas de ropa).
* **`Context/`**: Gestión de estados globales de la aplicación (ej. estado del carrito de compras).
* **`Pages/`**: Vistas completas de la tienda (Página principal, Login, Catálogo, Pasarela de pago).
* **`Services/`**: Funciones encargadas de realizar las peticiones HTTP hacia la API del backend.
* **`App.js` & `App.css`**: Componente raíz de la interfaz y sus estilos globales asociados.
* **`index.js` & `index.css`**: Punto de inicio que renderiza la aplicación en el navegador.

---

## 🚀 Tecnologías Clave Utilizadas

* **Control de Versiones:** Git y GitHub para la colaboración e integración continua del equipo.
* **Backend:** Node.js junto con Express para el ruteo de la API y persistencia de datos.
* **Frontend:** React (basado en la arquitectura modular de carpetas provista) para una interfaz ágil y dinámica.

---

## 🛠️ Configuración Inicial

1. **Clonar el repositorio:**
```bash
   git clone [https://github.com/wyzetevio/Herramientas-35670-Elegance.git](https://github.com/wyzetevio/Herramientas-35670-Elegance.git)

🐳 Ejecución con Docker
Requisitos

Antes de ejecutar el proyecto necesitas:

Git
Docker Desktop
Node.js (opcional si trabajas únicamente con Docker)
Configuración de variables de entorno

Cada integrante debe crear sus propios archivos .env a partir de los archivos de ejemplo:

Backend:

copy Backend-ropa\.env.example Backend-ropa\.env

Frontend:

copy Frontend\.env.example Frontend\.env

Luego se deben completar las variables necesarias.

Los archivos .env no se almacenan en GitHub porque contienen información sensible.

Ejecutar el proyecto

Desde la carpeta raíz:

docker compose up --build

Esto iniciará:

Frontend
http://localhost:3000
Backend
http://localhost:5000

🌐 Base de datos

La aplicación utiliza PostgreSQL alojado en Railway.

El backend consume la base de datos mediante variables de entorno, evitando almacenar credenciales dentro del repositorio.

🔧 Desarrollo sin Docker

También es posible ejecutar los servicios manualmente:

Backend
cd Backend-ropa
npm install
npm run dev
Frontend
cd Frontend
npm install
npm start

👥 Colaboración

El proyecto utiliza GitHub para el control de versiones y trabajo colaborativo del equipo.

Cada integrante debe configurar sus variables de entorno localmente y ejecutar el proyecto mediante Docker para mantener un entorno de desarrollo consistente.