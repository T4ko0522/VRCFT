# VRCFT
**VRCFT(VRChatFriendTracker)** - VRChatのAPIを叩き、設定したフレンドのログを監視、通知するアプリ。Discordの特定のチャンネルへWebhookでの通知、Windowsへの通知、SteamVRのオーバーレイを予定しています。

## 使用技術
1. Python  
2. C# - SteamVR状にオーバーレイを表示させるのに使用
3. Unity - SteamVR状にオーバーレイを表示させるのに使用

## 参考になりそうな記事

SteamVRオーバーレイの実装  
[UnityでつくるSteamVRオーバーレイアプリケーション](https://zenn.dev/kurohuku/books/a082c5728cc1f6/viewer/introduction)  
[VRCX/Dotnet/Overlay](https://github.com/vrcx-team/VRCX/tree/59d3ead781c0aa548d4bedd7343b4a204dfd0eb5/Dotnet/Overlay)

VRChat APIの利用  
[VRChat API Docs](https://vrchatapi.github.io/)  
[VRChat API使ってみた](https://qiita.com/Bulgent/items/a4fc7f901b8f3cec7423)  

DiscordへのWebhook通知  
[PythonからDiscord Webhookを利用する](https://zenn.dev/karaage0703/articles/926f18ba04e093)  

Windows通知の実装  
[WindowsのPythonでデスクトップ通知(トースト)作ってみた【WinRT】](https://qiita.com/relu/items/51e89f2346b5fd7ed49d)
