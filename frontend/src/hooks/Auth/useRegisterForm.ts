// hooks/Auth/useRegisterForm.ts
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/index"
import { RegisterCredentials } from "@/types/auth"
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from "@/utils/alerts"

interface RegisterFormErrors extends Partial<RegisterCredentials> {
  general?: string
}

interface UseRegisterFormReturn {
  credentials: RegisterCredentials
  errors: RegisterFormErrors
  isSubmitting: boolean
  showPassword: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  togglePasswordVisibility: () => void
  clearError: (field: keyof RegisterFormErrors) => void
  handleLoginRedirect: () => void
}

export const useRegisterForm = (): UseRegisterFormReturn => {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    nombre: "",
    apellidos: "",
    email: "",
    username: "",
    password: "",
  })

  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

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
        if (value.trim().length > 50) return "Los apellidos no pueden exceder 50 caracteres"
        break
      
      case "email":
        if (!value.trim()) return "El email es requerido"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "El formato del email no es válido"
        break
      
      case "username":
        if (!value.trim()) return "El nombre de usuario es requerido"
        if (value.trim().length < 3) return "El nombre de usuario debe tener al menos 3 caracteres"
        if (value.trim().length > 30) return "El nombre de usuario no puede exceder 30 caracteres"
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return "El nombre de usuario solo puede contener letras, números y guiones bajos"
        break
      
      case "password":
        if (!value.trim()) return "La contraseña es requerida"
        if (value.length < 6) return "La contraseña debe tener al menos 6 caracteres"
        if (value.length > 100) return "La contraseña no puede exceder 100 caracteres"
        if (!/(?=.*[a-z])/.test(value)) return "La contraseña debe contener al menos una letra minúscula"
        if (!/(?=.*[A-Z])/.test(value)) return "La contraseña debe contener al menos una letra mayúscula"
        if (!/(?=.*\d)/.test(value)) return "La contraseña debe contener al menos un número"
        break
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {}
    
    Object.entries(credentials).forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) {
        newErrors[key as keyof RegisterCredentials] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))

    // Validación en tiempo real
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const clearError = (field: keyof RegisterFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLoginRedirect = () => {
    router.push("/login")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showErrorAlert("Por favor, corrige los errores en el formulario")
      return
    }

    // Mostrar confirmación antes de crear la cuenta
    const confirmed = await showConfirmAlert(
      "¿Crear cuenta?",
      "¿Estás seguro de que deseas crear esta cuenta?",
      "Sí, crear cuenta",
      "Cancelar"
    )

    if (!confirmed) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const userData = {
        ...credentials,
        // Limpiar espacios en blanco
        nombre: credentials.nombre.trim(),
        apellidos: credentials.apellidos.trim(),
        email: credentials.email.trim().toLowerCase(),
        username: credentials.username.trim().toLowerCase(),
        password: credentials.password
      }

      await authService.register(userData)

      await showSuccessAlert(
        "¡Cuenta creada exitosamente!",
        "Tu cuenta ha sido creada. Ahora puedes iniciar sesión."
      )

      router.push("/login")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al crear la cuenta"
      await showErrorAlert("Error al crear cuenta", errorMessage)
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    credentials,
    errors,
    isSubmitting,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
    clearError,
    handleLoginRedirect
  }
}