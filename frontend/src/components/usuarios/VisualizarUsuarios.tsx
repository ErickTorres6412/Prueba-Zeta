// components/VisualizarUsuarios.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/Button"
import { useUsuarios } from "@/hooks/Usuarios/useUsuarios"
import { Pagination } from "@/components/ui/Pagination" // Importa el componente de paginación

export const VisualizarUsuarios: React.FC = () => {
    const {
        usuarios,
        loading,
        handleEditar,
        // Estados de paginación
        currentPage,
        totalPages,
        ITEMS_PER_PAGE,
        goToPage,
        goToNextPage,
        goToPrevPage,
        getPageNumbers,
        needsPagination,
        startIndex,
        endIndex,
        totalItems
    } = useUsuarios()

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-4 border-t-blue-600"></div>
                    <p className="text-sm text-gray-500 animate-pulse">Cargando usuarios...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Listado de Usuarios</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Nombre</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Apellido</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usuarios.slice(startIndex, endIndex).map((usuario) => (
                            <tr key={usuario.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 font-medium text-gray-800">{usuario.nombre}</td>
                                <td className="px-6 py-4">{usuario.apellidos}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{usuario.email}</td>
                                <td className="px-6 py-4 text-sm space-x-3">
                                    <Button
                                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md shadow-sm transition-all font-medium"
                                        onClick={() => handleEditar(usuario.id)}
                                    >
                                        Editar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Componente de paginación */}
            {needsPagination && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    onNextPage={goToNextPage}
                    onPrevPage={goToPrevPage}
                    getPageNumbers={getPageNumbers}
                    totalItems={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    startIndex={startIndex}
                    endIndex={endIndex}
                />
            )}

        </div>
    )
}