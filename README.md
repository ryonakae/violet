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
      TUMBLR_CONSUMER_KEY: 'xxxxxxxxxx',
      TUMBLR_SECRET_KEY: 'xxxxxxxxxx'
    }


## Development
### MongoDB起動
別プロセス(別タブ)で実行

    $ npm run db

### アプリ起動
pm2で変更をwatchして自動でアプリ再起動

    $ npm run watch

### アプリ終了

    $ npm run stop