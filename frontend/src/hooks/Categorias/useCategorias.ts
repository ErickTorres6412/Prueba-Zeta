import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { categoriasService } from "@/services"
import type { categoria } from "@/types/categoria"
import { showConfirmAlert, showSuccessAlert } from "@/utils/alerts"

export function useCategorias() {
  const [categorias, setCategorias] = useState<categoria[]>([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const ITEMS_PER_PAGE = 10
  const router = useRouter()

  // Cargar categorías
  useEffect(() => {
    const cargarCategorias = async () => {
      setLoading(true)
      const token = localStorage.getItem("token") || ""
      const response = await categoriasService.getCategorias(token)
      setCategorias(response.body)
      setLoading(false)
    }

    cargarCategorias()
  }, [])

  // Filtrar categorías por nombre
  const categoriasFiltradas = useMemo(() => {
    if (!searchTerm) return categorias
    return categorias.filter(categoria =>
      categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, categorias])

  // Paginación
  const totalPages = Math.ceil(categoriasFiltradas.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const categoriasParaMostrar = categoriasFiltradas.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goToNextPage = () => goToPage(currentPage + 1)
  const goToPrevPage = () => goToPage(currentPage - 1)

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      const startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, currentPage + 2)

      if (startPage > 1) {
        pageNumbers.push(1)
        if (startPage > 2) {
          pageNumbers.push("...")
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...")
        }
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  const handleEditar = (id: number) => {
    router.push(`/dashboard/productos/categorias/editar/${id}`)
  }

  const handleEliminar = async (id: number): Promise<void> => {
    const token = localStorage.getItem("token") || ""
    try {
      const confirmed = await showConfirmAlert(
        "¿Eliminar categoría?",
        "¿Estás seguro de que deseas eliminar esta categoría?",
        "Sí, eliminar",
        "Cancelar"
      )

      if (!confirmed) return

      await categoriasService.eliminarCategoria({ id }, token)
      setCategorias(prev => prev.filter(c => c.id !== id))

      await showSuccessAlert(
        "¡Categoría eliminada!",
        "La categoría se ha eliminado exitosamente"
      )

      const newTotalPages = Math.ceil((categoriasFiltradas.length - 1) / ITEMS_PER_PAGE)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }
    } catch (error) {
      console.error("Error al eliminar categoría:", error)
    }
  }

  const limpiarFiltros = () => {
    setSearchTerm("")
    setCurrentPage(1)
  }

  const tienesFiltrosActivos = !!searchTerm

  return {
    categorias: categoriasParaMostrar,
    categoriasFiltradas,
    loading,
    handleEditar,
    handleEliminar,

    searchTerm,
    setSearchTerm,
    limpiarFiltros,
    tienesFiltrosActivos,

    currentPage,
    totalPages,
    ITEMS_PER_PAGE,
    goToPage,
    goToNextPage,
    goToPrevPage,
    getPageNumbers,
    needsPagination: categoriasFiltradas.length > ITEMS_PER_PAGE,

    startIndex,
    endIndex,
    totalItems: categoriasFiltradas.length,
  }
}