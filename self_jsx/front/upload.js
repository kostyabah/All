
export default function save_images(app){
    
    
    var start = Promise.resolve({
        get color(){
            return this.list.shift();   
        },
        //src : app.src,
        list : app.list 
    })
    for(var n = 0; n < app.list.length; n++){
        start = start.then(getForm).then(utalet)
    }
}

function getForm(data){
    
    var color = data.color;
    var holst = document.createElement("canvas"),
        ctx = holst.getContext("2d");
    holst.width = img.width;
    holst.height = img.height;
    ctx.rect(0, 0, holst.width, holst.height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.drawImage(img, 0, 0, holst.width, holst.height);
    dataUrl = holst.toDataURL('image/png');
    //document.body.appendChild(holst);
    console.log(color);
    console.log(dataUrl);
    var form = new FormData();  
    form.append("image", dataUrl);
    form.append("name", color);
    
    
    data.form = {
        method : 'post',
        body : form
    }
    return data
}
function utalet(body){
    
    //console.log(form);
    console.log("utalet")
    return fetch('/upload', body.form).then(function(res){
        return res.text();
    })
    .then(function(){
        console.log("hi")
        return body;
    }); 
}


