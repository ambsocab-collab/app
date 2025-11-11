import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GMAO API Documentation',
      version: '1.0.0',
      description: 'GMAO Maintenance Management System API',
      contact: {
        name: 'GMAO Development Team',
        email: 'dev@gmao.app'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://api.gmao.app'
          : 'http://localhost:3001',
        description: process.env.NODE_ENV === 'production'
          ? 'Production server'
          : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token obtained from authentication'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'email', 'role', 'created_at'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User unique identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            first_name: {
              type: 'string',
              description: 'User first name'
            },
            last_name: {
              type: 'string',
              description: 'User last name'
            },
            role: {
              type: 'string',
              enum: ['admin', 'supervisor', 'operator'],
              description: 'User role in the system'
            },
            is_active: {
              type: 'boolean',
              description: 'Whether the user account is active'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'User account creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Equipment: {
          type: 'object',
          required: ['id', 'name', 'type', 'created_at'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Equipment unique identifier'
            },
            name: {
              type: 'string',
              description: 'Equipment name'
            },
            type: {
              type: 'string',
              enum: ['plant', 'area', 'functional_unit', 'equipment'],
              description: 'Equipment type in hierarchy'
            },
            parent_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Parent equipment ID for hierarchy'
            },
            code: {
              type: 'string',
              description: 'Equipment code'
            },
            description: {
              type: 'string',
              description: 'Equipment description'
            },
            location: {
              type: 'string',
              description: 'Equipment location'
            },
            is_active: {
              type: 'boolean',
              description: 'Whether the equipment is active'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Equipment creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        WorkOrder: {
          type: 'object',
          required: ['id', 'title', 'status', 'priority', 'created_at'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Work order unique identifier'
            },
            title: {
              type: 'string',
              description: 'Work order title'
            },
            description: {
              type: 'string',
              description: 'Work order detailed description'
            },
            equipment_id: {
              type: 'string',
              format: 'uuid',
              description: 'Associated equipment ID'
            },
            assigned_to: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Assigned user ID'
            },
            status: {
              type: 'string',
              enum: ['draft', 'pending', 'in_progress', 'completed', 'cancelled'],
              description: 'Work order status'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Work order priority'
            },
            estimated_duration: {
              type: 'integer',
              description: 'Estimated duration in minutes'
            },
            actual_duration: {
              type: 'integer',
              nullable: true,
              description: 'Actual duration in minutes'
            },
            scheduled_date: {
              type: 'string',
              format: 'date',
              nullable: true,
              description: 'Scheduled completion date'
            },
            completed_date: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Actual completion timestamp'
            },
            created_by: {
              type: 'string',
              format: 'uuid',
              description: 'Creator user ID'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Work order creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful'
            },
            data: {
              type: 'object',
              description: 'Response data payload'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Error code'
                },
                message: {
                  type: 'string',
                  description: 'Error message'
                },
                details: {
                  type: 'object',
                  description: 'Additional error details'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp'
            },
            requestId: {
              type: 'string',
              description: 'Request ID for tracking'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication and authorization operations'
      },
      {
        name: 'Users',
        description: 'User management operations'
      },
      {
        name: 'Equipment',
        description: 'Equipment management operations'
      },
      {
        name: 'Work Orders',
        description: 'Work order management operations'
      },
      {
        name: 'Spare Parts',
        description: 'Spare parts and inventory management'
      },
      {
        name: 'Reports',
        description: 'Analytics and reporting operations'
      },
      {
        name: 'Health',
        description: 'System health and monitoring endpoints'
      }
    ]
  },
  apis: [
    './src/routes/*.ts', // Route files
    './src/index.ts' // Main file for health endpoint
  ]
}

export const specs = swaggerJsdoc(options)

export const setupSwagger = (app: Express) => {
  if (process.env.ENABLE_SWAGGER !== 'false') {
    app.use('/api/docs', swaggerUi.serve)
    app.get('/api/docs', swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'GMAO API Documentation'
    }))
  }
}