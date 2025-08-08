import Image from 'next/image'

import type { Metadata } from 'next'

import wip from '@/assets/wip.svg'

export const metadata: Metadata = {
  title: 'Etiquetas - Panel de Administración',
  description: 'Gestiona las etiquetas de artículos del sitio web'
}

export default function EtiquetasPage() {
  return (
    <div className="p-6">
      {/* Work in Progress Content */}
      <div className="flex items-center justify-center py-16">
        <div className="max-w-md w-full text-center">
          {/* Ilustración */}
          <div className="mb-8">
            <Image
              src={wip}
              alt="Trabajo en progreso"
              width={500}
              height={300}
              className="mx-auto"
            />
          </div>

          {/* Contenido */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                Etiquetas
              </h1>
              <p className="text-gray-500 text-lg">
                Próximamente disponible
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <p className="text-gray-600 mb-6 leading-relaxed">
                La gestión de etiquetas está siendo desarrollada. 
                Esta funcionalidad te permitirá organizar mejor tu contenido.
              </p>
            </div>

            {/* Botón simple */}
            <div className="pt-4">
              <a
                href="/articulos"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className="ri-arrow-left-line"></i>
                <span>Volver a artículos</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
