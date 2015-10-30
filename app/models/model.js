var mongoose = require('mongoose');
var url = 'mongodb://localhost/user'; // database
var db = mongoose.createConnection(url, function(err, res){
  if(err){
    console.log('Error connected: ' + url + ' - ' + err);
  }else{
    console.log('Success connected: ' + url);
  }
});

var UserSchema = new mongoose.Schema({
  username: { type:String, unique: true }
}, {
  collection: 'info'
});

// UserSchemaの定義をコンパイルして、model = ドキュメントのコンストラクタを生成する
// ここでは'User'というdbにユーザーアカウント情報を足していく、っていう定義
exports.User = db.model('User', UserSchema);