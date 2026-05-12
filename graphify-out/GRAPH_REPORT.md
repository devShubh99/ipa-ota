# Graph Report - /Users/shubh/Projects/Personal/ipa-ota  (2026-05-13)

## Corpus Check
- 28 files · ~14,068 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 104 nodes · 107 edges · 38 communities detected
- Extraction: 56% EXTRACTED · 44% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]

## God Nodes (most connected - your core abstractions)
1. `GET()` - 17 edges
2. `POST()` - 8 edges
3. `registerBuild()` - 7 edges
4. `handleDelete()` - 7 edges
5. `IPA OTA Installer` - 6 edges
6. `decrementStorage()` - 5 edges
7. `IPA OTA Installer` - 5 edges
8. `getBuild()` - 4 edges
9. `deleteBuild()` - 4 edges
10. `parseIpa()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `deleteBlob()`  [INFERRED]
  /Users/shubh/Projects/Personal/ipa-ota/app/dl/[buildId]/route.ts → lib/blob.ts
- `Upload Component` --semantically_similar_to--> `Upload Component`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Register API` --semantically_similar_to--> `Register API`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Install Page` --semantically_similar_to--> `Install Page`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Cron Cleanup Job` --semantically_similar_to--> `Cron Job`  [INFERRED] [semantically similar]
  README.md → AGENTS.md

## Hyperedges (group relationships)
- **Process Skills** — agents_brainstorming, agents_systematic_debugging [EXTRACTED 1.00]
- **Implementation Skills** — agents_test_driven_development, agents_writing_plans [EXTRACTED 1.00]
- **Workflow Skills** — agents_grill_me, agents_requesting_code_review, agents_receiving_code_review, agents_finishing_a_development_branch, agents_using_git_worktrees [EXTRACTED 1.00]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (20): Cron Job, Install Page, IPA OTA Installer, Manifest API, Register API, Upload Component, 60-Minute Expiry, Build ID Security (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.19
Nodes (10): deleteBuild(), getBuild(), getBuildIdByDeleteToken(), listBuilds(), DELETE(), GET(), handleDelete(), buildPageHtml() (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.25
Nodes (7): encodeIcon(), extractIcon(), parseIpa(), parsePlist(), fetchStorageStatus(), handleFile(), handleUpload()

### Community 3 - "Community 3"
Cohesion: 0.35
Nodes (8): registerBuild(), decrementStorage(), generateBuildId(), generateDeleteToken(), getTotalStorageUsed(), incrementStorage(), saveBuild(), POST()

### Community 4 - "Community 4"
Cohesion: 0.5
Nodes (1): deleteBlob()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (4): executing-plans, grill-me, Plan Node, writing-plans

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (0): 

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (2): graphify, Graphify-First Development Agent

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (1): writing-skills

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (1): Vercel Blob Storage

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (1): Vercel KV Database

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (1): brainstorming

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (1): systematic-debugging

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (1): test-driven-development

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (1): caveman

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (1): requesting-code-review

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (1): receiving-code-review

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (1): finishing-a-development-branch

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (1): using-git-worktrees

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (1): dispatching-parallel-agents

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (1): subagent-driven-development

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (1): verification-before-completion

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (1): Decision Node

## Knowledge Gaps
- **23 isolated node(s):** `JSZip Library`, `XML Plist Format`, `Build ID Security`, `Delete Token Security`, `Vercel Blob Storage` (+18 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 7`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (2 nodes): `ResultCard()`, `result-card.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (2 nodes): `UploadArea()`, `upload-area.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (2 nodes): `graphify`, `Graphify-First Development Agent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `writing-skills`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `tailwind.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `next.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `vitest.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `setup.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `ipa-parser.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `kv.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `api.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `app-info-card.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `storage-bar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `Vercel Blob Storage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `Vercel KV Database`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `brainstorming`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `systematic-debugging`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `test-driven-development`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `caveman`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `requesting-code-review`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `receiving-code-review`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `finishing-a-development-branch`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `using-git-worktrees`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `dispatching-parallel-agents`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `subagent-driven-development`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `verification-before-completion`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `Decision Node`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GET()` connect `Community 1` to `Community 3`, `Community 4`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `deleteBlob()` connect `Community 4` to `Community 1`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `GET()` (e.g. with `registerBuild()` and `getBuild()`) actually correct?**
  _`GET()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `POST()` (e.g. with `incrementStorage()` and `decrementStorage()`) actually correct?**
  _`POST()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `registerBuild()` (e.g. with `GET()` and `incrementStorage()`) actually correct?**
  _`registerBuild()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `handleDelete()` (e.g. with `getBuildIdByDeleteToken()` and `getBuild()`) actually correct?**
  _`handleDelete()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `IPA OTA Installer` (e.g. with `Upload Component` and `Register API`) actually correct?**
  _`IPA OTA Installer` has 6 INFERRED edges - model-reasoned connections that need verification._