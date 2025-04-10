exports.saveOffline = (req, res) => {
    const transaction = req.body;
    res.json({ message: 'Saved offline transaction', transaction });
};

exports.listOffline = (req, res) => {
    res.json({ transactions: [] });
};