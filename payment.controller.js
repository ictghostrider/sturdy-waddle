const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const offlineStorePath = path.join(__dirname, 'offline_payments.json');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(data) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
}

function decrypt(encryptedData, ivHex) {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

exports.captureOfflinePayment = (req, res) => {
  const { cardNumber, expiry, cvv, amount, referenceId } = req.body;
  if (!cardNumber || !expiry || !cvv || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { iv, encryptedData } = encrypt(JSON.stringify({ cardNumber, expiry, cvv, amount, referenceId }));

  let offlinePayments = [];
  if (fs.existsSync(offlineStorePath)) {
    const rawData = fs.readFileSync(offlineStorePath);
    offlinePayments = JSON.parse(rawData);
  }

  offlinePayments.push({ id: referenceId || Date.now(), data: encryptedData, iv });

  fs.writeFileSync(offlineStorePath, JSON.stringify(offlinePayments, null, 2));
  res.status(200).json({ message: 'Offline payment stored securely.' });
};

exports.syncOfflinePayments = (req, res) => {
  if (!fs.existsSync(offlineStorePath)) {
    return res.status(200).json({ message: 'No offline payments to sync.' });
  }

  const rawData = fs.readFileSync(offlineStorePath);
  const offlinePayments = JSON.parse(rawData);

  const synced = offlinePayments.map(payment => {
    const decrypted = decrypt(payment.data, payment.iv);
    const parsed = JSON.parse(decrypted);
    return { ...parsed, status: 'SENT_TO_BANK' };
  });

  fs.unlinkSync(offlineStorePath);
  res.status(200).json({ message: 'Offline payments synced.', synced });
};

exports.processPayment = (req, res) => {
  const { cardNumber, expiry, cvv, amount } = req.body;

  if (!cardNumber || !expiry || !cvv || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  return res.status(200).json({
    message: 'Payment processed with generic bank gateway.',
    status: 'APPROVED',
    transactionId: 'BANK-' + Date.now()
  });
};
