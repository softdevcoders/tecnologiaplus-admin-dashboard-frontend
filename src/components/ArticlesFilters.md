# ArticlesFilters Component

## Descripción

Componente de filtros avanzados para la gestión de artículos que permite filtrar por múltiples criterios con una interfaz colapsable.

## Características

### 🎯 **Filtros Básicos (Siempre visibles)**
- **Búsqueda general**: Busca en título, resumen y contenido
- **Filtro por estado**: Publicados, Borradores, Todos
- **Filtro por categoría**: Todas las categorías disponibles
- **Botón de aplicar filtros**
- **Toggle para expandir/colapsar filtros avanzados**

### 🔍 **Filtros Avanzados (Colapsables)**
- **Búsqueda específica**:
  - Buscar en título
  - Buscar en resumen  
  - Buscar en contenido

- **Filtros por autor**:
  - Selección de autor

- **Rango de fechas**:
  - Fecha desde
  - Fecha hasta

- **Ordenamiento**:
  - Ordenar por: Fecha de creación, Fecha de actualización, Título
  - Orden: Ascendente, Descendente

### 🎨 **Características de UX**
- **Indicador de filtros activos**: Muestra cuántos filtros están aplicados
- **Botón para limpiar todos los filtros**
- **Animación suave** del collapse
- **Responsive design** para móviles y desktop
- **Integración con DatePickers** de Material-UI

## Props

```typescript
interface ArticlesFiltersProps {
  filters: ArticlesFiltersState
  onFiltersChange: (filters: ArticlesFiltersState) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  categories?: Array<{ id: string; label: string }>
  authors?: Array<{ id: string; name: string }>
  loading?: boolean
}
```

## Estado de Filtros

```typescript
interface ArticlesFiltersState {
  // Búsqueda por palabras clave
  keywordSearch: string
  
  // Filtros específicos
  titleSearch: string
  summarySearch: string
  contentSearch: string
  
  // Filtros de estado y categoría
  isPublished: string
  categoryId: string
  
  // Filtros de autor
  authorId: string
  
  // Filtros de fecha
  dateFrom: Date | null
  dateTo: Date | null
  
  // Ordenamiento
  sortBy: string
  sortOrder: string
}
```

## Uso

```tsx
import ArticlesFilters, { ArticlesFiltersState } from '@/components/ArticlesFilters'

const [filters, setFilters] = useState<ArticlesFiltersState>({
  keywordSearch: '',
  titleSearch: '',
  summarySearch: '',
  contentSearch: '',
  isPublished: '',
  categoryId: '',
  authorId: '',
  dateFrom: null,
  dateTo: null,
  sortBy: 'createdAt',
  sortOrder: 'desc',
})

const handleApplyFilters = () => {
  // Lógica para aplicar filtros a la API
}

const handleClearFilters = () => {
  // Lógica para limpiar filtros
}

<ArticlesFilters
  filters={filters}
  onFiltersChange={setFilters}
  onApplyFilters={handleApplyFilters}
  onClearFilters={handleClearFilters}
  loading={loading}
  categories={categories}
  authors={authors}
/>
```

## Dependencias

- `@mui/material`: Componentes de UI
- `@mui/x-date-pickers`: DatePickers para rangos de fecha
- `date-fns`: Manejo de fechas
- `react`: Hooks y estado

## Notas de Implementación

### 🔧 **Pendiente de API**
- Los filtros de categorías y autores están preparados pero requieren datos de la API
- Los filtros de fecha necesitan soporte en el backend
- Los filtros específicos (título, resumen, contenido) necesitan implementación en la API

### 🎯 **Próximos Pasos**
1. Crear servicios para obtener categorías y autores
2. Actualizar la API para soportar todos los filtros
3. Implementar filtros de fecha en el backend
4. Agregar validación de rangos de fecha
5. Implementar búsqueda avanzada en el backend

## Estilos

El componente utiliza Material-UI con:
- **Cards** para el contenedor principal
- **Collapse** para la animación de filtros avanzados
- **Grid** para layout responsive
- **DatePickers** con localización en español
- **Chips** para mostrar filtros activos
- **Iconos Remix** para consistencia visual 