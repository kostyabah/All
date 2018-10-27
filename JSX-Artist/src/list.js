let list = (array=[])=>({
    value: array,
    get length(){
        return this.value.length
    }, 
    forEach(callback){
        this.value.forEach(callback)
    },
    reduce(callback, accum){
        return this.value.reduce(callback, accum)
    },
    map(callback){
        return this.value.map(callback)
    },
    get(index){
        index = index || this.length-1
        return this.value[index]
    },
    set(item, index){
        let copy = this.value.slice()
        if(index == null)
            copy.push(item)
        else
            copy[index] = item
        
        return list(copy)
    },
    remove(index){
        index = index || this.length-1
        let copy = this.value.slice();
        copy.splice(index, 1)
        return list(copy)
    }
})

export default list;