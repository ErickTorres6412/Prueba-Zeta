"use client"

import type React from "react"
import { Button } from "@/components/ui/Button"
import { FormInput } from "@/components/ui/Input"
import { FormSelect } from "@/components/ui/FormSelect"
import { useUserForm } from "@/hooks/Usuarios/useUserForm"
import {
  User,
  AtSign,
  Lock,
  Mail,
  Badge,
  Shield
} from "lucide-react"

export const AgregarUsuarioForm: React.FC = () => {
  const {
    user,
    errors,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
  } = useUserForm()

  const roleOptions = [
    { value: "admin", label: "Administrador" },
    { value: "user", label: "Usuario" },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Registrar Usuario
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Complete los campos para registrar un nuevo usuario en el sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 font-medium">Error al registrar usuario</p>
              </div>
              <p className="text-sm text-red-600 mt-1">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Nombre"
              name="nombre"
              placeholder="Ej: Juan"
              value={user.nombre}
              onChange={handleInputChange}
              error={errors.nombre}
              disabled={isSubmitting}
              isRequired
              leftIcon={<Badge className="w-4 h-4" />}
            />

            <FormInput
              label="Apellidos"
              name="apellidos"
              placeholder="Ej: Pérez González"
              value={user.apellidos}
              onChange={handleInputChange}
              error={errors.apellidos}
              disabled={isSubmitting}
              isRequired
              leftIcon={<Badge className="w-4 h-4" />}
            />

            <FormInput
              label="Correo Electrónico"
              name="email"
              placeholder="Ej: juan@email.com"
              value={user.email}
              onChange={handleInputChange}
              error={errors.email}
              disabled={isSubmitting}
              isRequired
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <FormInput
              label="Nombre de Usuario"
              name="username"
              placeholder="Ej: juanperez"
              value={user.username}
              onChange={handleInputChange}
              error={errors.username}
              disabled={isSubmitting}
              isRequired
              leftIcon={<AtSign className="w-4 h-4" />}
            />

            <FormInput
              label="Contraseña"
              name="password"
              type="password"
              placeholder="********"
              value={user.password}
              onChange={handleInputChange}
              error={errors.password}
              disabled={isSubmitting}
              isRequired
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <FormSelect
              label="Rol"
              name="role"
              value={user.role}
              onChange={handleSelectChange}
              error={errors.role}
              disabled={isSubmitting}
              isRequired
              leftIcon={<Shield className="w-4 h-4" />}
              options={roleOptions}
              placeholder="Selecciona un rol"
            />
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => window.history.back()}
              className="px-5 py-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrando usuario..." : "Registrar Usuario"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
