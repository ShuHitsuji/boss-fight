new Vue({
    el:"#app",
    data:{
        playerHealth:100,
        playerMana:10,
        monsterHealth:100,
        monsterIcecream:0,
        playerHasMana:true,
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
                damage=100;//RNG HE CAN ONE SHOT U
                this.logs.unshift("The monster ate u, hmmmm delicius, finally he ate some good food");
            }
            var healing=0;
            var currentHealth=this.monsterHealth;
            this.playerHealth-=damage;
            if(damage==7){
                this.monsterIcecream++;
                this.logs.unshift("The monster found a new icecream!! Yummi")
            }
            if(damage>9){
                this.monsterHealth+=damage;          
                if((currentHealth+damage)>100){
                    healing=damage-(this.monsterHealth-100);
                    this.monsterHealth=100;
                    if(healing>0)
                        this.logs.unshift("The monster lifesteal: +"+healing+" HP");
                }else{
                    this.logs.unshift("The monster lifesteal: +"+damage+" HP");
                }
            }else{
                this.logs.unshift("The monster deal: "+damage+" damage to you");
            }
            setTimeout(()=>{
                this.checkWin()
             },1000);   
            
        },
        checkMonsterFood(){
            var healing =this.calculateDamage(10,20);
            if(this.monsterIcecream>0 && this.monsterHealth<50){
                this.monsterHealth+=healing;
                this.monsterIcecream--;
                this.logs.unshift("The monster lick his ice-cream and heal itself +"+ healing + "HP")
            }
        },
        checkWin:function(){
            if(this.monsterHealth<=0){
                if(confirm('U WIN THIS TIME, play again?')){
                    this.empezarJuego();
                }else{
                    this.gameIsRunning=false;
                }
                return true;
            }else if(this.playerHealth<=0){
                if(confirm('U DIED! play again?')){
                    this.empezarJuego();
                }else{
                    this.gameIsRunning=false;
                }
                return true;
            }
            return false;
        },
        empezarJuego: function(){
            this.playerHealth=100;
            this.playerMana=10;
            this.monsterHealth=100;
            this.monsterIcecream=0,
            this.playerHasMana=true;
            this.gameIsRunning=true;
            this.logs=['Instructions:','Green-bar is your health points','Lightblue-bar is your mana points','Attack regen +2MP & deal 3-7 damage','Special Attack consume 2MP & deal 9-15 damage','Potions heals 10-25HP','The monster can also heal itself'];

        },
        ataque:function(){
            this.logs=[];
            var damage=this.calculateDamage(3,7);
            this.monsterHealth-=damage;
            var manaRegen=2;
            this.playerMana+=manaRegen;
            if(damage == 5){
                this.playerHealth+=damage;
                this.logs.unshift("You heal yourself: "+damage+"HP");
                if(this.playerHealth > 100)
                    this.playerHealth = 100;
            }
            this.logs.unshift("You deal: "+damage+" to the monster");
            if(this.checkWin()){
                return;
            }
            this.checkMana();
            this.monsterAttack();
        },
        ataqueEspecial:function(){
            this.logs=[];
            var damage=this.calculateDamage(9,15);
            var manaCost=2;
            this.checkMana(manaCost);
            if(this.playerHasMana){
                this.monsterHealth-=damage;
                this.playerMana-=manaCost;
                this.logs.unshift("You deal: "+damage+" to the monster with your special attack");
                
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
            if(this.playerMana>10){
                this.playerMana = 10;
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
        },
        rendirse:function(){
            this.logs=[]; 
            this.gameIsRunning=false;
            this.logs.unshift("Feels bad man, too strong for u?");
        }
    }
});