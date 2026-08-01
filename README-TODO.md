# Pendiente de rellenar con la clienta

Este proyecto ya funciona de principio a fin (animaciones, formularios,
resumen de pedido y envío a WhatsApp), pero usa **datos y medidas de
ejemplo**. Busca en el código el texto `TODO CLIENTE` para localizar cada
punto exacto. Lista resumida de lo que falta:

## 1. Identidad de marca
- [ ] Nombre real de la marca (aparece en `<title>`, header, intro y footer)
- [ ] Logo (si existe, en SVG a ser posible) para sustituir el símbolo ✚ actual
- [ ] Eslogan / tagline corto
- [ ] Colores exactos de marca (`css/style.css`, bloque `:root` al principio)
- [ ] Tipografías si no quiere Fraunces + Manrope (actualmente elegidas por estilo, no son obligatorias)

## 2. Versículos bíblicos
- [ ] Confirmar los 2 versículos (o más) que quiere mostrar en la sección
      de la camiseta — texto exacto + referencia + versión de la Biblia
      (Reina-Valera, NVI, etc.)

## 3. Diseños / siluetas de marca
- [ ] Silueta o icono que se "fusiona" con la camiseta (actualmente un
      icono cruz+círculo de ejemplo)
- [ ] Silueta o icono que se fusiona con la taza
- [ ] 3 siluetas/iconos que se fusionan con cada llavero (rectangular,
      corazón, redondo) — pueden ser el mismo logo o distintos

## 4. Fotos reales de producto
- [ ] Foto/mockup real de la camiseta en blanco (delante y detrás)
- [ ] Foto/mockup real de la taza
- [ ] Foto/mockup real de cada tipo de llavero (rectangular, corazón, redondo)
      Ahora mismo todo son ilustraciones SVG simples de marcador de posición.

## 5. Medidas exactas (para las zonas de impresión "arrastrables")
- [ ] Zona imprimible camiseta delante (ancho x alto y posición sobre la prenda)
- [ ] Zona imprimible camiseta detrás
- [ ] Alto x ancho del área imprimible de la taza
- [ ] Tamaño real de cada llavero (rectangular, corazón, redondo)

Estas medidas se usan en `index.html` (buscar `print-zone`, están como
porcentajes `left/top/width/height`) y podemos ajustarlas en cuanto las
tengamos, sin tocar el resto del código.

## 6. Tallas y categorías
- [ ] Tabla real de tallas por categoría (hombre, mujer) — ahora mismo:
      Hombre S-XXL, Mujer XS-XL (ejemplo)
- [ ] Rango real de edades para niño/a (ahora: 2-3, 4-5, 6-7, 8-9, 10-12)
- [ ] Rango real de meses para bebé (ahora: 0-3, 3-6, 6-9, 9-12, 12-18)
- [ ] Colores reales disponibles en algodón (ahora: blanco, negro, gris, azul marino)

## 7. WhatsApp
- [ ] Número real de WhatsApp Business (`js/main.js`, constante
      `WHATSAPP_NUMBER` al principio del archivo)

## 8. Términos y condiciones
- [ ] Texto real de términos y condiciones (ahora el enlace no lleva a
      ningún sitio — lo podemos convertir en una ventana emergente o
      enlazar a una página aparte)

## 9. Contacto / redes (footer)
- [ ] Datos de contacto, redes sociales, año/copyright real

---

### Nota técnica sobre WhatsApp e imágenes (Opción A acordada)
WhatsApp no permite adjuntar imágenes automáticamente a través de un
enlace (es una limitación de la propia plataforma, no nuestra). Por eso
el flujo hace lo siguiente al pulsar "Solicitar pedido":
1. Descarga automáticamente una imagen (PNG) por cada producto añadido,
   mostrando el diseño exactamente donde el cliente lo colocó.
2. Abre WhatsApp con el mensaje de texto ya redactado (datos + productos
   + precios), pidiendo al cliente que adjunte esas imágenes descargadas
   directamente en el chat.

Es la solución más fiable sin necesidad de montar un servidor propio.
Si en el futuro quieres que las imágenes se adjunten 100% automáticas,
haría falta un backend con WhatsApp Business API (opción C que
comentamos) — avísame cuando quieras dar ese paso.
