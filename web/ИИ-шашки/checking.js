
var can = {
    inBoard: function(check){
        return check > -1 && check < 64
    },
    move : function(move, value, we, you){
        move += value;
        return this.inBoard(move) 
        && we.indexOf(move) == -1 
        && you.indexOf(move) == -1
    },
    beat : function(move, value, we, you){
        value += move;
       
        var array = [
            this.inBoard(value),
            you.indexOf(value) > -1,
            this.move(move, value, we, you)
        ]    
        var every = function(flag){
           return flag;
        }
        var flag = array.every(every);
        
         
        return flag ? you.indexOf(value) : -1;  
    }
}
var possible = {
    beat : function(result, value){
        var us = this.active.slice(), opponent = this.passive.slice();
        var moves = [7, -9, 9,-7] 
        if(value % 8 < 2) moves.splice(0, 2);
        if(value % 8 > 5) moves.splice(2, 2);
        
        function collect(move, us, opponent){}

        return moves
        .reduce(function(res, move){
            var beat = can.beat(move, value, us, opponent)
             
            if(beat > -1){
                 
                res.push([value, opponent[beat], value+2*move]);
                opponent.splice(beat, 1)
            }
        
            return res;
        }, result)
            
        
    },
    move : function(result, value, index, array){
        var moves = [7, 9]
            opponent = this.passive.slice();
        if(value % 8 == 0) moves.shift();
        if(value % 8 == 7) moves.pop();
        
        return moves
        .reduce(function(res, move){
            if(can.move(move, value, array, opponent)){
                res.push([value, value + move]);
            }
            return res;
        }, result)
    },
}

var Game = function(position, max){
    if(!position){
        this.start();
    }else{
        this.active = position.active.slice();
        this.passive = position.passive.slice();
    }
    if(max){
        this.position = new Position(this, max);
    }
}


var Position = function(position, max){
    this.active = position.active;
    this.passive = position.passive;
    this.max = max;
}
Position.prototype = {
    get data(){
        var result = [];
        for(var n=0; n < 32; n++){
            var field = n % 8 > 3
                ? 2 * n + 1 : 2 * n;
            if(this.active.indexOf(field) > -1){
                result.push(1);
            }else if(this.passive.indexOf(field) > -1){
                result.push(-1);
            }else{
                result.push(0);
            }    
        }
        return result;
    },
    get ways(){
        var result = this.active.reduce(possible.beat.bind(this), [])
        result = result.length
            ? result
            : this.active.reduce(possible.move.bind(this), []);
        var getPosition = function(beat){
            var pre = beat.shift(),
                post = beat.pop(),
                number = this.active.indexOf(pre);
                active = this.active.slice();
                opponent = this.passive.slice();    
            active[number] = post;
            //console.log(pre, post);
            
            beat.forEach(function(bitta){
                var ind = opponent.indexOf(bitta);
                opponent.splice(ind, 1);
            })
            return new Position({
                active : active,
                passive : opponent
            })
        }
        return this.moves.map(getPosition.bind(this))
            
    },
    get policy(){
        var func = function(result, value, index){
            return result + value * this.data[index];
        }
        if(this.net)
            return this.net.reduce(func.bind(this), 0)
        else {
            var game = new Game(this)
            game.reverse();
            //console.log(game)
            return game.play(10);
        }    
    },
    get move(){
        var choose = function(value, index){
            return {
                policy :value.policy,
                index : index
            }
        }
            
        return this.ways
        .map(choose)
        .reduce(function(res, value){
            return res.policy < value.policy
                ?  value : res;
        })
        
    }
}

Game.prototype = {
    reverse : function(){
        var reverse = function(value){
            return 63 - value;
        }
        var active = this.active.slice();
        //console.log(active)
        this.active = this.passive.map(reverse);
        this.passive = active.map(reverse);
        //console.log(this.passive)
    },
    story : [],
    count : 0,
    start : function(){
        this.active = [];
        this.passive = [];
        for(var n = 0; n < 12; n++){
            var check = 2 * n;
            if( n % 8 > 3) check ++;
            this.active.push(check);
            this.passive.push(63-check);
        }
    },
    
    
    get moves(){
        var result = this.active.reduce(possible.beat.bind(this), [])
        //if(result.length) console.log(result);
        return result.length
            ? result
            : this.active.reduce(possible.move.bind(this), []);
    },

    step : function(){
        if(this.position){
            this.position.active = this.active.slice();
            this.position.passive = this.passive.slice();
            this.position.moves = this.moves;
        }
        var moves = this.moves,
            best = this.position && this.position.move  
            index = this.position
                ? best && best.index
                : Math.floor(Math.random()*moves.length)
        if(moves.length == 0 ){
            
            return false;
        }
        if(best && (best.policy == 0)){
            
            if(this.count % 2){
                this.reverse();
                console.log('-----ЧЕРНЫЕ--------СДАЛИСЬ')
            }else{
                console.log('БЕЛЫЕ--------СДАЛИСЬ-------')
            }
            
            return false;
        }
        var beat = moves[index];    
        if(best){
            if(this.count % 2)
                console.log('-----',best.policy)
            else
                console.log(best.policy, '------')
        }
            
        
        
        this.story.push(index);
        //if(beat.length > 2) console.log(beat);
        var pre = beat.shift(),
            post = beat.pop(),
            number = this.active.indexOf(pre);
            
        this.active[number] = post;
        
        var opponent = this.passive;
        beat.forEach(function(bitta){
            
            var ind = opponent.indexOf(bitta);
            opponent.splice(ind, 1);
        })
        return true;
    },
    
    next : function(move){
        if( this.count % 2)
            this.reverse();
        //console.log(this.count)
        if(this.step(move) == false)
            return false;
        if( this.count % 2)    
            this.reverse();
            
        this.count ++ ;
        return true;
    }, 
    play : function(max){
        var tower = 0,
            active = this.active.slice()
            passive = this.passive.slice();
        //console.log(this)    
        //console.log(this.active);
        for(var n=0; n < max; n++){
            
            while(this.next()){}
            if(this.count % 2 == 0) tower++;
            this.active = active.slice();
            this.passive = passive.slice()
            this.count = 0;
            //console.log(tower)  
        }

        return tower;
    }

}
/*
var Story = function(){
    Game.apply(this, arguments);
    this.game = [];
    this.count = -1;
}
Story.prototype = {
    next : function(){    
        this.count ++;
        var beat = this.move,
            pre = beat.shift(),
            post = beat.pop(),
            number = this.active.indexOf(pre);
            
        this.active[number] = post;
        
        var opponent = this.passive;
        beat.forEach(function(bitta){
            var ind = opponent.indexOf(bitta);
            opponent.splice(ind, 1);
        })
        
    },
    get move(){
        return this.game[this.count]; 
    }, 
    last : function(){
            
        var beat = this.move,
            pre = beat.shift(),
            post = beat.pop(),
            number = this.active.indexOf(post);
            
        this.active[number] = pre;
        
        var opponent = this.passive;
        beat.forEach(function(bitta){
            //var ind = opponent.indexOf(bitta);
            opponent.push(bitta);
        })
        this.count --;
    }
}
*/


