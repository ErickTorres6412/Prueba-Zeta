// hooks/Categorias/useEditCategoriaForm.ts
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { categoriasService } from "@/services/index"
import {
  showConfirmAlert,
  showSuccessAlert,
  showErrorAlert,
  showLoadingAlert,
  closeAlert,
} from "@/utils/alerts"

interface EditCategoriaFormData {
  id: number
  nombre: string
  descripcion: string
}

interface EditCategoriaFormErrors extends Partial<Omit<EditCategoriaFormData, 'id'>> {
  general?: string
}

interface UseEditCategoriaFormReturn {
  categoria: EditCategoriaFormData
  errors: EditCategoriaFormErrors
  isSubmitting: boolean
  isLoading: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  clearError: (field: keyof EditCategoriaFormErrors) => void
}

export const useEditCategoriaForm = (categoriaId: number): UseEditCategoriaFormReturn => {
  const [categoria, setCategoria] = useState<EditCategoriaFormData>({
    id: 0,
    nombre: "",
    descripcion: "",
  })

  const [errors, setErrors] = useState<EditCategoriaFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Validaciones
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "nombre":
        if (!value.trim()) return "El nombre es requerido"
        if (value.trim().length < 2) return "El nombre debe tener al menos 2 caracteres"
        if (value.trim().length > 50) return "El nombre no puede exceder 50 caracteres"
        break
      case "descripcion":
        if (!value.trim()) return "La descripción es requerida"
        if (value.trim().length < 5) return "La descripción debe tener al menos 5 caracteres"
        if (value.trim().length > 255) return "La descripción no puede exceder 255 caracteres"
        break
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: EditCategoriaFormErrors = {}

    Object.entries(categoria).forEach(([key, value]) => {
      if (key !== 'id') {
        const error = validateField(key, value as string)
        if (error) {
          newErrors[key as keyof Omit<EditCategoriaFormData, 'id'>] = error
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Cargar categoría al montar
  useEffect(() => {
    const cargarCategoria = async () => {
      if (!categoriaId || categoriaId <= 0) {
        setErrors({ general: "ID de categoría inválido" })
        setIsLoading(false)
        return
      }

      try {
        showLoadingAlert("Cargando categoría...", "Obteniendo información de la categoría")

        const token = localStorage.getItem("token") || ""
        const data = await categoriasService.getCategoriaById(categoriaId, token)
        const cat = Array.isArray(data.body) ? data.body[0] : data.body

        if (!cat) throw new Error("Categoría no encontrada")

        setCategoria({
          id: cat.id,
          nombre: cat.nombre || "",
          descripcion: cat.descripcion || "",
        })

        closeAlert()
      } catch (error) {
        closeAlert()
        const errorMessage = error instanceof Error ? error.message : "Error al cargar la categoría"
        setErrors({ general: errorMessage })
        await showErrorAlert("Error al cargar", errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    cargarCategoria()
  }, [categoriaId])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setCategoria((prev) => ({ ...prev, [name]: value }))

    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const clearError = (field: keyof EditCategoriaFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showErrorAlert("Formulario incompleto", "Por favor, corrige los errores en el formulario")
      return
    }

    const confirmed = await showConfirmAlert(
      "¿Actualizar categoría?",
      "¿Estás seguro de que deseas guardar los cambios realizados?",
      "Sí, actualizar",
      "Cancelar"
    )

    if (!confirmed) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const token = localStorage.getItem("token") || ""
      const updatedCategoria = {
        ...categoria,
        nombre: categoria.nombre.trim(),
        descripcion: categoria.descripcion.trim(),
      }

      await categoriasService.actualizarCategoria(updatedCategoria, token)

      await showSuccessAlert(
        "¡Categoría actualizada!",
        "Los cambios se han guardado exitosamente"
      )

      router.push("/dashboard/productos/categorias/visualizar")
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido al actualizar la categoría"
      await showErrorAlert("Error al actualizar", errorMessage)
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    categoria,
    errors,
    isSubmitting,
    isLoading,
    handleInputChange,
    handleSubmit,
    clearError,
  }
}
