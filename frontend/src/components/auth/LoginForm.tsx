"use client"

import type React from "react"
import { Button } from "@/components/ui/Button"
import { FormInput } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { useLoginForm } from "@/hooks/Auth/useLoginForm"
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Monitor,
  AlertCircle
} from "lucide-react"

export const LoginForm: React.FC = () => {
  const {
    credentials,
    errors,
    isSubmitting,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
    handleRegisterRedirect
  } = useLoginForm()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md">
        {/* Logo y branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mb-4 relative overflow-hidden">
            <Monitor className="h-8 w-8 text-white" />
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-blue-300 opacity-20 rounded-full"></div>
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-purple-300 opacity-20 rounded-full"></div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">TechStore</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-2xl font-bold text-center text-gray-800">Iniciar Sesión</h2>
            <p className="text-center text-gray-500 text-sm">Accede a tu cuenta para continuar</p>
          </div>

          <div className="px-6 pt-4">
            <form onSubmit={handleSubmit}>
              {/* Error general */}
              {errors.general && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-600 font-medium">Error de autenticación</p>
                  </div>
                  <p className="text-sm text-red-600 mt-1">{errors.general}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Campo de usuario */}
                <FormInput
                  label=""
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  placeholder="Nombre de usuario"
                  disabled={isSubmitting}
                  className="pl-10 h-12 bg-gray-50 border rounded-lg"
                  leftIcon={<User className="w-4 h-4" />}
                  error={errors.username}
                />

                {/* Campo de contraseña */}
                <div className="relative">
                  <FormInput
                    label=""
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Contraseña"
                    disabled={isSubmitting}
                    className="pl-10 pr-10 h-12 bg-gray-50 border rounded-lg"
                    leftIcon={<Lock className="w-4 h-4" />}
                    error={errors.password}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Opciones adicionales */}
              <div className="flex items-center justify-between mt-4 mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                    Recordarme
                  </label>
                </div>
                <div className="text-sm">
                  <a 
                    href="#" 
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              {/* Botón de login */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </div>

          {/* Link de registro */}
          <div className="text-center mt-4 pb-6">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <button
                onClick={handleRegisterRedirect}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                disabled={isSubmitting}
              >
                Regístrate
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}