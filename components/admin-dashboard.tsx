"use client"

import Image from "next/image"
import { CheckCircle2, Gift, LoaderCircle, LogOut, RefreshCw, Search, ShieldCheck, TicketCheck, Users } from "lucide-react"
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Metrics={participants:number;completed_spins:number;redeemed:number;unredeemed:number;today_spins:number}
type Prize={key:string;label:string;weight:number;daily_limit:number|null;is_active:boolean;is_spin_again:boolean;won:number;redeemed:number}
type Entry={session_id:string;name:string;phone:string;status:string;prize_label:string|null;prize_code:string|null;created_at:string;completed_at:string|null;redeemed_at:string|null}
type Data={ok:true;metrics:Metrics;prizes:Prize[];entries:Entry[]}

const moneyish=(value:number)=>value.toLocaleString("en-IN")
const date=(value:string|null)=>value?new Intl.DateTimeFormat("en-NP",{timeZone:"Asia/Kathmandu",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(value)):"—"

export function AdminDashboard(){
 const [ready,setReady]=useState(false),[login,setLogin]=useState(false),[password,setPassword]=useState("")
 const [data,setData]=useState<Data|null>(null),[search,setSearch]=useState(""),[loading,setLoading]=useState(false)
 const [code,setCode]=useState(""),[notice,setNotice]=useState(""),[error,setError]=useState("")

 const load=useCallback(async(q="")=>{
  setLoading(true);setError("")
  try{
   const r=await fetch("/api/admin/dashboard?search="+encodeURIComponent(q),{cache:"no-store"})
   if(r.status===401){setLogin(true);setData(null);setReady(true);return}
   const d=await r.json()
   if(!r.ok||!d.ok){setError(d.message||"Could not load dashboard.");setReady(true);return}
   setData(d);setLogin(false);setReady(true)
  }catch{setError("Connection problem.");setReady(true)}
  finally{setLoading(false)}
 },[])

 useEffect(()=>{void load()},[load])

 async function signIn(e:FormEvent){
  e.preventDefault();setLoading(true);setError("")
  try{
   const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})})
   const d=await r.json()
   if(!r.ok||!d.ok){setError(d.message||"Incorrect password.");return}
   setPassword("");await load()
  }catch{setError("Connection problem.")}
  finally{setLoading(false)}
 }

 async function logout(){
  await fetch("/api/admin/logout",{method:"POST"});setData(null);setLogin(true);setReady(false)
 }

 async function redeem(value=code){
  const prizeCode=value.trim().toUpperCase()
  if(!prizeCode){setError("Enter a prize code.");return}
  setLoading(true);setError("");setNotice("")
  try{
   const r=await fetch("/api/admin/redeem",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:prizeCode})})
   const d=await r.json()
   if(!r.ok||!d.ok){setError(d.message||"Could not redeem.");return}
   setCode("")
   setNotice(
    d.name && d.prize_label
      ? `Redeemed: ${d.name} · ${d.prize_label}`
      : "Prize redeemed successfully."
   )
   await load(search)
  }catch{setError("Connection problem.")}
  finally{setLoading(false)}
 }

 const totalWeight=useMemo(()=>data?.prizes.filter(p=>p.is_active).reduce((n,p)=>n+p.weight,0)||0,[data])

 if(!ready||login){
  return <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-5 text-foreground"><div className="absolute right-5 top-5"><ThemeToggle/></div>
   <div className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"/>
   {login?
    <form onSubmit={signIn} className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl">
     <div className="mx-auto w-fit rounded-2xl bg-[#100A0C] px-5 py-2"><Image src="/logo/White Reversed 20D Cinema Secondary Logo.png" alt="20D Cinema" width={220} height={90} className="w-32 h-auto"/></div>
     <div className="mt-7 text-center"><ShieldCheck className="mx-auto size-6 text-muted-foreground"/><h1 className="mt-3 font-heading text-xl font-semibold uppercase tracking-[.08em]">Spin Admin</h1><p className="mt-2 text-sm text-muted-foreground">Secure campaign dashboard</p></div>
     <Input autoFocus type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Admin password" className="mt-7 h-12 border-input bg-surface text-foreground placeholder:text-muted-foreground"/>
     <p className="mt-2 min-h-4 text-xs text-destructive">{error}</p>
     <Button type="submit" disabled={loading} className="mt-2 h-12 w-full rounded-xl bg-[#D6003C] text-white hover:bg-[#BE0036]">{loading?<LoaderCircle className="animate-spin"/>:<ShieldCheck/>}Sign in</Button>
    </form>
    :<LoaderCircle className="relative size-5 animate-spin text-muted-foreground"/>}
  </main>
 }

 if(!data)return null
 const cards=[
  ["Participants",data.metrics.participants,Users],
  ["Today",data.metrics.today_spins,Gift],
  ["Total Spins",data.metrics.completed_spins,TicketCheck],
  ["Pending",data.metrics.unredeemed,TicketCheck],
  ["Redeemed",data.metrics.redeemed,CheckCircle2],
 ] as const

 return <main className="min-h-svh bg-background text-foreground">
  <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
   <header className="flex items-center justify-between border-b border-border pb-5">
    <div className="flex items-center gap-3"><div className="rounded-xl bg-[#100A0C] px-3 py-1.5"><Image src="/logo/White Reversed 20D Cinema Secondary Logo.png" alt="20D Cinema" width={220} height={90} className="w-24 h-auto"/></div><div className="h-7 w-px bg-muted"/><div><p className="font-heading text-sm font-semibold uppercase tracking-[.08em]">Spin Admin</p><p className="text-[11px] text-muted-foreground">Campaign control</p></div></div>
    <div className="flex items-center gap-1"><ThemeToggle/><Button variant="ghost" size="icon" onClick={()=>void load(search)}><RefreshCw className={loading?"animate-spin":""}/></Button><Button variant="ghost" size="icon" onClick={logout}><LogOut/></Button></div>
   </header>

   {error&&<div className="mt-4 rounded-xl border border-[#FF527D]/15 bg-[#FF527D]/7 px-4 py-3 text-sm text-[#FF8BA6]">{error}</div>}
   {notice&&<div className="mt-4 rounded-xl border border-emerald-400/15 bg-emerald-400/7 px-4 py-3 text-sm text-emerald-300">{notice}</div>}

   <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
    {cards.map(([label,value,Icon])=><div key={label} className="rounded-2xl border border-border bg-card p-4"><Icon className="size-4 text-muted-foreground"/><p className="mt-5 font-heading text-2xl font-semibold">{moneyish(value)}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>)}
   </section>

   <section className="mt-6 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
    <div className="space-y-5">
     <div className="rounded-3xl border border-border bg-card p-5">
      <p className="font-heading text-sm font-semibold uppercase tracking-[.08em]">Redeem Prize</p><p className="mt-1 text-xs text-muted-foreground">Verify the winner's code at the counter.</p>
      <div className="mt-5 flex gap-2"><Input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="20D-XXXXXXXX" className="h-11 border-input bg-surface font-heading uppercase text-foreground placeholder:font-sans placeholder:normal-case"/><Button onClick={()=>void redeem()} disabled={loading} className="h-11 rounded-xl bg-[#D6003C] text-white hover:bg-[#BE0036]"><TicketCheck/>Redeem</Button></div>
     </div>
     <div><div className="mb-3"><p className="font-heading text-sm font-semibold uppercase tracking-[.08em]">Prize Settings</p><p className="mt-1 text-xs text-muted-foreground">Adjust relative chance and daily limits.</p></div>
      <div className="space-y-3">{data.prizes.map(p=><PrizeRow key={p.key} prize={p} totalWeight={totalWeight} onSaved={()=>load(search)}/>)}</div>
     </div>
    </div>

    <div>
     <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-heading text-sm font-semibold uppercase tracking-[.08em]">Participants & Winners</p><p className="mt-1 text-xs text-muted-foreground">Latest 100 matching records.</p></div><form onSubmit={e=>{e.preventDefault();void load(search)}} className="flex gap-2 sm:w-80"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, phone or code" className="h-10 pl-9 border-input bg-surface text-foreground"/></div><Button className="h-10 bg-foreground text-background hover:bg-foreground/90">Search</Button></form></div>
     <div className="mt-4 space-y-3">{data.entries.map(e=><div key={e.session_id} className="rounded-2xl border border-border bg-card p-4"><div className="flex justify-between gap-3"><div><p className="font-semibold text-foreground/85">{e.name}</p><p className="text-xs text-muted-foreground">{e.phone}</p></div><p className="text-[10px] text-muted-foreground">{date(e.completed_at||e.created_at)}</p></div><div className="mt-3 flex items-center justify-between border-t border-border pt-3"><div><p className="text-xs text-muted-foreground">{e.prize_label||"Waiting for re-spin"}</p><p className="mt-1 font-heading text-xs tracking-[.06em] text-foreground/70">{e.prize_code||"—"}</p></div>{e.redeemed_at?<span className="rounded-full border border-emerald-400/15 bg-emerald-400/8 px-2 py-1 text-[9px] font-semibold uppercase text-emerald-300">Redeemed</span>:e.prize_code?<Button onClick={()=>void redeem(e.prize_code!)} disabled={loading} className="h-8 rounded-lg bg-[#D6003C] px-3 text-xs text-white hover:bg-[#BE0036]">Redeem</Button>:<span className="text-[10px] text-amber-600 dark:text-amber-300">Re-spin</span>}</div></div>)}</div>
     {!data.entries.length&&<div className="mt-4 rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-muted-foreground">No matching records.</div>}
    </div>
   </section>
  </div>
 </main>
}

function PrizeRow({prize,totalWeight,onSaved}:{prize:Prize;totalWeight:number;onSaved:()=>void}){
 const [weight,setWeight]=useState(String(prize.weight)),[limit,setLimit]=useState(prize.daily_limit==null?"":String(prize.daily_limit)),[active,setActive]=useState(prize.is_active),[saving,setSaving]=useState(false)
 useEffect(()=>{setWeight(String(prize.weight));setLimit(prize.daily_limit==null?"":String(prize.daily_limit));setActive(prize.is_active)},[prize])
 const chance=active&&totalWeight?((Number(weight)||0)/totalWeight)*100:0
 async function save(){
  setSaving(true)
  try{const r=await fetch("/api/admin/prizes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:prize.key,weight:Number(weight),daily_limit:limit===""?null:Number(limit),is_active:active})});if(!r.ok){setSaving(false);return}await onSaved()}finally{setSaving(false)}
 }
 return <div className="rounded-2xl border border-border bg-card p-4"><div className="flex items-center justify-between"><div><p className="font-semibold text-sm">{prize.label}</p><p className="mt-1 text-[11px] text-muted-foreground">{chance.toFixed(1)}% relative chance · {prize.won} won</p></div><button type="button" onClick={()=>setActive(v=>!v)} className={`h-6 w-11 rounded-full p-0.5 ${active?"bg-[#D6003C]":"bg-muted"}`}><span className={`block size-5 rounded-full bg-white transition-transform ${active?"translate-x-5":"translate-x-0"}`}/></button></div><div className="mt-4 grid grid-cols-2 gap-2"><Input type="number" min={1} value={weight} onChange={e=>setWeight(e.target.value)} className="h-9 border-input bg-surface text-foreground" placeholder="Weight"/><Input type="number" min={1} value={limit} onChange={e=>setLimit(e.target.value)} className="h-9 border-input bg-surface text-foreground" placeholder="Daily limit"/></div><Button onClick={()=>void save()} disabled={saving} className="mt-3 h-8 w-full bg-foreground text-background hover:bg-foreground/90">{saving?<LoaderCircle className="animate-spin"/>:"Save settings"}</Button></div>
}
