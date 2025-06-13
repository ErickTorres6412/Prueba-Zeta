// components/VisualizarProductos.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/Button"
import { Pagination } from "@/components/ui/Pagination" // Importa el componente de paginación
import { useProductos } from "@/hooks/Productos/useProductos"

export const VisualizarProductos: React.FC = () => {
    const {
        productos,
        productosFiltrados,
        loading,
        formatearPrecio,
        handleEditar,
        handleEliminar,
        // Estados de filtros
        searchTerm,
        selectedCategory,
        categorias,
        setSearchTerm,
        setSelectedCategory,
        limpiarFiltros,
        tienesFiltrosActivos,
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
    } = useProductos()

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-4 border-t-blue-600"></div>
                    <p className="text-sm text-gray-500 animate-pulse">Cargando productos...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header con estadísticas */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Gestión de Productos</h2>
                <p className="text-green-100">Gestiona tu catálogo de productos</p>
                <p className="text-green-200 text-sm mt-1">
                    {totalItems} producto{totalItems !== 1 ? 's' : ''} disponible{totalItems !== 1 ? 's' : ''}
                    {needsPagination && (
                        <span className="ml-2">
                            • Página {currentPage} de {totalPages}
                        </span>
                    )}
                </p>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                    {/* Búsqueda */}
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
                                placeholder="Buscar por nombre, descripción o categoría..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filtro por categoría */}
                    <div className="w-full md:w-auto">
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map(categoria => (
                                <option key={categoria.id} value={categoria.nombre}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botón limpiar filtros */}
                    {tienesFiltrosActivos && (
                        <button
                            onClick={limpiarFiltros}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            {/* Tabla de productos */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {productosFiltrados.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 mx-auto"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron productos</h3>
                        <p className="text-gray-500">
                            {tienesFiltrosActivos
                                ? "Intenta ajustar tus filtros de búsqueda"
                                : "No hay productos disponibles"
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Tabla */}
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
                                            Categoría
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Precio
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {productos.map((producto) => (
                                        <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        {producto.url_imagen ? (
                                                            <img
                                                                className="h-10 w-10 rounded-lg object-cover"
                                                                src={producto.url_imagen}
                                                                alt={producto.nombre}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6 text-gray-400"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1"
                                                                >
                                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                                    <polyline points="21,15 16,10 5,21"></polyline>
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {producto.nombre}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div className="max-w-xs truncate" title={producto.descripcion}>
                                                    {producto.descripcion}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                    {producto.categoria.nombre}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                {formatearPrecio(producto.precio)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                                <Button
                                                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md shadow-sm transition-all duration-200 font-medium text-sm"
                                                    onClick={() => handleEditar(producto.id)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition-all duration-200 font-medium text-sm"
                                                    onClick={() => handleEliminar(producto.id)}
                                                >
                                                    Eliminar
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
                    </>
                )}
            </div>
        </div>
    )
}