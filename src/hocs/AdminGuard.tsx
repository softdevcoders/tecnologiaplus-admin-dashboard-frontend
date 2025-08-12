'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';


// Type Imports
import type { ChildrenType } from '@core/types';

// Config Imports
import themeConfig from '@configs/themeConfig';

import { useAuth } from '@/hooks/useAuth';

const AdminGuard = ({ children }: ChildrenType) => {
  const { getSessionInfo, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const currentUser = getSessionInfo().user;
      
      if (!currentUser || currentUser.role !== 'ADMIN') {
        router.push(themeConfig.homePageUrl);
      }
    }
  }, [getSessionInfo, isLoading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Verificando permisos...
      </div>
    );
  }

  // Verificar si el usuario es admin
  const currentUser = getSessionInfo().user;
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return null; // No renderizar nada mientras se redirige
  }

  return <>{children}</>;
};

export default AdminGuard;
