import json, subprocess, sys, wave, os
V=sys.argv[1]
os.makedirs("build/audio",exist_ok=True)
for i,s in enumerate(json.load(open("scenes.json"))):
    f=f"build/audio/{i:02d}.wav"
    subprocess.run([sys.executable,"-m","piper","-m",V,"-s",s.get("spk","0"),"--length-scale","0.97" if s.get("spk") else "0.95","-f",f],input=s["say"].encode(),check=True,capture_output=True)
    w=wave.open(f); print(i,s["id"],round(w.getnframes()/w.getframerate(),2))
