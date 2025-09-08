const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { GoogleAuth } = require('google-auth-library');
const app = express();
const PORT = 3000;

// Path to your downloaded OAuth 2.0 client secret JSON
const CREDENTIALS_PATH = '/home/iamyou/Documents/gen-lang-client-0856632337-ddf6b66d7771.json';

app.use(cors());
app.use(bodyParser.json());

// Function to get OAuth 2.0 access token
async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token || accessToken;
}

// Text-to-Speech endpoint using OAuth 2.0
app.post('/api/text-to-speech', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const accessToken = await getAccessToken();

    const ttsResponse = await fetch(
      'https://texttospeech.googleapis.com/v1/text:synthesize',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
          audioConfig: { audioEncoding: 'MP3' }
        })
      }
    );

    if (!ttsResponse.ok) {
      const errorData = await ttsResponse.json();
      return res.status(ttsResponse.status).json({ error: errorData.error?.message || 'TTS API error' });
    }

    const ttsData = await ttsResponse.json();
    res.json({ audioContent: ttsData.audioContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

