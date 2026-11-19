const KEY='js-akademiya-progress-v1';
const EMPTY={completed:[],notes:{},drafts:{},theme:'dark',lastLesson:'setup-01',records:{},exerciseDrafts:{},exerciseResults:{},setupChecks:{},versions:{node:'',npm:''},videoProgress:{},labStorage:{},positions:{}};
const map=x=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.entries(x).filter(([k])=>!['__proto__','constructor','prototype'].includes(k))):{};
export function normalizeState(value={}){
 const result=structuredClone(EMPTY);
 result.completed=Array.isArray(value.completed)?[...new Set(value.completed.filter(x=>typeof x==='string'&&/^(lesson|setup)-\d{2}$/.test(x)))]:[];
 result.theme=value.theme==='light'?'light':'dark';
 if(typeof value.lastLesson==='string'&&/^(lesson|setup)-\d{2}$/.test(value.lastLesson))result.lastLesson=value.lastLesson;
 for(const key of ['notes','drafts','exerciseDrafts'])result[key]=Object.fromEntries(Object.entries(map(value[key])).filter(([,v])=>typeof v==='string'));
 for(const key of ['records','exerciseResults','setupChecks','versions','videoProgress','labStorage','positions'])result[key]=map(value[key]);
 return result;
}
export function loadState(){try{return normalizeState(JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{return structuredClone(EMPTY);}}
export function saveState(state){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
export function exportProgress(state){const blob=new Blob([JSON.stringify({version:2,exportedAt:new Date().toISOString(),...state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='js-akademiya-natijalar.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export async function importProgress(file){if(file.size>5000000)throw new Error('Fayl 5 MB dan kichik bo‘lsin');const value=JSON.parse(await file.text());if(!value||!Array.isArray(value.completed)||!value.notes||!value.drafts||typeof value.notes!=='object'||typeof value.drafts!=='object')throw new Error('Fayl formati mos emas');return normalizeState(value);}
