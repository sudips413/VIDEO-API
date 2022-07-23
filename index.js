const express = require("express");
const fs = require("fs")
const app = express();
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");

})

app.get("/video", (req, res) => {
    const range = req.headers.range
    if (!range) {
        res.status(400).send("Requires range header");

    }
    const videopath = "music.mp4"
    const videoSize = fs.statSync("music.mp4").size;
    const chunksize = 10 ** 9; //size buffered when user request
    const start = Number(range.replace(/\D/g, "")) //find starting byte
    const end = Math.min(start + chunksize, videoSize - 1); //find ending byte
    const contentlength = end - start + 1;
    console.log(videoSize)
    if (videoSize < 8e+9) {
        const headers = {
            "Content-Range": `bytes ${start} - ${end}/${videoSize}`,
            "Accept-Range": "bytes",
            "Content-Length": contentlength,
            "content-type": "video/mp4",
        }
        res.writeHead(206, headers);
        const videostream = fs.createReadStream(videopath, { start, end });
        videostream.pipe(res)
    } else {
        console.log("too much large")

    }
})




app.listen(5000, () => {
    console.log("API is running");
})