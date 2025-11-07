# Requirements

## Functional

**FR1:** The system shall allow supervisors to create work orders specifying machine, description, priority (Critical/High/Medium/Low), and estimated duration

**FR2:** The system shall support work order states: Open, Planned, In Execution, Completed, Closed, Rejected, Waiting, and Pending Stock

**FR3:** The system shall allow supervisors to assign work orders to specific operators with automatic notification

**FR4:** The system shall provide operators a "My Orders" view showing assigned work orders filtered by status

**FR5:** The system shall automatically transition work orders to "In Execution" state when an operator starts work

**FR6:** The system shall allow operators to log spare parts consumed during work order execution with automatic stock updates

**FR7:** The system shall alert supervisors when spare part stock falls below configured minimum thresholds

**FR8:** The system shall provide a Meeting Mode Kanban board with drag-and-drop capability to change work order states and assignments

**FR9:** The system shall synchronize all work order changes across all connected devices using 30-second polling intervals

**FR10:** The system shall provide a TV Display Mode that rotates between KPI dashboard and pending work order cards every 30 seconds

**FR11:** The system shall calculate and display MTTR (Mean Time To Repair), MTBF (Mean Time Between Failures), and equipment availability KPIs

**FR12:** The system shall maintain a complete audit trail of all work order state changes including user, timestamp, and reason

**FR13:** The system shall support a flexible hierarchical equipment structure starting from Plant (top level) with a default organization of Plant → Area → Functional Unit → Equipment → Components, allowing administrators to add or remove intermediate hierarchy levels as needed (only Plant level is mandatory)

**FR16:** The system shall allow administrators to bulk upload equipment hierarchy data via Excel/CSV file import and provide a downloadable template file with the current structure format

**FR14:** The system shall allow administrators to manage user accounts with role-based permissions (Admin/Supervisor/Operator)

**FR15:** The system shall allow spare parts to be associated with multiple components for inventory planning

## Non Functional

**NFR1:** The system shall be responsive and fully functional on desktop, tablet, and mobile devices with mobile-first design priority

**NFR2:** The system shall support 4-8 concurrent operators managing 50-100 pieces of equipment without performance degradation

**NFR3:** The system shall use free-tier cloud services (Vercel frontend, Railway/Render backend, Supabase database) to minimize operational costs

**NFR4:** The system shall achieve work order state synchronization within 30 seconds across all connected clients

**NFR5:** The system shall implement Row Level Security (RLS) policies ensuring operators only access their assigned work orders

**NFR6:** The system shall maintain 99.5% uptime during production facility operating hours (excludes planned maintenance windows)

**NFR7:** The system shall be deployable within a 2-4 week development timeline using React, Node.js, and Supabase technology stack

---
