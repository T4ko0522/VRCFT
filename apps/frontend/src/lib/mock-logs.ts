import type { Friend } from "./mock-data"

export type LogType =
  | "login"
  | "logout"
  | "status_change"
  | "game_join"
  | "game_leave"
  | "message"
  | "friend_add"
  | "friend_remove"
  | "location_change"
  | "avatar_change"


export interface LogEntry {
  id: string
  friendId: string
  timestamp: Date
  type: LogType
  details: {
    message?: string
    oldStatus?: string
    newStatus?: string
    game?: string
    location?: string
    oldLocation?: string
    newLocation?: string
    avatar?: string
    oldAvatar?: string
    newAvatar?: string
  }
}

// ログエントリを生成するヘルパー関数
export function generateLogEntries(friends: Friend[], count = 50): LogEntry[] {
  const logs: LogEntry[] = []
  const now = new Date()

  const logTypes: LogType[] = [
    "login",
    "logout",
    "status_change",
    "game_join",
    "game_leave",
    "message",
    "friend_add",
    "friend_remove"
  ]

  for (let i = 0; i < count; i++) {
    const friend = friends[Math.floor(Math.random() * friends.length)]
    const type = logTypes[Math.floor(Math.random() * logTypes.length)]
    const timestamp = new Date(now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // 過去7日以内

    let details: LogEntry["details"] = {}

    switch (type) {
      case "login":
        details = { message: `${friend.name} がオンラインになりました` }
        break
      case "logout":
        details = { message: `${friend.name} がオフラインになりました` }
        break
      case "status_change":
        const statuses = ["online", "away", "busy", "in-game"]
        const oldStatus = statuses[Math.floor(Math.random() * statuses.length)]
        let newStatus
        do {
          newStatus = statuses[Math.floor(Math.random() * statuses.length)]
        } while (newStatus === oldStatus)
        details = {
          oldStatus,
          newStatus,
          message: `${friend.name} のステータスが ${oldStatus} から ${newStatus} に変更されました`,
        }
        break
      case "game_join":
        const games = ["VRChat", "Beat Saber", "Horizon Worlds", "Rec Room", "Zenith"]
        const game = games[Math.floor(Math.random() * games.length)]
        details = { game, message: `${friend.name} が ${game} を開始しました` }
        break
      case "game_leave":
        const leaveGames = ["VRChat", "Beat Saber", "Horizon Worlds", "Rec Room", "Zenith"]
        const leaveGame = leaveGames[Math.floor(Math.random() * leaveGames.length)]
        details = { game: leaveGame, message: `${friend.name} が ${leaveGame} を終了しました` }
        break
      case "location_change":
        const locations = [
          "ホームワールド",
          "The Great Pug",
          "プライベートワールド",
          "Sleep World",
          "Quantum Space",
          "Tournament Arena",
        ]
        const oldLocation = locations[Math.floor(Math.random() * locations.length)]
        let newLocation
        do {
          newLocation = locations[Math.floor(Math.random() * locations.length)]
        } while (newLocation === oldLocation)
        details = {
          oldLocation,
          newLocation,
          message: `${friend.name} が ${oldLocation} から ${newLocation} に移動しました`,
        }
        break
      case "avatar_change":
        const avatars = [
          "Blue Neko",
          "Fire Samurai",
          "Night Raven",
          "Dream Walker",
          "Wanderer",
          "Cyber Blade",
          "Quantum Fox",
          "Neon Ghost",
        ]
        const oldAvatar = avatars[Math.floor(Math.random() * avatars.length)]
        let newAvatar
        do {
          newAvatar = avatars[Math.floor(Math.random() * avatars.length)]
        } while (newAvatar === oldAvatar)
        details = {
          oldAvatar,
          newAvatar,
          message: `${friend.name} のアバターが ${oldAvatar} から ${newAvatar} に変更されました`,
        }
        break
      case "message":
        const messages = [
          "こんにちは！",
          "今日は何してる？",
          "一緒にゲームしない？",
          "新しいワールド見つけたよ！",
          "このアバター、どう思う？",
        ]
        details = { message: `${friend.name}: ${messages[Math.floor(Math.random() * messages.length)]}` }
        break
    }

    logs.push({
      id: `log-${i}`,
      friendId: friend.id,
      timestamp,
      type,
      details,
    })
  }

  // 日付順にソート（新しい順）
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// モックログデータをエクスポート
export const mockLogs: LogEntry[] = []
