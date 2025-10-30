export type PasswordStrength = 'Weak' | 'Medium' | 'Strong';

export function getPasswordStrength(password: string): { level: PasswordStrength; score: number } {
    if (!password) return { level: 'Weak', score: 0 };

    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const criteriaCount = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;

    // Rules per specification:
    // Weak: Password is fewer than 12 characters or lacks a mix of uppercase, lowercase, digits, and symbols.
    // Medium: Password is at least 12 characters and includes at least two of the criteria above.
    // Strong: Password is 15+ characters and includes all criteria.

    if (length >= 15 && hasUpper && hasLower && hasDigit && hasSymbol) {
        return { level: 'Strong', score: 3 };
    }

    if (length >= 12 && criteriaCount >= 2) {
        return { level: 'Medium', score: 2 };
    }

    return { level: 'Weak', score: 1 };
}

// Utility to map level to a color class/name if needed in components
export function strengthToColor(level: PasswordStrength): string {
    switch (level) {
        case 'Strong':
            return 'strong';
        case 'Medium':
            return 'medium';
        default:
            return 'weak';
    }
}
