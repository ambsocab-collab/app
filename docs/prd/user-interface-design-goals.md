# User Interface Design Goals

## Overall UX Vision

The GMAOapp delivers a mobile-first Progressive Web App (PWA) experience optimized for industrial maintenance operators working in the field with tablets and smartphones. The interface prioritizes quick access to critical information, one-handed operation with large touch targets (48x48px minimum), and offline-capable workflows for environments with intermittent connectivity. The design language is clean and utilitarian—prioritizing clarity and speed over decorative elements—with color-coded priority indicators (red/orange/yellow/green) that are instantly recognizable from across a factory floor.

The operator experience centers on a persistent bottom tab navigation (Home, My Orders, Workshop, Reports, Profile) that keeps core functions always accessible. Work order cards use a scannable card-based layout with progressive disclosure: essential information visible at a glance, full details available with a tap. Real-time synchronization provides immediate feedback when supervisors assign work or make changes, creating a sense of connectedness despite physical distance across the facility.

## Key Interaction Paradigms

- **Pull-to-refresh**: Standard mobile gesture to manually sync latest work orders and KPIs
- **Swipe actions**: Swipe left/right on work order cards for quick actions (start, complete, view details)
- **Drag-and-drop** (Meeting Mode only): Supervisors manipulate work order cards on Kanban board via touch gestures
- **Progressive disclosure**: Cards show summary info by default, tap to expand full details without navigation
- **No camera integration**: Photo attachments removed from MVP scope to focus on core work order management
- **Offline-first**: App caches recent data locally, queues changes when offline, auto-syncs when connectivity returns with visual feedback

## Core Screens and Views

**Operator Role:**
- Home Dashboard (KPI summary, alerts, quick actions)
- My Orders (work orders assigned to me, filterable by status)
- Work Order Detail (timer, spare parts checklist, photo capture, notes)
- Workshop (spare parts inventory, stock alerts)
- Profile (settings, notifications preferences)

**Supervisor Role:**
- All operator screens plus:
- Create/Assign Work Order (machine selector, operator assignment)
- Meeting Mode Kanban Board (drag-and-drop work order management)
- TV Display Toggle (activate/deactivate TV rotation mode)

**Admin Role:**
- All supervisor screens plus:
- Equipment Management (flexible hierarchical structure with bulk CSV/Excel import)
- User Management (create users, assign roles/permissions)
- Spare Parts Management (CRUD, stock thresholds)

**Shared Displays:**
- TV Display Mode (auto-rotating KPI dashboard and pending work cards, no interaction required)

## Accessibility: WCAG AA

- Minimum contrast ratio 4.5:1 for all text and interactive elements
- Touch targets minimum 48x48px for thumb-friendly operation with work gloves
- Text size minimum 14px body copy, 16px for critical information, scalable via browser settings
- Color is never the sole indicator (priority uses color + icon + text label)
- Screen reader compatible with proper semantic HTML and ARIA labels
- Keyboard navigation support for desktop users
- Respects `prefers-reduced-motion` for users sensitive to animation

## Branding

Clean, industrial aesthetic with minimal ornamentation. The interface uses the Inter system font for universal device compatibility and professional appearance. Iconography uses standard Material Design icons for universal recognition (wrench for maintenance, bell for notifications, etc.). The color palette is functional rather than branded: blue for primary actions, green for success/completion, yellow/orange for warnings, red for critical priorities. No corporate logo or custom brand assets are required for MVP—the focus is on tool utility, not marketing.

## Target Device and Platforms: Web Responsive

**Primary:** Mobile phones (5-6" screens, 375-430px width, portrait orientation) running iOS Safari or Android Chrome as PWA

**Secondary:** Tablets (9-11" screens, landscape and portrait) for supervisor Kanban board interactions

**Tertiary:** Desktop browsers (1920x1080+) for administrative tasks and data entry

**Special:** TV displays (55"+ screens, 1920x1080 or 4K) for read-only auto-rotating dashboard mode, typically connected via casting or dedicated browser

All platforms access the same responsive web application—no native mobile apps. The PWA can be installed to the home screen on mobile devices for app-like experience with offline capabilities and push notifications.

---
