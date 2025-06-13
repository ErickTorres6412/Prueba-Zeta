'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Card } from '@/components/ui/Card';

export default function CartSummaryPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCart();

  const formatearPrecio = (precio: string | number): string => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "USD",
    }).format(Number.parseFloat(precio.toString()));
  };

  // Redirigir si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="bg-white p-8 text-center max-w-md">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Carrito vacío</h2>
          <p className="text-gray-500 mb-4">No tienes productos en tu carrito</p>
          <button
            onClick={() => router.push('/dashboard/catalogo')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Ir al catálogo
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Resumen del carrito</h1>
          <p className="text-gray-600 mt-2">Productos en tu carrito</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumen del pedido */}
          <div className="lg:col-span-3">
            <Card className="bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos</h3>
              
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.url_imagen ? (
                        <img 
                          src={item.url_imagen} 
                          alt={item.nombre}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21,15 16,10 5,21"></polyline>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.nombre}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatearPrecio(Number.parseFloat(item.precio.toString()) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatearPrecio(getTotalPrice())}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}