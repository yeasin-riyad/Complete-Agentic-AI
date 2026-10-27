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
import { MemorySaver } from "@langchain/langgraph";
import { MongoClient } from "mongodb";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";

const port = process.env.PORT || 5000


app.use(express.json())




// const tool1=tool(
//     ({email,content})=>{

//        return `email sent successfully to ${email} with content ${content}`
//     },
//     {
//         name:"email_send_tool",
//         description:"use this tool to send email",
//         schema:z.object({
//             email:z.string().describe("sender email"),
//             content:z.string().describe("mail content for sending")
//         })
//     }
// )





//with langgraph
// const tools=[tool1,tool2]
// const model = new ChatGoogle("gemini-2.5-flash").bindTools(tools);

// const toolNode=new ToolNode(tools)

// const agent=async (state)=>{

//     const result=await model.invoke(
//        state.messages
//     )

//     return {
//         messages:[result]
//     }
    
// }

// const shouldContinue=async (state)=>{
//     console.log(state)
// // state=[
// //     humanMessage:"",
// //     AiMessage:""
// //      ]
//     if(state.messages[state.messages.length-1].tool_calls.length>0){
//         return "tool_node"
//     }else{
//         return "__end__"
//     }
// }
//short term memory :-


//Using MemorySaver Checkpointer. is better for local development
// const checkpointer= new MemorySaver();

//Using MongoDB Checkpointer. is better for production application
const client=new MongoClient("add your db url");
const checkpointer=new MongoDBSaver({client})

// const graph=new StateGraph(MessagesAnnotation)
// .addNode("agent",agent)
// .addNode("tool_node",toolNode)
// .addEdge("__start__","agent")
// .addConditionalEdges("agent",shouldContinue)
// .addEdge("tool_node","agent")
// .compile({checkpointer});


// app.post("/chat",async(req,res)=>{
//     const {prompt}=req.body;
//  const result=await graph.invoke({
//         messages:[
//             {
//                 role:"user",
//                 content:prompt
//             }
//         ]
//     },
// {
//     configurable:{thread_id:"1"}
// }
// )
//     console.log(result.messages[result.messages.length-1].content);
//     return res.json(result.messages[result.messages.length-1].content);
// });






app.listen(port, () => {
    console.log("server started at ", port)
})