// hooks/useEditProductForm.ts
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { productosService, categoriasService } from "@/services/index"
import {
  showConfirmAlert,
  showSuccessAlert,
  showErrorAlert,
  showLoadingAlert,
  closeAlert,
} from "@/utils/alerts"
import { categoria } from "@/types/categoria"

interface EditProductFormData {
  id: number
  nombre: string
  descripcion: string
  precio: string
  url_imagen: string
  categoria_id: string
}

interface EditProductFormErrors extends Partial<Omit<EditProductFormData, 'id'>> {
  general?: string
}

interface UseEditProductFormReturn {
  product: EditProductFormData
  errors: EditProductFormErrors
  categorias: categoria[]
  isSubmitting: boolean
  isLoading: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
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
    categoria_id: "",
  })

  const [categorias, setCategorias] = useState<categoria[]>([])
  const [errors, setErrors] = useState<EditProductFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Cargar categorías y producto
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setIsLoading(true)
        showLoadingAlert("Cargando...", "Obteniendo datos del producto y categorías")

        const token = localStorage.getItem("token") || ""

        const [catResp, prodResp] = await Promise.all([
          categoriasService.getCategorias(token),
          productosService.getProductosById(productId, token),
        ])

        if (!catResp.error) setCategorias(catResp.body)

        const producto = Array.isArray(prodResp.body) ? prodResp.body[0] : prodResp.body
        if (!producto) throw new Error("Producto no encontrado")

        setProduct({
          id: producto.id,
          nombre: producto.nombre || "",
          descripcion: producto.descripcion || "",
          precio: producto.precio?.toString() || "",
          url_imagen: producto.url_imagen || "",
          categoria_id: producto.categoria_id?.toString() || "",
        })

        closeAlert()
      } catch (error) {
        closeAlert()
        const errorMessage = error instanceof Error ? error.message : "Error al cargar los datos"
        setErrors({ general: errorMessage })
        await showErrorAlert("Error al cargar", errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    cargarDatos()
  }, [productId])

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "nombre":
        if (!value.trim()) return "El nombre es requerido"
        if (value.trim().length < 3) return "Debe tener al menos 3 caracteres"
        if (value.trim().length > 100) return "No puede exceder 100 caracteres"
        break

      case "descripcion":
        if (!value.trim()) return "La descripción es requerida"
        if (value.trim().length < 10) return "Debe tener al menos 10 caracteres"
        if (value.trim().length > 500) return "No puede exceder 500 caracteres"
        break

      case "precio":
        if (!value) return "El precio es requerido"
        const precio = Number(value)
        if (isNaN(precio)) return "Debe ser un número válido"
        if (precio <= 0) return "Debe ser mayor a 0"
        if (precio > 999999.99) return "No puede exceder $999,999.99"
        break

      case "categoria_id":
        if (!value || value === "") return "La categoría es requerida"
        break

      case "url_imagen":
        if (value && !isValidUrl(value)) return "URL no válida"
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

    Object.entries(product).forEach(([key, value]) => {
      const error = validateField(key, String(value))
      if (error) (newErrors as any)[key] = error
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))

    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))

    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const clearError = (field: keyof EditProductFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showErrorAlert("Formulario incompleto", "Corrige los errores antes de continuar")
      return
    }

    const confirmed = await showConfirmAlert(
      "¿Actualizar producto?",
      "¿Deseas guardar los cambios realizados?",
      "Sí, actualizar",
      "Cancelar"
    )

    if (!confirmed) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const token = localStorage.getItem("token") || ""
      const productData = {
        id: product.id,
        nombre: product.nombre.trim(),
        descripcion: product.descripcion.trim(),
        precio: Number(product.precio),
        categoria_id: Number(product.categoria_id),
        url_imagen: product.url_imagen.trim() || undefined,
      }

      await productosService.actualizarProducto(productData, token)

      await showSuccessAlert("¡Actualizado!", "El producto ha sido actualizado exitosamente")
      router.push("/dashboard/productos/visualizar")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al actualizar"
      await showErrorAlert("Error al actualizar", errorMessage)
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    categorias,
    product,
    errors,
    isSubmitting,
    isLoading,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    clearError,
  }
}
