# Graph Report - .  (2026-05-13)

## Corpus Check
- Corpus is ~10,360 words - fits in a single context window. You may not need a graph.

## Summary
- 85 nodes · 91 edges · 28 communities detected
- Extraction: 63% EXTRACTED · 37% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Core Features & Documentation|Core Features & Documentation]]
- [[_COMMUNITY_KV Storage & Build Management|KV Storage & Build Management]]
- [[_COMMUNITY_IPA Parsing & Main Page|IPA Parsing & Main Page]]
- [[_COMMUNITY_API Routes (GET)|API Routes (GET)]]
- [[_COMMUNITY_Build Deletion|Build Deletion]]
- [[_COMMUNITY_Vercel Blob Storage|Vercel Blob Storage]]
- [[_COMMUNITY_Planning & Brainstorming|Planning & Brainstorming]]
- [[_COMMUNITY_Application Layout|Application Layout]]
- [[_COMMUNITY_Graphify & Development Agent|Graphify & Development Agent]]
- [[_COMMUNITY_Skill Management|Skill Management]]
- [[_COMMUNITY_Tailwind Configuration|Tailwind Configuration]]
- [[_COMMUNITY_Next.js Configuration|Next.js Configuration]]
- [[_COMMUNITY_Next.js Environment|Next.js Environment]]
- [[_COMMUNITY_PostCSS Configuration|PostCSS Configuration]]
- [[_COMMUNITY_Blob Agent|Blob Agent]]
- [[_COMMUNITY_KV Agent|KV Agent]]
- [[_COMMUNITY_Brainstorming Skill|Brainstorming Skill]]
- [[_COMMUNITY_Debugging Skill|Debugging Skill]]
- [[_COMMUNITY_TDD Skill|TDD Skill]]
- [[_COMMUNITY_Caveman Mode|Caveman Mode]]
- [[_COMMUNITY_Request Review Skill|Request Review Skill]]
- [[_COMMUNITY_Receive Review Skill|Receive Review Skill]]
- [[_COMMUNITY_Finish Branch Skill|Finish Branch Skill]]
- [[_COMMUNITY_Git Worktree Skill|Git Worktree Skill]]
- [[_COMMUNITY_Parallel Agent Skill|Parallel Agent Skill]]
- [[_COMMUNITY_Subagent Development Skill|Subagent Development Skill]]
- [[_COMMUNITY_Verification Skill|Verification Skill]]
- [[_COMMUNITY_Decision Management|Decision Management]]

## God Nodes (most connected - your core abstractions)
1. `GET()` - 12 edges
2. `POST()` - 8 edges
3. `handleDelete()` - 7 edges
4. `IPA OTA Installer` - 6 edges
5. `getTotalStorageUsed()` - 5 edges
6. `IPA OTA Installer` - 5 edges
7. `getBuild()` - 4 edges
8. `parseIpa()` - 4 edges
9. `Upload Component` - 4 edges
10. `Register API` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Upload Component` --semantically_similar_to--> `Upload Component`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Register API` --semantically_similar_to--> `Register API`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Install Page` --semantically_similar_to--> `Install Page`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Cron Cleanup Job` --semantically_similar_to--> `Cron Job`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `GET()` --calls--> `getBuild()`  [INFERRED]
  app/manifest/[buildId]/route.ts → lib/kv.ts

## Hyperedges (group relationships)
- **Process Skills** — agents_brainstorming, agents_systematic_debugging [EXTRACTED 1.00]
- **Implementation Skills** — agents_test_driven_development, agents_writing_plans [EXTRACTED 1.00]
- **Workflow Skills** — agents_grill_me, agents_requesting_code_review, agents_receiving_code_review, agents_finishing_a_development_branch, agents_using_git_worktrees [EXTRACTED 1.00]

## Communities

### Community 0 - "Core Features & Documentation"
Cohesion: 0.15
Nodes (20): Cron Job, Install Page, IPA OTA Installer, Manifest API, Register API, Upload Component, 60-Minute Expiry, Build ID Security (+12 more)

### Community 1 - "KV Storage & Build Management"
Cohesion: 0.29
Nodes (7): decrementStorage(), generateBuildId(), generateDeleteToken(), getTotalStorageUsed(), incrementStorage(), saveBuild(), POST()

### Community 2 - "IPA Parsing & Main Page"
Cohesion: 0.29
Nodes (7): encodeIcon(), extractIcon(), parseIpa(), parsePlist(), fetchStorageStatus(), handleFile(), handleUpload()

### Community 3 - "API Routes (GET)"
Cohesion: 0.38
Nodes (3): buildPageHtml(), escapeXml(), GET()

### Community 4 - "Build Deletion"
Cohesion: 0.47
Nodes (5): deleteBuild(), getBuild(), getBuildIdByDeleteToken(), DELETE(), handleDelete()

### Community 5 - "Vercel Blob Storage"
Cohesion: 0.5
Nodes (0): 

### Community 6 - "Planning & Brainstorming"
Cohesion: 0.5
Nodes (4): executing-plans, grill-me, Plan Node, writing-plans

### Community 7 - "Application Layout"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Graphify & Development Agent"
Cohesion: 1.0
Nodes (2): graphify, Graphify-First Development Agent

### Community 9 - "Skill Management"
Cohesion: 1.0
Nodes (1): writing-skills

### Community 10 - "Tailwind Configuration"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Next.js Configuration"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Next.js Environment"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "PostCSS Configuration"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Blob Agent"
Cohesion: 1.0
Nodes (1): Vercel Blob Storage

### Community 15 - "KV Agent"
Cohesion: 1.0
Nodes (1): Vercel KV Database

### Community 16 - "Brainstorming Skill"
Cohesion: 1.0
Nodes (1): brainstorming

### Community 17 - "Debugging Skill"
Cohesion: 1.0
Nodes (1): systematic-debugging

### Community 18 - "TDD Skill"
Cohesion: 1.0
Nodes (1): test-driven-development

### Community 19 - "Caveman Mode"
Cohesion: 1.0
Nodes (1): caveman

### Community 20 - "Request Review Skill"
Cohesion: 1.0
Nodes (1): requesting-code-review

### Community 21 - "Receive Review Skill"
Cohesion: 1.0
Nodes (1): receiving-code-review

### Community 22 - "Finish Branch Skill"
Cohesion: 1.0
Nodes (1): finishing-a-development-branch

### Community 23 - "Git Worktree Skill"
Cohesion: 1.0
Nodes (1): using-git-worktrees

### Community 24 - "Parallel Agent Skill"
Cohesion: 1.0
Nodes (1): dispatching-parallel-agents

### Community 25 - "Subagent Development Skill"
Cohesion: 1.0
Nodes (1): subagent-driven-development

### Community 26 - "Verification Skill"
Cohesion: 1.0
Nodes (1): verification-before-completion

### Community 27 - "Decision Management"
Cohesion: 1.0
Nodes (1): Decision Node

## Knowledge Gaps
- **23 isolated node(s):** `JSZip Library`, `XML Plist Format`, `Build ID Security`, `Delete Token Security`, `Vercel Blob Storage` (+18 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Application Layout`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Graphify & Development Agent`** (2 nodes): `graphify`, `Graphify-First Development Agent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skill Management`** (1 nodes): `writing-skills`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailwind Configuration`** (1 nodes): `tailwind.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Configuration`** (1 nodes): `next.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Environment`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Configuration`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Blob Agent`** (1 nodes): `Vercel Blob Storage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `KV Agent`** (1 nodes): `Vercel KV Database`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Brainstorming Skill`** (1 nodes): `brainstorming`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Debugging Skill`** (1 nodes): `systematic-debugging`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `TDD Skill`** (1 nodes): `test-driven-development`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Caveman Mode`** (1 nodes): `caveman`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Request Review Skill`** (1 nodes): `requesting-code-review`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Receive Review Skill`** (1 nodes): `receiving-code-review`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Finish Branch Skill`** (1 nodes): `finishing-a-development-branch`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Git Worktree Skill`** (1 nodes): `using-git-worktrees`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Parallel Agent Skill`** (1 nodes): `dispatching-parallel-agents`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Subagent Development Skill`** (1 nodes): `subagent-driven-development`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Verification Skill`** (1 nodes): `verification-before-completion`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Decision Management`** (1 nodes): `Decision Node`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GET()` connect `API Routes (GET)` to `KV Storage & Build Management`, `Build Deletion`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `POST()` connect `KV Storage & Build Management` to `API Routes (GET)`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `GET()` (e.g. with `getBuild()` and `getTotalStorageUsed()`) actually correct?**
  _`GET()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `POST()` (e.g. with `GET()` and `getTotalStorageUsed()`) actually correct?**
  _`POST()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `handleDelete()` (e.g. with `getBuildIdByDeleteToken()` and `getBuild()`) actually correct?**
  _`handleDelete()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `IPA OTA Installer` (e.g. with `Upload Component` and `Register API`) actually correct?**
  _`IPA OTA Installer` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `getTotalStorageUsed()` (e.g. with `GET()` and `POST()`) actually correct?**
  _`getTotalStorageUsed()` has 2 INFERRED edges - model-reasoned connections that need verification._