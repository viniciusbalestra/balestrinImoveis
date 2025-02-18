const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const imovelId = req.body.imovelId; // ID do imóvel
        const uploadDir = path.join(__dirname, 'uploads', imovelId); // Pasta para cada imóvel

        // Cria a pasta se não existir
        fs.mkdirSync(uploadDir, { recursive: true });

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(8).toString('hex'); // Nome único para o arquivo
        const ext = path.extname(file.originalname); // Extensão do arquivo
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ storage });

module.exports = upload;