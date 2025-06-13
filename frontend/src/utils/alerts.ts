// utils/alerts.ts
import Swal from "sweetalert2"

// Configuración base para todos los alerts
const baseConfig = {
  customClass: {
    popup: 'rounded-lg',
    title: 'text-lg font-semibold',
    content: 'text-sm text-gray-600',
    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mr-2',
    cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md',
  },
  buttonsStyling: false,
}

/**
 * Muestra una alerta de confirmación
 * @param title - Título de la alerta
 * @param text - Texto descriptivo
 * @param confirmButtonText - Texto del botón de confirmación
 * @param cancelButtonText - Texto del botón de cancelación
 * @returns Promise<boolean> - true si el usuario confirma, false si cancela
 */
export const showConfirmAlert = async (
  title: string,
  text?: string,
  confirmButtonText: string = "Confirmar",
  cancelButtonText: string = "Cancelar"
): Promise<boolean> => {
  const result = await Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    focusCancel: true,
    reverseButtons: true,
  })

  return result.isConfirmed
}

/**
 * Muestra una alerta de éxito
 * @param title - Título de la alerta
 * @param text - Texto descriptivo
 * @param confirmButtonText - Texto del botón de confirmación
 */
export const showSuccessAlert = async (
  title: string,
  text?: string,
  confirmButtonText: string = "Entendido"
): Promise<void> => {
  await Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: "success",
    confirmButtonText,
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md',
    },
  })
}

/**
 * Muestra una alerta de error
 * @param title - Título de la alerta
 * @param text - Texto descriptivo
 * @param confirmButtonText - Texto del botón de confirmación
 */
export const showErrorAlert = async (
  title: string,
  text?: string,
  confirmButtonText: string = "Entendido"
): Promise<void> => {
  await Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: "error",
    confirmButtonText,
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md',
    },
  })
}

/**
 * Muestra una alerta de advertencia
 * @param title - Título de la alerta
 * @param text - Texto descriptivo
 * @param confirmButtonText - Texto del botón de confirmación
 */
export const showWarningAlert = async (
  title: string,
  text?: string,
  confirmButtonText: string = "Entendido"
): Promise<void> => {
  await Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: "warning",
    confirmButtonText,
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md',
    },
  })
}

/**
 * Muestra una alerta de información
 * @param title - Título de la alerta
 * @param text - Texto descriptivo
 * @param confirmButtonText - Texto del botón de confirmación
 */
export const showInfoAlert = async (
  title: string,
  text?: string,
  confirmButtonText: string = "Entendido"
): Promise<void> => {
  await Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: "info",
    confirmButtonText,
  })
}

/**
 * Muestra una alerta de carga (loading)
 * @param title - Título de la alerta
 * @param text - Texto descriptivo
 */
export const showLoadingAlert = (
  title: string = "Cargando...",
  text?: string
): void => {
  Swal.fire({
    ...baseConfig,
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

/**
 * Cierra cualquier alerta abierta
 */
export const closeAlert = (): void => {
  Swal.close()
}

/**
 * Muestra una alerta de confirmación para eliminación
 * @param itemName - Nombre del elemento a eliminar
 * @returns Promise<boolean> - true si el usuario confirma, false si cancela
 */
export const showDeleteConfirmAlert = async (
  itemName: string = "este elemento"
): Promise<boolean> => {
  const result = await Swal.fire({
    ...baseConfig,
    title: "¿Eliminar elemento?",
    text: `¿Estás seguro de que deseas eliminar ${itemName}? Esta acción no se puede deshacer.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    focusCancel: true,
    reverseButtons: true,
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md mr-2',
    },
  })

  return result.isConfirmed
}

/**
 * Muestra un toast de notificación (menos intrusivo)
 * @param title - Título del toast
 * @param icon - Tipo de icono
 * @param position - Posición del toast
 */
export const showToast = (
  title: string,
  icon: "success" | "error" | "warning" | "info" = "success",
  position: "top-end" | "top-start" | "bottom-end" | "bottom-start" = "top-end"
): void => {
  const Toast = Swal.mixin({
    toast: true,
    position,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer)
      toast.addEventListener("mouseleave", Swal.resumeTimer)
    },
  })

  Toast.fire({
    icon,
    title,
  })
}