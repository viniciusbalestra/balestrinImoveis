const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Validação de tipo de arquivo
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Tipos de imagem permitidos
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Aceita o arquivo
    } else {
        cb(new Error('Tipo de arquivo não suportado. Apenas JPEG, PNG e GIF são permitidos.'), false); // Rejeita o arquivo
    }
};

// Configura o armazenamento para o multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const imovelId = req.body.imovelId;
        if (!imovelId) {
            return cb(new Error('ID do imóvel não fornecido.'));
        }
        const uploadDir = path.join(__dirname, 'uploads', imovelId);

        fs.mkdir(uploadDir, { recursive: true }, (err) => {
            if (err) {
                return cb(new Error(`Falha ao criar diretório de upload: ${err.message}`));
            }
            cb(null, uploadDir);
        });
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(8).toString('hex');
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

// Middleware de upload do multer com configurações e opções de validação
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de tamanho do arquivo: 5MB
    }
});

module.exports = upload;
