export default function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({ok:false,error:"Method not allowed"});
  return res.status(200).json({ok:true,service:"maksabi",agent:"v6",time:new Date().toISOString(),aiConfigured:Boolean(process.env.OPENAI_API_KEY)});
}
