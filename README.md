# MundoFit

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)

Plataforma web desarrollada para **MundoFit GAF**, orientada a la promoción y gestión de servicios de fitness. La aplicación está construida con tecnologías modernas, garantizando rendimiento, escalabilidad y una experiencia de usuario fluida.

---

## Descripción general

MundoFit es una aplicación web de página única (SPA) que permite a los usuarios explorar los servicios, ubicaciones y contactar directamente con el negocio. El contenido es administrable de forma autónoma por el cliente a través de un CMS, sin necesidad de intervención técnica.

---

## Funcionalidades

- Navegación fluida entre secciones sin recargas de página
- Mapa interactivo con ubicaciones del negocio
- Formulario de contacto con envío de correo electrónico automático
- Protección contra spam mediante reCAPTCHA
- Carrusel de imágenes y contenido destacado
- Contenido dinámico administrable desde Contentful CMS
- Optimización SEO para motores de búsqueda
- Diseño responsivo adaptado a dispositivos móviles, tablet y escritorio

---

## Administración de contenido

El proyecto integra **Contentful** como sistema de gestión de contenido. Esto permite al cliente actualizar textos, imágenes y secciones del sitio de forma independiente, sin modificar el código fuente.

---

## Stack tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Frontend | React 19, TypeScript 5.9 |
| Build tool | Vite 7 |
| Estilos | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| Estado global | Zustand 5 |
| Mapas | Leaflet, React Leaflet |
| CMS | Contentful |
| Correo | EmailJS |
| Deploy | Netlify |

---

## Instalación (entorno de desarrollo)
```bash
git clone https://github.com/Leivalgorithms/MundoFitGAF.git
cd MundoFitGAF
npm install
npm run dev
```

> Se requieren las variables de entorno correspondientes a Contentful, EmailJS y reCAPTCHA para el funcionamiento completo.

---

## Despliegue

La aplicación se despliega automáticamente en **Netlify** al realizar cambios en la rama principal. No se requiere intervención manual para publicar actualizaciones.

---

## Desarrollado por

**Leivalgorithms**  
Desarrollo de software a medida  
[github.com/Leivalgorithms](https://github.com/Leivalgorithms)
