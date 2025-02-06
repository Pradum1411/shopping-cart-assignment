const express=require("express")
const app=express()
const port=3001
let result={product:[],Subtotal : 0,
     Tax : 0,
    Total :0}
app.use(express.static(__dirname))

app.get("/",async(req,res)=>{
    
    res.status(200).send("this is home page")
})

app.get("/products/:product",async(req,res)=>{
    try {
    
    const product=req.params.product
    const response=await fetch("http://localhost:3001/db.json")
    const data= await response.json()
    data.products.forEach(item => {
    if(item.id==product || item.title==product){
        let temp;
       
        result.product.forEach((arr1,i)=>{
            arr2=arr1.split(" ")
            if(arr2[4]==product){
                result.product.splice(i,1,`Cart contains ${parseInt(arr2[2])+1} x ${product}`)
                temp=1
            }
          
        })
        if(temp!=1){
            result.product.push(`Cart contains 1 x ${product}`)
        }
        result.Subtotal+=item.price
        result.Tax=result.Subtotal*.125
        result.Total=Math.round(( result.Subtotal+result.Tax) *100)/100
    }
    });

   res.status(200).send(result)
    
} catch (error) {
    res.status(404).send("data not fount")
}
})

app.get("/checkout",(req,res)=>{
    try {
    
    const result2 = structuredClone(result);
    result.product=[]
    result.Subtotal=0
    result.Tax=0
    result.Total=0
    res.status(200).send(result2)
        
} catch (error) {
    res.status(404).send("something went wrong")
}
})
app.listen(port,()=>{
    console.log("server created")
})