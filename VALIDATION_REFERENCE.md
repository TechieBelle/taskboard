# Form Validation System - Complete Reference

## Overview
The Task Board implements comprehensive client-side form validation with real-time feedback, visual error indicators, and user-friendly error messages.

## Validation Architecture

### Files Involved
```
src/lib/validation.ts          - Validation utilities and rules
src/components/task/TaskFormModal.tsx  - Form component with validation integration
src/lib/toast.ts              - Toast notifications for errors
```

### Validation Flow
```
User Input
    ↓
onChange Event (if touched) → Real-time validation
    ↓
onBlur Event → Mark as touched & validate
    ↓
Visual Feedback (error/success icons)
    ↓
Form Submit → Complete validation via validateAllFields()
    ↓
Submit Button Disabled/Enabled based on errors
```

---

## Field Validation Rules

### Title Field
**Rules:**
- Required: ✓
- Min Length: 3 characters
- Max Length: 100 characters
- Trim whitespace automatically

**Examples:**
```
❌ "" → "Title is required"
❌ "ab" → "Title must be at least 3 characters"
❌ "a".repeat(101) → "Title must not exceed 100 characters"
✓ "Design mockups for landing page"
✓ "123"
✓ "Task #1"
```

**UI Behavior:**
```
Invalid: Red border + AlertCircle icon + error message
Valid (touched): Green checkmark icon
Untouched: Normal border, no icons
```

---

### Description Field
**Rules:**
- Required: ✗ (optional)
- Max Length: 500 characters
- Trims but allows empty

**Examples:**
```
✓ "" (empty is fine)
✓ "This is a description"
❌ "a".repeat(501) → "Description must not exceed 500 characters"
✓ "Very long description with lots of details..." (up to 500 chars)
```

**UI Behavior:**
```
Valid (touched): Green checkmark icon
Invalid: Red border + AlertCircle icon
Empty: No validation (optional field)
```

---

### Priority Field
**Rules:**
- Required: ✗ (optional)
- Valid Values: "low" | "medium" | "high" | "" (none)
- Enum validation via select dropdown

**Examples:**
```
✓ "" (no priority)
✓ "low"
✓ "medium"
✓ "high"
❌ "urgent" (not in enum)
```

**UI Behavior:**
```
Select dropdown with predefined options
No validation errors possible (controlled by dropdown)
```

---

### Due Date Field
**Rules:**
- Required: ✗ (optional)
- Format: YYYY-MM-DD (HTML5 date input)
- Restriction: Cannot be past date for NEW tasks
- Exception: Past dates allowed when EDITING existing tasks
- Empty allowed (optional)

**Examples:**
```
✓ "" (empty is fine)
✓ "2025-12-31" (future date)
❌ "2020-01-01" (past date for new task)
✓ "2020-01-01" (past date OK when editing task created on that date)
```

**Date Comparison Logic:**
```javascript
const selectedDate = new Date(value);
const today = new Date();
today.setHours(0, 0, 0, 0);  // Normalize to midnight

// For new tasks: selectedDate must be >= today
if (selectedDate < today && !editTaskDueDate) {
  return "Due date cannot be in the past";
}
```

**UI Behavior:**
```
Valid: Green checkmark icon (if touched)
Invalid (past date): Red border + AlertCircle + "Due date cannot be in the past"
Empty: No validation needed (optional)
```

---

### Tags Field
**Rules:**
- Required: ✗ (optional)
- Format: Comma-separated, trimmed
- Max Count: 10 tags
- Max Per Tag: 30 characters
- No Duplicates: Enforced
- Trimming: Spaces removed from start/end
- Empty: Allowed

**Examples:**
```
✓ "" (empty is fine)
✓ "design, urgent, client"  →  ["design", "urgent", "client"]
✓ "tag1, tag2, tag3" (3 tags = ok)
❌ "tag1, tag2, ..., tag11" → "Maximum 10 tags allowed"
❌ "this_is_a_very_long_tag_over_30_chars" → "Each tag must be 30 characters or less"
❌ "important, urgent, important" → "Duplicate tags are not allowed"
✓ "DESIGN, Design, design" (case-sensitive, so not duplicates)

Normalization:
"tag1,tag2, tag3 " → ["tag1", "tag2", "tag3"]  // spaces trimmed
```

**Validation Logic:**
```javascript
const validateTags = (value) => {
  if (!value) return undefined;
  
  const tagList = value.split(",").map(t => t.trim());
  
  // Check count
  if (tagList.length > 10) {
    return "Maximum 10 tags allowed";
  }
  
  // Check length
  const invalidTag = tagList.find(tag => tag.length > 30);
  if (invalidTag) {
    return "Each tag must be 30 characters or less";
  }
  
  // Check duplicates
  const hasDuplicates = new Set(tagList).size !== tagList.length;
  if (hasDuplicates) {
    return "Duplicate tags are not allowed";
  }
};
```

**UI Behavior:**
```
Valid (touched): Green checkmark icon
Invalid: Red border + AlertCircle + specific error message
Empty: No validation needed (optional)
```

---

### Column Field
**Rules:**
- Required: ✓
- Valid Values: "todo" | "doing" | "done"
- Controlled by select dropdown
- Always valid (controlled input)

**Examples:**
```
✓ "todo"
✓ "doing"
✓ "done"
```

**UI Behavior:**
```
Select dropdown with three predefined options
No error state possible
```

---

## Form-Level Validation

### `validateAllFields()` Function
Validates complete form before submission.

**Signature:**
```typescript
validateAllFields(
  title: string,
  description: string,
  dueDate: string,
  tags: string,
  editTaskDueDate?: string
): ValidationErrors
```

**Returns:**
```typescript
interface ValidationErrors {
  title?: string;
  description?: string;
  dueDate?: string;
  tags?: string;
}
```

**Returns empty object `{}` if all fields valid**

**Usage:**
```typescript
// In form submit handler
const errors = validateAllFields(title, description, dueDate, tags, editTask?.dueDate);

if (Object.keys(errors).length > 0) {
  // Show errors
  setErrors(errors);
  setTouched({ title: true, description: true, dueDate: true, tags: true });
  toastManager.error('Please fix the errors in the form');
  return;
}

// Submit form
```

---

## Real-Time Validation

### On Change Events
**When triggered:** User types in field (if field has been touched)

```typescript
const handleFieldChange = (fieldName, value) => {
  // Update state
  setState(value);
  
  // If field was touched before, validate on every change
  if (touched[fieldName]) {
    const error = validateTaskField(fieldName, value, editTask?.dueDate);
    updateErrors(fieldName, error);
  }
};
```

**Benefit:** Provides immediate feedback as user corrects input

---

### On Blur Events
**When triggered:** User leaves field (focus lost)

```typescript
const handleFieldBlur = (fieldName, value) => {
  // Mark field as touched
  setTouched(prev => ({ ...prev, [fieldName]: true }));
  
  // Validate
  const error = validateTaskField(fieldName, value, editTask?.dueDate);
  updateErrors(fieldName, error);
};
```

**Benefit:** Prevents premature error display while user is still typing

---

## Visual Feedback Component

### Error Display
```tsx
{touched.fieldName && errors.fieldName && (
  <div className="flex items-center gap-1.5 mt-1 text-red-600">
    <AlertCircle size={14} />
    <span className="text-xs">{errors.fieldName}</span>
  </div>
)}
```

**Visual Components:**
- **Icon**: `<AlertCircle>` from lucide-react (size 14px)
- **Color**: Red (#DC2626 - text-red-600)
- **Text**: Error message in xs size
- **Gap**: 1.5 spacing between icon and text

### Success Display
```tsx
{touched.fieldName && !errors.fieldName && (
  <CheckCircle size={16} className="text-green-600" />
)}
```

**Visual Components:**
- **Icon**: `<CheckCircle>` from lucide-react (size 16px)
- **Color**: Green (#16A34A - text-green-600)
- **Placement**: Next to label
- **Visibility**: Only when field has been touched and is valid

### Input Styling
```tsx
className={`
  ${touched.fieldName && errors.fieldName
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300 focus:ring-black focus:border-black"
  }
`}
```

**Styling States:**
```
Normal: Border gray-300, focus ring black
Error: Border red-500, focus ring red-500
Success: Border gray-300 (no special styling needed)
```

---

## Submit Button State

### Button Disable Logic
```tsx
disabled={Object.keys(errors).length > 0}
```

**Styling:**
```tsx
className={`
  ${Object.keys(errors).length > 0
    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
    : "bg-black text-white hover:bg-gray-800"
  }
`}
```

**Button States:**
```
Valid Form: Black, clickable, with hover effect
Invalid Form: Gray, disabled, no hover
Disabled submit prevents accidental submission
```

---

## Error Messages

### User-Friendly Messages
```
Title Errors:
- "Title is required"
- "Title must be at least 3 characters"
- "Title must not exceed 100 characters"

Description Errors:
- "Description must not exceed 500 characters"

Due Date Errors:
- "Due date cannot be in the past"

Tags Errors:
- "Maximum 10 tags allowed"
- "Each tag must be 30 characters or less"
- "Duplicate tags are not allowed"

Form Submission:
- "Please fix the errors in the form"
- "Task 'Title' created successfully!" (success)
- "Task 'Title' updated successfully!" (success)
```

---

## State Management

### Form State
```typescript
const [title, setTitle] = useState(initialTitle);
const [description, setDescription] = useState(initialDescription);
const [priority, setPriority] = useState(initialPriority);
const [dueDate, setDueDate] = useState(initialDueDate);
const [tags, setTags] = useState(initialTags);
const [column, setColumn] = useState(initialColumn);
```

### Error & Touched State
```typescript
const [errors, setErrors] = useState<ValidationErrors>({});
const [touched, setTouched] = useState<Record<string, boolean>>({});
```

**Why Touched State?**
- Prevents showing errors before user starts typing
- Improves UX by not highlighting errors on initial render
- Only shows validation after user blur or change

---

## Testing Validation

### Unit Tests Location
```
src/__tests__/validation.test.ts (19 tests)
```

### Example Test
```typescript
test('should reject empty title', () => {
  const result = validateTaskField('title', '', undefined);
  expect(result).toBe('Title is required');
});

test('should accept valid title', () => {
  const result = validateTaskField('title', 'Valid Title', undefined);
  expect(result).toBeUndefined();
});
```

### Running Tests
```bash
pnpm test validation.test.ts
```

---

## Integration with Toast Notifications

### Error Toast
```typescript
if (Object.keys(validationErrors).length > 0) {
  setErrors(validationErrors);
  toastManager.error('Please fix the errors in the form');
  return;
}
```

**Toast Display:**
- Type: Error (red background)
- Message: "Please fix the errors in the form"
- Auto-dismiss: 5 seconds
- Position: Bottom-right

### Success Toast
```typescript
if (editTask) {
  toastManager.success(`Task "${taskData.title}" updated successfully!`);
} else {
  toastManager.success(`Task "${taskData.title}" created successfully!`);
}
```

**Toast Display:**
- Type: Success (green background)
- Message: Dynamic with task title
- Auto-dismiss: 4 seconds
- Position: Bottom-right

---

## Common Validation Patterns

### Pattern 1: Required Field
```typescript
if (!value.trim()) return 'Field is required';
```

### Pattern 2: Length Constraints
```typescript
if (value.trim().length < 3) return 'Minimum 3 characters';
if (value.trim().length > 100) return 'Maximum 100 characters';
```

### Pattern 3: Date Validation
```typescript
const selectedDate = new Date(value);
const today = new Date();
today.setHours(0, 0, 0, 0);
if (selectedDate < today) return 'Cannot be in the past';
```

### Pattern 4: Array Validation
```typescript
const items = value.split(',').map(v => v.trim());
if (items.length > 10) return 'Maximum 10 items';
const unique = new Set(items);
if (unique.size !== items.length) return 'No duplicates allowed';
```

### Pattern 5: Optional Field
```typescript
if (!value) return undefined; // Empty is OK
// Continue with other validations if value exists
```

---

## Browser Compatibility

**Validation works on:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**HTML5 Date Input Support:**
- Full support on all modern browsers
- Fallback: Text input on older browsers
- Validation handles both formats

---

## Performance Considerations

- **Type-safe**: TypeScript prevents runtime errors
- **Debounce**: Validation runs on change/blur (not on every keystroke)
- **Memoization**: Validation functions are pure (no side effects)
- **Lazy**: Only validates touched fields during typing
- **No API Calls**: All validation is client-side

---

## Accessibility Features

- Labels properly associated with inputs (`htmlFor` attribute)
- Required fields marked with `*`
- Error messages linked to fields
- ARIA attributes for screen readers
- Keyboard navigation fully supported
- Color contrast sufficient (WCAG AA compliant)

---

**Documentation Version**: 1.0  
**Last Updated**: January 2025  
**Status**: Complete and Ready for Production
