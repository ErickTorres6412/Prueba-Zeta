import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { productosService } from "@/services"
import type { Product } from "@/types/product"
import { showConfirmAlert, showSuccessAlert } from "@/utils/alerts"

export function useProductos() {
    // Estados existentes
    const [productos, setProductos] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    // Estados para paginación y filtros
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')

    const ITEMS_PER_PAGE = 10
    const router = useRouter()

    // Cargar productos
    useEffect(() => {
        const cargarProductos = async () => {
            setLoading(true)
            const token = localStorage.getItem("token") || ""
            const response = await productosService.getProductos(token)
            setProductos(response.body)
            setLoading(false)
        }

        cargarProductos()
    }, [])

    const categorias = useMemo(() => {
        const categoriasUnicas = new Map()

        productos.forEach(producto => {
            if (producto.categoria && !categoriasUnicas.has(producto.categoria.id)) {
                categoriasUnicas.set(producto.categoria.id, {
                    id: producto.categoria.id,
                    nombre: producto.categoria.nombre
                })
            }
        })

        return Array.from(categoriasUnicas.values())
    }, [productos])

    // Filtrar productos
    const productosFiltrados = useMemo(() => {
        let productosFilt = productos

        // Filtrar por término de búsqueda
        if (searchTerm) {
            productosFilt = productosFilt.filter(producto =>
                producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filtrar por categoría
        if (selectedCategory) {
            productosFilt = productosFilt.filter(producto =>
                producto.categoria.nombre === selectedCategory
            )
        }

        return productosFilt
    }, [searchTerm, selectedCategory, productos])

    // Cálculos de paginación
    const totalPages = Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const productosParaMostrar = productosFiltrados.slice(startIndex, endIndex)

    // Resetear página cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, selectedCategory])

    // Funciones de paginación
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            // Scroll suave hacia arriba
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const goToNextPage = () => goToPage(currentPage + 1)
    const goToPrevPage = () => goToPage(currentPage - 1)

    // Generar array de páginas para mostrar en paginación
    const getPageNumbers = () => {
        const pageNumbers = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            // Si hay pocas páginas, mostrar todas
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            // Lógica para mostrar páginas con ellipsis
            const startPage = Math.max(1, currentPage - 2)
            const endPage = Math.min(totalPages, currentPage + 2)

            if (startPage > 1) {
                pageNumbers.push(1)
                if (startPage > 2) {
                    pageNumbers.push('...')
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i)
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pageNumbers.push('...')
                }
                pageNumbers.push(totalPages)
            }
        }

        return pageNumbers
    }

    const formatearPrecio = (precio: string | number): string => {
        return new Intl.NumberFormat("es-CR", {
            style: "currency",
            currency: "USD",
        }).format(Number.parseFloat(precio.toString()))
    }

    const handleEditar = (id: number) => {
        router.push(`/dashboard/productos/editar/${id}`)
    }

    const handleEliminar = async (id: number): Promise<void> => {
        const token = localStorage.getItem("token") || ""
        try {
            // Mostrar confirmación antes de crear el producto
            const confirmed = await showConfirmAlert(
                "¿Eliminar producto?",
                "¿Estás seguro de que deseas eliminar este producto?",
                "Sí, eliminar",
                "Cancelar"
            )

            if (!confirmed) return

            await productosService.eliminarProducto({ id }, token)
            setProductos((prev) => prev.filter((p) => p.id !== id))

            await showSuccessAlert(
                "¡Producto eliminado!",
                "El producto se ha eliminado exitosamente"
            )

            // Si después de eliminar la página actual queda vacía, ir a la página anterior
            const newTotalPages = Math.ceil((productosFiltrados.length - 1) / ITEMS_PER_PAGE)
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages)
            }
        } catch (error) {
            console.error("Error al eliminar producto:", error)
        }
    }

    // Función para limpiar filtros
    const limpiarFiltros = () => {
        setSearchTerm('')
        setSelectedCategory('')
        setCurrentPage(1)
    }

    // Verificar si hay filtros activos
    const tienesFiltrosActivos = searchTerm || selectedCategory

    return {
        // Estados originales
        productos: productosParaMostrar, // Ahora retorna los productos paginados
        productosFiltrados, // Para obtener el total
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
        needsPagination: productosFiltrados.length > ITEMS_PER_PAGE,

        // Datos para mostrar información de paginación
        startIndex,
        endIndex,
        totalItems: productosFiltrados.length
    }
}