import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

const CYAN='#68D9FF', WHITE='#F3F8FD', MUTED='#91A2B7', DARK='#05090E';
const ease={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const lerp=(v:number,a:number,b:number,x:number,y:number)=>interpolate(v,[a,b],[x,y],ease);
const pop=(frame:number,from=0)=>spring({fps:30,frame:Math.max(0,frame-from),config:{damping:16,stiffness:130,mass:.85}});
const fnt='Inter, Arial, Helvetica, sans-serif';

const Backdrop:React.FC=()=>{
 const f=useCurrentFrame();
 return <AbsoluteFill style={{background:'radial-gradient(ellipse at 72% 30%,#101D29 0%,#060B12 45%,#020408 100%)',overflow:'hidden'}}>
   <AbsoluteFill style={{opacity:.10,backgroundImage:'linear-gradient(#567A9A 1px,transparent 1px),linear-gradient(90deg,#567A9A 1px,transparent 1px)',backgroundSize:'85px 85px',transform:`translateY(${f*.25%85}px)`}}/>
   <div style={{position:'absolute',top:720,right:-320,width:700,height:700,borderRadius:'50%',background:CYAN,opacity:.045,filter:'blur(150px)'}}/>
 </AbsoluteFill>;
};
const Words:React.FC<{text:string,start?:number,size?:number,cyan?:boolean,center?:boolean}>=({text,start=0,size=76,cyan=false,center=false})=>{
 const f=useCurrentFrame();
 return <div style={{display:'flex',flexWrap:'wrap',justifyContent:center?'center':'flex-start',gap:'0 15px',fontFamily:fnt,color:cyan?CYAN:WHITE,fontWeight:900,fontSize:size,lineHeight:1.07,letterSpacing:-2}}>
  {text.split(' ').map((w,i)=>{const p=pop(f,start+i*4);return <span key={i} style={{display:'inline-block',opacity:p,transform:`translateY(${(1-p)*45}px) scale(${.91+.09*p})`}}>{w}</span>})}
 </div>;
};
const Badge:React.FC<{value:string}>=({value})=><div style={{border:`2px solid ${CYAN}99`,color:CYAN,borderRadius:99,padding:'14px 23px',font:`800 25px ${fnt}`,letterSpacing:2,display:'inline-flex',background:'#0C1F2A'}}>{value}</div>;
const Brand:React.FC=()=> <div style={{position:'absolute',top:85,left:80,right:80,display:'flex',alignItems:'center',justifyContent:'space-between',font:`800 25px ${fnt}`,letterSpacing:2,color:MUTED}}>
 <span>APPLE STORE FSA</span><span>CONSEJOS IPHONE / 01</span></div>;
const Hint:React.FC<{text:string,start?:number}>=({text,start=18})=>{const f=useCurrentFrame();return <div style={{color:MUTED,font:`550 37px/1.32 ${fnt}`,opacity:lerp(f,start,start+12,0,1),marginTop:28,maxWidth:880}}>{text}</div>};
const Underline:React.FC<{start?:number}>=({start=16})=>{const f=useCurrentFrame();return <div style={{height:4,width:lerp(f,start,start+24,0,860),background:CYAN,boxShadow:`0 0 30px ${CYAN}55`,marginTop:40}}/>};
const Card:React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>>=({children,style})=><div style={{border:'2px solid #3B6174',background:'linear-gradient(145deg,#111D29,#07111A)',borderRadius:38,padding:45,boxShadow:'0 25px 80px #0009,0 0 36px #68D9FF15',...style}}>{children}</div>;
const SectionTitle:React.FC<{number:string,kicker:string,line1:string,line2:string,desc:string}>=({number,kicker,line1,line2,desc})=>{
 const f=useCurrentFrame();const p=pop(f,4);
 return <div style={{position:'absolute',top:265,left:80,right:80}}>
 <div style={{display:'flex',gap:20,alignItems:'center',opacity:p,transform:`translateX(${(1-p)*-80}px)`}}>
  <div style={{width:88,height:88,background:CYAN,color:DARK,borderRadius:20,display:'grid',placeItems:'center',font:`900 50px ${fnt}`}}>{number}</div>
  <div style={{color:CYAN,font:`800 29px ${fnt}`,letterSpacing:3}}>{kicker}</div>
 </div>
 <div style={{marginTop:48}}><Words text={line1} start={9} size={87}/><Words text={line2} start={17} size={87} cyan/></div>
 <Hint text={desc} start={21}/>
 </div>;
};
const PhoneShell:React.FC<React.PropsWithChildren>=({children})=><div style={{width:510,height:820,border:'9px solid #687A89',padding:13,borderRadius:78,background:'#020508',boxShadow:'0 28px 90px #000C,0 0 75px #68D9FF20'}}>
 <div style={{width:'100%',height:'100%',background:'linear-gradient(145deg,#192735,#0B1420)',borderRadius:57,overflow:'hidden',position:'relative',color:WHITE}}>
 <div style={{position:'absolute',top:13,left:178,width:135,height:29,borderRadius:99,background:'#020509'}}/>
 <div style={{position:'absolute',inset:'77px 33px 35px'}}>{children}</div>
 <div style={{position:'absolute',bottom:13,left:197,width:90,height:6,borderRadius:9,background:'#CDD9E799'}}/>
 </div></div>;
const Row:React.FC<{text:string,highlight?:boolean}>=({text,highlight=false})=><div style={{padding:'24px 19px',borderBottom:'1px solid #34475A',background:highlight?'#19394D':'transparent',font:`600 26px ${fnt}`,borderRadius:12,color:highlight?CYAN:WHITE}}>{text}</div>;
const Intro:React.FC=()=>{const f=useCurrentFrame();return <AbsoluteFill><Backdrop/><Brand/>
 <div style={{position:'absolute',top:340,left:80,right:65}}>
 <Badge value="GUÍA RÁPIDA · 25 SEGUNDOS"/>
 <div style={{marginTop:62}}><Words text="¿VAS A COMPRAR" start={5} size={82}/><Words text="UN IPHONE USADO?" start={15} size={84} cyan/></div>
 <Underline start={24}/>
 <div style={{marginTop:70}}><Words text="REVISÁ ESTAS" start={27} size={82}/><Words text="3 COSAS" start={38} size={118} cyan/></div>
 </div>
 <div style={{position:'absolute',top:1230,left:350,opacity:pop(f,21),transform:`rotate(-10deg) scale(${.85+.15*pop(f,20)})`}}>
 <Card style={{width:390,height:185,display:'grid',placeItems:'center'}}><div style={{font:`900 78px ${fnt}`,color:CYAN}}>01 · 02 · 03</div></Card>
 </div></AbsoluteFill>};
const Activation:React.FC=()=>{const f=useCurrentFrame(),p=pop(f,8),step=f>78?2:f>42?1:0;return <AbsoluteFill><Backdrop/><Brand/>
 <SectionTitle number="01" kicker="PRIMER CONTROL" line1="BLOQUEO DE" line2="ACTIVACIÓN" desc="Pedí que lo borren. No debe pedir la cuenta del dueño anterior."/>
 <div style={{position:'absolute',top:840,left:295,opacity:p,transform:`translateY(${(1-p)*90}px) scale(${.91+.09*p})`}}>
 <PhoneShell><div style={{font:`850 39px ${fnt}`,margin:'15px 0 25px'}}>Configurar iPhone</div>
 <div style={{font:`550 23px/1.45 ${fnt}`,color:MUTED,marginBottom:27}}>SIMULACIÓN ILUSTRATIVA</div>
 <Row text="Elegir idioma" highlight={step===0}/>
 <Row text="Conectar a Wi-Fi" highlight={step===1}/>
 <Row text={step===2?'Sin bloqueo anterior ✓':'Verificar cuenta anterior'} highlight={step===2}/>
 <div style={{marginTop:55,background:step===2?'#1E594B':'#243E54',border:`2px solid ${step===2?'#6CD9AA':CYAN}`,borderRadius:22,padding:22,textAlign:'center',font:`800 25px ${fnt}`,color:step===2?'#A5FFD6':CYAN}}>{step===2?'LISTO PARA CONFIGURAR':'COMPROBAR ANTES DE PAGAR'}</div>
 </PhoneShell></div>
 </AbsoluteFill>};
const Battery:React.FC=()=>{const f=useCurrentFrame(),p=pop(f,7),v=Math.round(lerp(f,25,104,0,86));return <AbsoluteFill><Backdrop/><Brand/>
 <SectionTitle number="02" kicker="SEGUNDO CONTROL" line1="ESTADO DE" line2="LA BATERÍA" desc="Mirá su capacidad máxima y los avisos importantes."/>
 <div style={{position:'absolute',top:885,left:92,opacity:p,transform:`translateX(${(1-p)*-140}px)`}}>
 <Card style={{width:890,height:505}}>
 <div style={{display:'flex',justifyContent:'space-between',font:`800 32px ${fnt}`,color:WHITE}}><span>Ajustes</span><span style={{color:CYAN}}>Batería ›</span></div>
 <div style={{font:`700 35px ${fnt}`,marginTop:42,color:WHITE}}>Capacidad máxima</div>
 <div style={{display:'flex',alignItems:'center',gap:40,marginTop:36}}>
  <div style={{width:485,height:108,border:`7px solid ${CYAN}`,borderRadius:22,padding:9,position:'relative'}}>
   <div style={{width:`${v}%`,height:'100%',background:CYAN,borderRadius:8,boxShadow:'0 0 28px #68D9FF55'}}/>
   <div style={{position:'absolute',right:-26,top:30,width:16,height:40,background:CYAN,borderRadius:'0 8px 8px 0'}}/>
  </div>
  <div style={{font:`900 90px ${fnt}`,color:CYAN}}>{v}%</div>
 </div><div style={{color:MUTED,font:`550 28px/1.3 ${fnt}`,marginTop:50}}>86% es un valor de ejemplo, no un equipo real.</div></Card>
 </div></AbsoluteFill>};
const Face:React.FC=()=>{const f=useCurrentFrame(),p=pop(f,8),line=lerp(f%58,0,57,10,310);return <AbsoluteFill><Backdrop/><Brand/>
 <SectionTitle number="03" kicker="TERCER CONTROL" line1="FACE ID" line2="Y CÁMARAS" desc="Probá el desbloqueo facial y todas las cámaras."/>
 <div style={{position:'absolute',top:865,left:110,opacity:p,transform:`translateY(${(1-p)*110}px)`}}>
 <Card style={{width:860,height:580}}>
 <div style={{display:'flex',gap:70,alignItems:'center'}}>
 <div style={{width:330,height:350,border:`5px solid ${CYAN}`,borderRadius:65,position:'relative',overflow:'hidden',boxShadow:'0 0 35px #68D9FF20'}}>
  <div style={{position:'absolute',inset:'75px 65px',border:'4px dashed #98BFD4',borderRadius:'46%'}}/>
  <div style={{position:'absolute',left:0,right:0,top:line,height:4,background:CYAN,boxShadow:'0 0 28px #68D9FF'}}/>
 </div>
 <div style={{font:`900 44px ${fnt}`,color:CYAN}}>FACE ID<br/><span style={{fontSize:30,color:MUTED}}>PROBALO</span></div>
 </div>
 <div style={{display:'flex',alignItems:'center',gap:30,marginTop:46}}>
  <div style={{font:`850 33px ${fnt}`,color:WHITE}}>CÁMARAS</div>
  {[0,1,2].map(i=><div key={i} style={{width:90,height:90,border:`7px solid ${CYAN}`,borderRadius:'50%',boxShadow:'0 0 25px #68D9FF35',background:'radial-gradient(circle,#1A364A 0%,#07121C 49%,#24455C 52%,#08101A 100%)',transform:`scale(${pop(f,37+i*10)})`}}/>)}
 </div></Card></div>
 </AbsoluteFill>};
const Outro:React.FC=()=>{const f=useCurrentFrame();return <AbsoluteFill><Backdrop/><Brand/>
 <div style={{position:'absolute',top:395,left:65,right:65,textAlign:'center'}}>
 <Badge value="TIP ÚTIL PARA COMPARTIR"/>
 <div style={{marginTop:105}}><Words text="¡GUARDÁ" start={5} size={125} center/><Words text="ESTE VIDEO!" start={12} size={116} cyan center/></div>
 <div style={{marginTop:75,opacity:lerp(f,25,38,0,1),color:MUTED,font:`600 45px/1.28 ${fnt}`}}>Mandáselo a quien esté por<br/>comprar un iPhone usado.</div>
 <Underline start={23}/>
 <div style={{marginTop:135,opacity:pop(f,28),transform:`scale(${.86+.14*pop(f,28)})`,color:WHITE,font:`900 72px ${fnt}`}}>APPLE <span style={{color:CYAN}}>STORE FSA</span></div>
 </div></AbsoluteFill>};
export const FsaReel:React.FC=()=> <AbsoluteFill style={{backgroundColor:DARK}}>
 <Sequence from={0} durationInFrames={90}><Intro/></Sequence>
 <Sequence from={90} durationInFrames={180}><Activation/></Sequence>
 <Sequence from={270} durationInFrames={180}><Battery/></Sequence>
 <Sequence from={450} durationInFrames={180}><Face/></Sequence>
 <Sequence from={630} durationInFrames={120}><Outro/></Sequence>
 <Audio src={staticFile('audio/track.wav')} volume={.44}/>
 </AbsoluteFill>;
