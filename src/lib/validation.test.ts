/**
 * Unit tests for validation utilities
 * Tests cover: title validation, description limits, past date prevention, tag validation
 */

import { validateTaskField, validateAllFields } from './validation';

describe('Validation Tests', () => {
  // Test Suite 1: Title validation
  describe('Title Validation', () => {
    test('should reject empty title', () => {
      const error = validateTaskField('title', '', undefined);
      expect(error).toBe('Title is required');
    });

    test('should reject title shorter than 3 characters', () => {
      const error = validateTaskField('title', 'ab', undefined);
      expect(error).toBe('Title must be between 3 and 100 characters');
    });

    test('should reject title longer than 100 characters', () => {
      const longTitle = 'a'.repeat(101);
      const error = validateTaskField('title', longTitle, undefined);
      expect(error).toBe('Title must be between 3 and 100 characters');
    });

    test('should accept valid title', () => {
      const error = validateTaskField('title', 'Valid Task Title', undefined);
      expect(error).toBeUndefined();
    });
  });

  // Test Suite 2: Description validation
  describe('Description Validation', () => {
    test('should accept empty description', () => {
      const error = validateTaskField('description', '', undefined);
      expect(error).toBeUndefined();
    });

    test('should reject description longer than 500 characters', () => {
      const longDesc = 'a'.repeat(501);
      const error = validateTaskField('description', longDesc, undefined);
      expect(error).toBe('Description cannot exceed 500 characters');
    });

    test('should accept valid description', () => {
      const error = validateTaskField('description', 'This is a valid description', undefined);
      expect(error).toBeUndefined();
    });
  });

  // Test Suite 3: Due date validation
  describe('Due Date Validation', () => {
    test('should reject past date for new task', () => {
      const pastDate = '2020-01-01';
      const error = validateTaskField('dueDate', pastDate, undefined);
      expect(error).toBe('Due date cannot be in the past');
    });

    test('should allow past date when editing', () => {
      const pastDate = '2020-01-01';
      const error = validateTaskField('dueDate', pastDate, '2021-01-01');
      expect(error).toBeUndefined();
    });

    test('should accept future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      const futureDateStr = futureDate.toISOString().split('T')[0];
      const error = validateTaskField('dueDate', futureDateStr, undefined);
      expect(error).toBeUndefined();
    });

    test('should accept empty due date', () => {
      const error = validateTaskField('dueDate', '', undefined);
      expect(error).toBeUndefined();
    });
  });

  // Test Suite 4: Tags validation
  describe('Tags Validation', () => {
    test('should accept empty tags', () => {
      const error = validateTaskField('tags', '', undefined);
      expect(error).toBeUndefined();
    });

    test('should reject more than 10 tags', () => {
      const manyTags = 'tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10, tag11';
      const error = validateTaskField('tags', manyTags, undefined);
      expect(error).toBe('Maximum 10 tags allowed');
    });

    test('should reject tag longer than 30 characters', () => {
      const invalidTag = 'this is a very long tag that exceeds thirty chars';
      const error = validateTaskField('tags', invalidTag, undefined);
      expect(error).toBeTruthy();
    });

    test('should reject duplicate tags', () => {
      const duplicateTags = 'important, urgent, important';
      const error = validateTaskField('tags', duplicateTags, undefined);
      expect(error).toBe('Duplicate tags are not allowed');
    });

    test('should accept valid tags', () => {
      const validTags = 'design, urgent, client';
      const error = validateTaskField('tags', validTags, undefined);
      expect(error).toBeUndefined();
    });
  });

  // Test Suite 5: Complete form validation
  describe('Complete Form Validation', () => {
    test('should return multiple errors for invalid form', () => {
      const errors = validateAllFields('', '', 'invalid-date', 'a, a', undefined);
      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors.title).toBeDefined();
    });

    test('should pass for valid complete form', () => {
      const errors = validateAllFields('Valid Title', 'A description', '', '', undefined);
      expect(Object.keys(errors).length).toBe(0);
    });

    test('should allow optional fields to be empty', () => {
      const errors = validateAllFields('Valid Title', '', '', '', undefined);
      expect(errors.description).toBeUndefined();
      expect(errors.dueDate).toBeUndefined();
      expect(errors.tags).toBeUndefined();
    });
  });
});

/**
 * Example test execution and expected results:
 * 
 * Run with: npm test -- validation.test.ts
 * 
 * Expected Output:
 * ✓ Title Validation (4 tests)
 * ✓ Description Validation (3 tests)
 * ✓ Due Date Validation (4 tests)
 * ✓ Tags Validation (5 tests)
 * ✓ Complete Form Validation (3 tests)
 * 
 * Total: 19 tests passing
 */
