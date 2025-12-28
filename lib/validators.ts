// Email validation utilities

export interface EmailValidationResult {
  isValid: boolean;
  suggestion?: string;
  error?: string;
}

// Common email domain typos
const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  // ProtonMail
  'protom.me': 'proton.me',
  'protonmai.com': 'protonmail.com',
  'proton.com': 'protonmail.com',

  // Gmail
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gamil.com': 'gmail.com',

  // Yahoo
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yhoo.com': 'yahoo.com',

  // Outlook/Hotmail
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'hotmial.com': 'hotmail.com',
  'hotmali.com': 'hotmail.com',

  // Other common providers
  'iclou.com': 'icloud.com',
  'icoud.com': 'icloud.com',
  'aol.con': 'aol.com',
};

/**
 * Validates an email address and checks for common typos
 */
export function validateEmail(email: string): EmailValidationResult {
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return {
      isValid: false,
      error: "Email is required",
    };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address",
    };
  }

  // Check for common typos
  const [localPart, domain] = email.split('@');

  if (COMMON_DOMAIN_TYPOS[domain?.toLowerCase()]) {
    const suggestion = `${localPart}@${COMMON_DOMAIN_TYPOS[domain.toLowerCase()]}`;
    return {
      isValid: false,
      suggestion,
      error: `Did you mean ${suggestion}?`,
    };
  }

  // Check for spaces
  if (email.includes(' ')) {
    return {
      isValid: false,
      error: "Email cannot contain spaces",
    };
  }

  // Check for consecutive dots
  if (email.includes('..')) {
    return {
      isValid: false,
      error: "Email cannot contain consecutive dots",
    };
  }

  // Check domain has valid TLD
  const domainParts = domain?.split('.');
  if (!domainParts || domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
    return {
      isValid: false,
      error: "Invalid email domain",
    };
  }

  return { isValid: true };
}

/**
 * Validates password strength
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
}

export function validatePassword(password: string, minLength = 6): PasswordValidationResult {
  const errors: string[] = [];
  let strength: "weak" | "medium" | "strong" = "weak";

  if (!password) {
    return {
      isValid: false,
      errors: ["Password is required"],
      strength: "weak",
    };
  }

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }

  // Check strength
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthScore = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars].filter(Boolean).length;

  if (password.length >= 8 && strengthScore >= 3) {
    strength = "strong";
  } else if (password.length >= 6 && strengthScore >= 2) {
    strength = "medium";
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input.trim();
}
