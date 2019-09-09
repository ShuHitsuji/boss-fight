new Vue({
    el:"#app",
    data:{
        playerHealth:100,
        monsterHealth:100,
        gameIsRunning:false,
        logs:[]

    },
    methods:{
        calculateDamage:function(min,max){
            return Math.max(Math.floor(Math.random()*max)+1,min);
        },
        monsterAttack:function(){
            var damage=this.calculateDamage(5,12);
            var healing=0;
            var currentHealth=this.monsterHealth;
            this.playerHealth-=damage;
            if(damage>8){
                this.monsterHealth+=damage;          
                if((currentHealth+damage)>100){
                    healing=damage-(this.monsterHealth-100);
                    this.monsterHealth=100;
                    if(healing>0)
                        this.logs.unshift("The monster lifesteal: +"+healing+"HP");
                }else{
                    this.logs.unshift("The monster lifesteal: +"+damage+"HP");
                }
            }
            this.checkWin();
            this.logs.unshift("The monster deal: "+damage+" damage to you");
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
            this.monsterHealth=100;
            this.gameIsRunning=true;
            this.logs=[];
        },
        ataque:function(){
            var damage=this.calculateDamage(3,7);
            this.monsterHealth-=damage;
            this.logs.unshift("You deal: "+damage+" to the monster");
            if(this.checkWin()){
                return;
            }
            this.monsterAttack();
        },
        ataqueEspecial:function(){
            var damage=this.calculateDamage(0,13);
            this.monsterHealth-=damage;
            this.logs.unshift("You deal: "+damage+" to the monster with your special attack");
            if(this.checkWin()){
                return;
            }
            this.monsterAttack();
        },
        curar:function(){      
            this.monsterAttack();
                if(this.checkWin()){
                    return;
                }
            var currentHealth=this.playerHealth;   
            var healing=this.calculateDamage(5,20);// random healing hehe

            this.playerHealth+=healing;
            if((currentHealth+healing)>100){
                healingB=healing-(this.playerHealth-100);
                this.playerHealth=100;
                if(healingB>0)
                this.logs.unshift("You healed for: "+healingB+" HP");
            }else{
                this.logs.unshift("You healed for: "+healing+" HP");
            }      
        },
        rendirse:function(){
            this.gameIsRunning=false;
          
        }
    }
});