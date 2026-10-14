(()=>{'use strict';
const audio=document.getElementById('song-audio');
const button=document.getElementById('music-toggle');
const controls=document.getElementById('music-controls');
const record=document.querySelector('.record');
const seek=document.getElementById('music-seek');
const counter=document.getElementById('music-time');
const status=document.getElementById('music-status');
if(!audio||!button||!record||!seek||!counter||!status)return;
const recipient=JSON.parse(document.getElementById('note-data').textContent).recipient;
const audioUrl=recipient.audioUrl;
const format=(v)=>{if(!Number.isFinite(v))return '0:00';v=Math.floor(v);return Math.floor(v/60)+':'+String(v%60).padStart(2,'0')};
function update(){
 const playing=!audio.paused&&!audio.ended;
 record.classList.toggle('is-playing',playing);
 button.textContent=playing?'Ⅱ Jeda':'▶ Putar lagu';
 button.setAttribute('aria-label',playing?'Jeda lagu':'Putar lagu');
 const duration=Number.isFinite(audio.duration)?audio.duration:0;
 seek.max=String(duration||1);
 if(!seek.matches(':active'))seek.value=String(Math.min(audio.currentTime||0,duration||1));
 counter.textContent=format(audio.currentTime)+' / '+format(duration);
}
if(!audioUrl){status.textContent='Audio belum dikonfigurasi. Gunakan tautan lagu resmi di bawah.';return;}
audio.src=audioUrl;
status.textContent='Memeriksa ketersediaan audio…';
audio.addEventListener('loadedmetadata',()=>{controls.hidden=false;status.hidden=true;update()});
audio.addEventListener('canplay',()=>{controls.hidden=false;status.hidden=true;button.disabled=false});
audio.addEventListener('error',()=>{audio.pause();record.classList.remove('is-playing');controls.hidden=true;status.hidden=false;status.textContent='File MP3 belum tersedia. Gunakan tautan lagu resmi sementara.'});
for(const ev of ['play','pause','ended','timeupdate','durationchange','seeking'])audio.addEventListener(ev,update);
button.addEventListener('click',async()=>{
 if(!audio.paused){audio.pause();return}
 button.disabled=true;
 try{await audio.play();status.hidden=true}
 catch(err){status.hidden=false;status.textContent='Audio tidak dapat diputar. Periksa file MP3 atau coba tautan resmi.'}
 finally{button.disabled=false;update()}
});
seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0){audio.currentTime=Number(seek.value);update()}});
const close=document.getElementById('close');if(close)close.addEventListener('click',()=>audio.pause());
update();
})();
