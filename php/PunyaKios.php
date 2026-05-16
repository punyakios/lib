<?php

namespace PunyaKios;

class PunyaKios {
    private $apiKey;
    private $baseUrl = 'https://punyakios.web.id/api/merchant';

    const STATUS_PENDING = 'pending';
    const STATUS_SUCCESS = 'success';
    const STATUS_FAILED = 'failed';
    const STATUS_EXPIRED = 'expired';

    public function __construct($apiKey, $baseUrl = null) {
        $this->apiKey = $apiKey;
        if ($baseUrl) {
            $this->baseUrl = rtrim($baseUrl, '/');
        }
    }

    /**
     * Create a payment request (QRIS)
     * @param array $data ['external_id', 'amount', 'description', 'callback_url']
     */
    public function createPaymentRequest($data) {
        return $this->request('POST', '/payment-request', $data);
    }

    /**
     * Get merchant profile information
     */
    public function getProfile() {
        return $this->request('POST', '/profile');
    }

    /**
     * Get merchant transaction history
     */
    public function getTransactions() {
        return $this->request('POST', '/transactions');
    }

    /**
     * Check specific transaction status
     */
    public function getTransactionStatus($external_id) {
        return $this->request('POST', '/check-status', ['external_id' => $external_id]);
    }

    /**
     * Helper to parse incoming callback from PunyaKios
     */
    public static function parseCallback() {
        $json = file_get_contents('php://input');
        return json_decode($json, true);
    }

    /**
     * Verify callback signature
     */
    public static function verifySignature($body, $signature, $secretKey) {
        if (!$signature || !$secretKey) return false;
        
        $payload = is_string($body) ? $body : json_encode($body);
        $expectedSignature = hash_hmac('sha256', $payload, $secretKey);
        
        return hash_equals($expectedSignature, $signature);
    }

    private function request($method, $endpoint, $data = null) {
        $ch = curl_init($this->baseUrl . $endpoint);
        
        $headers = [
            'X-API-Key: ' . $this->apiKey,
            'Content-Type: application/json',
            'Accept: application/json',
            'User-Agent: PunyaKios-PHPSDK/1.1'
        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_errno($ch)) {
            throw new \Exception('PunyaKios SDK Error (Curl): ' . curl_error($ch));
        }

        curl_close($ch);

        $decoded = json_decode($response, true);

        return [
            'status_code' => $httpCode,
            'success' => ($httpCode >= 200 && $httpCode < 300),
            'data' => $decoded
        ];
    }
}
