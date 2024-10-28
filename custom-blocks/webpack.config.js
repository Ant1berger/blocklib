// webpack.config.js
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const fs = require('fs');

// Fonction pour détecter automatiquement tous les blocs et leurs fichiers
function getBlockEntries() {
    const srcPath = path.resolve(__dirname, 'src');
    const entries = {};

    // Lire tous les dossiers dans src/
    const blockFolders = fs.readdirSync(srcPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    // Pour chaque dossier de bloc, vérifier et ajouter les fichiers JS
    blockFolders.forEach(blockName => {
        const blockPath = path.join(srcPath, blockName);
        const files = fs.readdirSync(blockPath);

        // Chercher index.js et view-inline.js
        files.forEach(file => {
            if (file === 'index.js' || file === 'view-inline.js') {
                const entryName = `${blockName}/${file.replace('.js', '')}`;
                entries[entryName] = path.resolve(blockPath, file);
            }
        });
    });

    return entries;
}

const entries = getBlockEntries();

module.exports = {
    ...defaultConfig,
    entry: entries,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        clean: true
    },
    // On conserve la configuration par défaut de @wordpress/scripts pour le reste
    module: {
        ...defaultConfig.module
    },
    plugins: [
        ...defaultConfig.plugins
    ]
};
