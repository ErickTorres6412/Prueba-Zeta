// hooks/useUsuarios.ts
import { useState, useEffect } from "react"
import { usuariosService } from "@/services"
import type { Usuario } from "@/types/user"
import { useRouter } from "next/navigation"

export function useUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // Estados para paginación y filtros
    const [currentPage, setCurrentPage] = useState(1)

    const ITEMS_PER_PAGE = 10

    // Cálculos de paginación
    const totalPages = Math.ceil(usuarios.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

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

    useEffect(() => {
        const cargarUsuarios = async () => {
            setLoading(true)
            const token = localStorage.getItem("token") || ""
            const response = await usuariosService.getUsuarios(token)
            setUsuarios(response.body)
            setLoading(false)
        }

        cargarUsuarios()
    }, [])

    const handleEditar = (id: number) => {
        router.push(`/dashboard/usuarios/editar/${id}`)
    }

    return {
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
        needsPagination: usuarios.length > ITEMS_PER_PAGE,

        // Datos para mostrar información de paginación
        startIndex,
        endIndex,
        totalItems: usuarios.length
    }
}