import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url'; 
let d;
const app = express();
const upload = multer({ dest: 'uploads/' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/static', express.static('public'));
import PDFMerger from 'pdf-merger-js';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.post('/merge', upload.array('pdfs', 2), async function (req, res, next) {
    var merger = new PDFMerger();

    const mergePdfs = async (p1, p2) => {
        let pdf1 = path.join(__dirname, req.files[0].path);
        let pdf2 = path.join(__dirname, req.files[1].path);
        await merger.add(pdf1);
        await merger.add(pdf2);
        d = new Date().getTime()
        await merger.save(`public/${d}.pdf`);
    };

    await mergePdfs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path));
    res.redirect(`/static/${d}.pdf`);
});

app.listen(3000);