"""Synthesize one WAV per scene from <proj>/scenes.json with Piper (ISSAI Kazakh voice).
  python3 make_audio.py <projectDir>
scenes.json item: {"id","say","sub", "spk"?:"0".."5", "speed"?:0.95, "audio"?:"path/to/own.wav"}
- "say" may contain digits; they are converted with kk_num (check the printed text!).
- "audio": use the user's own recording for that scene instead of TTS; with "audioStart"/"audioEnd" (seconds) a slice of one long file.
All scene WAVs are 44.1 kHz mono.
- project.json "voice": {"model":"kk-issai-high","spk":"0","speed":0.95}"""
import json, os, subprocess, sys, wave, shutil
sys.path.insert(0, os.path.dirname(__file__)); import kk_num
P=os.path.abspath(sys.argv[1]); H=os.environ.get('MV3D_HOME',os.path.expanduser('~/.cache/motion-video-3d'))
pj=json.load(open(f'{P}/project.json')) if os.path.exists(f'{P}/project.json') else {}
vc=pj.get('voice',{}); model=f"{H}/voices/{vc.get('model','kk-issai-high')}.onnx"
os.makedirs(f'{P}/build/audio',exist_ok=True)
for i,s in enumerate(json.load(open(f'{P}/scenes.json'))):
    f=f'{P}/build/audio/{i:02d}.wav'
    if s.get('audio'):
        cmd=['ffmpeg','-v','error','-y']
        if 'audioStart' in s: cmd+=['-ss',str(s['audioStart']),'-to',str(s['audioEnd'])]   # slice of one long recording (e.g. ElevenLabs)
        subprocess.run(cmd+['-i',os.path.join(P,s['audio']),'-ac','1','-ar','44100',f],check=True)
    else:
        txt=kk_num.text(s['say']).replace('«','').replace('»','').replace('„','').replace('“','')
        if txt!=s['say']: print(f'   tts[{s["id"]}]: {txt}')
        subprocess.run([sys.executable,'-m','piper','-m',model,'-s',str(s.get('spk',vc.get('spk','0'))),'--length-scale',str(s.get('speed',vc.get('speed',0.95))),'-f',f+'.22k.wav'],input=txt.encode(),check=True,capture_output=True)
        subprocess.run(['ffmpeg','-v','error','-y','-i',f+'.22k.wav','-ar','44100',f],check=True); os.remove(f+'.22k.wav')
    w=wave.open(f); print(f'{i:02d} {s["id"]:<12} {w.getnframes()/w.getframerate():5.2f}s')
