// components/ui/FormInput.tsx
import React, { forwardRef } from "react"
import { cn } from "@/libs/utils"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
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
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const hasError = Boolean(error)
    const hasIcons = Boolean(leftIcon || rightIcon)

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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{leftIcon}</div>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base styles
              "block w-full px-3 py-2 text-sm border rounded-md transition-colors duration-200",
              "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0",
              // Icon padding
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              // Normal state
              !hasError &&
                "border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/20",
              // Error state
              hasError &&
                "border-red-300 bg-red-50 text-red-900 placeholder:text-red-400 focus:border-red-500 focus:ring-red-500/20",
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
          />

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

FormInput.displayName = "FormInput"