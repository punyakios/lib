# 🟢 PunyaKios Node.js SDK

[![npm version](https://img.shields.io/npm/v/punyakios-sdk.svg?style=flat-square)](https://www.npmjs.com/package/punyakios-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Official Node.js SDK for integrasi Merchant API [PunyaKios](https://punyakios.web.id). Memudahkan Anda membuat pembayaran QRIS secara otomatis di aplikasi Anda.

## ✨ Fitur Utama
- ✅ **Native Fetch**: Menggunakan `fetch` bawaan Node.js v18+ (Tanpa dependency tambahan).
- ✅ **Promise Based**: Mendukung `async/await`.
- ✅ **Secure**: Verifikasi signature untuk keamanan callback.
- ✅ **Standardized**: Status transaksi yang konsisten (success, pending, failed).

## 📦 Instalasi

```bash
npm install punyakios-sdk
```

## 🚀 Penggunaan Cepat

```javascript
const PunyaKios = require('punyakios-sdk');

// Inisialisasi dengan API Key Anda
const sdk = new PunyaKios('YOUR_API_KEY');

async function main() {
    try {
        // 1. Membuat Request Pembayaran (QRIS)
        const payment = await sdk.createPaymentRequest({
            external_id: 'ORDER-101',
            amount: 10000,
            description: 'Pembayaran Kopi Susu',
            callback_url: 'https://websitemu.com/callback'
        });
        
        if (payment.success) {
            console.log('URL Pembayaran:', payment.data.data.checkout_url);
            console.log('QRIS String:', payment.data.data.qris_string);
        }

        // 2. Cek Status Transaksi
        const status = await sdk.getTransactionStatus('ORDER-101');
        
        if (status.data.data.status === PunyaKios.STATUS.SUCCESS) {
            console.log('Pembayaran Berhasil!');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
```

## 🔔 Menangani Callback
Gunakan helper `parseCallback` dan `verifySignature` untuk memproses notifikasi dari server PunyaKios secara aman:

```javascript
// Contoh menggunakan Express.js
app.post('/callback', (req, res) => {
    const signature = req.headers['x-punyakios-signature'];
    const body = req.body; // Pastikan menggunakan body-parser (json)

    // 1. Verifikasi Signature (Opsional tapi direkomendasikan)
    const isValid = PunyaKios.verifySignature(body, signature, 'YOUR_API_KEY');
    
    if (!isValid) {
        return res.status(401).send('Invalid Signature');
    }

    // 2. Parse Data
    const data = PunyaKios.parseCallback(body);
    
    if (data.status === PunyaKios.STATUS.SUCCESS) {
        // Logika saat pembayaran lunas
        console.log(`Order ${data.external_id} Berhasil!`);
    }
    
    res.status(200).send('OK');
});
```

## 🛠️ API Reference

### `new PunyaKios(apiKey, [baseUrl])`
Inisialisasi instance SDK.
- `apiKey`: String (Required) - API Key Merchant Anda.
- `baseUrl`: String (Optional) - Default: `https://punyakios.web.id/api/merchant`.

### `sdk.createPaymentRequest(data)`
Membuat tagihan pembayaran baru.
- `data.external_id`: ID unik dari sistem Anda.
- `data.amount`: Jumlah pembayaran (Min. 1000).
- `data.description`: Keterangan pembayaran.
- `data.callback_url`: URL webhook Anda.

### `sdk.getTransactionStatus(external_id)`
Mengecek status transaksi berdasarkan external_id.

### `sdk.getProfile()`
Mendapatkan informasi profil merchant.

### `sdk.getTransactions()`
Mendapatkan riwayat transaksi merchant.

## 📄 Lisensi
[MIT License](LICENSE) &copy; 2026 PunyaKios Team
