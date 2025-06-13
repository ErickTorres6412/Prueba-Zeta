// hooks/useProductForm.ts
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { productosService, categoriasService } from "@/services/index"
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from "@/utils/alerts"
import { categoria } from "@/types/categoria"

interface ProductFormData {
  nombre: string
  descripcion: string
  precio: string
  url_imagen: string
  categoria_id: string // Cambiar a categoria_id para coincidir con el backend
}

interface ProductFormErrors extends Partial<ProductFormData> {
  general?: string
}

interface UseProductFormReturn {
  product: ProductFormData
  errors: ProductFormErrors
  isSubmitting: boolean
  categorias: categoria[]
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void // Nueva función para selects
  handleSubmit: (e: React.FormEvent) => Promise<void>
  clearError: (field: keyof ProductFormErrors) => void
}

export const useProductForm = (): UseProductFormReturn => {
  const [product, setProduct] = useState<ProductFormData>({
    nombre: "",
    descripcion: "",
    precio: "",
    url_imagen: "",
    categoria_id: "", // Cambiar a categoria_id
  })

  const [errors, setErrors] = useState<ProductFormErrors>({})
  const [categorias, setCategorias] = useState<categoria[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token") || ""
        const resp = await categoriasService.getCategorias(token)
        if (!resp.error) {
          setCategorias(resp.body)
        }
      } catch (err) {
        console.error("Error cargando categorías", err)
        showErrorAlert("Error", "No se pudieron cargar las categorías")
      }
    })()
  }, [])

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
      
      case "categoria_id":
        if (!value || value === "") return "La categoría es requerida"
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
    const newErrors: ProductFormErrors = {}
    
    Object.entries(product).forEach(([key, value]) => {
      const error = validateField(key, String(value))
      if (error) {
        (newErrors as any)[key] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))

    // Validación en tiempo real
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  // Nueva función para manejar cambios en selects
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))

    // Validación en tiempo real
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const clearError = (field: keyof ProductFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showErrorAlert("Por favor, corrige los errores en el formulario")
      return
    }

    // Mostrar confirmación antes de crear el producto
    const confirmed = await showConfirmAlert(
      "¿Crear producto?",
      "¿Estás seguro de que deseas crear este producto?",
      "Sí, crear",
      "Cancelar"
    )

    if (!confirmed) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const token = localStorage.getItem("token") || ""
      const productData = { 
        nombre: product.nombre.trim(),
        descripcion: product.descripcion.trim(),
        precio: Number(product.precio),
        categoria_id: Number(product.categoria_id),
        url_imagen: product.url_imagen.trim() || undefined
      }
      
      await productosService.crearProducto(productData, token)

      await showSuccessAlert(
        "¡Producto creado!",
        "El producto se ha creado exitosamente"
      )

      router.push("/dashboard/productos/visualizar")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al crear el producto"
      await showErrorAlert("Error al crear producto", errorMessage)
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
    handleInputChange,
    handleSelectChange, 
    handleSubmit,
    clearError,
  }
}