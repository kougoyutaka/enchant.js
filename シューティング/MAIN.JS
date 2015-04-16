enchant();
//自機クラス
var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y){
    enchant.Sprite.call(this, 16, 16);
    this.image = game.assets['graphic.png'];
    this.x = x; this.y = y; this.frame = 0;
    //自機の操作　タッチ移動
　　game.rootScene.addEventListener('touchstart', 
       function(e){ player.y = e.y; game.touched = true; });
    game.rootScene.addEventListener('touchend', 
       function(e){ player.y = e.y; game.touched = false;});
    game.rootScene.addEventListener('touchmove', 
       function(e){ player.y = e.y ;});
    this.addEventListener('enterframe', function(){
       if(game.input.left) this.x -= 5;
       if(game.input.right) this.x += 5;
       if(game.input.up) this.y -= 5;
       if(game.input.down) this.y += 5
   // 3フレ一回、タマうち
       if(this.y > 310 || this.x > 310 || this.x < -this.width || this.y < -this.height) {
       game.end(game.score, "SCORE: " + game.score)
    }
　　  if(game.touched && game.frame % 15 == 0){
      var s = new PlayerShoot(this.x, this.y); }
    });
    game.rootScene.addChild(this);  
   }
    });
//敵のクラス
　　var Enemy = enchant.Class.create(enchant.Sprite, {
        initialize: function(x, y, omega){
           enchant.Sprite.call(this, 16, 16);
           this.image = game.assets['graphic.png'];
           this.x = x; this.y = y; this.frame = 3; this.time = 0;
           this.omega = omega*Math.PI / 180; //ラジアン
　　　　　 this.direction = 0; this.moveSpeed = 3;
//敵の動き
   this.addEventListener('enterframe', function(){
        this.direction += this.omega;
        this.x -= this.moveSpeed * Math.cos(this.direction);
        this.y += this.moveSpeed * Math.sin(this.direction);
        
//画面外で消える
  if(this.y > 320 || this.x > 320 || this.x < -this.width || this.y < -this.height) {
       this.remove();
 }else if(this.time++ % 12 == 0){ //10触れ一うち 
　     var s = new EnemyShoot(this.x, this.y);
       }
      });
       game.rootScene.addChild(this);
       },
       remove: function(){
         game.rootScene.removeChild(this);
         delete enemies[this.key]; delete this;
       }
       });
      //玉クラス
var Shoot = enchant.Class.create(enchant.Sprite, {
           initialize: function(x, y, direction){
           enchant.Sprite.call(this, 16, 16);
           this.image = game.assets['graphic.png'];
           this.x = x; this.y = y; this.frame = 2;
           this.direction = direction; this.moveSpeed = 10;
           //弾は決められたほうにまっすぐ飛ぶ
　　　this.addEventListener('enterframe', function(){
           this.x += this.moveSpeed * Math.cos(this.direction);
           this.y += this.moveSpeed * Math.sin(this.direction);
           if(this.y > 320 || this.x > 320 || this.x < -this.width || this.y < -this.height){
               this.remove();
           }
});
          game.rootScene.addChild(this);
},
          remove: function(){ game.rootScene.removeChild(this); delete this; }
         });
      //プレイヤーの弾クラス
var PlayerShoot = enchant.Class.create(Shoot, {  
          //タマクラスを継承
          initialize: function(x, y){
          Shoot.call(this, x, y, 0);
          this.addEventListener('enterframe', function(){
　　　　  for(var i in enemies){
          if(enemies[i].intersect(this)){
var blast = new Blast(enemies[i].x,enemies[i].y);
　　　　  this.remove(); enemies[i].remove();
          game.score += 100; //スコア
}
}
});
}
});
//敵の弾
var EnemyShoot = enchant.Class.create(Shoot, {  //弾のクラス
         initialize: function(x, y){
         Shoot.call(this, x, y, Math.PI);
         this.addEventListener('enterframe', function(){
         //当たればゲームオーバー
　　　   if(player.within(this, 8)){
            game.end(game.score, "SCORE: " + game.score)
    }
   });
  }
});
var Blast = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y){
    enchant.Sprite.call(this,16,16);
    this.x = x;
    this.y = y;
    this.image = game.assets['effect0.gif'];
    this.time = 0;
    this.duration = 20;
    this.frame = 0;
    this.addEventListener('enterframe', function(){
    this.time++;
    this.frame = Math.floor(this.time/this.duration *5);
    if(this.time == this.duration)this.remove();
     });
    game.rootScene.addChild(this);
},
    remove: function(){
     game.rootScene.removeChild(this);
}
});
var Background = enchant.Class.create(enchant.Sprite, {
    initialize: function(){
    enchant.Sprite.call(this,640,320);
    this.x = 0;
    this.y = 0;
    this.image = game.assets['bg.png'];
    this.addEventListener('enterframe', function(){
    this.x--;
    if(this.x<=-320)this.x=0;
    });
    game.rootScene.addChild(this);
}
});
window.onload = function() {
  //初期設定
    game = new Game(320, 320);
    game.fps = 24; game.score = 0; game.touched = false; game.preload('graphic.png','bg.png','effect0.gif');
    game.onload = function() {
    background = new Background();
    player = new Player(0, 152);
    //Ｐ出現
　　enemies = [];
    game.rootScene.backgroundColor = 'black';
    game.rootScene.addEventListener('enterframe', function(){
    //ゲーム進行
    if(rand(100)<10){
//ランダムに敵キャラを登場
　　var y = rand(320);
    var omega = y < 160 ? 1 : -1;
    var enemy = new Enemy(320, y, omega);
    enemy.key = game.frame;
    enemies[game.frame] = enemy;
}
    scoreLabel.score = game.score;   
});
scoreLabel = new ScoreLabel(8, 8);
game.rootScene.addChild(scoreLabel);
 }
game.start();
}