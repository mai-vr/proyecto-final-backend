# Gestión de articulos.

API rest desarrollada con node.js y express.js para autenticar usuarios y manejar el CRUD de ensayos.

## Sobre el proyecto.
Esta API incluye registro del usuario e inicio de sesión con un token generado utilizando JWT que maneja el tiempo de sesión del usuario dentro de la aplicación. Asimismo, la contraseña ingresada es hasheada con bcrypt.

Una vez el usuario inicia sesión o se registra puede escribir y publicar ensayos, leer lo que publicó, actualizar sus textos o eliminarlos.

Tanto la información del usuario como de los textos que publique se almacenan en la base de datos MongoDB para que persista la data.

---
## Instalación y ejecución.
El primer paso es clonar el repositorio con:
```
git clone https://github.com/mai-vr/backend-express-mongoDB.git
```

Generar una carpeta `.env` con las variables de entorno basandose en el archivo `.env.example` para que el proyecto corra adecuadamente.
Luego, levantar el proyecto con el comando:

```
npm run dev
```

Se puede seleccionar un cliente API como 'Bruno' y correr la url que se desee probar de las declaradas en el archivo 'routes' del proyecto.
Rutas para registrarse o iniciar sesión:
> /api/auth/login
> /api/auth/register
Rutas para acceder a los artículos una vez se inició sesión:
>/api/articles
>/api/articles/:id

---
## Ejemplos de request.
Para loggearse:
```
https://localhost:puerto/api/auth/login
```
Ingresar los siguientes datos en el body:
>{
>    "email": "maria@gmail.com",
>    "password": "pepe123"
>}

Cualquier petición que se desee realizar debe contener el token generado para el usuario luego del inicio de sesión, para esto se coloca en el header de las peticiones que se realicen:
> Bearer {token}

Si se desea obtener los articulos escritos por ese usuario el método debe ser GET y la url:
```
https://localhost:<puerto>/api/artciles
```

En caso de querer crear un artículo la url es la misma, pero el método es POST. Por ejemplo:
> {
  "title": "The Growing Popularity of Podcasts",
  "subtitle": "Millions of listeners are turning to audio content for news, education, and entertainment.",
  "text": "Over the last decade, podcasts have become one of the fastest-growing forms of media. "
>}

Si se desea acceder a un artículo en partícular:
```
https://localhost:<puerto>/api/articles/<id-del-articulo>
```

En caso de querer actualizar un artículo el método es PUT y la url:
```
https://localhost:<puerto>/api/articles/<id-del-articulo>
```

Y en el body el campo que se desea modificar junto con el nuevo valor, por ejemplo:
>{
>    "subtitle": "A new subtitle must be written here."
>}

Para borrar un artículo el método será DELETE y la url:
```
https://localhost:<puerto>/api/articles/<id-del-articulo>
```
