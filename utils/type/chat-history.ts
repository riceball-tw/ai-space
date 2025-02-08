export interface ChatHistory {
  id: string,
  user_id: string,
  bot_id: string
  role: string,
  content: string,
  created_at: string,
}

export type ChatHistorys = ChatHistory[];