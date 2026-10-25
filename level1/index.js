import express from "express"
import dotenv from "dotenv"
dotenv.config()

const app = express()

const port = process.env.PORT || 5000


app.use(express.json())


// streaming
// const main=async ()=>{
//     const responseStream=await ai.models.generateContentStream({
//         model:"gemini-2.5-flash",
//         contents:"what is js"
//     })

//     for await (const chunk of responseStream) {
//         console.log(chunk.text)
//     }
// }

// main()

//by default
// const main=async ()=>{
//     const response=await ai.models.generateContent({
//         model:"gemini-2.5-flash",
//         contents:"what is js"
//     })

//     console.log(response.text)
// }

// main()



app.listen(port, () => {
    console.log("server started at ", port)
})