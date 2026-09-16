export default function handler(req,res){
 if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
 return res.status(200).json({app:"Maksabi",agentVersion:6,capabilities:["context-aware","multi-action","natural-confirmation","derived-daily-summary","relative-dates","general-assistant"]});
}
