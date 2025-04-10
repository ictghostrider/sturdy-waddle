exports.processTransaction = (req, res) => {
    const { amount, currency } = req.body;
    res.json({ message: `Processed transaction for ${amount} ${currency}` });
};