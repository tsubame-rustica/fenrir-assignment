# 簡易仕様書

### 名前
島田優大

#### アプリ名
QuickSearch

#### コンセプト
すぐ行きたいお店を探せるアプリ

#### こだわったポイント
ゆっくり探す時間がないときにすぐに探せるようマップから近くのお店を探せるようにしました。また、現在地だけではなく好きな地域でも検索できるようにしました。

#### デザイン面でこだわったポイント
飲食店を探すアプリのため食欲増進色であるオレンジ色を中心の配色にしました。また、簡易的な情報を表示しているところでは料金や場所などをアイコンで代用してユーザーにも認識してもらいやすいデザインにした

## 開発環境
### 開発環境
Visual Studio Code 1.96.3

nginx
- Mac：1.27.3
- WSL：1.18.0

### 開発言語
JavaScript

## 動作対象ブラウザ
Google Chrome 131.0.6778.266

## 開発期間
14日間


## アプリケーション機能

### 機能一覧
- マップ機能
    - Google Map APIを使用して地図を表示
        - Geolocation APIから緯度経度を取得しマップ上に青色のピンを表示
    - ホットペッパーグルメAPIを使用して現在地から半径3km以内の飲食店の緯度経度からピンを表示
    - ピンを押すとモーダルウィンドウ応じて飲食店の簡易情報が表示される
- 検索機能
    - 現在地の緯度経度から検索できる
    - 地名から検索
    - ジャンルを選択（複数選択）
    - 検索半径を指定できる
- 詳細情報を確認
    - 検索結果の画面やマップのピンを押すと表示されるモーダルウィンドウを押すと詳細情報を表示する
    - 表示する情報
        - 店舗名
        - キャッチコピー
        - ジャンル
        - 住所
        - アクセス
        - 予算
        - 営業時間
        - 定休日
        - その他の情報(Wi-Fiや個室の有無など)

### 画面一覧
- マップ画面：マップ上で飲食店がある場所にピンを表示する
- 条件検索画面：条件を指定して飲食店を探す
- 検索結果画面：検索結果を一覧で表示する
- 詳細情報画面：選択された飲食店の詳細な情報を表示する


### 設計図
![Image](https://github.com/user-attachments/assets/ea868385-dd2d-43d1-a568-8b9320af5f17)

### 使用しているAPI，SDK，ライブラリなど
#### API
- ホットペッパーグルメAPI
- Geolocation API
- Google Map API
    - Maps JavaScript API
    - Geocoding API


### アドバイスして欲しいポイント
マップ画面で各ピンからの移動距離を算出して表示したいです。また、APIキーをユーザーから見えないようにするにはどのようにしたら良いか教えていただきたいです。


### 自己評価
マップから飲食店を表示する機能を実装できたことができたことにはとても満足していますが、データベースを使用してユーザーにおすすめの飲食店を提示する機能やログイン機能で履歴などを保存する機能も実装したかったです。


## 申し送り事項
### 今後実装すべき機能
- マップで経路を案内する機能
- マップ機能でいくつかの条件で絞り込んでピンを表示させる機能
- 検索結果画面やマップ画面などで営業中かどうかが一目でわかるような機能

## 開発環境構築手順
#### nginxの環境構築
- Macの場合
    1. nginxのインストール
        ```sh
        brew install nginx
        ```
    
    2. エディタで以下の設定ファイルを開く
        ```
        /opt/homebrew/etc/nginx/nginx.conf
        ```

    3. 以下の部分を書き換える
        ```
        # 変更前
        server {
            listen       8080;
            server_name  localhost;

            #charset koi8-r;

            #access_log  logs/host.access.log  main;

            location / {
                root   html;
                index  index.html index.htm;
            }
            （中略）
        }
        ```
        ```
        # 変更後
        server {
            listen       8080;
            server_name  localhost;

            #charset koi8-r;

            #access_log  logs/host.access.log  main;

            location / {
                root   /Users/[ユーザー名]/fenrir-assignment;
                # root   html;
                index  index.html index.htm;
            }

            location /foreign_api/ {
                proxy_pass https://webservice.recruit.co.jp/hotpepper/;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    
                add_header 'Access-Control-Allow-Origin' '*';
            }

            （中略）
        }
        ``` 

    4. 権限を付与する
        ```sh
        chmod +x /Users/[ユーザー名]
        chmod 755 /Users/[ユーザー名]/fenrir-assignment
        ```

    5. nginxを起動する
        ```sh
        sudo nginx
        ```

- windowsの場合
    1. WSLを開いてnginxをインストールする
        ```sh
        sudo apt install nginx
        ```

    2. エディタで以下のファイルを開く
        ```
        /etc/nginx/sites-enabled/default
        ```

    3. 以下の部分を書き換える
        ```
        # 変更前
        server {
            listen 88 default_server;
            listen [::]:88 default_server;
            
            （中略）

            root /var/www/html;

            # Add index.php to the list if you are using PHP
            index index.html index.htm index.nginx-debian.html;

            server_name _;

            location / {
                    # First attempt to serve request as file, then
                    # as directory, then fall back to displaying a 404.
                    try_files $uri $uri/ =404;
            }

            （中略）
        }
        ```
        ```
        # 変更後
        server {
            listen 8080 default_server;
            listen [::]:8080 default_server;

            （中略）

            root /home/[ユーザー名]/fenrir-assignment;

            # Add index.php to the list if you are using PHP
            index index.html index.htm index.nginx-debian.html;

            server_name _;

            location / {
                    # First attempt to serve request as file, then
                    # as directory, then fall back to displaying a 404.
                    try_files $uri $uri/ =404;
            }

            location /foreign_api/ {
                    proxy_pass https://webservice.recruit.co.jp/hotpepper/;
                    proxy_set_header Host $host;
                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

                    add_header 'Access-Control-Allow-Origin' '*';
            }

            （中略）

        }
        ```

    4. 権限を付与する
        ```sh
        chmod +x /home/[ユーザー名]
        chmod 755 /home/[ユーザー名]/fenrir-assignment
        ```

    5. nginxを起動する
        ```sh
        sudo systemctl start nginx
        ```

もし、ポート番号を変更する場合は`map.js`の236行目と`condition.js`の256行を以下のように変更してください
```js
// 変更前
const apiUrl = 'http://localhost:8080/foreign_api/gourmet/v1';
```
```js
// 変更後
const apiUrl = 'http://localhost:[変更後のポート番号]/foreign_api/gourmet/v1';
```

#### 実行手順
1. 任意のディレクトリでリポジトリをクローンする
   ```sh
   git clone https://github.com/tsubame-rustica/fenrir-assignment.git ~/fenrir-assignment
   ```

2. http://localhost:8080/ を開く  
本アプリはモバイル端末での使用を想定しているので、ブラウザの開発者ツールから画面のサイズを「iPhone 12 Pro」等のスマートフォン用サイズに切り替えてください