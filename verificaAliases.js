const fs = require('fs');
const path = require('path');

const aliases = {
  "@root": "./",
  "@config": "./config",
  "@controllers": "./controllers",
  "@services": "./services",
  "@utils": "./utils"
};

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

