# Violet for Tumblr

## Setup
### HomebrewとNode.jsのインストール
あらかじめやっとく

### Sails.jsインストール

    $ npm i -g sails

### pm2インストール

    $ npm i -g pm2

### MongoDBインストール

    $ brew install mongodb
        
### リポジトリをclone
### パッケージインストール

    $ npm i
    
### local.jsの作成と編集
#### 作成

    $ touch config/local.js
    
#### 編集
エディタで開いて下記のように編集  
`xxxxxxxxxx`にTumblrで取得したConsumer KeyとConsumer Secretを入れる

    module.exports = {
      SECRET_KEY: 'some_random_secret',

      TUMBLR_CONSUMER_KEY: 'xxxxxxxxxx',
      TUMBLR_SECRET_KEY: 'xxxxxxxxxx'
      
      session: {
        adapter: 'memory'
      }
    }
    
Session管理は本番ではRedisを使うが、ローカルでは(設定めんどくさいので)Memoryを使う


## Development
### MongoDB起動
別プロセス(別タブ)で実行

    $ npm run db

### アプリ起動
pm2で変更をwatchして自動でアプリ再起動

    $ npm run watch

### アプリ終了

    $ npm run stop
    
    
## Production
### 参考
* [Deploy a new Sails.js app to Heroku](http://brentvatne.ca/deploy-sails-to-heroku/)

### Redis To GoのURL取得
Session管理をRedisでやるので

    $ heroku config:get REDISTOGO_URL
    
### 環境変数をセット
得られたURLは`redis://REDIS_DB:REDIS_PASSWORD@REDIS_HOST:REDIS_PORT/`のようになっているらしい  
そこから各種環境変数をHerokuにセットする

    $ heroku config:add REDIS_HOST=xxxxx
    $ heroku config:add REDIS_PORT=xxxxx
    $ heroku config:add REDIS_DB=xxxxx
    $ heroku config:add REDIS_PASSWORD=xxxxx
    
TumblrのConsumer KeyとConsumer Secretも忘れずにセット

    $ heroku config:add TUMBLR_CONSUMER_KEY=xxxxx
    $ heroku config:add TUMBLR_SECRET_KEY=xxxxx
    
ちなみにセットした環境変数一覧は下記で確認できる

    $ heroku config
    
### デプロイ
事前に`master`を最新にしておく

    $ git push heroku master

    
## OpenShift
HerokuやめてOpenShiftに移行する予定

### rhcのインストール

    $ rbenv exec gem install rhc
    
### セットアップ

    $ rhc setup
    
なんやかんや

### SSH

    $ rhc ssh -a violet
    
#### 環境変数確認

    > env
    > env | grep MONGODB
    
#### 環境変数追加・削除
    
    # 追加
    $ rhc set-env TUMBLR_SECRET_KEY=xxxxx -a violet
    
    # 削除
    $ rhc unset-env TUMBLR_SECRET_KEY -a violet

#### 自分でセットする環境変数
* `SESSION_SECRET`
* `SECRET_KEY`
* `TUMBLR_CONSUMER_KEY`
* `TUMBLR_SECRET_KEY`
    
### git remote add

    $ git remote add openshift ssh://0123456789abcdef01234567@openshiftapp-yourdomain.rhcloud.com/~/git/openshiftapp.git/
    
### git push

    $ git push openshift master


## その他
* Redisちゃんと設定できてるか不安
* アレならセッション管理もMongoDBでやる