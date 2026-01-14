const quoteService = require('../services/quoteService');

exports.getDailyQuote = async (req, res) => {
    try {
        const day = new Date().getDate(); // ziua curentă (1-31)
        const quote = await quoteService.getQuoteByDay(day);
        res.json(quote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
