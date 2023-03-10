import { Configuration, OpenAIApi } from "openai";
//config untuk connect ke OPENAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export default async function (req, res) {
  //error handling jika API key salah
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }
  // message jika Research topic tidak di isi
  const essai = req.body.essai || "";
  if (essai.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid research topic",
      },
    });
    return;
  }

  try {
    //membuat Request pada https://api.openai.com/v1/completions
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(essai),
      temperature: 0.9,
      max_tokens: 1000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(essai) {
  return `Create an outline for an essay about ${essai}:`;
}
