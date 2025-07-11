// ✅ Token agora em HttpOnly Cookie (seguro contra XSS)
async function verificarTokenJWT() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/proxy/token`, {
      credentials: 'include' // Para cookies HttpOnly
    });
    
    if (!response.ok) throw new Error("Falha na autenticação");
    
    const data = await response.json();
    return !!data.token; // true se válido
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return false;
  }
}

// Exemplo de logout (remove cookie)
function logout() {
  document.cookie = "jwt_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

