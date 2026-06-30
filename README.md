# Gestión de artículos

API REST desarrollada con Node.js, Express y MongoDB para autenticar usuarios y gestionar artículos con roles de usuario y administrador.

## Características
- Registro e inicio de sesión con JWT.
- Roles `user` y `admin`.
- CRUD de artículos.
- Filtros, paginación y ordenamiento por query params.
- Limitador de peticiones en login.
- Validación de entradas con Zod.

## Instalación
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/mai-vr/backend-express-mongoDB.git
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   PORT=3000
   URI_DB=mongodb://127.0.0.1:27017/proyecto-final
   JWT_SECRET=supersecretkey
   ADMIN_EMAIL=admin@gmail.com
   ADMIN_PASSWORD=AdMinPassword321
   ```
4. Crear el usuario administrador inicial:
   ```bash
   node src/scripts/createAdmin.js
   ```
5. Iniciar la API:
   ```bash
   npm run dev
   ```

La API quedará disponible en `http://localhost:3000` (o en el puerto definido en `.env`).

## Roles y permisos
- `user`
  - Puede registrarse e iniciar sesión.
  - Puede crear, leer, actualizar y eliminar únicamente sus propios artículos.
- `admin`
  - Puede iniciar sesión con rol `admin`.
  - Puede ver todos los artículos con `GET /api/articles/all`.
  - Puede eliminar cualquier artículo.

## Autenticación
Todas las rutas de artículos requieren un token JWT en el header:

```http
Authorization: Bearer <token>
```

## Endpoints principales

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Artículos
- `GET /api/articles`
- `GET /api/articles/:id`
- `POST /api/articles`
- `PUT /api/articles/:id`
- `DELETE /api/articles/:id`
- `GET /api/articles/all` (solo admin)

## Ejemplos de request

Para loggearse:
```bash
http://localhost:<puerto>/api/auth/login
```  
Ingresar los siguientes datos en el body:  
> { "email": "maria@gmail.com", 
> "password": "pepe123" }

Respuesta esperada: un objeto con `success: true` y un `token` JWT.

Cualquier petición que se desee realizar debe contener el token generado para el usuario luego del inicio de sesión, para esto se coloca en el header de las peticiones que se realicen:
> Bearer {token}

Si se desea obtener los articulos escritos por ese usuario el método debe ser GET y la url (query params opcionales):  
```bash
http://localhost:3000/api/articles?limit=4&page=1&sort=createdAt&order=desc
```

En caso de querer crear un artículo la url es la misma, pero el método es POST. Por ejemplo:

>{ "title": "The Growing Popularity of Podcasts", "subtitle": "Millions of listeners are turning to audio content for news, education, and entertainment.", "text": "Over the last decade, podcasts have become one of the fastest-growing forms of media. " }

Si se desea acceder a un artículo en partícular:
```bash
https://localhost:<puerto>/api/articles/<id-del-articulo>
```

En caso de querer actualizar un artículo el método es PUT y la url:
```bash
https://localhost:<puerto>/api/articles/<id-del-articulo>
```
Y en el body el campo que se desea modificar junto con el nuevo valor, por ejemplo:
> { "subtitle": "A new subtitle must be written here." }

Para borrar un artículo el método será DELETE y la url:
```bash
https://localhost:<puerto>/api/articles/<id-del-articulo>
```