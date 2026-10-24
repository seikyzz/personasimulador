"""Extract supported skill metadata; usage: python3 scripts/import-combat-skills.py REFERENCE_REPO"""
import json,pathlib,sys
root=pathlib.Path(sys.argv[1])/'src/app'
cat=json.loads(pathlib.Path('src/academy/catalog.json').read_text());out={}
elements=dict(phy='Físico',sla='Corte',str='Impacto',pie='Perfuração',gun='Arma',fir='Fogo',ice='Gelo',ele='Eletricidade',win='Vento',psy='Psíquico',nuk='Nuclear',ble='Luz',cur='Trevas',alm='Onipotente')
for g,folder,prefix in [('p4g','p4','golden-'),('p3r','p3r',''),('p5r','p5','roy-')]:
 data=json.loads((root/folder/'data/skill-data.json').read_text())
 if prefix:data.update(json.loads((root/folder/'data'/f'{prefix}skill-data.json').read_text()))
 names={s['name'] for p in cat[g].values() for s in p['skills']}|{'Agi','Bufu','Garu','Zio','Dia','Media','Tarunda','Rakunda','Rakukaja','Tarukaja','Bash','Cleave','Lunge'}
 rows={}
 for v in data.values():
  name,elem,target=v['a'];cost=v['b'][1];power=v['b'][2]
  if name not in names:continue
  kind='hit' if elem in elements and power>0 else 'heal' if name in ['Dia','Diarama','Diarahan','Media','Mediarama','Mediarahan'] else 'buff' if name in ['Tarukaja','Rakukaja'] else 'debuff' if name in ['Tarunda','Rakunda'] else 'charge' if name in ['Charge','Power Charge','Concentrate','Mind Charge'] else None
  if not kind:continue
  rows[name]=dict(name=name,kind=kind,target=target,cost=cost-1000 if cost>=1000 else cost,resource='sp' if cost>=1000 else 'hp',all=target in ['All foes','All allies'])
  if kind=='hit':rows[name].update(element=elements[elem],power=power)
 out[g]=rows
pathlib.Path('src/academy/combat-skills.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print({g:len(v) for g,v in out.items()})
