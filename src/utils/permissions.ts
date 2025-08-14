import type { Article } from '@/services/articles.service'

interface CurrentUser {
  id: string
  role: string
}

/**
 * Verifica si un usuario puede eliminar un artículo
 * @param article - El artículo a verificar
 * @param currentUser - El usuario actual
 * @returns true si el usuario puede eliminar el artículo
 */
export const canDeleteArticle = (article: Article, currentUser?: CurrentUser): boolean => {
  // Validación básica
  if (!currentUser) {
    console.log('No current user, cannot delete');
    return false;
  }
  
  if (!article) {
    console.log('Article is undefined, cannot delete');
    return false;
  }
  
  // Validación de rol y autoría (consistente con el backend)
  const isAdmin = currentUser.role === 'ADMIN';
  const isAuthor = article.author && article.author.id === currentUser.id;
  
  // Log detallado para debugging
  console.log('Permission check:', {
    userId: currentUser.id,
    userRole: currentUser.role,
    articleId: article.id,
    articleAuthorId: article.author?.id || 'undefined',
    articleAuthorName: article.author?.name || 'undefined',
    isAdmin,
    isAuthor,
    canDelete: isAdmin || isAuthor,
    reason: isAdmin ? 'User is ADMIN' : isAuthor ? 'User is author' : 'No permissions'
  });
  
  return isAdmin || isAuthor;
}

/**
 * Verifica si un usuario puede publicar/despublicar un artículo
 * @param currentUser - El usuario actual
 * @returns true si el usuario puede publicar/despublicar
 */
export const canPublishArticle = (currentUser?: CurrentUser): boolean => {
  if (!currentUser) {
    return false;
  }
  
  // Solo admins y editores pueden publicar/despublicar
  return currentUser.role === 'ADMIN' || currentUser.role === 'EDITOR';
}

/**
 * Verifica si un usuario puede editar un artículo
 * @param article - El artículo a verificar
 * @param currentUser - El usuario actual
 * @returns true si el usuario puede editar el artículo
 */
export const canEditArticle = (article: Article, currentUser?: CurrentUser): boolean => {
  if (!currentUser || !article) {
    return false;
  }
  
  const isAdmin = currentUser.role === 'ADMIN';
  const isEditor = currentUser.role === 'EDITOR';
  const isAuthor = article.author && article.author.id === currentUser.id;
  
  // Admins pueden editar todo, editores y autores pueden editar sus propios artículos
  return isAdmin || (isEditor && isAuthor) || isAuthor;
}
