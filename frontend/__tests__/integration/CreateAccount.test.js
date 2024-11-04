// __tests__/CreateAccount.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CreateAccount } from '../../screens/CreateAccount.js';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper'); // Mock for Animated

describe('CreateAccount Component', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<CreateAccount navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />);

    // Check if all input fields are rendered
    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Phone Number')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();

    // Check if the Create Account button is rendered
    expect(getByText('Create Account')).toBeTruthy();
  });

  it('validates inputs correctly', async () => {
    const { getByPlaceholderText, getByText } = render(<CreateAccount navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />);

    // Simulate input changes
    fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john.doe@example.com');
    fireEvent.changeText(getByPlaceholderText('Phone Number'), '123-456-7890');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    // Simulate blur events to trigger validation
    fireEvent.blur(getByPlaceholderText('Name'));
    fireEvent.blur(getByPlaceholderText('Email'));
    fireEvent.blur(getByPlaceholderText('Phone Number'));
    fireEvent.blur(getByPlaceholderText('Password'));

    // Check if validation messages are not displayed
    await waitFor(() => {
      expect(getByText('Create Account')).not.toBeDisabled();
    });
  });

  it('displays validation messages for invalid inputs', async () => {
    const { getByPlaceholderText, getByText } = render(<CreateAccount navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />);

    // Simulate input changes with invalid data
    fireEvent.changeText(getByPlaceholderText('Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john.doe');
    fireEvent.changeText(getByPlaceholderText('Phone Number'), '1234567890');
    fireEvent.changeText(getByPlaceholderText('Password'), 'pass');

    // Simulate blur events to trigger validation
    fireEvent.blur(getByPlaceholderText('Name'));
    fireEvent.blur(getByPlaceholderText('Email'));
    fireEvent.blur(getByPlaceholderText('Phone Number'));
    fireEvent.blur(getByPlaceholderText('Password'));

    // Check if validation messages are displayed
    await waitFor(() => {
      expect(getByText('Name must be at least 5 characters long')).toBeTruthy();
      expect(getByText('Please prove a valid email')).toBeTruthy();
      expect(getByText('Format XXX-XXX-XXXX expected')).toBeTruthy();
      expect(getByText('Password must be at least 8 characters long')).toBeTruthy();
    });
  });
});