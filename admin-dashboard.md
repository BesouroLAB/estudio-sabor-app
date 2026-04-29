# Admin Dashboard Implementation Plan

## 1. Overview
Build a professional administrative dashboard for the Estúdio & Sabor AI Suite to monitor business metrics, user activity, and financial performance.

## 2. Aesthetics (Cosmic Premium)
- Dark Mode base (deep blacks, metallic grays).
- Glassmorphism for cards and overlays (backdrop-blur, subtle borders).
- "Pepper Red" (#E53935 or similar vibrant red) for accents and primary actions.

## 3. Key Features
- **Telemetry Cards**: Total Revenue (BRL), Active Users, Total API Cost, Total Credits outstanding.
- **User Management**: View users, roles, edit credits, suspend accounts.
- **Financial History**: List of all credit purchases/adjustments.
- **Generation Monitor**: Real-time view of image/text generations and token usage.

## 4. Technical Stack
- Next.js App Router (`/admin` namespace).
- Tailwind CSS v4 for styling.
- Supabase for data fetching (server components where possible).
- Lucide React for iconography.

## 5. Phases
1. **Phase 1: Foundation**: Create the layout and navigation structure.
2. **Phase 2: Telemetry Overview**: Build the main dashboard page with key metrics.
3. **Phase 3: User Management**: Implement the users table and credit editing functionality.
4. **Phase 4: Monitoring**: Add generation logs and financial history views.
