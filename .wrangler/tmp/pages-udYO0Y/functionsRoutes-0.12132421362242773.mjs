import { onRequestDelete as __api_villas__id__ts_onRequestDelete } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\villa-bungalov-tatil\\functions\\api\\villas\\[id].ts"
import { onRequestPut as __api_villas__id__ts_onRequestPut } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\villa-bungalov-tatil\\functions\\api\\villas\\[id].ts"
import { onRequestPost as __api_chat_ts_onRequestPost } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\villa-bungalov-tatil\\functions\\api\\chat.ts"
import { onRequestGet as __api_villas_ts_onRequestGet } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\villa-bungalov-tatil\\functions\\api\\villas.ts"
import { onRequestPost as __api_villas_ts_onRequestPost } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\villa-bungalov-tatil\\functions\\api\\villas.ts"

export const routes = [
    {
      routePath: "/api/villas/:id",
      mountPath: "/api/villas",
      method: "DELETE",
      middlewares: [],
      modules: [__api_villas__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/villas/:id",
      mountPath: "/api/villas",
      method: "PUT",
      middlewares: [],
      modules: [__api_villas__id__ts_onRequestPut],
    },
  {
      routePath: "/api/chat",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_chat_ts_onRequestPost],
    },
  {
      routePath: "/api/villas",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_villas_ts_onRequestGet],
    },
  {
      routePath: "/api/villas",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_villas_ts_onRequestPost],
    },
  ]