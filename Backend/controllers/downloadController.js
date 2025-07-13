const admZip = require('adm-zip');

const generateZip = async (req, res)=>{
    try {
        const { html, css, js } = req.body;

        if(!html){
            return res.status(400).json({ message: 'HTML File is required.' });
        }

        const zip = new admZip();

        zip.addFile("index.html", Buffer.from(html, "utf-8"));
        zip.addFile("style.css", Buffer.from(css, "utf-8"));

        if (js && js.trim()) {
        zip.addFile("script.js", Buffer.from(js, "utf-8"));
        }

        const zipBuffer = zip.toBuffer();

        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename=webpage.zip',
        });

        res.send(zipBuffer);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Faild to generate ZIP File' });
    }
};

module.exports = { generateZip };