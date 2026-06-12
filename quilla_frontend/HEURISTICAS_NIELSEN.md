# Heurísticas de Nielsen Aplicadas al Sistema de Agencia de Viajes (Quilla)
**Autor:** Antony Elio Ayansi Huisa

Este documento presenta un análisis de usabilidad basado en las **10 Heurísticas de Jakob Nielsen** aplicadas al sistema de la Agencia de Viajes (Quilla). Para cada heurística se identifican exactamente **dos problemas de usabilidad** y sus correspondientes **dos oportunidades de mejora**.

---

## 1. Visibilidad del Estado del Sistema
*El sistema siempre debe mantener a los usuarios informados sobre lo que está sucediendo, a través de una retroalimentación adecuada dentro de un tiempo razonable.*

### Identificación de Problemas
*   **Problema 1 (Carga del Mapa en Primer Acceso):** En la pantalla inicial, al usar la función `loadMapa`, el mapa de Google no se visualizaba en el primer ingreso debido a esperas bloqueantes e indefinidas de la geolocalización. Si el usuario denegaba el permiso o el GPS tardaba en responder, la interfaz quedaba permanentemente bloqueada con el texto "Cargando mapa...".
*   **Problema 2 (Generación de Audioguías por TTS):** Al presionar el botón "Escuchar" en el detalle de un sitio turístico, el backend o el servicio de síntesis de voz (Text-to-Speech) demora unos segundos en generar y descargar el archivo de audio. Durante este lapso, la interfaz no ofrece ninguna indicación de carga (como un spinner en el botón), haciendo parecer que la aplicación no responde al clic.

### Oportunidades de Mejora
*   **Mejora 1 (Carga Asíncrona e Inicialización Rápida):** Optimizar el proceso de carga del mapa inicializando el contenedor de Google Maps de inmediato con una ubicación por defecto (Cusco) mediante `nextTick()` para garantizar su renderizado geométrico. En paralelo y sin bloquear la interfaz, resolver la geolocalización real del usuario y reposicionar el marcador suavemente cuando esté listo.
*   **Mejora 2 (Indicador de Síntesis en Curso):** Añadir un estado de carga (`loading`) al reproductor de audio y reflejarlo en el botón "Escuchar" (deshabilitando el botón y mostrando un spinner giratorio o el texto "Procesando voz...") hasta que el audio esté listo para reproducirse.

---

## 2. Relación entre el Sistema y el Mundo Real
*El sistema debe hablar el idioma de los usuarios mediante palabras, frases y conceptos familiares, en lugar de términos internos o lenguaje de desarrollo.*

### Identificación de Problemas
*   **Problema 1 (Coordenadas Crudas en Pantallas):** En el panel de catálogo del guía (`GuiaSitios.vue`), se muestran al usuario las coordenadas de latitud y longitud directamente en texto decimal (ej: `📍 -13.5169, -71.9781`). Estos valores técnicos son incomprensibles y poco prácticos en la vida cotidiana para ubicar un sitio.
*   **Problema 2 (Categorías con Nombres de Base de Datos):** Las etiquetas de categorías se muestran de forma directa tal como vienen del servidor o la base de datos (por ejemplo, textos en minúsculas y sin acentos como `turismo`, `museo`, `restaurante`, `hotel`), lo que resta pulcritud al diseño de cara al turista.

### Oportunidades de Mejora
*   **Mejora 1 (Geocodificación Inversa):** Implementar la API de Geocoding de Google Maps para traducir las coordenadas seleccionadas en una dirección humana o nombre de zona de referencia (ej: "Avenida El Sol, Cusco") y mostrar este dato legible junto a un mapa interactivo.
*   **Mejora 2 (Mapeo Estético de Etiquetas):** Crear un mapeador o filtro de traducción en el frontend que reciba los IDs o claves técnicas de la base de datos y los exponga en pantalla formateados con nombres limpios y amigables (ej: `museo` $\rightarrow$ `Museos e Historia`, `parque` $\rightarrow$ `Parques y Naturaleza`).

---

## 3. Control y Libertad del Usuario
*Los usuarios a menudo cometen errores y necesitan una "salida de emergencia" claramente marcada para abandonar la acción no deseada sin tener que pasar por un proceso prolongado.*

### Identificación de Problemas
*   **Problema 1 (Falta de Controles en Simulación de Radar):** Al ingresar a la pantalla de radar y guiado en tiempo real (`SitioNavigate.vue`), el sistema inicia automáticamente una simulación iterativa de distancias y direcciones que se actualiza constantemente. El usuario no cuenta con un botón para pausar o detener esta simulación sin tener que salir por completo de la pantalla.
*   **Problema 2 (Navegación Rígida en Audioguías):** Cuando el audio de la audioguía está reproduciéndose, si el usuario se distrae y quiere retroceder un fragmento específico de la explicación, debe deslizar con extrema precisión la barra de progreso lineal, lo cual resulta difícil y frustrante en pantallas móviles táctiles.

### Oportunidades de Mejora
*   **Mejora 1 (Controles de Simulación/Navegación):** Integrar un panel flotante de control con botones de pausa y reinicio del radar de proximidad, permitiendo al turista detener el escaneo continuo si prefiere leer los textos con tranquilidad.
*   **Mejora 2 (Botones de Salto de Tiempo):** Añadir controles para retroceder y avanzar el audio en saltos fijos de tiempo (ej. botones de `10s atrás` y `10s adelante`) ubicados a los lados del botón de reproducir/pausar.

---

## 4. Consistencia y Estándares
*Los usuarios no deberían tener que preguntarse si diferentes palabras, situaciones o acciones significan lo mismo. Siga las convenciones establecidas de la plataforma.*

### Identificación de Problemas
*   **Problema 1 (Estilos y Comportamiento de Pines):** Los marcadores (pines) del mapa se crean en `gps.js` utilizando la clase `AdvancedMarkerElement` con colores que varían según el tipo de sitio turístico, pero los iconos y las interacciones de clic (ventanas de información) tienen apariencias y llamadas de métodos distintas a las utilizadas en otros mapas de la app.
*   **Problema 2 (Iconos de Navegación del Sistema):** La acción de regreso en el detalle del sitio (`SitioDetail.vue`) utiliza un botón circular flotante con la acción `$router.go(-1)`, mientras que en otras secciones de la interfaz móvil se emplean barras de navegación superiores fijas con textos de retroceso de sistema, lo que resta consistencia estructural.

### Oportunidades de Mejora
*   **Mejora 1 (Catálogo Unificado de Marcadores):** Crear una clase o constante compartida de estilos para el mapa que unifique la apariencia de todos los marcadores en la aplicación (mismo radio de esquinas, sombras uniformes e iconos consistentes procedentes de la librería PrimeVue o Lucide).
*   **Mejora 2 (Componente Homogéneo de Cabecera):** Desarrollar un componente reutilizable de cabecera (`AppHeader.vue`) con un diseño estandarizado para los botones de retroceso, títulos de página y acciones rápidas, asegurando que la navegación superior se sienta idéntica en cualquier flujo.

---

## 5. Prevención de Errores
*Es incluso mejor que un buen mensaje de error un diseño cuidadoso que prevenga la ocurrencia de problemas en primer lugar.*

### Identificación de Problemas
*   **Problema 1 (Guardado Incompleto de Sitios):** En el formulario de creación de sitio de interés para guías, el botón "Crear Sitio" está siempre activo. Si el usuario lo pulsa antes de indicar un punto en el mapa, el sistema envía datos vacíos de latitud y longitud, fallando en el backend o generando una base de datos con coordenadas rotas.
*   **Problema 2 (Entradas de Coordenadas Fuera de Rango):** Al dar clic en el mapa interactivo para seleccionar la ubicación de un sitio turístico en Cusco, el usuario puede por error dar clic accidentalmente en un punto del mapa muy lejano o fuera de la región operativa de la agencia de viajes, registrando un sitio inválido.

### Oportunidades de Mejora
*   **Mejora 1 (Deshabilitación Proactiva de Botón):** Implementar validación en tiempo real en el formulario. Mantener el botón de creación deshabilitado (`:disabled="!isFormValid"`) hasta que el usuario haya rellenado los campos obligatorios y seleccionado un punto geográfico válido en el mapa.
*   **Mejora 2 (Restricción de Límites del Mapa):** Configurar la propiedad `restriction` de la API de Google Maps al inicializar el mapa en `GuiaSitios.vue` para limitar el encuadre y los clics permitidos a la zona metropolitana o turística autorizada de la región (delimitando lat/lng límites).

---

## 6. Reconocimiento antes que Recuerdo
*Minimice la carga de memoria del usuario haciendo visibles los objetos, las acciones y las opciones. El usuario no debería tener que recordar información de una parte del diálogo a otra.*

### Identificación de Problemas
*   **Problema 1 (Pérdida de Filtros de Búsqueda):** Si un usuario busca "Sacsahuaman" en la barra de búsqueda de la pantalla de inicio, selecciona un resultado para ver sus detalles y luego regresa a la pantalla principal, la barra de búsqueda se reinicia por completo. El usuario se ve forzado a recordar y volver a escribir el término si quería explorar otros resultados similares.
*   **Problema 2 (Ausencia de Contexto Visual en Categorías):** Al registrar un sitio turístico, el selector de categorías solo muestra texto simple de los nombres de categorías. El usuario debe recordar a qué tipo de locación se refiere cada denominación sin ayuda de iconos o descripciones rápidas.

### Oportunidades de Mejora
*   **Mejora 1 (Persistencia Temporal del Filtro):** Almacenar la query de búsqueda activa en el store global de Pinia para que el filtro y los resultados sigan mostrándose al regresar de la vista de detalle, ahorrando memoria y tiempo al usuario.
*   **Mejora 2 (Selector con Tarjetas Ilustradas):** Sustituir el combo selector básico de categorías por un componente de rejilla visual que incluya iconos significativos para cada opción (ej: un icono de plato de comida para 'Gastronomía', templo para 'Sitio Histórico'), facilitando el reconocimiento instantáneo.

---

## 7. Flexibilidad y Eficiencia de Uso
*Los aceleradores, no vistos por el usuario novato, a menudo pueden acelerar la interacción para el usuario experto, de modo que el sistema pueda atender tanto a usuarios inexpertos como experimentados.*

### Identificación de Problemas
*   **Problema 1 (Acceso Lento a Favoritos):** Añadir un sitio turístico a la lista de favoritos requiere que el usuario entre obligatoriamente al detalle de la tarjeta (`SitioDetail.vue`) y presione el icono del corazón. No existe un atajo o acelerador para hacerlo directamente desde las listas de exploración principal.
*   **Problema 2 (Pasos Excesivos para Iniciar Guiado):** Para iniciar la navegación asistida o el modo radar a un sitio, el turista experimentado debe navegar a través de varias pantallas (Inicio $\rightarrow$ Clic en Sitio $\rightarrow$ Detalle de Sitio $\rightarrow$ Clic en Icono de Direcciones).

### Oportunidades de Mejora
*   **Mejora 1 (Atajo de Favorito en Lista):** Incorporar un botón pequeño de favoritos sobre las tarjetas de la lista en `Home.vue`. Los usuarios recurrentes podrán armar su itinerario de viaje rápidamente sin tener que abrir individualmente cada página de detalle.
*   **Mejora 2 (Botón de Dirección Directo):** Añadir un icono de navegación o brújula rápida directamente en las tarjetas de la lista principal y en los resultados de búsqueda. De esta forma, los usuarios que ya conocen el sitio pueden iniciar la navegación por radar con un solo toque.

---

## 8. Estética y Diseño Minimalista
*Las conversaciones no deben contener información que sea irrelevante o que rara vez se necesite. Cada unidad adicional de información en una conversación compite con las unidades relevantes de información y disminuye su visibilidad relativa.*

### Identificación de Problemas
*   **Problema 1 (Textos Largos en Tarjetas de Listados):** Las tarjetas de la lista de sitios turísticos en la pantalla de inicio muestran el campo descripción con textos muy largos y corridos. Esto genera que la interfaz se vea densa y desorganizada al realizar scrolls rápidos.
*   **Problema 2 (Saturación de Elementos en el Radar):** La pantalla `SitioNavigate.vue` muestra al mismo tiempo el radar de proximidad, una tarjeta de información general redundante de gran tamaño, la lista completa de rutas y múltiples indicadores numéricos, lo cual reduce el espacio efectivo para la visualización del radar móvil.

### Oportunidades de Mejora
*   **Mejora 1 (Truncamiento Elegante y Diseño Limpio):** Limitar de forma estricta las descripciones en los listados a un máximo de 2 líneas cortas con un efecto de desvanecimiento suave al final, complementándolo con un diseño enfocado en la fotografía y etiquetas de categoría en lugar de texto extenso.
*   **Mejora 2 (Uso de Paneles Colapsables):** Mantener el radar y la distancia como los elementos principales de la pantalla. Colocar la descripción detallada y la lista de sub-rutas en un panel inferior deslizable ("BottomSheet" o cajón colapsable) que el usuario pueda abrir solo cuando lo requiera.

---

## 9. Ayudar a Reconocer, Diagnosticar y Recuperarse de Errores
*Los mensajes de error deben expresarse en un lenguaje sencillo (sin códigos técnicos), indicar con precisión el problema y sugerir constructivamente una solución.*

### Identificación de Problemas
*   **Problema 1 (Fallas Silenciosas del Mapa por Red):** Si el mapa de Google no se carga debido a problemas de conectividad a internet en el dispositivo del turista, el sistema simplemente oculta el spinner y deja el espacio en blanco o gris sin informarle al usuario qué ocurrió ni cómo solucionarlo.
*   **Problema 2 (Error en Subida de Fotos Pesadas):** Cuando el guía sube imágenes que exceden el límite de tamaño permitido por el servidor, la aplicación muestra un toast genérico de error de servidor sin indicarle al usuario que el problema es el peso del archivo ni aconsejarle comprimir la imagen.

### Oportunidades de Mejora
*   **Mejora 1 (Vista de Error y Reintento):** En caso de fallo al instanciar el mapa en la función `getMapa`, capturar el error y mostrar un mensaje claro dentro del contenedor: *"No pudimos cargar el mapa. Revisa tu conexión a internet"*, acompañado de un botón visible de "Reintentar".
*   **Mejora 2 (Validación de Tamaño en Cliente):** Validar el tamaño del archivo en el frontend antes de realizar el envío (`upload`). Si supera el tamaño máximo, denegar la subida de inmediato y desplegar una advertencia comprensible: *"El archivo seleccionado es demasiado grande (máx. 10MB). Por favor reduce su resolución o elige otro archivo."*

---

## 10. Ayuda y Documentación
*Aunque es mejor si el sistema se puede usar sin documentación, puede ser necesario proporcionar ayuda y documentación. Dicha información debe ser fácil de buscar, centrada en la tarea del usuario, enumerar los pasos concretos a realizar y no ser demasiado grande.*

### Identificación de Problemas
*   **Problema 1 (Ausencia de Guía de Inicio):** La primera vez que el turista ingresa al aplicativo, se encuentra directamente con el mapa y la lista de sitios turísticos. No se dispone de un recorrido o guía introductoria que explique cómo funciona el narrador de voz inteligente por proximidad o el radar.
*   **Problema 2 (Configuraciones de Voz sin Soporte):** En la pantalla de ajustes del narrador se ofrecen configuraciones avanzadas de voces, idiomas y tono de la síntesis de voz (TTS). Si las voces no se escuchan porque el dispositivo móvil no tiene el motor de voz de Google instalado, la app no proporciona ninguna instrucción de resolución.

### Oportunidades de Mejora
*   **Mejora 1 (Pistas de Ayuda Contextuales - Tooltips):** Añadir pequeños iconos de ayuda "?" o tooltips interactivos junto a las funcionalidades clave (como el radar de navegación y el interruptor de lectura de voz) que expliquen brevemente al usuario cómo usarlos en 1 o 2 líneas.
*   **Mejora 2 (Sección de Solución de Problemas de Audio):** Añadir un enlace directo de "Ayuda de Sonido" en el menú de configuración del narrador, que abra una guía simple con pasos para configurar o descargar paquetes de voz TTS en la configuración del sistema operativo (Android/iOS).
