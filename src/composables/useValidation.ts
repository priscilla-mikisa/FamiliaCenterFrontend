import { ref } from 'vue';

export const useValidation = () => {
  const errors = ref<Record<string, string>>({});

  const validateSignUpForm = (formData: {
    first_name?: string;
    last_name?: string;
    name?: string;
    email: string;
    password: string;
    confirmPassword: string;
    userRole: string;
    specialization?: string;
    agreeToTerms: boolean;
    phone_number?: string;
    country_code?: string;
  }) => {
    errors.value = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.userRole) {
      errors.value.userRole = 'Please select your role';
      return false;
    }

    if (formData.first_name !== undefined && formData.last_name !== undefined) {
      if (!formData.first_name.trim()) {
        errors.value.first_name = 'First name is required';
      } else if (formData.first_name.trim().length < 2) {
        errors.value.first_name = 'First name must be at least 2 characters';
      }

      if (!formData.last_name.trim()) {
        errors.value.last_name = 'Last name is required';
      } else if (formData.last_name.trim().length < 2) {
        errors.value.last_name = 'Last name must be at least 2 characters';
      }
    } else if (formData.name) {
      if (!formData.name.trim()) {
        errors.value.name = 'Full name is required';
      } else if (formData.name.trim().length < 2) {
        errors.value.name = 'Name must be at least 2 characters';
      } else if (formData.name.trim().split(' ').length < 2) {
        errors.value.name = 'Please enter both first and last name';
      }
    } else {
      errors.value.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.value.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.value.email = 'Please enter a valid email address';
    }

    if (formData.phone_number !== undefined && !formData.phone_number.trim()) {
      errors.value.phone_number = 'Phone number is required';
    }

    if (formData.country_code !== undefined && !formData.country_code) {
      errors.value.country_code = 'Country is required';
    }

    if (formData.userRole === 'counselor' && !formData.specialization) {
      errors.value.specialization = 'Specialization is required for counselors';
    }

    if (!formData.password) {
      errors.value.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.value.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      errors.value.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      errors.value.username = 'Email is required';
    } else if (!emailRegex.test(formData.username)) {
      errors.value.username = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.value.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.value.password = 'Password must be at least 8 characters';
    }

    return Object.keys(errors.value).length === 0;
  };

  const validateSessionBookingForm = (formData: {
    counsellor_id: number | null;
    session_date: string;
    session_time: string;
    notes?: string;
  }) => {
    errors.value = {};

    if (!formData.counsellor_id) {
      errors.value.counsellor_id = 'Please select a counsellor';
    }

    if (!formData.session_date) {
      errors.value.session_date = 'Please select a session date';
    } else {
      const selectedDate = new Date(formData.session_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.value.session_date = 'Session date cannot be in the past';
      }
    }

    if (!formData.session_time) {
      errors.value.session_time = 'Please select a session time';
    } else {
      const [hours] = formData.session_time.split(':').map(Number);
      if (hours < 9 || hours >= 18) {
        errors.value.session_time = 'Please select a time between 9:00 AM and 6:00 PM';
      }
    }

    return Object.keys(errors.value).length === 0;
  };

  const validateContactForm = (formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    errors.value = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errors.value.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.value.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.value.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.value.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      errors.value.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      errors.value.subject = 'Subject must be at least 3 characters';
    }

    if (!formData.message.trim()) {
      errors.value.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.value.message = 'Message must be at least 10 characters';
    }

    return Object.keys(errors.value).length === 0;
  };

  const validateOTPCode = (otpCode: string) => {
    errors.value = {};

    if (!otpCode) {
      errors.value.otpCode = 'OTP code is required';
    } else if (!/^\d{6}$/.test(otpCode)) {
      errors.value.otpCode = 'OTP code must be 6 digits';
    }

    return Object.keys(errors.value).length === 0;
  };

  const clearErrors = () => {
    errors.value = {};
  };

  const clearError = (field: string) => {
    if (errors.value[field]) {
      delete errors.value[field];
    }
  };

  const setError = (field: string, message: string) => {
    errors.value[field] = message;
  };

  return {
    errors,
    validateSignUpForm,
    validateLoginForm,
    validateSessionBookingForm,
    validateContactForm,
    validateOTPCode,
    clearErrors,
    clearError,
    setError
  };
};
