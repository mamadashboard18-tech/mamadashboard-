# Paleta Mamá Dashboard — para Illustrator

Valores tomados de `src/index.css` y de la landing. Todo está en **RGB** (la app es digital): en Illustrator creá el documento en **Modo de color RGB** (Archivo → Modo de color del documento → Color RGB).

## Cómo cargarlo en Illustrator

1. **Muestras:** en el panel Muestras → *Nueva muestra*, pegá el HEX en el selector de color, poné el nombre de la tabla y marcá **Global**. Agrupá cada bloque en un *Grupo de colores* (Mamá / Partner).
2. **Degradados:** panel Degradado → *Lineal* o *Radial*, cargá las paradas (color + ubicación %) y el ángulo de la columna **Ángulo AI**, y guardalo como muestra con *Añadir a muestras*.
3. **Transparencias:** Illustrator no guarda opacidad en la muestra. Usá el color base y aplicá la **opacidad** en el panel Transparencia, o en la parada del degradado.

> **Ángulos:** CSS y Illustrator miden distinto. La columna **Ángulo AI** ya viene convertida (AI = 90° − ángulo CSS). Ejemplo: CSS 135° (de arriba a la izquierda hacia abajo a la derecha) → AI **−45°**.

---

## 1. App de la mamá

### Marca

| Nombre | HEX | RGB | Uso |
|---|---|---|---|
| Mamá / Brand pink | `#E26FCE` | 226, 111, 206 | Color principal, botones, acentos |
| Mamá / Brand purple | `#9B5DE5` | 155, 93, 229 | Segundo color de marca |
| Mamá / Brand magenta | `#C22EA6` | 194, 46, 166 | Texto y acentos sobre rosa |
| Mamá / Pink light | `#FCE3F6` | 252, 227, 246 | Fondos suaves rosas |
| Mamá / Purple light | `#EDE1FB` | 237, 225, 251 | Fondos suaves violetas |
| Mamá / Teal | `#2EE6D6` | 46, 230, 214 | Acento puntual |

### Colores de los degradados

| Nombre | HEX | RGB | Uso |
|---|---|---|---|
| Mamá / Rose | `#FF6F9F` | 255, 111, 159 | Inicio del degradado hero |
| Mamá / Peach | `#FF9A6A` | 255, 154, 106 | Brillo cálido de la tarjeta hero |
| Mamá / Purple hero | `#A875EA` | 168, 117, 234 | Final del degradado hero |
| Mamá / Purple grad | `#9B6EE0` | 155, 110, 224 | Final de la tarjeta hero |
| Mamá / Deep plum | `#3A2159` | 58, 33, 89 | Fondos oscuros (landing) |

### Superficies y texto

| Nombre | HEX | RGB | Uso |
|---|---|---|---|
| Mamá / Fondo | `#FDF6FA` | 253, 246, 250 | Fondo general de la app |
| Mamá / Superficie | `#FFFFFF` | 255, 255, 255 | Tarjetas |
| Mamá / Ink | `#241D2B` | 36, 29, 43 | Texto principal |
| Mamá / Párrafo | `#5C5266` | 92, 82, 102 | Texto de párrafos |
| Mamá / Ink muted | `#71667A` | 113, 102, 122 | Texto secundario |
| Mamá / Faint | `#857D93` | 133, 125, 147 | Texto terciario |
| Mamá / Very faint | `#A89FB0` | 168, 159, 176 | Placeholders, metadatos |
| Mamá / Hairline | `#C9C0D0` | 201, 192, 208 | Líneas finas |
| Mamá / Borde suave | `#9B5DE5` al **15 %** | 155, 93, 229 | Bordes de tarjetas |

### Degradados

**Hero** — lineal, ángulo AI **−45°** (CSS 135°). Header, CTA principales, pills.

| Parada | Color | Ubicación |
|---|---|---|
| 1 | `#FF6F9F` | 0 % |
| 2 | `#E26FCE` | 50 % |
| 3 | `#A875EA` | 100 % |

**Alternativo** — lineal, ángulo AI **−45°** (CSS 135°). Variante violeta → rosa.

| Parada | Color | Ubicación |
|---|---|---|
| 1 | `#9B5DE5` | 0 % |
| 2 | `#E26FCE` | 100 % |

**Tarjeta hero** — se arma con **4 capas apiladas** (en el panel Apariencia, varios rellenos, o con 4 rectángulos superpuestos). Es la tarjeta principal de Inicio. De abajo hacia arriba:

| Capa | Tipo | Paradas | Posición del centro |
|---|---|---|---|
| 1 (base) | Lineal, AI **−70°** (CSS 160°) | `#FF6F9F` 0 % → `#E26FCE` 55 % → `#9B6EE0` 100 % | — |
| 2 | Radial | `#9B5DE5` opacidad 100 % en 0 % → `#9B5DE5` opacidad 0 % en 60 % | Abajo a la derecha (90 % x, 100 % y) |
| 3 | Radial | `#FF9A6A` opacidad 100 % en 0 % → `#FF9A6A` opacidad 0 % en 50 % | Centro-derecha (78 % x, 30 % y) |
| 4 (arriba) | Radial | `#FF6F9F` opacidad 100 % en 0 % → `#FF6F9F` opacidad 0 % en 55 % | Arriba a la izquierda (12 % x, 0 % y) |

> Los radiales son elípticos y bastante más grandes que la tarjeta (120–140 % del ancho). Estirá el radial con la herramienta Degradado (G) hasta que cubra más de la mitad de la tarjeta.

**Rose → Pink** — lineal, AI **−45°**. Botones e íconos de la landing.
`#FF6F9F` 0 % → `#E26FCE` 100 %

**Rose → Purple** — lineal, AI **−45°**. Acentos de la landing.
`#FF6F9F` 0 % → `#9B6EE0` 100 %

**Tinte suave** — lineal, AI **−45°**. Fondos de chips y tarjetas suaves.
`#E26FCE` opacidad 10 % en 0 % → `#9B5DE5` opacidad 10 % en 100 %

---

## 2. App del partner (acompañante)

Paleta propia, separada del rosa/violeta de la mamá por decisión de producto: violeta más profundo con toques cálidos de durazno y dorado.

### Marca

| Nombre | HEX | RGB | Uso |
|---|---|---|---|
| Partner / Violet | `#7C3AED` | 124, 58, 237 | Color principal del partner |
| Partner / Violet deep | `#5B21B6` | 91, 33, 182 | Hover, texto sobre violeta claro |
| Partner / Gold | `#D6A244` | 214, 162, 68 | Acento cálido, destacados |
| Partner / Green bg | `#DDEECB` | 221, 238, 203 | Fondo de estados completados |
| Partner / Green text | `#4C7A34` | 76, 122, 52 | Texto de estados completados |

### Violeta con transparencia

Base `#7C3AED` (124, 58, 237) con la opacidad aplicada en el panel Transparencia:

| Nombre | Opacidad | Uso |
|---|---|---|
| Partner / Violet fill | 14 % | Fondos de íconos y chips |
| Partner / Violet fill soft | 12 % | Fondos más suaves |
| Partner / Violet border | 15 % | Bordes |

### Superficies y bordes

| Nombre | HEX | RGB | Uso |
|---|---|---|---|
| Partner / Surface tint | `#F5EEFE` | 245, 238, 254 | Fondos de tarjetas tintadas |
| Partner / Border | `#EFE6FB` | 239, 230, 251 | Bordes de tarjetas |
| Partner / Dashed border | `#E4D3F9` | 228, 211, 249 | Bordes punteados, estados vacíos |

### Texto

| Nombre | HEX | RGB | Uso |
|---|---|---|---|
| Partner / Ink | `#2E2A35` | 46, 42, 53 | Texto principal |
| Partner / Ink secondary | `#4A4351` | 74, 67, 81 | Texto de párrafos |
| Partner / Ink muted | `#857D93` | 133, 125, 147 | Texto secundario |
| Partner / Ink faint | `#A89FB0` | 168, 159, 176 | Metadatos |

### Manchas de fondo (blobs)

| Nombre | HEX | RGB |
|---|---|---|
| Partner / Blob peach | `#F4D9C7` | 244, 217, 199 |
| Partner / Blob lavender | `#C9B6F2` | 201, 182, 242 |
| Partner / Blob violet | `#7C3AED` | 124, 58, 237 |

> En la app son círculos grandes con desenfoque. En Illustrator: elipse + Efecto → Estilizar → Desenfocar (o Efecto → Desenfocar → Desenfoque gaussiano).

### Degradados

**Partner** — lineal, AI **−45°** (CSS 135°). Tarjeta principal, CTA, pills.

| Parada | Color | Ubicación |
|---|---|---|
| 1 | `#F0B87A` (240, 184, 122) | 0 % |
| 2 | `#C08FE0` (192, 143, 224) | 45 % |
| 3 | `#5B21B6` (91, 33, 182) | 100 % |

**Fondo de página** — lineal, AI **−45°**. Fondo general del modo partner.

| Parada | Color | Ubicación |
|---|---|---|
| 1 | `#F4E4D6` (244, 228, 214) | 0 % |
| 2 | `#E6D8F0` (230, 216, 240) | 45 % |
| 3 | `#C9B6F2` (201, 182, 242) | 100 % |

**Nota** — lineal, AI **−45°**. Tarjetas de notas y mensajes.

| Parada | Color | Ubicación |
|---|---|---|
| 1 | `#F3EBFD` (243, 235, 253) | 0 % |
| 2 | `#E7D9FA` (231, 217, 250) | 100 % |

---

## 3. Tipografía (compartida)

| Uso | Fuente | Pesos |
|---|---|---|
| Títulos | Plus Jakarta Sans | 500, 600, 700, 800 |
| Texto | Inter | 400, 500, 600, 700 |
| Manuscrita / acentos | Caveat | 600, 700 |

Las tres son gratis en Google Fonts (o activalas desde Adobe Fonts si están disponibles).
