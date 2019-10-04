var monstruosidades= `{
    "Slime": {
      "name": "Slime",
      "image": "image/slime.png",
      "imageDeath":"image/slimedead.png",
      "max_health": "50",
      "quemado": "false",
      "monsterIcecream":0,
      "monsterHealth": 50,
      "damage": 5,
      "statusEffects": ""
    },
    "Wisp": {
      "name": "Space Pirate",
      "image": "image/wisp.png",
      "imageDeath":"image/wispdead.png",
      "max_health": "100",
      "quemado": "false",
      "monsterIcecream":0,
      "monsterHealth": 100,
      "damage": 15,
      "statusEffects": ""
    },
    "Ghost": {
      "name": "Ghost Tv",
      "max_health": "120",
      "quemado": "false",
      "monsterIcecream":0,
      "image": "image/tv.png",
      "imageDeath":"image/tvdead.png",
      "monsterHealth": 120,
      "damage": 25,
      "statusEffects": ""
    }
  }`;
var monstruosJson = JSON.parse(monstruosidades);

new Vue({
    el:"#app",
    data:{
        playerHealth:100,
        playerMana:10,
        monstruoIdActual:0,
        monstruoActual:0,
        victorias:0,
        turnosQuemado:0,
        monsterHealth:0,
        quemado:false,
        derrotas:0,
        contadorTurnos:0,
        regenHp:false,
        turnosRegenHp:0,
        playerHasMana:true,
        imagenPlayer:'image/mage.png',
        imagenBoss:"",
        gameIsRunning:false,
        logs:['Welcome to RNG BOSS if u win u r so lucky','Instructions:','Green-bar is your health points','Lightblue-bar is your mana points','Sacred Attack regen +2MP & deal 3-7 damage','Fire Ball consume 2MP, deal 8-15 damage & could burn the monster','Healing magic heals 10-25HP','The monster can also heal itself']
    },
    methods:{
        calculateDamage:function(min,max){
            return Math.max(Math.floor(Math.random()*max)+1,min);
        },
        monsterAttack:function(){
            this.imagenBoss=this.monstruoActual.image;
            this.contadorTurnos++;
            this.checkMonsterFood();
            this.checkQuemadura();
            this.checkRegen();
            var damage=this.calculateDamage((this.monstruoActual.damage/-5),this.monstruoActual.damage);
            var oneshot = this.calculateDamage(0,150);
            if(oneshot == 75){
                this.playerHealth=0;//RNG HE CAN ONE SHOT U
                this.logs.unshift("The monster ate u, hmmmm delicius, finally he ate some good food");
                this.checkWin(); 
            }else{
                if(this.contadorTurnos > 60){
                    var dado = this.calculateDamage(0,10);
                    if(dado > 6){
                        this.playerHealth=0;//RNG HE CAN ONE SHOT U
                        this.logs.unshift("The monster ate u, hmmmm delicius, finally he ate some good food");
                        this.checkWin(); 
                    }
                }else{
                    var healing=0;
                    var currentHealth=this.monstruoActual.monsterHealth;
                    this.playerHealth-=damage;
                    if(damage<7){ 
                        this.monstruoActual.monsterIcecream++;
                        this.logs.unshift("The monster found a new soul!! Yummi")
                    }
                    if(damage>9){
                        this.imagenBoss='image/tvheal.png';
                        this.monstruoActual.monsterHealth+=damage/2;          
                        if((currentHealth+damage)>100){
                            healing=damage-(this.monstruoActual.monsterHealth-100);
                            this.monstruoActual.monsterHealth=100;
                            if(healing>0)
                                this.logs.unshift("The monster bit you and lifesteal: +"+healing+" HP");
                        }else{
                            this.logs.unshift("The monster bit you and lifesteal: +"+damage+" HP");
                        }
                    }else{
                        this.logs.unshift("The monster dealt: "+damage+" damage to you");
                    }
                    this.logs.unshift('The monster has '+this.monstruoActual.monsterIcecream+' souls');
                    this.checkWin();
                    }
            }            
        },
        checkMonsterFood(){
            var healing =this.calculateDamage(5,15);
            if(this.monstruoActual.monsterIcecream > 0 && this.monstruoActual.monsterHealth < 60){
                this.monstruoActual.imagenBoss='image/tvheal.png';
                this.monstruoActual.monsterHealth+=healing;
                this.monstruoActual.monsterIcecream--;
                this.logs.unshift("The monster ate a soul and healed itself +"+ healing + "HP")
            }
        },
        checkWin:function(){
            if(this.monstruoActual.monsterHealth <= 0){
                this.monstruoActual.monsterHealth = 0;
                this.victorias++;
                this.monstruoActual.imagenBoss='image/tvdead.png';
                this.finalize('U won this time, play again?');
                return true;
            }else if(this.playerHealth<=0){
                this.playerHealth=0;
                this.derrotas++;
                this.imagenPlayer='image/dead.png';
                this.finalize('U DEAD, continue?');      
                return true;
            }   
            return false;
        },
        empezarJuego: function(){
            this.playerHealth = 100;
            this.playerMana = 10;
            this.turnosQuemado = 0;
            this.regenHp = false;
            this.turnosRegenHp = 0;
            this.monstruoIdActual=0;
            this.monstruoActual = monstruosJson[this.monstruoIdActual];
            this.contadorTurnos = 0;
            this.imagenBoss = monstruoActual.image,
            this.imagenPlayer = 'image/mage.png';
            this.playerHasMana = true;
            this.gameIsRunning = true;
            this.logs = ['Welcome to RNG BOSS if u win u r so lucky','Instructions:','Green-bar is your health points','Lightblue-bar is your mana points','Sacred Attack regen +2MP & deal 3-7 damage','Fire Ball consume 2MP, deal 8-15 damage & could burn the monster','Healing magic heals 10-25HP','The monster can also heal itself'];
        },
        ataque:function(){
            this.logs=[];
            this.imagenPlayer='image/magenormal.png';
            var damage=this.calculateDamage(3,7);
            this.monstruoActual.monsterHealth-=damage;
            var manaRegen=2;
            var lifesteal=10;
            this.playerMana+=manaRegen;
            if(this.playerMana>9)
                this.playerMana=10;
            if(damage == 4){
                this.playerHealth+=lifesteal;
                this.logs.unshift("You healed yourself: +"+ lifesteal +"HP");
                if(this.playerHealth > 100)
                    this.playerHealth = 100;
            }
            this.logs.unshift("You dealt: "+damage+" damage to the monster");
            if(this.checkWin()){
                return;
            }
            this.checkMana();
            this.monsterAttack();
        },
        checkQuemadura:function(){
            var burnDamage = this.calculateDamage(2,5);
            if(this.monstruoActual.quemado){
                this.turnosQuemado--;
                this.monstruoActual.monsterHealth-= burnDamage;
                this.logs.unshift("The burn did "+ burnDamage +" damage");
            }
            if(this.turnosQuemado === 0){
                this.monstruoActual.quemado = false;
            }else{
                this.monstruoActual.quemado = true;
            }
            this.checkWin();
        },
        checkRegen:function(){
            var hpRegen = this.calculateDamage(5,10);
            if(this.regenHp){
                this.turnosRegenHp--;
                this.playerHealth+= hpRegen;
                this.logs.unshift("U regen "+ hpRegen+" hp");
            }
            if(this.turnosRegenHp === 0){
                this.regenHp = false;
            }else{
                this.regenHp = true;
            }
        },
        ataqueEspecial:function(){
            this.logs=[];
            var damage=this.calculateDamage(9,20);
            var manaCost=2;
            this.checkMana(manaCost);
            if(this.playerHasMana){
                this.imagenPlayer='image/special.png';
                this.monstruoActual.monsterHealth-=damage;
                this.playerMana-=manaCost;
                this.logs.unshift("You dealt: "+damage+" damage to the monster with your special attack");
                if(damage<14 && !this.monstruoActual.quemado){
                    this.turnosQuemado=this.calculateDamage(1,4);
                    this.logs.unshift("U burned the monster for "+ this.turnosQuemado +" turns");
                }
                if(this.checkWin()){
                    return;
                }
                this.monsterAttack();
            }
            
        },
        checkMana:function(a){
            this.logs=[];
            if(this.playerMana < a){
                this.playerHasMana = false;
                this.logs.unshift("You don't have enough Mana");
            }else{
                this.playerHasMana = true;
            }
        },
        curar:function(){ 
            this.logs=[];
            var manaCost=2;          
            var healing=this.calculateDamage(10,25);// random healing hehe
            this.checkMana(manaCost);
            if(this.playerHasMana){
                this.monsterAttack();
                var currentHealth=this.playerHealth;
                if(this.playerHealth > 0){
                    this.imagenPlayer='image/heal.png';
                    this.playerHealth+=healing;
                    if(healing<14 && !this.regenHp){
                        this.turnosRegenHp=this.calculateDamage(3,6);
                        this.logs.unshift("U gain hp regen for " + this.turnosRegenHp + " turns");
                        this.regenHp = true;
                    }
                    if(currentHealth<100)
                        this.playerMana-=manaCost;
                    if((currentHealth+healing)>100){
                        healingB=healing-(this.playerHealth-100);
                        this.playerHealth=100;
                        if(healingB>0)
                            this.logs.unshift("You healed for: "+healingB+" HP");
                    }else{
                        this.logs.unshift("You healed for: "+healing+" HP");
                    }
                }                                   
            }  
        },
        rendirse:function(){
            this.logs=[];
            this.derrotas++;
            this.imagenPlayer='image/dead.png';
            this.gameIsRunning=false;
            this.logs.unshift("Too strong for you? ñam ñam ñam"); 
        },
        finalize: function(message) {
            this.gameIsRunning=false;
            setTimeout(() => { 
                if(confirm(message))
                    this.empezarJuego();                         
              }, 500);  
          }
    }
});