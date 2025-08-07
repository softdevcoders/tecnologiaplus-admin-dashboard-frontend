/**
 * Utilidades para manejar URLs de Cloudinary con transformaciones
 */

export interface CloudinaryTransformOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpg' | 'png'
  crop?: 'scale' | 'fill' | 'fit'
}

/**
 * Extraer public ID de una URL de Cloudinary
 */
export function getPublicId(url: string): string {
  const match = url.match(/\/v\d+\/([^/]+)$/)

  
return match ? match[1] : ''
}

/**
 * Extraer la URL base de Cloudinary (hasta /image/upload inclusive)
 */
export function getBaseUrl(url: string): string {
  const match = url.match(/(.*\/image\/upload)/)

  return match ? match[1] : url
}

/**
 * Generar URL con transformaciones de Cloudinary
 */
export function getTransformedUrl(baseUrl: string, options: CloudinaryTransformOptions = {}): string {
  const { width, height, quality = 80, format = 'webp', crop = 'scale' } = options

  const publicId = getPublicId(baseUrl)
  const baseUrlWithoutPublicId = getBaseUrl(baseUrl)

  // Si no hay transformaciones, devolver la URL original
  if (!width && !height && !crop && quality === 80 && format === 'webp') {
    return baseUrl
  }

  // Construir transformaciones
  const transformations: string[] = []

  if (crop) {
    transformations.push(`c_${crop}`)
  }

  if (width) {
    transformations.push(`w_${width}`)
  }

  if (height) {
    transformations.push(`h_${height}`)
  }

  if (quality) {
    transformations.push(`q_${quality}`)
  }

  if (format) {
    transformations.push(`f_${format}`)
  }

  const transformationString = transformations.join(',')

  // Construir URL final
  return `${baseUrlWithoutPublicId}/${transformationString}/v1754414736/${publicId}`
}

/**
 * Generar elemento picture completo con responsive images
 */
export function generatePictureElement(
  baseUrl: string,
  publicId: string,
  alt: string,
  options: {
    desktopWidth?: number
    tabletWidth?: number
    mobileWidth?: number
    fallbackWidth?: number
  } = {}
): string {
  const { desktopWidth = 1000, tabletWidth = 600, mobileWidth = 400, fallbackWidth = 800 } = options

  const baseUrlWithoutPublicId = getBaseUrl(baseUrl)

  return `
    <picture>
      <source 
        media="(min-width: 900px)"
        srcset="${baseUrlWithoutPublicId}/c_scale,q_80,f_webp,w_${desktopWidth}/${publicId}"
        type="image/webp"
      />
      <source 
        media="(min-width: 600px)"
        srcset="${baseUrlWithoutPublicId}/c_scale,q_80,f_webp,w_${tabletWidth}/${publicId}"
        type="image/webp"
      />
      <source 
        media="(min-width: 0px)"
        srcset="${baseUrlWithoutPublicId}/c_scale,q_80,f_webp,w_${mobileWidth}/${publicId}"
        type="image/webp"
      />
      <img
        src="${baseUrlWithoutPublicId}/c_scale,q_80,f_webp,w_${fallbackWidth}/${publicId}"
        alt="${alt}"
        loading="lazy"
      />
    </picture>
  `
}

/**
 * Validar si una URL es de Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com')
}

/**
 * Obtener URL optimizada para diferentes contextos
 */
export function getOptimizedUrl(
  baseUrl: string,
  context: 'cover' | 'content' | 'thumbnail' | 'original' = 'original'
): string {
  const options: Record<string, CloudinaryTransformOptions> = {
    cover: { width: 1200, height: 630, crop: 'fill' },
    content: { width: 800, crop: 'scale' },
    thumbnail: { width: 300, height: 200, crop: 'fill' },
    original: {} // Sin transformaciones - calidad original
  }

  return getTransformedUrl(baseUrl, options[context])
}
