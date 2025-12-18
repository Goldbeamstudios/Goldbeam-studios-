import { OpenRouter } from "@openrouter/sdk";

export const createAIClient = (apiKey: string) => {
    return new OpenRouter({
        apiKey: apiKey,
    });
};

export const enhanceContent = async (
    apiKey: string,
    content: string,
    instruction: 'fix_grammar' | 'improve_clarity' | 'rewrite' | 'summary'
): Promise<string> => {
    if (!apiKey) throw new Error("API Key is required");

    const ai = createAIClient(apiKey);

    let prompt = "";
    switch (instruction) {
        case 'fix_grammar':
            prompt = `Fix grammar and spelling errors in the following text, keeping the original tone and formatting:\n\n${content}`;
            break;
        case 'improve_clarity':
            prompt = `Improve the clarity and flow of the following text, making it more engaging but keeping the original meaning:\n\n${content}`;
            break;
        case 'rewrite':
            prompt = `Rewrite the following text to be more professional and concise:\n\n${content}`;
            break;
        case 'summary':
            prompt = `Write a short, engaging summary (excerpt) for the following blog post:\n\n${content}`;
            break;
    }

    try {
        const response: any = await ai.chat.send({
            model: "google/gemma-3n-e2b-it:free",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            stream: false
        });

        return response.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("OpenRouter API Error:", error);
        throw error;
    }
};

export const generateImagePrompt = async (apiKey: string, content: string): Promise<string> => {
    if (!apiKey) throw new Error("API Key is required");
    const ai = createAIClient(apiKey);

    const prompt = `Generate a detailed, creative image description for a blog post based on this content. The description should be suitable for an AI image generator. Do not include text in the image description itself. Content summary: ${content.substring(0, 500)}...`;

    try {
        const response: any = await ai.chat.send({
            model: "google/gemma-3n-e2b-it:free",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            stream: false
        });
        return response.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("OpenRouter API Error:", error);
        throw error;
    }
}
