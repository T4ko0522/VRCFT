import os
import time
import pickle
from dotenv import load_dotenv
from http.cookiejar import Cookie
import vrchatapi
from vrchatapi.api import friends_api

# 環境変数の読み込み
load_dotenv()
username = os.getenv("EMAIL")
cookie_save_path = "vrchat_cookie.pkl"

# Cookieオブジェクトの作成
def make_cookie(name, value, expires):
    return Cookie(0, name, value, None, False, "api.vrchat.cloud", True, False,
                  "/", True, False, expires, False, None, None, {}, False)

# APIクライアントの設定
configuration = vrchatapi.Configuration()

with vrchatapi.ApiClient(configuration) as api_client:
    api_client.user_agent = f"VRCFT/1.0 {username}"
    
    # Cookieの読み込みと設定
    if os.path.exists(cookie_save_path):
        with open(cookie_save_path, "rb") as f:
            cookie_data = pickle.load(f)
            now = time.time()
            for c in cookie_data:
                if c.get("expires") is not None and c["expires"] < now:
                    print(f"⚠️ Cookie「{c['name']}」は期限切れです")
                    continue
                api_client.rest_client.cookie_jar.set_cookie(
                    make_cookie(c["name"], c["value"], c["expires"])
                )
    else:
        print("Cookieファイルが存在しません。先に login.py を実行してください。")
        exit(1)

    # Friends APIのインスタンス作成
    friends_api_instance = friends_api.FriendsApi(api_client)

    # フレンド情報の取得関数
    def fetch_all_friends(offline_status):
        all_friends = []
        offset = 0
        limit = 100  # 最大100件まで取得可能
        while True:
            try:
                friends = friends_api_instance.get_friends(offset=offset, n=limit, offline=offline_status)
                if not friends:
                    break
                all_friends.extend(friends)
                if len(friends) < limit:
                    break
                offset += limit
            except Exception as e:
                print(f"フレンド取得中にエラーが発生しました: {e}")
                break
        return all_friends

    # オンラインとオフラインのフレンドを取得
    online_friends = fetch_all_friends(offline_status=False)
    offline_friends = fetch_all_friends(offline_status=True)
    # すべてのフレンドを結合
    all_friends = online_friends + offline_friends

    # フレンドを一意なIDでまとめる
    unique_friends = {}
    for friend in all_friends:
        unique_friends[friend.id] = friend  # 同じIDなら上書きされる

    # 表示
    print(f"\n✅ 重複除外後のフレンド総数: {len(unique_friends)}\n")
    for friend in unique_friends.values():
        print(f"- {friend.display_name}（{friend.status}）")
