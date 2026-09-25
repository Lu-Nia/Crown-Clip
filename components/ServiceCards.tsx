import Link from 'next/link';
const services = [
  ['cut','01','Signature Cut','R220','45 min','Classic scissor + clipper work, finished to the shape that suits you.'],
  ['fade','02','Skin Fade','R260','60 min','Clean blend, crisp line-up and a finish built around your hair texture.'],
  ['beard','03','Beard Sculpt','R120','30 min','Shape, detail and hot-towel finish for a beard that looks intentional.'],
  ['combo','04','Cut + Beard','R320','75 min','The complete reset: haircut, beard sculpt and a sharp final detail.'],
  ['kids','05','Kids Cut','R170','40 min','Patient, tidy cuts for younger clients with the same attention to detail.'],
  ['executive','06','Executive Package','R390','90 min','Cut, beard sculpt, hot towel and styling — the full Crown & Clip experience.']
];
export function ServiceCards({ compact=false }: {compact?:boolean}) {
  const list=compact?services.slice(0,3):services;
  return <div className="grid services-grid">{list.map(([id,index,name,price,duration,desc]) => <article className="card service-card" key={id}><span className="index">{index}</span><span className="eyebrow">Grooming</span><h3>{name}</h3><p>{desc}</p><div className="price-line"><span className="price">{price}</span><span className="duration">{duration}</span></div></article>)}</div>
}
export { services };
