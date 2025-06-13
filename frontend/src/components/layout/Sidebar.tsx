"use client"

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

interface SubMenuItem {
  name: string
  href: string
}

interface SidebarItem {
  name: string
  href: string
  icon: React.ReactNode
  roles: string[]
  subItems?: SubMenuItem[]
}

const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const { user } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const sidebarItems: SidebarItem[] = [
    {
      name: 'Catalogo',
      href: '/dashboard/catalogo',
      roles: ['user', 'admin'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <rect x="9" y="9" width="6" height="6"></rect>
        </svg>
      )
    },
    {
      name: 'Productos',
      href: '/dashboard/productos',
      roles: ['admin'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" x2="21" y1="6" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      ),
      subItems: [
        { name: 'Visualizar Productos', href: '/dashboard/productos/visualizar' },
        { name: 'Agregar Producto', href: '/dashboard/productos/agregar' }
      ]
    },
    {
      name: 'Usuarios',
      href: '/dashboard/usuarios',
      roles: ['admin'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      subItems: [
        { name: 'Visualizar Usuarios', href: '/dashboard/usuarios/visualizar' }
      ]
    }
  ]

  // Filtrar items según el rol del usuario
  const filteredItems = sidebarItems.filter(item => 
    user && item.roles.includes(user.role)
  )

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isItemExpanded = (itemName: string) => expandedItems.includes(itemName)

  const isActiveParent = (item: SidebarItem) => {
    if (item.subItems) {
      return item.subItems.some(subItem => pathname === subItem.href || pathname.startsWith(subItem.href + '/'))
    }
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  return (
    <div className="h-full bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 w-64 fixed left-0 top-0 z-30 shadow-2xl">
      {/* Logo Section */}
      <div className="flex flex-col items-center py-8 px-6 border-b border-blue-800/30">
        <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mb-3 relative overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="2" y1="20" x2="22" y2="20"></line>
          </svg>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-300 opacity-20 rounded-full"></div>
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-300 opacity-20 rounded-full"></div>
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">TechStore</h2>
        <div className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const hasSubItems = item.subItems && item.subItems.length > 0
          const isExpanded = isItemExpanded(item.name)
          const isParentActive = isActiveParent(item)
          
          return (
            <div key={item.name} className="space-y-1">
              {/* Main Item */}
              {hasSubItems ? (
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden
                    ${isParentActive 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg border border-blue-400/30' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center">
                    {/* Elemento decorativo para item activo */}
                    {isParentActive && (
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"></div>
                    )}
                    
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-200
                      ${isParentActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                        : 'bg-white/10 text-blue-200 group-hover:bg-white/15 group-hover:text-white'
                      }
                    `}>
                      {item.icon}
                    </div>
                    
                    <span className="flex-1 text-left">{item.name}</span>
                  </div>
                  
                  {/* Chevron Icon */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg border border-blue-400/30' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {/* Elemento decorativo para item activo */}
                  {isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"></div>
                  )}
                  
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                      : 'bg-white/10 text-blue-200 group-hover:bg-white/15 group-hover:text-white'
                    }
                  `}>
                    {item.icon}
                  </div>
                  
                  <span className="flex-1">{item.name}</span>
                  
                  {/* Indicador de flecha para item activo */}
                  {isActive && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  )}
                </Link>
              )}

              {/* Sub Items */}
              {hasSubItems && isExpanded && (
                <div className="ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  {item.subItems!.map((subItem) => {
                    const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/')
                    
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`
                          flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 relative
                          ${isSubActive 
                            ? 'bg-blue-500/20 text-white border-l-2 border-blue-400' 
                            : 'text-blue-200 hover:bg-white/5 hover:text-white'
                          }
                        `}
                      >
                        <div className="w-6 h-6 flex items-center justify-center mr-3">
                          <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            isSubActive ? 'bg-blue-400' : 'bg-blue-300/50'
                          }`}></div>
                        </div>
                        <span>{subItem.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer decorativo */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-200"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-400"></div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar