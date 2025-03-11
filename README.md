# DVF Tool v3

AI Agent DVF Prioritization Tool with Role-Based Access Control

## Features

- Evaluate and prioritize AI agents based on Desirability, Viability, and Feasibility scores
- Role-based access control (RBAC) with three user roles:
  - **Admin**: Full access to all features
  - **Decision Maker**: Can review and approve/reject agent submissions
  - **Requestor**: Can submit new agent requests

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Set up your Supabase database with the following tables:
   - `profiles`: User profiles with roles
   - `roles`: User role definitions
   - `agents`: AI agent data

## Development

Run the development server:

```bash
npm run dev
```

## Build

Build for production:

```bash
npm run build
```

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/zrebeccayy/dvf_tool_v2)