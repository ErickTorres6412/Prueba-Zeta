// hooks/useLoginForm.ts
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { showErrorAlert } from "@/utils/alerts"

interface LoginFormData {
  username: string
  password: string
}

interface LoginFormErrors extends Partial<LoginFormData> {
  general?: string
}

interface UseLoginFormReturn {
  credentials: LoginFormData
  errors: LoginFormErrors
  isSubmitting: boolean
  showPassword: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  togglePasswordVisibility: () => void
  clearError: (field: keyof LoginFormErrors) => void
  handleRegisterRedirect: () => void
}

export const useLoginForm = (): UseLoginFormReturn => {
  const [credentials, setCredentials] = useState<LoginFormData>({
    username: "",
    password: "",
  })

  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "username":
        if (!value.trim()) return "El nombre de usuario es requerido"
        if (value.trim().length < 6) return "El nombre de usuario debe tener al menos 6 caracteres"
        break

      case "password":
        if (!value.trim()) return "La contraseña es requerida"
        if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres"
        break
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {}

    Object.entries(credentials).forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) {
        newErrors[key as keyof LoginFormData] = error
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

  const clearError = (field: keyof LoginFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleRegisterRedirect = () => {
    router.push("/register")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      await showErrorAlert(
        "Datos incompletos",
        "Por favor, corrige los errores en el formulario"
      )
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      await login(credentials)
      router.push("/dashboard/catalogo")
    } catch (error: any) {
      let errorMessage = "Error desconocido al iniciar sesión"

      // Verifica si es un error HTTP con respuesta del servidor
      if (error.response && error.response.data) {
        console.error("Error de autenticación:", error.response)
        const data = error.response.data
        if (Array.isArray(data.body)) {
          // Si body es un array de mensajes, los unimos en una sola cadena
          errorMessage = data.body.join("\n")
        } else if (typeof data.body === "string") {
          errorMessage = data.body
        }
      }

      await showErrorAlert("Error de autenticación", errorMessage)

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
    handleRegisterRedirect
  }
}