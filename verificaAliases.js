const fs = require('fs');
const path = require('path');

// Carrega os aliases diretamente do package.json (se já configurado)
const packageJson = require('./package.json');
const aliases = packageJson._moduleAliases || {};

console.log("🔍 Verificando aliases definidos em _moduleAliases...");

let erroDetectado = false;

Object.entries(aliases).forEach(([alias, dir]) => {
  const resolvedPath = path.resolve(__dirname, dir);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ Faltando: ${alias} → ${dir}`);
    erroDetectado = true;
  } else {
    console.log(`✅ OK: ${alias}`);
  }
});

if (erroDetectado) {
  console.error("⛔ Push bloqueado por aliases ausentes.");
  process.exit(1);
} else {
  console.log("🎯 Todos os aliases foram encontrados.");
}
