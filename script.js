/* CODET · interacciones */
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;

// Revelado al hacer scroll con escalonado
document.querySelectorAll('[data-d]').forEach(e=>e.style.transitionDelay=e.dataset.d+'ms');
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));

// Barra de progreso, parallax y orbes
const pg=document.getElementById('pg'),dk=document.querySelector('.dk');
function onScroll(){const h=document.documentElement.scrollHeight-innerHeight;pg.style.width=(scrollY/h*100)+'%';}
addEventListener('scroll',onScroll,{passive:true});onScroll();

// Inclinación 3D de tarjetas
if(!rm)document.querySelectorAll('.bx').forEach(b=>{
 b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;b.style.setProperty('--ry',(x*8)+'deg');b.style.setProperty('--rx',(-y*8)+'deg')});
 b.addEventListener('pointerleave',()=>{b.style.setProperty('--ry','0deg');b.style.setProperty('--rx','0deg')})});

// Envío automático del catálogo desde codetinov@gmail.com (EmailJS: https://www.emailjs.com)
// 1) Conecta la cuenta Gmail codetinov@gmail.com como "Service"  2) crea un "Template" con {{to_email}} y {{catalog_url}}
// 3) sube el PDF a un enlace público y pega aquí los datos. Mientras estén vacíos se usa el correo de respaldo.
const MAIL={service:'service_oal0f6d',template:'template_33od2gj',key:'zZfnLGTg7QdQ9V1Ao',catalog_url:'https://drive.google.com/file/d/1jfV0RxMuOnKnvbRDf86oCpDqYMW1lXw_/view?usp=sharing',from:'codetinov@gmail.com'};
async function sendCatalog(to){if(!MAIL.service||!MAIL.template||!MAIL.key)return false;
 const r=await fetch('https://api.emailjs.com/api/v1.0/email/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service_id:MAIL.service,template_id:MAIL.template,user_id:MAIL.key,template_params:{to_email:to,from_email:MAIL.from,reply_to:MAIL.from,catalog_url:MAIL.catalog_url}})});return r.ok}

// Formulario de catálogo
const f=document.getElementById('f'),m=document.getElementById('m'),em=document.getElementById('em');
f.addEventListener('submit',async ev=>{ev.preventDefault();const v=em.value.trim();m.className='msg';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){m.classList.add('er');m.textContent='Escribe un correo válido, por ejemplo nombre@correo.com';em.focus();return}
 let ok=false;try{ok=await sendCatalog(v)}catch(e){}
 try{if(ok)throw 0;const db=await window.claude?.use('db');if(db){await db.collection('leads').add({email:v,at:new Date().toISOString()});ok=true}}catch(e){}
 if(ok){m.textContent='¡Listo! Recibimos tu correo y te enviaremos el catálogo.';f.reset()}
 else{m.innerHTML='Casi listo: <a href="mailto:codetinov@gmail.com?subject='+encodeURIComponent('Solicitud de catálogo CODET')+'&body='+encodeURIComponent('Hola, quiero recibir el catálogo en: '+v)+'" style="text-decoration:underline">toca aquí para enviar tu solicitud</a>.'}});

// Animación de presentación (escenas en bucle)
const D=[4.1,4.95,4.95,4.95,4.95,5.3,5.2],S=[...document.querySelectorAll('.show .sc')],T=D.reduce((a,b)=>a+b),bar=document.getElementById('bar');
let t0=performance.now()+1000,cur=-1;
function go(i){S.forEach(s=>s.classList.remove('on'));void document.body.offsetWidth;S[i].classList.add('on');cur=i;document.getAnimations().forEach(a=>{a.playbackRate=i<6?.85:1})}
function tick(n){const e=Math.max(0,((n-t0)/1000))%T;let a=0,i=0;while(i<D.length-1&&e>=a+D[i]){a+=D[i];i++}
 if(i!==cur)go(i);bar.style.width=(e/T*100)+'%';requestAnimationFrame(tick)}
requestAnimationFrame(tick);
