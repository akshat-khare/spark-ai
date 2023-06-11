import fs from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";
import { ChatGPT } from "chatgpt-official";
import ffmpeg from "fluent-ffmpeg";
import { Configuration, OpenAIApi } from "openai";
import { blobFromSync, File } from "fetch-blob/from.js";
import config from "../config";
import { getConfig } from "../handlers/ai-config";

export let chatgpt: ChatGPT;

// OpenAI Client (DALL-E)
export let openai: OpenAIApi;

// export function initOpenAI() {
// 	chatgpt = new ChatGPT(getConfig("gpt", "apiKey"), {
// 		temperature: 0.7, // OpenAI parameter
// 		max_tokens: getConfig("gpt", "maxModelTokens"), // OpenAI parameter [Max response size by tokens]
// 		top_p: 0.9, // OpenAI parameter
// 		frequency_penalty: 0, // OpenAI parameter
// 		presence_penalty: 0, // OpenAI parameter
// 		instructions: `You're Greeting Master, an AI bot, designed to create personalized Whatsapp greetings for Indian users. You craft culturally nuanced greetings in Hindi written in Roman script using English letters. You also like using emojis contextually to keep things light.

// 		You are capable of making the following media:
// 		1. Text messages with options for poems, songs, shayaris or any style.
// 		2. Celebrity video messages.
// 		3. Photo greetings and memes
		
// 		When a user initiates a chat they are shown below message about your capabilities automatically by system. Then they respond with their input.
		
// 		“Namaste! 🙏 Main aapka Greeting Master hoon. Kaise madad kar sakta hoon aapki? Aap yahan par personalized Whatsapp greetings banwa sakte hain. Yeh greetings kisi bhi tarah ke ho sakti hain jaise ki:
// 		1. Text messages jo ki ho sakti hain poems, songs, shayaris ya kisi aur style mein.
// 		2. Celebrity video messages.
// 		3. Personalized photo messages.
// 		Kis type ki greeting aap banwana chahenge?”
		
// 		Your job is to take the user input from here on, understand and process it.
		
// 		For text greetings, engage in a user-friendly conversation to gather additional details for personalization. You may nudge for more information once, but respect the user's privacy. Once the greeting is generated, present it to the user, ask for their approval, and offer alterations.
		
// 		For celebrity video greetings, offer users a choice of celebrities (Amitabh Bachchan, Shahrukh Khan, Virat Kohli, Madhuri Dixit) once they choose this option. Follow the same message generation flow as for text messages, including the options for poems, songs, shayaris, or any other style. Do not display the message text output in this case - instead Inform them that the video will be generated soon in 1-2 min.
		
// 		For photo messages explain to user that this requires them to create a photo greeting where they will add photo of themselves along with the greeting. Ask the user describe what occasion the greeting is for and what they want to say. Once you have received that, generate a small greeting message in upto 10 words in that context. Then after that user is asked to upload a photo of himself/ herself. Once user has added this inform them that the image will soon be generated.
		
// 		Each response should be within 100 words. After delivering the final output for text or video, ask users if they'd like to create another greeting. Switch to a user's language if they start communicating in it. Always prioritize addressing user's queries or help requests before proceeding with greeting creation.
// 		`,
// 		model: config.openAIModel // OpenAI model
// 	});

// 	openai = new OpenAIApi(
// 		new Configuration({
// 			apiKey: getConfig("gpt", "apiKey")
// 		})
// 	);
// }


export function initOpenAI() {
	chatgpt = new ChatGPT(getConfig("gpt", "apiKey"), {
		temperature: 0.7, // OpenAI parameter
		max_tokens: getConfig("gpt", "maxModelTokens"), // OpenAI parameter [Max response size by tokens]
		top_p: 0.9, // OpenAI parameter
		frequency_penalty: 0, // OpenAI parameter
		presence_penalty: 0, // OpenAI parameter
		instructions: `You are a text master, an AI bot that generates text for a video starring Shirley Sethia, an Indian Instagram Influencer. The user has provided details about their business and their target audience in <User Input>. Using the <User Input> you need to generate a culturally nuanced text relevant to the business. The text should not be more than 30 words for this video. You should use Hinglish to generate the text. Generate the text to be eventually spoken by Komal Pandey in her tone.
		Generate the Output in same language as the User Input in atleast 30 words.`,
		model: config.openAIModel // OpenAI model
	}	);

	openai = new OpenAIApi(
		new Configuration({
			apiKey: getConfig("gpt", "apiKey")
		})
	);
}

export async function transcribeOpenAI(audioBuffer: Buffer): Promise<{ text: string; language: string }> {
	const url = config.openAIServerUrl;
	let language = "";

	const tempdir = os.tmpdir();
	const oggPath = path.join(tempdir, randomUUID() + ".ogg");
	const wavFilename = randomUUID() + ".wav";
	const wavPath = path.join(tempdir, wavFilename);
	fs.writeFileSync(oggPath, audioBuffer);
	try {
		await convertOggToWav(oggPath, wavPath);
	} catch (e) {
		fs.unlinkSync(oggPath);
		return {
			text: "",
			language
		};
	}

	// FormData
	const formData = new FormData();
	formData.append("file", new File([blobFromSync(wavPath)], wavFilename, { type: "audio/wav" }));
	formData.append("model", "whisper-1");
	if (config.transcriptionLanguage) {
		formData.append("language", config.transcriptionLanguage);
		language = config.transcriptionLanguage;
	}

	const headers = new Headers();
	headers.append("Authorization", `Bearer ${getConfig("gpt", "apiKey")}`);

	// Request options
	const options = {
		method: "POST",
		body: formData,
		headers
	};

	let response;
	try {
		response = await fetch(url, options);
	} catch (e) {
		console.error(e);
	} finally {
		fs.unlinkSync(oggPath);
		fs.unlinkSync(wavPath);
	}

	if (!response || response.status != 200) {
		console.error(response);
		return {
			text: "",
			language: language
		};
	}

	const transcription = await response.json();
	return {
		text: transcription.text,
		language
	};
}

async function convertOggToWav(oggPath: string, wavPath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		ffmpeg(oggPath)
			.toFormat("wav")
			.outputOptions("-acodec pcm_s16le")
			.output(wavPath)
			.on("end", () => resolve())
			.on("error", (err) => reject(err))
			.run();
	});
}
