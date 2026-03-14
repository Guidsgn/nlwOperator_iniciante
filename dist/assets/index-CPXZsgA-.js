(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();const s={transcriptionURL:"",public_id:"",waitForTranscription:async()=>{for(let o=1;o<=30;o++){const r=`https://res.cloudinary.com/${m.cloudName}/raw/upload/v${Date.now()}/${s.public_id}.transcript`;try{if(console.log(`Tentativa ${o}/30: Verificando transcrição...`),(await fetch(r)).ok)return s.transcriptionURL=r,console.log("Transcrição encontrada!",r),!0}catch(e){console.log(`Tentativa ${o} falhou:`,e.message)}o<30&&await new Promise(e=>setTimeout(e,2e3))}return console.log("Transcrição não encontrada após todas as tentativas."),!1},getTranscription:async()=>(await fetch(s.transcriptionURL)).text(),getViralMoment:async()=>{const a=await s.getTranscription(),o="https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",r=`
            Role: You are an expert viral content editor specialized in identifying high-retention moments for short-form platforms like TikTok, Reels, and YouTube Shorts.

            Task: Analyze the transcription below and detect the single most viral-worthy segment. Focus on moments that contain strong hooks, unexpected reactions, humor, controversy, emotional impact, surprising information, or storytelling peaks that would make viewers stop scrolling.

            Selection Criteria:
            - Prioritize segments with a clear beginning hook and satisfying payoff.
            - Prefer moments with strong emotion, humor, shock, or curiosity.
            - Avoid slow introductions, filler speech, or context-heavy parts that require long setup.
            - The clip should make sense even when isolated from the full video.

            Constraints:
            1. Duration: Minimum 30 seconds, Maximum 60 seconds.
            2. Select ONLY one segment.
            3. Format: Return ONLY the start and end string for Cloudinary.
            4. Format pattern: so_<start_seconds>,eo_<end_seconds>
            5. Example outputs: "so_12,eo_45"  OR  "so_8.5,eo_52.3"
            6. CRITICAL: Do not explain your reasoning.
            7. CRITICAL: Do not use quotes, markdown, or extra text.
            8. Return ONLY the raw string.

            Transcription:
            ${a}
        `,e={"x-goog-api-key":"AIzaSyDahryRW7uhgEN2UD58LLX92vwN8KoyhXM","Content-Type":"application/json"},t=[{parts:[{text:r}]}],c=3;let l=0;for(;l<c;)try{const i=await fetch(o,{method:"POST",headers:e,body:JSON.stringify({contents:t})});if(!i.ok)throw new Error(`HTTP ${i.status}: ${i.statusText}`);const d=await i.json();return console.log({data:d}),d.candidates[0].content.parts[0].text}catch(i){if(l++,l>=c)throw i;console.log(`Tentativa ${l} falhou: ${i.message}. Tentando novamente em ${l} segundos...`),await new Promise(d=>setTimeout(d,1e3*l))}}},m={cloudName:"dydnihvz4",uploadPreset:"upload_nlw"},p=cloudinary.createUploadWidget(m,async(a,n)=>{if(!a&&n&&n.event==="success"){console.log("Pronto! Aqui estão as informações da imagem: ",n.info),s.public_id=n.info.public_id,s.version=n.info.version;try{if(!await s.waitForTranscription())throw new Error("Erro ao buscar transcrição!");const r=await s.getViralMoment()}catch(o){console.log({error:o})}}});document.getElementById("upload_widget").addEventListener("click",function(){p.open()},!1);
