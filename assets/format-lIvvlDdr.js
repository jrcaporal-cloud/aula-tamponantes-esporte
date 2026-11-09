const n=(r,e=1)=>r.toFixed(e).replace(".",","),o=(r,e=0)=>{const t=Number(r.toFixed(e));return t===0?n(0,e):`${t>0?"+":"−"}${n(Math.abs(t),e)}`};export{n as b,o as s};
