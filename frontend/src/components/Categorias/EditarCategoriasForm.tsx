"use client"

import type React from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { FormInput } from "@/components/ui/Input"
import { useEditCategoriaForm } from "@/hooks/Categorias/useEditCategoriaForm"
import { 
  Tag,
  FileText,
  ArrowLeft,
  Save
} from "lucide-react"

export const EditarCategoriasForm: React.FC = () => {
  const params = useParams()
  const id = Number(params?.id)

  const {
    categoria,
    errors,
    isSubmitting,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useEditCategoriaForm(id)

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando categoría...</p>
            <p className="text-gray-400 text-sm mt-1">Obteniendo información de la categoría</p>
          </div>
        </div>
      </div>
    )
  }

  if (errors.general && !categoria.id) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar categoría</h3>
          <p className="text-gray-600 mb-4">{errors.general}</p>
          <Button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                Editar Categoría
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Modifica los campos de la categoría {categoria.nombre && `"${categoria.nombre}"`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">ID de la categoría</p>
              <p className="text-lg font-semibold text-gray-700">#{categoria.id}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && categoria.id && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 font-medium">Error al actualizar categoría</p>
              </div>
              <p className="text-sm text-red-600 mt-1">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Nombre"
              name="nombre"
              placeholder="Ej: Electrónica"
              value={categoria.nombre}
              onChange={handleInputChange}
              error={errors.nombre}
              disabled={isSubmitting}
              isRequired
              leftIcon={<Tag className="w-4 h-4" />}
              helperText="Entre 2 y 50 caracteres"
            />

            <FormInput
              label="Descripción"
              name="descripcion"
              placeholder="Ej: Categoría para productos electrónicos"
              value={categoria.descripcion}
              onChange={handleInputChange}
              error={errors.descripcion}
              disabled={isSubmitting}
              leftIcon={<FileText className="w-4 h-4" />}
              helperText="Máximo 255 caracteres"
            />
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => window.history.back()}
              className="px-5 py-2 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Actualizando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Actualizar Categoría
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
