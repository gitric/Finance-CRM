# Firestore Collection Model

This internal demo uses top-level Firestore collections with Firebase Admin SDK access from Next.js server code. Document IDs are Firestore-generated IDs unless a future migration explicitly defines stable imported IDs.

The rules in `firestore.rules` are intentionally permissive for demo deployment and are not production-ready authorization.

## Common Conventions

- Canonical IDs are the Firestore document IDs exposed as `id` in application types.
- Related display names are duplicated on documents that need list rendering without SQL-style joins.
- Creation timestamps use `FieldValue.serverTimestamp()` and are read as ISO strings by the app.
- Date-only form values are stored as `YYYY-MM-DD` strings unless noted otherwise.

## `entities`

- Canonical ID: entity document ID.
- Fields: `name`, `industry`, `location`, `status`, `created_at`.
- Statuses: `active`, `inactive`.
- Timestamps: `created_at` is a Firestore server timestamp.

## `finance_managers`

- Canonical ID: finance manager document ID.
- Fields: `full_name`, `email`, `phone`, `status`, `entity_id`, `entity_name`, `created_at`.
- Duplicated display fields: `entity_name` duplicates the linked entity name at creation time.
- Statuses: `active`, `inactive`.
- Timestamps: `created_at` is a Firestore server timestamp.

## `training_programs`

- Canonical ID: training program document ID.
- Fields: `title`, `description`, `duration_hours`, `status`, `created_at`.
- Statuses: `active`, `inactive`.
- Timestamps: `created_at` is a Firestore server timestamp.

## `certifications`

- Canonical ID: certification document ID.
- Fields: `manager_id`, `program_id`, `manager_name`, `program_title`, `issued_at`, `expires_at`, `status`.
- Duplicated display fields: `manager_name` and `program_title` duplicate linked documents at issue time.
- Statuses: `valid`, `expired`, `revoked`.
- Timestamps: `issued_at` is a Firestore server timestamp. `expires_at` is a date string or `null`.

## `audits`

- Canonical ID: audit document ID.
- Fields: `entity_id`, `manager_id`, `entity_name`, `manager_name`, `audit_year`, `due_date`, `status`, `created_at`, `completed_at`, `findings`.
- Duplicated display fields: `entity_name` and `manager_name` duplicate linked documents at scheduling time.
- Statuses: `scheduled`, `in_progress`, `completed`.
- Timestamps: `created_at` and `completed_at` are Firestore server timestamps. `due_date` is a date string.
