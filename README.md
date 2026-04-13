# ECHO - Escape Room de Red Social

ECHO es una aplicación web educativa de tipo *escape room* que simula una red social. Los jugadores asumen el rol de un moderador de contenido que debe resolver cuatro retos progresivos relacionados con la desinformación digital y el uso de la inteligencia artificial.

---

## Descripción del Juego

El juego se ambienta en un escritorio de sistema operativo simulado. Al iniciarlo, el jugador realiza un *onboarding* (nombre, edad e idioma) y recibe instrucciones de su jefe a través de la app de mensajes. A partir de ahí, navega por la red social ECHO completando los retos en orden.

### Retos

| # | Nombre | Descripción |
|---|--------|-------------|
| 1 | **Cuentas Sospechosas** | Clasifica 5 cuentas (3 bots, 2 humanos) investigando sus perfiles. |
| 2 | **Contenido Generado por IA** | Verifica si un post fue generado por IA completando su texto palabra a palabra. |
| 3 | **Usos Incorrectos de IA** | Actúa como moderador: responde a publicaciones que difunden desinformación generada por IA. |
| 4 | **Community Note** | Publica una nota comunitaria final con los aprendizajes clave del escape room. |

El nivel de desinformación del sistema disminuye con cada reto superado y se muestra en el panel lateral de estadísticas en tiempo real.

---

## Escritorio Simulado

El escritorio incluye un drawer de apps con las siguientes aplicaciones:

| App | Descripción |
|-----|-------------|
| **Mensajes** | Recibe instrucciones del jefe antes y después de cada reto. Los mensajes se marcan automáticamente como leídos al abrirlos. |
| **Red Social (ECHO)** | App principal donde se desarrollan todos los retos. |
| **Archivos** | Explorador de archivos simulado con carpetas (Documentos, Imágenes) y una carpeta privada bloqueada (ECHO). |
| **Pistas** | Muestra pistas contextuales para el reto activo. Registra en xAPI cuando el jugador consulta una pista. |
---


## Idiomas Soportados

| Código | Idioma |
|--------|--------|
| `es` | Español |
| `en` | Inglés |
| `fi` | Finés |
| `sr` | Serbio |

El idioma se selecciona durante el *onboarding* y puede cambiarse desde el selector del header. Las traducciones se gestionan mediante **i18next** y se generan desde un archivo Excel con el script `npm run update-i18n`.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | React 18.3.1 + Vite |
| Routing | React Router v6.12.1 |
| Estado global | Context API (8 providers) + Hooks |
| Backend simulado | MirageJS 0.1.47 (mock API in-memory) |
| HTTP Client | Axios |
| Internacionalización | i18next + react-i18next + i18next-browser-languagedetector |
| Analytics | xAPI 1.0 (implementación sobre Fetch API) |
| Notificaciones | react-hot-toast |
| Animaciones | react-awesome-reveal |
| Iconos | react-icons |
| Fechas | Day.js |
| IDs únicos | uuid |
| Media | react-player |
| Seguridad | jwt-decode, jwt-encode |
| Testing | Vitest, React Testing Library |

---

## Instalación

### Prerrequisitos

- Node.js >= 18.3
- npm >= 9

### Clonar e instalar

```bash
git clone https://github.com/valgonzalez3001/SocialMediaER2.git
cd SocialMediaER2
npm install
```

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (basándote en `example.env`):

```env
# Ruta base para deployment (ej: /ECHO/ para GitHub Pages)
VITE_BASE_PATH=/

# xAPI Learning Record Store (opcional - el juego funciona sin estas)
VITE_XAPI_ENDPOINT=https://tu-lrs.example.com/xapi
VITE_XAPI_AUTH=base64_encoded_credentials
```

**Notas:**
- `VITE_BASE_PATH`: Importante para deployment en GitHub Pages. Por defecto es `/` para desarrollo local.
- `VITE_XAPI_ENDPOINT` y `VITE_XAPI_AUTH`: Si no están configurados, el juego funciona normalmente sin registrar eventos en el LRS.

---

## Comandos

```bash
# Servidor de desarrollo con hot-reload
npm run dev

# Build de producción
npm run build

# Preview del build de producción
npm run preview

# Build para GitHub Pages (/ECHO/ base path)
npm run build:gh-pages

# Deploy a GitHub Pages
npm run deploy

# Regenerar archivos de traducción desde el Excel
npm run update-i18n

# Exportar traducciones actuales a CSV
npm run update-i18n-inverse

# Ejecutar tests
npm test
```

La aplicación de desarrollo estará disponible en `http://localhost:5173`.

---

## Estructura del Proyecto

```
src/
+-- backend/            # Mock API con MirageJS
   +-- controllers/     # Endpoints REST (posts, users, comments)
   +-- db/             # Datos de usuarios y posts por idioma
   +-- utils/          # Utilidades para parseo de datos
+-- components/         # Componentes reutilizables
   +-- Desktop/        # Contenedor del escritorio OS
   +-- Header/         # Cabecera de la red social
   +-- Navbar/         # Navegación lateral con indicadores
   +-- Post/           # Tarjeta de publicación
   +-- CreatePostForm/ # Formulario de nuevo post
   +-- EditPostForm/   # Formulario de edición de post
   +-- EmojiModal/     # Selector de emojis
   +-- SocialMediaApp/ # Contenedor principal de la red social
   +-- SurveyModal/    # Encuesta post-juego
   +-- MessagesApp/    # App de mensajes del jefe
   +-- FilesApp/       # Explorador de archivos simulado
   +-- HintsApp/       # App de pistas del escape room
   +-- StatsPanel/     # Panel lateral de estadísticas en tiempo real
   +-- Taskbar/        # Barra de tareas del escritorio
   +-- PopupNotification/ # Notificaciones toast
   +-- BossNotification/  # Alertas especiales del jefe
   +-- LanguageSelector/  # Selector de idioma
   +-- PlayerOnboarding/  # Setup inicial (nombre, edad, idioma)
+-- constants/
   +-- langs/          # Traducciones (es, en, fi, sr)
   +-- README.md       # Documentación de constantes
+-- contexts/           # Providers de estado global (8 providers)
   +-- LoggedInUserProvider   # Perfil del jugador actual
   +-- MessagesProvider       # Mensajes del jefe
   +-- OSProvider             # Estado del escritorio simulado
   +-- PostsProvider          # Operaciones con posts
   +-- StatsProvider          # Progreso, timer y puntuación
   +-- UserProvider           # Contenedor de datos de usuarios
   +-- XAPIProvider           # Integración xAPI/LRS para analytics
   +-- AdminProvider          # Configuración admin
+-- pages/
   +-- Home/           # Feed principal con sorting (Latest/Oldest/Trending)
   +-- Admin/          # Reto 1: Clasificación de cuentas sospechosas
   +-- AIContent/      # Reto 2: Verificación de contenido generado por IA
   +-- AIIncorrectUses/# Reto 3: Moderación de usos incorrectos de IA
   +-- CommunityNote/  # Reto 4: Puzzle final sobre alfabetización digital
   +-- Profile/        # Perfil de usuario con historial
   +-- PostDetail/     # Detalle de publicación individual
   +-- Desktop/        # Escritorio simulado principal
   +-- Error/          # Página 404
+-- services/          # Servicios API
   +-- PostService.jsx      # CRUD de posts y comentarios
   +-- UserService.jsx      # CRUD de usuarios
+-- utils/
   +-- assetPath.js         # Resolución de rutas para deployment
   +-- date.jsx             # Formato de fechas y diferencias temporales
   +-- i18nHelpers.jsx      # Helpers multilíngües
   +-- icons.jsx            # Importaciones centralizadas de iconos
+-- scripts/
   +-- download_from_excel.mjs  # Genera traducciones desde Excel maestro
   +-- js_to_csv.mjs            # Exporta traducciones actuales a CSV
```

---`.jsx` por idioma: `es.jsx`, `en.jsx`, `fi.jsx`, `sr.jsx`). 

**Actualizar desde Excel maestro:**
```bash
npm run update-i18n
```

**Exportar traducciones actuales a CSV:**
```bash
npm run update-i18n-inverse
```

**Cambio dinámico de idioma:** El selector de idioma en el header permite cambiar en tiempo real. Los datos del usuario se auto-recargan al cambiar de idioma.

---

## Integración MirageJS (Backend Simulado)

El backend simulado proporciona endpoints RESTful completos:

### Rutas disponibles:
```
GET    /api/posts              # Obtener todos los posts
GET    /api/posts/:id          # Obtener post específico
POST   /api/posts              # Crear nuevo post
PUT    /api/posts/:id          # Editar post
DELETE /api/posts/:id          # Eliminar post
POST   /api/posts/:id/likes    # Dar/quitar like

GET    /api/users              # Obtener todos los usuarios
GET    /api/users/:username    # Obtener usuario por nombre
PUT    /api/users/:username    # Editar usuario
POST   /api/users/:id/follow   # Seguir/dejar de seguir

GET    /api/comments/:postId   # Obtener comentarios del post
POST   /api/comments/:postId   # Añadir comentario
PUT    /api/comments/:id       # Editar comentario
DELETE /api/comments/:id       # Eliminar comentario
POST   /api/comments/:id/vote  # Votar comentario
```

### Características:
- Datos multiidioma (usuarios y posts en es, en, fi, sr)
- Caché inteligente con fallback a inglés
- Soporte de media (imágenes en posts)
- Sistema de likes y comentarios
- Tracking de usuarios que dieron like

---

## Estado Global (Context Providers)

La aplicación utiliza **8 Context Providers** para gestionar el estado:

| Provider | Responsabilidad | Estados clave |
|----------|-----------------|------------------|
| **PostsProvider** | Operaciones con posts y comentarios | `allPosts`, `createPost()`, `editPost()`, `deletePost()`, `likePost()`, comments |
| **UserProvider** | Datos de todos los usuarios | `userState`, `getAllUsers()`, recargar on language change |
| **LoggedInUserProvider** | Perfil del jugador actual | `loggedInUser`, `editUser()`, `followUser()`, historial |
| **StatsProvider** | 🎮 **Progreso del juego** | `challenge1-4Completed`, `disinfectionLevel`, timer (20 min), `suspectUsersCount`, contadores |
| **MessagesProvider** | Mensajes del jefe | `messages[]`, `unreadCount`, tracking automático, instrucciones |
| **XAPIProvider** | 📊 **Integración Learning Analytics** | Endpoint LRS configurable, `trackEvent()`, duración de retos, eventos de juego |
| **OSProvider** | Simulación del SO escritorio | `openApps[]`, `activeApp`, window management, minimizar/maximizar |
| **AdminProvider** | Configuración admin | Controles administrativos |

---

## Características de Juego

### Mecánicas principales:
- ✅ **4 retos progresivos** con dificultad creciente
- ✅ **Nivel de desinformación en tiempo real** - disminuye con cada reto completado
- ✅ **Timer de escape de 20 minutos** - alerta crítica a los 5 minutos
- ✅ **Persistencia de progreso** - guardar en sessionStorage
- ✅ **Validación de indicadores** - Challenge 1 con xAPI tracking detallado
- ✅ **Reanudación de sesión** - ventana de 5 minutos para continuar partidas completadas
- ✅ **Dashboard de estadísticas en vivo** - panel lateral actualizado

### Operaciones con Posts:
- 📝 Crear posts nuevos
- ✏️ Editar posts propios
- 🗑️ Eliminar posts propios
- ❤️ Dar/quitar likes
- 💬 Crear y votar comentarios
- 🔄 Ordenar feed (Más recientes/Antiguos/Trending)

---

## Rutas y Navegación

### Rutas públicas:
```
/                           → Home - Feed principal
/profile/:username          → Perfil de usuario
/post-detail/:postId        → Detalle de publicación
/error                      → Página 404
```

### Rutas protegidas (retos):
```
/admin                      → Reto 1: Clasificación de cuentas (Bot/Humano)
/ai-content                 → Reto 2: Verificación de contenido IA
/ai-incorrect-uses          → Reto 3: Moderación y respuesta a desinformación
/community-note             → Reto 4: Puzzle final sobre alfabetización digital
```

**Protección de rutas:** Las rutas de retos redirigen a retos anteriores sin completar si el jugador no ha leído las instrucciones del jefe.

---

## Integración xAPI/LRS

ECHO registra eventos de aprendizaje siguiendo el estándar **xAPI 1.0**:

### Eventos capturados:
- 📌 Inicio y fin del juego (`initialized`, `started`, `completed`)
- 💬 Lectura de mensajes (`looked at`)
- 🔍 Clasificación de cuentas (`answered`)
- ✏️ Creación de contenido (`created`)
- 📱 Navegación y perfiles (`experienced`)
- 💡 Consulta de pistas (`asked`)
- ⏱️ Duración de cada reto (extensión `durationMs`)

### Configuración xAPI:
```env
VITE_XAPI_ENDPOINT=https://tu-lrs.example.com/xapi
VITE_XAPI_AUTH=base64_encoded_credentials
```

Si no están configuradas, el juego funciona normalmente sin enviar statements.

---

## Tests

```bash
npm test
```

---

## Licencia

Proyecto desarrollado en el marco del proyecto **ENDGAME**. Uso académico e investigador.
