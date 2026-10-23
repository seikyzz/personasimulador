"""Usage: python3 scripts/import-personas.py DATA_REPO ART_DIRECTORY"""
import json,pathlib,sys,re,shutil,subprocess
root=pathlib.Path(sys.argv[1]); arts=pathlib.Path(sys.argv[2]); out=pathlib.Path('src/academy')
def read(p): return json.loads(p.read_text())
def slug(s): return 'jack-o-lantern' if s in ["Jack-o'-Lantern",'Pyro Jack'] else re.sub('[^a-z0-9-]','',s.lower().replace(' ','-'))
labels=dict(phy='Físico',sla='Corte',str='Impacto',pie='Perfuração',gun='Arma',fir='Fogo',ice='Gelo',ele='Eletricidade',win='Vento',psy='Psíquico',nuk='Nuclear',ble='Luz',lig='Luz',cur='Trevas',dar='Trevas',alm='Onipotente',rec='Cura',sup='Suporte',ail='Estado',pas='Passiva',spe='Especial')
result={}; recipes={}
for game,folder,prefix in [('p5r','p5','roy-'),('p3r','p3r',''),('p4g','p4','golden-')]:
 b=root/'src/app'/folder/'data'; config=read(b/'comp-config.json'); demons=read(b/(prefix+'demon-data.json'))
 if game=='p4g': demons={**read(b/'demon-data.json'),**demons}
 skills=read(b/'skill-data.json')
 if prefix: skills.update(read(b/(prefix+'skill-data.json')))
 sk={v['a'][0]:v for v in skills.values()}; excluded=set(read(b/('roy-special-recipes.json' if game=='p5r' else 'special-recipes.json')))
 for entry in read(b/(prefix+'demon-unlocks.json')):
  if entry['category']=='Downloadable Content':
   for names in entry['conditions']: excluded.update(names.split(','))
 normal={n:d for n,d in demons.items() if n not in excluded and d.get('inherits')!='none' and d['lvl']>0}
 if game=='p4g':
  inh=read(b/'inheritance-types.json'); masks={n:[e for e,v in zip(inh['elems'],row) if v] for n,row in zip(inh['inherits'],inh['ratios'])}
 else: masks={n:[e for e,v in zip(config['inheritElems'],m) if v=='1'] for n,m in config['inheritTypes'].items()}
 cat={}
 for name,d in normal.items():
  id=slug(name); art=arts/(id+'.webp')
  if d['lvl']>35 or not art.exists(): continue
  ss=[]
  for sn,lv in d['skills'].items():
   data=sk.get(sn); elem=data['a'][1] if data else 'spe'
   ss.append(dict(name=sn,level=d['lvl'] if lv<1 else lv,initial=lv<1,element=labels.get(elem,elem),code=elem,transfer=bool(data and data['b'][0]>0)))
  affinities=[dict(element=labels.get(e,e),affinity={'w':'Fraco','s':'Resiste','n':'Anula','r':'Repele','d':'Drena'}.get(v,'Normal')) for e,v in zip(config['resistElems'],d['resists']) if v!='-']
  cat[id]=dict(id=id,name=name,level=d['lvl'],arcana=d['race'],skills=ss,affinities=affinities,coverage=list(dict.fromkeys(s['element'] for s in ss if s['initial'])),accepts=masks.get(d['inherits'],[])+['pas','sup','alm'],stats=d['stats'])
  shutil.copy2(art,pathlib.Path('public/personas')/(id+'.webp'))
 table=read(b/(prefix+'fusion-chart.json')); rr={}; names=list(cat)
 for i,a in enumerate(names):
  for c in names[i+1:]:
   da,db=cat[a],cat[c]; threshold=(da['level']+db['level'])/2+1; same=da['arcana']==db['arcana']
   x,y=sorted([table['races'].index(da['arcana']),table['races'].index(db['arcana'])]); race=da['arcana'] if same else table['table'][y][x]
   candidates=sorted((d['lvl'],n) for n,d in normal.items() if d['race']==race and (not same or slug(n) not in [a,c]))
   if not candidates: continue
   possible=[v for v in candidates if v[0]<=threshold] if same else [v for v in candidates if v[0]>=threshold]
   if same and not possible: continue
   chosen=(possible[-1] if same else possible[0]) if possible else candidates[-1]; id=slug(chosen[1])
   if id in cat: rr['|'.join(sorted([a,c]))]=id
 result[game]=cat; recipes[game]=rr
(out/'catalog.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n'); (out/'recipes.json').write_text(json.dumps(recipes,ensure_ascii=False,indent=2)+'\n')
(out/'DATA-SOURCES.md').write_text('Fonte: https://github.com/aqiu384/megaten-fusion-tool\nCommit: '+subprocess.check_output(['git','-C',str(root),'rev-parse','HEAD'],text=True)+'\nRecorte ilustrado até nível 35. Fusão normal dupla, níveis base, sem DLC/especiais/Treasure Demons. Uma herança compatível por fusão é limite didático.\n')
print({g:(len(result[g]),len(recipes[g])) for g in result})
