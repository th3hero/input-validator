# @th3hero/input-validator

A lightweight, flexible validation library for React and Next.js applications. Validate user inputs with ease using a simple rule-based system and manage validation errors with React state.

[![npm version](https://img.shields.io/npm/v/@th3hero/input-validator.svg)](https://www.npmjs.com/package/@th3hero/input-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @th3hero/input-validator
# or
yarn add @th3hero/input-validator
```

## Features

- Simple rule-based validation syntax
- Built-in support for React state management
- TypeScript support
- Customizable error messages
- Extensive validation rules for common use cases
- Lightweight with minimal dependencies

## Basic Usage

```jsx
import React, { useState } from 'react';
import validateInput from '@th3hero/input-validator';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rules = {
      email: 'required|email',
      password: 'required|min:8'
    };

    const isValid = await validateInput(formData, rules, setErrors);

    if (isValid) {
      // Proceed with form submission
      console.log('Form is valid!', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </div>

      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
```

## Available Validation Rules

| Rule | Description | Example |
|------|-------------|---------|
| `required` | Field must not be empty | `'required'` |
| `not-empty` | Field must not be an empty string | `'not-empty'` |
| `nullable` | Field can be null | `'nullable'` |
| `min:n` | String must be at least n characters | `'min:8'` |
| `max:n` | String must not exceed n characters | `'max:100'` |
| `digits:n` | String must be exactly n characters long | `'digits:6'` |
| `email` | Field must be a valid email address | `'email'` |
| `password` | Field must be a strong password (8+ chars, letters, numbers, special chars) | `'password'` |
| `confirm_password` | Field must match the confirm_password field | `'confirm_password'` |
| `in:a,b,c` | Field must be one of the specified values | `'in:admin,user,guest'` |
| `date` | Field must be a valid date | `'date'` or `'date:YYYY-MM-DD'` |
| `future` | Field must be a date in the future | `'future'` |
| `past` | Field must be a date in the past | `'past'` |
| `string` | Field must be a string | `'string'` |
| `integer` | Field must be an integer | `'integer'` |
| `numeric` | Field must be a numeric value | `'numeric'` |
| `boolean` | Field must be a boolean | `'boolean'` |
| `url` | Field must be a valid URL | `'url'` |
| `min_value:n` | Numeric value must be at least n | `'min_value:10'` |
| `max_value:n` | Numeric value must not exceed n | `'max_value:100'` |
| `required_if:field,value` | Field is required when another field equals a value | `'required_if:type,premium'` |

## Combining Rules

You can combine multiple validation rules using the pipe character (`|`):

```javascript
const rules = {
  username: 'required|min:3|max:20',
  email: 'required|email',
  age: 'required|integer|min_value:18',
  website: 'nullable|url'
};
```

## Custom Error Messages

You can provide custom error messages for validation rules:

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  const rules = {
    email: 'required|email',
    password: 'required|min:8'
  };

  const customMessages = {
    'required': 'This field is required',
    'email': 'Please enter a valid email address',
    'password.min': 'Your password must be at least 8 characters long',
    'email.required': 'Email address is required to log in'
  };

  const isValid = await validateInput(formData, rules, setErrors, customMessages);

  if (isValid) {
    // Proceed with form submission
  }
};
```

Custom messages can be specified for:
- Generic rules: `'required': 'This field is required'`
- Field-specific rules: `'email.required': 'Email address is required'`

## TypeScript Support

The package includes TypeScript definitions:

```typescript
import validateInput from '@th3hero/input-validator';
import { useState } from 'react';

interface FormData {
  email: string;
  password: string;
}

const [formData, setFormData] = useState<FormData>({
  email: '',
  password: ''
});

const [errors, setErrors] = useState<Record<string, string>>({});

// Type checking for validateInput function
const isValid = await validateInput(
  formData,
  {
    email: 'required|email',
    password: 'required|min:8'
  },
  setErrors
);
```

## Testing

The package includes a comprehensive test suite built with Jest. The tests cover all validation rules, edge cases, and React integration.

### Running Tests

To run the tests:

```bash
npm test
```

### Test Coverage

The test suite includes:

1. **Basic Validation Tests**: Tests for required fields, nullable fields, and not-empty validation.
2. **String Validation Tests**: Tests for min, max, and digits validation rules.
3. **Email Validation Tests**: Tests for valid and invalid email addresses.
4. **Password Validation Tests**: Tests for password strength and confirmation.
5. **Date Validation Tests**: Tests for date format, future dates, and past dates.
6. **Type Validation Tests**: Tests for string, integer, and boolean types.
7. **Numeric Validation Tests**: Tests for numeric values, min_value, and max_value.
8. **URL Validation Tests**: Tests for valid and invalid URLs.
9. **List Validation Tests**: Tests for the 'in' validation rule.
10. **Conditional Validation Tests**: Tests for the required_if rule.
11. **Custom Error Messages Tests**: Tests for generic and field-specific custom error messages.
12. **React Integration Tests**: Tests for proper integration with React's state management.

### Writing New Tests

If you want to add new tests, place them in the `__tests__` directory. Follow the existing test patterns for consistency.

## License

MIT © [Alok Kumar](https://github.com/th3hero)
