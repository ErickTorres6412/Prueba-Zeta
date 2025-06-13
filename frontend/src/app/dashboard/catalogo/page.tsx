'use client';

import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination'; 
import { useCatalogo } from '@/hooks/Catalogo/useCatalogo';

export default function CatalogoPage() {
  const {
    productosParaMostrar,
    productosFiltrados, 
    loading,
    searchTerm,
    selectedCategory,
    categorias,
    setSearchTerm,
    setSelectedCategory,
    agregarAlCarrito,
    limpiarFiltros,
    formatearPrecio,
    tienesFiltrosActivos,
    currentPage,
    totalPages,
    ITEMS_PER_PAGE,
    goToPage,
    goToNextPage,
    goToPrevPage,
    getPageNumbers,
    needsPagination
  } = useCatalogo();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Cálculos para la paginación
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return (
    <div className="space-y-6">
      {/* Header con título y estadísticas */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Catálogo de Productos</h1>
          <p className="text-blue-100 text-lg">Explora nuestra selección de tecnología</p>
          <p className="text-blue-200 text-sm mt-1">
            {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} disponible{productosFiltrados.length !== 1 ? 's' : ''}
            {needsPagination && (
              <span className="ml-2">
                • Página {currentPage} de {totalPages}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="bg-white p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center">
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
                placeholder="Buscar productos..."
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
                <option key={categoria} value={categoria}>{categoria}</option>
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
      </Card>

      {/* Grid de productos */}
      {productosFiltrados.length === 0 ? (
        <Card className="bg-white p-12 text-center">
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
          <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
        </Card>
      ) : (
        <>
          {/* Container principal de productos */}
          <Card className="bg-white shadow-lg overflow-hidden">
            {/* Grid de productos */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosParaMostrar.map(producto => (
                  <div key={producto.id} className="bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="p-6">
                      {/* Imagen del producto */}
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
                        {producto.url_imagen ? (
                          <img
                            src={producto.url_imagen}
                            alt={producto.nombre}
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-gray-400 text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 mx-auto mb-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21,15 16,10 5,21"></polyline>
                            </svg>
                            <p className="text-sm">Sin imagen</p>
                          </div>
                        )}
                      </div>

                      {/* Información del producto */}
                      <div className="space-y-3">
                        <div>
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                            {producto.categoria.nombre}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                            {producto.nombre}
                          </h3>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-3">
                          {producto.descripcion}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <p className="text-2xl font-bold text-green-600">
                              {formatearPrecio(producto.precio)}
                            </p>
                          </div>
                        </div>

                        {/* Botón agregar al carrito */}
                        <button
                          onClick={() => agregarAlCarrito(producto)}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="9" cy="21" r="1"></circle>
                              <circle cx="20" cy="21" r="1"></circle>
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <span>Agregar al carrito</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                totalItems={productosFiltrados.length}
                itemsPerPage={ITEMS_PER_PAGE}
                startIndex={startIndex}
                endIndex={endIndex}
              />
            )}
          </Card>
        </>
      )}
    </div>
  );
}