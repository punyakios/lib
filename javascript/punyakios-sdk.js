/**
 * PunyaKios SDK for Browser (JavaScript)
 */
const PunyaKios = (function() {
    class SDK {
        constructor(apiKey) {
            this.apiKey = apiKey;
            this.baseUrl = 'https://v1.maktopup.com/api/merchant';
        }

        async createPaymentRequest(data) {
            return this.request('POST', '/payment-request', data);
        }

        async getTransactions() {
            return this.request('GET', '/transactions');
        }

        async getTransactionStatus(external_id) {
            return this.request('GET', `/transactions/${external_id}`);
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
                    status: response.ok,
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
