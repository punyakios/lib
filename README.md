# PunyaKios Merchant SDK

Library resmi untuk memudahkan integrasi Merchant API PunyaKios.

## 📁 Struktur Library
- `/php`: SDK untuk PHP (Curl based)
- `/nodejs`: SDK untuk Node.js (Fetch based)
- `/javascript`: SDK untuk Browser/Client-side

---

## 🐘 PHP Usage

```php
require_once 'lib/php/PunyaKios.php';
use PunyaKios\PunyaKios;

$sdk = new PunyaKios('YOUR_API_KEY');

// Create QRIS
$response = $sdk->createPaymentRequest([
    'external_id' => 'ORDER-101',
    'amount' => 10000,
    'description' => 'Pembayaran Kopi',
    'callback_url' => 'https://websitemu.com/callback.php' // URL untuk terima notifikasi lunas
]);

// Cek Riwayat Transaksi
$history = $sdk->getTransactions();
print_r($history['data']);

// Cek Status Transaksi Spesifik
$status = $sdk->getTransactionStatus('ORDER-101');
echo "Status: " . $status['data']['status'];
```

---

## 🟢 Node.js Usage (v18+)

```javascript
const PunyaKios = require('./lib/nodejs/PunyaKios');

const sdk = new PunyaKios('YOUR_API_KEY');

async function test() {
    // Create QRIS
    const response = await sdk.createPaymentRequest({
        external_id: 'ORDER-102',
        amount: 15000,
        description: 'Pembayaran Snack',
        callback_url: 'https://websitemu.com/callback'
    });
    
    // Cek Status
    const status = await sdk.getTransactionStatus('ORDER-102');
    console.log(status.data.status);
}
test();
```

---

## 🌐 Browser JavaScript Usage

```html
<script src="lib/javascript/punyakios-sdk.js"></script>
<script>
    const sdk = new PunyaKios('YOUR_API_KEY');

    // Ambil Riwayat
    sdk.getTransactions().then(res => {
        console.log("Riwayat:", res.data);
    });

    // Contoh buat request dengan callback
    /*
    sdk.createPaymentRequest({
        external_id: 'ORDER-103',
        amount: 20000,
        description: 'Topup Games',
        callback_url: 'https://websitemu.com/callback'
    });
    */
</script>
```

---

## 🔔 Handling Callback

PunyaKios akan mengirimkan POST request ke `callback_url` kamu saat pembayaran berhasil.

### PHP Callback Example
Buat file `callback.php`:
```php
require_once 'lib/php/PunyaKios.php';
use PunyaKios\PunyaKios;

$data = PunyaKios::parseCallback();

if ($data && $data['status'] === 'PAID') {
    $orderId = $data['external_id'];
    $amount = $data['amount'];
    // Update status pesanan di database kamu
    
    echo json_encode(['status' => 'success']);
}
```

### Callback JSON Format
Berikut adalah format JSON yang akan dikirimkan oleh PunyaKios ke `callback_url` kamu:

```json
{
    "external_id": "ORDER-101",
    "status": "PAID",
    "amount": 10000,
    "payment_method": "QRIS",
    "timestamp": "2026-05-13T02:27:00.000Z"
}
```

### Node.js (Express) Callback Example
```javascript
const PunyaKios = require('./lib/nodejs/PunyaKios');

app.post('/callback', (req, res) => {
    const data = PunyaKios.parseCallback(req.body);
    
    if (data.status === 'PAID') {
        console.log(`Order ${data.external_id} LUNAS!`);
    }
    
    res.json({ message: 'OK' });
});
```

---

## 🛡️ Keamanan
- Jangan pernah membagikan `API_KEY` kamu secara publik.
- Untuk penggunaan di browser, pastikan kamu menggunakan `API_KEY` hanya di lingkungan yang terproteksi atau gunakan backend proxy untuk keamanan maksimal.

## 📝 Contoh Respon API

### Sukses (200 OK)
```json
{
    "status": "success",
    "message": "Payment request created",
    "data": {
        "checkout_url": "https://v1.maktopup.com/pay/ORD-123",
        "external_id": "ORD-123",
        "qris_string": "00020101021226650013...",
        "amount": 10000
    }
}
```

### Error Validasi (400 Bad Request)
```json
{
    "status": "error",
    "message": "Validation Error",
    "errors": {
        "amount": ["The amount must be at least 1000."]
    }
}
```

### Error Sistem (500 Internal Server Error)
```json
{
    "status": "error",
    "message": "PunyaKios System Error: PunyaKios API Error: Duplicated external_id..."
}
```
