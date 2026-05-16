<?php

namespace PunyaKios;

class PunyaKios {
    private $apiKey;
    private $baseUrl = 'https://punyakios.web.id/api/merchant';

    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }

    /**
     * Create a payment request (QRIS)
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

    private function request($method, $endpoint, $data = null) {
        $ch = curl_init($this->baseUrl . $endpoint);
        
        $headers = [
            'X-API-Key: ' . $this->apiKey,
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_errno($ch)) {
            throw new \Exception('Curl Error: ' . curl_error($ch));
        }

        curl_close($ch);

        $decoded = json_decode($response, true);

        return [
            'status_code' => $httpCode,
            'data' => $decoded
        ];
    }
}
