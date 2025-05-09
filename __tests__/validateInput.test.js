const validateInput = require('../index');
const moment = require('moment');

// Mock setState function
const mockSetState = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  mockSetState.mockClear();
});

describe('validateInput', () => {
  // Basic validation tests
  describe('Basic validation', () => {
    test('should pass validation when all required fields are provided', async () => {
      const body = { name: 'John', email: 'john@example.com' };
      const rules = { name: 'required', email: 'required' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation when required fields are missing', async () => {
      const body = { name: '', email: null };
      const rules = { name: 'required', email: 'required' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        name: expect.any(String),
        email: expect.any(String)
      }));
    });

    test('should pass validation for nullable fields with null values', async () => {
      const body = { name: 'John', optional: null };
      const rules = { name: 'required', optional: 'nullable|string' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation for not-empty fields with empty strings', async () => {
      const body = { name: '' };
      const rules = { name: 'not-empty' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        name: expect.any(String)
      }));
    });
  });

  // String validation tests
  describe('String validation', () => {
    test('should pass validation when string length meets min requirement', async () => {
      const body = { username: 'johndoe' };
      const rules = { username: 'min:6' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation when string length is less than min', async () => {
      const body = { username: 'john' };
      const rules = { username: 'min:6' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        username: expect.any(String)
      }));
    });

    test('should pass validation when string length meets max requirement', async () => {
      const body = { username: 'john' };
      const rules = { username: 'max:10' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation when string length exceeds max', async () => {
      const body = { username: 'johndoesmith' };
      const rules = { username: 'max:10' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        username: expect.any(String)
      }));
    });

    test('should pass validation when string length equals digits requirement', async () => {
      const body = { zipcode: '12345' };
      const rules = { zipcode: 'digits:5' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation when string length does not equal digits requirement', async () => {
      const body = { zipcode: '123456' };
      const rules = { zipcode: 'digits:5' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        zipcode: expect.any(String)
      }));
    });
  });

  // Email validation tests
  describe('Email validation', () => {
    test('should pass validation for valid email addresses', async () => {
      const body = { email: 'john.doe@example.com' };
      const rules = { email: 'email' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation for invalid email addresses', async () => {
      const body = { email: 'invalid-email' };
      const rules = { email: 'email' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        email: expect.any(String)
      }));
    });
  });

  // Password validation tests
  describe('Password validation', () => {
    test('should pass validation for strong passwords', async () => {
      const body = { password: 'StrongP@ss123' };
      const rules = { password: 'password' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation for weak passwords', async () => {
      const body = { password: 'weakpass' };
      const rules = { password: 'password' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        password: expect.any(String)
      }));
    });

    test('should pass validation when passwords match', async () => {
      const body = { password: 'StrongP@ss123', confirm_password: 'StrongP@ss123' };
      const rules = { password: 'confirm_password' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(true);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    test('should fail validation when passwords do not match', async () => {
      const body = { password: 'StrongP@ss123', confirm_password: 'DifferentP@ss' };
      const rules = { password: 'confirm_password' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        password: expect.any(String)
      }));
    });

    test('should fail validation when confirm_password is missing', async () => {
      const body = { password: 'StrongP@ss123' };
      const rules = { password: 'confirm_password' };
      
      const result = await validateInput(body, rules, mockSetState);
      
      expect(result).toBe(false);
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        password: expect.any(String)
      }));
    });
  });
});