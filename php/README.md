# 🐘 PunyaKios PHP SDK

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PHP Version](https://img.shields.io/badge/php-%3E%3D%207.4-8892bf.svg?style=flat-square)](https://php.net)

Library PHP resmi untuk integrasi Merchant API [PunyaKios](https://punyakios.web.id). Solusi termudah untuk menerima pembayaran QRIS di website PHP Anda.

## 🛠️ Instalasi

Cukup download file `PunyaKios.php` dan sertakan di dalam project Anda:

```php
require_once 'PunyaKios.php';
```

## 🚀 Cara Penggunaan

```php
use PunyaKios\PunyaKios;

$sdk = new PunyaKios('YOUR_API_KEY');

// 1. Membuat Request Pembayaran
$response = $sdk->createPaymentRequest([
    'external_id' => 'ORDER-202',
    'amount' => 25000,
    'description' => 'Topup Saldo Merchant',
    'callback_url' => 'https://websitemu.com/callback.php'
]);

if ($response['status_code'] === 200) {
    $checkoutUrl = $response['data']['data']['checkout_url'];
    header("Location: $checkoutUrl"); // Redirect ke halaman pembayaran
}

// 2. Cek Riwayat Transaksi
$history = $sdk->getTransactions();
print_r($history['data']);
```

## 🔔 Menangani Callback
Gunakan static method `parseCallback()` untuk menerima data notifikasi lunas:

```php
// Di file callback.php
require_once 'PunyaKios.php';
use PunyaKios\PunyaKios;

$data = PunyaKios::parseCallback();

if ($data && $data['status'] === 'PAID') {
    $orderId = $data['external_id'];
    // Update status di database Anda
    
    http_response_code(200);
    echo json_encode(['message' => 'Success']);
}
```

## 📋 Persyaratan
- PHP >= 7.4
- `php-curl` extension enabled
- `php-json` extension enabled

## 📄 Lisensi
Distributed under the MIT License. Lihat `LICENSE` untuk informasi lebih lanjut.
