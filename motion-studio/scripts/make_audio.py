#!/usr/bin/env python3
"""Synthesizes a simple original background beat and cue effects; no samples."""
import math, os, struct, wave, random
RATE=24000
DURATION=25
random.seed(1234)
path=os.path.join(os.path.dirname(__file__),'..','public','audio','track.wav')
os.makedirs(os.path.dirname(path),exist_ok=True)
cues=[0.3,1.0,2.7,3.0,4.4,6.5,9.0,10.5,12.2,15.0,17.0,19.0,21.0,23.5]
def bell(t,start,freq,volume=.16):
    dt=t-start
    return 0 if dt<0 or dt>.18 else volume*math.sin(2*math.pi*freq*dt)*math.exp(-dt*19)
with wave.open(path,'wb') as out:
    out.setnchannels(1);out.setsampwidth(2);out.setframerate(RATE)
    buf=bytearray()
    for n in range(RATE*DURATION):
        t=n/RATE
        beat=math.sin(2*math.pi*55*t)*math.exp(-((t*2)%1)*10)*.12
        pulse=(math.sin(2*math.pi*110*t)+.22*math.sin(2*math.pi*220*t))*.06
        tick=math.sin(2*math.pi*800*t)*math.exp(-((t*4)%1)*50)*.014
        chirp=sum(bell(t,c,650+int(c*20)) for c in cues)
        total=(beat+pulse+tick+chirp)*min(1,t/.18,(25-t)/.32)
        sample=int(max(-1,min(1,total))*32767)
        buf+=struct.pack('<h',sample)
    out.writeframes(bytes(buf))
print(path)
