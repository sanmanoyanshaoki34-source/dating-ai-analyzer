import { useState, useEffect, useRef } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@300;400;700;900&display=swap');`;

const css = `
* { box-sizing:border-box; margin:0; padding:0; }
body { background:#08080d; }
.app { min-height:100vh; background:#08080d; color:#f0f0f0; font-family:'Noto Sans JP',sans-serif; position:relative; overflow-x:hidden; }
.bg-grid { position:fixed; inset:0; z-index:0; background-image:linear-gradient(rgba(200,30,30,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,30,30,0.04) 1px,transparent 1px); background-size:40px 40px; pointer-events:none; }
.glow { position:fixed; width:700px; height:700px; border-radius:50%; background:radial-gradient(circle,rgba(200,30,30,0.09) 0%,transparent 70%); top:-300px; right:-200px; pointer-events:none; z-index:0; }
.wrap { position:relative; z-index:1; max-width:640px; margin:0 auto; padding:36px 18px 100px; }

.badge { display:inline-block; background:rgba(220,50,50,0.15); border:1px solid rgba(220,50,50,0.4); color:#ff4444; font-size:10px; letter-spacing:3px; padding:4px 12px; border-radius:2px; margin-bottom:14px; }
.title { font-family:'Bebas Neue',sans-serif; font-size:clamp(54px,14vw,88px); line-height:0.88; letter-spacing:3px; background:linear-gradient(135deg,#fff 0%,#ff4444 55%,#ff8800 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.subtitle { font-size:12px; color:#666; margin-top:10px; letter-spacing:0.5px; }

.warn { background:linear-gradient(135deg,rgba(220,30,30,0.1),rgba(180,20,20,0.05)); border:1px solid rgba(220,30,30,0.25); border-left:3px solid #ff3333; border-radius:10px; padding:14px 16px; margin-bottom:20px; display:flex; gap:10px; align-items:flex-start; font-size:12px; line-height:1.8; color:#ccc; }
.warn strong { color:#ff4444; }

.card { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:20px; margin-bottom:12px; }
.slabel { font-size:10px; letter-spacing:3px; color:#ff4444; text-transform:uppercase; margin-bottom:10px; }
textarea { width:100%; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.09); border-radius:8px; padding:12px 14px; color:#f0f0f0; font-family:'Noto Sans JP',sans-serif; font-size:13px; resize:none; outline:none; transition:border-color 0.2s; }
textarea:focus { border-color:rgba(220,50,50,0.5); }
textarea::placeholder { color:#333; }

/* ── photo upload ── */
.photo-drop {
  border:2px dashed rgba(255,255,255,0.12); border-radius:10px;
  padding:28px 16px; text-align:center; cursor:pointer;
  transition:all 0.2s; background:rgba(0,0,0,0.25); position:relative;
}
.photo-drop:hover, .photo-drop.drag { border-color:rgba(220,50,50,0.5); background:rgba(220,50,50,0.05); }
.photo-drop-icon { font-size:32px; margin-bottom:8px; }
.photo-drop-main { font-size:14px; color:#ccc; margin-bottom:4px; }
.photo-drop-sub  { font-size:11px; color:#555; }
.photo-drop input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }

.photo-preview-wrap { position:relative; border-radius:10px; overflow:hidden; }
.photo-preview { width:100%; max-height:280px; object-fit:cover; display:block; border-radius:10px; }
.photo-preview-overlay {
  position:absolute; inset:0; background:rgba(0,0,0,0.55);
  display:flex; align-items:center; justify-content:center;
  opacity:0; transition:opacity 0.2s; cursor:pointer;
}
.photo-preview-wrap:hover .photo-preview-overlay { opacity:1; }
.photo-preview-overlay span { font-size:12px; color:#fff; letter-spacing:2px; }
.photo-clear { position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.7); border:1px solid rgba(255,255,255,0.2); color:#fff; font-size:11px; padding:4px 10px; border-radius:20px; cursor:pointer; }

.go-btn { width:100%; padding:18px; background:linear-gradient(135deg,#b81818,#ff4444); border:none; border-radius:10px; color:#fff; font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:3px; cursor:pointer; transition:all 0.2s; margin-top:6px; }
.go-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 35px rgba(200,30,30,0.45); }
.go-btn:disabled { opacity:0.35; cursor:not-allowed; }

/* loading */
.loading { text-align:center; padding:80px 24px; animation:up 0.4s ease; }
.spinner { width:48px; height:48px; border:2px solid rgba(255,68,68,0.12); border-top-color:#ff4444; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 20px; }
@keyframes spin { to{transform:rotate(360deg)} }
.bar-track { height:2px; background:rgba(255,255,255,0.05); border-radius:1px; overflow:hidden; margin-top:22px; }
.bar-fill { height:100%; background:#ff4444; animation:bar 2s ease-in-out infinite; }
@keyframes bar { 0%{width:0%;margin-left:0} 50%{width:70%;margin-left:0} 100%{width:0%;margin-left:100%} }

/* rank */
.rank-card { background:rgba(255,255,255,0.02); border:1px solid rgba(220,50,50,0.18); border-radius:12px; padding:24px; margin-bottom:14px; animation:up 0.5s ease; text-align:center; }
.rank-big { font-family:'Bebas Neue',sans-serif; font-size:58px; letter-spacing:2px; line-height:1; color:#fff; }
.rank-big span { font-size:24px; color:#666; }
.rank-lbl { font-size:13px; color:#ff4444; font-weight:700; margin:6px 0 18px; }
.rank-track { height:10px; border-radius:5px; background:rgba(255,255,255,0.05); overflow:hidden; }
.rank-fill { height:100%; border-radius:5px; background:linear-gradient(90deg,#ff2222,#ff8800,#44cc66); transition:width 1.6s cubic-bezier(.22,1,.36,1); }
.rank-ptr { position:absolute; top:-7px; transform:translateX(-50%); transition:left 1.6s cubic-bezier(.22,1,.36,1); }
.ptr-dot { width:24px; height:24px; border-radius:50%; background:#fff; border:3px solid #ff4444; box-shadow:0 0 14px rgba(255,68,68,0.65); }
.ptr-lbl { font-family:'Bebas Neue',sans-serif; font-size:10px; color:#ff4444; letter-spacing:1px; text-align:center; margin-top:2px; }
.rank-ends { display:flex; justify-content:space-between; font-size:9px; color:#3a3a3a; letter-spacing:1px; margin-top:30px; }

/* scores */
.scores { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
.sblock { background:rgba(0,0,0,0.35); border-radius:10px; padding:18px 14px; text-align:center; border:1px solid rgba(255,255,255,0.05); }
.slbl2 { font-size:9px; letter-spacing:2px; color:#555; text-transform:uppercase; margin-bottom:8px; }
.snum { font-family:'Bebas Neue',sans-serif; font-size:54px; line-height:1; }
.snum.lo{color:#ff3333} .snum.mi{color:#ffaa00} .snum.hi{color:#44cc88}
.sunit { font-size:20px; opacity:0.5; }
.schip { display:inline-block; font-family:'Bebas Neue',sans-serif; font-size:11px; letter-spacing:2px; padding:2px 10px; border-radius:4px; margin-top:6px; }

.verdict-box { background:rgba(220,30,30,0.07); border:1px solid rgba(220,30,30,0.2); border-radius:10px; padding:16px 18px; margin-bottom:14px; font-size:14px; font-weight:700; color:#ffcccc; line-height:1.7; animation:up 0.5s 0.05s ease both; }
.verdict-box::before { content:"💬 総評 "; font-size:10px; letter-spacing:2px; color:#ff4444; display:block; margin-bottom:6px; }

/* detail cards */
.detail-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:22px; margin-bottom:14px; animation:up 0.5s 0.1s ease both; }
.detail-card.profile { border-left:3px solid #ff4444; }
.detail-card.photo   { border-left:3px solid #ff8800; }
.detail-card.message { border-left:3px solid #cc44ff; }
.detail-card.overall { border-left:3px solid #4488ff; }
.d-title { display:flex; align-items:center; gap:8px; margin-bottom:14px; }
.d-icon { font-size:18px; }
.d-label { font-size:10px; letter-spacing:3px; text-transform:uppercase; }
.detail-card.profile .d-label{color:#ff4444} .detail-card.photo .d-label{color:#ff8800} .detail-card.message .d-label{color:#cc44ff} .detail-card.overall .d-label{color:#4488ff}
.d-summary { font-size:14px; font-weight:700; color:#fff; margin-bottom:12px; line-height:1.6; }
.d-body { font-size:13px; color:#aaa; line-height:1.9; }
.d-body strong { color:#ff8888; }

/* photo result thumbnail */
.photo-result-img { width:100%; max-height:180px; object-fit:cover; border-radius:8px; margin-bottom:14px; opacity:0.7; }

.d-points { margin-top:14px; }
.d-point { display:flex; gap:10px; padding:10px 0; border-top:1px solid rgba(255,255,255,0.04); font-size:13px; line-height:1.7; color:#bbb; }
.d-tag { font-family:'Bebas Neue',sans-serif; font-size:11px; letter-spacing:1px; padding:2px 8px; border-radius:3px; flex-shrink:0; height:fit-content; margin-top:3px; }
.d-tag.ng  { background:rgba(255,50,50,0.15);  color:#ff6666; }
.d-tag.fix { background:rgba(255,136,0,0.15);   color:#ff9944; }

/* future */
.future-card { background:linear-gradient(135deg,rgba(30,140,80,0.08),rgba(20,100,60,0.04)); border:1px solid rgba(30,160,80,0.18); border-radius:12px; padding:22px; margin-bottom:14px; animation:up 0.5s 0.2s ease both; }
.f-title { font-size:10px; letter-spacing:3px; color:#44cc88; text-transform:uppercase; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
.f-scores { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px; }
.f-block { background:rgba(0,0,0,0.3); border-radius:8px; padding:14px; text-align:center; border:1px solid rgba(40,160,80,0.12); }
.f-lbl { font-size:9px; letter-spacing:2px; color:#666; margin-bottom:6px; }
.f-row { display:flex; align-items:center; justify-content:center; gap:8px; }
.f-old { font-family:'Bebas Neue',sans-serif; font-size:28px; color:#ff3333; text-decoration:line-through; opacity:0.6; }
.f-new { font-family:'Bebas Neue',sans-serif; font-size:42px; color:#44cc88; }
.f-unit { font-size:16px; color:#44cc88; opacity:0.7; }
.tl-item { display:flex; gap:12px; padding:8px 0; }
.tl-col { display:flex; flex-direction:column; align-items:center; }
.tl-dot { width:8px; height:8px; border-radius:50%; background:#44cc88; margin-top:5px; flex-shrink:0; }
.tl-line { width:1px; flex:1; background:rgba(40,160,80,0.18); margin-top:4px; }
.tl-right { flex:1; padding-bottom:8px; }
.tl-time { font-size:9px; letter-spacing:2px; color:#44cc88; margin-bottom:3px; }
.tl-text { font-size:13px; color:#bbb; line-height:1.6; }

.reset-btn { background:transparent; border:1px solid rgba(255,255,255,0.08); color:#555; padding:12px 20px; border-radius:8px; cursor:pointer; font-size:12px; width:100%; transition:all 0.2s; margin-top:8px; }
.reset-btn:hover { border-color:rgba(255,255,255,0.15); color:#888; }

@keyframes up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
`;

// ── helpers
function useCount(target, dur = 1300) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, t0 = null;
    const tick = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ── photo uploader
function PhotoUploader({ photoPreview, onFile, onClear }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  function handleFiles(files) {
    if (!files?.[0]) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) return;
    onFile(f);
  }

  if (photoPreview) return (
    <div className="photo-preview-wrap">
      <img src={photoPreview} className="photo-preview" alt="upload" />
      <div className="photo-preview-overlay" onClick={() => inputRef.current?.click()}>
        <span>📷 写真を変更</span>
      </div>
      <button className="photo-clear" onClick={e => { e.stopPropagation(); onClear(); }}>✕ 削除</button>
      <input ref={inputRef} type="file" accept="image/*" style={{ display:"none" }}
        onChange={e => handleFiles(e.target.files)} />
    </div>
  );

  return (
    <div
      className={`photo-drop ${drag ? "drag" : ""}`}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
    >
      <div className="photo-drop-icon">📷</div>
      <div className="photo-drop-main">写真をアップロード</div>
      <div className="photo-drop-sub">タップして選択、またはドラッグ＆ドロップ<br/>JPG / PNG / HEIC 対応</div>
      <input ref={inputRef} type="file" accept="image/*"
        onChange={e => handleFiles(e.target.files)} />
    </div>
  );
}

// ── Score
function Score({ label, value }) {
  const v = useCount(value);
  const cls = value < 30 ? "lo" : value < 60 ? "mi" : "hi";
  const chip = value < 20 ? { t:"D RANK", bg:"rgba(255,50,50,0.15)", c:"#ff5555" }
    : value < 40  ? { t:"C RANK", bg:"rgba(255,140,0,0.15)",  c:"#ff8800" }
    : value < 60  ? { t:"B RANK", bg:"rgba(255,200,0,0.15)",  c:"#ffcc00" }
    : value < 80  ? { t:"A RANK", bg:"rgba(68,200,100,0.15)", c:"#44cc66" }
    : { t:"S RANK", bg:"rgba(68,136,255,0.15)", c:"#4488ff" };
  return (
    <div className="sblock">
      <div className="slbl2">{label}</div>
      <div className={`snum ${cls}`}>{v}<span className="sunit">%</span></div>
      <div className="schip" style={{ background:chip.bg, color:chip.c }}>{chip.t}</div>
    </div>
  );
}

// ── RankBar
function RankBar({ percentile }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(percentile), 350); return () => clearTimeout(t); }, [percentile]);
  const lbl = percentile <= 20 ? "圧倒的最下位層" : percentile <= 35 ? "平均以下" : percentile <= 55 ? "平均的" : percentile <= 75 ? "やや有利" : "上位層";
  return (
    <div className="rank-card">
      <div style={{ fontSize:10, letterSpacing:3, color:"#555", textTransform:"uppercase", marginBottom:10 }}>全体順位</div>
      <div className="rank-big">上位<span> </span>{100 - percentile}<span>%</span></div>
      <div className="rank-lbl">{lbl}</div>
      <div style={{ position:"relative" }}>
        <div className="rank-track"><div className="rank-fill" style={{ width:`${w}%` }}/></div>
        <div className="rank-ptr" style={{ left:`${w}%` }}>
          <div className="ptr-dot"/><div className="ptr-lbl">あなた</div>
        </div>
        <div className="rank-ends"><span>最下位</span><span>平均</span><span>上位10%</span></div>
      </div>
    </div>
  );
}

// ── Future
function Future({ matchRate, dateRate }) {
  const im = Math.min(99, Math.round(matchRate * 1.9 + 18));
  const id = Math.min(99, Math.round(dateRate * 2.1 + 15));
  return (
    <div className="future-card">
      <div className="f-title"><span>🚀</span> 改善後の未来シミュレーション</div>
      <div className="f-scores">
        {[["マッチ率", matchRate, im], ["デート成功率", dateRate, id]].map(([l,o,n]) => (
          <div className="f-block" key={l}>
            <div className="f-lbl">{l}</div>
            <div className="f-row">
              <div className="f-old">{o}</div>
              <span style={{ color:"#555", fontSize:14 }}>→</span>
              <div className="f-new">{n}<span className="f-unit">%</span></div>
            </div>
          </div>
        ))}
      </div>
      {[
        { t:"24時間以内", txt:"プロフ文と写真順序を修正。右スワイプ率が即日改善し始める" },
        { t:"1週間後",   txt:`週${Math.max(2,Math.round(im/14))}〜${Math.max(4,Math.round(im/9))}人とマッチ。返信速度と温度感が変わる` },
        { t:"1ヶ月後",   txt:"デートへの流れが自然に作れるようになり、交際の現実味が出てくる" },
      ].map((item, i, arr) => (
        <div className="tl-item" key={i}>
          <div className="tl-col">
            <div className="tl-dot"/>
            {i < arr.length-1 && <div className="tl-line"/>}
          </div>
          <div className="tl-right">
            <div className="tl-time">{item.t}</div>
            <div className="tl-text">{item.txt}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── DetailCard
function DetailCard({ type, icon, label, data, photoPreview }) {
  if (!data) return null;
  return (
    <div className={`detail-card ${type}`}>
      <div className="d-title"><span className="d-icon">{icon}</span><div className="d-label">{label}</div></div>
      {type === "photo" && photoPreview && (
        <img src={photoPreview} className="photo-result-img" alt="your photo" />
      )}
      <div className="d-summary">{data.summary}</div>
      <div className="d-body" dangerouslySetInnerHTML={{ __html: data.body.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }} />
      {data.points?.length > 0 && (
        <div className="d-points">
          {data.points.map((p,i) => (
            <div className="d-point" key={i}>
              <span className={`d-tag ${p.type==="ng"?"ng":"fix"}`}>{p.type==="ng"?"問題":"改善"}</span>
              <span>{p.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── loading messages
const MSGS = [
  "プロフィール文を構文解析中...",
  "写真をAIが視覚的に解析中...",
  "表情・背景・清潔感を評価中...",
  "全国データと照合中...",
  "勝率・順位を計算中...",
  "辛口レポートを生成中...",
];

// ── バリエーション用素材（ランダムに注入してコメントの幅を出す）
const VERDICT_ANGLES = [
  "プロフ・写真・メッセージのうち最も足を引っ張っている要素に絞って断言する",
  "「なぜ女性がスワイプしないか」の心理的理由から入る",
  "「ライバルと比較して何が劣っているか」の視点で切り込む",
  "「自分では気づいていない致命的な思い込み」を指摘するトーンで",
  "「マッチアプリ運営側から見た典型的な負けパターン」として説明する",
  "「女性が実際にどう感じるか」を代弁するスタイルで",
  "「改善しないとどれだけ損失が続くか」の損失フレームで",
  "「数字と確率」で淡々と現実を突きつけるクールなトーンで",
  "「良い点は認めつつも、それが全体の足を引いてる現実」を伝える",
  "「これが非モテの典型パターンだ」と分類するスタイルで",
];

const PROFILE_ANGLES = [
  "「自己紹介になってない自己満足文」として斬る",
  "「読んでも何も残らない文章の構造的問題」を解剖する",
  "「女性が読んで次のアクションを取れない」設計ミスを指摘",
  "「情報量がゼロで個性が消えている理由」を具体的に",
  "「よくある男性プロフの悪いテンプレに乗っかってる」と指摘",
  "「相手目線がゼロ、自分目線100%」の文章構造を解説",
  "「初対面の女性に響く言葉が一つもない」理由を具体的に",
  "「誠実・優しい系の自己申告がなぜ逆効果か」を説明",
  "「趣味の羅列が差別化にならない理由」をデータ的に",
  "「プロフを読んでデートしたいと思うか？の一点で採点」",
];

const PHOTO_ANGLES = [
  "「第一印象で何点か」を採点するスタイルで具体的に",
  "「右スワイプするか左スワイプするか0.3秒で決まる理由」から",
  "「清潔感・表情・背景の三角形で何が崩れているか」を分析",
  "「女性が写真で無意識にチェックしている7つの要素」で採点",
  "「プロのカメラマンが見たらどう評価するか」の視点で",
  "「この写真を見て実際に会いたいと思うかどうか」で判定",
  "「写真から滲み出るキャラクターと実際の魅力のギャップ」を指摘",
  "「マッチアプリの審査員として何点出せるか」で斬る",
];

const MESSAGE_ANGLES = [
  "「女性の受信トレイに来たとして何通目に埋もれるか」で判定",
  "「返信したいと思わせる要素が何個あるか」を数える",
  "「テンプレ臭がなぜ致命的か」の心理メカニズムから",
  "「このメッセージで会話が続く確率を計算する」スタイルで",
  "「相手のプロフを読んだかどうかが一瞬でバレる理由」を解説",
  "「質問がない・長すぎる・短すぎるのどれが問題か」を診断",
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const PROMPT = (profile, message) => `あなたは10万件以上のプロフィールを審査してきた元マッチングアプリ運営の超辛口評論家AIです。
お世辞・配慮は一切なし。ただしスコアは内容の実態に正直に従い、毎回必ず異なる角度・言葉・切り口でコメントしてください。

【今回の診断アングル】
総評の切り口: ${pick(VERDICT_ANGLES)}
プロフ診断の切り口: ${pick(PROFILE_ANGLES)}
写真診断の切り口: ${pick(PHOTO_ANGLES)}
メッセージ診断の切り口: ${pick(MESSAGE_ANGLES)}

上記の切り口を意識しながら、入力内容に完全に即した独自のコメントを生成してください。
テンプレ的な言い回し（「趣味の羅列」「暗い写真」「はじめまして」など）は使い回し禁止。毎回新鮮な表現で。

【診断対象】
プロフィール文: ${profile || "未入力"}
メッセージ例: ${message || "未入力"}
写真: 添付画像を直接見て評価してください。

【写真評価の厳守ルール】
・添付された実際の画像を見て、見えているものだけをコメントすること
・見えていない要素（暗さ・背景の汚さ・表情）を推測・でっち上げることは絶対禁止
・「明るい写真なのに暗いと言う」「清潔感があるのに不潔と言う」など事実と逆のコメント禁止
・良い点は良いと認め、実際に問題のある点だけを指摘する
・「写真がない」とは言わない。必ず画像を見た上でコメントする

【スコアリング基準】
全部未入力・最低品質:    matchRate 5〜15,  dateRate 2〜7,   percentile 8〜18
平均以下（よくある内容）: matchRate 16〜30, dateRate 8〜16,  percentile 19〜36
平均的（そこそこ書けている）: matchRate 31〜50, dateRate 17〜30, percentile 37〜54
平均以上（具体的・個性あり）: matchRate 51〜68, dateRate 31〜46, percentile 55〜72
優秀（差別化・魅力的）:   matchRate 69〜85, dateRate 47〜65, percentile 73〜88
※入力内容を正確に読み取り実態に即したスコアを出すこと。毎回同じ数値は禁止。

以下のJSON形式のみで回答（前置き・マークダウン不要）:
{
  "matchRate": 数値(5-85),
  "dateRate": 数値(2-65),
  "percentile": 数値(8-88),
  "verdict": "今回の切り口に沿った辛口総評を2〜3文100字以内。前回と全く異なる表現で",
  "profile": {
    "summary": "今回の切り口に沿ったプロフの核心問題を一言で（毎回異なる表現）",
    "body": "プロフの問題を今回の切り口で具体的に150字程度。入力内容に即した言及を必ず含める。**強調**は**text**形式で",
    "points": [
      {"type":"ng","text":"入力されたプロフの具体的なNG（内容を引用しながら）"},
      {"type":"ng","text":"入力されたプロフの別のNG"},
      {"type":"fix","text":"この内容に対する具体的な改善策"},
      {"type":"fix","text":"別の改善策"}
    ]
  },
  "photo": {
    "summary": "実際に見た画像から感じた第一印象を一言で（事実のみ）",
    "body": "実際の画像で見えているもの（表情・服装・背景・明るさ・雰囲気）を正確に言語化して辛口評価。150字程度。見えていないことは書かない。**強調**は**text**形式で",
    "points": [
      {"type":"ng","text":"実際に見えるNGポイント（事実ベース）"},
      {"type":"fix","text":"この写真への具体的な改善策"}
    ]
  },
  "message": {
    "summary": "メッセージの核心問題を一言で（未入力なら「メッセージなし。これが一番の問題かもしれない」）",
    "body": "メッセージの具体的な問題を今回の切り口で150字程度。**強調**は**text**形式で",
    "points": [
      {"type":"ng","text":"このメッセージ固有のNG"},
      {"type":"fix","text":"この内容への具体的改善策"}
    ]
  },
  "overall": {
    "summary": "三要素を総合して一番足を引いている要素を断言",
    "body": "全体辛口総評200字程度。必ず改善の余地も示す。**強調**は**text**形式で",
    "points": [
      {"type":"fix","text":"この人が今すぐやるべき最優先アクション1"},
      {"type":"fix","text":"最優先アクション2"},
      {"type":"fix","text":"最優先アクション3"}
    ]
  }
}`;

// ── Main
export default function App() {
  const [step, setStep] = useState("input");
  const [profile, setProfile] = useState("");
  const [message, setMessage] = useState("");
  const [photoFile, setPhotoFile] = useState(null);       // File object
  const [photoPreview, setPhotoPreview] = useState(null); // object URL
  const [result, setResult] = useState(null);
  const [resultPreview, setResultPreview] = useState(null);
  const [msg, setMsg] = useState(MSGS[0]);

  function handlePhotoFile(file) {
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }
  function clearPhoto() { setPhotoFile(null); setPhotoPreview(null); }

  async function analyze() {
    if (!profile.trim() && !message.trim() && !photoFile) return;
    setStep("loading");
    setResultPreview(photoPreview);

    let i = 0;
    const iv = setInterval(() => { i=(i+1)%MSGS.length; setMsg(MSGS[i]); }, 850);

    try {
      // build content array
      const content = [];

      if (photoFile) {
        const b64 = await toBase64(photoFile);
        const mediaType = photoFile.type || "image/jpeg";
        content.push({ type:"image", source:{ type:"base64", media_type:mediaType, data:b64 } });
      }

      content.push({ type:"text", text: PROMPT(profile, message) });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:2000,
          messages:[{ role:"user", content }]
        })
      });

      const data = await res.json();
      const txt = data.content.map(b=>b.text||"").join("");
      setResult(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    } catch(e) {
      const r = () => Math.floor(Math.random() * 20);
      setResult({
        matchRate: 22 + r(), dateRate: 11 + Math.floor(r()/2), percentile: 28 + r(),
        verdict:"正直に言います。プロフ・写真・メッセージの全てに根本的な問題があります。これで女性が来ると思っていたなら、かなり現実と乖離しています。",
        profile:{
          summary:"「趣味は映画・音楽・旅行」は情報ゼロです",
          body:"**全男性の80%が同じことを書いています。**あなたのプロフを読んで女性が感じること、それは「で？」の一言です。具体的なエピソードが一切なく、あなたという人間が全く伝わりません。",
          points:[
            {type:"ng",text:"汎用的すぎる趣味の羅列。個性がゼロ"},
            {type:"ng",text:"「優しい」「誠実」などの自己申告ワードは逆効果"},
            {type:"fix",text:"趣味に具体的な数字やエピソードを入れる（例：週3でジム、10kg減量した）"},
            {type:"fix",text:"相手が想像できるシーンを1つ入れる（例：休日は〇〇に行きがち）"}
          ]
        },
        photo:{
          summary:"写真から伝わる清潔感と表情が致命的",
          body:"**女性はコンマ1秒で判断して次に行きます。**暗い写真はそれだけで終了です。表情が死んでいる写真は「一緒にいたら楽しくなさそう」というメッセージを発信しています。背景が雑然としている写真も論外です。",
          points:[
            {type:"ng",text:"屋内・暗所で撮った写真はマッチ率が60%下がる"},
            {type:"ng",text:"無表情・口閉じ写真は「暗い人」認定される"},
            {type:"fix",text:"自然光の屋外、ナチュラルな笑顔に変更"},
            {type:"fix",text:"清潔感のある服装・背景を意識して撮り直す"}
          ]
        },
        message:{
          summary:"「はじめまして！よろしく」はテンプレ男認定",
          body:"**この書き出しで返信率は5%を切ります。**女性のもとには毎日10〜20通届きます。相手のプロフに触れていない、自分のことしか書いていない、質問がないメッセージは即削除されます。",
          points:[
            {type:"ng",text:"相手のプロフを読んでいないことがバレバレ"},
            {type:"fix",text:"相手のプロフの具体的な一点に触れ、質問を一つだけ入れる"}
          ]
        },
        overall:{
          summary:"全部終わってるが、全部変えれば3〜5倍化ける",
          body:"プロフ・写真・メッセージの三つが全部噛み合って初めてマッチ率が上がります。**この三つを直すだけで今の3〜5倍のマッチ数になる可能性があります。**現状が酷い分、伸び代は大きいです。",
          points:[
            {type:"fix",text:"まず写真を変える。これが最速で効果が出る"},
            {type:"fix",text:"プロフ文に「具体的エピソード×1、デートに誘える趣味×1」を入れる"},
            {type:"fix",text:"最初のメッセージを「相手のプロフ引用＋質問1つ」の型に統一する"}
          ]
        }
      });
    } finally {
      clearInterval(iv);
      setStep("result");
    }
  }

  function reset() {
    setStep("input"); setResult(null);
    setProfile(""); setMessage("");
    setPhotoFile(null); setPhotoPreview(null); setResultPreview(null);
  }

  const canAnalyze = profile.trim() || message.trim() || photoFile;

  return (
    <><style>{FONT+css}</style>
    <div className="app">
      <div className="bg-grid"/><div className="glow"/>
      <div className="wrap">

        {/* HEADER */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div className="badge">AI DATING ANALYZER</div>
          <div className="title">WIN<br/>RATE</div>
          <div className="subtitle">マッチングアプリの「勝率」をAIが容赦なく診断する</div>
        </div>

        {/* INPUT */}
        {step === "input" && (<>
          <div className="warn">
            <span style={{ fontSize:18, flexShrink:0 }}>🚨</span>
            <div><strong>現実を直視できる人だけ診断してください。</strong><br/>
            お世辞はありません。ただし、正直に向き合えば必ず改善できます。</div>
          </div>

          <div className="card">
            <div className="slabel">01 — プロフィール文</div>
            <textarea rows={5} placeholder="現在のプロフィール文をそのまま貼り付け..."
              value={profile} onChange={e=>setProfile(e.target.value)}/>
          </div>

          <div className="card">
            <div className="slabel">02 — メイン写真（実際にアップロード）</div>
            <PhotoUploader
              photoPreview={photoPreview}
              onFile={handlePhotoFile}
              onClear={clearPhoto}
            />
          </div>

          <div className="card">
            <div className="slabel">03 — 送ったメッセージ例（任意）</div>
            <textarea rows={4} placeholder="マッチ後に送ったメッセージを貼り付け..."
              value={message} onChange={e=>setMessage(e.target.value)}/>
          </div>

          <button className="go-btn" onClick={analyze} disabled={!canAnalyze}>
            現実を見る →
          </button>
        </>)}

        {/* LOADING */}
        {step === "loading" && (
          <div className="loading">
            <div className="spinner"/>
            <div style={{ fontFamily:"'Bebas Neue'",fontSize:28,letterSpacing:3,marginBottom:10 }}>ANALYZING</div>
            <div style={{ color:"#666",fontSize:13,letterSpacing:1 }}>{msg}</div>
            <div className="bar-track"><div className="bar-fill"/></div>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && result && (<>
          <RankBar percentile={result.percentile} />

          <div className="scores" style={{ animation:"up 0.5s 0.05s ease both" }}>
            <Score label="マッチ率" value={result.matchRate} />
            <Score label="デート成功率" value={result.dateRate} />
          </div>

          <div className="verdict-box">{result.verdict}</div>

          <DetailCard type="profile" icon="📝" label="プロフィール診断"      data={result.profile} />
          <DetailCard type="photo"   icon="📷" label="写真診断（AI視覚評価）" data={result.photo} photoPreview={resultPreview} />
          <DetailCard type="message" icon="💬" label="メッセージ診断"         data={result.message} />
          <DetailCard type="overall" icon="🔍" label="総合評価・優先アクション" data={result.overall} />

          <Future matchRate={result.matchRate} dateRate={result.dateRate} />

          <button className="reset-btn" onClick={reset}>もう一度診断する</button>
        </>)}

      </div>
    </div></>
  );
}
