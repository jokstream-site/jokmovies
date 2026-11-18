const WYZIE_API="https://sub.wyzie.io/search";
exports.handler=async function(event){
 if(event.httpMethod!=="GET")return{statusCode:405,headers:{Allow:"GET","Cache-Control":"no-store"},body:JSON.stringify({error:"Method not allowed"})};
 const key=process.env.WYZIE_API_KEY;
 if(!key)return{statusCode:503,headers:{"Cache-Control":"no-store"},body:JSON.stringify({error:"WYZIE_API_KEY is not configured in Netlify."})};
 const q=event.queryStringParameters||{},id=q.id||"",language=q.language||"ar,fr,es,en";
 if(!/^(?:\d{1,12}|tt\d{7,10})$/.test(id))return{statusCode:400,headers:{"Cache-Control":"no-store"},body:JSON.stringify({error:"A valid TMDB or IMDb ID is required."})};
 if(!/^[a-z]{2}(?:-[a-z]{2})?(?:,[a-z]{2}(?:-[a-z]{2})?){0,7}$/i.test(language))return{statusCode:400,headers:{"Cache-Control":"no-store"},body:JSON.stringify({error:"Invalid language filter."})};
 const target=new URL(WYZIE_API);target.searchParams.set("id",id);target.searchParams.set("language",language);target.searchParams.set("key",key);
 if(q.season&&q.episode){if(!/^\d{1,3}$/.test(q.season)||!/^\d{1,3}$/.test(q.episode))return{statusCode:400,headers:{"Cache-Control":"no-store"},body:JSON.stringify({error:"Invalid season or episode."})};target.searchParams.set("season",q.season);target.searchParams.set("episode",q.episode)}
 try{const upstream=await fetch(target.toString(),{headers:{Accept:"application/json"}});const body=await upstream.text();return{statusCode:upstream.status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":upstream.ok?"private, max-age=300":"no-store"},body:upstream.ok?JSON.stringify({subtitles:JSON.parse(body)}):JSON.stringify({error:"Subtitle provider returned an error."})}}
 catch(_){return{statusCode:502,headers:{"Cache-Control":"no-store"},body:JSON.stringify({error:"Subtitle provider is temporarily unavailable."})}}
};
