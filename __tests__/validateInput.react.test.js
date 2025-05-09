const validateInput = require('../index');
const React = require('react');
const { renderHook, act } = require('@testing-library/react-hooks');

describe('validateInput - React Integration', () => {
  test('should update React state with validation errors', async () => {
    // Setup a React hook with useState
    const { result } = renderHook(() => React.useState({}));
    const setState = result.current[1];
    
    // Test data
    const body = { name: '', email: 'invalid-email' };
    const rules = { name: 'required', email: 'email' };
    
    // Call validateInput
    await act(async () => {
      await validateInput(body, rules, setState);
    });
    
    // Check that state was updated with errors
    expect(result.current[0]).toEqual({
      name: expect.any(String),
      email: expect.any(String)
    });
  });
  
  test('should clear previous errors when validation passes', async () => {
    // Setup a React hook with useState and initial errors
    const { result } = renderHook(() => React.useState({
      name: 'Name is required',
      email: 'Invalid email'
    }));
    const setState = result.current[1];
    
    // Test data with valid values
    const body = { name: 'John Doe', email: 'john@example.com' };
    const rules = { name: 'required', email: 'email' };
    
    // Call validateInput
    await act(async () => {
      await validateInput(body, rules, setState);
    });
    
    // Check that state was updated with no errors
    expect(result.current[0]).toEqual({});
  });
  
  test('should handle multiple validation cycles', async () => {
    // Setup a React hook with useState
    const { result } = renderHook(() => React.useState({}));
    const setState = result.current[1];
    
    // First validation cycle - with errors
    const invalidBody = { username: 'a', password: '' };
    const rules = { username: 'required|min:3', password: 'required' };
    
    await act(async () => {
      await validateInput(invalidBody, rules, setState);
    });
    
    // Check that state was updated with errors
    expect(result.current[0]).toEqual({
      username: expect.any(String),
      password: expect.any(String)
    });
    
    // Second validation cycle - fixed username but password still invalid
    const partiallyValidBody = { username: 'johndoe', password: '' };
    
    await act(async () => {
      await validateInput(partiallyValidBody, rules, setState);
    });
    
    // Check that username error is cleared but password error remains
    expect(result.current[0]).toEqual({
      password: expect.any(String)
    });
    expect(result.current[0].username).toBeUndefined();
    
    // Third validation cycle - all valid
    const validBody = { username: 'johndoe', password: 'password123' };
    
    await act(async () => {
      await validateInput(validBody, rules, setState);
    });
    
    // Check that all errors are cleared
    expect(result.current[0]).toEqual({});
  });
  
  test('should work with functional state updates', async () => {
    // Setup a React hook with useState
    const { result } = renderHook(() => React.useState({}));
    const setState = result.current[1];
    
    // First set some initial state
    act(() => {
      setState({ otherField: 'some value' });
    });
    
    // Then validate with errors
    const body = { name: '' };
    const rules = { name: 'required' };
    
    await act(async () => {
      await validateInput(body, rules, setState);
    });
    
    // Check that state was completely replaced (not merged)
    expect(result.current[0]).toEqual({
      name: expect.any(String)
    });
    expect(result.current[0].otherField).toBeUndefined();
  });
});