import "dotenv/config";

import connectDB from "./db/index.js";

const PORT = process.env.PORT || 4000
connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log("Server is Listening on port: ", PORT);
    })
})
.catch((err) => {
    console.log("Failed to connect with Database");
})