import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { productosService } from '@/services/index';
import type { Product } from "@/types/product"

export const useCatalogo = () => {
  // Estados existentes
  const [productos, setProductos] = useState<Product[]>([])
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categorias, setCategorias] = useState<string[]>([]);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { addToCart } = useCart();

  // Productos filtrados (sin paginación)
  const productosFiltrados = useMemo(() => {
    let productosFilt = productos;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      productosFilt = productosFilt.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      productosFilt = productosFilt.filter(producto =>
        producto.categoria === selectedCategory
      );
    }

    return productosFilt;
  }, [searchTerm, selectedCategory, productos]);

  // Cálculos de paginación
  const totalPages = Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const productosParaMostrar = productosFiltrados.slice(startIndex, endIndex);

  // Cargar productos al montar el componente
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || '';
        const response = await productosService.getProductos(token);

        // Simular carga (puedes quitar este timeout si no lo necesitas)
        setTimeout(() => {
          setProductos(response.body);

          // Extraer categorías únicas
          const categoriasUnicas = [...new Set(response.body.map(p => p.categoria))];
          setCategorias(categoriasUnicas);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  // Resetear página actual cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Función para agregar al carrito con notificación
  const agregarAlCarrito = (producto: Product) => {
    addToCart(producto);

    // Crear notificación visual
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center space-x-2';
    
    notification.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      <span>${producto.nombre} agregado al carrito</span>
    `;
    
    document.body.appendChild(notification);

    // Animación de entrada
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    }, 100);

    // Remover después de 3 segundos con animación
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  // Función para formatear precio
  const formatearPrecio = (precio: string | number): string => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "USD",
    }).format(Number.parseFloat(precio.toString()))
  };

  // Funciones de paginación
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll suave hacia arriba
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  // Generar array de páginas para mostrar en paginación
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Lógica para mostrar páginas con ellipsis
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Verificar si hay filtros activos
  const tienesFiltrosActivos = searchTerm || selectedCategory;

  return {
    // Estados
    productos,
    productosFiltrados,
    productosParaMostrar,
    loading,
    searchTerm,
    selectedCategory,
    categorias,
    
    // Estados de paginación
    currentPage,
    totalPages,
    ITEMS_PER_PAGE,
    
    // Funciones
    setSearchTerm,
    setSelectedCategory,
    agregarAlCarrito,
    limpiarFiltros,
    formatearPrecio,
    
    // Funciones de paginación
    goToPage,
    goToNextPage,
    goToPrevPage,
    getPageNumbers,
    
    // Valores computados
    tienesFiltrosActivos,
    needsPagination: productosFiltrados.length > ITEMS_PER_PAGE
  };
};