# 🟢 PunyaKios Node.js SDK

[![npm version](https://img.shields.io/npm/v/punyakios-sdk.svg?style=flat-square)](https://www.npmjs.com/package/punyakios-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Official Node.js SDK untuk integrasi Merchant API [PunyaKios](https://punyakios.web.id). Memudahkan Anda membuat pembayaran QRIS secara otomatis di aplikasi Anda.

## ✨ Fitur Utama
- ✅ **Native Fetch**: Menggunakan `fetch` bawaan Node.js v18+ (Tanpa dependency tambahan).
- ✅ **Promise Based**: Mendukung `async/await`.
- ✅ **Type Support**: Dokumentasi fungsi yang jelas.
- ✅ **Secure**: Mudah dikonfigurasi dengan environment variables.

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
        
        console.log('URL Pembayaran:', payment.data.data.checkout_url);

        // 2. Cek Status Transaksi
        const status = await sdk.getTransactionStatus('ORDER-101');
        console.log('Status:', status.data.data.status);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
```

## 🔔 Menangani Callback
Gunakan helper `parseCallback` untuk memproses notifikasi dari server PunyaKios:

```javascript
// Contoh menggunakan Express.js
app.post('/callback', (req, res) => {
    const data = PunyaKios.parseCallback(req.body);
    
    if (data.status === 'PAID') {
        // Logika saat pembayaran lunas
        console.log(`Order ${data.external_id} Berhasil!`);
    }
    
    res.status(200).send('OK');
});
```

## 📄 Lisensi
[MIT License](LICENSE) &copy; 2026 PunyaKios Team
