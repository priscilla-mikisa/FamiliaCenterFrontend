import { ref } from 'vue';

export const useValidation = () => {
  const errors = ref<Record<string, string>>({});

  const validateSignUpForm = (formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
  }) => {
    errors.value = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errors.value.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.value.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.value.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.value.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.value.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.value.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.value.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      errors.value.password = 'Password must contain at least one number';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.value.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      errors.value.agreeToTerms = 'You must agree to the terms and conditions';
    }

    return Object.keys(errors.value).length === 0;
  };

  const validateLoginForm = (formData: {
    username: string;
    password: string;
  }) => {
    errors.value = {};

    if (!formData.username.trim()) {
      errors.value.username = 'Username is required';
    }

    if (!formData.password) {
      errors.value.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.value.password = 'Password must be at least 8 characters';
    }

    return Object.keys(errors.value).length === 0;
  };

  return {
    errors,
    validateSignUpForm,
    validateLoginForm
  };
};
