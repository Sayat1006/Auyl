import json, subprocess, sys, wave, os, struct
V=sys.argv[1]; SPK=sys.argv[2] if len(sys.argv)>2 else "0"
os.makedirs("build/audio",exist_ok=True)
sc=json.load(open("scenes.json")); out=[]
for i,s in enumerate(sc):
    f=f"build/audio/{i:02d}.wav"
    subprocess.run([sys.executable,"-m","piper","-m",V,"-s",SPK,"--length-scale","0.95","-f",f],input=s["say"].encode(),check=True,capture_output=True)
    w=wave.open(f); d=w.getnframes()/w.getframerate(); out.append(round(d,3)); print(i,s["id"],round(d,2))
json.dump(out,open("build/durations.json","w"))
