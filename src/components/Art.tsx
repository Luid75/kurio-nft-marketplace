import type { ArtVariant } from '../types'

const palettes = {
  emerald: { bg: '#e9e8c8', fur: '#7a4424', furLight: '#a76a3d', muzzle: '#e8b37d', dark: '#362116', coat: '#126048', inner: '#f5e8cf', accent: '#c79b55' },
  nomad: { bg: '#efe9cb', fur: '#777976', furLight: '#adb2a5', muzzle: '#dac8ad', dark: '#444744', coat: '#6d4e84', inner: '#7f609b', accent: '#868e78' },
  baron: { bg: '#c9dfcc', fur: '#333438', furLight: '#525257', muzzle: '#a7a09b', dark: '#29292b', coat: '#dfd0b5', inner: '#315140', accent: '#a7886a' },
  golden: { bg: '#f5e8c3', fur: '#b46918', furLight: '#ec9a28', muzzle: '#f0c388', dark: '#7d3b13', coat: '#e3d4b3', inner: '#f1e7d6', accent: '#1d6b56' },
} as const

export function Art({ variant, className = '' }: { variant: ArtVariant; className?: string }) {
  const c = palettes[variant]
  const id = 'art-' + variant
  return (
    <svg className={'art-svg ' + className} viewBox="0 0 400 400" role="img" aria-label={'Ilustração do NFT ' + variant} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={id + '-bg'} cx="60%" cy="25%" r="85%"><stop stopColor="#fff7d9"/><stop offset="1" stopColor={c.bg}/></radialGradient>
        <linearGradient id={id + '-fur'} x1="0" y1="0" x2="1" y2="1"><stop stopColor={c.furLight}/><stop offset="1" stopColor={c.fur}/></linearGradient>
        <linearGradient id={id + '-coat'} x1="0" x2="1" y1="0" y2="1"><stop stopColor={c.inner}/><stop offset="1" stopColor={c.coat}/></linearGradient>
      </defs>
      <rect width="400" height="400" rx="18" fill={'url(#' + id + '-bg)'}/>
      {variant === 'golden' && <circle cx="210" cy="205" r="155" fill="#a9ba9d" opacity=".7"/>}
      <ellipse cx="202" cy="409" rx="177" ry="120" fill={'url(#' + id + '-coat)'}/>
      <path d="M118 319 Q200 348 276 310 L331 400 H65Z" fill={c.coat}/>
      <path d="M177 298 L223 300 L236 400 H158Z" fill={c.inner}/>
      <ellipse cx="105" cy="184" rx="49" ry="65" fill={c.fur} stroke={c.dark} strokeWidth="5"/>
      <ellipse cx="294" cy="184" rx="49" ry="65" fill={c.fur} stroke={c.dark} strokeWidth="5"/>
      <ellipse cx="109" cy="188" rx="27" ry="39" fill={c.muzzle} opacity=".85"/>
      <ellipse cx="291" cy="188" rx="27" ry="39" fill={c.muzzle} opacity=".85"/>
      <path d="M111 126 Q118 75 182 65 Q244 54 283 112 Q311 158 284 251 Q263 316 202 330 Q141 328 115 267 Q91 203 111 126Z" fill={'url(#' + id + '-fur)'} stroke={c.dark} strokeWidth="5"/>
      <path d="M115 124 Q125 76 162 66 L153 92 L190 45 L187 79 L221 51 L211 84 Q261 68 284 119" fill={c.fur} stroke={c.dark} strokeWidth="6" strokeLinejoin="round"/>
      <path d="M133 185 Q142 151 179 166 Q193 179 193 207 L139 207Z" fill={c.muzzle}/>
      <path d="M208 205 Q207 169 228 163 Q264 153 273 192 L269 207Z" fill={c.muzzle}/>
      <ellipse cx="163" cy="190" rx="15" ry="12" fill="#2f3027"/>
      <ellipse cx="241" cy="188" rx="15" ry="12" fill="#2f3027"/>
      <circle cx="166" cy="187" r="4" fill="#fff9df"/>
      <circle cx="243" cy="185" r="4" fill="#fff9df"/>
      <path d="M160 214 Q200 195 239 211 Q271 228 258 272 Q242 301 205 301 Q158 301 141 269 Q127 232 160 214Z" fill={c.muzzle}/>
      <ellipse cx="185" cy="231" rx="10" ry="6" fill={c.dark} opacity=".75"/>
      <ellipse cx="225" cy="231" rx="10" ry="6" fill={c.dark} opacity=".75"/>
      <path d="M165 260 Q199 279 239 257" fill="none" stroke={c.dark} strokeWidth="4" strokeLinecap="round"/>
      {variant === 'emerald' && <>
        <circle cx="161" cy="189" r="32" fill="#d6b779" stroke="#f5e2ac" strokeWidth="6"/>
        <circle cx="239" cy="188" r="32" fill="#d6b779" stroke="#f5e2ac" strokeWidth="6"/>
        <circle cx="161" cy="189" r="25" fill="#193f32"/>
        <circle cx="239" cy="188" r="25" fill="#193f32"/>
        <path d="M193 187 Q200 178 207 187 M128 186 L105 177 M270 186 L294 176" fill="none" stroke="#d7aa61" strokeWidth="7"/>
        <path d="M201 312 L205 355" stroke="#d0a156" strokeWidth="5"/>
        <path d="M205 354 l-12 11 12 26 12-26Z" fill="#16aa7a" stroke="#d4ac64" strokeWidth="5"/>
        <path d="M130 321 L187 348 L201 327 L214 350 L276 316" fill="none" stroke="#d5b178" strokeWidth="5"/>
      </>}
      {variant === 'nomad' && <>
        <path d="M109 120 Q82 62 152 52 Q209 30 263 62 Q307 79 290 125Z" fill="#8c9478" stroke="#485342" strokeWidth="6"/>
        <path d="M77 117 Q193 100 321 125 Q318 151 272 149 L108 148 Q74 143 77 117Z" fill="#8c987b" stroke="#525a45" strokeWidth="5"/>
        <path d="M118 314 Q197 371 290 307" stroke="#977db0" strokeWidth="18" fill="none"/>
        <path d="M163 334 L152 393 M243 334 L252 393" stroke="#c0a1cb" strokeWidth="7"/>
      </>}
      {variant === 'baron' && <>
        <path d="M144 325 L193 370 L173 400 L117 332 M252 324 L206 370 L231 400 L288 332" fill="#fff0d6"/>
        <path d="M180 324 L199 342 L220 325 L215 400 L184 400Z" fill="#244b3b"/>
        <circle cx="96" cy="221" r="7" fill="#cfaa65"/>
      </>}
      {variant === 'golden' && <>
        <circle cx="112" cy="181" r="29" fill="#17654e" stroke="#a36a2e" strokeWidth="9"/>
        <circle cx="287" cy="181" r="29" fill="#17654e" stroke="#a36a2e" strokeWidth="9"/>
        <path d="M109 161 Q121 65 207 67 Q290 65 291 164" stroke="#146c52" strokeWidth="18" fill="none"/>
        <path d="M129 322 L202 350 L277 322" stroke="#d0b28a" strokeWidth="9" fill="none"/>
      </>}
      <path d="M80 358 Q100 344 125 361 M282 355 Q311 344 330 360" stroke={c.accent} strokeWidth="5" opacity=".45" fill="none"/>
    </svg>
  )
}