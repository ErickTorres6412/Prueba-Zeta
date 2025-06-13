import { useState } from "react"
import { useRouter } from "next/navigation"
import { categoriasService } from "@/services/index"
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from "@/utils/alerts"

interface CategoriaFormData {
  nombre: string
  descripcion: string
}

interface CategoriaFormErrors extends Partial<CategoriaFormData> {
  general?: string
}

interface UseCategoriaFormReturn {
  categoria: CategoriaFormData
  errors: CategoriaFormErrors
  isSubmitting: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  clearError: (field: keyof CategoriaFormErrors) => void
}

export const useCategoriaForm = (): UseCategoriaFormReturn => {
  const [categoria, setCategoria] = useState<CategoriaFormData>({
    nombre: "",
    descripcion: ""
  })

  const [errors, setErrors] = useState<CategoriaFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

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
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: CategoriaFormErrors = {}
    Object.entries(categoria).forEach(([key, value]) => {
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
    setCategoria((prev) => ({ ...prev, [name]: value }))

    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const clearError = (field: keyof CategoriaFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showErrorAlert("Por favor, corrige los errores en el formulario")
      return
    }

    const confirmed = await showConfirmAlert(
      "¿Crear categoría?",
      "¿Estás seguro de que deseas crear esta categoría?",
      "Sí, crear",
      "Cancelar"
    )

    if (!confirmed) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const token = localStorage.getItem("token") || ""
      const categoriaData = {
        nombre: categoria.nombre.trim(),
        descripcion: categoria.descripcion.trim()
      }

      await categoriasService.crearCategoria(categoriaData, token)

      await showSuccessAlert("¡Categoría creada!", "La categoría se ha creado exitosamente")
      router.push("/dashboard/categorias/visualizar")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al crear la categoría"
      await showErrorAlert("Error al crear categoría", errorMessage)
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    categoria,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    clearError
  }
}
