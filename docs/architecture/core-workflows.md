# Core Workflows

Key system workflows showing component interactions including real-time features and error handling paths.

## Work Order Lifecycle Workflow

```mermaid
sequenceDiagram
    participant Super as Supervisor
    participant UI as Frontend UI
    participant Auth as Auth Component
    participant WO as Work Order Service
    participant DB as Database
    participant Notify as Notification Service
    participant Op as Operator

    Super->>UI: Create Work Order
    UI->>Auth: Check Permissions
    Auth-->>UI: Supervisor Role Confirmed
    UI->>WO: POST /work-orders
    WO->>DB: Insert Work Order
    DB-->>WO: Success with ID
    WO->>Notify: Assignment Notification
    WO-->>UI: Work Order Created

    Notify->>Op: Push Notification
    Op->>UI: View My Orders
    UI->>WO: GET /work-orders?assignedTo=me
    WO->>DB: Query with RLS Filter
    DB-->>WO: Assigned Work Orders
    WO-->>UI: Filtered Results

    Op->>UI: Start Work Order
    UI->>WO: PUT /work-orders/{id}/status
    WO->>DB: Update Status + Audit Trail
    WO->>Notify: Status Change Notification
    DB-->>WO: Confirmation
    WO-->>UI: Status Updated

    Super->>UI: View Kanban Board
    UI->>WO: GET /work-orders
    WO->>DB: Query All Orders
    DB-->>WO: Complete List
    WO-->>UI: Real-time Status Updates
```

## Real-time Synchronization Workflow

```mermaid
sequenceDiagram
    participant Client1 as Mobile Client 1
    participant Client2 as Mobile Client 2
    participant Sync as Sync Component
    participant API as Backend API
    participant DB as Database

    Note over Client1,Client2: Polling every 30 seconds

    loop Polling Cycle
        Client1->>Sync: Check for Updates
        Sync->>API: GET /work-orders?since={timestamp}
        API->>DB: Query Recent Changes
        DB-->>API: Updated Records
        API-->>Sync: Changed Data
        Sync-->>Client1: Apply Updates

        Client2->>Sync: Check for Updates
        Sync->>API: GET /work-orders?since={timestamp}
        API->>DB: Query Recent Changes
        DB-->>API: Updated Records
        API-->>Sync: Changed Data
        Sync-->>Client2: Apply Updates
    end

    Note over Client1,DB: Work Order Status Change
    Client1->>API: PUT /work-orders/{id}
    API->>DB: Update Database
    DB-->>API: Success
    API-->>Client1: Immediate Response

    Note over Client1,Client2: Next polling cycle detects change
    Client2->>Sync: Check for Updates
    Sync->>API: GET /work-orders?since={timestamp}
    API->>DB: Query Recent Changes
    DB-->>API: Include Status Change
    API-->>Sync: Updated Data
    Sync-->>Client2: Show Status Change
```

## Equipment Import Workflow

```mermaid
sequenceDiagram
    participant Admin as Admin User
    participant UI as Frontend UI
    participant File as File Service
    participant EQ as Equipment Service
    participant DB as Database
    participant Valid as Validation Service

    Admin->>UI: Upload Equipment File
    UI->>File: POST /equipment/import
    File->>Valid: Validate File Format
    Valid-->>File: Format OK
    File->>Valid: Parse CSV/Excel Data
    Valid-->>File: Parsed Data
    File->>Valid: Validate Hierarchy Structure
    Valid-->>File: Validation Results

    alt Validation Success
        File->>EQ: Create Equipment Records
        EQ->>DB: Batch Insert Equipment
        DB-->>EQ: Success Confirmation
        EQ-->>File: Import Results
        File-->>UI: Success Response
        UI-->>Admin: Import Complete
    else Validation Errors
        File-->>UI: Error Report
        UI-->>Admin: Validation Failed
    end
```

## Spare Parts Management Workflow

```mermaid
sequenceDiagram
    participant Op as Operator
    participant UI as Frontend UI
    participant WO as Work Order Service
    participant SP as Spare Parts Service
    participant DB as Database
    participant Notify as Notification Service

    Op->>UI: Complete Work Order with Parts
    UI->>WO: PUT /work-orders/{id}/complete
    WO->>SP: Record Parts Usage
    SP->>DB: Update Stock Levels
    DB-->>SP: Stock Updated

    alt Stock Below Minimum
        SP->>Notify: Trigger Low Stock Alert
        Notify->>SP: Alert Sent
    end

    SP-->>WO: Usage Recorded
    WO->>DB: Update Work Order Status
    DB-->>WO: Status Updated
    WO-->>UI: Completion Confirmation
    UI-->>Op: Work Order Complete

    alt Low Stock Alert
        Notify->>UI: Show Notification
        UI-->>Op: Low Stock Warning
    end
```

---
