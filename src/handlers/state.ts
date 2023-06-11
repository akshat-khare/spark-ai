import os from "os";
import { Message as Y, MessageMedia }  from "whatsapp-web.js";
import { chatgpt } from "../providers/openai";
import { randomUUID } from "crypto";
import fetch from 'node-fetch';
import axios from 'axios';




// States
enum ChatbotState {
    GreetingState,
    ContentDeliveryState,
    BulkDeliveryState,
}
  
// User conversation context
interface UserContext {
    state: ChatbotState;
    text: string;
}
  
// Initializing context store
const userContexts: {[id: string]: UserContext} = {};

// function to get gpt response from user text
const getGPTResponse = async (text: string) => {
    // Create new conversation
    const pre_prompt = `<User Input>: ${text}`
    // const prompt = pre_prompt + text;
    const convId = randomUUID();
    const conv = chatgpt.addConversation(convId);

    // get response from gpt
    const response = await chatgpt.ask(pre_prompt, conv.id);

    // return response
    return response;
}

async function getVideoAndSendMessage(message: Y, actor: string, text: string) {
    try {
        const videoUrl = `https://flask--codebatgaming.repl.co/t2vid`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                actor: actor,
                text: text,
            })
        };

        const videoResponse = await fetch(videoUrl, options);
        const downloadUrl = await videoResponse.text();
        console.log(downloadUrl);

        const med = await MessageMedia.fromUrl(downloadUrl);
        const chat = await message.getChat();
        await chat.sendMessage(med);
    } catch (error: any) {
        console.error("An error occurred", error);
    }
}

// Handlers for each state
const handlers = {
    [ChatbotState.GreetingState]: async (message: Y) => {
        // if message includes bulk, transition to BulkDeliveryState
        if (message.body.toLowerCase().includes("bulk")) {
            const greeting = `Hi I'm SparkedAI, your intuitive WhatsApp chatbot, effortlessly generating personalized marketing videos for small businesses across India at the tap of a button - fusing art and technology to spark your brand's growth story.
Please tell about what target customers via product category.`;
        await message.getChat().then((chat) => chat.sendMessage(greeting));
        userContexts[message.from].state = ChatbotState.BulkDeliveryState;
        }
        else {
        // Send greeting and options to user
        const greeting = `Hi I'm SparkedAI, your intuitive WhatsApp chatbot, effortlessly generating personalized marketing videos for small businesses across India at the tap of a button - fusing art and technology to spark your brand's growth story.
Please tell about your business and your target audience in a few words.`;
        await message.getChat().then((chat) => chat.sendMessage(greeting));
        // Transition to InformationExtractionState
        userContexts[message.from].state = ChatbotState.ContentDeliveryState;
        }
    },
  
    [ChatbotState.ContentDeliveryState]: async (message: Y) => {
        // Collect details from user
        const text = message.body;
        userContexts[message.from].text = text;

        // Generate video content here and send back to the user
        // Placeholder response
        const response = `SparkedAI is in action, crafting your custom marketing video. Just a few seconds away from igniting your business story - stay tuned!`;
        await message.getChat().then((chat) => chat.sendMessage(response));

        // Get response from gpt
        const gptResponse = await getGPTResponse(text);
        console.log(gptResponse);

        // // Send video to user
        const trimmedResponse = gptResponse.split(" ").slice(0, 30).join(" ");
        await getVideoAndSendMessage(message, "shirley", trimmedResponse);

        // Send thanks message
        const thanksMessage = `We appreciate your choice to use SparkedAI. Hope our tailored video resonated with your vision. Your feedback is a torchlight for our growth journey, do share your thoughts with us.`;
        await message.getChat().then((chat) => chat.sendMessage(thanksMessage));
        userContexts[message.from].state = ChatbotState.GreetingState;

    },

    [ChatbotState.BulkDeliveryState]: async (message: Y) => {
        // either product is earing or badminton 
        const product = message.body.toLowerCase().includes("earring") ? "earring" : "badminton";
            
        // Fetch the bulk data from the API
        const response = await fetch(`https://llamaindex.codebatgaming.repl.co/bulk?item=${product}`);
        
        // Get the response as a text
        const text = await response.text();
    
        // Convert the text to JSON. This may vary depending on the exact format of the response.
        // Here, I'm assuming it's a list of strings in Python format, so I'm replacing single quotes with double quotes.
        const data = JSON.parse(text.replace(/'/g, '"'));

        const response_2 = `SparkedAI is in action, crafting your custom marketing video. Just a few seconds away from igniting your business story - stay tuned!`;
        await message.getChat().then((chat) => chat.sendMessage(response_2));
        
        // Iterate over the received data
        for (let user of data) {
            // Trim the user message to first 20 words
            // Get response from gpt
            const gptResponse = await getGPTResponse(user);
            console.log(gptResponse);
            const trimmedResponse = user.split(" ").slice(0, 30).join(" ");
    
            // Send video to user
            await getVideoAndSendMessage(message, "shirley", trimmedResponse);
        }
        // Send thanks message
        const thanksMessage = `We appreciate your choice to use SparkedAI. Hope our tailored video resonated with your vision. Your feedback is a torchlight for our growth journey, do share your thoughts with us.`;
        await message.getChat().then((chat) => chat.sendMessage(thanksMessage));
        userContexts[message.from].state = ChatbotState.GreetingState;
    }

};
  
const handleState = async (message: Y) => {
    const from = message.from;
    if (!(from in userContexts)) {
      userContexts[from] = {
        state: ChatbotState.GreetingState,
        text: ''
        };
    }

    const context = userContexts[from];
    await handlers[context.state](message);
};

const handleDeleteConversation = async (message: Y) => {
    // Delete conversation
    delete userContexts[message.from];

    // Reply
    message.reply("Conversation context was resetted!");
};
  
export { handleState, handleDeleteConversation };
