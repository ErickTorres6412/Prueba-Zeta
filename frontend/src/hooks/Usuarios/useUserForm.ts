// hooks/useUserForm.ts
import { useState } from "react"
import { useRouter } from "next/navigation"
import { usuariosService } from "@/services/index"
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from "@/utils/alerts"
import { CrearUsuario } from "@/types/user"

interface UserFormErrors extends Partial<CrearUsuario> {
  general?: string
}

interface UseUserFormReturn {
  user: CrearUsuario
  errors: UserFormErrors
  isSubmitting: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  clearError: (field: keyof UserFormErrors) => void
}

export const useUserForm = (): UseUserFormReturn => {
  const [user, setUser] = useState<CrearUsuario>({
    nombre: "",
    apellidos: "",
    email: "",
    username: "",
    password: "",
    role: "",
  })

  const [errors, setErrors] = useState<UserFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "nombre":
      case "apellidos":
        if (!value.trim()) return `El ${name} es requerido`
        if (value.length < 2) return `${name} debe tener al menos 2 caracteres`
        break

      case "email":
        if (!value.trim()) return "El email es requerido"
        if (!/\S+@\S+\.\S+/.test(value)) return "El email no es válido"
        break

      case "username":
        if (!value.trim()) return "El username es requerido"
        if (value.length < 5) return "El username debe tener al menos 5 caracteres"
        break

      case "password":
        if (!value) return "La contraseña es requerida"
        if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres"
        break

      case "role":
        if (!value) return "El rol es requerido"
        if (!["admin", "user"].includes(value)) return "Rol no válido"
        break
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: UserFormErrors = {}
    Object.entries(user).forEach(([key, value]) => {
      const error = validateField(key, String(value))
      if (error) (newErrors as any)[key] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))

    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
    
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const clearError = (field: keyof UserFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showErrorAlert("Formulario inválido", "Por favor corrige los errores.")
      return
    }

    const confirmed = await showConfirmAlert(
      "¿Crear usuario?",
      "¿Estás seguro que deseas registrar este usuario?",
      "Sí, crear",
      "Cancelar"
    )

    if (!confirmed) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const token = localStorage.getItem("token") || ""

      await usuariosService.crearUsuario(user, token)

      await showSuccessAlert("¡Usuario creado!", "El usuario se registró exitosamente.")
      router.push("/dashboard/usuarios/visualizar")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      await showErrorAlert("Error", errorMessage)
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    user,
    errors,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    clearError,
  }
}