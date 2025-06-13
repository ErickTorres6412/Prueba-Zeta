// hooks/useEditProductForm.ts
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { productosService } from "@/services/index"
import { showConfirmAlert, showSuccessAlert, showErrorAlert, showLoadingAlert, closeAlert } from "@/utils/alerts"

interface EditProductFormData {
  id: number
  nombre: string
  descripcion: string
  precio: string
  url_imagen: string
  categoria: string
}

interface EditProductFormErrors extends Partial<Omit<EditProductFormData, 'id'>> {
  general?: string
}

interface UseEditProductFormReturn {
  product: EditProductFormData
  errors: EditProductFormErrors
  isSubmitting: boolean
  isLoading: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  clearError: (field: keyof EditProductFormErrors) => void
}

export const useEditProductForm = (productId: number): UseEditProductFormReturn => {
  const [product, setProduct] = useState<EditProductFormData>({
    id: 0,
    nombre: "",
    descripcion: "",
    precio: "",
    url_imagen: "",
    categoria: "",
  })

  const [errors, setErrors] = useState<EditProductFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Validaciones (reutilizamos la misma lógica del hook de crear)
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "nombre":
        if (!value.trim()) return "El nombre es requerido"
        if (value.trim().length < 3) return "El nombre debe tener al menos 3 caracteres"
        if (value.trim().length > 100) return "El nombre no puede exceder 100 caracteres"
        break
      
      case "descripcion":
        if (!value.trim()) return "La descripción es requerida"
        if (value.trim().length < 10) return "La descripción debe tener al menos 10 caracteres"
        if (value.trim().length > 500) return "La descripción no puede exceder 500 caracteres"
        break
      
      case "precio":
        if (!value) return "El precio es requerido"
        const precio = Number(value)
        if (isNaN(precio)) return "El precio debe ser un número válido"
        if (precio <= 0) return "El precio debe ser mayor a 0"
        if (precio > 999999.99) return "El precio no puede exceder $999,999.99"
        break
      
      case "categoria":
        if (!value.trim()) return "La categoría es requerida"
        if (value.trim().length < 2) return "La categoría debe tener al menos 2 caracteres"
        if (value.trim().length > 50) return "La categoría no puede exceder 50 caracteres"
        break
      
      case "url_imagen":
        if (value && !isValidUrl(value)) return "La URL de la imagen no es válida"
        break
    }
    return undefined
  }

  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === "http:" || urlObj.protocol === "https:"
    } catch {
      return false
    }
  }

  const validateForm = (): boolean => {
    const newErrors: EditProductFormErrors = {}
    
    // Excluimos 'id' de la validación
    const fieldsToValidate = Object.entries(product).filter(([key]) => key !== 'id')
    
    fieldsToValidate.forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) {
        newErrors[key as keyof Omit<EditProductFormData, 'id'>] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Cargar producto al montar el componente
  useEffect(() => {
    const cargarProducto = async () => {
      if (!productId || productId <= 0) {
        setErrors({ general: "ID de producto inválido" })
        setIsLoading(false)
        return
      }

      try {
        showLoadingAlert("Cargando producto...", "Obteniendo información del producto")
        
        const token = localStorage.getItem("token") || ""
        const data = await productosService.getProductosById(productId, token)

        const producto = Array.isArray(data.body) ? data.body[0] : data.body

        if (!producto) {
          throw new Error("Producto no encontrado")
        }

        setProduct({
          id: producto.id,
          nombre: producto.nombre || "",
          descripcion: producto.descripcion || "",
          precio: producto.precio?.toString() || "",
          url_imagen: producto.url_imagen || "",
          categoria: producto.categoria || "",
        })

        closeAlert()
      } catch (error) {
        closeAlert()
        const errorMessage = error instanceof Error ? error.message : "Error al cargar el producto"
        setErrors({ general: errorMessage })
        await showErrorAlert("Error al cargar", errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    cargarProducto()
  }, [productId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))

    // Validación en tiempo real
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const clearError = (field: keyof EditProductFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showErrorAlert("Formulario incompleto", "Por favor, corrige los errores en el formulario")
      return
    }

    // Mostrar confirmación antes de actualizar
    const confirmed = await showConfirmAlert(
      "¿Actualizar producto?",
      "¿Estás seguro de que deseas guardar los cambios realizados?",
      "Sí, actualizar",
      "Cancelar"
    )

    if (!confirmed) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const token = localStorage.getItem("token") || ""
      const updatedProduct = { 
        ...product, 
        precio: Number(product.precio),
        // Limpiar espacios en blanco
        nombre: product.nombre.trim(),
        descripcion: product.descripcion.trim(),
        categoria: product.categoria.trim(),
        url_imagen: product.url_imagen.trim()
      }
      
      console.log("Producto a actualizar:", updatedProduct)
      await productosService.actualizarProducto(updatedProduct, token)

      await showSuccessAlert(
        "¡Producto actualizado!",
        "Los cambios se han guardado exitosamente"
      )

      router.push("/dashboard/productos/visualizar")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al actualizar el producto"
      await showErrorAlert("Error al actualizar", errorMessage)
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    product,
    errors,
    isSubmitting,
    isLoading,
    handleInputChange,
    handleSubmit,
    clearError
  }
}