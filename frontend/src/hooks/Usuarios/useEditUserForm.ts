import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usuariosService } from "@/services/index"
import { showConfirmAlert, showSuccessAlert, showErrorAlert, showLoadingAlert, closeAlert } from "@/utils/alerts"

interface EditUserFormData {
  id: number
  nombre: string
  apellidos: string
  email: string
}

interface EditUserFormErrors extends Partial<Omit<EditUserFormData, 'id'>> {
  general?: string
}

interface UseEditUserFormReturn {
  user: EditUserFormData
  errors: EditUserFormErrors
  isSubmitting: boolean
  isLoading: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  clearError: (field: keyof EditUserFormErrors) => void
}

export const useEditUserForm = (userId: number): UseEditUserFormReturn => {
  const [user, setUser] = useState<EditUserFormData>({
    id: 0,
    nombre: "",
    apellidos: "",
    email: "",
  })

  const [errors, setErrors] = useState<EditUserFormErrors>({})
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
      
      case "apellidos":
        if (!value.trim()) return "Los apellidos son requeridos"
        if (value.trim().length < 2) return "Los apellidos deben tener al menos 2 caracteres"
        if (value.trim().length > 100) return "Los apellidos no pueden exceder 100 caracteres"
        break
      
      case "email":
        if (!value.trim()) return "El email es requerido"
        if (!isValidEmail(value)) return "El email no es válido"
        if (value.trim().length > 100) return "El email no puede exceder 100 caracteres"
        break
    }
    return undefined
  }

  const isValidEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: EditUserFormErrors = {}
    
    // Excluimos 'id' de la validación
    const fieldsToValidate = Object.entries(user).filter(([key]) => key !== 'id')
    
    fieldsToValidate.forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) {
        newErrors[key as keyof Omit<EditUserFormData, 'id'>] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Cargar usuario al montar el componente
  useEffect(() => {
    const cargarUsuario = async () => {
      if (!userId || userId <= 0) {
        setErrors({ general: "ID de usuario inválido" })
        setIsLoading(false)
        return
      }

      try {
        showLoadingAlert("Cargando usuario...", "Obteniendo información del usuario")
        
        const token = localStorage.getItem("token") || ""
        const data = await usuariosService.getUsuarioById(userId, token)

        const usuario = Array.isArray(data.body) ? data.body[0] : data.body

        if (!usuario) {
          throw new Error("Usuario no encontrado")
        }

        setUser({
          id: usuario.id,
          nombre: usuario.nombre || "",
          apellidos: usuario.apellidos || "",
          email: usuario.email || "",
        })

        closeAlert()
      } catch (error) {
        closeAlert()
        const errorMessage = error instanceof Error ? error.message : "Error al cargar el usuario"
        setErrors({ general: errorMessage })
        await showErrorAlert("Error al cargar", errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    cargarUsuario()
  }, [userId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))

    // Validación en tiempo real
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const clearError = (field: keyof EditUserFormErrors) => {
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
      "¿Actualizar usuario?",
      "¿Estás seguro de que deseas guardar los cambios realizados?",
      "Sí, actualizar",
      "Cancelar"
    )

    if (!confirmed) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const token = localStorage.getItem("token") || ""
      const updatedUser = { 
        ...user, 
        // Limpiar espacios en blanco
        nombre: user.nombre.trim(),
        apellidos: user.apellidos.trim(),
        email: user.email.trim()
      }
      
      console.log("Usuario a actualizar:", updatedUser)
      await usuariosService.actualizarUsuario(updatedUser, token)

      await showSuccessAlert(
        "¡Usuario actualizado!",
        "Los cambios se han guardado exitosamente"
      )

      router.push("/dashboard/usuarios/visualizar")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al actualizar el usuario"
      await showErrorAlert("Error al actualizar", errorMessage)
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    user,
    errors,
    isSubmitting,
    isLoading,
    handleInputChange,
    handleSubmit,
    clearError
  }
}