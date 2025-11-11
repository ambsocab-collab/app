import React from 'react'
import clsx from 'clsx'

export interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'emergency'
  className?: string
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className
}) => {
  const priorityClasses = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
    emergency: 'priority-emergency'
  }

  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    emergency: 'Emergency'
  }

  return (
    <div className={clsx('priority-badge', priorityClasses[priority], className)}>
      {priorityLabels[priority]}
    </div>
  )
}

export { PriorityBadge }