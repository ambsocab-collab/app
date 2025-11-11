import clsx from 'clsx'
import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  warning?: boolean
  label?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, warning, label, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          className={clsx(
            'input',
            error && 'input-error',
            warning && 'input-warning',
            className
          )}
          id={inputId}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={clsx(
            'text-sm',
            error ? 'text-critical-600' : warning ? 'text-warning-600' : 'text-text-muted'
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }