# External APIs

Based on PRD requirements analysis, GMAOapp requires minimal external API integrations for MVP. The system is designed to be self-contained with essential integrations handled through Supabase ecosystem.

## Supabase APIs

**Purpose:** Core database, authentication, and real-time services
**Documentation:** https://supabase.com/docs
**Base URL(s):** https://api.supabase.io
**Authentication:** API Keys + JWT tokens
**Rate Limits:** Based on Supabase plan (generous free tier)

**Key Endpoints Used:**
- `POST /auth/v1/token` - User authentication
- `GET /rest/v1/*` - Database CRUD operations
- `POST /storage/v1/upload` - File uploads
- `GET /storage/v1/object` - File retrieval
- `WEBSOCKET /realtime/v1` - Real-time subscriptions

**Integration Notes:** Supabase SDK handles authentication, RLS policies enforce data access boundaries automatically.

## Email Service (Future)

**Purpose:** Work order assignment notifications and low stock alerts
**Documentation:** To be determined based on provider choice
**Base URL(s):** Provider-dependent
**Authentication:** API Key
**Rate Limits:** Provider-dependent

**Key Endpoints Used:**
- `POST /send` - Send email notifications

**Integration Notes:** Can be deferred post-MVP, in-app notifications sufficient for initial deployment.

---
