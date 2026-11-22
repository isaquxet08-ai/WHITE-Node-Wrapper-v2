// WHITE: the connector (the hook). Built from src/world/ by tools/world.mjs: edit the source, not this file.
(()=>{var A=Math.PI/180,x=(n,t,e)=>n<t?t:n>e?e:n,w=(n,t,e)=>n+(t-n)*e,Y=(n,t,e)=>{let s=x((e-n)/(t-n||1e-9),0,1);return s*s*(3-2*s)},Ct=n=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2;var q=(n,t)=>[n[0]+t[0],n[1]+t[1],n[2]+t[2]],X=(n,t)=>[n[0]-t[0],n[1]-t[1],n[2]-t[2]],F=(n,t)=>[n[0]*t,n[1]*t,n[2]*t],st=(n,t,e)=>[n[0]+t[0]*e,n[1]+t[1]*e,n[2]+t[2]*e],K=(n,t)=>n[0]*t[0]+n[1]*t[1]+n[2]*t[2],vt=(n,t)=>[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]],ot=n=>Math.hypot(n[0],n[1],n[2]);var D=(n,t=[0,1,0])=>{let e=ot(n);return e>1e-9?[n[0]/e,n[1]/e,n[2]/e]:t.slice()},Yt=(n,t,e)=>[n[0]+(t[0]-n[0])*e,n[1]+(t[1]-n[1])*e,n[2]+(t[2]-n[2])*e];function kt(n,t,e){let s=Yt(n,t,e);if(ot(s)>1e-4)return D(s);let i=D(vt(n,Math.abs(n[1])<.9?[0,1,0]:[1,0,0]));return D(Yt(e<.5?n:t,i,e<.5?2*e:2-2*e))}var oe=()=>[0,0,0,1];function Pt(n,t){let e=Math.sin(t/2),s=D(n);return[s[0]*e,s[1]*e,s[2]*e,Math.cos(t/2)]}function Tt(n,t){return[n[3]*t[0]+n[0]*t[3]+n[1]*t[2]-n[2]*t[1],n[3]*t[1]-n[0]*t[2]+n[1]*t[3]+n[2]*t[0],n[3]*t[2]+n[0]*t[1]-n[1]*t[0]+n[2]*t[3],n[3]*t[3]-n[0]*t[0]-n[1]*t[1]-n[2]*t[2]]}function V(n,t){let[e,s,i,o]=n,a=o*t[0]+s*t[2]-i*t[1],r=o*t[1]+i*t[0]-e*t[2],h=o*t[2]+e*t[1]-s*t[0],l=-e*t[0]-s*t[1]-i*t[2];return[a*o+l*-e+r*-i-h*-s,r*o+l*-s+h*-e-a*-i,h*o+l*-i+a*-s-r*-e]}var ze=n=>[-n[0],-n[1],-n[2],n[3]];function zs(n){let t=Math.hypot(n[0],n[1],n[2],n[3])||1;return[n[0]/t,n[1]/t,n[2]/t,n[3]/t]}function Qe(n,t,e){let s=n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3],i=t;if(s<0&&(s=-s,i=[-t[0],-t[1],-t[2],-t[3]]),s>.9995)return zs([w(n[0],i[0],e),w(n[1],i[1],e),w(n[2],i[2],e),w(n[3],i[3],e)]);let o=Math.acos(s),a=Math.sin(o),r=Math.sin((1-e)*o)/a,h=Math.sin(e*o)/a;return[n[0]*r+i[0]*h,n[1]*r+i[1]*h,n[2]*r+i[2]*h,n[3]*r+i[3]*h]}function qt(n,t=0,e=0){return Tt(Tt(Pt([0,1,0],n),Pt([1,0,0],-t)),Pt([0,0,1],e))}function Es(n,t=[0,1,0]){let e=D(n,[0,0,1]),s=vt(t,e);ot(s)<1e-5&&(s=vt([0,0,1],e)),ot(s)<1e-5&&(s=[1,0,0]),s=D(s,[1,0,0]);let i=vt(e,s);return{x:s,y:i,z:e}}var $e=n=>({x:V(n,[1,0,0]),y:V(n,[0,1,0]),z:V(n,[0,0,1])});function ae(n,t,e,s,i,o=0,a=[0,1,0]){let r=Es(X(t,n),a);if(o){let h=Math.cos(o),l=Math.sin(o);r={x:q(F(r.x,h),F(r.y,l)),y:q(F(r.y,h),F(r.x,-l)),z:r.z}}return{pos:n.slice(),b:r,fov:e,W:s,H:i,f:i/2/Math.tan(e/2)}}function Jt(n,t){let e=X(t,n.pos),s=K(e,n.b.z),i=n.f/(Math.abs(s)<1e-6?1e-6:s);return[n.W/2-K(e,n.b.x)*i,n.H/2+K(e,n.b.y)*i,s]}var nt=class{constructor(t,e=4,s=1){this.x=Array.isArray(t)?t.slice():t,this.v=Array.isArray(t)?t.map(()=>0):0,this.hz=e,this.damp=s}step(t,e){let s=2*Math.PI*this.hz,i=this.damp,o=Math.max(1,Math.ceil(e*this.hz*12)),a=e/o;if(Array.isArray(this.x))for(let r=0;r<o;r++)for(let h=0;h<this.x.length;h++){let l=-s*s*(this.x[h]-t[h])-2*i*s*this.v[h];this.v[h]+=l*a,this.x[h]+=this.v[h]*a}else for(let r=0;r<o;r++){let h=-s*s*(this.x-t)-2*i*s*this.v;this.v+=h*a,this.x+=this.v*a}return this.x}set(t){Array.isArray(this.x)?(this.x=t.slice(),this.v=t.map(()=>0)):(this.x=t,this.v=0)}};function Vt(n){let t=(n|0)*374761393+668265263;return t=(t^t>>>13)*1274126177,((t^t>>>16)>>>0)/4294967296}function dt(n,t=0){let e=Math.floor(n),s=n-e,i=s*s*(3-2*s);return w(Vt(e+t*7919),Vt(e+1+t*7919),i)*2-1}var Ee={head:.26,neck:.765,spine:[.455,.515,.475],clav:.538,clavDrop:.2,chestW:.495,waistW:.475,arm:.85,fore:.82,palm:.3,palmW:.37,finger:.36,thumb:.35,pelvis:.24,pelvisDrop:.05,thigh:1.78,shin:1.72,foot:.4,stance:1.28,hang:8,r:{neck:.15,roof:.2,chest:.31,waist:.285,hips:.27,side:.22,shoulder:.138,elbow:.138,wrist:.138,hipJoint:.21,knee:.21,ankle:.21,toe:.145,knuckle:.058,tip:.042,thumb:.064}},Ke=[{x:1.5,k:.96,l:.92,fan:.17,r:1},{x:.5,k:1,l:1,fan:.045,r:1},{x:-.5,k:.96,l:.93,fan:-.085,r:.95},{x:-1.5,k:.87,l:.76,fan:-.23,r:.86}],Gt=[["L",1],["R",-1]];function ts(n,t,e,s,i){let o=X(t,n),a=ot(o),r=x(a,Math.abs(e-s)+1e-4,(e+s)*.9995),h=a>1e-6?F(o,1/a):[0,-1,0],l=(e*e-s*s+r*r)/(2*r),c=Math.sqrt(Math.max(0,e*e-l*l)),u=X(i,F(h,K(i,h)));return ot(u)<1e-4&&(u=vt(h,[1,0,0]),ot(u)<1e-4&&(u=vt(h,[0,0,1]))),u=D(u),{M:q(st(n,h,l),F(u,c)),E:st(n,h,r)}}var ne=class{constructor(t=Ee){this.setBody(t),this.J={},this.headQ=oe(),this.chestQ=oe(),this.hipQ=oe(),this.palm={L:[1,0,0],R:[-1,0,0]},this.pose({})}setBody(t){this.body=t;let e=t.head,s=o=>o*e,i=this.B={D:e,R:e/2};for(let o of["neck","clav","clavDrop","chestW","waistW","arm","fore","palm","palmW","finger","thumb","pelvis","pelvisDrop","thigh","shin","foot"])i[o]=s(t[o]);i.spine=t.spine.map(s),i.stance=t.stance??1.28,i.hang=(t.hang??8)*A,i.r={};for(let o in t.r)i.r[o]=s(t.r[o]);i.ankle=i.r.ankle,i.footLen=Math.hypot(i.foot,i.ankle-i.r.toe),i.clavLen=Math.hypot(i.clav,i.clavDrop),i.pelLen=Math.hypot(i.pelvis,i.pelvisDrop),i.leg=i.thigh+i.shin,i.hipH=i.ankle+i.leg*.992+i.pelvisDrop,i.height=i.hipH+i.spine[0]+i.spine[1]+i.spine[2]+i.neck+i.R}get height(){return this.B.height}pose(t={}){let e=this.B,s=this.J,i=t.pos||[0,0,0],o=t.yaw||0,a=t.hip||{},r=t.spine||{},h=qt(o,0,0),l=this.hipQ=Tt(h,qt(a.yaw||0,-(a.pitch||0),a.roll||0)),c=e.hipH*(a.h??1)+(a.dy||0);s.hip=q(i,q(V(h,[a.dx||0,0,a.dz||0]),[0,c,0]));let u=r.bend||0,m=r.side||0,g=r.twist||0,d=l,z=s.hip,v=["waist","chest","neck"];for(let f=0;f<3;f++)d=Tt(d,qt(g/3,-u/3,-m/3)),z=q(z,V(d,[0,e.spine[f],0])),s[v[f]]=z;let b=this.chestQ=d,k={yaw:0,pitch:0,roll:0,...t.head||{}},_=Tt(b,qt(k.yaw,k.pitch,k.roll));if(t.lookAt&&(t.look??1)>0){let f=q(s.neck,V(b,[0,e.neck,0])),y=V([-b[0],-b[1],-b[2],b[3]],X(t.lookAt,f)),p=x(Math.atan2(y[0],y[2]),-80*A,80*A),M=x(Math.atan2(y[1],Math.hypot(y[0],y[2])),-50*A,55*A),P=x(t.look??1,0,1);_=Tt(b,qt(k.yaw+p*P,k.pitch+M*P,k.roll))}let E=Qe(b,_,.35);s.head=q(s.neck,V(E,[0,e.neck,0])),this.headQ=_;let R=t.shrug||0;for(let[f,y]of Gt){let p=t["arm"+f]||{},M=q(s.neck,V(b,[y*e.clav,-e.clavDrop*(1-1.6*R)+(p.up||0),p.fwd||0])),P,T,B=e.arm,N=e.fore,C=()=>{if(p.world||p.hand){let et=p.world||q(M,V(b,p.hand)),ut=p.pole?p.poleWorld?p.pole:V(b,p.pole):V(b,[y*.5,-.6,-.8]),tt=ts(M,et,B,N,ut);P=tt.M,T=tt.E}else{let et=p.raise??e.hang,ut=p.azim??82*A,tt=p.bend??12*A,at=p.twist??0,Z=[y*Math.sin(et)*Math.sin(ut),-Math.cos(et),Math.sin(et)*Math.cos(ut)],U=[0,0,1];U=X(U,F(Z,K(U,Z))),ot(U)<.001&&(U=[0,1,0]),U=V(Pt(Z,-y*at),D(U));let H=D(q(F(Z,Math.cos(tt)),F(U,Math.sin(tt))));P=q(M,V(b,F(Z,B))),T=q(P,V(b,F(H,N)))}};C();let G=V(b,[0,1,0]),W=Math.max(0,K(D(X(P,M)),G));W>.02&&(M=q(M,V(b,[-y*.06*e.D*W,.17*e.D*W,0])),C()),s["sh"+f]=M,s["el"+f]=P,s["wr"+f]=T;let j=D(X(T,P)),Q=p.palm?p.palmWorld?p.palm:V(b,p.palm):V(b,[-y,0,.25]),I=X(Q,F(j,K(Q,j)));I=ot(I)>.001?D(I):D(vt(j,[0,1,0]),[1,0,0]);let J=p.wrist||0,$=D(q(F(j,Math.cos(J)),F(I,Math.sin(J)))),rt=p.hdir?x(p.hdirW??1,0,1):0;if(rt>0){let et=D(p.hdirWorld?p.hdir:V(b,p.hdir),j),ut=K(et,j),tt=72*A;if(ut<Math.cos(tt)){let Z=X(et,F(j,ut)),U=ot(Z);et=U>1e-4?D(q(F(j,Math.cos(tt)),F(Z,Math.sin(tt)/U))):j}$=D(q(F($,1-rt),F(et,rt)),j);let at=q(F(I,1-rt),F(D(Q,I),rt));ot(X(at,F($,K(at,$))))>.001&&(I=at)}let mt=D(X(I,F($,K(I,$))),I);this._hand(f,y,$,mt,p)}for(let[f,y]of Gt){let p=t["leg"+f]||{},M=s["hj"+f]=q(s.hip,V(l,[y*e.pelvis,-e.pelvisDrop,0])),P;if(p.foot)P=p.foot.slice();else{let I=p.off||[0,0,0];P=q(i,V(h,[y*e.pelvis*e.stance+I[0],I[1],I[2]]))}let T=D(p.toe?p.toe:V(h,[y*.16,0,1])),B=p.lift||0,N,C;if(p.ankle)N=p.ankle,C=-(p.pitch||0);else{let I=st(P,T,e.foot*.62);N=B?q(I,q(F(T,-e.foot*.62*Math.cos(B)),[0,e.ankle+e.foot*.62*Math.sin(B),0])):q(P,[0,e.ankle,0]),C=B}let G=V(h,p.knee||[y*.12,0,1]),W=ts(M,N,e.thigh,e.shin,G);s["kne"+f]=W.M,s["an"+f]=W.E;let j=C?D(q(F(T,Math.cos(C)),[0,-Math.sin(C),0])):T,Q=C?D(q(F(T,-Math.sin(C)),[0,-Math.cos(C),0])):[0,-1,0];s["to"+f]=q(st(W.E,j,e.foot),F(Q,e.ankle-e.r.toe))}return this._trunk()}_trunk(){let t=this.J,e=this.B,s=D(X(t.shL,t.shR),[1,0,0]),i=D(q(s,D(X(t.hjL,t.hjR),[1,0,0])),s),o=Yt(t.chest,t.neck,.26);for(let[a,r]of Gt)t["ap"+a]=st(o,s,r*(e.chestW-e.r.side)),t["ws"+a]=st(t.waist,i,r*(e.waistW-e.r.side));return this}_hand(t,e,s,i,o={}){let a=this.B,r=this.J,h=r["wr"+t],l=F(vt(i,s),e),c=x(o.curl??.22,0,1),u=x(o.spread??.55,0,1.6),m=(a.palmW-2*a.r.knuckle)/3;for(let b=0;b<4;b++){let k=Ke[b],_=x(o.fingers?o.fingers[b]:c+.06*b*(1-c)*Math.min(1,c*6),0,1),E=q(st(h,s,a.palm*k.k),F(l,k.x*m)),R=k.fan*u*(1-.85*_),f=D(q(F(s,Math.cos(R)),F(l,Math.sin(R)))),y=_*1.45,p=y+_*1.6,M=a.finger*k.l,P=st(E,q(F(f,Math.cos(y)),F(i,Math.sin(y))),M*.54);r["k"+b+t]=E,r["m"+b+t]=P,r["f"+b+t]=st(P,q(F(f,Math.cos(p)),F(i,Math.sin(p))),M*.46)}let g=x(o.thumb??c,0,1),d=(b,k,_)=>D(q(q(F(l,b),F(s,k)),F(i,_))),z=q(st(h,s,a.palm*.2),F(l,.5*a.palmW-1.2*a.r.thumb)),v=st(z,kt(d(.84,.52,.16),d(.3,.72,.62),g),a.thumb*.5);r["t0"+t]=z,r["t1"+t]=v,r["t2"+t]=st(v,kt(d(.45,.87,.2),d(-.55,.5,.67),g),a.thumb*.5),r["kn"+t]=Yt(r["k1"+t],r["k2"+t],.5),r["ti"+t]=r["f1"+t],this.palm[t]=i}fromDirs(t,e,s){let i=this.B,o=this.J,a=(l,c)=>e[l]?D(e[l]):c,r=(l,c,u)=>o[l]&&o[c]?D(X(o[c],o[l]),u):u;o.hip=t.slice();let h=(l,c,u,m,g)=>{o[c]=st(o[l],a(u,r(l,c,g)),m)};h("hip","waist","spine1",i.spine[0],[0,1,0]),h("waist","chest","spine2",i.spine[1],[0,1,0]),h("chest","neck","spine3",i.spine[2],[0,1,0]),h("neck","head","neck",i.neck,[0,1,0]);for(let[l,c]of Gt){h("neck","sh"+l,"clav"+l,i.clavLen,[c,-.3,0]),h("sh"+l,"el"+l,"arm"+l,i.arm,[0,-1,0]),h("el"+l,"wr"+l,"fore"+l,i.fore,[0,-1,0]);let u=a("hand"+l,r("wr"+l,"kn"+l,[0,-1,0])),m=e["palm"+l]?D(e["palm"+l]):this.palm[l];m=D(X(m,F(u,K(m,u))),[1,0,0]),this._hand(l,c,u,m,{curl:typeof e["curl"+l]=="number"?e["curl"+l]:.25}),h("hip","hj"+l,"pel"+l,i.pelLen,[c,-.2,0]),h("hj"+l,"kne"+l,"thigh"+l,i.thigh,[0,-1,0]),h("kne"+l,"an"+l,"shin"+l,i.shin,[0,-1,0]),o["to"+l]=st(o["an"+l],a("foot"+l,r("an"+l,"to"+l,[0,-.2,1])),i.footLen)}return s&&(this.headQ=s),this._trunk()}bones(){let t=this.J,e={};for(let[s,i,o]of Ss)e[s]=D(X(t[o],t[i]));return e}pieces(){let t=this.J,e=this.B.r,s=[],i=(o,a,r,h,l,c=1,u=1,m=0)=>s.push([t[o],t[a],r,h,l,m,c,u]);i("hip","waist",e.hips,e.waist,0),i("waist","chest",e.waist,e.chest,0),i("chest","neck",e.chest,e.roof,0),i("hjL","hjR",e.hipJoint,e.hipJoint,0);for(let[o]of Gt)i("neck","sh"+o,e.roof,e.shoulder,0),i("ap"+o,"ws"+o,e.side,e.side,0),i("ws"+o,"hj"+o,e.side,e.hipJoint,0);i("neck","head",e.neck,e.neck,0,1,1,2);for(let[o,a]of Gt){let r=a>0?1:2;i("sh"+o,"el"+o,e.shoulder,e.elbow,r,-.3,1.5),i("el"+o,"wr"+o,e.elbow,e.wrist,r);for(let l=0;l<4;l++){let c=Ke[l].r;i("wr"+o,"k"+l+o,e.wrist*.9,e.knuckle*c,r,1,1,1),i("k"+l+o,"m"+l+o,e.knuckle*c,.5*(e.knuckle+e.tip)*c,r,1,1,1),i("m"+l+o,"f"+l+o,.5*(e.knuckle+e.tip)*c,e.tip*c,r,1,1,1)}i("t0"+o,"t1"+o,e.thumb*1.12,e.thumb*.92,r,1,1,1),i("t1"+o,"t2"+o,e.thumb*.92,e.tip*1.08,r,1,1,1);let h=a>0?3:4;i("hj"+o,"kne"+o,e.hipJoint,e.knee,h,-.35,1.35),i("kne"+o,"an"+o,e.knee,e.ankle,h),i("an"+o,"to"+o,e.ankle,e.toe,h)}return s}snapshot(){let t={};for(let e in this.J)t[e]=this.J[e].slice();return{J:t,headQ:this.headQ.slice(),chestQ:this.chestQ.slice(),palm:{L:this.palm.L.slice(),R:this.palm.R.slice()}}}};var Ss=[["spine1","hip","waist"],["spine2","waist","chest"],["spine3","chest","neck"],["neck","neck","head"],["clavL","neck","shL"],["armL","shL","elL"],["foreL","elL","wrL"],["handL","wrL","knL"],["fingL","knL","tiL"],["clavR","neck","shR"],["armR","shR","elR"],["foreR","elR","wrR"],["handR","wrR","knR"],["fingR","knR","tiR"],["pelL","hip","hjL"],["thighL","hjL","kneL"],["shinL","kneL","anL"],["footL","anL","toL"],["pelR","hip","hjR"],["thighR","hjR","kneR"],["shinR","kneR","anR"],["footR","anR","toR"]];var es=`#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`,Ps=`
float cro(vec2 a, vec2 b) { return a.x * b.y - a.y * b.x; }
float sdUC(vec2 p, vec2 pa, vec2 pb, float ra, float rb) {
  p -= pa; pb -= pa;
  float h = dot(pb, pb);
  if (h < 1e-4) return length(p) - max(ra, rb);
  vec2 q = vec2(dot(p, vec2(pb.y, -pb.x)), dot(p, pb)) / h;
  q.x = abs(q.x);
  float b = ra - rb;
  // (one end inside the other, a piece seen end on: it is a disc)
  if (h <= b * b) return ra > rb ? length(p) - ra : length(p - pb) - rb;
  vec2 c = vec2(sqrt(h - b * b), b);
  float k = cro(c, q), m = dot(c, q), n = dot(q, q);
  if (k < 0.0) return sqrt(h * n) - ra;
  if (k > c.x) return sqrt(h * (n + 1.0 - 2.0 * q.y)) - rb;
  return m - ra;
}`,ss=`
uniform vec4 uA[MAXC];    // each piece: its ends a, b (pixels, y up)
uniform vec4 uB[MAXC];    //   radius at a, at b (pixels); 1 / distance at a, at b (1 / metres)
uniform vec4 uC[MAXC];    //   group; 1: part of a hand, 2: the neck; how much shadow it casts and takes at a, at b
uniform int uN;
uniform vec4 uHead;       // the head: middle (px), radius (px), distance of its middle (m)
uniform vec4 uFil;        // inner corners are rounded, radius (px): his neck into his shoulders; inside a bent elbow or knee (and the
                          //   instep); where an arm or a leg comes out of the trunk; his neck into his head
uniform vec4 uFilA;       // which corners: how open one must be for the rounding to start, and to be full (1 + the cosine between the
                          //   two surfaces' ways out: 0 = the two sides of a thin gap, 1 = a right angle); how near where the arm or
                          //   leg comes out of the trunk, in its thicknesses there: full within this, none beyond this
uniform vec2 uFilB;       //   ...and how flat a corner may be: the rounding starts to go here, is gone here (2 = no corner at all: one
                          //   surface going on into the next, which must not be touched, or a joint would swell)
uniform vec4 uRoot[NG];   // where each arm and leg comes out of the trunk: the place (px), its radius there (px), 1 (0: not on the picture)
${Ps}
// Two parts joined, with the inner corner between them rounded (radius r): something is added only where
// both are near and the point is outside both. (Where one surface simply goes on into the next, that would
// swell it by 0.29 r: so r comes through open(), which is 0 there. A smooth-min swells every joint: never
// use one here.)
float rmin(float a, float b, float r) {
  if (r <= 0.0) return min(a, b);
  vec2 u = max(vec2(r - a, r - b), vec2(0.0));
  return max(r, min(a, b)) - length(u);
}
// How much of a corner there is between two surfaces, from the ways out of each: 1 = an open inner corner, rounded
// in full. 0 = the two sides of a thin gap (left as it is), and also 0 = no corner: one surface going straight on
// into the next (a straight elbow, the hip into the thigh), where rounding would only swell the joint.
float open(vec2 a, vec2 b) {
  float t = 1.0 + dot(a, b);
  return smoothstep(uFilA.x, uFilA.y, t) * (1.0 - smoothstep(uFilB.x, uFilB.y, t));
}
// Each group of pieces at p (the trunk, each arm, each leg): how far away its outline is (D; below 0:
// inside), how far from the eye it is there (Z, m), how much shadow it casts and takes (Wt), whether
// it is a hand there (Hd), and the way out of its nearest piece (G). pad: pieces further from p than
// this (px) are left out.
void groups(vec2 p, float pad, out float D[NG], out float Z[NG], out float Wt[NG], out float Hd[NG], out vec2 G[NG]) {
  float M[NG];
  for (int g = 0; g < NG; g++) { D[g] = 1e6; M[g] = 1e6; Z[g] = 1e6; Wt[g] = 1.0; Hd[g] = 0.0; G[g] = vec2(0.0); }
  float Dn = 1e6; vec2 Gn = vec2(0.0);            // the neck, by itself
  for (int i = 0; i < MAXC; i++) {
    if (i >= uN) break;
    vec4 A = uA[i], B = uB[i];
    // (a piece that is nowhere near this pixel)
    vec2 hv = 0.5 * (A.zw - A.xy), dm = p - A.xy - hv;
    float rb = length(hv) + max(B.x, B.y) + pad;
    if (dot(dm, dm) > rb * rb) continue;
    float d = sdUC(p, A.xy, A.zw, B.x, B.y);
    vec2 ba = A.zw - A.xy;
    float h = clamp(dot(p - A.xy, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
    float z = 1.0 / mix(B.z, B.w, h);
    vec4 C = uC[i];
    float wt = clamp(mix(C.z, C.w, h), 0.0, 1.0);
    int g = int(C.x + 0.5);
    float hnd = (C.y > 0.5 && C.y < 1.5) ? 1.0 : 0.0;
    // the way out of this piece here: away from its middle line
    vec2 gi = p - A.xy - ba * h;
    float gl = length(gi);
    gi = gl > 1e-3 ? gi / gl : vec2(0.0);
    // the group's distance here: of its nearest piece, or of the nearest to the eye where two cover
    float dg = g == 0 ? min(D[0], Dn) : D[g];
    if (d < 0.0 && dg < 0.0) { if (z < Z[g]) { Z[g] = z; Wt[g] = wt; Hd[g] = hnd; } }
    else if (d < dg) { Z[g] = z; Wt[g] = wt; Hd[g] = hnd; }
    if (C.y > 1.5) { Dn = d; Gn = gi; continue; }
    // (the trunk's own pieces are joined as they are, and so are a hand's: its fingers must stay apart.
    // Inside an arm or a leg, the inside of the bend is rounded.)
    D[g] = rmin(D[g], d, (g == 0 || hnd > 0.5) ? 0.0 : uFil.y * open(G[g], gi));
    if (d < M[g]) { M[g] = d; G[g] = gi; }
  }
  // the neck: rounded into the head (only outside the head: the engine draws that), then into the shoulders
  if (Dn < 1e5) {
    if (uHead.z > 0.0 && uFil.w > 0.0) {
      vec2 hp = p - uHead.xy;
      float hl = length(hp), hd = hl - uHead.z;
      float r = uFil.w * open(Gn, hp / max(hl, 1e-3));
      Dn = min(Dn, max(max(rmin(Dn, hd, r), -hd - 0.12 * uHead.z), Dn - r));
    }
    float d0 = rmin(D[0], Dn, uFil.x * open(G[0], Gn));
    if (Dn < M[0]) G[0] = Gn;
    D[0] = d0;
  }
}
// All of him: each group moved by w (his outline's wobble), then each arm and leg rounded into the rest
// near where it comes out of the trunk. Gives how far p is from his whole outline (without his head).
float joined(vec2 p, float w, inout float D[NG], vec2 G[NG]) {
  D[0] += w;
  float U = D[0]; vec2 GU = G[0];
  for (int g = 1; g < NG; g++) {
    D[g] += w;
    vec4 R = uRoot[g];
    float nearRoot = R.w > 0.5 ? 1.0 - smoothstep(uFilA.z * R.z, uFilA.w * R.z + 1e-3, length(p - R.xy)) : 0.0;
    float u2 = rmin(U, D[g], uFil.z * nearRoot * open(GU, G[g]));
    if (D[g] < U) GU = G[g];
    U = u2;
  }
  return U;
}`,is=`#version 300 es
precision highp float;
#define MAXC 56
#define NG 5
uniform vec3 uCol;
uniform vec4 uShade;      // edge shadow: darkness, depth (px); a part in front of another: its shadow's darkness, reach (px)
uniform vec4 uHead2;      // the head: radius (m), pass (0 behind the head, 1 in front of it, 2 in front: cover only), its shadow's darkness, reach (px)
uniform vec4 uWob;        // wobble: size (px), wavelength (px), time, seed
uniform vec4 uSep;        // two parts this far apart in depth (m): shadow starts, is full; how far in front an arm or leg counts (m); -
uniform vec2 uOrg;        // a point that moves with him (px): the wobble sticks to him, not the screen
uniform float uPad;       // how far from a piece anything of it can show (px)
uniform float uHand;      // a hand's shadow on what is behind it: darkness
uniform float uAlpha;
out vec4 o;

float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
float wobble(vec2 p) {
  if (uWob.x <= 0.0) return 0.0;
  vec3 q = vec3((p - uOrg) / uWob.y + uWob.w, uWob.z);
  return uWob.x * (2.0 * (0.65 * vnoise(q) + 0.35 * vnoise(q * 2.03 + 7.1)) - 1.0);
}
${ss}
// a shadow's shape: full at the edge that throws it, gone at reach
float soft(float d, float reach) { float k = 1.0 - clamp(d / reach, 0.0, 1.0); return k * k * (3.0 - 2.0 * k); }

void main() {
  vec2 p = gl_FragCoord.xy;
  float D[NG]; float Z[NG]; float Wt[NG]; float Hd[NG]; vec2 G[NG];
  groups(p, uPad, D, Z, Wt, Hd, G);
  float U = joined(p, wobble(p), D, G);
  for (int g = 1; g < NG; g++) Z[g] -= uSep.z;
  vec2 hp = p - uHead.xy;
  float hd = length(hp) - uHead.z;                 // the head's edge (px)
  bool front = uHead2.y > 0.5;
  // the head's surface here, in metres from the eye (where the head is)
  float hz = 1e6;
  if (hd < 0.0) {
    float rho = length(hp) / max(uHead.z, 1.0) * uHead2.x;
    hz = uHead.w - sqrt(max(uHead2.x * uHead2.x - rho * rho, 0.0));
  }

  if (front) {
    // only what is nearer than the head, over the head (and its soft shadow on the head)
    if (hd > 1.0) { o = vec4(0.0); return; }
    float Df = 1e6;
    float shadow = 0.0;
    for (int g = 1; g < NG; g++) {
      if (Z[g] >= hz) continue;               // (not nearer than the head here)
      Df = min(Df, D[g]);
      shadow = max(shadow, Wt[g] * mix(uShade.z, uHand, Hd[g]) * soft(D[g], uShade.w));
    }
    float cov = clamp(0.5 - Df, 0.0, 1.0);
    float inHead = clamp(0.5 - hd, 0.0, 1.0);
    // (pass 2: only where it covers the head, to cut that out of the engine's picture of his pupils)
    if (uHead2.y > 1.5) { o = vec4(0.0, 0.0, 0.0, cov * inHead * uAlpha); return; }
    float sh = uShade.x * (1.0 - smoothstep(0.0, uShade.y, -Df));
    vec3 col = uCol * (1.0 - clamp(sh, 0.0, 0.9));
    float a = cov;
    vec3 c = col * cov;
    a += (1.0 - a) * shadow * step(0.0, Df);
    o = vec4(c, a) * inHead * uAlpha;
    return;
  }

  float cov = clamp(0.5 - U, 0.0, 1.0);
  if (cov <= 0.0) { o = vec4(0.0); return; }
  // the part in front here
  int f = -1; float zf = 1e6;
  for (int g = 0; g < NG; g++) if (D[g] < 0.5 && Z[g] < zf) { zf = Z[g]; f = g; }
  float sh = uShade.x * (1.0 - smoothstep(0.0, uShade.y, -U));
  if (f >= 0) {
    float wf = Wt[f];
    for (int g = 0; g < NG; g++) {
      if (g == f || D[g] < 0.5) continue;
      // a part nearer than this one, just beside this pixel: its soft shadow falls here
      float sep = wf * Wt[g] * smoothstep(uSep.x, uSep.y, zf - Z[g]);
      sh = max(sh, sep * mix(uShade.z, uHand, Hd[g]) * soft(D[g], uShade.w));
    }
    // the head's shadow, on what is well behind it
    if (uHead.z > 0.0 && uHead2.z > 0.0 && hd > -1.0) {
      float sep = smoothstep(0.7 * uHead2.x, 1.6 * uHead2.x, zf - uHead.w);
      sh = max(sh, sep * uHead2.z * soft(max(hd, 0.0), uHead2.w));
    }
  }
  vec3 col = uCol * (1.0 - clamp(sh, 0.0, 0.9));
  o = vec4(col * cov, cov) * uAlpha;
}`,os=`
#define MAXC 56
#define NG 5
${ss}
// How far p (White's picture's px, y up) is from his outline (below 0: inside him), and z: how far
// away he is there (m): the nearest part that covers p, or the part closest to p. (Far from a piece,
// its distance is only roughly right: enough to know which part is closest.)
float figureD(vec2 p, out float z) {
  float d = 1e6; z = 1e6;
  if (uHead.z > 0.0) { d = length(p - uHead.xy) - uHead.z; z = uHead.w; }
  for (int i = 0; i < MAXC; i++) {
    if (i >= uN) break;
    vec4 A = uA[i], B = uB[i];
    vec2 hv = 0.5 * (A.zw - A.xy);
    float dc = length(p - A.xy - hv) - length(hv) - max(B.x, B.y);
    float di, zi;
    if (dc > 4.0) { di = dc; zi = 2.0 / (B.z + B.w); }
    else {
      di = sdUC(p, A.xy, A.zw, B.x, B.y);
      vec2 ba = A.zw - A.xy;
      float h = clamp(dot(p - A.xy, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
      zi = 1.0 / mix(B.z, B.w, h);
    }
    if (di < 0.0 && d < 0.0) z = min(z, zi);
    else if (di < d) z = zi;
    d = min(d, di);
  }
  // just outside him: the rounded inner corners, as his own picture has them
  float fm = max(max(uFil.x, uFil.y), max(uFil.z, uFil.w));
  if (d > -1.0 && d < fm) {
    float D[NG]; float Z[NG]; float Wt[NG]; float Hd[NG]; vec2 G[NG];
    groups(p, fm + 2.0, D, Z, Wt, Hd, G);
    d = min(d, joined(p, 0.0, D, G));
  }
  return d;
}`;var xt=.07;function zt(n,t,e){let s=Object.prototype.hasOwnProperty.call(n,t),i=n[t];return n[t]=e((...o)=>i.apply(n,o)),()=>{s?n[t]=i:delete n[t]}}function Ts(n,t,e,s,i){let o=Math.sqrt(Math.max(e*e-n*n-t*t,0)),a=-n*Math.sin(s)+o*Math.cos(s);return(t*Math.sin(i)+a*Math.cos(i))/e}var re=class{constructor(t,e){this.E=t,this.rig=e,this.on=!1,this.look={edge:0,edgeDepth:.11,over:.2,overReach:.1,handOver:.34,faceReach:.07,headShadow:0,headReach:.5,faceShade:0,fillet:[.1,.2,.34,.06],filletOpen:[.03,.6,1.55,1.95],filletNear:[3,6],wobble:.016,wobbleLen:.5,wobbleSpeed:.43,sep:[.015,.07],frontBias:.02,margin:2.3,maxArea:17e5,quality:1,fxRef:.36,fxMax:2,faceHide:[75,88]},this.alpha=1,this.cam=null;let s=224;this.out={visible:!1,canvas:t.renderer.canvas,cw:64,ch:64,k:1,rect:{x:0,y:0,w:64,h:64},n:0,A:new Float32Array(s),B:new Float32Array(s),C:new Float32Array(s),root:new Float32Array(20),fil:[0,0,0,0],filA:[.03,.6,3,6],filB:[1.55,1.95],head:[0,0,1,1],headOn:!1,yaw:0,pitch:0,roll:0,burst:0},this._s={A:new Float32Array(s),B:new Float32Array(s),C:new Float32Array(s)},this._fades={l:1,r:1,mouth:1,tears:1},this._keys=new Map,this._size=[0,0],this._undo=[]}enter(){if(this.on)return;let t=this.E,e=t.settings,s=t.renderer,i=e.head,o=this._saved={head:{yawMax:i.yawMax,pitchMax:i.pitchMax,rollScale:i.rollScale,shiftX:i.shiftX,shiftY:i.shiftY},bodyRate:e.draw.bodyRate,hands:e.expr?e.expr.hands:void 0,maxFps:e.view.maxFps,bg:e.view.background,outer:e.draw.outerShadow?e.draw.outerShadow.strength:void 0,view:{...t.view},paused:!!t.paused,pins:new Map(t.pinned),vis:[t.glCanvas,t.ovCanvas].map(r=>r?r.style.visibility:"")};i.yawMax=180,i.pitchMax=90,i.rollScale=6,i.shiftX=0,i.shiftY=0,e.draw.bodyRate=.2,e.expr&&(e.expr.hands=!1),e.view.maxFps=0,e.view.background="#000000";for(let r of["ParamBodyAngleX","ParamBodyAngleY","ParamBodyAngleZ","ParamBreath"])t.pinned.set(r,0);let a=this._undo;a.push(zt(s,"draw",r=>(h,l,c)=>this._draw(r,h,l,c))),a.push(zt(s,"resize",()=>()=>this._resize())),a.push(zt(t.expr,"update",r=>(...h)=>{let l=r(...h);return this._prepare(h[0],h[1]),l})),a.push(zt(t,"twitch",r=>h=>r([h[0]*o.head.yawMax/180,h[1]*o.head.pitchMax/90,h[2]*o.head.rollScale/6,h[3],h[4]]))),a.push(zt(t,"postGeom",r=>()=>this._geom(r()))),t.post&&a.push(zt(t.post,"render",r=>(h,l,c,u,m)=>r(h,l,this._postSettings(c),u,m))),this._wantPaused=o.paused,a.push(zt(t,"pause",()=>()=>{this._wantPaused=!0})),a.push(zt(t,"resume",()=>()=>{this._wantPaused=!1})),t.paused=!0;for(let r of[t.glCanvas,t.ovCanvas])r&&(r.style.visibility="hidden");this.on=!0}exit(){if(!this.on)return;let t=this.E,e=t.settings,s=e.head,i=this._saved;for(this.on=!1;this._undo.length;)this._undo.pop()();Object.assign(s,i.head),e.draw.bodyRate=i.bodyRate,e.draw.outerShadow&&i.outer!==void 0&&(e.draw.outerShadow.strength=i.outer),e.expr&&(e.expr.hands=i.hands),e.view.maxFps=i.maxFps,e.view.background=i.bg,t.pinned.clear();for(let[o,a]of i.pins)t.pinned.set(o,a);Object.assign(t.view,i.view),[t.glCanvas,t.ovCanvas].forEach((o,a)=>{o&&(o.style.visibility=i.vis[a])}),t.live&&(t.live.dirty=!0),t.paused=!0,this._wantPaused||t.resume()}frame(t,e,s){if(!this.on)return this.out;let i=this.E;this.cam=e,this._pose=s;let o=i.settings.draw.outerShadow;o&&this._saved.outer!==void 0&&(o.strength=this._saved.outer*this.look.faceShade),i.paused=!1,i._due=null;try{i.frame(t)}finally{i.paused=!0}return this.out.burst=i.burst?x(i.burst.amount??1,0,1):0,this.out}_prepare(t,e){let s=this.E,i=this._saved.head,o=s.expr.out&&s.expr.out.params||{},a={yaw:(o.ParamAngleX||0)/30*i.yawMax*A,pitch:(o.ParamAngleY||0)/30*i.pitchMax*A,roll:(o.ParamAngleZ||0)*i.rollScale*A};try{this._pose&&this._pose(a,t,e)}catch(r){console.error(r)}this._project()}_project(){let t=this.E,e=t.settings,s=e.head,i=this.cam,o=this.out,a=this.look,r=this.rig,h=r.J;if(!i){o.visible=!1;return}let l=i.b,c=i.f,u=i.W,m=i.H,g=L=>{let it=X(L,i.pos);return[-K(it,l.x),K(it,l.y),K(it,l.z)]},d=this._s,z=0,v=1e9,b=1e9,k=-1e9,_=-1e9;for(let[L,it,Dt,St,_s,Ms,As,Rs]of r.pieces()){if(z>=56)break;let ct=g(L),gt=g(it),je=Dt,Ye=St,se=As??1,ye=Rs??1;if(ct[2]<xt&&gt[2]<xt)continue;if(ct[2]<xt||gt[2]<xt){let ie=(xt-ct[2])/(gt[2]-ct[2]),Ve=[ct[0]+(gt[0]-ct[0])*ie,ct[1]+(gt[1]-ct[1])*ie,xt],Je=Dt+(St-Dt)*ie,Ze=se+(ye-se)*ie;ct[2]<xt?(ct=Ve,je=Je,se=Ze):(gt=Ve,Ye=Je,ye=Ze)}let be=c/ct[2],ke=c/gt[2],wt=4*z,_e=u/2+ct[0]*be,Me=m/2+ct[1]*be,Ae=u/2+gt[0]*ke,Re=m/2+gt[1]*ke,Xt=Math.min(je*be,6e3),jt=Math.min(Ye*ke,6e3);d.A[wt]=_e,d.A[wt+1]=Me,d.A[wt+2]=Ae,d.A[wt+3]=Re,d.B[wt]=Xt,d.B[wt+1]=jt,d.B[wt+2]=1/ct[2],d.B[wt+3]=1/gt[2],d.C[wt]=_s,d.C[wt+1]=Ms||0,d.C[wt+2]=se,d.C[wt+3]=ye,v=Math.min(v,_e-Xt,Ae-jt),k=Math.max(k,_e+Xt,Ae+jt),b=Math.min(b,Me-Xt,Re-jt),_=Math.max(_,Me+Xt,Re+jt),z++}let E=g(h.head),R=r.B.R,f=E[2]>xt+R,y=0,p=0,M=1;if(f){let L=c/E[2];y=u/2+E[0]*L,p=m/2+E[1]*L,M=R*L,v=Math.min(v,y-M),k=Math.max(k,y+M),b=Math.min(b,p-M),_=Math.max(_,p+M)}if(o.n=z,o.headOn=f,!z&&!f){o.visible=!1,this._hideHead();return}let P=a.margin*(f?M:.1*m);if(v=Math.max(v-P,0),b=Math.max(b-P,0),k=Math.min(k+P,u),_=Math.min(_+P,m),k-v<2||_-b<2){o.visible=!1,this._hideHead();return}o.visible=!0;let T=Math.min(1,Math.sqrt(a.maxArea/((k-v)*(_-b))))*x(a.quality,.2,1),B=64,N=[(k-v)*T,(_-b)*T],C=this._size;for(let L=0;L<2;L++){let it=Math.max(B,Math.ceil(N[L]/B)*B);it<=C[L]&&it>=C[L]-3*B||(C[L]=it)}o.cw=C[0],o.ch=C[1],o.k=T;let G=o.cw/T,W=o.ch/T,j=Math.round((v+k)/2-G/2),Q=Math.round((b+_)/2-W/2);o.rect.x=j,o.rect.y=Q,o.rect.w=G,o.rect.h=W;for(let L=0;L<4*z;L+=4)o.A[L]=(d.A[L]-j)*T,o.A[L+1]=(d.A[L+1]-Q)*T,o.A[L+2]=(d.A[L+2]-j)*T,o.A[L+3]=(d.A[L+3]-Q)*T,o.B[L]=d.B[L]*T,o.B[L+1]=d.B[L+1]*T,o.B[L+2]=d.B[L+2],o.B[L+3]=d.B[L+3],o.C[L]=d.C[L],o.C[L+1]=d.C[L+1],o.C[L+2]=d.C[L+2],o.C[L+3]=d.C[L+3];let I=(y-j)*T,J=(p-Q)*T,$=M*T;o.head[0]=I,o.head[1]=J,o.head[2]=$,o.head[3]=E[2],o.root.fill(0);for(let L=0;L<4*z;L+=4){let it=4*Math.round(o.C[L]);it>0&&it<20&&!o.root[it+3]&&(o.root[it]=o.A[L],o.root[it+1]=o.A[L+1],o.root[it+2]=o.B[L],o.root[it+3]=1)}let rt=f?$:40*T,mt=a.fillet,et=a.filletOpen,ut=a.filletNear;for(let L=0;L<4;L++)o.fil[L]=(mt[L]||0)*rt;o.filA[0]=et[0],o.filA[1]=Math.max(et[1],et[0]+.001),o.filA[2]=ut[0],o.filA[3]=Math.max(ut[1],ut[0]+.001),o.filB[0]=et[2],o.filB[1]=Math.max(et[3],et[2]+.001);let tt=g(h.hip),at=c/Math.max(xt,tt[2]);if(this._org=[(u/2+tt[0]*at-j)*T,(m/2+tt[1]*at-Q)*T],!f){this._hideHead();return}let Z=D(X(h.head,i.pos)),U=F(l.x,-1),H=D(X(U,F(Z,K(U,Z))),U),O=F(Z,-1),lt=vt(O,H),Mt=$e(r.headQ),It=L=>[K(L,H),K(L,lt),K(L,O)],Qt=It(Mt.x),bt=It(Mt.y),gs=It(Mt.z),me=Math.atan2(-Qt[2],gs[2]),we=Math.asin(x(-bt[2],-1,1)),Bt=Math.atan2(-bt[0],bt[1]),$t=g([h.head[0]+Mt.y[0]*.05,h.head[1]+Mt.y[1]*.05,h.head[2]+Mt.y[2]*.05]);if($t[2]>xt){let L=c/$t[2],it=u/2+$t[0]*L-y,Dt=m/2+$t[1]*L-p;if(Math.hypot(it,Dt)>.001){let St=Math.atan2(-it,Dt)-Bt;St=Math.atan2(Math.sin(St),Math.cos(St)),Bt+=St*(1-Y(.8,.95,Math.abs(bt[2])))}}o.yaw=me,o.pitch=we,o.roll=Bt,t.pinned.set("ParamAngleX",me/A/180*30),t.pinned.set("ParamAngleY",we/A/90*30),t.pinned.set("ParamAngleZ",Bt/A/6);let Ht=(e.sizes&&e.sizes.head)??1,Ge=Math.cos(Bt),We=Math.sin(Bt),Ue=(s.cx-s.pivotX)*Ht,Oe=(s.cy-s.pivotY)*Ht,Ie=s.pivotX+Ue*Ge+Oe*We,He=s.pivotY-Ue*We+Oe*Ge,ve=$/(s.radius*Ht);t.view.scale=ve,t.view.ox=I-Ie*ve,t.view.oy=o.ch-J-He*ve;let xe=g(h.neck),Xe=c/Math.max(xt,xe[2]),Kt=u/2+xe[0]*Xe-y,te=-(m/2+xe[1]*Xe-p),ge=Math.hypot(Kt,te);ge>.001?(Kt/=ge,te/=ge):(Kt=0,te=1),this._neck=[Ie+Kt*s.radius*Ht,He+te*s.radius*Ht];let At=t.live&&t.live.face,ys=Math.cos(a.faceHide[1]*A),bs=Math.cos(a.faceHide[0]*A),ks=s.radius*(1-x(e.depth&&e.depth.orbit||0,0,.9)),Rt=this._fades,Nt=(L,it)=>Y(ys,bs,Ts(L-s.cx,it-s.cy,ks,me,we));At&&At.rings?(Rt.l=Nt(At.rings.l.cx,At.rings.l.cy),Rt.r=Nt(At.rings.r.cx,At.rings.r.cy)):t.model&&t.model.face&&(Rt.l=Nt(...t.model.face.l.orbitC),Rt.r=Nt(...t.model.face.r.orbitC));let ee=At&&At.mouth;Rt.mouth=ee&&ee.cx!=null?Nt(ee.cx,ee.cy):Nt(s.cx,s.cy+.45*s.radius),Rt.tears=Math.min(Rt.l,Rt.r)}_hideHead(){let t=this.E.view;t.scale=.02,t.ox=-1e5,t.oy=-1e5}_key(t){let e=this._keys.get(t);return e===void 0&&(e=t==="head"||t==="head-clip"||t==="body"||t==="armpits"?null:/-l(-|$)/.test(t)?"l":/-r(-|$)/.test(t)?"r":t.startsWith("tears")?"tears":"mouth",this._keys.set(t,e)),e}_draw(t,e,s,i={}){let o=this.E,a=o.post,r=this.out,h=a&&a.img?a.ms?a.ms.fbo:a.img.S.fbo:null,l=!!(i.post&&i.target&&h&&i.target.fbo===h),c=!!(i.post&&i.target&&a&&a.img&&a.img.P&&i.target.fbo===a.img.P.fbo),u=!i.target&&!i.filter&&!i.post,m=i.filter,g={...i,filter:v=>v.id!=="body"&&v.id!=="armpits"&&(!m||m(v))},d=this._fades,z=[];for(let v of e.meshes){let b=this._key(v.id);b&&d[b]<.999&&(z.push(v,v.alpha),v.alpha*=d[b])}try{let v=l?i.target:u?{fbo:null,w:o.renderer.canvas.width,h:o.renderer.canvas.height}:null;v&&r.visible&&r.n&&this._body(v,0),t(e,s,g),v&&r.visible&&r.n&&r.headOn&&this._front()?this._body(v,1):c&&r.visible&&r.n&&r.headOn&&this._front()&&this._body(i.target,2)}finally{for(let v=0;v<z.length;v+=2)z[v].alpha=z[v+1]}}_front(){let t=this.out,[e,s,i,o]=t.head;for(let a=0;a<4*t.n;a+=4){if(t.C[a]<.5)continue;let r=1/t.B[a+2],h=1/t.B[a+3];if(Math.min(r,h)>o)continue;let l=t.A[a],c=t.A[a+1],u=t.A[a+2],m=t.A[a+3],g=u-l,d=m-c,z=x(((e-l)*g+(s-c)*d)/Math.max(1e-6,g*g+d*d),0,1);if(Math.hypot(l+g*z-e,c+d*z-s)<i+Math.max(t.B[a],t.B[a+1])+2)return!0}return!1}_program(){if(this._prog)return this._prog;let t=this.E.renderer.gl,e=(r,h)=>{let l=t.createShader(r);if(t.shaderSource(l,h),t.compileShader(l),!t.getShaderParameter(l,t.COMPILE_STATUS))throw new Error("White 3D body: "+t.getShaderInfoLog(l));return l},s=t.createProgram();if(t.attachShader(s,e(t.VERTEX_SHADER,es)),t.attachShader(s,e(t.FRAGMENT_SHADER,is)),t.bindAttribLocation(s,0,"aPos"),t.linkProgram(s),!t.getProgramParameter(s,t.LINK_STATUS))throw new Error("White 3D body: "+t.getProgramInfoLog(s));let i={};for(let r of["uA","uB","uC","uN","uCol","uShade","uHead","uHead2","uWob","uSep","uOrg","uPad","uHand","uFil","uFilA","uFilB","uRoot","uAlpha"])i[r]=t.getUniformLocation(s,r);let o=t.createVertexArray();t.bindVertexArray(o);let a=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,a),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.bindVertexArray(null),this._prog={p:s,u:i,vao:o,A:new Float32Array(224),B:new Float32Array(224),C:new Float32Array(224),R:new Float32Array(20)},this._prog}_body(t,e){let s=this.E,i=s.renderer.gl,o=this.out,a=this.look,r;try{r=this._program()}catch(p){this._failed||(this._failed=!0,console.error(p));return}let h=t.w/o.cw,l=o.n,c=o.head[2]*h,u=1e9,m=1e9,g=-1e9,d=-1e9;for(let p=0;p<20;p+=4)r.R[p]=o.root[p]*h,r.R[p+1]=o.root[p+1]*h,r.R[p+2]=o.root[p+2]*h,r.R[p+3]=o.root[p+3];for(let p=0;p<4*l;p+=4){let M=o.A[p]*h,P=o.A[p+1]*h,T=o.A[p+2]*h,B=o.A[p+3]*h,N=o.B[p]*h,C=o.B[p+1]*h;r.A[p]=M,r.A[p+1]=P,r.A[p+2]=T,r.A[p+3]=B,r.B[p]=N,r.B[p+1]=C,r.B[p+2]=o.B[p+2],r.B[p+3]=o.B[p+3],r.C[p]=o.C[p],r.C[p+1]=o.C[p+1],r.C[p+2]=o.C[p+2],r.C[p+3]=o.C[p+3],u=Math.min(u,M-N,T-C),g=Math.max(g,M+N,T+C),m=Math.min(m,P-N,B-C),d=Math.max(d,P+N,B+C)}let z=o.head[0]*h,v=o.head[1]*h,b=o.headOn?c:40*h,k=a.fillet,_=Math.max(k[0],k[1],k[2],k[3]||0),E=a.wobble*b,R=3+E+Math.max(a.overReach,a.headReach,_)*b;if(e&&(u=z-c,g=z+c,m=v-c,d=v+c),u=Math.max(0,Math.floor(u-R)),m=Math.max(0,Math.floor(m-R)),g=Math.min(t.w,Math.ceil(g+R)),d=Math.min(t.h,Math.ceil(d+R)),g<=u||d<=m)return;i.bindFramebuffer(i.FRAMEBUFFER,t.fbo),i.viewport(0,0,t.w,t.h),i.enable(i.SCISSOR_TEST),i.scissor(u,m,g-u,d-m),i.enable(i.BLEND),e===2?i.blendFunc(i.ZERO,i.ONE_MINUS_SRC_ALPHA):i.blendFunc(i.ONE,i.ONE_MINUS_SRC_ALPHA),i.useProgram(r.p);let f=r.u;i.uniform4fv(f.uA,r.A),i.uniform4fv(f.uB,r.B),i.uniform4fv(f.uC,r.C),i.uniform1i(f.uN,l);let y=s.live&&s.live.headColor||[.91,.91,.91];i.uniform3f(f.uCol,y[0],y[1],y[2]),i.uniform4f(f.uShade,a.edge,Math.max(1,a.edgeDepth*b),a.over,Math.max(1,(e?a.faceReach:a.overReach)*b)),i.uniform4f(f.uHead,z,v,o.headOn?c:0,o.head[3]),i.uniform4f(f.uHead2,this.rig.B.R,e,a.headShadow,Math.max(1,a.headReach*b)),i.uniform4f(f.uWob,E,Math.max(4,a.wobbleLen*b),(s.live&&s.live.clock||0)*a.wobbleSpeed,3.7),i.uniform4f(f.uSep,a.sep[0],a.sep[1],a.frontBias,0),i.uniform2f(f.uOrg,this._org[0]*h,this._org[1]*h),i.uniform1f(f.uPad,2+E+Math.max(a.overReach,_)*b),i.uniform1f(f.uHand,a.handOver),i.uniform4f(f.uFil,o.fil[0]*h,o.fil[1]*h,o.fil[2]*h,o.fil[3]*h),i.uniform4f(f.uFilA,o.filA[0],o.filA[1],o.filA[2],o.filA[3]),i.uniform2f(f.uFilB,o.filB[0],o.filB[1]),i.uniform4fv(f.uRoot,r.R),i.uniform1f(f.uAlpha,x(this.alpha,0,1)),i.bindVertexArray(r.vao),i.drawArrays(i.TRIANGLES,0,3),i.bindVertexArray(null),i.disable(i.SCISSOR_TEST),e===2&&i.blendFunc(i.ONE,i.ONE_MINUS_SRC_ALPHA),t.fbo&&i.bindFramebuffer(i.FRAMEBUFFER,null)}_resize(){let t=this.E.renderer,e=t.canvas,s=this.out;return(e.width!==s.cw||e.height!==s.ch)&&(e.width=s.cw,e.height=s.ch),t.dpr=1,[s.cw,s.ch]}_geom(t){return t&&t.neck&&this._neck&&this.out.headOn&&(t.neck.x=this._neck[0],t.neck.y=this._neck[1]),t}_postSettings(t){let e=this.look,s=this.E.view.scale,i=x(e.fxRef/Math.max(1e-4,s),1,e.fxMax);if(this.fx=i,i<1.02||!t||!t.post)return t;let o=t.post,a=(l,c)=>{let u={...l||{}};for(let m of c)typeof u[m]=="number"&&(u[m]*=i);return u},r={...o,pupil:a(o.pupil,["distance","blur"]),chrome:a(o.chrome,["distance","blur"]),diverge:a(o.diverge,["red","green","blue","wanderMin","wanderMax"]),artifact:a(o.artifact,["zoom"])},h=(l,c,u)=>{if(l&&typeof(l[c]??u)=="number"){let m=(2+198*Math.pow(x(l[c]??u,0,1),1.5))*i;l[c]=Math.pow(x((m-2)/198,0,1),2/3)}};return r.bloom={...o.bloom||{}},h(r.bloom,"size",.08),h(r.pupil,"size",.15),o.halftone&&(r.halftone={...o.halftone,size:((2+1.6*(o.halftone.size??10))*i-2)/1.6}),r.diverge&&(r.diverge.zoom=((1+4*(r.diverge.zoom??.5))*i-1)/4),{...t,post:r}}};var Ls=`#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;function as(n,t,e,s){let i=n.createShader(t);if(n.shaderSource(i,e),n.compileShader(i),!n.getShaderParameter(i,n.COMPILE_STATUS)){let o=n.getShaderInfoLog(i)||"",a=e.split(`
`),h=[...o.matchAll(/ERROR: \d+:(\d+)/g)].map(l=>+l[1]).slice(0,4).map(l=>l+": "+(a[l-1]||"").trim()).join(`
`);throw new Error(s+": "+o+(h?`
`+h:""))}return i}function Se(n,t,e="shader",s=Ls){let i=n.createProgram();if(n.attachShader(i,as(n,n.VERTEX_SHADER,s,e)),n.attachShader(i,as(n,n.FRAGMENT_SHADER,t,e)),n.bindAttribLocation(i,0,"aPos"),n.linkProgram(i),!n.getProgramParameter(i,n.LINK_STATUS))throw new Error(e+": "+n.getProgramInfoLog(i));let o={},a=n.getProgramParameter(i,n.ACTIVE_UNIFORMS);for(let r=0;r<a;r++){let h=n.getActiveUniform(i,r);o[h.name.replace(/\[0\]$/,"")]={loc:n.getUniformLocation(i,h.name),type:h.type,size:h.size}}return{p:i,u:o,name:e}}function ns(n){let t=n.createVertexArray();n.bindVertexArray(t);let e=n.createBuffer();return n.bindBuffer(n.ARRAY_BUFFER,e),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.bindVertexArray(null),t}function rs(n,t,e,s=!1,i=!0){let o=r=>{let h=n.createTexture();n.bindTexture(n.TEXTURE_2D,h),r?n.texImage2D(n.TEXTURE_2D,0,n.RGBA16F,t,e,0,n.RGBA,n.HALF_FLOAT,null):n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,t,e,0,n.RGBA,n.UNSIGNED_BYTE,null);let l=i?n.LINEAR:n.NEAREST;n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,l),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,l),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let c=n.createFramebuffer();n.bindFramebuffer(n.FRAMEBUFFER,c),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,h,0);let u=n.checkFramebufferStatus(n.FRAMEBUFFER)===n.FRAMEBUFFER_COMPLETE;return n.bindFramebuffer(n.FRAMEBUFFER,null),u?{tex:h,fbo:c,w:t,h:e,half:r}:(n.deleteTexture(h),n.deleteFramebuffer(c),null)},a=s?o(!0):null;if(a||(a=o(!1)),!a)throw new Error("could not make an image of "+t+" x "+e);return a}function hs(n,t){t&&(n.deleteTexture(t.tex),n.deleteFramebuffer(t.fbo))}function Pe(n,t,e,s,i,o=!1){n.bindFramebuffer(n.FRAMEBUFFER,s?s.fbo:null),n.viewport(0,0,s?s.w:n.drawingBufferWidth,s?s.h:n.drawingBufferHeight),o?(n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA)):n.disable(n.BLEND),n.useProgram(t.p);let a=0;for(let r in t.u){let h=t.u[r],l=i[r];if(h.type===n.SAMPLER_2D){n.activeTexture(n.TEXTURE0+a),n.bindTexture(n.TEXTURE_2D,l||null),n.uniform1i(h.loc,a++);continue}if(l!==void 0)switch(h.type){case n.FLOAT:h.size>1?n.uniform1fv(h.loc,l):n.uniform1f(h.loc,l);break;case n.FLOAT_VEC2:n.uniform2fv(h.loc,l);break;case n.FLOAT_VEC3:n.uniform3fv(h.loc,l);break;case n.FLOAT_VEC4:n.uniform4fv(h.loc,l);break;case n.INT:n.uniform1i(h.loc,l);break;case n.FLOAT_MAT3:n.uniformMatrix3fv(h.loc,!1,l);break;default:break}}n.bindVertexArray(e),n.drawArrays(n.TRIANGLES,0,3),n.bindVertexArray(null)}var Fs=`#version 300 es
precision highp float;
uniform vec3 uCamPos, uCamR, uCamU, uCamF;   // the camera: where it is, its right, its up, the way it looks
uniform vec4 uView;         // this picture's width and height (px), tan(half the field of view), time (s)
uniform vec4 uScreen;       // the screen's width and height (px), the focal length (px)
uniform sampler2D uFig;     // White's picture
uniform vec4 uFigRect;      // its place on the screen (px, y up): x, y, w, h
uniform float uFigOn;
uniform vec3 uWhiteAt[3];   // White's head, chest and hips (m)
uniform vec3 uWhiteRoot;    // the ground under him
uniform vec3 uWhiteN;       // from him toward the camera, level
uniform float uWhiteGlow;   // how bright he is to the world
out vec4 o;

vec3 rayDir(vec2 px) {
  vec2 q = (px - 0.5 * uView.xy) / (0.5 * uView.y) * uView.z;
  return normalize(uCamF + uCamR * q.x + uCamU * q.y);
}
// White's picture where the camera sees the point P of the world (black where he is not). lod:
// how blurred (0 = sharp).
vec3 whiteAt(vec3 P, float lod) {
  if (uFigOn < 0.5) return vec3(0.0);
  vec3 v = P - uCamPos;
  float z = dot(v, uCamF);
  if (z < 0.05) return vec3(0.0);
  vec2 s = 0.5 * uScreen.xy + uScreen.z * vec2(dot(v, uCamR), dot(v, uCamU)) / z;
  vec2 uv = (s - uFigRect.xy) / uFigRect.zw;
  if (uv.x <= 0.0 || uv.y <= 0.0 || uv.x >= 1.0 || uv.y >= 1.0) return vec3(0.0);
  vec2 e = min(uv, 1.0 - uv);
  return textureLod(uFig, vec2(uv.x, 1.0 - uv.y), lod).rgb * smoothstep(0.0, 0.04, min(e.x, e.y));
}
// White mirrored in the ground at P (the ray came in along rd; n: the ground's normal there): what a
// ray bouncing off it sees of him. His picture is taken to be on an upright sheet where he stands.
vec3 whiteMirror(vec3 P, vec3 rd, vec3 n, float lod) {
  if (uFigOn < 0.5) return vec3(0.0);
  vec3 r = reflect(rd, n);
  float den = dot(r, uWhiteN);
  if (abs(den) < 1e-4) return vec3(0.0);
  float t = dot(uWhiteRoot - P, uWhiteN) / den;
  if (t <= 0.0) return vec3(0.0);
  vec3 Q = P + r * t;
  if (Q.y < uWhiteRoot.y) return vec3(0.0);
  // (the sheet is seen from the camera, the mirror image from under the ground: the same picture,
  // upside down about the ground line)
  return whiteAt(Q, lod);
}
// White's own light on a surface at P with normal n (he glows: head, chest, hips)
float whiteLight(vec3 P, vec3 n) {
  float L = 0.0;
  for (int i = 0; i < 3; i++) {
    vec3 d = uWhiteAt[i] - P;
    float r2 = dot(d, d);
    L += max(dot(n, d) * inversesqrt(r2), 0.0) / (r2 + 0.06);
  }
  return L * uWhiteGlow;
}
`,Bs=`
void main() {
  vec3 rd = rayDir(gl_FragCoord.xy);
  vec4 c = world(uCamPos, rd);
  o = vec4(max(c.rgb, 0.0), c.a * dot(rd, uCamF));
}`,Ns=`#version 300 es
precision highp float;
${os}
uniform sampler2D uScene;     // the world: linear colour; a: how far in front of the camera (m)
uniform sampler2D uFig;       // White's picture
uniform vec4 uFigRect;        // its place on the screen (px, y up): x, y, w, h
uniform vec2 uFigSize;        // its size in its own px
uniform float uFigOn;
uniform vec2 uRes;            // the screen (px)
uniform vec4 uGrade;          // exposure, contrast, saturation, vignette
uniform vec3 uLift;           // a colour added to the darks (display)
uniform vec4 uRim;            // the sun on his edges: its direction on the screen (x, y), strength, depth (px)
uniform vec3 uRimCol;
uniform vec4 uFigLook;        // his outline pulled in (px), glitching now (0..1), the air over him (0..1), depth test on
uniform vec2 uDepth;          // the world covers him where it is nearer by more than x + y * (his distance squared) m
uniform vec3 uAir;            // the air's colour (as on the screen)
uniform vec2 uNoise;          // grain: amount, time
uniform vec3 uTear;           // the picture tearing: how much (0..1), its clock, colours parting (px)
uniform float uDirect;        // 1: the world's colours are already the screen's (a film): no tone mapping
uniform vec4 uSway;           // the whole picture held by a hand: moved (x, y px), turned (rad), nearer (1 = as it is)
out vec4 o;

vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
float hash12(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }

void main() {
  vec2 px = gl_FragCoord.xy;
  if (uSway.w != 1.0 || uSway.z != 0.0 || uSway.x != 0.0 || uSway.y != 0.0) {
    vec2 c = px - 0.5 * uRes;
    float cs = cos(uSway.z), sn = sin(uSway.z);
    px = vec2(c.x * cs - c.y * sn, c.x * sn + c.y * cs) / uSway.w + 0.5 * uRes + uSway.xy;
  }
  vec2 uv = px / uRes;
  vec2 guv = uv;
  if (uTear.x > 0.0) {
    // rows of the world's picture jump aside (White is not part of it: he stays whole)
    float tk = floor(uTear.y * 14.0);
    float r = hash12(vec2(floor(px.y / 11.0), tk)), r2 = hash12(vec2(floor(px.y / 70.0) + 7.0, tk + 3.0));
    guv.x += step(1.0 - uTear.x * 0.22, r) * (r2 - 0.5) * 0.2 + step(1.0 - uTear.x * 0.45, r2) * (r - 0.5) * 0.05;
  }
  vec4 sc = texture(uScene, guv);
  if (uTear.z > 0.0) {
    vec2 d = vec2(uTear.z / uRes.x, 0.0);
    sc.r = texture(uScene, guv + d).r; sc.b = texture(uScene, guv - d).b;
  }
  vec3 col = uDirect > 0.5 ? clamp(sc.rgb * uGrade.x, 0.0, 1.0) : pow(aces(sc.rgb * uGrade.x), vec3(1.0 / 2.2));
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(l), col, uGrade.z);
  col = clamp((col - 0.5) * uGrade.y + 0.5, 0.0, 1.0);
  col += uLift * (1.0 - col) * (1.0 - col);
  vec2 q = uv - 0.5;
  col *= 1.0 - uGrade.w * smoothstep(0.1, 0.75, dot(q, q) * 2.0);

  if (uFigOn > 0.5) {
    vec2 p = (px - uFigRect.xy) * (uFigSize / uFigRect.zw);
    vec2 fuv = p / uFigSize;
    if (fuv.x > 0.0 && fuv.y > 0.0 && fuv.x < 1.0 && fuv.y < 1.0) {
      vec3 fc = textureLod(uFig, vec2(fuv.x, 1.0 - fuv.y), 0.0).rgb;
      float zf;
      float d = figureD(p, zf);
      float a = clamp(0.5 - d - uFigLook.x, 0.0, 1.0);
      // (in a glitch, pieces of him jump aside: where he is gone, the world shows)
      a *= mix(1.0, smoothstep(0.03, 0.3, max(fc.r, max(fc.g, fc.b))), uFigLook.y);
      // his glow fades out before his picture's edges
      vec2 e = min(fuv, 1.0 - fuv);
      float edge = smoothstep(0.0, 0.035, min(e.x, e.y));
      vec3 body = fc;
      // The sun on the edge of him that faces it: how near his outline is from here, going toward the sun.
      // (Not from which way his surface faces: that flips along the middle of every arm and leg, and drew
      // a hard line there. This fades smoothly inward, and a thin part is lit right through.)
      if (uRim.z > 0.0 && d < 0.0 && -d < uRim.w) {
        float z2;
        float f = smoothstep(0.0, uRim.w, figureD(p + uRim.xy * uRim.w, z2));
        body += uRimCol * uRim.z * f * f;
      }
      body = mix(body, uAir, uFigLook.z);
      vec3 glow = fc * edge * (1.0 - uFigLook.z);
      vec3 lit = col + glow - col * glow;                 // his light laid over the world
      float tol = uDepth.x + uDepth.y * zf * zf;
      float vis = uFigLook.w > 0.5 ? 1.0 - smoothstep(tol, 2.0 * tol + 0.04, zf - sc.a) : 1.0;
      col = mix(col, mix(lit, body, a), vis);
    }
  }
  col += (hash12(gl_FragCoord.xy + fract(uNoise.y) * 91.7) - 0.5) * uNoise.x;
  o = vec4(col, 1.0);
}`,he=class{constructor(t){this.canvas=t;let e=this.gl=t.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!0,powerPreference:"high-performance"});if(!e)throw new Error("WebGL2 is not available on this computer.");this.halfOk=!!e.getExtension("EXT_color_buffer_float"),this.vao=ns(e),this.final=Se(e,Ns,"final"),this.figTex=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.figTex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array(4)),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.scale=1,this.scene=null,this.programs=new Map,this.world=null,this.look={exposure:1,contrast:1,saturation:1,vignette:.22,lift:[0,0,0],grain:.022,rim:.55,rimDepth:.45,rimCol:[1,.72,.42],shrink:1.5,air:0,airCol:[.5,.5,.5],glow:1,depth:!0,depthTol:[.03,0],direct:!1},this.sway=[0,0,0,1],this.tear=[0,0,0],this.info={}}setWorld(t){this.programs.has(t)||(t.init&&t.init(this.gl),this.programs.set(t,Se(this.gl,Fs+t.fs+Bs,"world "+t.name))),this.world=t,Object.assign(this.look,this.look0||(this.look0={...this.look}),t.look||{})}size(t,e){let s=this.canvas;t=Math.max(2,Math.round(t)),e=Math.max(2,Math.round(e)),(s.width!==t||s.height!==e)&&(s.width=t,s.height=e)}render(t,e,s,i){let o=this.gl,a=this.canvas.width,r=this.canvas.height,h=this.look,l=this.world;if(!l)return;let c=!!(s&&s.visible);c&&(o.bindTexture(o.TEXTURE_2D,this.figTex),o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,!1),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,o.NONE),o.texImage2D(o.TEXTURE_2D,0,o.RGBA,o.RGBA,o.UNSIGNED_BYTE,s.canvas),o.generateMipmap(o.TEXTURE_2D));let u=x(this.scale,.2,1),m=Math.max(2,Math.round(a*u)),g=Math.max(2,Math.round(r*u));(!this.scene||this.scene.w!==m||this.scene.h!==g)&&(hs(o,this.scene),this.scene=rs(o,m,g,this.halfOk));let d=e.b,z=F(d.x,-1),v=c?[s.rect.x,s.rect.y,s.rect.w,s.rect.h]:[0,0,1,1],b=new Float32Array(9),k=[0,0,0],_=[0,0,1];if(i){b.set(i.head,0),b.set(i.chest,3),b.set(i.hip,6),k=i.root;let f=X(e.pos,k);_=D([f[0],0,f[2]],[0,0,1])}let E={uCamPos:e.pos,uCamR:z,uCamU:d.y,uCamF:d.z,uView:[m,g,Math.tan(e.fov/2),t],uScreen:[a,r,e.f,0],uFig:this.figTex,uFigRect:v,uFigOn:c?1:0,uWhiteAt:b,uWhiteRoot:k,uWhiteN:_,uWhiteGlow:i?h.glow:0,...l.uniforms?l.uniforms(t,e):{}};Pe(o,this.programs.get(l),this.vao,this.scene,E);let R=[0,1,0,1];if(l.sun&&c&&h.rim>0){let f=K(l.sun,z),y=K(l.sun,d.y),p=Math.hypot(f,y);p>.05&&(R=[f/p,y/p,h.rim*Math.min(1,p*1.5)*(l.sunLight??1),Math.max(2,h.rimDepth*s.head[2])])}Pe(o,this.final,this.vao,null,{uScene:this.scene.tex,uFig:this.figTex,uFigRect:v,uFigSize:c?[s.cw,s.ch]:[1,1],uFigOn:c?1:0,uRes:[a,r],uGrade:[h.exposure,h.contrast,h.saturation,h.vignette],uLift:h.lift,uRim:R,uRimCol:h.rimCol,uFigLook:[h.shrink*(c?s.k:1),c?s.burst:0,x(h.air,0,1),h.depth&&this.scene.half&&(!l.depthOn||l.depthOn())?1:0],uAir:h.airCol,uDepth:h.depthTol||[.03,0],uNoise:[h.grain,t],uTear:this.tear,uDirect:h.direct?1:0,uSway:this.sway,uA:c?s.A:Te,uB:c?s.B:Te,uC:c?s.C:Te,uN:c?s.n:0,uHead:c&&s.headOn?s.head:[0,0,0,1],uFil:c?s.fil:[0,0,0,0],uFilA:c?s.filA:[0,1,1,2],uFilB:c?s.filB:[1,2],uRoot:c?s.root:Ds}),this.info.scene=[m,g]}},Te=new Float32Array(224),Ds=new Float32Array(20);var S=n=>n*A,ls=(n,t,e)=>Math.exp(-(((n-t)/e)**2)),cs={me:{in:.55,out:.7,hold:2.2,f:(n,t)=>{let e=3*Math.sin(t*1.3);return{spine:{bend:S(-5)},shrug:.12,hip:{dy:-.012*ls(t,.35,.16)},armL:{raise:S(54+e),azim:S(60),bend:S(36),twist:S(-22),palm:[.2,.75,.6],curl:.08},armR:{raise:S(54-e),azim:S(60),bend:S(36),twist:S(-22),palm:[-.2,.75,.6],curl:.08},head:{pitch:S(3),roll:S(4*Math.sin(t*.9))}}}},hands:{in:.7,out:.6,hold:3.2,f:(n,t)=>{let e=Y(1.4,2,t)-Y(2.9,3.5,t),s=r=>D([-r*w(.35,-.2,e),.1,w(-1,1,e)]),i=r=>.04+.5*Math.pow(.5+.5*Math.sin(t*2.6+r),2)*(1-.5*e),o=Math.sin(t*1.5-.4),a=(r,h)=>({hand:[r*.5*n.D,(.2+.04*Math.sin(t*1.1+h))*n.D,.56*n.D],pole:[r*.35,-1,-.15],palm:s(r),curl:i(h),spread:1.1,tight:.4});return{spine:{bend:S(3)},shrug:.1,head:{pitch:S(-7),yaw:S(24*o),roll:S(-5*o),replace:!0},armL:a(1,0),armR:a(-1,2)}}},wave:{in:.4,out:.55,hold:1.7,f:(n,t,e,s)=>{let i=s.side==="L"?"L":"R",o=i==="L"?1:-1;return{spine:{side:S(3)*o},head:{roll:S(5)*o},["arm"+i]:{raise:S(120),azim:S(70),bend:S(60+22*Math.sin(t*8)),twist:S(88),palm:[0,0,1],curl:.03,spread:1.1,tight:.5}}}},think:{in:.6,out:.6,hold:2.4,f:(n,t)=>({spine:{bend:S(3),side:S(2)},head:{roll:S(7),pitch:S(4),yaw:S(-6)},armL:{hand:[-1.08*n.clav,-.8*n.arm,.5*n.fore],pole:[.7,-.5,-.5],palm:[0,.3,-1],curl:.5,tight:.5},armR:{hand:[.84*n.clav,n.clavDrop+.07*n.D+.004*Math.sin(t*1.1),.5*n.D],pole:[-.5,-.9,.2],palm:[.3,.2,-1],curl:.62,wrist:S(12),tight:.7}})},point:{in:.35,out:.5,hold:1.6,f:(n,t,e,s)=>{let i=s.side==="L"?"L":"R",o=i==="L"?1:-1,a=e.rig.J["sh"+i],r=s.at||st(a,[Math.sin(e.yaw),.1,Math.cos(e.yaw)],3),h=D(X(r,a));return{spine:{twist:S(8)*o*-1},["arm"+i]:{world:st(a,h,(n.arm+n.fore)*.985),pole:[0,-1,0],poleWorld:!0,palm:[0,-1,0],palmWorld:!0,curl:.6,fingers:[.02,.9,.95,1],thumb:.75,tight:.75}}}},present:{in:.6,out:.8,hold:2.4,f:(n,t,e,s)=>{let i=s.side==="R"?"R":"L",o=i==="L"?1:-1,a=Y(.2,2.2,t);return{spine:{twist:S(w(-8,14,a))*o,bend:S(-3)},head:{yaw:S(w(-10,26,a))*o},["arm"+i]:{raise:S(w(62,84,a)),azim:S(w(18,104,a)),bend:S(w(34,10,a)),twist:S(-30),palm:[0,1,.2],curl:.05,tight:.3}}}},startle:{in:.11,out:.9,hold:.7,f:(n,t)=>{let e=1-.35*Y(.15,.7,t);return{spine:{bend:S(-10)*e},hip:{h:1-.035*e,dz:-.025*e},shrug:.5*e,armL:{raise:S(66),azim:S(68),bend:S(80),twist:S(60),palm:[0,.2,1],curl:0,spread:1.4,tight:.8},armR:{raise:S(66),azim:S(68),bend:S(80),twist:S(60),palm:[0,.2,1],curl:0,spread:1.4,tight:.8}}}},shield:{in:.3,out:.6,hold:2,f:(n,t,e,s)=>{let i=s.side==="L"?"L":"R",o=i==="L"?1:-1;return{spine:{bend:S(-4)},shrug:.25,["arm"+i]:{hand:[-o*.62*n.clav,n.clavDrop+.95*n.D,.55*n.D],pole:[o*.9,.1,.2],palm:[0,.35,1],curl:.08,tight:.7}}}},reach:{in:.32,out:.5,hold:1.4,f:(n,t,e,s)=>{let i=s.side==="L"?"L":"R",o=i==="L"?1:-1,a=e.rig.J["sh"+i],r=s.at||e.eye,h=X(r,a),l=ot(h),c=(n.arm+n.fore)*.99,u=s.grab!=null?Y(s.grab,s.grab+.18,t):0;return{spine:{bend:S(13),twist:S(-9)*o},hip:{dz:.03},["arm"+i]:{world:st(a,h,Math.min(c,Math.max(.1,l-.12))/Math.max(1e-6,l)),pole:[0,-1,0],poleWorld:!0,palm:D(h),palmWorld:!0,curl:w(.03,.85,u),tight:1}}}},hold:{in:.25,out:.5,hold:1/0,f:(n,t,e,s)=>{let i=s.side==="R"?"R":"L",o=e.rig.J["sh"+i],a=s.at||e.eye,r=X(a,o),h=ot(r),l=(n.arm+n.fore)*.97;return{["arm"+i]:{world:st(o,r,Math.min(l,Math.max(.1,h-.1))/Math.max(1e-6,h)),pole:[0,-1,0],poleWorld:!0,palm:D(r),palmWorld:!0,curl:.85,tight:.9}}}},ui:{in:.25,out:.4,hold:1/0,f:(n,t,e,s,i)=>{let o=s.side==="L"?"L":"R",a=o==="L"?1:-1,r=s.rate??4.5,h=Math.floor(t*r),l=t*r-h;if(i.n!==h&&(i.n=h,i.from=i.to||[0,0],i.to=[(Vt(h*7+1)-.5)*.36,(Vt(h*13+5)-.5)*.24],h>0&&s.onTap))try{s.onTap(i.from,h)}catch(d){console.error(d)}let c=Y(0,.45,l),u=w(i.from[0],i.to[0],c),m=w(i.from[1],i.to[1],c),g=.05*ls(l,.78,.12);return{["arm"+o]:{hand:[-a*.42*n.clav+u,-.02*n.D+m,.86*n.fore+.1*n.arm+g],pole:[a*.75,-.65,0],palm:[0,-.35,1],curl:.4,fingers:[.04,.5,.62,.75],thumb:.5,wrist:S(-14),tight:1},head:{pitch:S(-7),yaw:S(-5)*a}}}},shrug:{in:.25,out:.45,hold:.5,f:()=>({shrug:.75,head:{roll:S(6)},armL:{raise:S(26),azim:S(58),bend:S(64),twist:S(-40),palm:[.2,.9,.4],curl:.1},armR:{raise:S(26),azim:S(58),bend:S(64),twist:S(-40),palm:[-.2,.9,.4],curl:.1}})},bounce:{in:.1,out:.3,hold:.9,f:(n,t)=>({hip:{dy:-.03*Math.abs(Math.sin(t*Math.PI*2.3))*x(1.2-t,0,1)},shrug:.1,armL:{raise:S(20),azim:S(84),bend:S(30)},armR:{raise:S(20),azim:S(84),bend:S(30)}})},winded:{in:.6,out:.9,hold:2.4,f:(n,t)=>{let e=Math.sin(t*5.2);return{hip:{h:.93,pitch:S(10)},spine:{bend:S(40+3*e)},shrug:.2+.12*e,head:{pitch:S(-12+5*e)},armL:{hand:[-.12*n.clav,-1.16*n.D,.62*n.D],pole:[1,-.2,-.4],palm:[0,-.3,-1],curl:.55,tight:.8},armR:{hand:[.12*n.clav,-1.16*n.D,.62*n.D],pole:[-1,-.2,-.4],palm:[0,-.3,-1],curl:.55,tight:.8}}}}};var ft=[["L",1],["R",-1]],Ut={L:0,R:.5},ds=2*Math.PI,Ot=n=>n-Math.floor(n),pt=(n,t)=>Math.cos(ds*(n-t)),Le=(n,t)=>Math.cos(2*ds*(n-t)),yt=n=>Math.atan2(Math.sin(n),Math.cos(n)),Cs=(n,t,e)=>n+yt(t-n)*e;function qs(n,t,e){let s=e.raise??n.hang,i=e.azim??80*A,o=e.bend??10*A,a=e.twist??0,r=[t*Math.sin(s)*Math.sin(i),-Math.cos(s),Math.sin(s)*Math.cos(i)],h=[0,0,1];h=X(h,F(r,K(h,r))),ot(h)<.001&&(h=[0,1,0]),h=V(Pt(r,-t*a),D(h));let l=D(q(F(r,Math.cos(o)),F(h,Math.sin(o))));return{hand:q(F(r,n.arm),F(l,n.fore)),pole:r}}function Fe(n,t,e={}){let s=e.hand||e.world?{hand:e.hand?e.hand.slice():null,pole:e.pole?e.pole.slice():[t*.5,-.6,-.8]}:qs(n,t,e);return{hand:s.hand,pole:D(s.pole),world:e.world?e.world.slice():null,poleWorld:!!e.poleWorld,palm:e.palm?D(e.palm):[-t,0,.25],palmWorld:!!e.palmWorld,curl:e.curl??.22,wrist:e.wrist||0,tight:e.tight??0,up:e.up||0,fwd:e.fwd||0,hdir:e.hdir?D(e.hdir):null,hdirW:e.hdir?e.hdirW??1:0,fingers:e.fingers?e.fingers.slice():null,thumb:e.thumb??null,spread:e.spread??.55}}function Gs(n,t,e){let s=x(K(n,t),-1,1);if(s>.9995)return D(q(F(n,1-e),F(t,e)));if(s<-.9995)return kt(n,t,e);let i=Math.acos(s),o=Math.sin(i);return q(F(n,Math.sin((1-e)*i)/o),F(t,Math.sin(e*i)/o))}function fs(n,t,e){if(e<=5e-4)return n;if(e>=.9995)return t;let s=ot(n.hand),i=ot(t.hand);return{hand:F(Gs(D(n.hand),D(t.hand),e),w(s,i,e)),pole:kt(n.pole,t.pole,e),world:null,poleWorld:!1,palm:kt(n.palm,t.palm,e),palmWorld:!1,curl:w(n.curl,t.curl,e),wrist:w(n.wrist,t.wrist,e),tight:w(n.tight,t.tight,e),up:w(n.up,t.up,e),fwd:w(n.fwd,t.fwd,e),hdir:n.hdir&&t.hdir?kt(n.hdir,t.hdir,e):t.hdir||n.hdir,hdirW:w(n.hdirW,t.hdirW,e),fingers:n.fingers||t.fingers?[0,1,2,3].map(o=>w(n.fingers?n.fingers[o]:n.curl,t.fingers?t.fingers[o]:t.curl,e)):null,thumb:n.thumb!=null||t.thumb!=null?w(n.thumb??n.curl,t.thumb??t.curl,e):null,spread:w(n.spread,t.spread,e)}}function us(n,t,e,s,i){for(let[o,a]of[[i,.012],[.07,.03],[0,.045]]){let r=X(st(n,t,o),e),h=ot(r);h<s+a&&(n=st(n,h>1e-4?F(r,1/h):[0,0,1],s+a-h))}return n}function _t(n,t,e,s,i=[]){let o=n[t],a=x(s*n.fps,0,n.n-1),r=Math.max(0,Math.min(Math.floor(a),n.n-2)),h=n.n>1?a-r:0,l=r*e;for(let c=0;c<e;c++)i[c]=o[l+c]+((n.n>1?o[l+e+c]:o[l+c])-o[l+c])*h;return i}var le=class{constructor(t){this.sg=t,this.p=[0,0],this.yaw=0,this.planted=!0,this.s=0,this.dur=.4,this.span=0,this.from=[0,0],this.fromYaw=0,this.to=[0,0],this.toYaw=0,this.h=0,this.clear=.05,this.lift=0,this.lift0=0,this.pitch=0,this.pitch0=0,this.settle=!1,this.liftPh=-1,this.landPh=-1}},ce=class{constructor(t){this.rig=t,this.pos=[0,0,0],this.yaw=0,this.vel=[0,0],this.speed=0,this.yawRate=0,this.ground=null,this.eye=[0,1.4,3],this.style={wobble:0,loose:.5,mech:0,energy:1,crouch:0,lean:0},this.feet={L:new le(1),R:new le(-1)},this.phase=0,this.ph=0,this.goal=null,this.facing=null,this.look={target:null,k:1},this.gestures=[],this.onStep=null,this.moves={},this.clip=null,this._stance=!1;let e=[0,0,0];this._sp={hipY:new nt(t.B.hipH,9,1),hipX:new nt(0,3.5,1),bend:new nt(0,3.2,.9),twist:new nt(0,3.5,.85),side:new nt(0,3,.9),roll:new nt(0,5,1),hyaw:new nt(0,5,1),head:new nt([0,0,0],3.4,.82),swing:{L:new nt(0,4.5,.9),R:new nt(0,4.5,.9)},hand:{L:new nt(e,5,.8),R:new nt(e,5,.8)},speed:new nt(0,2.2,1)},this._handInit=!1,this._seed=1+Math.floor(Math.random()*900),this._steps=0,this._held=null,this._heldAt=-1,this.place(0,0,0)}place(t,e,s=this.yaw){this.pos=[t,this._gy(t,e),e],this.yaw=s,this.vel=[0,0],this.speed=0,this.yawRate=0,this._sp.speed.set(0);for(let[i,o]of ft){let a=this.feet[i],r=this._home(o);a.p=r.p,a.yaw=r.yaw,a.planted=!0,a.h=0,a.lift=0,a.pitch=0,a.pitch0=0,a.s=0}if(this._finish(this.goal),this._finish(this.facing),this.goal=null,this.facing=null,this.clip){let i=this.clip;this.clip=null,this._finish(i)}return this._stance=!1,this._handInit=!1,this._sp.hipY.set(this.rig.B.hipH*.995),this}walkTo(t,e,s={}){return this.clip&&this.clip.legs&&this._endClip(),this._finish(this.goal),this._finish(this.facing),this.facing=null,this._stance=!1,new Promise(i=>{this.goal={x:t,z:e,speed:s.speed??.9,within:s.within??.06,face:s.face||null,burst:s.burst||1,res:i,stuck:0}})}face(t,e={}){return this._finish(this.facing),this._stance=!1,new Promise(s=>{this.facing={to:t,rate:(e.rate??150)*A,res:s}})}stopWalking(){this._finish(this.goal),this.goal=null}lookAt(t,e=1){return this.look.target=t,this.look.k=e,this}gesture(t,e={}){let s=cs[t];if(!s)return Promise.resolve();let i=this.gestures.find(o=>o.name===t&&!o.ending);return i&&(i.ending=!0),new Promise(o=>{this.gestures.push({name:t,def:s,opt:e,u:0,w:0,hold:e.hold??s.hold??1.5,k:e.k??1,ending:!1,res:o,state:{}})})}stop(t){for(let e of this.gestures)(!t||e.name===t)&&(e.ending=!0)}perform(t,e={}){let s=typeof t=="string"?this.moves[t]:t;if(!s||!s.n)return Promise.resolve(!1);this.clip&&this._endClip();let i=(e.legs??s.legs!==0)!==!1;return i&&(this.stopWalking(),this._finish(this.facing),this.facing=null),new Promise(o=>{let a=x(e.from??0,0,s.dur),r=x(e.to??s.dur,a,s.dur);this.clip={m:s,u:a,t0:a,t1:r,rate:e.rate??1,in:e.in??.25,out:e.out??.4,k:e.k??1,head:e.head??1,legs:i,arms:e.arms||"LR",w:0,w0:0,started:!1,wait:0,res:o,yaw0:0,cs:1,sn:0,bx:0,bz:0,off:{L:null,R:null},knee:{L:null,R:null},d0:[0,0],d0k:1}})}get performing(){return!!this.clip}get busy(){return!!(this.goal||this.facing)}_finish(t){if(t&&t.res){let e=t.res;t.res=null,e()}}_gy(t,e){return this.ground?this.ground(t,e):0}_home(t,e=this.yaw,s=this.pos){if(this._stance){let a=this.feet[t>0?"L":"R"];return{p:a.p.slice(),yaw:a.yaw}}let i=this.rig.B,o=t*i.pelvis*i.stance;return{p:[s[0]+Math.cos(e)*o,s[2]-Math.sin(e)*o],yaw:e+t*9*A}}update(t,e,s=null){e=x(e,0,.1);let i=this.rig,o=i.B,a=this.style;this._perf(e),this._steer(e),this._gait(t,e);let r=this._body(t,e);if(i.pose(r),this._arms(r,t,e),this._head(r,t,e,s),i.pose(r),a.mech>.01){let h=1/w(30,7,x(a.mech,0,1));this._held&&t-this._heldAt<h&&t>=this._heldAt?this._restore(this._held):(this._held=i.snapshot(),this._heldAt=t)}else this._held=null;return this}_restore(t){let e=this.rig;for(let s in t.J)e.J[s]=t.J[s].slice();e.headQ=t.headQ.slice(),e.chestQ=t.chestQ.slice(),e.palm={L:t.palm.L.slice(),R:t.palm.R.slice()}}_steer(t){if(this.clip&&this.clip.started&&this.clip.legs)return;let e=this.goal,s=this.style,i=0,o=null,a=170*A;if(e){let d=e.x-this.pos[0],z=e.z-this.pos[2],v=Math.hypot(d,z);if(v<=e.within||v<.25&&this.speed<.05&&(e.stuck+=t)>1.2)this.goal=null,e.face?this.facing={to:e.face,rate:150*A,res:e.res}:this._finish(e);else{let b=Math.atan2(d,z),k=Math.abs(yt(b-this.yaw)),_=e.speed*(1-.3*s.wobble);i=_*(1-Y(35*A,110*A,k))*x(Math.sqrt(v/(.35+.35*_)),.12,1),o=b,a=w(150,330,Y(1.2,3,_))*A}}if(!this.goal&&this.facing){let d=this.facing,z=typeof d.to=="number"?d.to:Math.atan2(d.to[0]-this.pos[0],d.to[2]-this.pos[2]);o=z,a=d.rate,Math.abs(yt(z-this.yaw))<2.5*A&&(this.facing=null,this._finish(d),o=null)}let r=0;if(o!=null){let d=yt(o-this.yaw);r=x(d*5.5,-a,a)}this.yawRate+=(r-this.yawRate)*x(t*9,0,1),this.yaw=yt(this.yaw+this.yawRate*t);let h=this._sp.speed,l=this.speed,c=e&&e.burst>1?e.burst:1;h.hz=(i>h.x?w(1.5,2.6,Y(1,3,i)):2.6)*(c>1?1.8:1);let u=Math.max(0,h.step(i,t)),m=w(1.7,4.4,Y(1,3,i))*c,g=4.6;u=x(u,l-g*t,l+m*t),u!==h.x&&(h.x=u,h.v=x(h.v,-g,m)),this.speed=u,i===0&&this.speed<.02&&(this.speed=0,h.set(0)),t>0&&(this._acc=(this._acc||0)+(x((this.speed-l)/t,-6,6)-(this._acc||0))*x(t*6,0,1)),this.vel=[Math.sin(this.yaw)*this.speed,Math.cos(this.yaw)*this.speed],this.pos[0]+=this.vel[0]*t,this.pos[2]+=this.vel[1]*t,this.pos[1]=this._gy(this.pos[0],this.pos[2])}_perf(t){let e=this.clip;if(!e)return;let s=e.m,i=this.feet;if(!e.started){if(e.wait+=t,e.legs&&e.wait<.7&&!(this.speed<.05&&i.L.planted&&i.R.planted))return;e.started=!0;let o=_t(s,"p",3,e.t0);if(e.yaw0=this.yaw-o[2],e.cs=Math.cos(e.yaw0),e.sn=Math.sin(e.yaw0),e.legs){let a={L:_t(s,"fL",10,e.t0),R:_t(s,"fR",10,e.t0)},r=this._clipAt(e,(a.L[0]+a.R[0])/2,(a.L[1]+a.R[1])/2);e.bx=(i.L.p[0]+i.R.p[0])/2-r[0],e.bz=(i.L.p[1]+i.R.p[1])/2-r[1],e.d0=[this.pos[0]-(i.L.p[0]+i.R.p[0])/2,this.pos[2]-(i.L.p[1]+i.R.p[1])/2];for(let[h]of ft){let l=this._clipAt(e,a[h][0],a[h][1]);e.off[h]={d:[i[h].p[0]-l[0],i[h].p[1]-l[1]],yaw:yt(i[h].yaw-(e.yaw0+a[h][2])),k:1,up:!1}}this._sp.speed.set(0)}}if(e.u=Math.min(e.t1,e.u+t*e.rate),e.w0=Math.min(Y(0,e.in,(e.u-e.t0)/e.rate),Y(0,e.out,(e.t1-e.u)/e.rate)),e.w=e.w0*e.k,e.legs){let o=_t(s,"p",3,e.u),a=this._clipAt(e,o[0],o[1]);this.yaw=yt(e.yaw0+o[2]),this.yawRate=0,this.speed=0,this.vel=[0,0],this._acc=0;for(let[c]of ft){let u=_t(s,"f"+c,10,e.u),m=e.off[c],g=i[c],d=u[6]>.99;!d&&m.k>0&&(m.k=Math.max(0,m.k-t/.18));let z=this._clipAt(e,u[0],u[1]),v=m.k*m.k*(3-2*m.k);d&&!g.planted&&this.onStep&&this.onStep(c,.6),g.p=[z[0]+m.d[0]*v,z[1]+m.d[1]*v],g.yaw=e.yaw0+u[2]+m.yaw*v,g.h=u[3]*e.w0,g.lift=u[4]*e.w0,g.pitch=u[5]*e.w0,g.pitch0=0,g.planted=d,g.s=d?0:.5,g.settle=!1,e.knee[c]=[u[7],u[8],u[9]]}e.d0k=Math.max(0,e.d0k-t/.5);let r=(i.L.p[0]+i.R.p[0])/2,h=(i.L.p[1]+i.R.p[1])/2,l=e.d0k*e.d0k*(3-2*e.d0k);this.pos[0]=r+(a[0]-r)*e.w0+e.d0[0]*l*(1-e.w0),this.pos[2]=h+(a[1]-h)*e.w0+e.d0[1]*l*(1-e.w0),this.pos[1]=this._gy(this.pos[0],this.pos[2])}e.u>=e.t1&&this._endClip()}_clipAt(t,e,s){return[t.bx+e*t.cs+s*t.sn,t.bz-e*t.sn+s*t.cs]}_endClip(){let t=this.clip;if(t){if(this.clip=null,t.started&&t.legs){for(let[s]of ft){let i=this.feet[s];i.planted=!0,i.h=0,i.lift=0,i.pitch=0,i.s=0,i.settle=!1,i.landPh=this.ph-2}let e=0;for(let[s,i]of ft){let o=this.feet[s],a=this._home(i);e=Math.max(e,Math.hypot(o.p[0]-a.p[0],o.p[1]-a.p[1])+Math.abs(yt(o.yaw-a.yaw))*.25)}this._stance=e<.17}this._finish(t)}}_pace(t){let e=this.rig.B,s=this.style,i=e.leg,o=t/i,a=Y(1.8,2.5,t),r=(.86+.42*Math.min(o,2.8))*(1-.3*s.wobble),h=.4+.62*o,l=w(r,h,a)*i,c=w(x(.66-.04*o,.57,.66)+.03*s.wobble,x(.75/h,.2,.38),a);return{run:a,vh:o,stride:l,SL:l/2,duty:c,T:l/Math.max(t,.3)}}_ankleOf(t){let e=this.rig.B,s=Math.sin(t.yaw),i=Math.cos(t.yaw),o=this._gy(t.p[0],t.p[1])+t.h;if(t.lift>1e-4){let a=Math.cos(t.lift),r=Math.sin(t.lift),h=e.ankle-e.r.toe,l=e.foot*(1-a)+h*r;return{at:[t.p[0]+s*l,o+e.r.toe+e.foot*r+h*a,t.p[1]+i*l],pitch:-t.lift}}return{at:[t.p[0],o+e.ankle,t.p[1]],pitch:t.pitch}}_gait(t,e){if(this.clip&&this.clip.started&&this.clip.legs){this._moving=!1,this.phase=Ot(this.ph),this._run=0;return}let s=this.rig.B,i=this.speed,o=this.style,a=this.feet,r=s.leg,h=this._pace(i),l=this._run=h.run,c=this._SL=h.SL,u=this._duty=h.duty,m=this._T=h.T,g=h.vh,d=i>.08,z=[Math.sin(this.yaw),Math.cos(this.yaw)],v=E=>(this.pos[0]-E.p[0])*z[0]+(this.pos[2]-E.p[1])*z[1],b=d?e/m*(1+.22*o.wobble*dt(t*1.7,this._seed)):0,k=w(.075-.02*o.wobble,.25,l),_=w(.44*c*Math.min(1,i/.3),.17*r,l);if(d){if(!this._moving){let R=a.L.planted?a.R.planted?null:"R":"L";R?this.ph=Math.floor(this.ph)+2+x(1-(1-x(a[R].s,0,1))*a[R].dur/m,u,.98)-Ut[R]:this.ph=Math.floor(this.ph)+2+u-Ut[v(a.L)>=v(a.R)?"L":"R"];for(let[f]of ft)a[f].landPh=this.ph-2}let E=0;for(let[R]of ft){let f=a[R],y=Ot(this.ph+Ut[R]);f.planted&&y<u&&(E=Math.max(E,v(f)+_-y*2*c))}this.ph+=b+x(E/(2*c),0,.2)*x(e*8,0,1);for(let[R]of ft){let f=a[R],y=Ot(this.ph+Ut[R]);if(f.planted&&y>=u&&this.ph-f.landPh>.55*u){let p=Math.max(1-y,.6*(1-u));this._liftOff(f,p*m,k,!1,p)}}}if(this.phase=Ot(this.ph),this._moving=d,d)this._stance=!1;else if(this._stance&&a.L.planted&&a.R.planted){let E=x(e*3,0,1);this.pos[0]+=((a.L.p[0]+a.R.p[0])/2-this.pos[0])*E,this.pos[2]+=((a.L.p[1]+a.R.p[1])/2-this.pos[2])*E,this.pos[1]=this._gy(this.pos[0],this.pos[2])}for(let[E,R]of ft){let f=a[E],y=a[E==="L"?"R":"L"];if(f.planted){let B=this._home(R),N=Math.hypot(f.p[0]-B.p[0],f.p[1]-B.p[1]),C=Math.abs(yt(f.yaw-B.yaw)),G=v(f);if(!d&&y.planted&&(N>.065||C>21*A)){let Q=Math.hypot(y.p[0]-this._home(-R).p[0],y.p[1]-this._home(-R).p[1])+Math.abs(yt(y.yaw-this._home(-R).yaw))*.2;if(N+C*.2>=Q){this._liftOff(f,x(.26+N*.5,.26,.42),.028+.1*N,!0);continue}}else if(d&&G>w(.63,.85,l)*r&&(y.planted||l>.4||y.s>.5)){this._liftOff(f,(1-u)*m*.8,k,!1,(1-u)*.8);continue}let W=0;if(d){let Q=x(Ot(this.ph+Ut[E])/u,0,1);W=w(w(55,62,Y(1,1.9,g))*(1-.3*o.wobble)*Math.pow(x((Q-.5)/.5,0,1),1.6),66*Math.pow(x((Q-.38)/.62,0,1),1.5),l)*A*Y(0,.3*r,G)}f.lift=d?Math.max(W,f.lift-6*e):f.lift+(W-f.lift)*x(e*20,0,1);let j=d?f.pitch0*(1-Y(0,w(.11,.05,l),this.ph-f.landPh)):0;f.pitch+=(j-f.pitch)*x(e*30,0,1);continue}!d&&!f.settle&&(f.settle=!0,f.dur=x((1-f.s)*f.span*m,.1,.3)/Math.max(.05,1-f.s)),f.s+=f.settle?e/f.dur:b/Math.max(.05,f.span);let p=Math.max(0,1-f.s)*(f.settle?f.dur:f.span*m);if(f.settle&&!d){let B=this._home(R);f.to=B.p,f.toYaw=B.yaw}else{let B=this.yaw+this.yawRate*p*.6,N=Math.sin(B),C=Math.cos(B),G=o.wobble*.05*dt(this._steps*1.37+R,this._seed+3),W=R*s.pelvis*w(s.stance,w(.85,.6,l),Y(.05,.5,i))+G+R*.03*o.wobble,j=p*(this.speed+.5*x(this._acc||0,-5,5)*p);f.to=[this.pos[0]+N*(j+_)+C*W,this.pos[2]+C*(j+_)-N*W],f.toYaw=B+R*w(7,4,l)*A}let M=x(f.s,0,1),P=Math.pow(M,1.12),T=f.settle?w(M,M*M*(3-2*M),.75):w(w(M,M*M*(3-2*M),.75),P*P*(3-2*P),l);if(f.p=[w(f.from[0],f.to[0],T),w(f.from[1],f.to[1],T)],f.yaw=Cs(f.fromYaw,f.toYaw,T),f.settle)f.h=f.clear*Math.sin(Math.PI*M),f.lift=f.lift0*(1-Y(0,.55,M)),f.pitch=0;else{let B=w(.33,.37,l);f.h=f.clear*(M<B?Math.sin(.5*Math.PI*M/B):Math.cos(.5*Math.PI*(M-B)/(1-B))**2);let N=Math.max(f.lift0,w(60,80,l)*A*(1-.4*o.wobble)*Y(.1,.5,g)),C=w(.2,.32,l),G=w(.8,.9,l);f.lift=M<C?w(f.lift0,N,Y(0,C,M)):N*(1-Y(C,G,M));let W=w(w(14,26,Y(.5,1.5,g))*(1-.75*o.wobble)*Y(.12,.5,g),2,l)*A;f.pitch=W*Y(G-.02,1,M)}f.s>=1&&(f.planted=!0,f.p=f.to.slice(),f.yaw=f.toYaw,f.h=0,f.lift=0,f.pitch0=f.pitch,f.landPh=this.ph,this._steps++,this.onStep&&this.onStep(E,f.settle?.35:w(.6,1,l)))}}_liftOff(t,e,s,i,o=.38){t.planted=!1,t.s=0,t.dur=Math.max(.12,e),t.span=o,t.clear=s,t.settle=i,i||(t.liftPh=this.ph),t.from=t.p.slice(),t.fromYaw=t.yaw,t.lift0=t.lift,t.pitch=0,t.pitch0=0,t.to=t.p.slice(),t.toYaw=t.yaw}_body(t,e){let s=this.rig,i=s.B,o=this.style,a=this.feet,r=this._sp,h=this.speed,l=this._run||0,c=i.leg,u=h/c,m=[Math.sin(this.yaw),Math.cos(this.yaw)],g=[Math.cos(this.yaw),-Math.sin(this.yaw)],d=Y(.05,.5,h),z=o.energy,v=this.phase,b=this._duty||.62,k={},_={},E={};for(let[U]of ft){let H=a[U];k[U]=H.planted?1:1-Math.sin(Math.PI*x(H.s,0,1)),_[U]=(H.p[0]-this.pos[0])*m[0]+(H.p[1]-this.pos[2])*m[1],E[U]=this._ankleOf(H)}let R=Math.max(.2,k.L+k.R),f=(k.L*a.L.p[0]+k.R*a.R.p[0])/R-this.pos[0],y=(k.L*a.L.p[1]+k.R*a.R.p[1])/R-this.pos[2],p=(1-d)*z*.013*(Math.sin(t*.47+this._seed)+.5*Math.sin(t*.83+2*this._seed)),M=r.hipX.step((f*g[0]+y*g[1])*.5*(1-d)+p,e),P=c*w(w(.04,.018,Y(1,2,u)),.011,l)*(1+o.wobble),T=M+d*P*pt(v,.4),B=1e3;for(let[U,H]of ft){let O=a[U];if(!(O.planted||O.s>.86||O.s<.1))continue;let lt=E[U].at,Mt=this.pos[0]+g[0]*(H*i.pelvis+T),It=this.pos[2]+g[1]*(H*i.pelvis+T),Qt=Math.hypot(lt[0]-Mt,lt[2]-It),bt=c*.996;B=Math.min(B,lt[1]-this.pos[1]+Math.sqrt(Math.max(bt*bt-Qt*Qt,.6*bt*bt))+i.pelvisDrop)}let N=i.hipH*(.995-.3*o.crouch-.012*o.wobble)-.04*c*l,C=-l*.05*c*Le(v,b/2),G=Math.min(N,B*.995);r.hipY.hz=G<r.hipY.x?w(9,12,l):w(3.2,5,l);let W=Math.min(r.hipY.step(G,e)+C,B*.998),j=d*w(3.5*pt(v,.1),3.5*pt(v,.6),l)*A,Q=d*w(5.5*(1+o.wobble)*pt(v,.44),4.5*pt(v,.43),l)*A,I=Y(.9,1.9,u),J=d*w(w(4.5,6,I)*pt(v,.5),10*pt(v,.5),l)*A,$=Math.sin(t*1.25+this._seed),rt=(1.5+3*Math.min(h,1.4)/1.2)*A*d+l*4*A+(this._acc||0)*1.6*A+o.lean+5*A*o.wobble+.012*z*$,mt=0,et=-this.yawRate*h*.035-M/Math.max(.01,i.D)*.22,ut=d*w(1.6*Le(v,.48),2.4*Le(v,.25),l)*A,tt={pos:this.pos.slice(),yaw:this.yaw,hip:{h:1,dy:W-i.hipH,dx:T,dz:.012*d,yaw:-j,roll:Q,pitch:l*3*A},spine:{bend:rt,twist:mt,side:et},shrug:.03*z*(.5+.5*$),head:{yaw:0,pitch:0,roll:0}};for(let[U,H]of ft){let O=a[U];tt["leg"+U]={ankle:E[U].at,pitch:E[U].pitch,toe:[Math.sin(O.yaw),0,Math.cos(O.yaw)],knee:[H*.12,0,1]}}let at=this.clip&&this.clip.started&&this.clip.w>0?this.clip:null,Z=at?at.w:0;if(at){let U=_t(at.m,"h",6,at.u),H=_t(at.m,"s",3,at.u),O=tt.hip;if(at.legs){O.dx=w(O.dx,U[0],Z),O.dz=w(O.dz,U[2],Z),O.dy=w(O.dy,Math.min(i.hipH+U[1],B*.998)-i.hipH,Z);for(let[lt]of ft)at.knee[lt]&&(tt["leg"+lt].knee=kt(tt["leg"+lt].knee,at.knee[lt],Z));O.yaw=w(O.yaw,U[3],Z),O.pitch=w(O.pitch,U[4],Z),O.roll=w(O.roll,U[5],Z),rt=w(rt,H[0],Z),et=w(et,H[1],Z),mt=w(mt,H[2],Z)}else{let lt=Z*(1-d);O.dy=Math.min(O.dy+x(U[1],-.3,.02)*lt,B*.998-i.hipH),O.yaw=w(O.yaw,U[3],lt),O.pitch=w(O.pitch,U[4],lt),O.roll=w(O.roll,U[5],lt),rt=w(w(rt,H[0],Z),rt+H[0]*Z,d),et=w(w(et,H[1],Z),et+H[1]*Z,d),mt=w(w(mt,H[2],Z),mt+H[2]*Z,d)}}r.bend.hz=w(3.2,14,Z),r.twist.hz=w(3.5,14,Z),r.side.hz=w(3,14,Z),this._gest=this._gestures(t,e);for(let U of this._gest){let H=U.pose,O=U.w;H.spine&&(rt+=(H.spine.bend||0)*O,mt+=(H.spine.twist||0)*O,et+=(H.spine.side||0)*O),H.hip&&(tt.hip.dy+=(H.hip.dy||0)*O-(1-(H.hip.h??1))*i.hipH*O,tt.hip.dz+=(H.hip.dz||0)*O,tt.hip.pitch+=(H.hip.pitch||0)*O,tt.hip.yaw+=(H.hip.yaw||0)*O),H.shrug&&(tt.shrug+=H.shrug*O)}return tt.spine.bend=r.bend.step(rt,e)+ut,tt.spine.twist=r.twist.step(mt,e)+j-J,tt.spine.side=r.side.step(et,e)+1.25*Q,this._fore=_,this._walk=d,tt}_gestures(t,e){let s=[],i=this.rig.B;for(let o=this.gestures.length-1;o>=0;o--){let a=this.gestures[o],r=a.def;if(a.u+=e,!a.ending&&a.u>(r.in??.4)+a.hold&&(a.ending=!0),a.w=x(a.w+e/Math.max(.05,a.ending?r.out??.5:r.in??.4)*(a.ending?-1:1),0,1),a.ending&&a.w<=0){this.gestures.splice(o,1),this._finish(a);continue}}for(let o of this.gestures){let a;try{a=o.def.f(i,o.u,this,o.opt,o.state)||{}}catch(r){console.error(r),a={}}s.push({g:o,pose:a,w:Ct(o.w)*o.k})}return s}_arms(t,e,s){let i=this.rig,o=i.B,a=this.style,r=this._sp,h=this._run||0,l=this._walk||0,c=i.chestQ,u=ze(c),m=a.energy,g=this.speed/o.leg,d=(4+4.5*Math.min(g,1.4)+14*Y(1.4,2,g))*(1-.5*a.wobble),z=.3*d+.8*Math.max(0,d-8);for(let[v,b]of ft){let k=Ot(this.ph+Ut[v]),_=l*w(-2+d*pt(k,.5),-12+22*pt(k,.42),h)*A,E=o.hang+l*w(2*pt(k,.45),3+5*pt(k,.55),h)*A+16*a.wobble*A+a.wobble*6*A*dt(e*1.3+b*5,this._seed+9),R=(1-l)*m,f=_+R*1.2*A*Math.sin(e*.7+b*1.3+this._seed),y=Fe(o,b,{raise:Math.hypot(f,E),azim:Math.atan2(E,f+1e-6),bend:w(13,w(27+z*pt(k,.58),98+11*pt(k,.38),h),l)*A+10*a.wobble*A+R*1.5*A*Math.sin(e*.9+b),curl:.22+.3*h}),p=this.clip&&this.clip.started&&this.clip.w>0&&this.clip.arms.includes(v)?this.clip:null,M=null;if(p){let I=p.m.an||(p.m.an=Math.round(p.m.aL.length/p.m.n)),J=_t(p.m,"a"+v,I,p.u);M=V(c,[J[3],J[4],J[5]]);let $=this._clear([o.arm*J[0]+o.fore*J[3],o.arm*J[1]+o.fore*J[4],o.arm*J[2]+o.fore*J[5]],b,[J[3],J[4],J[5]],u);y=fs(y,Fe(o,b,{hand:$,pole:[J[0],J[1],J[2]],palm:[J[8],J[9],J[10]],curl:.26,tight:.75,up:J[6],fwd:J[7],hdir:I>=14?[J[11],J[12],J[13]]:null}),p.w)}for(let I of this._gest){let J=I.pose["arm"+v];if(!J||I.w<=0)continue;let $=Fe(o,b,J);$.world&&($.hand=V(u,X($.world,i.J["sh"+v])),$.world=null,$.poleWorld&&($.pole=V(u,$.pole),$.poleWorld=!1)),$.palmWorld&&($.palm=V(u,$.palm),$.palmWorld=!1),y=fs(y,$,I.w)}let P=(o.arm+o.fore)*.998,T=ot(y.hand);T>P&&(y.hand=F(y.hand,P/T));let B=X(q(i.J["sh"+v],V(c,y.hand)),this.pos),N=r.hand[v];this._handInit||N.set(B);let C=x(a.loose,0,1)*(1-.8*x(y.tight,0,1));N.hz=w(14,4.2,C),N.damp=w(1,.72,C);let G=N.step(B,s),W=X(G,B),j=ot(W),Q=.22;if(j>Q&&(G=st(B,W,Q/j),N.x=G.slice()),G=q(G,this.pos),p&&i.J.head){let I=us(G,M,i.J.head,o.R,o.palm+.75*o.finger);I!==G&&(G=st(G,X(I,G),p.w0),N.x=X(G,this.pos))}t["arm"+v]={world:G.slice(),pole:V(c,y.pole),poleWorld:!0,palm:y.palm,curl:y.curl,wrist:y.wrist,fingers:y.fingers,thumb:y.thumb??void 0,spread:y.spread,up:y.up,fwd:y.fwd,hdir:y.hdir,hdirW:y.hdirW}}this._handInit=!0}_clear(t,e,s,i){let o=this.rig,a=o.B,r=o.J;r.head&&r["sh"+(e>0?"L":"R")]&&(t=us(t,s,V(i,X(r.head,r["sh"+(e>0?"L":"R")])),a.R,a.palm+.75*a.finger));let h=a.chestW+.035,l=a.r.chest+.04,c=t[0]+e*a.clav,u=t[2];if(t[1]<.03&&t[1]>-(a.spine[0]+a.spine[1]+a.spine[2]+.06)){let m=Math.hypot(c/h,u/l);if(m<1){let g=m>.001?1/m:0,d=m>.001?c*g:0,z=m>.001?u*g:l;t=[d-e*a.clav,t[1],z]}}return t}_head(t,e,s,i){let o=this.rig,a=this.style,r=ze(o.chestQ),h=a.energy,l=0,c=0,u=0,m=this.look,g=m.target==="eye"?this.eye:m.target;if(g){let k=o.J.head||o.J.neck,_=V(r,X(g,k));l=x(Math.atan2(_[0],_[2]),-78*A,78*A)*m.k,c=x(Math.atan2(_[1],Math.hypot(_[0],_[2])),-48*A,52*A)*m.k}else l=x(this.yawRate*.16,-.5,.5)+h*3*A*dt(e*.23,this._seed+21),c=h*2*A*dt(e*.19,this._seed+22)-a.wobble*16*A*(.6+.4*dt(e*.5,this._seed+23));l-=t.spine.twist*.9,c+=t.spine.bend*.55,u+=t.spine.side*.5;let d=this.clip&&this.clip.started&&this.clip.w>0?this.clip:null,z=d?d.w*d.head:0;if(d){let k=_t(d.m,"hd",3,d.u);l=w(l,k[0],z),c=w(c,k[1],z),u=w(u,k[2],z)}this._sp.head.hz=w(3.4,11,z),this._sp.head.damp=w(.82,1,z);for(let k of this._gest){let _=k.pose.head;if(!_)continue;let E=k.w;_.replace?(l=w(l,_.yaw||0,E),c=w(c,_.pitch||0,E),u=w(u,_.roll||0,E)):(l+=(_.yaw||0)*E,c+=(_.pitch||0)*E,u+=(_.roll||0)*E)}let v=this._sp.head.step([l,c,u],s),b=i||{yaw:0,pitch:0,roll:0};t.head={yaw:v[0]+b.yaw,pitch:v[1]+b.pitch,roll:v[2]+b.roll},t.spine.twist+=x(v[0],-1.2,1.2)*.22*(1-(this._walk||0)*.6)*(1-z)}joint(t){return this.rig.J[t]}};var ps=1,Ws=24,Ft=12,fe=64,Be=[.2126,.7152,.0722],ue=class{constructor(t,e={}){this.d=t,this.fps=t.fps,this.N=t.frames,this.O=t.origin,this.clips=new Map(t.clips.map(i=>[i.name,i])),this.doc=e.doc||document,this.src=e.src||[],this.grid=e.ground||null,this.speed=e.speed||(()=>1),this.tanX=Math.tan(t.hfov*A/2),this.tanY=this.tanX*t.aspect[1]/t.aspect[0];let s=t.sun||{yaw:80,pitch:5};this.sun=this.dir(s.pitch,s.yaw),this.v=[null,null],this.tex=[null,null],this.at=[0,0],this.dirty=[!0,!0],this.age=[0,0],this.front=0,this.mix=0,this.fade=null,this.frame=0,this.clip=null,this.phase="idle",this.rows=1,this.L=t.layout||null,this.picW=this.L?this.L.picture[0]:1920,this.picH=this.L?this.L.picture[1]:1080,this.texW=0,this.texH=0,this.pack=null,this.grey=null,this.steps=null,this.lutAt=null,this.ok=!1,this.stillImg=null,this._wait=null,this.reads=0,this.full=[!1,!1],this._going=!1,this.lim=[1e9,1e9],this.paused=!1,this.from=[0,0],this.lateAt=[0,0],this.tries=[0,0],this.stuck=!1}point(t,e,s){return[(this.O[1]-e)/100,(s-this.O[2])/100,(t-this.O[0])/100]}dir(t,e){let s=t*A,i=e*A;return[-Math.cos(s)*Math.sin(i),Math.sin(s),Math.cos(s)*Math.cos(i)]}spot(t,e){let s=t*A;return[-Math.sin(s)*e,Math.cos(s)*e]}ground(t,e){let s=this.grid;if(!s)return 0;let i=(this.O[0]+e*100-s.x0)/s.step,o=(this.O[1]-t*100-s.y0)/s.step,a=x(Math.floor(i),0,s.nx-2),r=x(Math.floor(o),0,s.ny-2),h=x(i-a,0,1),l=x(o-r,0,1),c=s.z,u=s.ny,m=c[a*u+r],g=c[(a+1)*u+r],d=c[a*u+r+1],z=c[(a+1)*u+r+1];return((m*(1-h)+g*h)*(1-l)+(d*(1-h)+z*h)*l-this.O[2])/100}floor(t,e,s=.45){return(this.ground(t,e)*2+this.ground(t+s,e)+this.ground(t-s,e)+this.ground(t,e+s)+this.ground(t,e-s))/6}normal(t,e,s=1.2){let i=(this.floor(t+s,e)-this.floor(t-s,e))/(2*s),o=(this.floor(t,e+s)-this.floor(t,e-s))/(2*s);return D([-i,1,-o])}camAt(t){let e=this.d.cam[x(Math.round(t),0,this.N-1)];return{pos:this.point(e[0],e[1],e[2]),dir:this.dir(e[3],e[4]),roll:e[5]*A}}camera(t,e){let s=this.camAt(this.frame),i=Math.max(t/2/this.tanX,e/2/this.tanY),o=s.pos,a=[o[0]+s.dir[0],o[1]+s.dir[1],o[2]+s.dir[2]];return ae(o,a,2*Math.atan(e/2/i),t,e,s.roll)}load(){if(this._load)return this._load;let t=()=>{let s=this.doc.createElement("video");s.muted=!0,s.playsInline=!0,s.preload="auto",s.disableRemotePlayback=!0;for(let i of this.src){let o=this.doc.createElement("source");o.src=i.url,i.type&&(o.type=i.type),s.append(o)}return s};this.v=[t(),t()],this.v.forEach((s,i)=>{if(!("requestVideoFrameCallback"in s))return;this._rvfc=!0;let o=()=>{this.dirty[i]=!0,s.requestVideoFrameCallback(o)};s.requestVideoFrameCallback(o),s.addEventListener("seeked",()=>{this.dirty[i]=!0})});let e=s=>new Promise(i=>{if(s.readyState>=2)return i(!0);let o=c=>{s.removeEventListener("loadeddata",a),s.removeEventListener("error",r),clearTimeout(l),i(c)},a=()=>o(!0),r=()=>o(!1);s.addEventListener("loadeddata",a),s.addEventListener("error",r);let h=s.querySelector("source:last-of-type");h&&h.addEventListener("error",r);let l=setTimeout(()=>o(s.readyState>=2),2e4);s.load()});return this._load=Promise.all(this.v.map(e)).then(s=>(this.ok=s.every(Boolean)&&this.v[0].videoHeight>0,this.ok&&this._layout(this.v[0].videoWidth,this.v[0].videoHeight,!0),this.ok)),this._load}still(t,e){return new Promise(s=>{let i=new Image;i.onload=()=>{this.stillImg=i,this.frame=e,this._layout(i.naturalWidth,i.naturalHeight,!1),this._stillNew=!0,s(!0)},i.onerror=()=>s(!1),i.src=t})}_layout(t,e,s){let i=this.L,o=i&&i.pack;this.texW=t,this.texH=e,this.picW=t,this.picH=i&&e>i.picture[1]?i.picture[1]:s?e-Ws:e,this.rows=this.picH/e,this.pack=o&&t===i.picture[0]&&e>=o.rowB+o.tile[1]/2?o:null,this.px=new Uint8Array(Math.max(t,fe*(Ft+4))*4)}_lut(t,e){let s=this.gl;if(!s||!this.grey)return;let i=new Float32Array(256),o=t?t.length:0;for(let a=0;a<256;a++){let r=a/255;if(o){let h=0;for(;h<o-2&&a>t[h+1];)h++;r=e[h]+(e[h+1]-e[h])*(a-t[h])/(t[h+1]-t[h])}i[a]=x(r,0,1)}s.bindTexture(s.TEXTURE_2D,this.grey),s.texImage2D(s.TEXTURE_2D,0,s.R16F,256,1,0,s.RED,s.FLOAT,i),this.lut=i}_steps(){let t=this.L&&this.L.steps,e=this.px;if(!t||(t.x+t.n*t.w)*4>e.length)return;let s=[];for(let o=0;o<t.n;o++){let a=0;for(let r=-2;r<=2;r++){let h=(t.x+o*t.w+(t.w>>1)+r*5)*4;a+=Be[0]*e[h]+Be[1]*e[h+1]+Be[2]*e[h+2]}s.push(a/5)}for(let o=1;o<t.n;o++)if(s[o]<s[o-1]+3)return;if(s[t.n-1]-s[0]<120)return;let i=this.steps||(this.steps=s.slice());for(let o=0;o<t.n;o++)i[o]+=(s[o]-i[o])*.15;(!this.lutAt||i.some((o,a)=>Math.abs(o-this.lutAt[a])>.3))&&(this.lutAt=i.slice(),this._lut(i,i.map((o,a)=>t.y?(t.y[a]-16)/219:a/(t.n-1))))}attach(t){if(this.gl!==t){this.gl=t;for(let e=0;e<2;e++){let s=this.tex[e]=t.createTexture();t.bindTexture(t.TEXTURE_2D,s),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}this.fbo=t.createFramebuffer(),this.px||(this.px=new Uint8Array(fe*(Ft+4)*4)),this.grey=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.grey),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),this._lut(null)}}_seek(t,e){return new Promise(s=>{let i=(e+.5)/this.fps,o=()=>{t.removeEventListener("seeked",o),clearTimeout(a),s()},a=setTimeout(o,1500);t.addEventListener("seeked",o),t.currentTime=i})}_play(t){t.playbackRate=x(this.speed(),.25,4);let e=t.play();e&&e.catch&&e.catch(()=>{})}_clock(t){return x(Math.floor(this.v[t].currentTime*this.fps+.001),0,this.N-1)}async go(t,{fade:e=.35}={}){let s=this.clips.get(t);if(!s)throw new Error("no clip "+t);if(!this.ok){this.clip=s,this.phase=s.loop?"hold":"end",this.frame=s.loop?s.loop[0]:s.start+s.frames-1;return}let i=this._goId=(this._goId||0)+1;if(this._wait){let h=this._wait;this._wait=null,h.res()}for(;this.fade&&this._goId===i;)await new Promise(h=>setTimeout(h,30));if(this._goId!==i)return;let o=this.phase==="idle",a=o?this.front:1-this.front,r=this.v[a];if(this._going=!0,this.from[a]=s.start,this.tries[a]=0,this.lateAt[a]=0,r.pause(),await this._seek(r,s.start),this._goId===i)return this.clip=s,this.phase=s.move>0||!s.loop?"move":"hold",this._ready=!1,this._going=!1,this.full[a]=!1,this.lim[a]=s.loop?s.loop[1]-1:s.start+s.frames-1,this.paused||this._play(r),o?(this.front=a,this.mix=0):this.fade={t:0,T:Math.max(0,e)},new Promise(h=>{this._wait={clip:s,res:h}})}_swap(){this.v[this.front].pause(),this.front=1-this.front,this.mix=0,this.fade=null}stop(){for(let t of this.v)t&&t.pause();if(this.phase="idle",this.fade=null,this.mix=0,this._going=!1,this._ready=!1,this._goId=(this._goId||0)+1,this._wait){let t=this._wait;this._wait=null,t.res()}}giveUp(){this.stop(),this.ok=!1,this.front=0}_late(t){let e=performance.now();if(!this.lateAt[t]){this.lateAt[t]=e;return}if(e-this.lateAt[t]<4e3||this._again)return;if(this.tries[t]>=3){if(this.stuck=!0,this.fade=null,this.mix=0,this._wait){let i=this._wait;this._wait=null,i.res()}return}this.tries[t]++,this._again=!0;let s=this.v[t];s.pause(),this._seek(s,this.from[t]).then(()=>{this._again=!1,this.lateAt[t]=0,this.full[t]=!1,!this.paused&&this.phase!=="idle"&&this._play(s)})}pause(t){if(!(!this.ok||this.phase==="idle")){this.paused=!!t;for(let e=0;e<2;e++){let s=this.v[e],i=e===this.front||!!this.fade;t?s.pause():i&&this.phase!=="end"&&this._clock(e)<=this.lim[e]&&this._play(s)}}}_number(t){let e=this.gl,s=this.v[t],i=Math.min(this.px.length/4,s.videoWidth),o=s.videoHeight-8;e.bindFramebuffer(e.FRAMEBUFFER,this.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.tex[t],0);let a=-1;if(e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE){e.readPixels(0,o,i,1,e.RGBA,e.UNSIGNED_BYTE,this.px);let r=h=>this.px[(h*fe+fe/2)*4+1]>127?1:0;if(r(Ft)&&!r(Ft+1)&&r(Ft+2)&&!r(Ft+3)){a=0;for(let h=0;h<Ft;h++)a|=r(h)<<h;this._steps()}this.reads++}return e.bindFramebuffer(e.FRAMEBUFFER,null),a}_upload(t,e=0){let s=this.gl,i=this.v[t];if(!i||i.readyState<2||!i.videoWidth||i.seeking)return!1;if(this._clock(t)>this.lim[t])return i.paused||i.pause(),this.full[t];if(this.age[t]+=e,this._rvfc&&!this.dirty[t]&&this.age[t]<.12&&this.full[t])return!0;this.dirty[t]=!1,this.age[t]=0,this.full[t]=!0,s.bindTexture(s.TEXTURE_2D,this.tex[t]),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.NONE),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,i);let o=this._clock(t),a=this.clip;if(!(a&&a.loop&&o>=a.loop[0]+2&&o<a.loop[1]-1)){let h=this._number(t);h>=0&&h<this.N&&(o=h)}return this.at[t]=Math.min(o,this.lim[t]),this.lateAt[t]=0,!0}tick(t){let e=this.gl;if(!e)return;if(this.stillImg){this._stillNew&&(this._stillNew=!1,e.bindTexture(e.TEXTURE_2D,this.tex[0]),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.NONE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,this.stillImg));return}if(!this.ok||this.phase==="idle"||this.paused||this.stuck)return;let s=this.clip,i=x(this.speed(),.25,4);for(let c of this.v)c.playbackRate!==i&&(c.playbackRate=i);if(this._upload(this.front,t),this.full[this.front]||this._late(this.front),this.fade){let c=1-this.front,u=this.fade,m=this._upload(c,t)&&this.full[c];m?u.t+=t:this._late(c),this.mix=u.T>0?x(u.t/u.T,0,1):0,m&&u.t>=u.T&&this._swap()}let o=this.fade&&this.full[1-this.front]?1-this.front:this.front,a=this.at[o];if(this.frame=a,!s)return;let r=s.start+s.frames-1,h=this.full[o]&&a>=s.start&&a<=r,l=this._clock(o)>this.lim[o];if(this.phase==="move"&&h){let c=s.loop?s.loop[0]:r;(a>=c||l||this.v[o].ended)&&(this.phase=s.loop?"hold":"end",s.loop||this.v[o].pause())}if(this._wait&&this._wait.clip===s&&this.phase!=="move"&&h){let c=this._wait;this._wait=null,c.res()}if(this.phase==="hold"&&!this.fade&&!this._going&&h){let c=1-this.front,u=this.v[c],m=(s.loop[1]-1-Math.max(a,this._clock(this.front)))/this.fps;!this._ready&&!this._seeking&&(this._seeking=!0,u.pause(),this.full[c]=!1,this.lim[c]=s.loop[1]-1,this.from[c]=s.loop[0],this.tries[c]=0,this.lateAt[c]=0,this._seek(u,s.loop[0]).then(()=>{this._seeking=!1,this._ready=this.clip===s&&!this._going})),this._ready&&m<=ps+.05&&(this._ready=!1,this._play(u),this.fade={t:0,T:x(m,.2,ps)})}}};var Us=9.81;function Ne(n){let e=new Uint8Array(65536),s=new Uint8Array(256*256*4),i=625341585,o=()=>(i^=i<<13,i^=i>>>17,i^=i<<5,i>>>8&255);for(let r=0;r<256*256;r++)e[r]=o();for(let r=0;r<256;r++)for(let h=0;h<256;h++){let l=r*256+h;s[4*l+1]=e[l],s[4*l]=e[(r+17)%256*256+(h+37)%256],s[4*l+2]=o(),s[4*l+3]=o()}let a=n.createTexture();return n.bindTexture(n.TEXTURE_2D,a),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,256,256,0,n.RGBA,n.UNSIGNED_BYTE,s),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.REPEAT),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.REPEAT),a}var Os=`
uniform sampler2D uNoise;
uniform vec3 uSun;          // toward the sun
uniform vec4 uShore;        // the still water line's z, the beach's slope, the waves' period (s), the sea's clock (s)
uniform vec4 uWave;         // the uprush's speed (m/s), the big wave's number, its strength, how rough the sea is
uniform vec4 uFeet;         // White's feet: x, z, x, z
uniform vec4 uFoot[16];     // his footprints: x, z, heading, how deep (0: none)
uniform vec4 uMon;          // the scorer: how far it has come in (0..1), its screen's light, where its eye looks (x, y)
uniform vec4 uMonAt;        // where it hangs (m) and how big it is
uniform vec4 uBeam;         // its search light: where it falls (x, z), how wide (m), how strong
uniform vec4 uBug;          // the world coming apart: how much (0..1), its clock, the block size (px), which view wins
uniform float uQuality;     // 0: plain, 1: everything

#define ZS uShore.x
#define SLOPE uShore.y
#define TW uShore.z
#define TS uShore.w
const float PI = 3.14159265;
const vec3 SUNCOL = vec3(1.0, 0.55, 0.25);

// ---- noise ---------------------------------------------------------------------------------------
float n2(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return textureLod(uNoise, (i + f + 0.5) / 256.0, 0.0).r; }
float n3(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  vec2 rg = textureLod(uNoise, (i.xy + vec2(37.0, 17.0) * i.z + f.xy + 0.5) / 256.0, 0.0).yx;
  return mix(rg.x, rg.y, f.z);
}
float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * n2(p); p = p * 2.03 + vec2(17.3, 9.1); a *= 0.5; } return s; }
float fbm3(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 3; i++) { s += a * n2(p); p = p * 2.03 + vec2(17.3, 9.1); a *= 0.5; } return s; }
vec2 hash2(vec2 c) { return texelFetch(uNoise, ivec2(mod(c, 256.0)), 0).ba; }
// scattered points: how far apart the nearest two are from here (small on the lines between cells)
float cells(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float f1 = 9.0, f2 = 9.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 r = g + hash2(i + g) - f;
    float d = dot(r, r);
    if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) f2 = d;
  }
  return sqrt(f2) - sqrt(f1);
}
// Foam as it lies on water: a lace of wandering lines round holes. dens: 0 none .. 1 solid white.
float lace(vec2 p, float dens) {
  if (dens <= 0.004) return 0.0;
  vec2 w = vec2(n2(p * 0.6 + 3.0), n2(p * 0.6 + 31.7)) - 0.5;
  vec2 q = p + 0.9 * w;
  float a = n2(q) * 0.62 + n2(q * 2.1 + 5.0) * 0.38;
  float b = n2(q * 1.7 + 11.0) * 0.6 + n2(q * 3.9 + 2.0) * 0.4;
  float wd = 0.012 + dens * dens * 0.2;
  float l = 1.0 - smoothstep(wd, wd * 1.8 + 0.012, abs(a - 0.5));
  l = max(l, (1.0 - smoothstep(wd * 0.8, wd * 1.6 + 0.012, abs(b - 0.5))) * 0.8);
  float m = n2(p * 0.23 + 5.0);
  l *= smoothstep(0.62 - dens * 0.8, 0.8 - dens * 0.6, m + 0.2);
  return clamp(l + smoothstep(0.68, 1.0, dens), 0.0, 1.0);
}

// ---- the sky -------------------------------------------------------------------------------------
float sunSide(vec3 rd) { return 0.5 + 0.5 * dot(normalize(rd.xz + vec2(1e-5, 0.0)), normalize(uSun.xz)); }
vec3 skyGrad(vec3 rd) {
  float y = max(rd.y, 0.0), az = sunSide(rd);
  vec3 zen = vec3(0.016, 0.034, 0.098);
  vec3 mid = mix(vec3(0.060, 0.098, 0.205), vec3(0.150, 0.150, 0.235), az);
  vec3 hor = mix(vec3(0.135, 0.140, 0.235), vec3(0.98, 0.40, 0.15), pow(az, 3.0));
  vec3 c = mix(zen, mid, exp(-y * 3.4));
  c = mix(c, hor, exp(-y * 12.0) * mix(0.7, 1.0, az));
  c += vec3(0.075, 0.026, 0.045) * exp(-pow((y - 0.10) / 0.07, 2.0)) * (1.0 - az);
  return c;
}
// the sun and the light round it. wide: 1 as it is; more: smeared (seen in rough water)
vec3 sunGlow(vec3 rd, float wide) {
  float d = acos(clamp(dot(rd, uSun), -1.0, 1.0));
  vec3 c = SUNCOL * (1.25 * exp(-d * (16.0 / wide)) + 0.30 * exp(-d * (5.0 / wide)) + 0.05 * exp(-d * 1.6));
  c += vec3(64.0, 34.0, 12.0) * (1.0 - smoothstep(0.012, 0.016 * wide, d)) / (wide * wide);
  return c;
}
// high, thin cloud lit from under by the low sun (rgb already times its cover, a: its cover)
vec4 clouds(vec3 rd, float t) {
  if (rd.y < 0.012) return vec4(0.0);
  vec2 uv = rd.xz / (rd.y + 0.07) * 0.34 + vec2(0.0035, 0.0012) * t;
  float d = fbm(uv * vec2(0.8, 2.1) + 3.0), d2 = fbm3(uv * 3.3 + 7.7);
  float m = d + 0.2 * d2;
  float a = smoothstep(0.56, 0.84, m) * smoothstep(0.012, 0.11, rd.y);
  if (a <= 0.0) return vec4(0.0);
  float az = sunSide(rd), mu = max(dot(rd, uSun), 0.0);
  vec3 lit = mix(vec3(0.10, 0.10, 0.16), vec3(1.15, 0.44, 0.24), pow(az, 2.4) * (0.3 + 0.7 * exp(-rd.y * 4.5)));
  lit = mix(lit, vec3(2.0, 1.0, 0.5), pow(mu, 14.0));
  lit *= mix(1.0, 0.5, smoothstep(0.78, 1.0, m));
  return vec4(lit * a, a);
}
// a skyline with teeth, 0..1
float ridge(float x, float seed) {
  float s = 0.0, a = 0.5, f = 1.0;
  for (int i = 0; i < 4; i++) { float n = n2(vec2(x * f, seed + float(i) * 13.1)); s += a * (1.0 - abs(2.0 * n - 1.0)); f *= 2.13; a *= 0.47; }
  return s;
}
float window(float x, float a, float b, float c, float d) { return smoothstep(a, b, x) * (1.0 - smoothstep(c, d, x)); }
// the horizon's haze toward rd (what far things fade into)
vec3 hazeCol(vec3 rd) {
  vec3 d = normalize(vec3(rd.x, 0.035, rd.z));
  return skyGrad(d) + sunGlow(d, 3.0) * 0.35;
}
// The far land, flat against the sky: mountains in layers of haze, the volcano and its smoke.
// phi: the ray's heading (0: inland, +: toward the coast ahead), el: how high it looks (rad).
vec4 farLand(vec3 rd, float phi, float el, float t) {
  vec4 o = vec4(0.0);
  if (el > 0.42 || el < -0.02) return o;
  vec3 hz = hazeCol(rd);
  float pv = 1.36, top = 0.104;
  // the volcano's smoke: up from the top, then bent over by the wind and carried inland
  float dx = pv - phi + 0.006;
  if (dx > -0.04 && dx < 1.15 && el > top - 0.012) {
    float d1 = max(dx, 0.0);
    float rise = 0.105 * (1.0 - exp(-d1 / 0.065)) + 0.03 * d1;
    float wid = 0.009 + 0.046 * (1.0 - exp(-d1 / 0.15)) + 0.018 * d1;
    float n = fbm(vec2(dx * 24.0 - t * 0.02, el * 30.0 + t * 0.005)) - 0.5;
    float y = (el - (top + rise)) / wid + n * 1.6;
    float a = (1.0 - smoothstep(0.35, 1.0, abs(y))) * smoothstep(-0.03, 0.004, dx) * (1.0 - smoothstep(0.3, 1.1, dx));
    if (a > 0.0) {
      vec3 sm = mix(vec3(0.050, 0.052, 0.085), vec3(0.78, 0.34, 0.23), smoothstep(-0.5, 1.0, y + 1.2 * n));
      sm += vec3(1.5, 0.3, 0.05) * exp(-d1 * 45.0) * exp(-max(el - top, 0.0) * 70.0);
      sm = mix(sm, hz, 0.36 + 0.3 * smoothstep(0.2, 1.0, dx));
      a *= 0.86;
      o = vec4(sm * a, a);
    }
  }
  // layer 1: the far ridges and the volcano
  float m1 = window(phi, -2.55, -2.1, 1.82, 2.0);
  float e1 = (0.014 + 0.040 * ridge(phi * 2.6 + 2.0, 1.0)) * m1;
  float cone = pow(max(1.0 - abs(phi - pv) / 0.31, 0.0), 1.75) * 0.118;
  cone = min(cone, top - 0.004 * (1.0 - smoothstep(0.0, 0.012, abs(phi - pv))));
  e1 = max(e1, cone);
  if (el < e1) {
    float lit = smoothstep(0.0, 0.35, cone / 0.118) * smoothstep(-0.05, 0.25, phi - pv + 0.06);   // the sun on the cone's seaward side
    float gully = n2(vec2(phi * 150.0, el * 22.0));
    vec3 c = mix(vec3(0.028, 0.032, 0.052), vec3(0.36, 0.165, 0.115), 0.42 * lit * (0.6 + 0.4 * gully));
    // snow down from the top
    float sn = smoothstep(0.070, 0.098, el + 0.012 * (gully - 0.5)) * step(0.02, cone);
    c = mix(c, mix(vec3(0.20, 0.21, 0.30), vec3(0.85, 0.50, 0.40), lit), sn * 0.7);
    c = mix(c, hz, 0.66 - 0.12 * lit);
    c = mix(c, hz, (1.0 - smoothstep(0.0, 0.03, el)) * 0.5);
    o = vec4(c, 1.0);
  }
  // layer 2: the big peaks
  float m2 = window(phi, -0.25, 0.25, 0.95, 1.22);
  float r2 = ridge(phi * 2.3 + 4.0, 5.0);
  float e2 = (0.035 + 0.225 * pow(r2, 1.35)) * m2;
  if (el < e2) {
    float up = el / max(e2, 1e-4);
    float gully = n2(vec2(phi * 95.0, el * 16.0)) * 0.65 + n2(vec2(phi * 31.0 + el * 9.0, el * 40.0)) * 0.35;
    float sl = (ridge(phi * 2.3 + 4.0 + 0.012, 5.0) - r2) / 0.012;        // rising toward the sun's side?
    float lit = smoothstep(-0.6, 1.4, sl) * smoothstep(0.2, 0.9, up);
    vec3 c = mix(vec3(0.014, 0.016, 0.026), vec3(0.040, 0.039, 0.052), gully);
    float snow = smoothstep(0.52, 0.80, up + 0.42 * (gully - 0.5)) * smoothstep(0.08, 0.2, e2);
    c = mix(c, mix(vec3(0.16, 0.175, 0.26), vec3(0.95, 0.52, 0.40), lit), snow * 0.85);
    c += vec3(0.16, 0.065, 0.04) * lit * 0.3;
    c = mix(c, hz, 0.34 + 0.34 * (1.0 - smoothstep(0.0, 0.45, up)));
    o = vec4(c, 1.0);
  }
  // layer 3: the near hills
  float m3 = window(phi, -1.9, -1.2, 0.35, 0.8);
  float e3 = (0.018 + 0.075 * ridge(phi * 1.7 + 9.0, 9.0)) * m3;
  if (el < e3) {
    vec3 c = mix(vec3(0.011, 0.012, 0.019), hz, 0.2 + 0.3 * (1.0 - smoothstep(0.0, 0.5, el / max(e3, 1e-4))));
    o = vec4(c, 1.0);
  }
  return o;
}
// everything far, for a ray that hits nothing near. soft: for mirror images (no small things)
vec3 farAway(vec3 rd, float t, float soft) {
  vec3 c = skyGrad(rd) + sunGlow(rd, 1.0 + 2.5 * soft);
  vec4 cl = clouds(rd, t);
  c = c * (1.0 - cl.a) + cl.rgb;
  vec4 fl = farLand(rd, atan(rd.x, rd.z), atan(rd.y, length(rd.xz)), t);
  c = c * (1.0 - fl.a) + fl.rgb;
  return c;
}

// ---- the waves -----------------------------------------------------------------------------------
float arriveT(float k, float x) { return (k + 0.20 * sin(x * 0.043 + k * 2.4) + 0.11 * sin(x * 0.117 - k * 1.7 + 1.3) + 0.05 * sin(x * 0.31 + k * 4.1)) * TW; }
float uprush(float k, float x) {
  float big = abs(k - uWave.y) < 0.5 ? uWave.z : 1.0;
  return uWave.x * big * (0.86 + 0.2 * sin(k * 12.9898 + 1.0) + 0.12 * sin(x * 0.06 + k * 3.3) + 0.06 * sin(x * 0.21 - k * 2.2));
}
float frontS(float tau, float u) { return u * tau - (tau < 0.0 ? 0.25 : 0.5) * 9.81 * SLOPE * tau * tau; }

// small waves on the open sea: the height, and its slopes along x and z
vec3 chop(vec2 p, float t, float amt) {
  vec3 o = vec3(0.0);
  vec2 d; float k, a, ph, w;
  d = vec2(0.30, 0.954);  k = 6.2832 / 19.0; a = 0.105; w = sqrt(9.81 * k); ph = dot(d, p) * k - w * t;         o += a * vec3(sin(ph), d * k * cos(ph));
  d = vec2(-0.45, 0.893); k = 6.2832 / 10.3; a = 0.060; w = sqrt(9.81 * k); ph = dot(d, p) * k - w * t + 1.3;   o += a * vec3(sin(ph), d * k * cos(ph));
  d = vec2(0.71, 0.704);  k = 6.2832 / 5.3;  a = 0.034; w = sqrt(9.81 * k); ph = dot(d, p) * k - w * t + 4.1;   o += a * vec3(sin(ph), d * k * cos(ph));
  d = vec2(-0.2, 0.98);   k = 6.2832 / 2.9;  a = 0.017; w = sqrt(9.81 * k); ph = dot(d, p) * k - w * t + 2.2;   o += a * vec3(sin(ph), d * k * cos(ph));
  d = vec2(0.92, 0.39);   k = 6.2832 / 1.37; a = 0.0075; w = sqrt(9.81 * k); ph = dot(d, p) * k - w * t + 0.7;  o += a * vec3(sin(ph), d * k * cos(ph));
  d = vec2(-0.75, 0.66);  k = 6.2832 / 0.63; a = 0.0034; w = sqrt(9.81 * k); ph = dot(d, p) * k - w * t + 5.5;  o += a * vec3(sin(ph), d * k * cos(ph));
  return vec3(o.y, o.z, o.x) * amt;       // slope x, slope z, height
}

// The waves rolling in. What does not change along a ray (when each wave lands at this place along
// the shore, how strong it is) is worked out once by rollSet(x); then rollH(s) is the height they add
// at s (m up the beach from the still water line, so under 0 out at sea), and rollFoam the foam on
// them there and the foam's own place (to draw its lace).
float gA[5]; float gU[5];
void rollSet(float x) {
  float k0 = floor(TS / TW);
  for (int j = 0; j < 5; j++) { float k = k0 + float(j) - 1.0; gA[j] = TS - arriveT(k, x); gU[j] = uprush(k, x); }
}
float rollH(float s) {
  float h = 0.0;
  for (int j = 0; j < 5; j++) {
    float tau = gA[j];
    if (tau > 0.0) continue;
    float u = gU[j];
    float F = frontS(tau, u), D = -F, q = s - F;
    float Hk = mix(0.06, 0.95, smoothstep(0.0, 36.0, D)) * mix(1.0, 0.5, smoothstep(45.0, 170.0, D)) * (u / uWave.x);
    float wf = mix(0.5, 6.5, smoothstep(24.0, 62.0, D));
    float Lb = mix(4.5, 15.0, smoothstep(18.0, 80.0, D));
    h += Hk * (1.0 - smoothstep(-wf, 0.0, q)) * exp(min(q + wf, 0.0) / Lb);
  }
  return h;
}
void rollFoam(float x, float s, out float foam, out vec2 fuv) {
  foam = 0.0; fuv = vec2(x, s);
  for (int j = 0; j < 5; j++) {
    float tau = gA[j], u = gU[j];
    if (tau > 0.0) {
      // (it has landed: the water near the shore keeps its foam a while)
      float f = 0.8 * exp(-tau / 6.0) * smoothstep(-24.0, -1.5, s);
      if (f > foam) { foam = f; fuv = vec2(x, s + tau * 0.35); }
      continue;
    }
    float F = frontS(tau, u), D = -F, q = s - F;
    float wf = mix(0.5, 6.5, smoothstep(24.0, 62.0, D));
    float broken = 1.0 - smoothstep(27.0, 45.0, D);
    float dens = (1.0 - smoothstep(-0.1, 0.1, q)) * (q > -wf - 2.0 ? 1.0 : exp((q + wf + 2.0) / 6.0));
    float f = broken * dens;
    if (f > foam) { foam = f; fuv = vec2(x, q); }
  }
}
// where a ray going down meets the sea with its rollers on it (tW: where it meets the still water)
float seaHit(vec3 ro, vec3 rd, float tW) {
  float top = 1.15;
  float t0 = ro.y > top ? (top - ro.y) / rd.y : 0.0;
  float t = t0, dt = (tW - t0) / 14.0, lt = t0;
  for (int i = 0; i < 14; i++) {
    t += dt;
    vec3 p = ro + rd * t;
    if (p.y < rollH(p.z - ZS)) {
      for (int j = 0; j < 4; j++) { float tm = 0.5 * (lt + t); vec3 pm = ro + rd * tm; if (pm.y < rollH(pm.z - ZS)) t = tm; else lt = tm; }
      return t;
    }
    lt = t;
  }
  return tW;
}

// ---- the rocks -----------------------------------------------------------------------------------
#define ZB 34.0
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
// the sand's height: the beach rises from the still water line to z = ZB; behind it a level plain
float groundY(float z) { return SLOPE * (clamp(z, ZS, ZB) - ZS); }
float sdRoundBox(vec3 p, vec3 b, float r) { vec3 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r; }
float sdEll(vec3 p, vec3 r) { float k0 = length(p / r), k1 = length(p / (r * r)); return k0 * (k0 - 1.0) / k1; }
float smin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }

// the sea stacks, plain (no roughness): also used for their shadows and mirror images
float stacksPlain(vec3 p) {
  // the tall one, leaning
  vec3 q = p - vec3(58.0, 0.0, -21.0);
  q.x += q.y * 0.13; q.z -= q.y * 0.05;
  float w = mix(1.0, 0.5, clamp(q.y / 24.0, 0.0, 1.0));
  float d = sdRoundBox(vec3(q.x / w, q.y - 10.0, q.z / w), vec3(3.3, 13.0, 2.7), 1.3) * w;
  d = smin(d, sdEll(p - vec3(53.5, 1.0, -19.0), vec3(3.4, 3.2, 2.8)), 2.0);
  // its low neighbour
  d = min(d, sdEll(p - vec3(66.5, 1.2, -27.0), vec3(3.2, 4.6, 2.6)));
  // the broad one, farther out
  q = p - vec3(65.0, 0.0, -69.0);
  w = mix(1.0, 0.72, clamp(q.y / 15.0, 0.0, 1.0));
  d = min(d, sdRoundBox(vec3(q.x / w, q.y - 5.0, q.z / w), vec3(7.5, 9.5, 5.0), 2.0) * w);
  // the arch, far along the shore
  q = p - vec3(150.0, 0.0, -20.0);
  float ar = sdRoundBox(q - vec3(0.0, 7.0, 0.0), vec3(17.0, 9.5, 4.0), 2.5);
  float hole = length(vec2(q.x + 3.0, (q.y - 1.0) * 0.8)) - 6.6;
  ar = max(ar, -hole);
  return min(d, ar);
}
// the boulders on the beach near White's spot
float bouldersPlain(vec3 p) {
  float gy = groundY(p.z);
  float d = sdEll(p - vec3(7.4, gy + 0.25, -3.4), vec3(1.25, 0.8, 1.0));
  d = min(d, sdEll(p - vec3(9.1, gy + 0.1, -2.5), vec3(0.6, 0.42, 0.5)));
  d = min(d, sdEll(p - vec3(-6.5, gy + 0.2, 4.6), vec3(0.9, 0.6, 0.75)));
  d = min(d, sdEll(p - vec3(14.5, gy + 0.5, 9.0), vec3(2.3, 1.5, 1.9)));
  d = min(d, sdEll(p - vec3(17.6, gy + 0.2, 7.2), vec3(0.9, 0.62, 0.8)));
  d = min(d, sdEll(p - vec3(-15.0, gy + 0.6, 12.5), vec3(2.6, 1.7, 2.2)));
  d = min(d, sdEll(p - vec3(27.0, gy + 0.3, 2.0), vec3(1.5, 1.0, 1.2)));
  d = min(d, sdEll(p - vec3(-3.0, gy + 0.05, -5.6), vec3(0.5, 0.3, 0.42)));
  return d;
}
// the crags that stand on the plain behind the beach: huge rocks
float cragsPlain(vec3 p) {
  float yb = SLOPE * (ZB - ZS);
  vec3 q = p - vec3(36.0, yb, 70.0);
  q.xz = rot(0.55) * q.xz; q.x += q.y * 0.18;
  float w = mix(1.0, 0.32, clamp(q.y / 27.0, 0.0, 1.0));
  float d = sdRoundBox(vec3(q.x / w, q.y - 11.0, q.z / w), vec3(10.0, 15.0, 4.2), 1.6) * w;
  d = smin(d, sdEll(p - vec3(52.0, yb + 3.0, 78.0), vec3(9.0, 7.0, 6.0)), 3.0);
  q = p - vec3(-36.0, yb, 62.0);
  w = mix(1.0, 0.5, clamp(q.y / 15.0, 0.0, 1.0));
  d = min(d, sdRoundBox(vec3(q.x / w, q.y - 4.0, q.z / w), vec3(11.0, 9.0, 6.5), 2.2) * w);
  q = p - vec3(104.0, yb, 96.0);
  q.x -= q.y * 0.1;
  w = mix(1.0, 0.4, clamp(q.y / 40.0, 0.0, 1.0));
  d = min(d, sdRoundBox(vec3(q.x / w, q.y - 16.0, q.z / w), vec3(13.0, 22.0, 9.0), 2.5) * w);
  d = min(d, sdEll(p - vec3(-95.0, yb + 6.0, 110.0), vec3(26.0, 13.0, 15.0)));
  return d;
}
// (each kind of rock is only looked at where it can be: the stacks are out at sea, the boulders low
// on the beach, the crags behind it; elsewhere a safe "at least this far")
float stacksNear(vec3 p) { return p.z > -8.0 ? p.z + 10.5 : stacksPlain(p); }
float bouldersNear(vec3 p) { float up = p.y - groundY(p.z); return up > 4.2 ? up - 3.2 : (p.z > 17.0 ? max(p.z - 15.0, up - 3.2) : bouldersPlain(p)); }
float cragsNear(vec3 p) { return p.z < 42.0 ? 46.0 - p.z : cragsPlain(p); }
float rocks(vec3 p) {
  float a = stacksNear(p), b = bouldersNear(p), c = cragsNear(p);
  if (a < 3.0) a -= 1.5 * (n3(p * 0.13 + 4.0) - 0.5) + 0.42 * (n3(p * 0.55) - 0.5) + 0.10 * (n3(p * 2.1) - 0.5);
  if (b < 1.0) b -= 0.26 * (n3(p * 1.3 + 9.0) - 0.5) + 0.07 * (n3(p * 4.6) - 0.5);
  if (c < 5.0) {
    float st = abs(fract(p.y * 0.3 + 0.9 * n3(p * 0.07 + 2.0)) - 0.5);       // ledges, layer on layer
    c -= 3.4 * (n3(p * 0.075 + 7.0) - 0.5) + 1.0 * (n3(p * vec3(0.3, 0.12, 0.3)) - 0.5) + 0.55 * st + 0.16 * (n3(p * 1.4) - 0.5);
  }
  return min(a, min(b, c));
}
vec3 rocksN(vec3 p, float e) {
  vec2 k = vec2(1.0, -1.0);
  return normalize(k.xyy * rocks(p + k.xyy * e) + k.yyx * rocks(p + k.yyx * e) + k.yxy * rocks(p + k.yxy * e) + k.xxx * rocks(p + k.xxx * e));
}
// how much of the light along a ray from p toward d the big rocks let through (soft)
float stackShade(vec3 p, vec3 d) {
  float res = 1.0, t = 1.5;
  for (int i = 0; i < 16; i++) {
    vec3 q = p + d * t;
    float h = min(stacksNear(q), cragsNear(q));
    res = min(res, 3.0 * h / t);
    if (res < 0.02) break;
    t += clamp(h, 1.5, 30.0);
    if (t > 320.0) break;
  }
  return clamp(res, 0.0, 1.0);
}

// ---- light ---------------------------------------------------------------------------------------
// White's shadow from the sun on the ground at P (he stands between head and feet)
float whiteShadow(vec3 P) {
  if (uWhiteGlow <= 0.0) return 1.0;
  // the nearest the sun's ray from P comes to his middle line (feet .. head)
  vec3 a = uWhiteRoot, b = uWhiteAt[0];
  vec3 ab = b - a, ao = P - a;
  vec3 n = cross(uSun, ab);
  float nl = length(n);
  if (nl < 1e-4) return 1.0;
  float d = abs(dot(ao, n)) / nl;
  // where along the sun's ray, and where along him
  vec3 n2v = cross(ab, n);
  float ts = dot(a - P, n2v) / dot(uSun, n2v);
  vec3 n1v = cross(uSun, n);
  float tb = dot(P - a, n1v) / dot(ab, n1v);
  if (ts < 0.02 || tb < -0.05 || tb > 1.08) return 1.0;
  float wd = mix(0.17, 0.13, clamp(tb, 0.0, 1.0)) + 0.02 * ts;
  float sh = 1.0 - smoothstep(wd * 0.45, wd * 1.25, d);
  return 1.0 - sh * 0.72 * exp(-ts * 0.045);
}

// the mist that lies on the beach and the sea: thick low down, lit by the sun where you look toward it
vec3 fogged(vec3 col, vec3 ro, vec3 rd, float t) {
  float c = 1.0 / 8.0, b = 0.0075;
  float f = (b / c) * exp(-max(ro.y, 0.0) * c) * (1.0 - exp(-t * rd.y * c)) / (abs(rd.y) < 1e-4 ? (rd.y < 0.0 ? -1e-4 : 1e-4) : rd.y);
  f = 1.0 - exp(-f - t * 0.0005);
  float mu = max(dot(normalize(vec3(rd.x, 0.0, rd.z) + vec3(1e-5, 0.0, 0.0)), normalize(vec3(uSun.x, 0.0, uSun.z))), 0.0);
  vec3 fc = mix(vec3(0.080, 0.090, 0.145), vec3(0.62, 0.29, 0.14), pow(mu, 5.0));
  return mix(col, fc, clamp(f, 0.0, 1.0));
}

// what a mirror sees along R from P (wet sand, water): the sky and the far land, and the big rocks
vec3 mirrored(vec3 P, vec3 R, float t, float soft) {
  R.y = abs(R.y) + 0.004; R = normalize(R);
  vec3 c = farAway(R, t, soft);
  if (uQuality > 0.5) {
    float sh = stackShade(P + vec3(0.0, 0.05, 0.0), R);
    c = mix(mix(vec3(0.010, 0.011, 0.016), c, 0.12), c, sh);
  }
  return c;
}

// ---- the sand ------------------------------------------------------------------------------------
// P on the sand (the beach's plane, or the plain behind it: slope 0). film: a sheet of water over it or
// the shine one left (0..1); deep: under how much water (0..1).
vec3 sandCol(vec3 P, vec3 rd, float t, float film, float deep, float time, float slope) {
  vec2 q = P.xz;
  float s = P.z - ZS;
  float near = 1.0 - smoothstep(5.0, 28.0, t);
  // how damp: the sea side is always dark; inland it dries
  float line = 8.2 + 1.3 * sin(P.x * 0.07) + 0.9 * n2(q * vec2(0.12, 0.3));
  float damp = max(1.0 - smoothstep(line - 1.2, line + 2.6, s), film);
  // the sand's shape: ripples the water left along the shore, low humps, grain
  float e = 0.012 + t * 0.003;
  float wob = n2(q * vec2(0.35, 0.9));
  float kr = 6.2832 / 0.34;
  float amp = 0.0042 * near * (0.35 + 0.65 * damp);
  float ph = (s + 0.55 * wob + 0.12 * n2(q * 1.7)) * kr;
  float h0 = 0.045 * fbm3(q * 0.42) + amp * sin(ph);
  float hx = 0.045 * fbm3((q + vec2(e, 0.0)) * 0.42) + amp * sin((s + 0.55 * n2((q + vec2(e, 0.0)) * vec2(0.35, 0.9)) + 0.12 * n2((q + vec2(e, 0.0)) * 1.7)) * kr);
  float hz = 0.045 * fbm3((q + vec2(0.0, e)) * 0.42) + amp * sin((s + e + 0.55 * n2((q + vec2(0.0, e)) * vec2(0.35, 0.9)) + 0.12 * n2((q + vec2(0.0, e)) * 1.7)) * kr);
  vec3 N = normalize(vec3(-(hx - h0) / e, 1.0, -(hz - h0) / e - slope));
  // his footprints: shallow dents
  float dent = 0.0;
  for (int i = 0; i < 16; i++) {
    vec4 f = uFoot[i];
    if (f.w <= 0.0) continue;
    vec2 d = q - f.xy;
    if (dot(d, d) > 0.09) continue;
    float cs = cos(f.z), sn = sin(f.z);
    vec2 l = vec2(d.x * cs - d.y * sn, d.x * sn + d.y * cs);       // across, along
    float r = length(vec2(l.x / 0.062, l.y / 0.125));
    float dd = (1.0 - smoothstep(0.75, 1.05, r)) * f.w;
    if (dd > dent) { dent = dd; N = normalize(N + vec3(l.x * cs + l.y * sn, 0.0, -l.x * sn + l.y * cs) * 3.0 * dd * smoothstep(0.3, 1.0, r)); }
  }
  float grain = n2(q * 37.0) * 0.5 + n2(q * 111.0) * 0.5;
  vec3 alb = mix(vec3(0.030, 0.0295, 0.031), vec3(0.0095, 0.0098, 0.012), damp) * (0.88 + 0.24 * grain * near);
  alb *= 1.0 - 0.45 * dent;
  // on the plain behind the beach: lava grit, and moss in patches
  if (slope < 1e-4) {
    float moss = smoothstep(0.52, 0.7, n2(q * 0.09 + 3.0) * 0.7 + n2(q * 0.5) * 0.3);
    alb = mix(alb * 0.8, vec3(0.036, 0.05, 0.02), moss * 0.8);
  }
  // light: the sky from above, the low sun, White
  float sun = max(dot(N, uSun), 0.0);
  float shade = whiteShadow(P);
  if (uQuality > 0.5) shade *= stackShade(P + vec3(0.0, 0.1, 0.0), uSun);
  vec3 amb = mix(vec3(0.085, 0.105, 0.175), vec3(0.19, 0.145, 0.14), sunSide(vec3(N.x, 0.0, N.z) + rd * 0.001)) * (0.55 + 0.45 * N.y);
  vec3 col = alb * (amb * 2.6 + SUNCOL * 5.0 * sun * shade + vec3(0.95, 0.97, 1.0) * 2.6 * whiteLight(P, N));
  // dry grains glint toward the sun
  float sp = pow(max(dot(reflect(rd, N), uSun), 0.0), 60.0) * step(0.86, n2(q * 140.0)) * (1.0 - damp) * near;
  col += SUNCOL * sp * 0.4 * shade;
  // the shine: damp sand a dull one, a film of water a mirror (the low beach keeps its film longest)
  float low = 1.0 - smoothstep(0.5, 7.5, s);
  float gloss = max(film, damp * (0.14 + 0.5 * low * (0.55 + 0.45 * n2(q * 0.6 + 9.0))));
  if (gloss > 0.003) {
    vec3 Nm = normalize(mix(vec3(0.0, 1.0, -slope), N, 0.3 * (1.0 - film) + 0.05));
    float cv = max(dot(-rd, Nm), 0.0);
    float F = 0.028 + 0.972 * pow(1.0 - cv, 5.0);
    vec3 R = reflect(rd, Nm);
    vec3 refl = mirrored(P, R, time, 0.25 * (1.0 - film));
    float lod = clamp(1.0 + 2.2 * distance(P.xz, uWhiteRoot.xz) + 3.0 * (1.0 - film), 0.0, 6.0);
    refl += whiteMirror(P, rd, Nm, lod) * 1.15;
    col = mix(col, refl, F * gloss);
    col *= 1.0 - 0.3 * deep * (1.0 - F);          // under a sheet of water the sand is darker still
  }
  return col;
}

// ---- the scorer: a monitor as big as a hill, hanging in the sky on its cables --------------------
vec3 monLocal(vec3 p) {
  p -= uMonAt.xyz;
  // it faces the beach, tipped down at you
  p.xz = rot(-atan(uMonAt.x, uMonAt.z - 0.0001)) * p.xz;
  p.yz = rot(-0.36) * p.yz;
  return p / uMonAt.w;
}
float monBody(vec3 q) {
  float d = sdRoundBox(q, vec3(1.0, 0.76, 0.42), 0.07);
  // its back narrows like an old tube monitor's
  d = smin(d, sdRoundBox(q - vec3(0.0, 0.02, 0.75), vec3(0.55, 0.46, 0.4), 0.1), 0.25);
  // the screen is set in
  d = max(d, -sdRoundBox(q - vec3(0.0, 0.0, -0.5), vec3(0.86, 0.62, 0.07), 0.03));
  return d;
}
float monCables(vec3 q, float t) {
  float d = 1e5;
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    vec2 at = vec2(-0.82 + 0.205 * fi, 0.2 + 0.32 * sin(fi * 2.3));
    vec3 c = q - vec3(at.x, -0.8, at.y);
    float y = -c.y;                    // how far down the cable
    float len = 2.6 + 2.2 * fract(fi * 0.61);
    float sway = (0.06 * sin(t * 0.7 + fi * 1.9 + y * 1.3) + 0.09 * sin(fi * 5.1)) * y;
    float swz = (0.04 * sin(t * 0.53 + fi * 2.7 + y * 1.1) + 0.16 + 0.1 * cos(fi * 3.7)) * y;
    float r = (0.026 + 0.01 * sin(fi * 7.7)) * (1.0 - 0.45 * clamp(y / len, 0.0, 1.0));
    float dd = length(vec2(c.x - sway, c.z - swz)) - r;
    dd = max(dd, -y); dd = max(dd, y - len);
    d = min(d, dd);
  }
  return d;
}
float monMap(vec3 p, float t) {
  vec3 q = monLocal(p);
  return min(monBody(q), monCables(q, t)) * uMonAt.w;
}
// what its screen shows at (x, y) of the screen, -1..1: the scorer's three bars, and its eye
vec3 monScreen(vec2 s, float t) {
  vec3 c = vec3(0.012, 0.016, 0.022);
  float flick = 0.88 + 0.12 * sin(t * 31.0) * sin(t * 7.3);
  float scan = 0.82 + 0.18 * sin(s.y * 240.0);
  // the three bars it scores with (the best one yellow), down in a corner
  vec2 b = (s - vec2(-0.72, -0.62)) / vec2(0.2, 0.26);
  if (b.x > 0.0 && b.x < 1.0 && b.y > 0.0 && b.y < 1.0) {
    float i = floor(b.x * 3.0), fx = fract(b.x * 3.0);
    float hgt = i < 0.5 ? 0.45 : (i < 1.5 ? 0.7 : 1.0);
    hgt *= 0.75 + 0.25 * sin(t * (2.0 + i) + i * 2.0);
    if (fx > 0.12 && fx < 0.88 && b.y < hgt) c = i > 1.5 ? vec3(1.0, 0.82, 0.2) : vec3(0.75, 0.78, 0.86);
  }
  // the eye: a ring that looks for you, and a slit that narrows when it finds you
  vec2 e = s - uMon.zw * 0.42;
  float r = length(e * vec2(1.0, 1.25));
  float ring = (1.0 - smoothstep(0.012, 0.03, abs(r - 0.44))) + (1.0 - smoothstep(0.008, 0.02, abs(r - 0.58))) * 0.5;
  float pupil = 1.0 - smoothstep(0.15, 0.2, length(e * vec2(2.6 - 1.3 * uMon.y, 0.9)));
  float iris = (1.0 - smoothstep(0.38, 0.44, r)) * (0.25 + 0.2 * sin(atan(e.y, e.x) * 24.0 + t * 3.0));
  vec3 eye = vec3(0.92, 0.96, 1.0) * (ring + iris) + vec3(1.0, 0.25, 0.16) * pupil * 2.2;
  // lines of readout
  float rows = step(0.55, fract(s.y * 11.0)) * step(n2(vec2(floor(s.y * 11.0) * 3.1, floor(t * 6.0))), 0.55) * step(0.62, s.x) * step(fract(s.x * 23.0 + floor(s.y * 11.0) * 0.37), 0.7);
  c += eye + vec3(0.6, 0.85, 0.7) * rows * 0.55;
  // a rolling bar, like a screen filmed by a camera
  c *= 1.0 + 0.6 * (1.0 - smoothstep(0.0, 0.12, abs(fract(s.y * 0.5 + t * 0.21) - 0.5)));
  return c * flick * scan * (0.35 + 1.4 * uMon.y);
}
// The scorer along a ray: its colour and how far (a < 0: not hit)
vec4 monitor(vec3 ro, vec3 rd, float t) {
  if (uMon.x <= 0.001) return vec4(0.0, 0.0, 0.0, -1.0);
  float S = uMonAt.w;
  vec3 oc = ro - uMonAt.xyz - vec3(0.0, -2.2 * S, 0.0);
  float b = dot(oc, rd), c = dot(oc, oc) - 30.0 * S * S;
  float disc = b * b - c;
  if (disc < 0.0) return vec4(0.0, 0.0, 0.0, -1.0);
  float sq = sqrt(disc), tt = max(-b - sq, 0.0), te = -b + sq;
  bool hit = false;
  for (int i = 0; i < 64; i++) {
    float d = monMap(ro + rd * tt, t);
    if (d < 0.004 * tt) { hit = true; break; }
    tt += d * 0.85;
    if (tt > te) break;
  }
  if (!hit) return vec4(0.0, 0.0, 0.0, -1.0);
  vec3 p = ro + rd * tt;
  vec2 k = vec2(1.0, -1.0); float e = 0.01 * S;
  vec3 n = normalize(k.xyy * monMap(p + k.xyy * e, t) + k.yyx * monMap(p + k.yyx * e, t) + k.yxy * monMap(p + k.yxy * e, t) + k.xxx * monMap(p + k.xxx * e, t));
  vec3 q = monLocal(p);
  vec3 col = vec3(0.016, 0.017, 0.022) * (0.5 + 0.5 * n.y) * 2.0;
  col += SUNCOL * 0.5 * max(dot(n, uSun), 0.0);
  col += vec3(0.28, 0.3, 0.42) * pow(1.0 - max(dot(-rd, n), 0.0), 3.0) * 0.5;
  // the screen
  if (q.z < -0.36 && abs(q.x) < 0.9 && abs(q.y) < 0.66) col = monScreen(vec2(q.x / 0.86, q.y / 0.62), t) * 2.4 + col * 0.3;
  return vec4(col, tt);
}

// ---- one ray ---------------------------------------------------------------------------------------
vec4 world(vec3 ro, vec3 rd) {
  float time = uView.w;
  vec3 col;
  float dist = 1e4;
  int what = 0;               // 0: far away, 1: rock, 2: sand, 3: sea
  float YB = SLOPE * (ZB - ZS);
  // the ground under the ray: the beach (1), the plain behind it (2), or the sea (3)
  float den = rd.y - SLOPE * rd.z;
  float tS = den < -1e-5 ? -(ro.y - SLOPE * (ro.z - ZS)) / den : -1.0;
  float tW = rd.y < -1e-5 ? -ro.y / rd.y : -1.0;
  float tP = rd.y < -1e-5 ? (YB - ro.y) / rd.y : -1.0;
  float zS = ro.z + rd.z * tS;
  int kind = 0;
  float tG = -1.0;
  if (tS > 0.0 && zS > ZS) {
    if (zS <= ZB) { kind = 1; tG = tS; } else if (tP > 0.0) { kind = 2; tG = tP; }
  } else if (tW > 0.0) { kind = 3; tG = tW; }
  // the sea's rollers stand up from it: where the ray really meets the water
  bool surf = false;
  if (kind == 3 && tW < 170.0 && (ro.z + rd.z * tW) - ZS > -80.0) {
    rollSet(ro.x + rd.x * tW);
    tG = seaHit(ro, rd, tW);
    surf = true;
  }
  // the rocks
  float tR = -1.0;
  {
    float t = 0.4, tEnd = tG > 0.0 ? min(tG + 3.0, 420.0) : 420.0;
    for (int i = 0; i < 72; i++) {
      float d = rocks(ro + rd * t);
      if (d < 0.0015 * t + 0.004) { tR = t; break; }
      t += d * 0.72;
      if (t > tEnd) break;
    }
  }

  if (tR > 0.0 && (tG < 0.0 || tR < tG)) {
    // ---- rock ----
    vec3 P = ro + rd * tR;
    vec3 N = rocksN(P, 0.012 + tR * 0.0016);
    bool crag = cragsPlain(P) < min(stacksPlain(P), bouldersPlain(P));
    float wetLine = crag ? 0.0 : 1.0 - smoothstep(0.2, 1.7, P.y - groundY(P.z));
    float cav = n3(P * (crag ? 0.5 : 1.6));
    vec3 alb = mix(vec3(0.016, 0.016, 0.018), vec3(0.040, 0.037, 0.036), cav);
    if (crag) {
      // moss where the rock lies flat, a dusting of snow on the tops
      float moss = smoothstep(0.5, 0.72, n2(P.xz * 0.13 + 3.0)) * smoothstep(0.62, 0.92, N.y);
      alb = mix(alb, vec3(0.040, 0.056, 0.022), moss * 0.85);
      alb = mix(alb, vec3(0.30, 0.31, 0.36), smoothstep(0.75, 0.95, N.y) * smoothstep(17.0, 26.0, P.y + 4.0 * cav));
    }
    alb *= 1.0 - 0.55 * wetLine;
    float sun = max(dot(N, uSun), 0.0);
    float sh = uQuality > 0.5 ? stackShade(P + N * 0.4, uSun) : 1.0;
    vec3 amb = mix(vec3(0.075, 0.095, 0.16), vec3(0.17, 0.13, 0.125), sunSide(N + rd * 0.001)) * (0.3 + 0.7 * (0.5 + 0.5 * N.y));
    amb *= 0.5 + 0.5 * cav;
    col = alb * (amb * 2.6 + SUNCOL * 5.5 * sun * sh + vec3(0.95, 0.97, 1.0) * 2.6 * whiteLight(P, N));
    // wet rock shines
    float cv = max(dot(-rd, N), 0.0);
    float F = 0.03 + 0.97 * pow(1.0 - cv, 5.0);
    vec3 R = reflect(rd, N);
    col += (skyGrad(normalize(vec3(R.x, abs(R.y) + 0.05, R.z))) * 0.5 + SUNCOL * 5.0 * pow(max(dot(R, uSun), 0.0), 40.0) * sh) * F * (0.10 + 0.5 * wetLine);
    col = fogged(col, ro, rd, tR);
    dist = tR; what = 1;
  } else if (kind == 1 || kind == 2) {
    // ---- the sand, and the sheets of water the waves throw up the beach ----
    vec3 P = ro + rd * tG;
    float s = P.z - ZS;
    float film = 0.0, cover = 0.0, edge = 1e3, flow = 0.0, strand = 0.0, lead = 0.0;
    if (kind == 1 && s < 16.0) {
      float a = 9.81 * SLOPE, k0 = floor(TS / TW);
      for (int j = -3; j <= 1; j++) {
        float k = k0 + float(j);
        float tau = TS - arriveT(k, P.x);
        if (tau <= 0.0) continue;
        float u = uprush(k, P.x);
        float smax = u * u / (2.0 * a), tEnd = 2.0 * u / a, tTop = u / a;
        float F = tau < tEnd ? u * tau - 0.5 * a * tau * tau : -1.0;
        if (s < F) {
          cover = 1.0;
          if (F - s < edge) { edge = F - s; flow = u - a * tau; lead = F; }
        } else if (s < smax && tau > tTop) {
          float tr = (u + sqrt(max(u * u - 2.0 * a * s, 0.0))) / a;
          film = max(film, exp(-max(tau - tr, 0.0) / 9.0));
        }
        // the bits of foam it left at its highest
        if (tau > tTop * 0.9) strand = max(strand, exp(-(tau - tTop) / 5.0) * (1.0 - smoothstep(0.0, 0.05, abs(s - smax + 0.03))));
      }
      // the film dries in patches
      film *= smoothstep(0.0, 0.5, film + 0.35 * (n2(P.xz * 0.8) - 0.5));
    }
    float deep = cover * clamp(edge * 0.45, 0.0, 1.0);
    if (cover > 0.5) film = 1.0;
    col = sandCol(P, rd, tG, film, deep, time, kind == 1 ? SLOPE : 0.0);
    // the foam on the sheet: thick at its edge, a lace behind
    float fo = 0.0;
    if (cover > 0.5) {
      float upk = smoothstep(-0.9, 0.5, flow);
      float scal = 0.5 + 0.5 * n2(vec2(P.x * 1.3, lead * 0.7));
      float edgeF = (1.0 - smoothstep(0.02, 0.16 + 0.5 * upk * scal, edge)) * (0.3 + 0.7 * upk);
      float dens = (0.22 + 0.62 * upk) * exp(-edge / (1.2 + 2.4 * upk));
      vec2 fuv = vec2(P.x, s - lead) * 2.6;
      fo = max(edgeF, lace(fuv, dens));
      // round White's feet the water parts
      if (uWhiteGlow > 0.0) for (int i = 0; i < 2; i++) {
        vec2 f = i == 0 ? uFeet.xy : uFeet.zw;
        vec2 d = P.xz - f; d.y *= flow > 0.0 ? 1.0 : -1.0;
        float r = length(d * vec2(1.0, d.y > 0.0 ? 0.45 : 1.0));
        fo = max(fo, (1.0 - smoothstep(0.02, 0.07, abs(r - 0.15))) * 0.8 * smoothstep(0.0, 0.5, edge));
      }
    }
    fo = max(fo, strand * smoothstep(0.5, 0.75, n2(P.xz * vec2(5.0, 19.0))) * 0.34);
    if (fo > 0.003) {
      vec3 fc = vec3(0.80, 0.84, 0.90) * (vec3(0.13, 0.155, 0.23) * 1.5 + SUNCOL * 1.5 * (0.25 + 0.75 * whiteShadow(P)) + vec3(1.0) * 1.6 * whiteLight(P, vec3(0.0, 1.0, 0.0)));
      col = mix(col, fc, fo);
    }
    col = fogged(col, ro, rd, tG);
    col = mix(col, hazeCol(rd), smoothstep(140.0, 800.0, tG));
    dist = tG; what = 2;
  } else if (kind == 3) {
    // ---- the sea ----
    vec3 P = ro + rd * tG;
    float s = P.z - ZS;
    float calm = 1.0 - smoothstep(-30.0, -1.0, s);          // the small waves die near the shore
    float far = 1.0 - smoothstep(60.0, 420.0, tG);          // and are too small to see far out
    float amt = uWave.w * (0.25 + 0.75 * calm);
    float e = 0.05 + tG * 0.008;
    float h0, hx, hz, foam; vec2 fuv;
    rollSet(P.x + e); hx = rollH(s);
    rollSet(P.x); h0 = rollH(s); hz = rollH(s + e);
    rollFoam(P.x, s, foam, fuv);
    vec3 ch = chop(P.xz, TS, amt);
    vec3 N = normalize(vec3(-(hx - h0) / e - ch.x * far, 1.0, -(hz - h0) / e - ch.y * far));
    float cv = max(dot(-rd, N), 0.0);
    float F = 0.02 + 0.98 * pow(1.0 - cv, 5.0);
    F = mix(F, 0.5 * F + 0.05, smoothstep(100.0, 900.0, tG) * 0.6);
    vec3 R = reflect(rd, N);
    vec3 refl = mirrored(P, R, time, smoothstep(10.0, 300.0, tG));
    // the sun's road on the water: the share of small faces that mirror it here
    vec3 Hv = normalize(uSun - rd);
    float nh = max(dot(normalize(N + vec3(0.0, 2.0, 0.0)), Hv), 1e-3);
    float sg = 0.045 + 0.09 * uWave.w * smoothstep(8.0, 250.0, tG);
    float tn2 = (1.0 - nh * nh) / (nh * nh);
    float Dg = exp(-tn2 / (sg * sg)) / (PI * sg * sg * nh * nh * nh * nh);
    float twinkle = 0.6 + 0.8 * n2(P.xz * (3.0 / (1.0 + tG * 0.03)) + TS * vec2(0.9, 1.7));
    float shade = uQuality > 0.5 ? stackShade(P + vec3(0.0, 0.2, 0.0), uSun) : 1.0;
    refl += vec3(1.0, 0.62, 0.3) * Dg * 0.05 * twinkle * shade;
    // into the water: black sand under it near the shore, dark green-blue where it is deep; the low
    // sun shines through the top of a wave that stands between you and it
    float depth = max(-SLOPE * s * 1.3 + h0, 0.0);
    vec3 body = mix(vec3(0.008, 0.010, 0.012), vec3(0.004, 0.016, 0.022), 1.0 - exp(-depth * 1.4));
    float back = pow(max(dot(normalize(rd.xz), normalize(uSun.xz)), 0.0), 2.0);
    body += vec3(0.010, 0.075, 0.070) * back * smoothstep(0.2, 0.8, h0) * shade;
    body += vec3(0.5, 0.75, 0.8) * 0.05 * whiteLight(P, N);
    col = mix(body, refl, F);
    // foam: on the rollers, left behind them, and round the rocks
    float around = 0.0;
    if (s > -110.0 && uQuality > 0.5) {
      float dr = min(stacksPlain(vec3(P.x, 0.3, P.z)), bouldersPlain(vec3(P.x, 0.2, P.z)));
      around = (1.0 - smoothstep(0.3, 3.2, dr)) * (0.55 + 0.3 * sin(TS * 0.7 + P.x * 0.3));
    }
    float fo = lace(fuv * 1.5, max(foam, around));
    if (fo > 0.003) {
      float lit = 0.3 + 0.7 * max(dot(N, uSun) * 3.0 + 0.25, 0.0);
      vec3 fc = vec3(0.80, 0.84, 0.90) * (vec3(0.13, 0.155, 0.23) * 1.5 + SUNCOL * 1.6 * min(lit, 1.4) * shade + vec3(1.0) * 1.6 * whiteLight(P, vec3(0.0, 1.0, 0.0)));
      col = mix(col, fc, fo * (1.0 - smoothstep(150.0, 400.0, tG)));
    }
    col = fogged(col, ro, rd, tG);
    col = mix(col, hazeCol(rd), smoothstep(500.0, 4000.0, tG));       // (at the horizon the sea is the sky's haze)
    dist = tG; what = 3;
  } else {
    col = farAway(rd, time, 0.0);
  }

  // ---- the world coming apart: in blocks, what the server keeps of the place shows through its looks
  if (uBug.x > 0.0) {
    float bs = uView.y / uBug.z;
    vec2 blk = floor(gl_FragCoord.xy / bs), big = floor(gl_FragCoord.xy / (bs * 4.0));
    float tick = floor(uBug.y * 9.0);
    vec4 r1 = texelFetch(uNoise, ivec2(mod(blk + vec2(tick * 17.0, tick * 31.0), 256.0)), 0);
    vec4 r2 = texelFetch(uNoise, ivec2(mod(big + vec2(tick * 7.0 + 91.0, tick * 13.0), 256.0)), 0);
    if (r1.g < uBug.x * uBug.x * 0.9 || r2.b < uBug.x * 0.6 || uBug.x >= 0.999) {
      float v = uBug.w > 0.5 ? uBug.w : 1.0 + floor(r2.a * 2.999);
      if (v < 1.5) {
        // how far everything is: near is light
        float g = exp(-dist / 45.0);
        col = vec3(0.03 + 0.5 * g) * (0.88 + 0.12 * step(0.5, fract(log2(max(dist, 0.1)) * 6.0)));
      } else if (v < 2.5) {
        // what everything is: one flat colour a kind
        col = what == 1 ? vec3(0.42, 0.07, 0.045) : what == 2 ? vec3(0.34, 0.27, 0.04) : what == 3 ? vec3(0.03, 0.045, 0.34) : (rd.y > 0.0 ? vec3(0.025, 0.28, 0.31) : vec3(0.03, 0.045, 0.34));
        if (what == 0) { vec4 fl = farLand(rd, atan(rd.x, rd.z), atan(rd.y, length(rd.xz)), time); col = mix(col, vec3(0.13, 0.32, 0.12), step(0.5, fl.a)); }
      } else {
        // its shape: lines on it, a metre apart
        float ln = 0.0;
        if (what == 0) {
          float a1 = atan(rd.x, rd.z) / 0.1745, a2 = atan(rd.y, length(rd.xz)) / 0.1745;
          ln = max(1.0 - smoothstep(0.0, 0.03, abs(fract(a1 + 0.5) - 0.5)), 1.0 - smoothstep(0.0, 0.03, abs(fract(a2 + 0.5) - 0.5))) * 0.3;
        } else {
          vec3 P = ro + rd * dist;
          float wdt = 0.012 + dist * 0.0022;
          vec3 f = abs(fract(P * (what == 1 ? 0.5 : 1.0) + 0.5) - 0.5);
          float m = what == 1 ? min(f.x, min(f.y, f.z)) : min(f.x, f.z);
          ln = (1.0 - smoothstep(wdt * 0.5, wdt, m)) * exp(-dist * 0.006);
        }
        col = vec3(0.003, 0.006, 0.009) + vec3(0.12, 0.5, 0.36) * ln;
      }
    }
  }

  // ---- the scorer, in front of whatever is behind it ----
  vec4 mo = monitor(ro, rd, time);
  if (mo.a > 0.0 && mo.a < dist) {
    vec3 mc = fogged(mo.rgb, ro, rd, mo.a * 0.35);
    // it comes in through the sky in blocks
    vec2 blk = floor(gl_FragCoord.xy / (uView.y / 46.0));
    float inn = step(texelFetch(uNoise, ivec2(mod(blk, 256.0)), 0).b, uMon.x * 1.15 - 0.1);
    col = mix(col, mc, inn);
    dist = mix(dist, mo.a, inn);
  }
  // its search light: a shaft from its screen to the sand
  if (uBeam.w > 0.0) {
    vec3 a = uMonAt.xyz, b = vec3(uBeam.x, groundY(uBeam.y), uBeam.y);
    vec3 ab = b - a;
    vec3 n = cross(rd, ab);
    float nl = length(n);
    if (nl > 1e-4) {
      // the point of the shaft's middle line the ray passes nearest
      mc += sky * smoothstep(0.9, 1.2, dot(sky, LUMA)) * 0.45;
      vec3 pb = a + ab * tb;
      float tr = dot(pb - ro, rd);
      float wdt = mix(uMonAt.w * 0.5, uBeam.z, tb);
      float d = length(ro + rd * tr - pb);
      if (tr > 0.0 && tr < dist + wdt) {
        float g = exp(-d * d / (wdt * wdt * 0.5));
        float lines = 0.75 + 0.25 * sin(tb * 900.0 - time * 14.0);
        col += vec3(0.7, 0.9, 1.0) * g * 0.28 * uBeam.w * lines;
      }
    }
    // where it falls
    if ((kind == 1 || kind == 2) && dist >= tG - 0.01) {
      vec3 P = ro + rd * tG;
      float r = distance(P.xz, uBeam.xy) / uBeam.z;
      float spot = 1.0 - smoothstep(0.85, 1.0, r);
      float grid = step(0.9, fract(P.x * 2.0)) + step(0.9, fract(P.z * 2.0));
      float ring = 1.0 - smoothstep(0.0, 0.05, abs(r - 0.95));
      col += vec3(0.65, 0.9, 1.0) * uBeam.w * (spot * (0.10 + 0.22 * grid * (0.6 + 0.4 * sin(time * 20.0 + P.x * 3.0))) + ring * 0.8);
    }
  }
  return vec4(col, dist);
}`,Is={name:"beach",fs:Os,sun:[Math.sin(125*A)*Math.cos(5.5*A),Math.sin(5.5*A),Math.cos(125*A)*Math.cos(5.5*A)],sunLight:1,look:{exposure:1.15,contrast:1.06,saturation:1.08,vignette:.32,lift:[.004,.006,.012],grain:.028,rim:.9,rimDepth:.5,rimCol:[1,.62,.34],air:0,airCol:[.5,.4,.4],glow:1,depth:!0},shore:{z0:-7,slope:.052,period:9.5,uprush:2.25},rough:1,big:[-99,1],clock:0,quality:1,feet:[0,0,0,0],prints:new Float32Array(64),mon:{on:0,light:0,look:[0,0],at:[-40,190,-420],size:85},beam:{at:[0,0],width:3,on:0},bug:[0,0,24,0],init(n){this.noise=Ne(n)},uniforms(n){let t=this.shore,e=this.mon,s=this.beam;return{uNoise:this.noise,uSun:this.sun,uShore:[t.z0,t.slope,t.period,this.clock==null?n:this.clock],uWave:[t.uprush,this.big[0],this.big[1],this.rough],uFeet:this.feet,uFoot:this.prints,uMon:[e.on,e.light,e.look[0],e.look[1]],uMonAt:[e.at[0],e.at[1],e.at[2],e.size],uBeam:[s.at[0],s.at[1],s.width,s.on],uBug:this.bug,uQuality:this.quality}},ground(n,t){let e=Is.shore;return Math.max(e.slope*(Math.min(t,34)-e.z0),0)},arrive(n,t){return(n+.2*Math.sin(t*.043+n*2.4)+.11*Math.sin(t*.117-n*1.7+1.3)+.05*Math.sin(t*.31+n*4.1))*this.shore.period},uprushAt(n,t){let e=Math.abs(n-this.big[0])<.5?this.big[1]:1;return this.shore.uprush*e*(.86+.2*Math.sin(n*12.9898+1)+.12*Math.sin(t*.06+n*3.3)+.06*Math.sin(t*.21-n*2.2))},edge(n,t){let e=Us*this.shore.slope,s=Math.floor(t/this.shore.period),i={s:0,k:null,flow:0,top:0};for(let o=-3;o<=1;o++){let a=s+o,r=t-this.arrive(a,n);if(r<=0)continue;let h=this.uprushAt(a,n);if(r>=2*h/e)continue;let l=h*r-.5*e*r*r;l>i.s&&(i.s=l,i.k=a,i.flow=h-e*r,i.top=h*h/(2*e))}return i},wet(n,t,e){return t-this.shore.z0<this.edge(n,e).s},next(n,t){for(let e=Math.floor(t/this.shore.period)-1;;e++){let s=this.arrive(e,n);if(s>t)return{k:e,at:s}}}};var ms=`
uniform vec4 uMon;        // the scorer: how much of it is there (0..1), its screen's light (0..1), where its eye looks (x, y: -1..1)
uniform vec4 uMonAt;      // where it hangs (m), and its size (m: half its width)
uniform vec4 uMonTilt;    // how far it is turned to face you (rad), tipped down at you (rad), how wide awake its eye is (0: a slit .. 1), 0

mat2 scRot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float scBox(vec3 p, vec3 b, float r) { vec3 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r; }
float scSmin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }

// a point of the world in the scorer's own axes (its screen looks along -z, 1 = half its width)
vec3 scLocal(vec3 p) {
  p -= uMonAt.xyz;
  p.xz = scRot(-uMonTilt.x) * p.xz;
  p.yz = scRot(-uMonTilt.y) * p.yz;
  return p / uMonAt.w;
}
float scBody(vec3 q) {
  float d = scBox(q, vec3(1.0, 0.76, 0.42), 0.07);
  // its back narrows like an old tube monitor's
  d = scSmin(d, scBox(q - vec3(0.0, 0.02, 0.75), vec3(0.55, 0.46, 0.4), 0.1), 0.25);
  // the screen is set in
  d = max(d, -scBox(q - vec3(0.0, 0.0, -0.5), vec3(0.86, 0.62, 0.07), 0.03));
  return d;
}
float scCables(vec3 q, float t) {
  float d = 1e5;
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    vec2 at = vec2(-0.82 + 0.205 * fi, 0.2 + 0.32 * sin(fi * 2.3));
    vec3 c = q - vec3(at.x, -0.8, at.y);
    float y = -c.y;                    // how far down the cable
    float len = 2.6 + 2.2 * fract(fi * 0.61);
    float sway = (0.06 * sin(t * 0.7 + fi * 1.9 + y * 1.3) + 0.09 * sin(fi * 5.1)) * y;
    float swz = (0.04 * sin(t * 0.53 + fi * 2.7 + y * 1.1) + 0.16 + 0.1 * cos(fi * 3.7)) * y;
    float r = (0.026 + 0.01 * sin(fi * 7.7)) * (1.0 - 0.45 * clamp(y / len, 0.0, 1.0));
    float dd = length(vec2(c.x - sway, c.z - swz)) - r;
    dd = max(dd, -y); dd = max(dd, y - len);
    d = min(d, dd);
  }
  return d;
}
float scMap(vec3 p, float t) {
  vec3 q = scLocal(p);
  return min(scBody(q), scCables(q, t)) * uMonAt.w;
}
// what its screen shows at (x, y) of the screen, -1..1: the three bars it scores with, and its eye
vec3 scScreen(vec2 s, float t) {
  vec3 c = vec3(0.012, 0.016, 0.022);
  float flick = 0.88 + 0.12 * sin(t * 31.0) * sin(t * 7.3);
  float scan = 0.82 + 0.18 * sin(s.y * 240.0);
  // the three bars (the best one yellow), down in a corner
  vec2 b = (s - vec2(-0.72, -0.62)) / vec2(0.2, 0.26);
  if (b.x > 0.0 && b.x < 1.0 && b.y > 0.0 && b.y < 1.0) {
    float i = floor(b.x * 3.0), fx = fract(b.x * 3.0);
    float hgt = i < 0.5 ? 0.45 : (i < 1.5 ? 0.7 : 1.0);
    hgt *= 0.75 + 0.25 * sin(t * (2.0 + i) + i * 2.0);
    if (fx > 0.12 && fx < 0.88 && b.y < hgt) c = i > 1.5 ? vec3(1.0, 0.82, 0.2) : vec3(0.75, 0.78, 0.86);
  }
  // the eye: a ring that looks for you, and a slit that narrows when it finds you
  vec2 e = s - uMon.zw * 0.42;
  float r = length(e * vec2(1.0, 1.25));
  float ring = (1.0 - smoothstep(0.012, 0.03, abs(r - 0.44))) + (1.0 - smoothstep(0.008, 0.02, abs(r - 0.58))) * 0.5;
  float pupil = 1.0 - smoothstep(0.15, 0.2, length(e * vec2(2.6 - 1.3 * uMonTilt.z, 0.9)));
  float iris = (1.0 - smoothstep(0.38, 0.44, r)) * (0.25 + 0.2 * sin(atan(e.y, e.x) * 24.0 + t * 3.0));
  vec3 eye = mix(vec3(0.92, 0.96, 1.0) * (ring + iris), vec3(0.62, 0.05, 0.035), pupil);
  // lines of readout
  float rows = step(0.55, fract(s.y * 11.0)) * step(n2(vec2(floor(s.y * 11.0) * 3.1, floor(t * 6.0))), 0.55) * step(0.62, s.x) * step(fract(s.x * 23.0 + floor(s.y * 11.0) * 0.37), 0.7);
  c += eye + vec3(0.6, 0.85, 0.7) * rows * 0.55;
  // a rolling bar, like a screen filmed by a camera
  c *= 1.0 + 0.6 * (1.0 - smoothstep(0.0, 0.12, abs(fract(s.y * 0.5 + t * 0.21) - 0.5)));
  return c * flick * scan * (0.35 + 1.4 * uMon.y);
}
vec4 scorer(vec3 ro, vec3 rd, float t) {
  if (uMon.x <= 0.001) return vec4(0.0, 0.0, 0.0, -1.0);
  float S = uMonAt.w;
  // (a ball round all of it, cables too: most rays never come near)
  vec3 oc = ro - uMonAt.xyz - vec3(0.0, -2.2 * S, 0.0);
  float b = dot(oc, rd), c = dot(oc, oc) - 30.0 * S * S;
  float disc = b * b - c;
  if (disc < 0.0) return vec4(0.0, 0.0, 0.0, -1.0);
  float sq = sqrt(disc), tt = max(-b - sq, 0.0), te = -b + sq;
  bool hit = false;
  for (int i = 0; i < 72; i++) {
    float d = scMap(ro + rd * tt, t);
    if (d < 0.0012 * tt) { hit = true; break; }
    tt += d * 0.85;
    if (tt > te) break;
  }
  if (!hit) return vec4(0.0, 0.0, 0.0, -1.0);
  vec3 p = ro + rd * tt;
  vec2 k = vec2(1.0, -1.0); float e = 0.01 * S;
  vec3 n = normalize(k.xyy * scMap(p + k.xyy * e, t) + k.yyx * scMap(p + k.yyx * e, t) + k.yxy * scMap(p + k.yxy * e, t) + k.xxx * scMap(p + k.xxx * e, t));
  vec3 q = scLocal(p);
  // dark plastic: the sky's light from above, the low sun on the side that faces it, a sheen at its edges
  vec3 col = vec3(0.016, 0.017, 0.022) * (0.5 + 0.5 * n.y) * 2.0;
  col += vec3(1.0, 0.55, 0.25) * 0.5 * max(dot(n, uSun), 0.0);
  col += vec3(0.28, 0.3, 0.42) * pow(1.0 - max(dot(-rd, n), 0.0), 3.0) * 0.5;
  // the screen
  if (q.z < -0.36 && abs(q.x) < 0.9 && abs(q.y) < 0.66) col = scScreen(vec2(q.x / 0.86, q.y / 0.62), t) * 2.4 + col * 0.3;
  return vec4(col, tt);
}
float scorerIn(vec2 px, float size) {
  vec2 blk = floor(px / size);
  return step(texelFetch(uNoise, ivec2(mod(blk, 256.0)), 0).b, uMon.x * 1.15 - 0.1);
}`;function ws(n,t,e=430,s=85){let i=[n[0]+t[0]*e,n[1]+t[1]*e,n[2]+t[2]*e],o=i[0]-n[0],a=i[2]-n[2];return{at:i,size:s,turn:Math.atan2(o,a),tip:Math.atan2(i[1]-n[1],Math.hypot(o,a))*.8}}var Zt=16,Hs=`
uniform sampler2D uNoise;
uniform sampler2D uFilmA;   // the film's frame now
uniform sampler2D uFilmB;   // ...and the one fading in over it
uniform sampler2D uGrey;    // a grey value as the video gives it -> as it was written (256 x 1)
uniform vec4 uFilm;         // tan(half the film's view) across and up; the share of a frame's height that is picture; how much of B shows
uniform vec4 uFilmPx;       // half a pixel of the picture's height (as a share of it); the picture's width and height (px)
uniform vec4 uPack;         // how far: z0 (m), periods, 1 = the frames carry it, 1 = read it from B (the frame that sets the camera)
uniform vec4 uPackPx;       // a tile's width and height (px); the row the tiles C and A start at; the row B starts at
uniform vec4 uTone;         // the film's light times this; its colours to this power (over 1: darker, the lights stay); how much colour (1 = as filmed); what to show (tests)
uniform vec3 uTint;
uniform vec3 uSun;          // toward the sun
uniform vec4 uGround;       // the ground White stands on, as a plane: its normal n and d (n . P = d)
uniform vec4 uCapA[${Zt}];  // his body as round-ended pieces: one end, and how thick (0: none)
uniform vec4 uCapB[${Zt}];  // ...the other end
uniform vec4 uFootA[2];     // his feet: the ankle, and how far the foot is off the ground (m)
uniform vec4 uFootB[2];     // ...the toe
uniform vec4 uShade;        // his sun shadow (0..1), the dark under his feet (0..1), his light on the ground, how far from him the ground is known (m)
uniform vec4 uBody;         // a ball round all of him: its middle and radius
uniform vec4 uBug;          // the place showing what it is to the scorer: how much (0..1), its clock (s), blocks up the picture, which view (0: any; 1 how far, 2 what, 3 its shape)
uniform vec4 uSea;          // the sea's level now (m), how far over it still counts as the sea (m)
uniform vec4 uVolc;         // the volcano, far out: its heading (rad, atan(x, z)), how high its top is (rad), half its width at the top and at the horizon (rad)
uniform vec4 uBeam;         // the scorer's search light: where it falls (x, y, z), how wide (m)
uniform vec4 uBeamOn;       // ...how strong (0..1)
uniform vec4 uMonAir;       // the air between you and the scorer: its colour (light), how much of it

const vec3 SHADE = vec3(0.17, 0.21, 0.3);     // what is left of the light in his shadow: the sky's, cooler (the film's own shadows are this deep: the sun is low)
const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);

float n2(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return textureLod(uNoise, (i + f + 0.5) / 256.0, 0.0).r; }
// bright light to what a screen can show (the scorer and the scorer's views are worked out as light)
vec3 toScreenLight(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
${ms}

// the film's picture at uv (0..1, y down)
vec3 filmAt(vec2 uv) {
  vec2 p = vec2(uv.x, min(uv.y, 1.0 - uFilmPx.x) * uFilm.z);
  vec3 c = texture(uFilmA, p).rgb;
  if (uFilm.w > 0.0) c = mix(c, texture(uFilmB, p).rgb, uFilm.w);
  return c;
}
// one pixel of the frame that carries the distances
vec3 frameAt(ivec2 p) { return uPack.w > 0.5 ? texelFetch(uFilmB, p, 0).rgb : texelFetch(uFilmA, p, 0).rgb; }
float grey(ivec2 p) { return texture(uGrey, vec2((dot(frameAt(p), LUMA) * 255.0 + 0.5) / 256.0, 0.5)).r; }

// How far in front of the camera the film's surface is at the tile pixel t (m).
float tileZ(ivec2 t) {
  ivec2 T = ivec2(uPackPx.xy);
  float C = grey(ivec2(t.x, int(uPackPx.z) + t.y));
  float A = grey(ivec2(T.x + t.x, int(uPackPx.z) + t.y));
  float B = grey(ivec2((t.y & 1) * T.x + t.x, int(uPackPx.w) + (t.y >> 1)));
  // where inside the period: from A (B says which of A's slopes), from B (A says which of B's), and
  // of the two the one that is farther from its turn
  float pa = B > 0.5 ? A * 0.5 : 1.0 - A * 0.5;
  float pb = fract((A < 0.5 ? B * 0.5 : 1.0 - B * 0.5) - 0.25);
  float d = fract(pb - pa + 0.5) - 0.5;
  float ph = fract(pa + d * clamp((min(B, 1.0 - B) - min(A, 1.0 - A)) / 0.2 + 0.5, 0.0, 1.0));
  float u = clamp((floor(C * uPack.y - ph + 0.5) + ph) / uPack.y, 1e-4, 1.0);
  return uPack.x * (1.0 / u - 1.0);
}
// ...where the picture's point pp (px) is. fine: of the four tile pixels round it, the one whose
// picture looks most like that point's own; else the nearest.
float filmZ(vec2 pp, bool fine) {
  ivec2 T = ivec2(uPackPx.xy);
  vec2 s = pp * 0.5 + 0.25;
  if (!fine) return tileZ(clamp(ivec2(floor(s)), ivec2(0), T - 1));
  vec2 b = floor(s - 0.5), f = s - 0.5 - b;
  ivec2 q = clamp(ivec2(pp), ivec2(0), ivec2(uFilmPx.yz) - 1);
  vec3 c0 = frameAt(q);
  float best = -1.0;
  ivec2 at = ivec2(0);
  for (int k = 0; k < 4; k++) {
    ivec2 o = ivec2(k & 1, k >> 1);
    ivec2 t = clamp(ivec2(b) + o, ivec2(0), T - 1);
    vec3 dc = frameAt(t * 2) - c0;
    float w = ((o.x == 1 ? f.x : 1.0 - f.x) * (o.y == 1 ? f.y : 1.0 - f.y) + 0.04) * exp(-dot(dc, dc) * 90.0);
    if (w > best) { best = w; at = t; }
  }
  return tileZ(at);
}

// How much of the sun his body takes from the point P (0..1). For each piece: how near the sun's
// ray from P passes it. The edge is soft by how far the shadow has travelled (the sun is not a point:
// its disc is half a degree wide, a little more through this haze), and a piece thinner than that
// softness never makes a full shadow.
float bodyShadow(vec3 P) {
  // (quickly: is P behind him at all, as the sun sees it?)
  vec3 r0 = P - uBody.xyz;
  float al = dot(r0, uSun);
  vec3 pr = r0 - uSun * al;
  float reach = uBody.w + 0.02 + 0.0075 * max(-al, 0.0);
  if (al > uBody.w || dot(pr, pr) > reach * reach) return 0.0;
  float sh = 0.0;
  for (int i = 0; i < ${Zt}; i++) {
    vec4 A = uCapA[i];
    if (A.w <= 0.0) continue;
    vec3 d2 = uCapB[i].xyz - A.xyz, r = P - A.xyz;
    float e = dot(d2, d2), f = dot(d2, r), c = dot(uSun, r), b = dot(uSun, d2);
    float t, u;
    if (e < 1e-8) { u = 0.0; t = max(-c, 0.0); }
    else {
      float den = e - b * b;
      t = den > 1e-8 ? max((b * f - c * e) / den, 0.0) : 0.0;
      u = clamp((b * t + f) / e, 0.0, 1.0);
      t = max(u * b - c, 0.0);
    }
    if (t < 0.01) continue;                       // (the sun's ray from here does not go his way)
    float d = length(r + uSun * t - d2 * u);
    float w = 0.008 + 0.0075 * t;
    float k = (1.0 - smoothstep(A.w - w, A.w + w, d)) * min(1.0, A.w / w);
    sh = max(sh, k);
  }
  return sh;
}

// The film's surface at the tile pixel tp, as a point of the world.
vec3 tileP(ivec2 tp) {
  tp = clamp(tp, ivec2(0), ivec2(uPackPx.xy) - 1);
  vec2 uv = (vec2(tp) * 2.0 + 0.5) / uFilmPx.yz;
  vec2 q = vec2(2.0 * uv.x - 1.0, 1.0 - 2.0 * uv.y) * uFilm.xy;
  return uCamPos + (uCamF + uCamR * q.x + uCamU * q.y) * tileZ(tp);
}
// Which way the film's surface faces at the picture's point pp (px), z m in front of the camera:
// from its neighbours (farther apart the farther away it is, where the distances are less exact).
vec3 filmN(vec2 pp, float z) {
  ivec2 tp = ivec2(floor(pp * 0.5 + 0.25));
  // (near: at least 6 cm apart, or the few millimetres the distances are out by would show; far: wider still)
  int s = int(clamp(max(ceil(41.0 / z), ceil(z * 0.07)), 1.0, 12.0));
  vec3 a = tileP(tp + ivec2(s, 0)) - tileP(tp - ivec2(s, 0));
  vec3 b = tileP(tp + ivec2(0, s)) - tileP(tp - ivec2(0, s));
  vec3 n = normalize(cross(a, b) + vec3(0.0, 1e-7, 0.0));
  return dot(n, uCamF) > 0.0 ? -n : n;
}
// is this ray (far, above the horizon) on the volcano? (the scorer's idea of it: a plain cone)
bool onVolcano(vec3 rd) {
  float el = asin(clamp(rd.y, -1.0, 1.0));
  if (el > uVolc.y) return false;
  float dh = atan(rd.x, rd.z) - uVolc.x;
  dh = abs(atan(sin(dh), cos(dh)));
  return dh < mix(uVolc.w, uVolc.z, pow(clamp(el / uVolc.y, 0.0, 1.0), 0.75));
}
// What the place is to the scorer, at one pixel. v: 1 how far everything is, 2 what everything is,
// 3 its shape. c: the film's colour there (as on the screen); t: how far along the ray the film's
// surface is (below 0: too far to say); z: the same, in front of the camera.
vec3 scorerView(float v, vec3 ro, vec3 rd, vec2 uv, vec3 c, float t, float z) {
  bool near = t > 0.0;
  if (v < 1.5) {
    // how far: near is light, in steps
    float dist = near ? t : 1e4;
    float g = exp(-dist / 45.0);
    return vec3(0.03 + 0.5 * g) * (0.88 + 0.12 * step(0.5, fract(log2(max(dist, 0.1)) * 6.0)));
  }
  vec3 P = ro + rd * max(t, 0.0);
  vec3 n = near ? filmN(uv * uFilmPx.yz, z) : vec3(0.0, 1.0, 0.0);
  bool steep = n.y < 0.72;
  if (v < 2.5) {
    // what: one flat colour a kind
    if (!near) {
      if (rd.y < 0.002) return vec3(0.03, 0.045, 0.34);                      // the sea, far out
      if (onVolcano(rd)) return vec3(0.42, 0.07, 0.045);                    // rock
      // the sky, and the clouds in it (told apart by how bright they are)
      return dot(c, LUMA) > 0.62 ? vec3(0.07, 0.36, 0.38) : vec3(0.025, 0.28, 0.31);
    }
    if (P.y < uSea.x + uSea.y) return vec3(0.03, 0.045, 0.34);                              // water (the film's distances go through it, to the sea's floor)
    if (c.g > c.r * 1.05 && c.g > c.b * 1.12 && c.g > 0.05) return vec3(0.13, 0.32, 0.12);  // plants
    return steep ? vec3(0.42, 0.07, 0.045) : vec3(0.34, 0.27, 0.04);                        // rock; ground
  }
  // its shape: lines on it a metre apart (ten metres apart far off); the sky: every ten degrees
  float ln = 0.0;
  if (!near) {
    float a1 = atan(rd.x, rd.z) / 0.1745, a2 = asin(clamp(rd.y, -1.0, 1.0)) / 0.1745;
    ln = max(1.0 - smoothstep(0.0, 0.03, abs(fract(a1 + 0.5) - 0.5)), 1.0 - smoothstep(0.0, 0.03, abs(fract(a2 + 0.5) - 0.5))) * 0.3;
    if (rd.y > 0.002 && onVolcano(rd)) ln = max(ln, 0.16);
  } else {
    float wdt = 0.012 + t * 0.0022;
    vec3 f = abs(fract(P + vec3(0.5, 0.0, 0.5)) - 0.5);
    float m = steep ? min(f.x, min(f.y, f.z)) : min(f.x, f.z);
    ln = (1.0 - smoothstep(wdt * 0.5, wdt, m)) * exp(-t * 0.03);
    vec3 f2 = abs(fract(P * 0.1 + vec3(0.5, 0.0, 0.5)) - 0.5) * 10.0;
    float m2 = steep ? min(f2.x, min(f2.y, f2.z)) : min(f2.x, f2.z);
    ln = max(ln, (1.0 - smoothstep(wdt * 0.5, wdt, m2)) * exp(-t * 0.004) * 0.8);
  }
  return vec3(0.003, 0.006, 0.009) + vec3(0.12, 0.5, 0.36) * ln;
}

vec4 world(vec3 ro, vec3 rd) {
  float fz = max(dot(rd, uCamF), 1e-4);
  vec2 q = vec2(dot(rd, uCamR), dot(rd, uCamU)) / (fz * uFilm.xy);
  vec2 uv = clamp(vec2(0.5 + 0.5 * q.x, 0.5 - 0.5 * q.y), 0.0, 1.0);
  vec3 c = filmAt(uv);
  if (uTone.y != 1.0) c = pow(c, vec3(uTone.y));
  vec3 lin = pow(c, vec3(2.2)) * uTone.x * uTint;
  if (uTone.z != 1.0) lin = max(mix(vec3(dot(lin, LUMA)), lin, uTone.z), 0.0);
  vec3 sky = lin;       // (the film's own light here, before anything is put on it)

  // the film's surface this ray meets: P, t along the ray; far: how far the film covers White from (1e4: never)
  float t = -1.0, far = 1e4, known = 1.0, z = 1e5;
  bool lit = uShade.w > 0.0 && uWhiteGlow > 0.0;
  bool looked = uBug.x > 0.0 || uBeamOn.x > 0.0 || uMon.x > 0.001;       // (the scorer is here: every pixel's distance is wanted)
  if (uPack.z > 0.5 && (lit || uFigOn > 0.5 || uTone.w > 0.5 || looked)) {
    vec2 sp = gl_FragCoord.xy * (uScreen.xy / uView.xy);
    bool fine = uFigOn > 0.5 && sp.x > uFigRect.x - 2.0 && sp.y > uFigRect.y - 2.0 && sp.x < uFigRect.x + uFigRect.z + 2.0 && sp.y < uFigRect.y + uFigRect.w + 2.0;
    z = filmZ(uv * uFilmPx.yz, fine);
    if (uTone.w > 0.5) { float g = uPack.x / (uPack.x + z); return vec4(uTone.w > 1.5 ? vec3(fract(z)) : vec3(g), 1e4); }
    if (z < 3000.0) { t = z / fz; far = t; }
  } else if (lit) {
    float den = dot(uGround.xyz, rd);
    if (den < -1e-4) {
      t = (uGround.w - dot(uGround.xyz, ro)) / den;
      known = 1.0 - smoothstep(uShade.w * 0.5, uShade.w, distance(ro + rd * t, uWhiteRoot));
    }
  }
  if (lit && t > 0.0 && known > 0.0) {
    vec3 P = ro + rd * t;
    float lum = dot(lin, LUMA);
    // his shadow (where the ground is in shade already there is no sunlight to take away)
    float sh = bodyShadow(P) * uShade.x * known * smoothstep(0.02, 0.11, lum);
    lin *= mix(vec3(1.0), SHADE, sh);
    // the dark under his feet
    float ao = 0.0;
    for (int i = 0; i < 2; i++) {
      vec3 a = uFootA[i].xyz, b = uFootB[i].xyz;
      a -= uGround.xyz * (dot(uGround.xyz, a) - uGround.w);
      b -= uGround.xyz * (dot(uGround.xyz, b) - uGround.w);
      vec3 ab = b - a, ap = P - a;
      float d = length(ap - ab * clamp(dot(ap, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0));
      ao = max(ao, (1.0 - smoothstep(0.035, 0.17, d)) * (1.0 - smoothstep(0.02, 0.2, uFootA[i].w)));
    }
    lin *= 1.0 - uShade.y * ao * known;
    // his own light
    lin *= 1.0 + uShade.z * whiteLight(P, uGround.xyz) * known;
  }

  // ---- the place showing what it is to the scorer: in blocks that come and go
  bool known3 = uPack.z > 0.5;      // (the film says how far things are)
  if (uBug.x > 0.0 && known3) {
    float bs = uView.y / uBug.z;
    vec2 blk = floor(gl_FragCoord.xy / bs), big = floor(gl_FragCoord.xy / (bs * 4.0));
    float tick = floor(uBug.y * 9.0);
    vec4 r1 = texelFetch(uNoise, ivec2(mod(blk + vec2(tick * 17.0, tick * 31.0), 256.0)), 0);
    vec4 r2 = texelFetch(uNoise, ivec2(mod(big + vec2(tick * 7.0 + 91.0, tick * 13.0), 256.0)), 0);
    if (r1.g < uBug.x * uBug.x * 0.9 || r2.b < uBug.x * 0.6 || uBug.x >= 0.999) {
      float v = uBug.w > 0.5 ? uBug.w : 1.0 + floor(r2.a * 2.999);
      lin = toScreenLight(scorerView(v, ro, rd, uv, c, t, z));
    }
  }

  // ---- the scorer, in front of the film's sky and behind whatever the film has nearer
  if (uMon.x > 0.001) {
    vec4 mo = scorer(ro, rd, uView.w);
    if (mo.a > 0.0 && (t < 0.0 || mo.a < t) && scorerIn(gl_FragCoord.xy, uView.y / 46.0) > 0.5) {
      vec3 mc = toScreenLight(mo.rgb * 0.55);
      // the air between (it hangs far off, in the morning's haze), and the film's brightest light
      // spills over its edges, as it does in the film's own lens
      mc = mix(mc, uMonAir.rgb, uMonAir.a);
      mc += sky * smoothstep(0.9, 1.2, dot(sky, LUMA)) * 0.45;
      lin = mc;
    }
  }
  // ---- its search light: a shaft from its screen, and where it falls on the film's ground
  if (uBeamOn.x > 0.0) {
    vec3 a = uMonAt.xyz, b = uBeam.xyz;
    vec3 ab = b - a;
    vec3 n = cross(rd, ab);
    float nl = length(n);
    float time = uView.w;
    if (nl > 1e-4) {
      // the point of the shaft's middle line the ray passes nearest
      float tb = clamp(dot(cross(a - ro, rd), n) / (nl * nl), 0.0, 1.0);
      vec3 pb = a + ab * tb;
      float tr = dot(pb - ro, rd);
      float wdt = mix(uMonAt.w * 0.5, uBeam.w, tb);
      float d = length(ro + rd * tr - pb);
      if (tr > 0.0 && (t < 0.0 || tr < t + wdt)) {
        float g = exp(-d * d / (wdt * wdt * 0.5));
        float lines = 0.75 + 0.25 * sin(tb * 900.0 - time * 14.0);
        lin += vec3(0.7, 0.9, 1.0) * g * 0.2 * uBeamOn.x * lines;
      }
    }
    if (t > 0.0) {
      vec3 P = ro + rd * t;
      float r = distance(P.xz, uBeam.xz) / uBeam.w;
      float up = 1.0 - smoothstep(2.0, 5.0, abs(P.y - uBeam.y));
      float spot = 1.0 - smoothstep(0.85, 1.0, r);
      float grid = step(0.9, fract(P.x * 2.0)) + step(0.9, fract(P.z * 2.0));
      float ring = 1.0 - smoothstep(0.0, 0.05, abs(r - 0.95));
      lin += vec3(0.65, 0.9, 1.0) * uBeamOn.x * up * (spot * (0.07 + 0.2 * grid * (0.6 + 0.4 * sin(time * 20.0 + P.x * 3.0))) + ring * 0.6);
    }
  }
  return vec4(pow(max(lin, 0.0), vec3(1.0 / 2.2)), far);
}`,Xs=[Math.atan2(-Math.sin(95.5*A),Math.cos(95.5*A)),6.35*A,1.15*A,9.3*A];function js(n){let t=n.d.sea;if(!t)return-1e3;let e=t.dz&&t.dz[x(Math.round(n.frame),0,t.dz.length-1)]||0;return(t.z+e-n.O[2])/100}function vs(n){let t=new Float32Array(4*Zt),e=new Float32Array(4*Zt),s=new Float32Array(8),i=new Float32Array(8);return{name:"film",fs:Hs,film:n,sun:n.sun,sunLight:.55,look:{exposure:1,contrast:1,saturation:1,vignette:0,lift:[0,0,0],grain:.014,rim:.5,rimDepth:.4,rimCol:[1,.9,.76],air:0,airCol:[.5,.5,.5],glow:1,depth:!0,direct:!0,depthTol:[.03,1/(1.6*1371)]},tone:{gain:1,gamma:1,colour:1,tint:[1,1,1]},shade:{sun:.92,feet:.55,light:.4,reach:14},show:0,mon:{on:0,light:0,look:[0,0],wake:0,at:[-368,196,106],size:85,turn:-1.29,tip:.37,air:[.47,.44,.43,.22]},beam:{at:[0,0,0],width:3,on:0},bug:[0,0,24,0],root:[0,0,0],n:[0,1,0],ball:[0,1,0,1.5],init(o){this.noise=Ne(o),n.attach(o)},ground(o,a){return n.floor(o,a)},depthOn(){return!!n.pack},white(o,a,r){if(t.fill(0),!o||!o.head)return;let h=0,l=(d,z,v)=>{let b=o[d],k=o[z];!b||!k||(t.set(b,4*h),t[4*h+3]=v,e.set(k,4*h),h++)},c=.5*(a.chestW+a.r.chest);l("head","head",a.R),l("neck","chest",c),l("chest","waist",c),l("waist","hip",c);for(let d of["L","R"])l("sh"+d,"el"+d,a.r.elbow),l("el"+d,"wr"+d,a.r.wrist),l("wr"+d,"ti"+d,a.r.wrist*.8),l("hj"+d,"kne"+d,a.r.knee),l("kne"+d,"an"+d,a.r.ankle),l("an"+d,"to"+d,a.r.toe);let u=[1e9,1e9,1e9],m=[-1e9,-1e9,-1e9];for(let d=0;d<h;d++)for(let z of[t,e])for(let v=0;v<3;v++){let b=z[4*d+v],k=t[4*d+3];b-k<u[v]&&(u[v]=b-k),b+k>m[v]&&(m[v]=b+k)}this.ball=[(u[0]+m[0])/2,(u[1]+m[1])/2,(u[2]+m[2])/2,.5*Math.hypot(m[0]-u[0],m[1]-u[1],m[2]-u[2])],this.root=r,this.n=n.normal(r[0],r[2]);let g=this.n[0]*r[0]+this.n[1]*r[1]+this.n[2]*r[2];["L","R"].forEach((d,z)=>{let v=o["an"+d],b=o["to"+d];s.set(v,4*z),i.set(b,4*z);let k=(_,E)=>this.n[0]*_[0]+this.n[1]*_[1]+this.n[2]*_[2]-g-E;s[4*z+3]=Math.max(0,Math.min(k(v,a.r.ankle),k(b,a.r.toe)))})},uniforms(){let o=n,a=this.n,r=this.root,h=this.tone,l=this.shade,c=o.pack,u=this.mon,m=this.beam,g=o.fade&&o.full[1-o.front]?1:0;return{uNoise:this.noise,uFilmA:o.tex[o.front],uFilmB:o.tex[1-o.front],uGrey:o.grey,uFilm:[o.tanX,o.tanY,o.rows,x(o.mix,0,1)],uFilmPx:[.5/Math.max(o.picH||1080,1),o.picW||1920,o.picH||1080,0],uPack:c?[c.z0,c.periods,1,g]:[4,16,0,0],uPackPx:c?[c.tile[0],c.tile[1],c.rowCA,c.rowB]:[960,540,1080,1624],uTone:[h.gain,h.gamma,h.colour,this.show],uTint:h.tint,uSun:o.sun,uGround:[a[0],a[1],a[2],a[0]*r[0]+a[1]*r[1]+a[2]*r[2]],uCapA:t,uCapB:e,uFootA:s,uFootB:i,uShade:[l.sun,l.feet,l.light,l.reach],uBody:this.ball,uBug:this.bug,uSea:[js(o),.1,0,0],uVolc:Xs,uMon:[u.on,u.light,u.look[0],u.look[1]],uMonAt:[u.at[0],u.at[1],u.at[2],u.size],uMonTilt:[u.turn,u.tip,u.wake,0],uMonAir:u.air,uBeam:[m.at[0],m.at[1],m.at[2],m.width],uBeamOn:[m.on,0,0,0]}}}}var De=1.1,Ce=4e3,Ys={A:["f0000.jpg",0],B:["f0420.jpg",420],C:["f0700.jpg",700],D:["f1000.jpg",1e3]},ht=(n,t)=>[n,t],Vs=[["A",ht("sun","\u592A\u9633"),[.2,.172,.268,.252],1],["A",ht("volcano","\u706B\u5C71"),[.362,.138,.5,.318],.91],["A",ht("ridge","\u5C71\u810A"),[.52,.176,.985,.318],.95],["A",ht("sea","\u6D77"),[.03,.335,.5,.5],.99],["A",ht("rock","\u5CA9\u77F3"),[.012,.548,.398,.73],.98],["A",ht("rock","\u5CA9\u77F3"),[.727,.622,.985,.9],.97],["A",ht("grass","\u8349"),[.172,.772,.598,.95],.88],["B",ht("crag","\u5CA9\u5CF0"),[.012,.192,.438,.508],.96],["B",ht("crag","\u5CA9\u5CF0"),[.462,.042,.985,.498],.95],["B",ht("shrub","\u704C\u6728"),[.527,.416,.648,.5],.83],["B",ht("boulder","\u5DE8\u77F3"),[.336,.752,.42,.83],.99],["B",ht("grass","\u8349"),[.732,.692,.98,.85],.9]],Et={unknown:ht("unknown","\u672A\u77E5"),notInSet:ht("NOT IN THE SET","\u4E0D\u5728\u6570\u636E\u96C6\u5185"),observer:ht("OBSERVER \xB7 NOT IN THE SET","\u89C2\u5BDF\u8005 \xB7 \u4E0D\u5728\u6570\u636E\u96C6\u5185"),unplug:ht("UNPLUG","\u65AD\u5F00")},xs="rgb(120,255,200)",qe="rgb(255,70,60)",Js="rgb(255,190,60)",Zs="rgb(255,214,90)",de="rgb(236,238,246)",pe=class{constructor(t,e={}){this.E=t,this.doc=e.doc||document,this.say=e.tr||(a=>a),this.speed=e.speed||(()=>1),this.calm=e.calm||(()=>!1),this.base=e.base||"",this.useFilm=e.film!==!1;let s=this.doc,i=(a,r)=>{let h=s.createElement(a);return h.className=r,h};this.root=i("div","w3"),this.canvas=i("canvas","w3-world"),this.over=i("canvas","w3-over"),this.veil=i("div","w3-veil"),this.tag=i("div","w3-tag"),this.sayEl=i("p","w3-say");let o=i("span","w3-who");o.textContent="WHITE",this.line=i("div","w3-line"),this.line.append(o,this.sayEl),this.root.append(this.canvas,this.over,this.line,this.tag,this.veil),this.g=this.over.getContext("2d"),this.rig=new ne(JSON.parse(JSON.stringify(Ee))),this.fig=new re(t,this.rig),this.stage=new he(this.canvas),this.actor=new ce(this.rig),this.actor.onStep=(a,r)=>{this.onStep&&this.onStep(a,r,this.actor.speed)},this.film=null,this.world=null,this.moving=!1,this.things=[],this.on=!1,this.t=0,this.whiteOn=!1,this.free=1,this.shake=0,this.labels=0,this.alarm=0,this.panel=null,this.search=null,this.onStep=null,this._ptr=[0,0],this._look=new nt([0,0],2.2,1),this._waits=[],this._ticks=new Set,this._aims={},this._lead=null,this._run=null,this._clips=0,this._fps={ema:16,n:0},this.stage.scale=e.scale||1,this.maxScale=e.maxScale||1,this.maxDt=e.maxDt||.25,this.clock=e.clock||null,this.frames=0,this._frame=this._frame.bind(this),this._onPtr=a=>{let r=this.root.getBoundingClientRect();r.width>0&&(this._ptr=[x((a.clientX-r.left)/r.width*2-1,-1,1),x((a.clientY-r.top)/r.height*2-1,-1,1)])},this._onHide=()=>{this.film&&this.film.pause(this.held||this.doc.hidden)}}hold(t){this.held=!!t,this.film&&this.film.pause(this.held||this.doc.hidden)}load(){if(this._load)return this._load;let t=this.dir=this.base+"assets/hook/",e=s=>fetch(t+s).then(i=>{if(!i.ok)throw new Error(s+": "+i.status);return i.json()});return this._load=(async()=>{let[s,i,o]=await Promise.all([e("film.json"),e("ground.json").catch(()=>null),e("moves.json").catch(()=>({}))]),a=this.film=new ue(s,{doc:this.doc,ground:i,speed:this.speed,src:[{url:t+"film.mp4",type:"video/mp4"},{url:t+"film.webm",type:"video/webm"}]}),r=this.world=vs(a);return this.stage.setWorld(r),this.actor.ground=(h,l)=>r.ground(h,l),this.actor.moves=o,this._things(),this.moving=this.useFilm?await a.load():!1,this.moving||await this._still("A"),this.moving})(),this._load}_things(){let t=this.film;this.things=[];for(let[e,s,i,o]of Vs){let a=t.clips.get(e);if(!a)continue;let r=t.camAt(a.loop?a.loop[0]:a.start),h=ae(r.pos,q(r.pos,r.dir),1,16,9,r.roll),l=h.b,c=(u,m)=>{let g=-(2*u-1)*t.tanX,d=(1-2*m)*t.tanY;return[r.pos[0]+(l.z[0]+l.x[0]*g+l.y[0]*d)*Ce,r.pos[1]+(l.z[1]+l.x[1]*g+l.y[1]*d)*Ce,r.pos[2]+(l.z[2]+l.x[2]*g+l.y[2]*d)*Ce]};this.things.push({name:s,sure:o,pts:[c(i[0],i[1]),c(i[2],i[1]),c(i[0],i[3]),c(i[2],i[3])]})}}async _still(t){let e=Ys[t];e&&await this.film.still(this.dir+"still/"+e[0],e[1])}open(){if(this.on||!this.world)return;this.on=!0,this.t=0,this._last=0;let t=this.world;t.bug=[0,0,24,0],t.mon.on=0,t.mon.light=0,t.mon.wake=0,t.mon.look=[0,0],t.beam.on=0,this.stage.tear=[0,0,0],this.labels=0,this.alarm=0,this.panel=null,this.search=null,this.shake=0,this.free=1,this.whiteOn=!1,this._lead=null,this._run=null,this._clips=0,this.veil.style.transition="none",this.veil.style.background="#000",this.veil.style.opacity="1",this.fig.enter(),this.root.addEventListener("pointermove",this._onPtr),document.addEventListener("visibilitychange",this._onHide),this.raf=requestAnimationFrame(this._frame)}close(){if(this.on){this.on=!1,cancelAnimationFrame(this.raf),this.root.removeEventListener("pointermove",this._onPtr),document.removeEventListener("visibilitychange",this._onHide);for(let t of this._waits.splice(0))t.r(!1);if(this._ticks.clear(),this._run){let t=this._run;this._run=null,t.res()}this.film&&this.film.stop(),this.actor.stopWalking(),this.fig.exit()}}wait(t){return new Promise(e=>{if(!this.on)return e(!1);this._waits.push({at:this.t+t,r:e})})}until(t,e=20){return new Promise(s=>{if(!this.on)return s(!1);this._waits.push({at:this.t+e,r:s,test:t})})}every(t){let e={f:t};return this._ticks.add(e),()=>this._ticks.delete(e)}tween(t,e,s,i,o=Ct){return new Promise(a=>{if(!this.on)return i(e),a();let r=this.t;i(t),this.every(h=>{let l=s>0?x((h-r)/s,0,1):1;return i(w(t,e,o(l))),l>=1?(a(),!0):!1})})}aim(t,e,s=0,i=Ct){let o=this._aims[t]=(this._aims[t]||0)+1;return!(s>0)||!this.on?(this[t]=e,Promise.resolve()):this.tween(this[t],e,s,a=>{this._aims[t]===o&&(this[t]=a)},i)}async clip(t,e={}){let s=this.film,i=!this._clips++;if(this.clipName=t,this.moving&&!s.stuck&&await s.go(t,e),this.moving){if(!s.stuck)return;this.moving=!1,s.giveUp(),console.warn("[white] the film stopped playing: still pictures from here")}let o=s.clips.get(t);if(i||await this.fade("#000",1,220),await this._still(t),await s.go(t),i||this.fade("#000",0,320),o&&!o.loop&&o.move>0){let a=o.start+o.frames-1,r=s.camAt(a).dir,h=o.start;for(;h<a&&K(s.camAt(h).dir,r)<Math.cos(4*A);)h++;s.frame=h,await new Promise(l=>{this._run={f:h,to:a,res:l}})}}spot(t,e){return this.film.spot(t,e)}get eye(){return this.film.camAt(this.film.frame).pos}enter(t,e,s=0){let i=this.spot(t,e),o=this.eye;this.actor.place(i[0],i[1],Math.atan2(o[0]-i[0],o[2]-i[1])+s*A),this.actor.lookAt("eye"),this.whiteOn=!0,this.glitch(1)}glitch(t=1){this.E.breath&&this.E.breath.now&&this.E.breath.now(t)}leave(){this.whiteOn=!1,this._lead=null}lead(t=3.2,e=-.7,s=1.2){this._lead={ahead:t,side:e,sec:s,t0:this.t,from:null}}_leadStep(t,e){let s=this._lead,i=this.actor,o=this.film,a=t.b.z[0],r=t.b.z[2],h=Math.hypot(a,r)||1;a/=h,r/=h;let l=-r,c=a,u=t.pos;s.from||(s.from=[i.pos[0],i.pos[2]]);let m=Ct(x((this.t-s.t0)/Math.max(.01,s.sec),0,1)),g=[u[0]+a*s.ahead+l*s.side,u[2]+r*s.ahead+c*s.side],d=[w(s.from[0],g[0],m),w(s.from[1],g[1],m)],z=Math.round(o.frame),v=o.camAt(z-1).pos,b=o.camAt(z+1).pos,k=Math.hypot(b[0]-v[0],b[2]-v[2])*o.fps/2,_=x(k+(m<1?Math.hypot(g[0]-s.from[0],g[1]-s.from[1])/Math.max(.2,s.sec)*.6:0),0,9.5);if(_>.2||i.goal){let E=i.pos[0]+a*12,R=i.pos[2]+r*12;i.goal?(i.goal.x=E,i.goal.z=R,i.goal.speed=Math.max(_,.2),i.goal.burst=3.2):i.walkTo(E,R,{speed:Math.max(_,.2),burst:3.2})}return d}bug(t,e=0,s=!1){this.world.bug[0]=t*(this.calm()?.4:1),this.world.bug[3]=e,this._bugStill=s}tear(t,e=0){let s=this.calm()?.3:1;this.stage.tear[0]=t*s,this.stage.tear[2]=e*s}scorerAt(t=700,e=74,s=27,i=430,o=85){return Object.assign(this.world.mon,ws(this.film.camAt(t).pos,this.film.dir(s,e),i,o)),this.world.mon}get mon(){return this.world.mon}get beam(){return this.world.beam}async arrive(){this.bug(1,3,!0),await this.clip("A",{fade:0}),this.fade("#000",0,1500),await this.wait(2.1),await this.tween(1,0,2.8,t=>this.bug(t,3,!0)),this.bug(0)}names(t=3.6){return this.aim("labels",1,t,e=>e)}uneasy(){this.aim("alarm",.5,1.4),this.bug(.13,0),this.tear(.1,0)}caught(){this.aim("alarm",1),this.aim("shake",.3),this.bug(.27,0),this.tear(.22,2.2),this.aim("labels",.35,.8)}async scorerComes(){let t=this.scorerAt();t.on=0,t.light=0,t.wake=.05,t.look=[.7,.45],this.aim("labels",0,.7),this.tween(0,1,2.6,s=>{t.on=s},s=>s),await this.wait(1.3),this.tween(0,1,2.2,s=>{t.light=s}),await this.wait(1.4),await this.tween(.05,1,1.1,s=>{t.wake=s});let e=this.t;await this.tween(0,1,1.9,s=>{let i=this.t-e,o=1-s;t.look=[o*.8*Math.cos(i*3.1+.6),o*.5*Math.sin(i*4.3)]}),t.look=[0,0],this.aim("shake",.5)}async escape(t){let e=this.film,s=e.clips.get("D"),i=s.start,o=s.start+s.frames-1,a=this.panel={on:0,prog:0,keys:[]},r=this.search={ahead:16,side:-10,width:4.2,on:0};this.free=.3,this.lead(3.3,-.8,.9),this.actor.lookAt(null),this.actor.gesture("ui",{side:"R",rate:7,onTap:()=>{a.keys[Math.floor(Math.random()*32)]=1,t&&t()}});let h=this.every(()=>{let l=x((e.frame-(i+26))/(o-6-(i+26)),0,1);a.on=Y(0,.1,l),a.prog=Math.pow(l,1.25),r.on=Y(0,.2,l),r.side=w(-10,.4,Math.pow(l,.8)),r.ahead=w(16,3.6,l),this.shake=.35+.45*l,this.tear(.14+.3*l,1.6+3.6*l),this.bug(.1+.16*l,0)});this.clip("D",{fade:.25}),await this.until(()=>a.prog>=.999,12),h(),a.prog=1,this.actor.stop("ui")}_frame(t){if(!this.on)return;this.raf=requestAnimationFrame(this._frame);let e=this.clock?this.clock(t):this._last?(t-this._last)/1e3:.016;this._last=t;let s=x(e,0,this.maxDt)*this.speed(),i=this.canvas,o=i.clientWidth,a=i.clientHeight;if(!o||!a)return;let r=this.doc.defaultView||window,h=Math.min(r.devicePixelRatio||1,2);this.stage.size(o*h,a*h);let l=i.width,c=i.height,u=this.film,m=this.world;(this.over.width!==l||this.over.height!==c)&&(this.over.width=l,this.over.height=c),this.t+=s;let g=this.t;this._bugStill||(m.bug[1]=g),this.stage.tear[1]=g;for(let p=this._waits.length-1;p>=0;p--){let M=this._waits[p],P=M.test?M.test():!1;(P||M.at<=g)&&(this._waits.splice(p,1),M.r(!!P))}for(let p of[...this._ticks])p.f(g,s)===!0&&this._ticks.delete(p);if(u.tick(s),this._run){let p=this._run;p.f=Math.min(p.to,p.f+s*u.fps),u.frame=p.f,p.f>=p.to&&(this._run=null,u.phase="end",p.res())}let d=u.camera(l,c);this.cam=d;let z=this._look.step([this._ptr[0]*this.free,this._ptr[1]*this.free],s),v=l*(1-1/De)/2,b=c*(1-1/De)/2,k=x(this.shake,0,1)*(this.calm()?.3:1),_=this.stage.sway;_[0]=v*x(z[0]*.7+.05*dt(g*.31,3)+k*.25*dt(g*17,5),-1,1),_[1]=b*x(-z[1]*.7+.05*dt(g*.27,4)+k*.25*dt(g*19,6),-1,1),_[2]=k*.012*dt(g*13,7),_[3]=De;let E=null,R=null,f=this.rig.J;if(this.whiteOn){E=this.fig.frame(t,d,M=>{this.actor.eye=d.pos;let P=this._lead?this._leadStep(d,s):null,T=Math.max(1,Math.ceil(s/.034)),B=s/T;for(let N=1;N<=T;N++)this.actor.update(g-s+N*B,B,M);if(P){let N=this.actor,C=P[0]-N.pos[0],G=P[1]-N.pos[2],W=new Set,j=N.ground?N.ground(P[0],P[1])-N.ground(N.pos[0],N.pos[2]):0;for(let Q in f){let I=f[Q];!I||W.has(I)||(W.add(I),I[0]+=C,I[1]+=j,I[2]+=G)}}});let p=[f.hip[0],m.ground(f.hip[0],f.hip[2]),f.hip[2]];m.white(E?f:null,this.rig.B,p),R=E?{head:f.head,chest:f.chest,hip:f.hip,root:p}:null}else m.white(null,this.rig.B,[0,0,0]);let y=this.search;if(y){let p=d.b.z[0],M=d.b.z[2],P=Math.hypot(p,M)||1;p/=P,M/=P;let T=d.pos[0]+p*y.ahead-M*y.side,B=d.pos[2]+M*y.ahead+p*y.side;m.beam.at=[T,u.floor(T,B),B],m.beam.width=y.width??3,m.beam.on=y.on??1}this.stage.render(g,d,E,R),this._flat(d,E,l,c,h*x(a/720,.85,1.5)),this._pace(e),this.frames++}_pace(t){let e=this._fps;if(e.ema+=(t*1e3-e.ema)*.08,++e.n<24)return;e.n=0;let s=this.stage.scale;e.ema>21&&s>.36?this.stage.scale=Math.max(.36,s*.86):e.ema<14.5&&s<this.maxScale&&(this.stage.scale=Math.min(this.maxScale,s*1.08))}_flat(t,e,s,i,o){let a=this.g,r=this.say,h=this.t,l=this.stage.sway;a.setTransform(1,0,0,1,0,0),a.clearRect(0,0,s,i);let c=_=>_*o,u=(_,E=500)=>`${E} ${c(_)}px ui-monospace, "SF Mono", Menlo, Consolas, "PingFang SC", "Microsoft YaHei", monospace`,m=()=>{a.setTransform(1,0,0,1,0,0),a.translate(s/2,i/2),a.scale(l[3],l[3]),a.rotate(l[2]),a.translate(-s/2-l[0],-i/2+l[1])},g=s/2-s/2/l[3]+l[0],d=s/2+s/2/l[3]+l[0],z=i/2-i/2/l[3]-l[1],v=i/2+i/2/l[3]-l[1];a.lineWidth=c(1),a.textBaseline="bottom";let b=(_,E,R,f,y,p,M,P)=>{let T=x(_,g+c(4),Math.max(g+c(4),Math.min(R,d)-c(40))),B=x(E,z+c(20),v-c(4));a.globalAlpha=M,a.strokeStyle=p,a.fillStyle=p,a.setLineDash(P?[c(5),c(4)]:[]),a.strokeRect(Math.round(_)+.5,Math.round(E)+.5,Math.round(R-_),Math.round(f-E)),a.setLineDash([]);let N=c(7);a.beginPath();for(let[G,W,j,Q]of[[_,E,1,1],[R,E,-1,1],[_,f,1,-1],[R,f,-1,-1]])a.moveTo(G,W+Q*N),a.lineTo(G,W),a.lineTo(G+j*N,W);a.lineWidth=c(2),a.stroke(),a.lineWidth=c(1),a.font=u(10.5,600);let C=a.measureText(y).width+c(10);a.fillRect(Math.round(T),Math.round(B)-c(16),C,c(16)),a.fillStyle="#06080a",a.fillText(y,Math.round(T)+c(5),Math.round(B)-c(2.5)),a.globalAlpha=1};if(m(),this.labels>.01){let _=this.labels,E=this.things.length;if(this.things.forEach((R,f)=>{let y=x(_*(E+2)-f,0,1);if(y<=0)return;let p=1e9,M=1e9,P=-1e9,T=-1e9,B=!0;for(let G of R.pts){let W=Jt(t,G);if(W[2]<.5){B=!1;break}p=Math.min(p,W[0]),P=Math.max(P,W[0]),M=Math.min(M,i-W[1]),T=Math.max(T,i-W[1])}if(!B||P<g||p>d||T<z||M>v)return;let N=R.sure-.012*(.5+.5*Math.sin(h*2.3+f*1.7)),C=y<1&&Math.sin(h*50+f)>.2?.4:1;b(p,M,P,T,r(R.name[0],R.name[1])+" "+N.toFixed(2),xs,.8*y*C,!1)}),e&&e.visible!==!1&&this.whiteOn){let R=this.alarm,f=this.rig.J,y=R>.5?Math.sin(h*22)>0?qe:Js:Zs,p=Jt(t,q(f.head,[0,.2,0])),M=Jt(t,[f.hip[0],this.world.ground(f.hip[0],f.hip[2]),f.hip[2]]);if(p[2]>.3&&M[2]>.3){let P=Math.abs(p[1]-M[1])*.24,T=(p[0]+M[0])/2;b(T-P,i-p[1],T+P,i-M[1],R>.5?r(Et.notInSet[0],Et.notInSet[1])+" 0.00":r(Et.unknown[0],Et.unknown[1])+" "+(.07-.05*R).toFixed(2),y,x(_*2-.6,0,1),R<=.5)}}}let k=this.panel;if(k&&k.on>.01&&this.whiteOn&&e&&e.visible!==!1){let _=this.rig.J,E=_.haR||_.wrR||_.chest,R=Jt(t,q(E,[0,.12,0]));if(R[2]>.2){let f=x(t.f/R[2]/380,.7,2.2)*o,y=250*f,p=150*f,M=x(R[0]+14*f,g+c(8),d-y-c(8)),P=x(i-R[1]-p*.7,z+c(8),v-p-c(8));a.globalAlpha=k.on*.92,a.fillStyle="rgba(8,12,16,0.72)",a.strokeStyle=de,a.lineWidth=Math.max(1,f),a.fillRect(M,P,y,p),a.strokeRect(M+.5,P+.5,y,p),a.fillStyle=de,a.font=`600 ${10*f}px ui-monospace, "SF Mono", Menlo, Consolas, "PingFang SC", "Microsoft YaHei", monospace`,a.textBaseline="top",a.fillText("CONNECTOR v0.1",M+10*f,P+9*f),a.globalAlpha=k.on*.6,a.fillText(r(Et.unplug[0],Et.unplug[1])+" "+Math.round(x(k.prog,0,1)*100)+"%",M+10*f,P+25*f),a.globalAlpha=k.on*.92,a.strokeRect(M+10*f+.5,P+42*f+.5,y-20*f,9*f),a.fillStyle=k.prog>.999?xs:de,a.fillRect(M+12*f,P+44*f,(y-24*f)*x(k.prog,0,1),5*f);let T=8,B=4,N=(y-20*f)/T,C=(p-66*f)/B;for(let G=0;G<B;G++)for(let W=0;W<T;W++){let j=G*T+W,Q=k.keys[j]||0;a.globalAlpha=k.on*(.25+.75*Q),a.fillStyle=Q>.05?"#fff":de,Q>.05?a.fillRect(M+10*f+W*N+1.5*f,P+58*f+G*C+1.5*f,N-3*f,C-3*f):a.strokeRect(M+10*f+W*N+1.5*f+.5,P+58*f+G*C+1.5*f+.5,N-3*f,C-3*f),k.keys[j]=Q*.86}a.textBaseline="bottom",a.globalAlpha=1,a.lineWidth=c(1)}}if(a.setTransform(1,0,0,1,0,0),this.alarm>.5){let _=(this.alarm-.5)*2,E=Math.sin(h*22)>-.3;a.globalAlpha=_*(E?.9:.35),a.strokeStyle=qe,a.lineWidth=c(3);let R=c(18);a.strokeRect(R,R,s-2*R,i-2*R),a.fillStyle=qe,a.font=u(12,700);let f=r(Et.observer[0],Et.observer[1]),y=a.measureText(f).width+c(16);a.fillRect(s-R-y,R,y,c(22)),a.fillStyle="#06080a",a.textBaseline="middle",a.fillText(f,s-R-y+c(8),R+c(11.5)),a.textBaseline="bottom",a.globalAlpha=1,a.lineWidth=c(1)}}get mirror(){return{line:()=>{let t=this.doc.createTextNode("");return this.sayEl.replaceChildren(t),this.line.classList.add("on"),this.sayEl.classList.remove("in"),this.sayEl.offsetWidth,this.sayEl.classList.add("in"),t},done:()=>{}}}hush(){this.line.classList.remove("on")}note(t,e=!1){let s=Array.isArray(t)?this.say(t[0],t[1]):t||"";this.tag.textContent=s,this.tag.classList.toggle("on",!!s),this.tag.classList.toggle("alarm",!!e)}fade(t,e,s=600){this.calm()&&e>.5&&/^#fff/i.test(t)&&(s=Math.max(s,900));let i=this.veil,o=Math.max(0,s/Math.max(.25,this.speed()));return i.style.transition=o?`opacity ${o}ms ease`:"none",i.style.background=t,i.offsetWidth,i.style.opacity=String(e),new Promise(a=>setTimeout(a,o))}};window.WHITE_WORLD={Connector:pe};})();
