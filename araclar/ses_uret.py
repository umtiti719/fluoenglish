import json,hashlib,os,subprocess,sys,time,soundfile as sf
from kokoro_onnx import Kokoro
import sys
items=json.load(open(sys.argv[1] if len(sys.argv)>1 else '/home/claude/tts/items.json'))
k=Kokoro('/home/claude/tts/kokoro-v1.0.int8.onnx','/home/claude/tts/voices-v1.0.bin')
out='/home/claude/tts/mp3';done=0;t0=time.time();keys=list(items)
for i,key in enumerate(keys):
    h=hashlib.md5(key.encode()).hexdigest()[:12];f=f'{out}/{h}.mp3'
    if os.path.exists(f):done+=1;continue
    g=items[key];speed=0.9 if g=='w' else 0.95
    s,sr=k.create(key,voice='af_heart',speed=speed,lang='en-us')
    wav=f'{out}/{h}.wav';sf.write(wav,s,sr)
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',wav,'-af','silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,apad=pad_dur=0.12','-codec:a','libmp3lame','-b:a','40k','-ac','1',f],check=True)
    os.remove(wav);done+=1
    if i%20==0:print(f'{i+1}/{len(keys)} {round(time.time()-t0)}s',flush=True)
print('BITTI',len(keys),round(time.time()-t0),flush=True)
