export function createArtist(){
    var artist = {
        style(ctx, props){
            if(!props) return
            var {fill, stroke, lineWidth} = props
            var result = {
                fillStyle: fill, 
                strokeStyle: stroke, 
                lineWidth
            }
            Object.keys(result).forEach(key=>{
                if(key in result)
                    ctx[key] = result[key]; 
            })
            //console.log(ctx)    
        },
        drawShape(ctx, shape){
            ctx.beginPath();
            this.draw[shape.nodeName](ctx, shape.attributes)
            ctx.save();
            this.style(ctx, shape.attributes);
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        },
        contain(ctx, shape, point){
            if(!shape) return
            ctx.beginPath();
            this.draw[shape.nodeName](ctx, shape.attributes)
            return ctx.isPointInPath(point.x, point.y);
        },
        draw : {
            group(ctx, props){
                
                this.clear(ctx, props)
                props.children.forEach(item =>{
                    this[item.nodeName](ctx, item.attributes)
                })
            },
            ellipse(ctx, props){
                //console.log(props)
                ctx.ellipse(
                    props.cx, props.cy,
                    props.r||props.rx, props.r||props.ry,
                    props.rotate*Math.PI/180 || 2*Math.PI,
                    0, 2*Math.PI   
                )
            },
            polyline(ctx, props){
                props.points.forEach((point, index)=>{
                    if(index)
                        ctx.lineTo(point.x, point.y)
                    else
                        ctx.moveTo(point.x, point.y)
                })
            },
            path(ctx, props){
                
                props.lines.reduce((prev, line) =>{
                    if(!line) return;
                    let x = line.x, y = line.y,
                        ax = line.ax || x, ay = line.ay || y,
                        bx = line.bx || 2*x - ax, 
                        by = line.by || 2*y - ay
                    if(!prev){
                        ctx.moveTo(x, y)
                        if(props.lines.length < 2)
                            ctx.lineTo(ax, ay)
                    }    
                    else{
                        ctx.bezierCurveTo(
                            prev.ax, prev.ay,
                            bx, by, x, y
                        )
                    }
                    return {ax, ay, bx, by, x, y}    
                }, null)
            }
        },
        
    }
    return artist
}