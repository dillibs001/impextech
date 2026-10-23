import test from 'node:test';
import assert from 'node:assert';

test('Auth: Email and Nigerian Phone Number Validation', () => {
    function validateEmail(email: string): boolean {
        return email.includes('@') && email.includes('.');
    }

    function validateNigerianPhone(phone: string): boolean {
        // Supports 080..., 090..., 070..., 081..., or +234...
        const cleaned = phone.replace(/[\s\-]/g, '');
        const ngRegex = /^(?:\+234|0)[789][01]\d{8}$/;
        return ngRegex.test(cleaned);
    }

    assert.strictEqual(validateEmail('customer@impextech.ng'), true);
    assert.strictEqual(validateEmail('invalid-email'), false);

    assert.strictEqual(validateNigerianPhone('08060329221'), true);
    assert.strictEqual(validateNigerianPhone('+2349060329221'), true);
    assert.strictEqual(validateNigerianPhone('0812 345 6789'), true);
    assert.strictEqual(validateNigerianPhone('12345'), false);
});

test('Auth: Password Strength Minimum Policy', () => {
    function isPasswordSecure(password: string): boolean {
        return typeof password === 'string' && password.trim().length >= 6;
    }

    assert.strictEqual(isPasswordSecure('canada2026'), true);
    assert.strictEqual(isPasswordSecure('123456'), true);
    assert.strictEqual(isPasswordSecure('12345'), false);
    assert.strictEqual(isPasswordSecure(''), false);
});

test('Auth: Customer User Profile Merging & Address Update', () => {
    interface CustomerUser {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        address?: string;
        cityState?: string;
    }

    const initialUser: CustomerUser = {
        id: 'CUST-104928',
        firstName: 'Emeka',
        lastName: 'Nnamdi',
        email: 'emeka@gmail.com',
    };

    const updatePatch: Partial<CustomerUser> = {
        phone: '+2348060329221',
        address: '22 Admiralty Way, Lekki Phase 1',
        cityState: 'Lagos, Lagos State',
    };

    const mergedUser: CustomerUser = {
        ...initialUser,
        ...updatePatch,
    };

    assert.strictEqual(mergedUser.firstName, 'Emeka');
    assert.strictEqual(mergedUser.email, 'emeka@gmail.com');
    assert.strictEqual(mergedUser.phone, '+2348060329221');
    assert.strictEqual(mergedUser.address, '22 Admiralty Way, Lekki Phase 1');
    assert.strictEqual(mergedUser.cityState, 'Lagos, Lagos State');
});
