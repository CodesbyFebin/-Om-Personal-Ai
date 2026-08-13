type OmMarkProps={className?:string;label?:string};
export default function OmMark({className="",label="OM"}:OmMarkProps){
 return <svg className={className} viewBox="0 0 64 64" role="img" aria-label={label}>
  <defs><linearGradient id="omMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3b0"/><stop offset=".35" stopColor="#d7a83c"/><stop offset=".7" stopColor="#f4d77f"/><stop offset="1" stopColor="#8f641f"/></linearGradient></defs>
  <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeOpacity=".22"/>
  <text x="32" y="45" textAnchor="middle" fontSize="46" fontWeight="600" fontFamily="Georgia, 'Noto Serif Devanagari', serif" fill="url(#omMetal)">ॐ</text>
 </svg>
}
