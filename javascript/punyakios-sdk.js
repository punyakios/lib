/**
 * PunyaKios SDK for Browser (JavaScript)
 */
const PunyaKios = (function() {
    class SDK {
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
            this.apiKey = apiKey;
            this.baseUrl = baseUrl.replace(/\/$/, '');
        }

        async createPaymentRequest(data) {
            return this.request('POST', '/payment-request', data);
        }

        async getProfile() {
            return this.request('POST', '/profile');
        }

        async getTransactions() {
            return this.request('POST', '/transactions');
        }

        async getTransactionStatus(external_id) {
            return this.request('POST', '/check-status', { external_id });
        }

        async request(method, endpoint, data = null) {
            const options = {
                method,
                headers: {
                    'X-API-Key': this.apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-SDK-Platform': 'Browser'
                }
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            try {
                const response = await fetch(`${this.baseUrl}${endpoint}`, options);
                const result = await response.json();
                
                return {
                    success: response.ok,
                    status_code: response.status,
                    data: result
                };
            } catch (error) {
                console.error('PunyaKios SDK Error:', error);
                throw error;
            }
        }
    }

    return SDK;
})();

// Export for ES Modules or Global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PunyaKios;
} else {
    window.PunyaKios = PunyaKios;
}
