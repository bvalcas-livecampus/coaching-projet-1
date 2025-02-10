import { createLogger, format, transports } from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const { combine, timestamp, printf, colorize, errors } = format;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définir le format du log
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${stack || message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});

// Créer le logger
const logger = createLogger({
    level: 'info', // Niveau minimal de log
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }), // Pour loguer les stack traces
        logFormat
    ),
    transports: [
        // Afficher les logs dans la console
        new transports.Console({
            level: 'info',
            format: combine(
                colorize(), // Colorer les logs en fonction du niveau
                logFormat
            )
        }),
        // Enregistrer les logs dans un fichier
        new transports.File({
            filename: path.join(__dirname, '../logs/app.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            dirname: (() => {
                const logDir = path.join(__dirname, '../logs');
                if (!fs.existsSync(logDir)) {
                    fs.mkdirSync(logDir, { recursive: true });
                }
                return logDir;
            })()
        })
    ],
    exceptionHandlers: [
        new transports.File({ filename: path.join(__dirname, '../logs/exceptions.log') })
    ],
    rejectionHandlers: [
        new transports.File({ filename: path.join(__dirname, '../logs/rejections.log') })
    ]
});

export default logger;
