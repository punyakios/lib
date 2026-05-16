/**
 * PunyaKios SDK for Node.js (v18+)
 */
class PunyaKios {
    constructor(apiKey, baseUrl = 'https://punyakios.web.id/api/merchant') {
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
     */
    async getTransactionStatus(external_id) {
        return this.request('POST', '/check-status', { external_id });
    }

    /**
     * Helper to parse incoming callback from PunyaKios
     * @param {Object|String} body - The request body from your web server
     */
    static parseCallback(body) {
        if (typeof body === 'string') {
            return JSON.parse(body);
        }
        return body;
    }

    async request(method, endpoint, data = null) {
        const options = {
            method,
            headers: {
                'X-API-Key': this.apiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
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
                data: result
            };
        } catch (error) {
            throw new Error(`PunyaKios SDK Error: ${error.message}`);
        }
    }
}

module.exports = PunyaKios;
