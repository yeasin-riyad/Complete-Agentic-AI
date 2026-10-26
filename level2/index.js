import express from "express"
import dotenv from "dotenv"
dotenv.config()
const app = express()
import { ChatGoogle } from "@langchain/google";
import { TavilySearch } from "@langchain/tavily";
import { createAgent } from "langchain";
import { ToolNode } from "@langchain/langgraph/prebuilt";
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
// const tool1 = new TavilySearch({
//   maxResults: 5,
//   topic: "general"
// });


//custom tool

const tool1=tool(
    ({email,content})=>{

       return `email sent successfully to ${email} with content ${content}`
    },
    {
        name:"email_send_tool",
        description:"use this tool to send email",
        schema:z.object({
            email:z.string().describe("sender email"),
            content:z.string().describe("mail content for sending")
        })
    }
)



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

// with langchain
// const model= new ChatGoogle("gemini-3.5-flash");


//with langgraph
const tools=[tool1,tool2]
const model = new ChatGoogle("gemini-2.5-flash").bindTools(tools);

const toolNode=new ToolNode(tools)

const agent=async (state)=>{

    const result=await model.invoke(
       state.messages
    )

    return {
        messages:[result]
    }
    
}

const shouldContinue=async (state)=>{
    console.log(state)
    if(state.messages[state.messages.length-1].tool_calls.length>0){
        return "tool_node"
    }else{
        return "__end__"
    }
}


// state=[
//     humanMessage:"",
//     AiMessage:"",
//     toolMessage:"",
//     AiMessages:""
// ]

const graph=new StateGraph(MessagesAnnotation)
.addNode("agent",agent)
.addNode("tool_node",toolNode)
.addEdge("__start__","agent")
.addConditionalEdges("agent",shouldContinue)
.addEdge("tool_node","agent")
.compile()


app.post("/chat",async(req,res)=>{
    const {prompt}=req.body;
    //Using Langchain
//     const agent = createAgent({ model, tools:[tool1,tool2] });
//     const result = await agent.invoke({
//   messages: [{ role: "user", content: prompt }]
// });

// Using Langgraph
    console.log(result.messages[result.messages.length-1].content);
    return res.json(result.messages[result.messages.length-1].content);
});






app.listen(port, () => {
    console.log("server started at ", port)
})