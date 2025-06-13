// components/ui/FormSelect.tsx
import React, { forwardRef } from "react"
import { cn } from "@/libs/utils"

interface SelectOption {
  value: string | number
  label: string
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  isRequired?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  helperClassName?: string
  options: SelectOption[]
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      error,
      helperText,
      isRequired = false,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      labelClassName,
      errorClassName,
      helperClassName,
      options,
      placeholder = "Selecciona una opción",
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    const hasError = Boolean(error)

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-gray-700 mb-1",
              labelClassName
            )}
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <div className="text-gray-400">{leftIcon}</div>
            </div>
          )}

          <select
            ref={ref}
            id={inputId}
            onChange={onChange}
            className={cn(
              // Base styles
              "block w-full px-3 py-2 text-sm border rounded-md transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none bg-white",
              // Icon padding
              leftIcon && "pl-10",
              rightIcon ? "pr-10" : "pr-8", // Default padding for dropdown arrow
              // Normal state
              !hasError &&
                "border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20",
              // Error state
              hasError &&
                "border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500/20",
              // Disabled state
              props.disabled &&
                "cursor-not-allowed bg-gray-50 text-gray-500 border-gray-200",
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          {!rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className={cn(
                  "w-4 h-4 text-gray-400",
                  hasError && "text-red-400"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          )}

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className={cn("text-gray-400", hasError && "text-red-400")}>
                {rightIcon}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className={cn(
              "mt-1 text-sm text-red-600 flex items-center gap-1",
              errorClassName
            )}
            role="alert"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className={cn("mt-1 text-sm text-gray-500", helperClassName)}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

FormSelect.displayName = "FormSelect"