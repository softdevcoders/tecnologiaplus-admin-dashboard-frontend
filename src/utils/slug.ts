/**
 * Genera un slug SEO-friendly a partir de un título
 * @param title - El título del artículo
 * @returns Un slug limpio y optimizado para SEO
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    // Reemplazar caracteres especiales y acentos
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .replace(/^-+|-+$/g, '') // Remover guiones al inicio y final
}

/**
 * Valida si un slug es válido
 * @param slug - El slug a validar
 * @returns true si el slug es válido
 */
export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

/**
 * Genera un slug único agregando un sufijo numérico si es necesario
 * @param baseSlug - El slug base
 * @param existingSlugs - Array de slugs existentes
 * @returns Un slug único
 */
export const generateUniqueSlug = (baseSlug: string, existingSlugs: string[]): string => {
  let uniqueSlug = baseSlug
  let counter = 1

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`
    counter++
  }

  return uniqueSlug
} 