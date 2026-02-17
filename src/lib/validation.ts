// Task form validation utilities

export interface ValidationErrors {
  title?: string;
  description?: string;
  dueDate?: string;
  tags?: string;
}

export const validateTaskField = (
  name: string,
  value: string,
  editTaskDueDate?: string
): string | undefined => {
  switch (name) {
    case "title":
      if (!value.trim()) return "Title is required";
      if (value.trim().length < 3) return "Title must be at least 3 characters";
      if (value.trim().length > 100) return "Title must not exceed 100 characters";
      return undefined;

    case "description":
      if (value && value.length > 500) return "Description must not exceed 500 characters";
      return undefined;

    case "dueDate":
      if (value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Only validate past dates for new tasks
        if (selectedDate < today && !editTaskDueDate) {
          return "Due date cannot be in the past";
        }
      }
      return undefined;

    case "tags":
      if (value) {
        const tagList = value.split(",").map((t) => t.trim());
        if (tagList.length > 10) return "Maximum 10 tags allowed";
        const invalidTag = tagList.find((tag) => tag.length > 30);
        if (invalidTag) return "Each tag must be 30 characters or less";
        const hasDuplicates = tagList.length !== new Set(tagList).size;
        if (hasDuplicates) return "Duplicate tags are not allowed";
      }
      return undefined;

    default:
      return undefined;
  }
};

export const validateAllFields = (
  title: string,
  description: string,
  dueDate: string,
  tags: string,
  editTaskDueDate?: string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const titleError = validateTaskField("title", title, editTaskDueDate);
  if (titleError) errors.title = titleError;

  const descriptionError = validateTaskField("description", description, editTaskDueDate);
  if (descriptionError) errors.description = descriptionError;

  const dueDateError = validateTaskField("dueDate", dueDate, editTaskDueDate);
  if (dueDateError) errors.dueDate = dueDateError;

  const tagsError = validateTaskField("tags", tags, editTaskDueDate);
  if (tagsError) errors.tags = tagsError;

  return errors;
};
