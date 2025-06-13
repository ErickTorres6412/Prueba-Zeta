"use client"

import type React from "react"
import { Button } from "@/components/ui/Button"
import { FormInput } from "@/components/ui/Input"
import { useProductForm } from "@/hooks/Productos/useProductForm"
import { 
  Package, 
  DollarSign, 
  Image, 
  Tag, 
  FileText 
} from "lucide-react"

export const AgregarProductosForm: React.FC = () => {
  const {
    product,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  } = useProductForm()

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Crear Producto
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Complete los campos para agregar un nuevo producto al inventario
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 font-medium">Error al crear producto</p>
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
              {isSubmitting ? "Creando producto..." : "Crear Producto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}