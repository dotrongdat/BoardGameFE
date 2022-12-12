
const CreateForm = (data)=>{
    const form = new FormData();
    for(let property in data){
        if(data[property]){
            if(Array.isArray(data[property])){
                data[property].map(v=>form.append(property, v));
            }else form.append(property,data[property]);
        }        
    }
    return form;
}
export{
    CreateForm
} 