"use client"

import type React from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { FormInput } from "@/components/ui/Input"
import { useEditProductForm } from "@/hooks/Productos/useEditProductForm"
import { 
  Package, 
  DollarSign, 
  Image, 
  Tag, 
  FileText,
  ArrowLeft,
  Save
} from "lucide-react"

export const EditarProductosForm: React.FC = () => {
  const params = useParams()
  const id = Number(params?.id)

  const {
    product,
    errors,
    isSubmitting,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useEditProductForm(id)

  // Estado de carga
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando producto...</p>
            <p className="text-gray-400 text-sm mt-1">Obteniendo información del producto</p>
          </div>
        </div>
      </div>
    )
  }

  // Error de carga
  if (errors.general && !product.id) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar producto</h3>
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
                <Package className="w-5 h-5 text-blue-600" />
                Editar Producto
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Modifica los campos del producto {product.nombre && `"${product.nombre}"`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">ID del producto</p>
              <p className="text-lg font-semibold text-gray-700">#{product.id}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && product.id && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 font-medium">Error al actualizar producto</p>
              </div>
              <p className="text-sm text-red-600 mt-1">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Nombre del producto"
              name="nombre"
              placeholder="Ej: Smartphone XYZ Pro"
              value={product.nombre}
              onChange={handleInputChange}
              error={errors.nombre}
              disabled={isSubmitting}
              isRequired
              leftIcon={<Package className="w-4 h-4" />}
              helperText="Mínimo 3 caracteres, máximo 100"
            />

            <FormInput
              label="Categoría"
              name="categoria"
              placeholder="Ej: Smartphones, Laptops, Tablets"
              value={product.categoria}
              onChange={handleInputChange}
              error={errors.categoria}
              disabled={isSubmitting}
              isRequired
              leftIcon={<Tag className="w-4 h-4" />}
              helperText="Mínimo 2 caracteres, máximo 50"
            />

            <FormInput
              label="Precio"
              name="precio"
              placeholder="Ej: 599.99"
              type="number"
              step="0.01"
              min="0"
              max="999999.99"
              value={product.precio}
              onChange={handleInputChange}
              error={errors.precio}
              disabled={isSubmitting}
              isRequired
              leftIcon={<DollarSign className="w-4 h-4" />}
              helperText="Precio en USD (máximo $999,999.99)"
            />

            <FormInput
              label="URL de la imagen"
              name="url_imagen"
              placeholder="https://ejemplo.com/imagen.jpg"
              type="url"
              value={product.url_imagen}
              onChange={handleInputChange}
              error={errors.url_imagen}
              disabled={isSubmitting}
              leftIcon={<Image className="w-4 h-4" />}
              helperText="URL válida que comience con http:// o https://"
            />

            <div className="col-span-full">
              <FormInput
                label="Descripción"
                name="descripcion"
                placeholder="Descripción detallada del producto, características principales, beneficios..."
                value={product.descripcion}
                onChange={handleInputChange}
                error={errors.descripcion}
                disabled={isSubmitting}
                isRequired
                leftIcon={<FileText className="w-4 h-4" />}
                helperText="Mínimo 10 caracteres, máximo 500. Describe las características principales del producto."
              />
            </div>
          </div>

          {/* Preview de imagen si existe URL */}
          {product.url_imagen && !errors.url_imagen && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Vista previa de la imagen:</p>
              <div className="w-32 h-32 border rounded-lg overflow-hidden bg-white">
                <img
                  src={product.url_imagen}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg></div>'
                  }}
                />
              </div>
            </div>
          )}

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
                  Actualizar Producto
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}