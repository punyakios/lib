/**
 * PunyaKios SDK for Node.js (v18+)
 * The Official SDK for PunyaKios Merchant API
 */
const crypto = require('crypto');

class PunyaKios {
    /**
     * Transaction Status Constants
     */
    static STATUS = {
        PENDING: 'pending',
        SUCCESS: 'success',
        FAILED: 'failed',
        EXPIRED: 'expired'
    };

    constructor(apiKey, baseUrl = 'https://punyakios.web.id/api/merchant') {
        if (!apiKey) {
            throw new Error('PunyaKios SDK Error: API Key is required');
        }
        this.apiKey = apiKey;
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }

    /**
     * Create a payment request (QRIS)
     * @param {Object} data - { external_id, amount, description, callback_url }
     */
    async createPaymentRequest(data) {
        return this.request('POST', '/payment-request', data);
    }

    /**
     * Get merchant profile information
     */
    async getProfile() {
        return this.request('POST', '/profile');
    }

    /**
     * Get merchant transaction history
     */
    async getTransactions() {
        return this.request('POST', '/transactions');
    }

    /**
     * Check specific transaction status
     * @param {string} external_id - The external ID of the transaction
     */
    async getTransactionStatus(external_id) {
        if (!external_id) {
            throw new Error('PunyaKios SDK Error: external_id is required');
        }
        return this.request('POST', '/check-status', { external_id });
    }

    /**
     * Helper to parse incoming callback from PunyaKios
     * @param {Object|String} body - The request body from your web server
     */
    static parseCallback(body) {
        if (typeof body === 'string') {
            try {
                return JSON.parse(body);
            } catch (e) {
                throw new Error('PunyaKios SDK Error: Invalid JSON in callback body');
            }
        }
        return body;
    }

    /**
     * Verify callback signature to ensure it's from PunyaKios
     * @param {Object|String} body - The raw request body
     * @param {String} signature - The X-PunyaKios-Signature header
     * @param {String} secretKey - Your API Key (used as secret)
     */
    static verifySignature(body, signature, secretKey) {
        if (!signature || !secretKey) return false;
        
        const payload = typeof body === 'string' ? body : JSON.stringify(body);
        const expectedSignature = crypto
            .createHmac('sha256', secretKey)
            .update(payload)
            .digest('hex');
            
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    }

    async request(method, endpoint, data = null) {
        const options = {
            method,
            headers: {
                'X-API-Key': this.apiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'PunyaKios-NodeSDK/1.0.2'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, options);
            const result = await response.json();
            
            return {
                status_code: response.status,
                success: response.ok,
                data: result
            };
        } catch (error) {
            throw new Error(`PunyaKios SDK Error: ${error.message}`);
        }
    }
}

module.exports = PunyaKios;
