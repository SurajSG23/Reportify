import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from ".";



const getModelIndex = (title: string)=>{
  const index = Math.floor(Math.random() * 2);
  console.log("Content Index: ", index);
  return index
}

const getKeyIndex = ()=>{
  const index = Math.floor(Math.random() * 2);
  console.log("Key Index: ", index);
  return index
}

const getReportModel = (title: string) => { 
  const apiKey = getKeyIndex() ? config.GEMINI_API_KEY_1 : config.GEMINI_API_KEY_2;
const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: getModelIndex(title) ? config["GEMINI_FLASH_LITE_LATEST"]: config["GEMINI2.5"],
    systemInstruction: `
  Generate a well-structured MDX document about the given topic, subject and description with the following sections:
  1. Title (H1)
  2. Key Sections (H2)
  3. Bullet Points
  4. Bold Text for key terms
  5. Discuss different aspects of the topic
  Format everything in Markdown. Use - for bullets.
  Also use the same for indentation in bullets.
  Never use * for bullets.
  Please don't use the section titles given here, use your own
  Make sure that the content is relevant to the topic and as detailed as possible and is plagiary free
  Dont give any tables as this content will go inside the docx as it is and it could ruin the document
  Dont wrap it inside code blocks
  Dont give conclusion and intro section unless asked for
  `,
  });
}

export { getReportModel };
