export type FriendStatus = "online" | "offline" | "away" | "busy" | "in-game"
export type UserRank = "Visitor" | "New User" | "User" | "Known User" | "Trusted User" | "VRC Team"
export type Platform = "PC" | "Quest" | "Mobile"

export interface Friend {
  id: string
  name: string
  avatarUrl: string
  status: FriendStatus
  lastSeen?: string
  game?: string
  location?: string
  avatarName?: string
  isFavorite: boolean
  // 追加情報
  userRank?: UserRank
  friendNumber?: number
  platform?: Platform
  instanceCreator?: boolean
  instanceJoinDate?: string
  bio?: string
  groups?: {
    id: string
    name: string
    imageUrl: string
    memberCount: number
  }[]
  notes?: string
  memos?: string
  currentAvatar?: {
    name: string
    creator: string
    isOwn: boolean
  }
  joinDate?: string
  accountCreationDate?: string
  lastLoginDate?: string
  friendshipDate?: string
  onlineTime?: string
  userId?: string
  allowAvatarCloning?: boolean
}

export const mockFriends: Friend[] = [
  {
    id: "1",
    name: "Aiko_VR",
    avatarUrl: "/blue-haired-anime-profile.png",
    status: "online",
    location: "ホームワールド",
    avatarName: "Blue Neko",
    isFavorite: true,
    userRank: "Trusted User",
    friendNumber: 42,
    platform: "PC",
    instanceCreator: true,
    bio: "VRChatでアバターを作っています！よろしくお願いします！",
    groups: [
      {
        id: "g1",
        name: "アバター制作部",
        imageUrl: "/group-avatar-creators.png",
        memberCount: 24,
      },
    ],
    notes: "アバター作成のアドバイスをもらえる人",
    currentAvatar: {
      name: "Blue Neko V2",
      creator: "Aiko_VR",
      isOwn: true,
    },
    joinDate: "2021-05-10",
    accountCreationDate: "2020-12-15",
    lastLoginDate: "2023-04-16 11:27:25",
    friendshipDate: "2022-01-20",
    onlineTime: "3h 15m",
    userId: "usr_a4b2c3d4e5f6",
    allowAvatarCloning: true,
  },
  {
    id: "2",
    name: "VRExplorer",
    avatarUrl: "/fiery-gaze.png",
    status: "in-game",
    game: "VRChat",
    location: "The Great Pug",
    avatarName: "Fire Samurai",
    isFavorite: true,
    userRank: "Known User",
    friendNumber: 128,
    platform: "PC",
    bio: "ワールド探検が趣味です。新しい場所を見つけたら教えてください！",
    groups: [
      {
        id: "g2",
        name: "ワールド探検隊",
        imageUrl: "/group-world-explorers.png",
        memberCount: 42,
      },
    ],
    currentAvatar: {
      name: "Fire Samurai",
      creator: "AvatarForge",
      isOwn: false,
    },
    joinDate: "2020-08-22",
    accountCreationDate: "2020-07-30",
    lastLoginDate: "2023-04-15 18:45:12",
    friendshipDate: "2021-03-15",
    onlineTime: "5h 30m",
    userId: "usr_b5c6d7e8f9g0",
    allowAvatarCloning: false,
  },
  // 他のフレンドデータは省略...
  {
    id: "3",
    name: "NightOwl",
    avatarUrl: "/black-haired-anime-avatar.png",
    status: "away",
    lastSeen: "10分前",
    location: "プライベートワールド",
    avatarName: "Night Raven",
    isFavorite: false,
    userRank: "User",
    friendNumber: 75,
    platform: "PC",
    bio: "夜行性です。深夜のVRChatで会いましょう。",
    currentAvatar: {
      name: "Night Raven",
      creator: "MidnightCreations",
      isOwn: false,
    },
    joinDate: "2021-11-05",
    accountCreationDate: "2021-10-20",
    lastLoginDate: "2023-04-16 02:15:33",
    friendshipDate: "2022-02-14",
    onlineTime: "45m",
    userId: "usr_c6d7e8f9g0h1",
    allowAvatarCloning: false,
  },
  {
    id: "4",
    name: "PixelDreamer",
    avatarUrl: "/purple-haired-avatar.png",
    status: "busy",
    location: "Sleep World",
    avatarName: "Dream Walker",
    isFavorite: false,
    userRank: "Known User",
    friendNumber: 210,
    platform: "Quest",
    bio: "VRでの夢の世界を探検中。話しかけてくれたら嬉しいです！",
    groups: [
      {
        id: "g3",
        name: "ドリームワールド愛好会",
        imageUrl: "/group-dream-worlds.png",
        memberCount: 18,
      },
    ],
    currentAvatar: {
      name: "Dream Walker",
      creator: "DreamForge",
      isOwn: false,
    },
    joinDate: "2022-01-15",
    accountCreationDate: "2021-12-25",
    lastLoginDate: "2023-04-15 22:10:45",
    friendshipDate: "2022-03-08",
    onlineTime: "1h 20m",
    userId: "usr_d7e8f9g0h1i2",
    allowAvatarCloning: true,
  },
  {
    id: "5",
    name: "VirtualNomad",
    avatarUrl: "/emerald-gaze.png",
    status: "offline",
    lastSeen: "2日前",
    avatarName: "Wanderer",
    isFavorite: false,
    userRank: "User",
    friendNumber: 63,
    platform: "PC",
    bio: "デジタルノマド。VRChatで世界中の友達と繋がっています。",
    currentAvatar: {
      name: "Wanderer",
      creator: "NomadStudios",
      isOwn: false,
    },
    joinDate: "2021-07-18",
    accountCreationDate: "2021-06-30",
    lastLoginDate: "2023-04-14 15:22:18",
    friendshipDate: "2021-09-05",
    userId: "usr_e8f9g0h1i2j3",
    allowAvatarCloning: false,
  },
  {
    id: "6",
    name: "CyberSamurai",
    avatarUrl: "/white-haired-anime-profile.png",
    status: "in-game",
    game: "Beat Saber",
    location: "Tournament Arena",
    avatarName: "Cyber Blade",
    isFavorite: true,
    userRank: "Trusted User",
    friendNumber: 315,
    platform: "PC",
    instanceCreator: true,
    bio: "サイバーパンクな世界が好き。Beat Saberの腕には自信あり！",
    groups: [
      {
        id: "g4",
        name: "Beat Saber Masters",
        imageUrl: "/group-beat-saber.png",
        memberCount: 56,
      },
    ],
    currentAvatar: {
      name: "Cyber Blade",
      creator: "NeonForge",
      isOwn: true,
    },
    joinDate: "2020-03-10",
    accountCreationDate: "2020-02-28",
    lastLoginDate: "2023-04-16 09:45:30",
    friendshipDate: "2020-05-12",
    onlineTime: "4h 10m",
    userId: "usr_f9g0h1i2j3k4",
    allowAvatarCloning: true,
  },
  {
    id: "7",
    name: "QuantumDrifter",
    avatarUrl: "/vibrant-orange-anime-profile.png",
    status: "online",
    location: "Quantum Space",
    avatarName: "Quantum Fox",
    isFavorite: false,
    userRank: "Known User",
    friendNumber: 178,
    platform: "PC",
    bio: "量子力学とVRの融合に興味があります。物理の話をしましょう！",
    currentAvatar: {
      name: "Quantum Fox",
      creator: "QuantumDesigns",
      isOwn: false,
    },
    joinDate: "2021-02-20",
    accountCreationDate: "2021-01-15",
    lastLoginDate: "2023-04-16 10:30:15",
    friendshipDate: "2021-04-30",
    onlineTime: "2h 45m",
    userId: "usr_g0h1i2j3k4l5",
    allowAvatarCloning: false,
  },
  {
    id: "8",
    name: "NeonSpectre",
    avatarUrl: "/pink-haired-anime-profile.png",
    status: "offline",
    lastSeen: "1週間前",
    avatarName: "Neon Ghost",
    isFavorite: false,
    userRank: "User",
    friendNumber: 92,
    platform: "Quest",
    bio: "ネオンの光の中で踊るのが好き。パーティーワールドで会いましょう！",
    currentAvatar: {
      name: "Neon Ghost",
      creator: "GlowStudios",
      isOwn: false,
    },
    joinDate: "2022-04-05",
    accountCreationDate: "2022-03-20",
    lastLoginDate: "2023-04-09 23:15:40",
    friendshipDate: "2022-05-18",
    userId: "usr_h1i2j3k4l5m6",
    allowAvatarCloning: true,
  },
]
