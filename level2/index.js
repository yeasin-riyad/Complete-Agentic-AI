import express from "express"
import dotenv from "dotenv"
dotenv.config()
const app = express()
import { ChatGoogle } from "@langchain/google";
import { TavilySearch } from "@langchain/tavily";
import { createAgent } from "langchain";
import { tool } from "@langchain/core/tools";
import z from "zod";

const port = process.env.PORT || 5000


app.use(express.json())


// simple llm

// app.post("/chat",async(req,res)=>{
//     const {prompt}=req.body;
//     const model= new ChatGoogle("gemini-2.5-flash");
//     const result= await model.invoke(prompt);
//     return res.json(result.text);
// });


// ai agent = llm + tools 

// Built in Tool
const tool1 = new TavilySearch({
  maxResults: 5,
  topic: "general"
});


//custom tool
const tool2= tool(
    ({a,b})=>{
       return `addition of ${a} & ${b} is 7`
    },{
        name:"addition_tool",
        description:"use this tool for addition for two numbers",
        schema:z.object({
            a:z.number(),
            b:z.number()
        })
    }
)


const model= new ChatGoogle("gemini-3.5-flash");


app.post("/chat",async(req,res)=>{
    const {prompt}=req.body;
    const agent = createAgent({ model, tools:[tool1,tool2] });

    const result = await agent.invoke({
  messages: [{ role: "user", content: prompt }]
});
    // console.log(result.messages);
    console.log(result.messages[result.messages.length-1].content);
    return res.json(result.messages[result.messages.length-1].content);
});






app.listen(port, () => {
    console.log("server started at ", port)
})