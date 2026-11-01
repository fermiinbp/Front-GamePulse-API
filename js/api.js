import { API_URL } from "./config.js";

async function pedir(ruta, opciones = {}) {
    const cabecera = {};
    const token = localStorage.getItem("token");
    if (token) cabecera.Authorization = `Bearer ${token}`;
    if (opciones.body) cabecera["Content-Type"] = "application/json";

    const res = await fetch(`${API_URL}${ruta}`, { ...opciones, headers: cabecera });
    const datos = res.status === 204 ? null : await res.json();
    if (!res.ok) {
        throw new Error(datos?.error || `Error ${res.status}`);
    }
    return datos;
}

export function listarGames(parametros) {
    const query = new URLSearchParams(parametros);
    return pedir(`/games?${query}`);
}

export function obtenerGame(id) {
    return pedir(`/games/${id}`);
}

export function trending(limite = 5) {
    return pedir(`/games/trending?limit=${limite}`);
}

export function historialDe(gameId) {
    return pedir(`/games/${gameId}/stats`);
}

export function sincronizarSteam() {
    return pedir("/admin/sync", { method: "POST" });
}

export function listarGeneros() {
    return pedir("/games/genres");
}

export function resenasDe(gameId) {
    return pedir(`/reviews?game=${gameId}`);
}

export function escribirResena(gameId, rating, comment) {
    return pedir("/reviews", {
        method: "POST",
        body: JSON.stringify({ gameId, rating: Number(rating), comment })
    });
}

export function estadisticasResenas() {
    return pedir("/reviews/stats");
}

export async function login(email, password) {
    const dato = await pedir("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
    localStorage.setItem("token", dato.token);
    localStorage.setItem("usuario", JSON.stringify(dato.usuario));
    return dato.usuario;
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
}

export function usuarioActual() {
    try {
        return JSON.parse(localStorage.getItem("usuario"));
    } catch {
        return null;
    }
}