# API Specification

REST API implementation using OpenAPI 3.0 specification, providing comprehensive endpoints for all maintenance workflows with proper authentication, authorization, and error handling.

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: GMAOapp API
  version: 1.0.0
  description: Industrial Maintenance Work Order Management System API
servers:
  - url: https://gmaoapp-api.railway.app/api/v1
    description: Production API server
  - url: http://localhost:3001/api/v1
    description: Development server

# Security Schemes
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

# Common Schemas
  schemas:
    User:
      type: object
      required: [id, email, name, role, isActive, createdAt]
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
          minLength: 1
          maxLength: 100
        role:
          type: string
          enum: [admin, supervisor, operator]
        isActive:
          type: boolean
        lastLoginAt:
          type: string
          format: date-time
        createdAt:
          type: string
          format: date-time
        phoneNumber:
          type: string
        department:
          type: string
        preferences:
          $ref: '#/components/schemas/UserPreferences'

    UserPreferences:
      type: object
      properties:
        language:
          type: string
          default: en
        theme:
          type: string
          enum: [light, dark, auto]
          default: light
        notifications:
          type: object
          properties:
            email:
              type: boolean
              default: true
            push:
              type: boolean
              default: true
            workOrderAssignment:
              type: boolean
              default: true
            lowStockAlert:
              type: boolean
              default: true

    WorkOrder:
      type: object
      required: [id, title, description, priority, status, equipmentId, createdById, estimatedDuration, createdAt]
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
          minLength: 1
          maxLength: 200
        description:
          type: string
          maxLength: 2000
        priority:
          type: string
          enum: [critical, high, medium, low]
        status:
          type: string
          enum: [open, planned, in_execution, completed, closed, rejected, waiting, pending_stock]
        equipmentId:
          type: string
          format: uuid
        assignedOperatorId:
          type: string
          format: uuid
        createdById:
          type: string
          format: uuid
        estimatedDuration:
          type: integer
          minimum: 1
          maximum: 480
        actualDuration:
          type: integer
          minimum: 0
        createdAt:
          type: string
          format: date-time
        startedAt:
          type: string
          format: date-time
        completedAt:
          type: string
          format: date-time
        completedById:
          type: string
          format: uuid

    Equipment:
      type: object
      required: [id, name, code, type, level, location, status, isActive]
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
          minLength: 1
          maxLength: 100
        code:
          type: string
          minLength: 1
          maxLength: 50
        type:
          type: string
          enum: [plant, area, functional_unit, equipment, component]
        parentId:
          type: string
          format: uuid
        level:
          type: integer
          minimum: 0
          maximum: 10
        location:
          type: string
          maxLength: 200
        manufacturer:
          type: string
          maxLength: 100
        model:
          type: string
          maxLength: 100
        serialNumber:
          type: string
          maxLength: 100
        status:
          type: string
          enum: [active, inactive, maintenance, decommissioned]
        isActive:
          type: boolean

    SparePart:
      type: object
      required: [id, name, partNumber, category, currentStock, minimumStock, maximumStock, unit, unitCost, location, isActive]
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
          minLength: 1
          maxLength: 100
        partNumber:
          type: string
          minLength: 1
          maxLength: 50
        description:
          type: string
          maxLength: 500
        category:
          type: string
          maxLength: 50
        currentStock:
          type: integer
          minimum: 0
        minimumStock:
          type: integer
          minimum: 0
        maximumStock:
          type: integer
          minimum: 1
        unit:
          type: string
          maxLength: 20
        unitCost:
          type: number
          minimum: 0
        location:
          type: string
          maxLength: 100
        supplier:
          type: string
          maxLength: 100
        isActive:
          type: boolean

    ApiResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
        error:
          $ref: '#/components/schemas/ApiError'
        pagination:
          $ref: '#/components/schemas/Pagination'

    ApiError:
      type: object
      required: [code, message, timestamp]
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object
        timestamp:
          type: string
          format: date-time
        requestId:
          type: string

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        totalPages:
          type: integer

# Authentication
security:
  - bearerAuth: []

# API Paths
paths:
  # Authentication
  /auth/login:
    post:
      tags: [Authentication]
      summary: User login
      description: Authenticate user and return JWT token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 6
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      user:
                        $ref: '#/components/schemas/User'
                      token:
                        type: string
                      refreshToken:
                        type: string
        '401':
          description: Invalid credentials
        '500':
          description: Server error

  /auth/refresh:
    post:
      tags: [Authentication]
      summary: Refresh JWT token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [refreshToken]
              properties:
                refreshToken:
                  type: string
      responses:
        '200':
          description: Token refreshed successfully
        '401':
          description: Invalid refresh token

  # Work Orders
  /work-orders:
    get:
      tags: [Work Orders]
      summary: Get work orders with filtering
      description: Retrieve work orders with role-based access control
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [open, planned, in_execution, completed, closed, rejected, waiting, pending_stock]
        - name: priority
          in: query
          schema:
            type: string
            enum: [critical, high, medium, low]
        - name: assignedTo
          in: query
          schema:
            type: string
            format: uuid
        - name: equipmentId
          in: query
          schema:
            type: string
            format: uuid
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
      responses:
        '200':
          description: Work orders retrieved successfully
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/WorkOrder'

    post:
      tags: [Work Orders]
      summary: Create new work order
      description: Create a new work order (Supervisor+ only)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [title, description, priority, equipmentId, estimatedDuration]
              properties:
                title:
                  type: string
                  minLength: 1
                  maxLength: 200
                description:
                  type: string
                  maxLength: 2000
                priority:
                  type: string
                  enum: [critical, high, medium, low]
                equipmentId:
                  type: string
                  format: uuid
                estimatedDuration:
                  type: integer
                  minimum: 1
                  maximum: 480
                assignedOperatorId:
                  type: string
                  format: uuid
      responses:
        '201':
          description: Work order created successfully
        '400':
          description: Invalid input
        '403':
          description: Insufficient permissions

  /work-orders/{id}:
    get:
      tags: [Work Orders]
      summary: Get specific work order
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Work order retrieved successfully
        '404':
          description: Work order not found

    put:
      tags: [Work Orders]
      summary: Update work order
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  enum: [open, planned, in_execution, completed, closed, rejected, waiting, pending_stock]
                assignedOperatorId:
                  type: string
                  format: uuid
                actualDuration:
                  type: integer
                  minimum: 0
      responses:
        '200':
          description: Work order updated successfully
        '404':
          description: Work order not found
        '403':
          description: Insufficient permissions

  # Equipment
  /equipment:
    get:
      tags: [Equipment]
      summary: Get equipment hierarchy
      parameters:
        - name: parentId
          in: query
          schema:
            type: string
            format: uuid
        - name: level
          in: query
          schema:
            type: integer
            minimum: 0
        - name: type
          in: query
          schema:
            type: string
            enum: [plant, area, functional_unit, equipment, component]
      responses:
        '200':
          description: Equipment retrieved successfully
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/Equipment'

    post:
      tags: [Equipment]
      summary: Create equipment
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Equipment'
      responses:
        '201':
          description: Equipment created successfully
        '400':
          description: Invalid input
        '403':
          description: Insufficient permissions

  /equipment/import:
    post:
      tags: [Equipment]
      summary: Import equipment hierarchy from CSV/Excel
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required: [file]
              properties:
                file:
                  type: string
                  format: binary
      responses:
        '200':
          description: Equipment imported successfully
        '400':
          description: Invalid file format
        '413':
          description: File too large

  # Spare Parts
  /spare-parts:
    get:
      tags: [Spare Parts]
      summary: Get spare parts inventory
      parameters:
        - name: category
          in: query
          schema:
            type: string
        - name: lowStock
          in: query
          schema:
            type: boolean
        - name: search
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Spare parts retrieved successfully

    post:
      tags: [Spare Parts]
      summary: Create spare part
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SparePart'
      responses:
        '201':
          description: Spare part created successfully

  /spare-parts/{id}/usage:
    get:
      tags: [Spare Parts]
      summary: Get spare part usage history
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Usage history retrieved successfully

  # KPIs and Analytics
  /kpis/dashboard:
    get:
      tags: [Analytics]
      summary: Get dashboard KPIs
      description: Calculate MTTR, MTBF, availability, and other metrics
      parameters:
        - name: equipmentId
          in: query
          schema:
            type: string
            format: uuid
        - name: dateRange
          in: query
          schema:
            type: string
            enum: [7d, 30d, 90d, 1y]
            default: 30d
      responses:
        '200':
          description: KPIs calculated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  mttr:
                    type: number
                    description: Mean Time To Repair (hours)
                  mtbf:
                    type: number
                    description: Mean Time Between Failures (hours)
                  availability:
                    type: number
                    description: Equipment availability percentage
                  workOrderCounts:
                    type: object
                    properties:
                      open:
                        type: integer
                      inProgress:
                        type: integer
                      completed:
                        type: integer
                      rejected:
                        type: integer

  # Users
  /users:
    get:
      tags: [Users]
      summary: Get users (Admin+ only)
      responses:
        '200':
          description: Users retrieved successfully

    post:
      tags: [Users]
      summary: Create user (Admin+ only)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, name, role]
              properties:
                email:
                  type: string
                  format: email
                name:
                  type: string
                role:
                  type: string
                  enum: [admin, supervisor, operator]
                department:
                  type: string
                phoneNumber:
                  type: string
      responses:
        '201':
          description: User created successfully
        '400':
          description: Invalid input
        '409':
          description: Email already exists

# Error Responses
  responses:
    BadRequestError:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ApiResponse'
          example:
            success: false
            error:
              code: VALIDATION_ERROR
              message: Request validation failed
              details:
                field: email
                message: Invalid email format
              timestamp: 2025-11-06T10:30:00Z
              requestId: req_123456

    UnauthorizedError:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ApiResponse'
          example:
            success: false
            error:
              code: UNAUTHORIZED
              message: Invalid or expired token
              timestamp: 2025-11-06T10:30:00Z
              requestId: req_123456

    ForbiddenError:
      description: Forbidden
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ApiResponse'
          example:
            success: false
            error:
              code: INSUFFICIENT_PERMISSIONS
              message: User does not have required permissions
              timestamp: 2025-11-06T10:30:00Z
              requestId: req_123456

    NotFoundError:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ApiResponse'
          example:
            success: false
            error:
              code: NOT_FOUND
              message: Work order not found
              timestamp: 2025-11-06T10:30:00Z
              requestId: req_123456
```

---
