import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-y0gHbl4VrFXVaEr0V1RBK5V7",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
export const openaiBot = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.sendStatus(400);
        }
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.8,
            max_tokens: 80,
            presence_penalty: 0,
            frequency_penalty: 0,
        });
        const openaiResponse = completion.data.choices[0].text?.trim() ||
            "Sorry 🥵 There was a problem!";
        res.status(200).json({ response: openaiResponse });
    }
    catch (error) {
        console.error("Error fetching OpenAI response:", error);
        res.status(500).json({
            error: `Error fetching OpenAI response: ${error.message}`,
            details: error,
        });
    }
};
//# sourceMappingURL=open-ai.js.map