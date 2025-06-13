"use client"

import type React from "react"
import { Button } from "@/components/ui/Button"
import { FormInput } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { useRegisterForm } from "@/hooks/Auth/useRegisterForm"
import { 
  User, 
  Mail, 
  Lock, 
  UserPlus,
  Eye,
  EyeOff
} from "lucide-react"

export const RegisterForm: React.FC = () => {
  const {
    credentials,
    errors,
    isSubmitting,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
    handleLoginRedirect
  } = useRegisterForm()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-md">
        {/* Logo y branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mb-4 relative overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="2" y1="20" x2="22" y2="20"></line>
            </svg>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-blue-300 opacity-20 rounded-full"></div>
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-purple-300 opacity-20 rounded-full"></div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">TechStore</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
              <UserPlus className="w-6 h-6 text-blue-600" />
              Crear Cuenta
            </h2>
            <p className="text-center text-gray-500 text-sm mt-1">
              Únete a TechStore y descubre la mejor tecnología
            </p>
          </div>

          <div className="px-6 pt-4">
            <form onSubmit={handleSubmit}>
              {errors.general && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-700 font-medium">Error al crear cuenta</p>
                  </div>
                  <p className="text-sm text-red-600 mt-1">{errors.general}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="h-[18px] w-[18px]" />
                  </div>
                  <FormInput
                    label=""
                    type="text"
                    name="nombre"
                    value={credentials.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    disabled={isSubmitting}
                    className="pl-10 h-12 bg-gray-50 border rounded-lg"
                    error={errors.nombre}
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="h-[18px] w-[18px]" />
                  </div>
                  <FormInput
                    label=""
                    type="text"
                    name="apellidos"
                    value={credentials.apellidos}
                    onChange={handleInputChange}
                    placeholder="Apellidos"
                    disabled={isSubmitting}
                    className="pl-10 h-12 bg-gray-50 border rounded-lg"
                    error={errors.apellidos}
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="h-[18px] w-[18px]" />
                  </div>
                  <FormInput
                    label=""
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleInputChange}
                    placeholder="Correo electrónico"
                    disabled={isSubmitting}
                    className="pl-10 h-12 bg-gray-50 border rounded-lg"
                    error={errors.email}
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <UserPlus className="h-[18px] w-[18px]" />
                  </div>
                  <FormInput
                    label=""
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    placeholder="Nombre de usuario"
                    disabled={isSubmitting}
                    className="pl-10 h-12 bg-gray-50 border rounded-lg"
                    error={errors.username}
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="h-[18px] w-[18px]" />
                  </div>
                  <FormInput
                    label=""
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Contraseña"
                    disabled={isSubmitting}
                    className="pl-10 pr-10 h-12 bg-gray-50 border rounded-lg"
                    error={errors.password}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Indicadores de fortaleza de contraseña */}
              {credentials.password && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-600">Requisitos de contraseña:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${credentials.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={`text-xs ${credentials.password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                        Mínimo 6 caracteres
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${/(?=.*[a-z])/.test(credentials.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={`text-xs ${/(?=.*[a-z])/.test(credentials.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        Una letra minúscula
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${/(?=.*[A-Z])/.test(credentials.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={`text-xs ${/(?=.*[A-Z])/.test(credentials.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        Una letra mayúscula
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${/(?=.*\d)/.test(credentials.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={`text-xs ${/(?=.*\d)/.test(credentials.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        Un número
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mt-6"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>
          </div>

          <div className="px-6 pt-4 pb-6">
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <button 
                  onClick={handleLoginRedirect}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  disabled={isSubmitting}
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}