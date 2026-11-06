from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np
src=Path('public/uploads/pedestals---personal-storage-1792991544645-567958.jpg'); image=Image.open(src); rgba=image.convert('RGBA'); p=np.array(rgba,dtype=np.uint8).copy(); rgb=p[:,:,:3]; h,w=rgb.shape[:2]
lo=rgb.min(2); hi=rgb.max(2).astype(np.int16); eligible=(lo>=220)&((hi-lo)<=26)&(p[:,:,3]>=240)
mask=Image.fromarray(eligible.astype(np.uint8)*255,'L'); ImageDraw.Draw(mask); view=mask.load(); seeds=[*((x,0) for x in range(w)),*((x,h-1) for x in range(w)),*((0,y) for y in range(1,h-1)),*((w-1,y) for y in range(1,h-1))]
for seed in seeds:
 if view[seed[0],seed[1]]==255: ImageDraw.floodfill(mask,seed,128,thresh=0)
selected=np.asarray(mask)==128; print('selected',int(selected.sum()),'fraction',selected.mean())
orig=rgb[selected].astype(np.float32); lum=.2126*orig[:,0]+.7152*orig[:,1]+.0722*orig[:,2]; beige=np.array([233,228,220],np.float32); p[selected,:3]=np.rint(beige*np.clip(lum/255,0,1)[:,None]).astype(np.uint8)
Image.fromarray(p[:,:,:3],'RGB').save('public/uploads/pedestal-clean-preview.jpg',quality=95,subsampling=0)
