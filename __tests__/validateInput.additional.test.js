const validateInput = require('../index');
const moment = require('moment');

// Mock setState function
const mockSetState = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  mockSetState.mockClear();
});

describe('validateInput - Additional Tests', () => {
  // Date validation tests
  describe('Date validation', () => {
    test('should pass validation for valid dates', async () => {
      const body = { birthdate: '2000-01-01' };
      const rules = { birthdate: 'date' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation for invalid dates', async () => {
      const body = { birthdate: 'not-a-date' };
      const rules = { birthdate: 'date' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        birthdate: expect.any(String)
      }));
    });

    test('should pass validation for dates with custom format', async () => {
      const body = { birthdate: '01/01/2000' };
      const rules = { birthdate: 'date:MM/DD/YYYY' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should pass validation for future dates when using future rule', async () => {
      // Create a date 1 year in the future
      const futureDate = moment().add(1, 'year').format('YYYY-MM-DD');
      const body = { eventDate: futureDate };
      const rules = { eventDate: 'future' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation for past dates when using future rule', async () => {
      // Create a date 1 year in the past
      const pastDate = moment().subtract(1, 'year').format('YYYY-MM-DD');
      const body = { eventDate: pastDate };
      const rules = { eventDate: 'future' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        eventDate: expect.any(String)
      }));
    });

    test('should pass validation for past dates when using past rule', async () => {
      // Create a date 1 year in the past
      const pastDate = moment().subtract(1, 'year').format('YYYY-MM-DD');
      const body = { birthdate: pastDate };
      const rules = { birthdate: 'past' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation for future dates when using past rule', async () => {
      // Create a date 1 year in the future
      const futureDate = moment().add(1, 'year').format('YYYY-MM-DD');
      const body = { birthdate: futureDate };
      const rules = { birthdate: 'past' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        birthdate: expect.any(String)
      }));
    });
  });

  // Type validation tests
  describe('Type validation', () => {
    test('should pass validation for string type', async () => {
      const body = { name: 'John' };
      const rules = { name: 'string' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation for non-string type', async () => {
      const body = { name: 123 };
      const rules = { name: 'string' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        name: expect.any(String)
      }));
    });

    test('should pass validation for integer type', async () => {
      const body = { age: 25 };
      const rules = { age: 'integer' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation for non-integer type', async () => {
      const body = { age: '25' };
      const rules = { age: 'integer' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        age: expect.any(String)
      }));
    });

    test('should pass validation for boolean type', async () => {
      const body = { isActive: true };
      const rules = { isActive: 'boolean' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation for non-boolean type', async () => {
      const body = { isActive: 'yes' };
      const rules = { isActive: 'boolean' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        isActive: expect.any(String)
      }));
    });
  });

  // Numeric validation tests
  describe('Numeric validation', () => {
    test('should pass validation for numeric values', async () => {
      const body = { price: 99.99 };
      const rules = { price: 'numeric' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation for non-numeric values', async () => {
      const body = { price: 'expensive' };
      const rules = { price: 'numeric' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        price: expect.any(String)
      }));
    });

    test('should pass validation when value meets min_value requirement', async () => {
      const body = { age: 21 };
      const rules = { age: 'min_value:18' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation when value is less than min_value', async () => {
      const body = { age: 16 };
      const rules = { age: 'min_value:18' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        age: expect.any(String)
      }));
    });

    test('should pass validation when value meets max_value requirement', async () => {
      const body = { quantity: 5 };
      const rules = { quantity: 'max_value:10' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation when value exceeds max_value', async () => {
      const body = { quantity: 15 };
      const rules = { quantity: 'max_value:10' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        quantity: expect.any(String)
      }));
    });
  });

  // URL validation tests
  describe('URL validation', () => {
    test('should pass validation for valid URLs', async () => {
      const body = { website: 'https://example.com' };
      const rules = { website: 'url' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should pass validation for valid URLs without protocol', async () => {
      const body = { website: 'example.com' };
      const rules = { website: 'url' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation for invalid URLs', async () => {
      const body = { website: 'not a url' };
      const rules = { website: 'url' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        website: expect.any(String)
      }));
    });
  });

  // List validation tests
  describe('List validation', () => {
    test('should pass validation when value is in the list', async () => {
      const body = { role: 'admin' };
      const rules = { role: 'in:admin,user,guest' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation when value is not in the list', async () => {
      const body = { role: 'superuser' };
      const rules = { role: 'in:admin,user,guest' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        role: expect.any(String)
      }));
    });
  });

  // Conditional validation tests
  describe('Conditional validation', () => {
    test('should pass validation when condition is met and field is provided', async () => {
      const body = { type: 'premium', code: 'PREMIUM123' };
      const rules = { code: 'required_if:type,premium' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation when condition is met and field is not provided', async () => {
      const body = { type: 'premium', code: '' };
      const rules = { code: 'required_if:type,premium' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        code: expect.any(String)
      }));
    });

    test('should pass validation when condition is not met and field is not provided', async () => {
      const body = { type: 'free', code: '' };
      const rules = { code: 'required_if:type,premium' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });
  });

  // Custom error messages tests
  describe('Custom error messages', () => {
    test('should use custom error messages when provided', async () => {
      const body = { name: '' };
      const rules = { name: 'required' };
      const customMessages = {
        'required': 'This field cannot be empty'
      };
      
      const result = await validateInput(body, rules, mockSetState, customMessages);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith({
        name: 'This field cannot be empty'
      });
    });

    test('should use field-specific custom error messages when provided', async () => {
      const body = { name: '', email: '' };
      const rules = { name: 'required', email: 'required' };
      const customMessages = {
        'required': 'This field cannot be empty',
        'name.required': 'Please enter your name'
      };
      
      const result = await validateInput(body, rules, mockSetState, customMessages);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith({
        name: 'Please enter your name',
        email: 'This field cannot be empty'
      });
    });
  });

  // Edge cases tests
  describe('Edge cases', () => {
    test('should handle empty rules object', async () => {
      const body = { name: 'John' };
      const rules = {};
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith({});
    });

    test('should handle empty body object', async () => {
      const body = {};
      const rules = { name: 'required' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith({
        name: expect.any(String)
      });
    });

    test('should handle multiple validation rules for a single field', async () => {
      const body = { username: 'jo' };
      const rules = { username: 'required|min:3|max:20' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith({
        username: expect.any(String)
      });
    });

    test('should stop validating a field after the first error', async () => {
      const body = { password: '' };
      const rules = { password: 'required|min:8|password' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      // Should only have the 'required' error, not the 'min' or 'password' errors
      expect(mockSetState).toHaveBeenCalledWith({
        password: expect.any(String)
      });
    });
  });
});