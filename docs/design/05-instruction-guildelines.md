# UI Interaction Guidelines

## Purpose

This document defines the interaction behavior of the Workflow Automation Engine frontend.

While the Design System defines how components look, this document defines how they behave.

The primary goals are:

- Consistency
- Predictability
- Fast administration workflows
- Minimal accidental user actions
- Future compatibility with DAG-based workflows

These guidelines apply across all pages and components.

---

# Core Principles

## 1. Single Source of Truth

The backend remains the source of truth.

The frontend may temporarily hold unsaved changes locally, but all persistent state must originate from the backend.

---

## 2. Explicit User Actions

The application never performs destructive or persistent operations automatically.

Examples:

✓ User clicks **Save Workflow**

→ Changes are persisted.

✗ Reordering steps should not automatically save.

---

## 3. Immediate Visual Feedback

Every user interaction must provide immediate feedback.

Examples:

- Selected step becomes highlighted.
- Hover states appear instantly.
- Loading indicators appear during API calls.
- Success and error notifications appear after operations complete.

The user should never wonder if an action was registered.

---

## 4. Non-Blocking Interface

Whenever possible, the UI should remain interactive.

Background requests should not freeze the application.

Examples:

- Provider schemas load asynchronously.
- Workflow list refreshes in the background.
- Execution polling updates without blocking editing.

---

# Workflow Builder Interactions

## Selecting a Step

Single click:

- Selects the step.
- Highlights the step.
- Opens the configuration panel.
- Loads provider configuration if necessary.

Only one step may be selected at a time.

---

## Deselecting

Clicking an empty area clears the current selection.

The configuration panel displays a placeholder state.

---

## Reordering Steps

Dragging a step:

- Updates only the local Zustand store.
- Does not communicate with the backend.

The workflow is only updated after clicking **Save Workflow**.

---

## Adding a Step

Clicking "Add Step":

- Opens the Provider Selector.
- User selects a Trigger or Action.
- A new Step Card is inserted.
- The new step becomes selected automatically.

---

## Removing a Step

Deleting a step requires confirmation.

Example:

Delete "Discord Notification"?

[ Cancel ]

[ Delete ]

Deletion is applied locally until the workflow is saved.

---

## Editing Configuration

Changes inside the configuration panel:

- Update local editor state immediately.
- Do not perform API requests.
- Mark the workflow as having unsaved changes.

---

## Unsaved Changes

Whenever local state differs from backend state:

- Display an "Unsaved Changes" indicator.
- Enable the Save button.
- Warn before leaving the page.

---

# Configuration Panel

The configuration panel always reflects the currently selected step.

Changing selection:

- Discards temporary validation state.
- Loads the appropriate provider schema.
- Renders the Dynamic Form.

If no step is selected:

Display an empty placeholder.

Example:

"Select a workflow step to configure its properties."

---

# Dynamic Form Behavior

The DynamicForm component is schema-driven.

It never contains provider-specific logic.

For every field:

- Display label.
- Display description if available.
- Display validation errors inline.
- Show default values when defined.

Unsupported field types must display a safe fallback message instead of crashing.

---

# Validation

Validation occurs in two stages.

## Local Validation

Runs immediately while typing.

Examples:

- Required fields
- Numeric ranges
- Invalid URLs
- Empty values

Errors appear inline.

---

## Backend Validation

Runs when saving.

Backend validation errors are displayed without losing local user input.

---

# API Operations

## Loading

Display loading indicators.

Never leave blank screens.

---

## Success

Display a non-intrusive success notification.

Example:

✓ Workflow saved successfully.

---

## Failure

Display a clear error notification.

Example:

Unable to save workflow.

The local changes remain intact.

---

# Execution History

Refreshing execution history:

- Never resets filters.
- Never resets pagination.
- Never interrupts scrolling.

New executions should appear automatically.

---

# Tables

Rows:

- Highlight on hover.
- Select on click.
- Support keyboard navigation where possible.

Double-clicking a workflow opens the editor.

---

# Search

Search inputs should:

- Debounce requests.
- Preserve search text during refreshes.
- Never clear automatically.

---

# Empty States

Every empty page should explain why it is empty.

Examples:

No workflows created.

Create your first workflow to begin automating tasks.

---

No executions found.

Workflow executions will appear here after a trigger runs.

---

# Confirmation Dialogs

Confirmation dialogs are required for:

- Delete Workflow
- Delete Step
- Reset Configuration
- Discard Unsaved Changes

Confirmation is not required for non-destructive actions.

---

# Keyboard Shortcuts

Recommended shortcuts:

Ctrl + S

Save Workflow

Delete

Delete selected step

Esc

Close dialog / deselect step

Ctrl + F

Focus search

Arrow Keys

Navigate lists

Future versions may include additional editor shortcuts.

---

# Notifications

Use toast notifications for:

- Save successful
- Delete successful
- Execution started
- Execution completed
- API failures

Notifications should never block interaction.

---

# Error Handling

Unexpected frontend errors should:

- Display a friendly fallback message.
- Preserve user data whenever possible.
- Avoid forcing a page refresh.

The application should fail gracefully.

---

# Accessibility

Interactive elements must support:

- Keyboard navigation
- Visible focus indicators
- Proper labels
- Sufficient color contrast

Icons alone must never communicate critical information.

---

# Future Compatibility

These interaction rules are designed to remain valid after introducing DAG workflows.

Future visual node editors should preserve:

- Explicit Save behavior
- Dynamic configuration panels
- Schema-driven forms
- Selection behavior
- Validation flow

Only the workflow canvas implementation should change.

The surrounding interaction model should remain consistent.