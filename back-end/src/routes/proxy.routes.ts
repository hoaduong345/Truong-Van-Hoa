import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/exchange-rate/history/:currency/:date', async (req, res) => {
  try {
    const { currency, date } = req.params;
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const baseUrl = process.env.EXCHANGE_RATE_API_URL;
    
    const response = await axios.get(
      `${baseUrl}/${apiKey}/history/${currency}/${date}`
    );
    
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to fetch exchange rate data",
      error: error.message 
    });
  }
});

export default router; 