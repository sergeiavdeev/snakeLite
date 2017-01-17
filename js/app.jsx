class App extends React.Component{
    
    constructor(props){
        super(props);
        
        var field = [];
        
        for(var i = 0; i < this.props.height; i++){
            
            field[i] = [];
            
            for(var j = 0; j < this.props.width; j++){
                
                field[i][j] = 0;
            }
        }
        
        this.snake = [{x: 10, y: 10}, {x: 11, y: 10}, {x: 12, y: 10}];
        this.dx = -1;
        this.dy = 0;
                
        for(var i = 0; i < this.snake.length; i++){
                
            var x = this.snake[i].x;
            var y = this.snake[i].y;
            if(i == 0){
                field[y][x] = -1;
            }
            else{
                field[y][x] = 1;
            }
        }
       
        this.addEat(field);
        this.addEat(field);
        this.addEat(field);
        this.addEat(field);        
        
        this.state = {
            field: field,
            isEnd: false
        }
                        
        this.timerID = setInterval(() => this.snakeMove(), 250);
    }
    
    render(){
        
        return(
                <Field field={this.state.field} 
                    width = {this.props.width} 
                    height = {this.props.height} 
                    directLeft = {(e) => this.directLeft(e)} 
                    directRight = {(e) => this.directRight(e)} />
        );
    }  
    
    
    snakeMove(){
                        
        var x = this.snake[0].x + this.dx;        
        var y = this.snake[0].y + this.dy;
        
        const field = this.state.field.slice();
        var eat = false;
        var isEnd = this.state.isEnd;
        
        //Проверка на выходы за пределы
        if(x >= this.props.width){
            x = 0;
        }
        
        if(y >= this.props.height){
            y = 0;
        }
        
        if(x < 0){
            x = this.props.width - 1;
        }
        
        if(y < 0){
            y = this.props.height - 1;
        }
        
        this.snake.unshift({x: x, y: y});//Добавили новое положение головы
        
        
        if(field[y][x] == 2){//Сожрали
            eat = true;
            this.addEat(field);
        }
                
        if(field[y][x] == 1){//Сожрали сами себя
            isEnd = true;
            clearInterval(this.timerID);
        }
        
        field[y][x] = -1;
        
        var oldHead = this.snake[1];
        field[oldHead.y][oldHead.x] = 1;
        
        if(!eat){//Если не сожрали, удаляем хвост
            var tail = this.snake.pop();
            field[tail.y][tail.x] = 0;            
        }
        
        this.setState({field: field, isEnd: isEnd});
    }
    
    
    directLeft(e){
        
        if(this.dy == 0){
            
            this.dy = -this.dx;
            this.dx = 0;
        }else{
            
            this.dx = this.dy;
            this.dy = 0;
        }        
    }
    
    
    directRight(e){
        
        if(this.dy == 0){
            
            this.dy = this.dx;
            this.dx = 0;
        }else{
            
            this.dx = -this.dy;
            this.dy = 0;
        }        
    }
    
    
    addEat(field){
                        
        while(true){
            
            var x = Math.floor(Math.random() * this.props.width);
            var y = Math.floor(Math.random() * this.props.height);
            
            if(field[y][x] == 0){
                field[y][x] = 2;
                break;
            }
        }
    }
};



class Field extends React.Component{
    
    constructor(props){
        
        super(props);        
    }
    
    
    render(){
        
        return(
            <table>                                
                <tbody>
                {                                
                    this.props.field.map(function(el, index){                           
                                                
                        return <tr key={index}>{this.renderCol(el, index)}</tr>;
                        }.bind(this))
                }               
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={this.props.width} className="centerCell">
                            <button className="btn btn-default" onClick={(e) => this.props.directLeft(e)} autoFocus={true}>Влево</button>
                            <button className="btn btn-default" onClick={(e) => this.props.directRight(e)}>Вправо</button>
                        </td>
                    </tr>                            
                </tfoot>
            </table>
         );
    }
    
    
    renderCol(el, y){
        
        return(         
                el.map(function(el, index){
                    
                    var className = "";
                    if(el == 1){
                        className = "snake";
                    }
                    if(el == 2){
                        className = "eat";
                    }
                    if(el == -1){
                        className = "head";
                    }
                    
                    return <td key={index} className={className}></td>;
                 })
        );       
    }
};



ReactDOM.render(
        <App height={20} width={20} />,
        document.getElementById("app")
    );