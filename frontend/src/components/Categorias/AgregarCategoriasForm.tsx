"use client"

import type React from "react"
import { Button } from "@/components/ui/Button"
import { FormInput } from "@/components/ui/Input"
import { useCategoriaForm } from "@/hooks/Categorias/useCategoriaForm"
import { Package, FileText } from "lucide-react"

export const AgregarCategoriasForm: React.FC = () => {
  const {
    categoria,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    clearError
  } = useCategoriaForm()

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Crear Categoría
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Complete los campos para agregar una nueva categoría
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 font-medium">Error al crear categoría</p>
              </div>
              <p className="text-sm text-red-600 mt-1">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Nombre de la categoría"
              name="nombre"
              placeholder="Ej: Electrónica"
              value={categoria.nombre}
              onChange={handleInputChange}
              error={errors.nombre}
              disabled={isSubmitting}
              isRequired
              leftIcon={<Package className="w-4 h-4" />}
              helperText="Mínimo 3 caracteres, máximo 100"
            />

            <FormInput
              label="Descripción"
              name="descripcion"
              placeholder="Describe brevemente el tipo de productos de esta categoría"
              value={categoria.descripcion}
              onChange={handleInputChange}
              error={errors.descripcion}
              disabled={isSubmitting}
              isRequired
              leftIcon={<FileText className="w-4 h-4" />}
              helperText="Mínimo 10 caracteres, máximo 500"
            />
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => window.history.back()}
              className="px-5 py-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando categoría..." : "Crear Categoría"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
