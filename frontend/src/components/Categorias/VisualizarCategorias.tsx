"use client"

import React from "react"
import { Button } from "@/components/ui/Button"
import { Pagination } from "@/components/ui/Pagination"
import { useCategorias } from "@/hooks/Categorias/useCategorias"

export const VisualizarCategorias: React.FC = () => {
    const {
        categorias,
        categoriasFiltradas,
        loading,
        handleEditar,
        handleEliminar,
        searchTerm,
        setSearchTerm,
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
    } = useCategorias()

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-4 border-t-blue-600"></div>
                    <p className="text-sm text-gray-500 animate-pulse">Cargando categorías...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Gestión de Categorías</h2>
                <p className="text-purple-100">Gestiona tus categorías de productos</p>
                <p className="text-purple-200 text-sm mt-1">
                    {totalItems} categoría{totalItems !== 1 ? 's' : ''} disponible{totalItems !== 1 ? 's' : ''}
                    {needsPagination && (
                        <span className="ml-2">
                            • Página {currentPage} de {totalPages}
                        </span>
                    )}
                </p>
            </div>

            {/* Búsqueda */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                    <div className="flex-1 w-full md:w-auto">
                        <div className="relative">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 absolute left-3 top-3 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {categoriasFiltradas.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron categorías</h3>
                        <p className="text-gray-500">No hay resultados que coincidan con tu búsqueda</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Descripción
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categorias.map((categoria) => (
                                        <tr key={categoria.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-800">{categoria.nombre}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{categoria.descripcion}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                                <Button
                                                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md shadow-sm transition-all duration-200 font-medium text-sm"
                                                    onClick={() => handleEditar(categoria.id)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition-all duration-200 font-medium text-sm"
                                                    onClick={() => handleEliminar(categoria.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

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
                    </>
                )}
            </div>
        </div>
    )
}