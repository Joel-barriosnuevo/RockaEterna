# 🤝 Guía de Contribución - Rocka Eterna

¡Gracias por tu interés en contribuir a Rocka Eterna! Esta guía te ayudará a empezar.

## 🚀 Primeros Pasos

### 1. Fork y Clone
```bash
# Fork el repositorio en GitHub, luego:
git clone https://github.com/TU-USERNAME/RockaEterna.git
cd RockaEterna
git remote add upstream https://github.com/Joel-barriosnuevo/RockaEterna.git
```

### 2. Configurar el Entorno
```bash
npm install
npm run dev
```

### 3. Mantener tu Fork Actualizado
```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## 🌿 Flujo de Trabajo con Ramas

### Crear una Nueva Rama
```bash
git checkout main
git pull upstream main
git checkout -b feature/nombre-descriptivo
```

### Tipos de Ramas
- `feature/` - Nuevas funcionalidades
- `fix/` - Corrección de bugs
- `docs/` - Cambios en documentación
- `style/` - Cambios de estilo/formato
- `refactor/` - Refactorización

## ✅ Antes de Hacer un Pull Request

### 1. Verifica el Código
```bash
npm run lint          # Verifica linting
npm run build         # Verifica que compile
npm run preview       # Verifica el build
```

### 2. Commits Limpios
- Usa mensajes descriptivos
- Un commit por cambio lógico
- Sigue el formato: `tipo: descripción`

### 3. Pull Request
1. Push tu rama: `git push origin feature/tu-feature`
2. Ve a GitHub y crea el Pull Request
3. Describe qué cambios hiciste y por qué
4. Incluye screenshots si hay cambios visuales

## 📝 Convenciones de Código

### TypeScript
- Usa tipos explícitos cuando sea necesario
- Prefiere interfaces sobre types para objetos
- Usa nombres descriptivos para variables y funciones

### React
- Componentes funcionales con hooks
- Props tipadas con TypeScript
- Usa camelCase para props y funciones

### CSS/Tailwind
- Prefiere Tailwind classes sobre CSS custom
- Usa las variables CSS definidas para colores
- Mantén consistencia con el sistema de diseño

### Estructura de Archivos
```
src/
├── components/
│   ├── ui/              # Componentes base reutilizables
│   ├── forms/           # Componentes de formularios
│   └── layout/          # Componentes de layout
├── hooks/               # Custom hooks
├── lib/                 # Utilidades
├── types/              # Definiciones de tipos
└── styles/             # Estilos globales
```

## 🎨 Sistema de Diseño

### Colores
- Usa las variables CSS definidas en `index.css`
- Respeta el sistema de temas claro/oscuro
- Consulta `tailwind.config.js` para colores custom

### Componentes
- Basados en shadcn/ui
- Mantén consistencia visual
- Documenta props complejas

## 🐛 Reportar Bugs

Incluye en tu issue:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots/videos si es relevante
- Información del entorno (browser, OS)

## 💡 Sugerir Features

Para nuevas funcionalidades:
- Describe el problema que soluciona
- Propón una solución
- Considera el impacto en usuarios existentes
- Incluye mockups/wireframes si es visual

## 📞 Comunicación

- **Issues**: Para bugs y feature requests
- **Discussions**: Para preguntas generales
- **Pull Requests**: Para contribuciones de código

## ⚡ Tips para Colaboradores

1. **Empieza pequeño**: Issues marcados como "good first issue"
2. **Pregunta antes**: Si no estás seguro, abre un issue para discutir
3. **Mantén el scope pequeño**: Un PR por feature/fix
4. **Documenta cambios**: Actualiza README si es necesario
5. **Sé paciente**: Los reviews pueden tomar tiempo

## 🔄 Proceso de Review

1. **Auto-review**: Revisa tu propio código antes de enviar
2. **CI checks**: Deben pasar todos los checks automáticos
3. **Code review**: Un maintainer revisará tu código
4. **Cambios**: Implementa feedback si es necesario
5. **Merge**: ¡Tu contribución será mergeada!

---

¡Gracias por hacer Rocka Eterna mejor! 🎸✨ 