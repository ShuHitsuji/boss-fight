new Vue({
    el:"#app",
    data:{
        playerHealth:100,
        playerMana:10,
        monsterHealth:100,
        monsterIcecream:0,
        playerHasMana:true,
        imagenPlayer:'image/mage.png',
        imagenBoss:'image/tv.png',
        gameIsRunning:false,
        logs:['Welcome to RNG BOSS if u win u r so lucky','Instructions:','Green-bar is your health points','Lightblue-bar is your mana points','Attack regen +2MP & deal 3-7 damage','Special Attack consume 2MP & deal 9-15 damage','Potions heals 10-25HP','The monster can also heal itself']
    },
    methods:{
        calculateDamage:function(min,max){
            return Math.max(Math.floor(Math.random()*max)+1,min);
        },
        monsterAttack:function(){
            this.checkMonsterFood(); 
            var damage=this.calculateDamage(5,12);
            if(this.calculateDamage(0,100)==75){
                this.playerHealth=0;//RNG HE CAN ONE SHOT U
                this.logs.unshift("The monster ate u, hmmmm delicius, finally he ate some good food");
                this.checkWin(); 
            }else{
                var healing=0;
                var currentHealth=this.monsterHealth;
                this.playerHealth-=damage;
                if(damage==7){
                    this.imagenBoss='image/tvheal.png';
                    this.monsterIcecream++;
                    this.logs.unshift("The monster found a new soul!! Yummi")
                }
                if(damage>9){
                    this.imagenBoss='image/tvheal.png';
                    this.monsterHealth+=damage;          
                    if((currentHealth+damage)>100){
                        healing=damage-(this.monsterHealth-100);
                        this.monsterHealth=100;
                        if(healing>0)
                            this.logs.unshift("The monster bit you and lifesteal: +"+healing+" HP");
                    }else{
                        this.logs.unshift("The monster bit you and lifesteal: +"+damage+" HP");
                    }
                }else{
                    this.imagenBoss='image/tv.png';
                    this.logs.unshift("The monster dealt: "+damage+" damage to you");
                }
                this.checkWin(); 
            }            
        },
        checkMonsterFood(){
            var healing =this.calculateDamage(10,20);
            if(this.monsterIcecream>0 && this.monsterHealth<50){
                this.monsterHealth+=healing;
                this.monsterIcecream--;
                this.logs.unshift("The monster ate a soul and healed itself +"+ healing + "HP")
            }
        },
        checkWin:function(){
            if(this.monsterHealth<=0){
                this.monsterHealth=0;
                this.imagenBoss='image/tvdead.png'
                this.finalize('U won this time, play again?')
                return true;
            }else if(this.playerHealth<=0){
                this.playerHealth=0;
                this.imagenPlayer='image/dead.png';
                this.finalize('U DEAD, continue?');      
                return true;
            }   
            return false;
        },
        empezarJuego: function(){
            this.playerHealth=100;
            this.playerMana=10;
            this.monsterHealth=100;
            this.monsterIcecream=0,
            this.imagenBoss='image/tv.png'
            this.imagenPlayer='image/mage.png';
            this.playerHasMana=true;
            this.gameIsRunning=true;
            this.logs=['Instructions:','Green-bar is your health points','Lightblue-bar is your mana points','Attack regen +2MP & deal 3-7 damage','Special Attack consume 2MP & deal 9-15 damage','Potions heals 10-25HP','The monster can also heal itself'];

        },
        ataque:function(){
            this.logs=['The monster has '+this.monsterIcecream+' souls'];
            this.imagenPlayer='image/magenormal.png';
            var damage=this.calculateDamage(3,7);
            this.monsterHealth-=damage;
            var manaRegen=2;
            var lifesteal=10;
            this.playerMana+=manaRegen;
            if(this.playerMana>9)
                this.playerMana=10;
            if(damage == 5){
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
        ataqueEspecial:function(){
            this.logs=['The monster has '+this.monsterIcecream+' souls'];
            var damage=this.calculateDamage(9,15);
            var manaCost=2;
            this.checkMana(manaCost);
            if(this.playerHasMana){
                this.imagenPlayer='image/special.png';
                this.monsterHealth-=damage;
                this.playerMana-=manaCost;
                this.logs.unshift("You dealt: "+damage+" damage to the monster with your special attack");
                
                if(this.checkWin()){
                    return;
                }
                
                this.monsterAttack();
            }
            
        },
        checkMana:function(a){
            if(this.playerMana < a){
                this.playerHasMana = false;
                this.logs.unshift("You don't have enough Mana");
            }else{
                this.playerHasMana = true;
            }
        },
        curar:function(){
            this.logs=['The monster has '+this.monsterIcecream+' souls'];      
            var manaCost=2;          
            var healing=this.calculateDamage(10,25);// random healing hehe
            this.checkMana(manaCost);
            if(this.playerHasMana){
                this.monsterAttack();
                var currentHealth=this.playerHealth;
                if(this.playerHealth > 0){
                    this.imagenPlayer='image/heal.png';
                    this.playerHealth+=healing;
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