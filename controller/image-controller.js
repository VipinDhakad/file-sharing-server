import File from '../models/file.js';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.APP_URI;

export const uploadImage = async (request, response) => {
    const fileObj = {
        path: request.file.path,
        name: request.file.originalname,
    }
    
    try {
        const file = await File.create(fileObj);
        response.status(200).json({ path: `${url}/file/${file._id}`});
    } catch (error) {
        console.error("error in upload image",error.message);
        response.status(500).json({ error: error.message });
    }
}

export const downloadImage = async (request, response) => {
    try {   
        const file = await File.findById(request.params.fileId);
        
        file.downloadCount++;

        await file.save();

        response.download(file.path, file.name);
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ msg: error.message });
    }
}

export const getDownloadPage = async (request, response) => {
    try {   
        
        const file = await File.findById(request.params.fileId);
        response.render('downloadPage', { fileId: file._id });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ msg: error.message });
    }
}
export const getImage = async (request, response) => {
    try{
        const fileId = request.params.fileId;
        const htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Download Page</title>
            <meta name="description" content="Web site for sharing files online with link and qr code."/>
            <meta name="theme-color" content="#aa81a8" />
            <link rel="icon" href="https://cdn.pixabay.com/photo/2016/12/18/13/45/download-1915753_1280.png" />
            <style>
                body {
                    background: rgba(0, 0, 0, 0.5); /* Black background with 50% opacity */
                    background-image: url('https://img.freepik.com/premium-photo/neon-colored-water-drops-background_70898-1118.jpg?w=740');
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    color: black; /* Text color */
                    font-family: 'Arial', sans-serif;
                }
        
                h1, p {
                    text-align: center;
                }
        
                form {
                    margin-top: 20px;
                }
        
                button {
                    margin: 20px 0;
                    background-color: #3498db;
                    color: #fff;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: background-color 0.3s ease;
                }
                
                button:hover {
                    background-color: #2c3e50;
                }
            </style>
        </head>
        <body>
            <h1>Download Your File</h1>
            <p>Click the button below to start the download:</p>
            <form action="/file/download/${fileId}" method="get">
                <button type="submit">Download</button>
            </form>
        </body>
        </html>
        
        `;

        // Send the HTML response
        response.send(htmlResponse);

    }catch(e){
        console.log(e)
    }
}