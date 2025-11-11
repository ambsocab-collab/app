import React from 'react'
import clsx from 'clsx'

export interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'critical'
  label?: string
  showPulse?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  showPulse = false,
  size = 'md'
}) => {
  const statusClasses = {
    online: 'status-online',
    offline: 'status-offline',
    warning: 'status-warning',
    critical: 'status-critical'
  }

  const dotSizes = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  }

  const containerSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className={clsx('flex items-center space-x-2', containerSizes[size])}>
      <div className="relative">
        <div
          className={clsx(
            'rounded-full',
            statusClasses[status],
            dotSizes[size],
            showPulse && status === 'online' && 'animate-pulse'
          )}
        />
        {showPulse && status === 'online' && (
          <div
            className={clsx(
              'absolute inset-0 rounded-full animate-ping',
              statusClasses[status],
              dotSizes[size],
              'opacity-75'
            )}
          />
        )}
      </div>
      {label && <span>{label}</span>}
    </div>
  )
}

export { StatusIndicator }