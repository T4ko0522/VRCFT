import vrchatapi
from vrchatapi.api import authentication_api
from vrchatapi.exceptions import UnauthorizedException
from vrchatapi.models.two_factor_auth_code import TwoFactorAuthCode
from vrchatapi.models.two_factor_email_code import TwoFactorEmailCode

from dotenv import load_dotenv
import os
import time
import pickle
from http.cookiejar import Cookie

load_dotenv()

username = os.getenv("EMAIL")
password = os.getenv("PASSWORD")
user_id = os.getenv("UUID")
cookie_save_path = "vrchat_cookie.pkl"

# Cookieを作成する関数
def make_cookie(name, value, expires):
    return Cookie(
        version=0,
        name=name,
        value=value,
        port=None,
        port_specified=False,
        domain="api.vrchat.cloud",
        domain_specified=True,
        domain_initial_dot=False,
        path="/",
        path_specified=True,
        secure=False,
        expires=expires,  # 有効期限を設定
        discard=False,
        comment=None,
        comment_url=None,
        rest={},
        rfc2109=False
    )

# login設定を作成
configuration = vrchatapi.Configuration(
    username = username,
    password = password,
)

with vrchatapi.ApiClient(configuration) as api_client:
    api_client.user_agent = f"Mozilla/5.0 {username}"
    auth_api = authentication_api.AuthenticationApi(api_client)

    # Cookieファイルが存在すれば読み込み
    if os.path.exists(cookie_save_path):
        with open(cookie_save_path, "rb") as f:
            cookie_data = pickle.load(f)
            # 読み込んだデータがリスト形式であるかチェック
            if not isinstance(cookie_data, list):
                print("⚠️ Cookieファイルの形式が不正です。再作成します。")
                cookie_data = []  # 空リストとして扱う
            else:
                now = time.time()
                for c in cookie_data:
                    if c["expires"] is not None and c["expires"] < now:
                        print(f"⚠️ Cookie「{c['name']}」は期限切れです。スキップします。")
                        continue
                    # Cookieをjarにセット
                    api_client.rest_client.cookie_jar.set_cookie(
                        make_cookie(c["name"], c["value"], c["expires"])
                    )

    try:
        # ログインしていない場合get_current_userを呼び出してでログイン
        current_user = auth_api.get_current_user()
    except UnauthorizedException as e:
        if e.status == 200:
            try:
                if "Email 2 Factor Authentication" in e.reason:
                    # 二段階認証メール
                    code = input("Email 2FA Code: ")
                    auth_api.verify2_fa_email_code(two_factor_email_code=TwoFactorEmailCode(code))
                elif "2 Factor Authentication" in e.reason:
                    # 二段階認証コード
                    code = input("2FA Code: ")
                    auth_api.verify2_fa(two_factor_auth_code=TwoFactorAuthCode(code))
                current_user = auth_api.get_current_user()
            except vrchatapi.ApiException as auth_error:
                if auth_error.status == 401 or auth_error.status == 400:
                    print("⚠️ 2段階認証コードが無効です。正しいコードを入力してください。")
                else:
                    print("APIエラーが発生しました:", auth_error)
                exit(1)
        else:
            print("Exception when calling API: %s\n" % e)
            exit(1)
    except vrchatapi.ApiException as e:
        print("Exception when calling API: %s\n" % e)
        exit(1)

    print("Logged in as:", current_user.display_name)

    # 認証成功後、cookieを保存
    cookie_data = []
    for c in api_client.rest_client.cookie_jar:
        if c.name in ["auth", "twoFactorAuth"]:
            cookie_data.append({
                "name": c.name,
                "value": c.value,
                "expires": c.expires  # ← 有効期限も保存
            })
    with open(cookie_save_path, "wb") as f:
        pickle.dump(cookie_data, f)