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
            this.playerHealth-=damage;
            this.checkWin();
            this.logs.unshift("el monstruo hizo: "+damage+" de damage al player");
        },
        checkWin:function(){
            if(this.monsterHealth<=0){
                if(confirm('GANASTE!!!! JUGAR DE NUEVO?')){
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
            var damage=this.calculateDamage(3,10);
            this.monsterHealth-=damage;
            this.logs.unshift("el player hizo: "+damage+" de damage al monstruo");
            if(this.checkWin()){
                return;
            }
            this.monsterAttack();
        },
        ataqueEspecial:function(){
            var damage=this.calculateDamage(10,20);
            this.monsterHealth-=damage;
            this.logs.unshift("el player hizo: "+damage+" de damage al monstruo");
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
            var healing=this.calculateDamage(5,15);// es mas divertido con un healing random y que el monstruo te pueda matar antes de que te cures
            this.playerHealth+=healing;
            this.logs.unshift("el player se curo: "+healing+" puntos de vida");
            if(this.playerHealth>100){
                this.playerHealth=100;
            }
                
        },
        rendirse:function(){
            this.gameIsRunning=false;
          
        }
    }
});