// White 3D. Built from src/world/ by tools/world.mjs: edit the source, not this file.
(()=>{var k=Math.PI/180,_=(s,t,e)=>s<t?t:s>e?e:s,g=(s,t,e)=>s+(t-s)*e,ot=(s,t,e)=>{let i=_((e-s)/(t-s||1e-9),0,1);return i*i*(3-2*i)},Ze=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2;var V=(s,t)=>[s[0]+t[0],s[1]+t[1],s[2]+t[2]],Z=(s,t)=>[s[0]-t[0],s[1]-t[1],s[2]-t[2]],N=(s,t)=>[s[0]*t,s[1]*t,s[2]*t],rt=(s,t,e)=>[s[0]+t[0]*e,s[1]+t[1]*e,s[2]+t[2]*e],ht=(s,t)=>s[0]*t[0]+s[1]*t[1]+s[2]*t[2],Rt=(s,t)=>[s[1]*t[2]-s[2]*t[1],s[2]*t[0]-s[0]*t[2],s[0]*t[1]-s[1]*t[0]],ct=s=>Math.hypot(s[0],s[1],s[2]);var G=(s,t=[0,1,0])=>{let e=ct(s);return e>1e-9?[s[0]/e,s[1]/e,s[2]/e]:t.slice()},oe=(s,t,e)=>[s[0]+(t[0]-s[0])*e,s[1]+(t[1]-s[1])*e,s[2]+(t[2]-s[2])*e];function Ft(s,t,e){let i=oe(s,t,e);if(ct(i)>1e-4)return G(i);let o=G(Rt(s,Math.abs(s[1])<.9?[0,1,0]:[1,0,0]));return G(oe(e<.5?s:t,o,e<.5?2*e:2-2*e))}var fe=()=>[0,0,0,1];function Ut(s,t){let e=Math.sin(t/2),i=G(s);return[i[0]*e,i[1]*e,i[2]*e,Math.cos(t/2)]}function Ot(s,t){return[s[3]*t[0]+s[0]*t[3]+s[1]*t[2]-s[2]*t[1],s[3]*t[1]-s[0]*t[2]+s[1]*t[3]+s[2]*t[0],s[3]*t[2]+s[0]*t[1]-s[1]*t[0]+s[2]*t[3],s[3]*t[3]-s[0]*t[0]-s[1]*t[1]-s[2]*t[2]]}function K(s,t){let[e,i,o,a]=s,n=a*t[0]+i*t[2]-o*t[1],h=a*t[1]+o*t[0]-e*t[2],r=a*t[2]+e*t[1]-i*t[0],l=-e*t[0]-i*t[1]-o*t[2];return[n*a+l*-e+h*-o-r*-i,h*a+l*-i+r*-e-n*-o,r*a+l*-o+n*-i-h*-e]}var Te=s=>[-s[0],-s[1],-s[2],s[3]];function Eo(s){let t=Math.hypot(s[0],s[1],s[2],s[3])||1;return[s[0]/t,s[1]/t,s[2]/t,s[3]/t]}function Qe(s,t,e){let i=s[0]*t[0]+s[1]*t[1]+s[2]*t[2]+s[3]*t[3],o=t;if(i<0&&(i=-i,o=[-t[0],-t[1],-t[2],-t[3]]),i>.9995)return Eo([g(s[0],o[0],e),g(s[1],o[1],e),g(s[2],o[2],e),g(s[3],o[3],e)]);let a=Math.acos(i),n=Math.sin(a),h=Math.sin((1-e)*a)/n,r=Math.sin(e*a)/n;return[s[0]*h+o[0]*r,s[1]*h+o[1]*r,s[2]*h+o[2]*r,s[3]*h+o[3]*r]}function Jt(s,t=0,e=0){return Ot(Ot(Ut([0,1,0],s),Ut([1,0,0],-t)),Ut([0,0,1],e))}function Lo(s,t=[0,1,0]){let e=G(s,[0,0,1]),i=Rt(t,e);ct(i)<1e-5&&(i=Rt([0,0,1],e)),ct(i)<1e-5&&(i=[1,0,0]),i=G(i,[1,0,0]);let o=Rt(e,i);return{x:i,y:o,z:e}}var $e=s=>({x:K(s,[1,0,0]),y:K(s,[0,1,0]),z:K(s,[0,0,1])});function de(s,t,e,i,o,a=0,n=[0,1,0]){let h=Lo(Z(t,s),n);if(a){let r=Math.cos(a),l=Math.sin(a);h={x:V(N(h.x,r),N(h.y,l)),y:V(N(h.y,r),N(h.x,-l)),z:h.z}}return{pos:s.slice(),b:h,fov:e,W:i,H:o,f:o/2/Math.tan(e/2)}}var wt=class{constructor(t,e=4,i=1){this.x=Array.isArray(t)?t.slice():t,this.v=Array.isArray(t)?t.map(()=>0):0,this.hz=e,this.damp=i}step(t,e){let i=2*Math.PI*this.hz,o=this.damp,a=Math.max(1,Math.ceil(e*this.hz*12)),n=e/a;if(Array.isArray(this.x))for(let h=0;h<a;h++)for(let r=0;r<this.x.length;r++){let l=-i*i*(this.x[r]-t[r])-2*o*i*this.v[r];this.v[r]+=l*n,this.x[r]+=this.v[r]*n}else for(let h=0;h<a;h++){let r=-i*i*(this.x-t)-2*o*i*this.v;this.v+=r*n,this.x+=this.v*n}return this.x}set(t){Array.isArray(this.x)?(this.x=t.slice(),this.v=t.map(()=>0)):(this.x=t,this.v=0)}};function se(s){let t=(s|0)*374761393+668265263;return t=(t^t>>>13)*1274126177,((t^t>>>16)>>>0)/4294967296}function It(s,t=0){let e=Math.floor(s),i=s-e,o=i*i*(3-2*i);return g(se(e+t*7919),se(e+1+t*7919),o)*2-1}var Fe={head:.26,neck:.765,spine:[.455,.515,.475],clav:.538,clavDrop:.2,chestW:.495,waistW:.475,arm:.85,fore:.82,palm:.3,palmW:.37,finger:.36,thumb:.35,pelvis:.24,pelvisDrop:.05,thigh:1.78,shin:1.72,foot:.4,stance:1.28,hang:8,r:{neck:.15,roof:.2,chest:.31,waist:.285,hips:.27,side:.22,shoulder:.138,elbow:.138,wrist:.138,hipJoint:.21,knee:.21,ankle:.21,toe:.145,knuckle:.058,tip:.042,thumb:.064}},Ke=[{x:1.5,k:.96,l:.92,fan:.17,r:1},{x:.5,k:1,l:1,fan:.045,r:1},{x:-.5,k:.96,l:.93,fan:-.085,r:.95},{x:-1.5,k:.87,l:.76,fan:-.23,r:.86}],Zt=[["L",1],["R",-1]];function to(s,t,e,i,o){let a=Z(t,s),n=ct(a),h=_(n,Math.abs(e-i)+1e-4,(e+i)*.9995),r=n>1e-6?N(a,1/n):[0,-1,0],l=(e*e-i*i+h*h)/(2*h),f=Math.sqrt(Math.max(0,e*e-l*l)),u=Z(o,N(r,ht(o,r)));return ct(u)<1e-4&&(u=Rt(r,[1,0,0]),ct(u)<1e-4&&(u=Rt(r,[0,0,1]))),u=G(u),{M:V(rt(s,r,l),N(u,f)),E:rt(s,r,h)}}var ue=class{constructor(t=Fe){this.setBody(t),this.J={},this.headQ=fe(),this.chestQ=fe(),this.hipQ=fe(),this.palm={L:[1,0,0],R:[-1,0,0]},this.pose({})}setBody(t){this.body=t;let e=t.head,i=a=>a*e,o=this.B={D:e,R:e/2};for(let a of["neck","clav","clavDrop","chestW","waistW","arm","fore","palm","palmW","finger","thumb","pelvis","pelvisDrop","thigh","shin","foot"])o[a]=i(t[a]);o.spine=t.spine.map(i),o.stance=t.stance??1.28,o.hang=(t.hang??8)*k,o.r={};for(let a in t.r)o.r[a]=i(t.r[a]);o.ankle=o.r.ankle,o.footLen=Math.hypot(o.foot,o.ankle-o.r.toe),o.clavLen=Math.hypot(o.clav,o.clavDrop),o.pelLen=Math.hypot(o.pelvis,o.pelvisDrop),o.leg=o.thigh+o.shin,o.hipH=o.ankle+o.leg*.992+o.pelvisDrop,o.height=o.hipH+o.spine[0]+o.spine[1]+o.spine[2]+o.neck+o.R}get height(){return this.B.height}pose(t={}){let e=this.B,i=this.J,o=t.pos||[0,0,0],a=t.yaw||0,n=t.hip||{},h=t.spine||{},r=Jt(a,0,0),l=this.hipQ=Ot(r,Jt(n.yaw||0,-(n.pitch||0),n.roll||0)),f=e.hipH*(n.h??1)+(n.dy||0);i.hip=V(o,V(K(r,[n.dx||0,0,n.dz||0]),[0,f,0]));let u=h.bend||0,v=h.side||0,z=h.twist||0,c=l,m=i.hip,x=["waist","chest","neck"];for(let p=0;p<3;p++)c=Ot(c,Jt(z/3,-u/3,-v/3)),m=V(m,K(c,[0,e.spine[p],0])),i[x[p]]=m;let b=this.chestQ=c,A={yaw:0,pitch:0,roll:0,...t.head||{}},B=Ot(b,Jt(A.yaw,A.pitch,A.roll));if(t.lookAt&&(t.look??1)>0){let p=V(i.neck,K(b,[0,e.neck,0])),R=K([-b[0],-b[1],-b[2],b[3]],Z(t.lookAt,p)),w=_(Math.atan2(R[0],R[2]),-80*k,80*k),C=_(Math.atan2(R[1],Math.hypot(R[0],R[2])),-50*k,55*k),X=_(t.look??1,0,1);B=Ot(b,Jt(A.yaw+w*X,A.pitch+C*X,A.roll))}let W=Qe(b,B,.35);i.head=V(i.neck,K(W,[0,e.neck,0])),this.headQ=B;let H=t.shrug||0;for(let[p,R]of Zt){let w=t["arm"+p]||{},C=V(i.neck,K(b,[R*e.clav,-e.clavDrop*(1-1.6*H)+(w.up||0),w.fwd||0])),X,Y,U=e.arm,O=e.fore,F=()=>{if(w.world||w.hand){let it=w.world||V(C,K(b,w.hand)),d=w.pole?w.poleWorld?w.pole:K(b,w.pole):K(b,[R*.5,-.6,-.8]),M=to(C,it,U,O,d);X=M.M,Y=M.E}else{let it=w.raise??e.hang,d=w.azim??82*k,M=w.bend??12*k,E=w.twist??0,P=[R*Math.sin(it)*Math.sin(d),-Math.cos(it),Math.sin(it)*Math.cos(d)],S=[0,0,1];S=Z(S,N(P,ht(S,P))),ct(S)<.001&&(S=[0,1,0]),S=K(Ut(P,-R*E),G(S));let L=G(V(N(P,Math.cos(M)),N(S,Math.sin(M))));X=V(C,K(b,N(P,U))),Y=V(X,K(b,N(L,O)))}};F();let j=K(b,[0,1,0]),at=Math.max(0,ht(G(Z(X,C)),j));at>.02&&(C=V(C,K(b,[-R*.06*e.D*at,.17*e.D*at,0])),F()),i["sh"+p]=C,i["el"+p]=X,i["wr"+p]=Y;let tt=G(Z(Y,X)),st=w.palm?w.palmWorld?w.palm:K(b,w.palm):K(b,[-R,0,.25]),$=Z(st,N(tt,ht(st,tt)));$=ct($)>.001?G($):G(Rt(tt,[0,1,0]),[1,0,0]);let J=w.wrist||0,et=G(V(N(tt,Math.cos(J)),N($,Math.sin(J)))),dt=w.hdir?_(w.hdirW??1,0,1):0;if(dt>0){let it=G(w.hdirWorld?w.hdir:K(b,w.hdir),tt),d=ht(it,tt),M=72*k;if(d<Math.cos(M)){let P=Z(it,N(tt,d)),S=ct(P);it=S>1e-4?G(V(N(tt,Math.cos(M)),N(P,Math.sin(M)/S))):tt}et=G(V(N(et,1-dt),N(it,dt)),tt);let E=V(N($,1-dt),N(G(st,$),dt));ct(Z(E,N(et,ht(E,et))))>.001&&($=E)}let vt=G(Z($,N(et,ht($,et))),$);this._hand(p,R,et,vt,w)}for(let[p,R]of Zt){let w=t["leg"+p]||{},C=i["hj"+p]=V(i.hip,K(l,[R*e.pelvis,-e.pelvisDrop,0])),X;if(w.foot)X=w.foot.slice();else{let $=w.off||[0,0,0];X=V(o,K(r,[R*e.pelvis*e.stance+$[0],$[1],$[2]]))}let Y=G(w.toe?w.toe:K(r,[R*.16,0,1])),U=w.lift||0,O,F;if(w.ankle)O=w.ankle,F=-(w.pitch||0);else{let $=rt(X,Y,e.foot*.62);O=U?V($,V(N(Y,-e.foot*.62*Math.cos(U)),[0,e.ankle+e.foot*.62*Math.sin(U),0])):V(X,[0,e.ankle,0]),F=U}let j=K(r,w.knee||[R*.12,0,1]),at=to(C,O,e.thigh,e.shin,j);i["kne"+p]=at.M,i["an"+p]=at.E;let tt=F?G(V(N(Y,Math.cos(F)),[0,-Math.sin(F),0])):Y,st=F?G(V(N(Y,-Math.sin(F)),[0,-Math.cos(F),0])):[0,-1,0];i["to"+p]=V(rt(at.E,tt,e.foot),N(st,e.ankle-e.r.toe))}return this._trunk()}_trunk(){let t=this.J,e=this.B,i=G(Z(t.shL,t.shR),[1,0,0]),o=G(V(i,G(Z(t.hjL,t.hjR),[1,0,0])),i),a=oe(t.chest,t.neck,.26);for(let[n,h]of Zt)t["ap"+n]=rt(a,i,h*(e.chestW-e.r.side)),t["ws"+n]=rt(t.waist,o,h*(e.waistW-e.r.side));return this}_hand(t,e,i,o,a={}){let n=this.B,h=this.J,r=h["wr"+t],l=N(Rt(o,i),e),f=_(a.curl??.22,0,1),u=_(a.spread??.55,0,1.6),v=(n.palmW-2*n.r.knuckle)/3;for(let b=0;b<4;b++){let A=Ke[b],B=_(a.fingers?a.fingers[b]:f+.06*b*(1-f)*Math.min(1,f*6),0,1),W=V(rt(r,i,n.palm*A.k),N(l,A.x*v)),H=A.fan*u*(1-.85*B),p=G(V(N(i,Math.cos(H)),N(l,Math.sin(H)))),R=B*1.45,w=R+B*1.6,C=n.finger*A.l,X=rt(W,V(N(p,Math.cos(R)),N(o,Math.sin(R))),C*.54);h["k"+b+t]=W,h["m"+b+t]=X,h["f"+b+t]=rt(X,V(N(p,Math.cos(w)),N(o,Math.sin(w))),C*.46)}let z=_(a.thumb??f,0,1),c=(b,A,B)=>G(V(V(N(l,b),N(i,A)),N(o,B))),m=V(rt(r,i,n.palm*.2),N(l,.5*n.palmW-1.2*n.r.thumb)),x=rt(m,Ft(c(.84,.52,.16),c(.3,.72,.62),z),n.thumb*.5);h["t0"+t]=m,h["t1"+t]=x,h["t2"+t]=rt(x,Ft(c(.45,.87,.2),c(-.55,.5,.67),z),n.thumb*.5),h["kn"+t]=oe(h["k1"+t],h["k2"+t],.5),h["ti"+t]=h["f1"+t],this.palm[t]=o}fromDirs(t,e,i){let o=this.B,a=this.J,n=(l,f)=>e[l]?G(e[l]):f,h=(l,f,u)=>a[l]&&a[f]?G(Z(a[f],a[l]),u):u;a.hip=t.slice();let r=(l,f,u,v,z)=>{a[f]=rt(a[l],n(u,h(l,f,z)),v)};r("hip","waist","spine1",o.spine[0],[0,1,0]),r("waist","chest","spine2",o.spine[1],[0,1,0]),r("chest","neck","spine3",o.spine[2],[0,1,0]),r("neck","head","neck",o.neck,[0,1,0]);for(let[l,f]of Zt){r("neck","sh"+l,"clav"+l,o.clavLen,[f,-.3,0]),r("sh"+l,"el"+l,"arm"+l,o.arm,[0,-1,0]),r("el"+l,"wr"+l,"fore"+l,o.fore,[0,-1,0]);let u=n("hand"+l,h("wr"+l,"kn"+l,[0,-1,0])),v=e["palm"+l]?G(e["palm"+l]):this.palm[l];v=G(Z(v,N(u,ht(v,u))),[1,0,0]),this._hand(l,f,u,v,{curl:typeof e["curl"+l]=="number"?e["curl"+l]:.25}),r("hip","hj"+l,"pel"+l,o.pelLen,[f,-.2,0]),r("hj"+l,"kne"+l,"thigh"+l,o.thigh,[0,-1,0]),r("kne"+l,"an"+l,"shin"+l,o.shin,[0,-1,0]),a["to"+l]=rt(a["an"+l],n("foot"+l,h("an"+l,"to"+l,[0,-.2,1])),o.footLen)}return i&&(this.headQ=i),this._trunk()}bones(){let t=this.J,e={};for(let[i,o,a]of So)e[i]=G(Z(t[a],t[o]));return e}pieces(){let t=this.J,e=this.B.r,i=[],o=(a,n,h,r,l,f=1,u=1,v=0)=>i.push([t[a],t[n],h,r,l,v,f,u]);o("hip","waist",e.hips,e.waist,0),o("waist","chest",e.waist,e.chest,0),o("chest","neck",e.chest,e.roof,0),o("hjL","hjR",e.hipJoint,e.hipJoint,0);for(let[a]of Zt)o("neck","sh"+a,e.roof,e.shoulder,0),o("ap"+a,"ws"+a,e.side,e.side,0),o("ws"+a,"hj"+a,e.side,e.hipJoint,0);o("neck","head",e.neck,e.neck,0,1,1,2);for(let[a,n]of Zt){let h=n>0?1:2;o("sh"+a,"el"+a,e.shoulder,e.elbow,h,-.3,1.5),o("el"+a,"wr"+a,e.elbow,e.wrist,h);for(let l=0;l<4;l++){let f=Ke[l].r;o("wr"+a,"k"+l+a,e.wrist*.9,e.knuckle*f,h,1,1,1),o("k"+l+a,"m"+l+a,e.knuckle*f,.5*(e.knuckle+e.tip)*f,h,1,1,1),o("m"+l+a,"f"+l+a,.5*(e.knuckle+e.tip)*f,e.tip*f,h,1,1,1)}o("t0"+a,"t1"+a,e.thumb*1.12,e.thumb*.92,h,1,1,1),o("t1"+a,"t2"+a,e.thumb*.92,e.tip*1.08,h,1,1,1);let r=n>0?3:4;o("hj"+a,"kne"+a,e.hipJoint,e.knee,r,-.35,1.35),o("kne"+a,"an"+a,e.knee,e.ankle,r),o("an"+a,"to"+a,e.ankle,e.toe,r)}return i}snapshot(){let t={};for(let e in this.J)t[e]=this.J[e].slice();return{J:t,headQ:this.headQ.slice(),chestQ:this.chestQ.slice(),palm:{L:this.palm.L.slice(),R:this.palm.R.slice()}}}};var So=[["spine1","hip","waist"],["spine2","waist","chest"],["spine3","chest","neck"],["neck","neck","head"],["clavL","neck","shL"],["armL","shL","elL"],["foreL","elL","wrL"],["handL","wrL","knL"],["fingL","knL","tiL"],["clavR","neck","shR"],["armR","shR","elR"],["foreR","elR","wrR"],["handR","wrR","knR"],["fingR","knR","tiR"],["pelL","hip","hjL"],["thighL","hjL","kneL"],["shinL","kneL","anL"],["footL","anL","toL"],["pelR","hip","hjR"],["thighR","hjR","kneR"],["shinR","kneR","anR"],["footR","anR","toR"]];var eo=`#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`,Po=`
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
}`,oo=`
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
${Po}
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
}`,so=`#version 300 es
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
${oo}
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
}`,io=`
#define MAXC 56
#define NG 5
${oo}
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
}`;var At=.07;function Ct(s,t,e){let i=Object.prototype.hasOwnProperty.call(s,t),o=s[t];return s[t]=e((...a)=>o.apply(s,a)),()=>{i?s[t]=o:delete s[t]}}function To(s,t,e,i,o){let a=Math.sqrt(Math.max(e*e-s*s-t*t,0)),n=-s*Math.sin(i)+a*Math.cos(i);return(t*Math.sin(o)+n*Math.cos(o))/e}var pe=class{constructor(t,e){this.E=t,this.rig=e,this.on=!1,this.look={edge:0,edgeDepth:.11,over:.2,overReach:.1,handOver:.34,faceReach:.07,headShadow:0,headReach:.5,faceShade:0,fillet:[.1,.2,.34,.06],filletOpen:[.03,.6,1.55,1.95],filletNear:[3,6],wobble:.016,wobbleLen:.5,wobbleSpeed:.43,sep:[.015,.07],frontBias:.02,margin:2.3,maxArea:17e5,quality:1,fxRef:.36,fxMax:2,faceHide:[75,88]},this.alpha=1,this.cam=null;let i=224;this.out={visible:!1,canvas:t.renderer.canvas,cw:64,ch:64,k:1,rect:{x:0,y:0,w:64,h:64},n:0,A:new Float32Array(i),B:new Float32Array(i),C:new Float32Array(i),root:new Float32Array(20),fil:[0,0,0,0],filA:[.03,.6,3,6],filB:[1.55,1.95],head:[0,0,1,1],headOn:!1,yaw:0,pitch:0,roll:0,burst:0},this._s={A:new Float32Array(i),B:new Float32Array(i),C:new Float32Array(i)},this._fades={l:1,r:1,mouth:1,tears:1},this._keys=new Map,this._size=[0,0],this._undo=[]}enter(){if(this.on)return;let t=this.E,e=t.settings,i=t.renderer,o=e.head,a=this._saved={head:{yawMax:o.yawMax,pitchMax:o.pitchMax,rollScale:o.rollScale,shiftX:o.shiftX,shiftY:o.shiftY},bodyRate:e.draw.bodyRate,hands:e.expr?e.expr.hands:void 0,maxFps:e.view.maxFps,bg:e.view.background,outer:e.draw.outerShadow?e.draw.outerShadow.strength:void 0,view:{...t.view},paused:!!t.paused,pins:new Map(t.pinned),vis:[t.glCanvas,t.ovCanvas].map(h=>h?h.style.visibility:"")};o.yawMax=180,o.pitchMax=90,o.rollScale=6,o.shiftX=0,o.shiftY=0,e.draw.bodyRate=.2,e.expr&&(e.expr.hands=!1),e.view.maxFps=0,e.view.background="#000000";for(let h of["ParamBodyAngleX","ParamBodyAngleY","ParamBodyAngleZ","ParamBreath"])t.pinned.set(h,0);let n=this._undo;n.push(Ct(i,"draw",h=>(r,l,f)=>this._draw(h,r,l,f))),n.push(Ct(i,"resize",()=>()=>this._resize())),n.push(Ct(t.expr,"update",h=>(...r)=>{let l=h(...r);return this._prepare(r[0],r[1]),l})),n.push(Ct(t,"twitch",h=>r=>h([r[0]*a.head.yawMax/180,r[1]*a.head.pitchMax/90,r[2]*a.head.rollScale/6,r[3],r[4]]))),n.push(Ct(t,"postGeom",h=>()=>this._geom(h()))),t.post&&n.push(Ct(t.post,"render",h=>(r,l,f,u,v)=>h(r,l,this._postSettings(f),u,v))),this._wantPaused=a.paused,n.push(Ct(t,"pause",()=>()=>{this._wantPaused=!0})),n.push(Ct(t,"resume",()=>()=>{this._wantPaused=!1})),t.paused=!0;for(let h of[t.glCanvas,t.ovCanvas])h&&(h.style.visibility="hidden");this.on=!0}exit(){if(!this.on)return;let t=this.E,e=t.settings,i=e.head,o=this._saved;for(this.on=!1;this._undo.length;)this._undo.pop()();Object.assign(i,o.head),e.draw.bodyRate=o.bodyRate,e.draw.outerShadow&&o.outer!==void 0&&(e.draw.outerShadow.strength=o.outer),e.expr&&(e.expr.hands=o.hands),e.view.maxFps=o.maxFps,e.view.background=o.bg,t.pinned.clear();for(let[a,n]of o.pins)t.pinned.set(a,n);Object.assign(t.view,o.view),[t.glCanvas,t.ovCanvas].forEach((a,n)=>{a&&(a.style.visibility=o.vis[n])}),t.live&&(t.live.dirty=!0),t.paused=!0,this._wantPaused||t.resume()}frame(t,e,i){if(!this.on)return this.out;let o=this.E;this.cam=e,this._pose=i;let a=o.settings.draw.outerShadow;a&&this._saved.outer!==void 0&&(a.strength=this._saved.outer*this.look.faceShade),o.paused=!1,o._due=null;try{o.frame(t)}finally{o.paused=!0}return this.out.burst=o.burst?_(o.burst.amount??1,0,1):0,this.out}_prepare(t,e){let i=this.E,o=this._saved.head,a=i.expr.out&&i.expr.out.params||{},n={yaw:(a.ParamAngleX||0)/30*o.yawMax*k,pitch:(a.ParamAngleY||0)/30*o.pitchMax*k,roll:(a.ParamAngleZ||0)*o.rollScale*k};try{this._pose&&this._pose(n,t,e)}catch(h){console.error(h)}this._project()}_project(){let t=this.E,e=t.settings,i=e.head,o=this.cam,a=this.out,n=this.look,h=this.rig,r=h.J;if(!o){a.visible=!1;return}let l=o.b,f=o.f,u=o.W,v=o.H,z=D=>{let lt=Z(D,o.pos);return[-ht(lt,l.x),ht(lt,l.y),ht(lt,l.z)]},c=this._s,m=0,x=1e9,b=1e9,A=-1e9,B=-1e9;for(let[D,lt,Vt,Wt,_o,Ro,Ao,zo]of h.pieces()){if(m>=56)break;let yt=z(D),Lt=z(lt),Xe=Vt,Ye=Wt,le=Ao??1,Re=zo??1;if(yt[2]<At&&Lt[2]<At)continue;if(yt[2]<At||Lt[2]<At){let ce=(At-yt[2])/(Lt[2]-yt[2]),je=[yt[0]+(Lt[0]-yt[0])*ce,yt[1]+(Lt[1]-yt[1])*ce,At],Ve=Vt+(Wt-Vt)*ce,Je=le+(Re-le)*ce;yt[2]<At?(yt=je,Xe=Ve,le=Je):(Lt=je,Ye=Ve,Re=Je)}let Ae=f/yt[2],ze=f/Lt[2],_t=4*m,Ee=u/2+yt[0]*Ae,Le=v/2+yt[1]*Ae,Se=u/2+Lt[0]*ze,Pe=v/2+Lt[1]*ze,te=Math.min(Xe*Ae,6e3),ee=Math.min(Ye*ze,6e3);c.A[_t]=Ee,c.A[_t+1]=Le,c.A[_t+2]=Se,c.A[_t+3]=Pe,c.B[_t]=te,c.B[_t+1]=ee,c.B[_t+2]=1/yt[2],c.B[_t+3]=1/Lt[2],c.C[_t]=_o,c.C[_t+1]=Ro||0,c.C[_t+2]=le,c.C[_t+3]=Re,x=Math.min(x,Ee-te,Se-ee),A=Math.max(A,Ee+te,Se+ee),b=Math.min(b,Le-te,Pe-ee),B=Math.max(B,Le+te,Pe+ee),m++}let W=z(r.head),H=h.B.R,p=W[2]>At+H,R=0,w=0,C=1;if(p){let D=f/W[2];R=u/2+W[0]*D,w=v/2+W[1]*D,C=H*D,x=Math.min(x,R-C),A=Math.max(A,R+C),b=Math.min(b,w-C),B=Math.max(B,w+C)}if(a.n=m,a.headOn=p,!m&&!p){a.visible=!1,this._hideHead();return}let X=n.margin*(p?C:.1*v);if(x=Math.max(x-X,0),b=Math.max(b-X,0),A=Math.min(A+X,u),B=Math.min(B+X,v),A-x<2||B-b<2){a.visible=!1,this._hideHead();return}a.visible=!0;let Y=Math.min(1,Math.sqrt(n.maxArea/((A-x)*(B-b))))*_(n.quality,.2,1),U=64,O=[(A-x)*Y,(B-b)*Y],F=this._size;for(let D=0;D<2;D++){let lt=Math.max(U,Math.ceil(O[D]/U)*U);lt<=F[D]&&lt>=F[D]-3*U||(F[D]=lt)}a.cw=F[0],a.ch=F[1],a.k=Y;let j=a.cw/Y,at=a.ch/Y,tt=Math.round((x+A)/2-j/2),st=Math.round((b+B)/2-at/2);a.rect.x=tt,a.rect.y=st,a.rect.w=j,a.rect.h=at;for(let D=0;D<4*m;D+=4)a.A[D]=(c.A[D]-tt)*Y,a.A[D+1]=(c.A[D+1]-st)*Y,a.A[D+2]=(c.A[D+2]-tt)*Y,a.A[D+3]=(c.A[D+3]-st)*Y,a.B[D]=c.B[D]*Y,a.B[D+1]=c.B[D+1]*Y,a.B[D+2]=c.B[D+2],a.B[D+3]=c.B[D+3],a.C[D]=c.C[D],a.C[D+1]=c.C[D+1],a.C[D+2]=c.C[D+2],a.C[D+3]=c.C[D+3];let $=(R-tt)*Y,J=(w-st)*Y,et=C*Y;a.head[0]=$,a.head[1]=J,a.head[2]=et,a.head[3]=W[2],a.root.fill(0);for(let D=0;D<4*m;D+=4){let lt=4*Math.round(a.C[D]);lt>0&&lt<20&&!a.root[lt+3]&&(a.root[lt]=a.A[D],a.root[lt+1]=a.A[D+1],a.root[lt+2]=a.B[D],a.root[lt+3]=1)}let dt=p?et:40*Y,vt=n.fillet,it=n.filletOpen,d=n.filletNear;for(let D=0;D<4;D++)a.fil[D]=(vt[D]||0)*dt;a.filA[0]=it[0],a.filA[1]=Math.max(it[1],it[0]+.001),a.filA[2]=d[0],a.filA[3]=Math.max(d[1],d[0]+.001),a.filB[0]=it[2],a.filB[1]=Math.max(it[3],it[2]+.001);let M=z(r.hip),E=f/Math.max(At,M[2]);if(this._org=[(u/2+M[0]*E-tt)*Y,(v/2+M[1]*E-st)*Y],!p){this._hideHead();return}let P=G(Z(r.head,o.pos)),S=N(l.x,-1),L=G(Z(S,N(P,ht(S,P))),S),q=N(P,-1),nt=Rt(q,L),xt=$e(h.headQ),zt=D=>[ht(D,L),ht(D,nt),ht(D,q)],Mt=zt(xt.x),ft=zt(xt.y),qt=zt(xt.z),mt=Math.atan2(-Mt[2],qt[2]),ut=Math.asin(_(-ft[2],-1,1)),Pt=Math.atan2(-ft[0],ft[1]),Tt=z([r.head[0]+xt.y[0]*.05,r.head[1]+xt.y[1]*.05,r.head[2]+xt.y[2]*.05]);if(Tt[2]>At){let D=f/Tt[2],lt=u/2+Tt[0]*D-R,Vt=v/2+Tt[1]*D-w;if(Math.hypot(lt,Vt)>.001){let Wt=Math.atan2(-lt,Vt)-Pt;Wt=Math.atan2(Math.sin(Wt),Math.cos(Wt)),Pt+=Wt*(1-ot(.8,.95,Math.abs(ft[2])))}}a.yaw=mt,a.pitch=ut,a.roll=Pt,t.pinned.set("ParamAngleX",mt/k/180*30),t.pinned.set("ParamAngleY",ut/k/90*30),t.pinned.set("ParamAngleZ",Pt/k/6);let Gt=(e.sizes&&e.sizes.head)??1,Et=Math.cos(Pt),Yt=Math.sin(Pt),ae=(i.cx-i.pivotX)*Gt,Ue=(i.cy-i.pivotY)*Gt,Oe=i.pivotX+ae*Et+Ue*Yt,Ie=i.pivotY-ae*Yt+Ue*Et,ke=et/(i.radius*Gt);t.view.scale=ke,t.view.ox=$-Oe*ke,t.view.oy=a.ch-J-Ie*ke;let Me=z(r.neck),He=f/Math.max(At,Me[2]),ne=u/2+Me[0]*He-R,re=-(v/2+Me[1]*He-w),_e=Math.hypot(ne,re);_e>.001?(ne/=_e,re/=_e):(ne=0,re=1),this._neck=[Oe+ne*i.radius*Gt,Ie+re*i.radius*Gt];let Bt=t.live&&t.live.face,bo=Math.cos(n.faceHide[1]*k),ko=Math.cos(n.faceHide[0]*k),Mo=i.radius*(1-_(e.depth&&e.depth.orbit||0,0,.9)),Nt=this._fades,jt=(D,lt)=>ot(bo,ko,To(D-i.cx,lt-i.cy,Mo,mt,ut));Bt&&Bt.rings?(Nt.l=jt(Bt.rings.l.cx,Bt.rings.l.cy),Nt.r=jt(Bt.rings.r.cx,Bt.rings.r.cy)):t.model&&t.model.face&&(Nt.l=jt(...t.model.face.l.orbitC),Nt.r=jt(...t.model.face.r.orbitC));let he=Bt&&Bt.mouth;Nt.mouth=he&&he.cx!=null?jt(he.cx,he.cy):jt(i.cx,i.cy+.45*i.radius),Nt.tears=Math.min(Nt.l,Nt.r)}_hideHead(){let t=this.E.view;t.scale=.02,t.ox=-1e5,t.oy=-1e5}_key(t){let e=this._keys.get(t);return e===void 0&&(e=t==="head"||t==="head-clip"||t==="body"||t==="armpits"?null:/-l(-|$)/.test(t)?"l":/-r(-|$)/.test(t)?"r":t.startsWith("tears")?"tears":"mouth",this._keys.set(t,e)),e}_draw(t,e,i,o={}){let a=this.E,n=a.post,h=this.out,r=n&&n.img?n.ms?n.ms.fbo:n.img.S.fbo:null,l=!!(o.post&&o.target&&r&&o.target.fbo===r),f=!!(o.post&&o.target&&n&&n.img&&n.img.P&&o.target.fbo===n.img.P.fbo),u=!o.target&&!o.filter&&!o.post,v=o.filter,z={...o,filter:x=>x.id!=="body"&&x.id!=="armpits"&&(!v||v(x))},c=this._fades,m=[];for(let x of e.meshes){let b=this._key(x.id);b&&c[b]<.999&&(m.push(x,x.alpha),x.alpha*=c[b])}try{let x=l?o.target:u?{fbo:null,w:a.renderer.canvas.width,h:a.renderer.canvas.height}:null;x&&h.visible&&h.n&&this._body(x,0),t(e,i,z),x&&h.visible&&h.n&&h.headOn&&this._front()?this._body(x,1):f&&h.visible&&h.n&&h.headOn&&this._front()&&this._body(o.target,2)}finally{for(let x=0;x<m.length;x+=2)m[x].alpha=m[x+1]}}_front(){let t=this.out,[e,i,o,a]=t.head;for(let n=0;n<4*t.n;n+=4){if(t.C[n]<.5)continue;let h=1/t.B[n+2],r=1/t.B[n+3];if(Math.min(h,r)>a)continue;let l=t.A[n],f=t.A[n+1],u=t.A[n+2],v=t.A[n+3],z=u-l,c=v-f,m=_(((e-l)*z+(i-f)*c)/Math.max(1e-6,z*z+c*c),0,1);if(Math.hypot(l+z*m-e,f+c*m-i)<o+Math.max(t.B[n],t.B[n+1])+2)return!0}return!1}_program(){if(this._prog)return this._prog;let t=this.E.renderer.gl,e=(h,r)=>{let l=t.createShader(h);if(t.shaderSource(l,r),t.compileShader(l),!t.getShaderParameter(l,t.COMPILE_STATUS))throw new Error("White 3D body: "+t.getShaderInfoLog(l));return l},i=t.createProgram();if(t.attachShader(i,e(t.VERTEX_SHADER,eo)),t.attachShader(i,e(t.FRAGMENT_SHADER,so)),t.bindAttribLocation(i,0,"aPos"),t.linkProgram(i),!t.getProgramParameter(i,t.LINK_STATUS))throw new Error("White 3D body: "+t.getProgramInfoLog(i));let o={};for(let h of["uA","uB","uC","uN","uCol","uShade","uHead","uHead2","uWob","uSep","uOrg","uPad","uHand","uFil","uFilA","uFilB","uRoot","uAlpha"])o[h]=t.getUniformLocation(i,h);let a=t.createVertexArray();t.bindVertexArray(a);let n=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.bindVertexArray(null),this._prog={p:i,u:o,vao:a,A:new Float32Array(224),B:new Float32Array(224),C:new Float32Array(224),R:new Float32Array(20)},this._prog}_body(t,e){let i=this.E,o=i.renderer.gl,a=this.out,n=this.look,h;try{h=this._program()}catch(w){this._failed||(this._failed=!0,console.error(w));return}let r=t.w/a.cw,l=a.n,f=a.head[2]*r,u=1e9,v=1e9,z=-1e9,c=-1e9;for(let w=0;w<20;w+=4)h.R[w]=a.root[w]*r,h.R[w+1]=a.root[w+1]*r,h.R[w+2]=a.root[w+2]*r,h.R[w+3]=a.root[w+3];for(let w=0;w<4*l;w+=4){let C=a.A[w]*r,X=a.A[w+1]*r,Y=a.A[w+2]*r,U=a.A[w+3]*r,O=a.B[w]*r,F=a.B[w+1]*r;h.A[w]=C,h.A[w+1]=X,h.A[w+2]=Y,h.A[w+3]=U,h.B[w]=O,h.B[w+1]=F,h.B[w+2]=a.B[w+2],h.B[w+3]=a.B[w+3],h.C[w]=a.C[w],h.C[w+1]=a.C[w+1],h.C[w+2]=a.C[w+2],h.C[w+3]=a.C[w+3],u=Math.min(u,C-O,Y-F),z=Math.max(z,C+O,Y+F),v=Math.min(v,X-O,U-F),c=Math.max(c,X+O,U+F)}let m=a.head[0]*r,x=a.head[1]*r,b=a.headOn?f:40*r,A=n.fillet,B=Math.max(A[0],A[1],A[2],A[3]||0),W=n.wobble*b,H=3+W+Math.max(n.overReach,n.headReach,B)*b;if(e&&(u=m-f,z=m+f,v=x-f,c=x+f),u=Math.max(0,Math.floor(u-H)),v=Math.max(0,Math.floor(v-H)),z=Math.min(t.w,Math.ceil(z+H)),c=Math.min(t.h,Math.ceil(c+H)),z<=u||c<=v)return;o.bindFramebuffer(o.FRAMEBUFFER,t.fbo),o.viewport(0,0,t.w,t.h),o.enable(o.SCISSOR_TEST),o.scissor(u,v,z-u,c-v),o.enable(o.BLEND),e===2?o.blendFunc(o.ZERO,o.ONE_MINUS_SRC_ALPHA):o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA),o.useProgram(h.p);let p=h.u;o.uniform4fv(p.uA,h.A),o.uniform4fv(p.uB,h.B),o.uniform4fv(p.uC,h.C),o.uniform1i(p.uN,l);let R=i.live&&i.live.headColor||[.91,.91,.91];o.uniform3f(p.uCol,R[0],R[1],R[2]),o.uniform4f(p.uShade,n.edge,Math.max(1,n.edgeDepth*b),n.over,Math.max(1,(e?n.faceReach:n.overReach)*b)),o.uniform4f(p.uHead,m,x,a.headOn?f:0,a.head[3]),o.uniform4f(p.uHead2,this.rig.B.R,e,n.headShadow,Math.max(1,n.headReach*b)),o.uniform4f(p.uWob,W,Math.max(4,n.wobbleLen*b),(i.live&&i.live.clock||0)*n.wobbleSpeed,3.7),o.uniform4f(p.uSep,n.sep[0],n.sep[1],n.frontBias,0),o.uniform2f(p.uOrg,this._org[0]*r,this._org[1]*r),o.uniform1f(p.uPad,2+W+Math.max(n.overReach,B)*b),o.uniform1f(p.uHand,n.handOver),o.uniform4f(p.uFil,a.fil[0]*r,a.fil[1]*r,a.fil[2]*r,a.fil[3]*r),o.uniform4f(p.uFilA,a.filA[0],a.filA[1],a.filA[2],a.filA[3]),o.uniform2f(p.uFilB,a.filB[0],a.filB[1]),o.uniform4fv(p.uRoot,h.R),o.uniform1f(p.uAlpha,_(this.alpha,0,1)),o.bindVertexArray(h.vao),o.drawArrays(o.TRIANGLES,0,3),o.bindVertexArray(null),o.disable(o.SCISSOR_TEST),e===2&&o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA),t.fbo&&o.bindFramebuffer(o.FRAMEBUFFER,null)}_resize(){let t=this.E.renderer,e=t.canvas,i=this.out;return(e.width!==i.cw||e.height!==i.ch)&&(e.width=i.cw,e.height=i.ch),t.dpr=1,[i.cw,i.ch]}_geom(t){return t&&t.neck&&this._neck&&this.out.headOn&&(t.neck.x=this._neck[0],t.neck.y=this._neck[1]),t}_postSettings(t){let e=this.look,i=this.E.view.scale,o=_(e.fxRef/Math.max(1e-4,i),1,e.fxMax);if(this.fx=o,o<1.02||!t||!t.post)return t;let a=t.post,n=(l,f)=>{let u={...l||{}};for(let v of f)typeof u[v]=="number"&&(u[v]*=o);return u},h={...a,pupil:n(a.pupil,["distance","blur"]),chrome:n(a.chrome,["distance","blur"]),diverge:n(a.diverge,["red","green","blue","wanderMin","wanderMax"]),artifact:n(a.artifact,["zoom"])},r=(l,f,u)=>{if(l&&typeof(l[f]??u)=="number"){let v=(2+198*Math.pow(_(l[f]??u,0,1),1.5))*o;l[f]=Math.pow(_((v-2)/198,0,1),2/3)}};return h.bloom={...a.bloom||{}},r(h.bloom,"size",.08),r(h.pupil,"size",.15),a.halftone&&(h.halftone={...a.halftone,size:((2+1.6*(a.halftone.size??10))*o-2)/1.6}),h.diverge&&(h.diverge.zoom=((1+4*(h.diverge.zoom??.5))*o-1)/4),{...t,post:h}}};var Fo=`#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;function ao(s,t,e,i){let o=s.createShader(t);if(s.shaderSource(o,e),s.compileShader(o),!s.getShaderParameter(o,s.COMPILE_STATUS)){let a=s.getShaderInfoLog(o)||"",n=e.split(`
`),r=[...a.matchAll(/ERROR: \d+:(\d+)/g)].map(l=>+l[1]).slice(0,4).map(l=>l+": "+(n[l-1]||"").trim()).join(`
`);throw new Error(i+": "+a+(r?`
`+r:""))}return o}function De(s,t,e="shader",i=Fo){let o=s.createProgram();if(s.attachShader(o,ao(s,s.VERTEX_SHADER,i,e)),s.attachShader(o,ao(s,s.FRAGMENT_SHADER,t,e)),s.bindAttribLocation(o,0,"aPos"),s.linkProgram(o),!s.getProgramParameter(o,s.LINK_STATUS))throw new Error(e+": "+s.getProgramInfoLog(o));let a={},n=s.getProgramParameter(o,s.ACTIVE_UNIFORMS);for(let h=0;h<n;h++){let r=s.getActiveUniform(o,h);a[r.name.replace(/\[0\]$/,"")]={loc:s.getUniformLocation(o,r.name),type:r.type,size:r.size}}return{p:o,u:a,name:e}}function no(s){let t=s.createVertexArray();s.bindVertexArray(t);let e=s.createBuffer();return s.bindBuffer(s.ARRAY_BUFFER,e),s.bufferData(s.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),s.STATIC_DRAW),s.enableVertexAttribArray(0),s.vertexAttribPointer(0,2,s.FLOAT,!1,0,0),s.bindVertexArray(null),t}function ro(s,t,e,i=!1,o=!0){let a=h=>{let r=s.createTexture();s.bindTexture(s.TEXTURE_2D,r),h?s.texImage2D(s.TEXTURE_2D,0,s.RGBA16F,t,e,0,s.RGBA,s.HALF_FLOAT,null):s.texImage2D(s.TEXTURE_2D,0,s.RGBA8,t,e,0,s.RGBA,s.UNSIGNED_BYTE,null);let l=o?s.LINEAR:s.NEAREST;s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,l),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,l),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE);let f=s.createFramebuffer();s.bindFramebuffer(s.FRAMEBUFFER,f),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,r,0);let u=s.checkFramebufferStatus(s.FRAMEBUFFER)===s.FRAMEBUFFER_COMPLETE;return s.bindFramebuffer(s.FRAMEBUFFER,null),u?{tex:r,fbo:f,w:t,h:e,half:h}:(s.deleteTexture(r),s.deleteFramebuffer(f),null)},n=i?a(!0):null;if(n||(n=a(!1)),!n)throw new Error("could not make an image of "+t+" x "+e);return n}function ho(s,t){t&&(s.deleteTexture(t.tex),s.deleteFramebuffer(t.fbo))}function Be(s,t,e,i,o,a=!1){s.bindFramebuffer(s.FRAMEBUFFER,i?i.fbo:null),s.viewport(0,0,i?i.w:s.drawingBufferWidth,i?i.h:s.drawingBufferHeight),a?(s.enable(s.BLEND),s.blendFunc(s.ONE,s.ONE_MINUS_SRC_ALPHA)):s.disable(s.BLEND),s.useProgram(t.p);let n=0;for(let h in t.u){let r=t.u[h],l=o[h];if(r.type===s.SAMPLER_2D){s.activeTexture(s.TEXTURE0+n),s.bindTexture(s.TEXTURE_2D,l||null),s.uniform1i(r.loc,n++);continue}if(l!==void 0)switch(r.type){case s.FLOAT:r.size>1?s.uniform1fv(r.loc,l):s.uniform1f(r.loc,l);break;case s.FLOAT_VEC2:s.uniform2fv(r.loc,l);break;case s.FLOAT_VEC3:s.uniform3fv(r.loc,l);break;case s.FLOAT_VEC4:s.uniform4fv(r.loc,l);break;case s.INT:s.uniform1i(r.loc,l);break;case s.FLOAT_MAT3:s.uniformMatrix3fv(r.loc,!1,l);break;default:break}}s.bindVertexArray(e),s.drawArrays(s.TRIANGLES,0,3),s.bindVertexArray(null)}var Do=`#version 300 es
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
`,Bo=`
void main() {
  vec3 rd = rayDir(gl_FragCoord.xy);
  vec4 c = world(uCamPos, rd);
  o = vec4(max(c.rgb, 0.0), c.a * dot(rd, uCamF));
}`,No=`#version 300 es
precision highp float;
${io}
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
}`,me=class{constructor(t){this.canvas=t;let e=this.gl=t.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!0,powerPreference:"high-performance"});if(!e)throw new Error("WebGL2 is not available on this computer.");this.halfOk=!!e.getExtension("EXT_color_buffer_float"),this.vao=no(e),this.final=De(e,No,"final"),this.figTex=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.figTex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array(4)),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.scale=1,this.scene=null,this.programs=new Map,this.world=null,this.look={exposure:1,contrast:1,saturation:1,vignette:.22,lift:[0,0,0],grain:.022,rim:.55,rimDepth:.45,rimCol:[1,.72,.42],shrink:1.5,air:0,airCol:[.5,.5,.5],glow:1,depth:!0,depthTol:[.03,0],direct:!1},this.sway=[0,0,0,1],this.tear=[0,0,0],this.info={}}setWorld(t){this.programs.has(t)||(t.init&&t.init(this.gl),this.programs.set(t,De(this.gl,Do+t.fs+Bo,"world "+t.name))),this.world=t,Object.assign(this.look,this.look0||(this.look0={...this.look}),t.look||{})}size(t,e){let i=this.canvas;t=Math.max(2,Math.round(t)),e=Math.max(2,Math.round(e)),(i.width!==t||i.height!==e)&&(i.width=t,i.height=e)}render(t,e,i,o){let a=this.gl,n=this.canvas.width,h=this.canvas.height,r=this.look,l=this.world;if(!l)return;let f=!!(i&&i.visible);f&&(a.bindTexture(a.TEXTURE_2D,this.figTex),a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,!1),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,a.NONE),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,i.canvas),a.generateMipmap(a.TEXTURE_2D));let u=_(this.scale,.2,1),v=Math.max(2,Math.round(n*u)),z=Math.max(2,Math.round(h*u));(!this.scene||this.scene.w!==v||this.scene.h!==z)&&(ho(a,this.scene),this.scene=ro(a,v,z,this.halfOk));let c=e.b,m=N(c.x,-1),x=f?[i.rect.x,i.rect.y,i.rect.w,i.rect.h]:[0,0,1,1],b=new Float32Array(9),A=[0,0,0],B=[0,0,1];if(o){b.set(o.head,0),b.set(o.chest,3),b.set(o.hip,6),A=o.root;let p=Z(e.pos,A);B=G([p[0],0,p[2]],[0,0,1])}let W={uCamPos:e.pos,uCamR:m,uCamU:c.y,uCamF:c.z,uView:[v,z,Math.tan(e.fov/2),t],uScreen:[n,h,e.f,0],uFig:this.figTex,uFigRect:x,uFigOn:f?1:0,uWhiteAt:b,uWhiteRoot:A,uWhiteN:B,uWhiteGlow:o?r.glow:0,...l.uniforms?l.uniforms(t,e):{}};Be(a,this.programs.get(l),this.vao,this.scene,W);let H=[0,1,0,1];if(l.sun&&f&&r.rim>0){let p=ht(l.sun,m),R=ht(l.sun,c.y),w=Math.hypot(p,R);w>.05&&(H=[p/w,R/w,r.rim*Math.min(1,w*1.5)*(l.sunLight??1),Math.max(2,r.rimDepth*i.head[2])])}Be(a,this.final,this.vao,null,{uScene:this.scene.tex,uFig:this.figTex,uFigRect:x,uFigSize:f?[i.cw,i.ch]:[1,1],uFigOn:f?1:0,uRes:[n,h],uGrade:[r.exposure,r.contrast,r.saturation,r.vignette],uLift:r.lift,uRim:H,uRimCol:r.rimCol,uFigLook:[r.shrink*(f?i.k:1),f?i.burst:0,_(r.air,0,1),r.depth&&this.scene.half&&(!l.depthOn||l.depthOn())?1:0],uAir:r.airCol,uDepth:r.depthTol||[.03,0],uNoise:[r.grain,t],uTear:this.tear,uDirect:r.direct?1:0,uSway:this.sway,uA:f?i.A:Ne,uB:f?i.B:Ne,uC:f?i.C:Ne,uN:f?i.n:0,uHead:f&&i.headOn?i.head:[0,0,0,1],uFil:f?i.fil:[0,0,0,0],uFilA:f?i.filA:[0,1,1,2],uFilB:f?i.filB:[1,2],uRoot:f?i.root:Co}),this.info.scene=[v,z]}},Ne=new Float32Array(224),Co=new Float32Array(20);var lo={name:"studio",sun:null,look:{exposure:1,contrast:1,saturation:1,vignette:.3,lift:[0,0,0],grain:.02,rim:0,air:0,glow:1,depth:!0},fs:`
uniform vec3 uBack;       // the studio's colour
vec4 world(vec3 ro, vec3 rd) {
  vec3 sky = uBack * mix(1.0, 0.35, smoothstep(-0.05, 0.7, rd.y));
  sky += uBack * 1.6 * exp(-abs(rd.y) * 10.0);
  if (rd.y < -1e-4) {
    float t = -ro.y / rd.y;
    vec3 P = ro + rd * t;
    vec2 f = abs(fract(P.xz + 0.5) - 0.5);
    float lw = 0.004 + 0.0014 * t;
    float line = (1.0 - smoothstep(lw, 2.0 * lw, min(f.x, f.y))) * exp(-t * 0.09);
    vec3 n = vec3(0.0, 1.0, 0.0);
    vec3 col = uBack * 0.8 + vec3(0.06) * line;
    col += vec3(0.05) * whiteLight(P, n);
    // his mirror image, softer the further from his feet
    float lod = clamp(1.5 + 2.5 * distance(P.xz, uWhiteRoot.xz), 0.0, 6.0);
    float fres = 0.04 + 0.5 * pow(1.0 - max(-rd.y, 0.0), 4.0);
    col += whiteMirror(P, rd, n, lod) * fres * 0.5;
    col = mix(col, sky, 1.0 - exp(-t * 0.035));
    return vec4(col, t);
  }
  return vec4(sky, 1e4);
}`,back:[.028,.03,.036],uniforms(){return{uBack:this.back}}};var qo=9.81;function Ce(s){let e=new Uint8Array(65536),i=new Uint8Array(256*256*4),o=625341585,a=()=>(o^=o<<13,o^=o>>>17,o^=o<<5,o>>>8&255);for(let h=0;h<256*256;h++)e[h]=a();for(let h=0;h<256;h++)for(let r=0;r<256;r++){let l=h*256+r;i[4*l+1]=e[l],i[4*l]=e[(h+17)%256*256+(r+37)%256],i[4*l+2]=a(),i[4*l+3]=a()}let n=s.createTexture();return s.bindTexture(s.TEXTURE_2D,n),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,256,256,0,s.RGBA,s.UNSIGNED_BYTE,i),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.REPEAT),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.REPEAT),n}var Go=`
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
}`,bt={name:"beach",fs:Go,sun:[Math.sin(125*k)*Math.cos(5.5*k),Math.sin(5.5*k),Math.cos(125*k)*Math.cos(5.5*k)],sunLight:1,look:{exposure:1.15,contrast:1.06,saturation:1.08,vignette:.32,lift:[.004,.006,.012],grain:.028,rim:.9,rimDepth:.5,rimCol:[1,.62,.34],air:0,airCol:[.5,.4,.4],glow:1,depth:!0},shore:{z0:-7,slope:.052,period:9.5,uprush:2.25},rough:1,big:[-99,1],clock:0,quality:1,feet:[0,0,0,0],prints:new Float32Array(64),mon:{on:0,light:0,look:[0,0],at:[-40,190,-420],size:85},beam:{at:[0,0],width:3,on:0},bug:[0,0,24,0],init(s){this.noise=Ce(s)},uniforms(s){let t=this.shore,e=this.mon,i=this.beam;return{uNoise:this.noise,uSun:this.sun,uShore:[t.z0,t.slope,t.period,this.clock==null?s:this.clock],uWave:[t.uprush,this.big[0],this.big[1],this.rough],uFeet:this.feet,uFoot:this.prints,uMon:[e.on,e.light,e.look[0],e.look[1]],uMonAt:[e.at[0],e.at[1],e.at[2],e.size],uBeam:[i.at[0],i.at[1],i.width,i.on],uBug:this.bug,uQuality:this.quality}},ground(s,t){let e=bt.shore;return Math.max(e.slope*(Math.min(t,34)-e.z0),0)},arrive(s,t){return(s+.2*Math.sin(t*.043+s*2.4)+.11*Math.sin(t*.117-s*1.7+1.3)+.05*Math.sin(t*.31+s*4.1))*this.shore.period},uprushAt(s,t){let e=Math.abs(s-this.big[0])<.5?this.big[1]:1;return this.shore.uprush*e*(.86+.2*Math.sin(s*12.9898+1)+.12*Math.sin(t*.06+s*3.3)+.06*Math.sin(t*.21-s*2.2))},edge(s,t){let e=qo*this.shore.slope,i=Math.floor(t/this.shore.period),o={s:0,k:null,flow:0,top:0};for(let a=-3;a<=1;a++){let n=i+a,h=t-this.arrive(n,s);if(h<=0)continue;let r=this.uprushAt(n,s);if(h>=2*r/e)continue;let l=r*h-.5*e*h*h;l>o.s&&(o.s=l,o.k=n,o.flow=r-e*h,o.top=r*r/(2*e))}return o},wet(s,t,e){return t-this.shore.z0<this.edge(s,e).s},next(s,t){for(let e=Math.floor(t/this.shore.period)-1;;e++){let i=this.arrive(e,s);if(i>t)return{k:e,at:i}}}};var co=1,Wo=24,Xt=12,we=64,qe=[.2126,.7152,.0722],ve=class{constructor(t,e={}){this.d=t,this.fps=t.fps,this.N=t.frames,this.O=t.origin,this.clips=new Map(t.clips.map(o=>[o.name,o])),this.doc=e.doc||document,this.src=e.src||[],this.grid=e.ground||null,this.speed=e.speed||(()=>1),this.tanX=Math.tan(t.hfov*k/2),this.tanY=this.tanX*t.aspect[1]/t.aspect[0];let i=t.sun||{yaw:80,pitch:5};this.sun=this.dir(i.pitch,i.yaw),this.v=[null,null],this.tex=[null,null],this.at=[0,0],this.dirty=[!0,!0],this.age=[0,0],this.front=0,this.mix=0,this.fade=null,this.frame=0,this.clip=null,this.phase="idle",this.rows=1,this.L=t.layout||null,this.picW=this.L?this.L.picture[0]:1920,this.picH=this.L?this.L.picture[1]:1080,this.texW=0,this.texH=0,this.pack=null,this.grey=null,this.steps=null,this.lutAt=null,this.ok=!1,this.stillImg=null,this._wait=null,this.reads=0,this.full=[!1,!1],this._going=!1,this.lim=[1e9,1e9],this.paused=!1,this.from=[0,0],this.lateAt=[0,0],this.tries=[0,0],this.stuck=!1}point(t,e,i){return[(this.O[1]-e)/100,(i-this.O[2])/100,(t-this.O[0])/100]}dir(t,e){let i=t*k,o=e*k;return[-Math.cos(i)*Math.sin(o),Math.sin(i),Math.cos(i)*Math.cos(o)]}spot(t,e){let i=t*k;return[-Math.sin(i)*e,Math.cos(i)*e]}ground(t,e){let i=this.grid;if(!i)return 0;let o=(this.O[0]+e*100-i.x0)/i.step,a=(this.O[1]-t*100-i.y0)/i.step,n=_(Math.floor(o),0,i.nx-2),h=_(Math.floor(a),0,i.ny-2),r=_(o-n,0,1),l=_(a-h,0,1),f=i.z,u=i.ny,v=f[n*u+h],z=f[(n+1)*u+h],c=f[n*u+h+1],m=f[(n+1)*u+h+1];return((v*(1-r)+z*r)*(1-l)+(c*(1-r)+m*r)*l-this.O[2])/100}floor(t,e,i=.45){return(this.ground(t,e)*2+this.ground(t+i,e)+this.ground(t-i,e)+this.ground(t,e+i)+this.ground(t,e-i))/6}normal(t,e,i=1.2){let o=(this.floor(t+i,e)-this.floor(t-i,e))/(2*i),a=(this.floor(t,e+i)-this.floor(t,e-i))/(2*i);return G([-o,1,-a])}camAt(t){let e=this.d.cam[_(Math.round(t),0,this.N-1)];return{pos:this.point(e[0],e[1],e[2]),dir:this.dir(e[3],e[4]),roll:e[5]*k}}camera(t,e){let i=this.camAt(this.frame),o=Math.max(t/2/this.tanX,e/2/this.tanY),a=i.pos,n=[a[0]+i.dir[0],a[1]+i.dir[1],a[2]+i.dir[2]];return de(a,n,2*Math.atan(e/2/o),t,e,i.roll)}load(){if(this._load)return this._load;let t=()=>{let i=this.doc.createElement("video");i.muted=!0,i.playsInline=!0,i.preload="auto",i.disableRemotePlayback=!0;for(let o of this.src){let a=this.doc.createElement("source");a.src=o.url,o.type&&(a.type=o.type),i.append(a)}return i};this.v=[t(),t()],this.v.forEach((i,o)=>{if(!("requestVideoFrameCallback"in i))return;this._rvfc=!0;let a=()=>{this.dirty[o]=!0,i.requestVideoFrameCallback(a)};i.requestVideoFrameCallback(a),i.addEventListener("seeked",()=>{this.dirty[o]=!0})});let e=i=>new Promise(o=>{if(i.readyState>=2)return o(!0);let a=f=>{i.removeEventListener("loadeddata",n),i.removeEventListener("error",h),clearTimeout(l),o(f)},n=()=>a(!0),h=()=>a(!1);i.addEventListener("loadeddata",n),i.addEventListener("error",h);let r=i.querySelector("source:last-of-type");r&&r.addEventListener("error",h);let l=setTimeout(()=>a(i.readyState>=2),2e4);i.load()});return this._load=Promise.all(this.v.map(e)).then(i=>(this.ok=i.every(Boolean)&&this.v[0].videoHeight>0,this.ok&&this._layout(this.v[0].videoWidth,this.v[0].videoHeight,!0),this.ok)),this._load}still(t,e){return new Promise(i=>{let o=new Image;o.onload=()=>{this.stillImg=o,this.frame=e,this._layout(o.naturalWidth,o.naturalHeight,!1),this._stillNew=!0,i(!0)},o.onerror=()=>i(!1),o.src=t})}_layout(t,e,i){let o=this.L,a=o&&o.pack;this.texW=t,this.texH=e,this.picW=t,this.picH=o&&e>o.picture[1]?o.picture[1]:i?e-Wo:e,this.rows=this.picH/e,this.pack=a&&t===o.picture[0]&&e>=a.rowB+a.tile[1]/2?a:null,this.px=new Uint8Array(Math.max(t,we*(Xt+4))*4)}_lut(t,e){let i=this.gl;if(!i||!this.grey)return;let o=new Float32Array(256),a=t?t.length:0;for(let n=0;n<256;n++){let h=n/255;if(a){let r=0;for(;r<a-2&&n>t[r+1];)r++;h=e[r]+(e[r+1]-e[r])*(n-t[r])/(t[r+1]-t[r])}o[n]=_(h,0,1)}i.bindTexture(i.TEXTURE_2D,this.grey),i.texImage2D(i.TEXTURE_2D,0,i.R16F,256,1,0,i.RED,i.FLOAT,o),this.lut=o}_steps(){let t=this.L&&this.L.steps,e=this.px;if(!t||(t.x+t.n*t.w)*4>e.length)return;let i=[];for(let a=0;a<t.n;a++){let n=0;for(let h=-2;h<=2;h++){let r=(t.x+a*t.w+(t.w>>1)+h*5)*4;n+=qe[0]*e[r]+qe[1]*e[r+1]+qe[2]*e[r+2]}i.push(n/5)}for(let a=1;a<t.n;a++)if(i[a]<i[a-1]+3)return;if(i[t.n-1]-i[0]<120)return;let o=this.steps||(this.steps=i.slice());for(let a=0;a<t.n;a++)o[a]+=(i[a]-o[a])*.15;(!this.lutAt||o.some((a,n)=>Math.abs(a-this.lutAt[n])>.3))&&(this.lutAt=o.slice(),this._lut(o,o.map((a,n)=>t.y?(t.y[n]-16)/219:n/(t.n-1))))}attach(t){if(this.gl!==t){this.gl=t;for(let e=0;e<2;e++){let i=this.tex[e]=t.createTexture();t.bindTexture(t.TEXTURE_2D,i),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}this.fbo=t.createFramebuffer(),this.px||(this.px=new Uint8Array(we*(Xt+4)*4)),this.grey=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.grey),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),this._lut(null)}}_seek(t,e){return new Promise(i=>{let o=(e+.5)/this.fps,a=()=>{t.removeEventListener("seeked",a),clearTimeout(n),i()},n=setTimeout(a,1500);t.addEventListener("seeked",a),t.currentTime=o})}_play(t){t.playbackRate=_(this.speed(),.25,4);let e=t.play();e&&e.catch&&e.catch(()=>{})}_clock(t){return _(Math.floor(this.v[t].currentTime*this.fps+.001),0,this.N-1)}async go(t,{fade:e=.35}={}){let i=this.clips.get(t);if(!i)throw new Error("no clip "+t);if(!this.ok){this.clip=i,this.phase=i.loop?"hold":"end",this.frame=i.loop?i.loop[0]:i.start+i.frames-1;return}let o=this._goId=(this._goId||0)+1;if(this._wait){let r=this._wait;this._wait=null,r.res()}for(;this.fade&&this._goId===o;)await new Promise(r=>setTimeout(r,30));if(this._goId!==o)return;let a=this.phase==="idle",n=a?this.front:1-this.front,h=this.v[n];if(this._going=!0,this.from[n]=i.start,this.tries[n]=0,this.lateAt[n]=0,h.pause(),await this._seek(h,i.start),this._goId===o)return this.clip=i,this.phase=i.move>0||!i.loop?"move":"hold",this._ready=!1,this._going=!1,this.full[n]=!1,this.lim[n]=i.loop?i.loop[1]-1:i.start+i.frames-1,this.paused||this._play(h),a?(this.front=n,this.mix=0):this.fade={t:0,T:Math.max(0,e)},new Promise(r=>{this._wait={clip:i,res:r}})}_swap(){this.v[this.front].pause(),this.front=1-this.front,this.mix=0,this.fade=null}stop(){for(let t of this.v)t&&t.pause();if(this.phase="idle",this.fade=null,this.mix=0,this._going=!1,this._ready=!1,this._goId=(this._goId||0)+1,this._wait){let t=this._wait;this._wait=null,t.res()}}giveUp(){this.stop(),this.ok=!1,this.front=0}_late(t){let e=performance.now();if(!this.lateAt[t]){this.lateAt[t]=e;return}if(e-this.lateAt[t]<4e3||this._again)return;if(this.tries[t]>=3){if(this.stuck=!0,this.fade=null,this.mix=0,this._wait){let o=this._wait;this._wait=null,o.res()}return}this.tries[t]++,this._again=!0;let i=this.v[t];i.pause(),this._seek(i,this.from[t]).then(()=>{this._again=!1,this.lateAt[t]=0,this.full[t]=!1,!this.paused&&this.phase!=="idle"&&this._play(i)})}pause(t){if(!(!this.ok||this.phase==="idle")){this.paused=!!t;for(let e=0;e<2;e++){let i=this.v[e],o=e===this.front||!!this.fade;t?i.pause():o&&this.phase!=="end"&&this._clock(e)<=this.lim[e]&&this._play(i)}}}_number(t){let e=this.gl,i=this.v[t],o=Math.min(this.px.length/4,i.videoWidth),a=i.videoHeight-8;e.bindFramebuffer(e.FRAMEBUFFER,this.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.tex[t],0);let n=-1;if(e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE){e.readPixels(0,a,o,1,e.RGBA,e.UNSIGNED_BYTE,this.px);let h=r=>this.px[(r*we+we/2)*4+1]>127?1:0;if(h(Xt)&&!h(Xt+1)&&h(Xt+2)&&!h(Xt+3)){n=0;for(let r=0;r<Xt;r++)n|=h(r)<<r;this._steps()}this.reads++}return e.bindFramebuffer(e.FRAMEBUFFER,null),n}_upload(t,e=0){let i=this.gl,o=this.v[t];if(!o||o.readyState<2||!o.videoWidth||o.seeking)return!1;if(this._clock(t)>this.lim[t])return o.paused||o.pause(),this.full[t];if(this.age[t]+=e,this._rvfc&&!this.dirty[t]&&this.age[t]<.12&&this.full[t])return!0;this.dirty[t]=!1,this.age[t]=0,this.full[t]=!0,i.bindTexture(i.TEXTURE_2D,this.tex[t]),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,o);let a=this._clock(t),n=this.clip;if(!(n&&n.loop&&a>=n.loop[0]+2&&a<n.loop[1]-1)){let r=this._number(t);r>=0&&r<this.N&&(a=r)}return this.at[t]=Math.min(a,this.lim[t]),this.lateAt[t]=0,!0}tick(t){let e=this.gl;if(!e)return;if(this.stillImg){this._stillNew&&(this._stillNew=!1,e.bindTexture(e.TEXTURE_2D,this.tex[0]),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.NONE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,this.stillImg));return}if(!this.ok||this.phase==="idle"||this.paused||this.stuck)return;let i=this.clip,o=_(this.speed(),.25,4);for(let f of this.v)f.playbackRate!==o&&(f.playbackRate=o);if(this._upload(this.front,t),this.full[this.front]||this._late(this.front),this.fade){let f=1-this.front,u=this.fade,v=this._upload(f,t)&&this.full[f];v?u.t+=t:this._late(f),this.mix=u.T>0?_(u.t/u.T,0,1):0,v&&u.t>=u.T&&this._swap()}let a=this.fade&&this.full[1-this.front]?1-this.front:this.front,n=this.at[a];if(this.frame=n,!i)return;let h=i.start+i.frames-1,r=this.full[a]&&n>=i.start&&n<=h,l=this._clock(a)>this.lim[a];if(this.phase==="move"&&r){let f=i.loop?i.loop[0]:h;(n>=f||l||this.v[a].ended)&&(this.phase=i.loop?"hold":"end",i.loop||this.v[a].pause())}if(this._wait&&this._wait.clip===i&&this.phase!=="move"&&r){let f=this._wait;this._wait=null,f.res()}if(this.phase==="hold"&&!this.fade&&!this._going&&r){let f=1-this.front,u=this.v[f],v=(i.loop[1]-1-Math.max(n,this._clock(this.front)))/this.fps;!this._ready&&!this._seeking&&(this._seeking=!0,u.pause(),this.full[f]=!1,this.lim[f]=i.loop[1]-1,this.from[f]=i.loop[0],this.tries[f]=0,this.lateAt[f]=0,this._seek(u,i.loop[0]).then(()=>{this._seeking=!1,this._ready=this.clip===i&&!this._going})),this._ready&&v<=co+.05&&(this._ready=!1,this._play(u),this.fade={t:0,T:_(v,.2,co)})}}};var fo=`
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
}`;function uo(s,t,e=430,i=85){let o=[s[0]+t[0]*e,s[1]+t[1]*e,s[2]+t[2]*e],a=o[0]-s[0],n=o[2]-s[2];return{at:o,size:i,turn:Math.atan2(a,n),tip:Math.atan2(o[1]-s[1],Math.hypot(a,n))*.8}}var ie=16,Uo=`
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
uniform vec4 uCapA[${ie}];  // his body as round-ended pieces: one end, and how thick (0: none)
uniform vec4 uCapB[${ie}];  // ...the other end
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
${fo}

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
  for (int i = 0; i < ${ie}; i++) {
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
}`,Oo=[Math.atan2(-Math.sin(95.5*k),Math.cos(95.5*k)),6.35*k,1.15*k,9.3*k];function Io(s){let t=s.d.sea;if(!t)return-1e3;let e=t.dz&&t.dz[_(Math.round(s.frame),0,t.dz.length-1)]||0;return(t.z+e-s.O[2])/100}function po(s){let t=new Float32Array(4*ie),e=new Float32Array(4*ie),i=new Float32Array(8),o=new Float32Array(8);return{name:"film",fs:Uo,film:s,sun:s.sun,sunLight:.55,look:{exposure:1,contrast:1,saturation:1,vignette:0,lift:[0,0,0],grain:.014,rim:.5,rimDepth:.4,rimCol:[1,.9,.76],air:0,airCol:[.5,.5,.5],glow:1,depth:!0,direct:!0,depthTol:[.03,1/(1.6*1371)]},tone:{gain:1,gamma:1,colour:1,tint:[1,1,1]},shade:{sun:.92,feet:.55,light:.4,reach:14},show:0,mon:{on:0,light:0,look:[0,0],wake:0,at:[-368,196,106],size:85,turn:-1.29,tip:.37,air:[.47,.44,.43,.22]},beam:{at:[0,0,0],width:3,on:0},bug:[0,0,24,0],root:[0,0,0],n:[0,1,0],ball:[0,1,0,1.5],init(a){this.noise=Ce(a),s.attach(a)},ground(a,n){return s.floor(a,n)},depthOn(){return!!s.pack},white(a,n,h){if(t.fill(0),!a||!a.head)return;let r=0,l=(c,m,x)=>{let b=a[c],A=a[m];!b||!A||(t.set(b,4*r),t[4*r+3]=x,e.set(A,4*r),r++)},f=.5*(n.chestW+n.r.chest);l("head","head",n.R),l("neck","chest",f),l("chest","waist",f),l("waist","hip",f);for(let c of["L","R"])l("sh"+c,"el"+c,n.r.elbow),l("el"+c,"wr"+c,n.r.wrist),l("wr"+c,"ti"+c,n.r.wrist*.8),l("hj"+c,"kne"+c,n.r.knee),l("kne"+c,"an"+c,n.r.ankle),l("an"+c,"to"+c,n.r.toe);let u=[1e9,1e9,1e9],v=[-1e9,-1e9,-1e9];for(let c=0;c<r;c++)for(let m of[t,e])for(let x=0;x<3;x++){let b=m[4*c+x],A=t[4*c+3];b-A<u[x]&&(u[x]=b-A),b+A>v[x]&&(v[x]=b+A)}this.ball=[(u[0]+v[0])/2,(u[1]+v[1])/2,(u[2]+v[2])/2,.5*Math.hypot(v[0]-u[0],v[1]-u[1],v[2]-u[2])],this.root=h,this.n=s.normal(h[0],h[2]);let z=this.n[0]*h[0]+this.n[1]*h[1]+this.n[2]*h[2];["L","R"].forEach((c,m)=>{let x=a["an"+c],b=a["to"+c];i.set(x,4*m),o.set(b,4*m);let A=(B,W)=>this.n[0]*B[0]+this.n[1]*B[1]+this.n[2]*B[2]-z-W;i[4*m+3]=Math.max(0,Math.min(A(x,n.r.ankle),A(b,n.r.toe)))})},uniforms(){let a=s,n=this.n,h=this.root,r=this.tone,l=this.shade,f=a.pack,u=this.mon,v=this.beam,z=a.fade&&a.full[1-a.front]?1:0;return{uNoise:this.noise,uFilmA:a.tex[a.front],uFilmB:a.tex[1-a.front],uGrey:a.grey,uFilm:[a.tanX,a.tanY,a.rows,_(a.mix,0,1)],uFilmPx:[.5/Math.max(a.picH||1080,1),a.picW||1920,a.picH||1080,0],uPack:f?[f.z0,f.periods,1,z]:[4,16,0,0],uPackPx:f?[f.tile[0],f.tile[1],f.rowCA,f.rowB]:[960,540,1080,1624],uTone:[r.gain,r.gamma,r.colour,this.show],uTint:r.tint,uSun:a.sun,uGround:[n[0],n[1],n[2],n[0]*h[0]+n[1]*h[1]+n[2]*h[2]],uCapA:t,uCapB:e,uFootA:i,uFootB:o,uShade:[l.sun,l.feet,l.light,l.reach],uBody:this.ball,uBug:this.bug,uSea:[Io(a),.1,0,0],uVolc:Oo,uMon:[u.on,u.light,u.look[0],u.look[1]],uMonAt:[u.at[0],u.at[1],u.at[2],u.size],uMonTilt:[u.turn,u.tip,u.wake,0],uMonAir:u.air,uBeam:[v.at[0],v.at[1],v.at[2],v.width],uBeamOn:[v.on,0,0,0]}}}}var y=s=>s*k,xe={stand:s=>({armL:{raise:s.hang,azim:y(82),bend:y(12)},armR:{raise:s.hang,azim:y(82),bend:y(12)}}),a:()=>({armL:{raise:y(42),azim:y(90),bend:y(2)},armR:{raise:y(42),azim:y(90),bend:y(2)},legL:{off:[.03,0,0]},legR:{off:[-.03,0,0]}}),t:()=>({armL:{raise:y(90),azim:y(90),bend:0,palm:[0,-1,0],curl:.05},armR:{raise:y(90),azim:y(90),bend:0,palm:[0,-1,0],curl:.05},legL:{off:[.05,0,0]},legR:{off:[-.05,0,0]}}),me:(s,t)=>({spine:{bend:y(-4)},head:{pitch:y(-6)},armL:{raise:y(52+3*Math.sin(t*1.3)),azim:y(62),bend:y(34),twist:y(-20),palm:[.2,.7,.7],curl:.1},armR:{raise:y(52+3*Math.sin(t*1.3+1)),azim:y(62),bend:y(34),twist:y(-20),palm:[-.2,.7,.7],curl:.1},legL:{off:[.04,0,0]},legR:{off:[-.04,0,0]}}),hands:(s,t)=>({spine:{bend:y(3)},shrug:.1,head:{pitch:y(-7),yaw:y(24*Math.sin(t*1.5))},armL:{hand:[.5*s.D,.2*s.D,.56*s.D],pole:[.35,-1,-.15],palm:[-.35,.1,-1],curl:.04+.4*(.5+.5*Math.sin(t*2.6)),spread:1.1},armR:{hand:[-.5*s.D,.2*s.D,.56*s.D],pole:[-.35,-1,-.15],palm:[.35,.1,-1],curl:.04+.4*(.5+.5*Math.sin(t*2.6+2)),spread:1.1}}),wave:(s,t)=>({spine:{side:y(-3)},head:{roll:y(-5)},armL:{raise:y(8),azim:y(78),bend:y(12)},armR:{raise:y(118),azim:y(72),bend:y(62+20*Math.sin(t*7.5)),twist:y(88),palm:[0,0,1],curl:.03,spread:1.1}}),think:(s,t)=>({spine:{bend:y(3),side:y(2)},head:{roll:y(7),pitch:y(4),yaw:y(-6)},armL:{hand:[-1.05*s.clav,-.78*s.arm,.5*s.fore],pole:[.7,-.5,-.5],palm:[0,.3,-1],curl:.5},armR:{hand:[.86*s.clav,s.clavDrop+.05*s.D+.004*Math.sin(t*1.1),.52*s.D],pole:[-.5,-.9,.2],palm:[.3,.2,-1],curl:.62,wrist:y(12)}}),point:()=>({spine:{twist:y(-10)},armL:{raise:y(10),azim:y(80),bend:y(16)},armR:{raise:y(84),azim:y(8),bend:y(4),palm:[.3,-1,0],curl:.6,fingers:[.02,.9,.95,1],thumb:.75}}),hips:s=>({armL:{hand:[-.04*s.D,-1.16*s.D,.02],pole:[1,-.1,-.6],palm:[-1,0,0],curl:.55},armR:{hand:[.04*s.D,-1.16*s.D,.02],pole:[-1,-.1,-.6],palm:[1,0,0],curl:.55},legL:{off:[.03,0,0]},legR:{off:[-.03,0,0]}}),reach:()=>({spine:{bend:y(12),twist:y(8)},hip:{dz:.03},armL:{raise:y(16),azim:y(120),bend:y(22)},armR:{raise:y(80),azim:y(4),bend:y(6),palm:[.9,.2,.3],curl:.05},legL:{off:[0,0,-.12],lift:y(18)},legR:{off:[0,0,.16]}}),startle:()=>({spine:{bend:y(-9)},hip:{h:.97,dz:-.02},shrug:.5,armL:{raise:y(70),azim:y(70),bend:y(78),twist:y(60),palm:[0,.2,1],curl:0},armR:{raise:y(70),azim:y(70),bend:y(78),twist:y(60),palm:[0,.2,1],curl:0},legL:{off:[.07,0,.02]},legR:{off:[-.07,0,-.06]}}),stride:()=>({hip:{h:.975,yaw:y(6)},spine:{bend:y(4),twist:y(-10)},armL:{raise:y(24),azim:y(8),bend:y(26)},armR:{raise:y(20),azim:y(172),bend:y(18)},legL:{off:[0,0,-.2],lift:y(34)},legR:{off:[0,0,.22]}}),cover:s=>({spine:{side:y(7),bend:y(-3),twist:y(-6)},hip:{roll:y(-3),dx:.01},head:{roll:y(-4),pitch:y(-4)},armL:{hand:[-.1*s.D,.8*s.D,.6*s.D],pole:[1,.6,.3],palm:[.1,-.1,-1],curl:.05,spread:.45},armR:{raise:y(34),azim:y(72),bend:y(74),twist:y(22),palm:[.6,.2,.6],curl:.55},legL:{off:[.1*s.D,0,.42*s.D]},legR:{off:[-.22*s.D,0,-.42*s.D],lift:y(12)}}),dance:s=>({spine:{side:y(-11),bend:y(-5),twist:y(8)},hip:{roll:y(7),dx:-.035,h:.99},head:{roll:y(8)},armL:{raise:y(148),azim:y(96),bend:y(14),twist:y(60),palm:[0,.2,1],curl:.02,spread:1.3},armR:{hand:[-.95*s.D,-.42*s.D,.3*s.D],pole:[-.3,-1,-.5],palm:[0,-1,.2],curl:.4,fingers:[.05,.25,.6,.75],thumb:.2},legL:{off:[1.5*s.D,1.25*s.D,-1.2*s.D],lift:y(58),toe:[.6,0,.3],knee:[.5,0,.9]},legR:{off:[-.02,0,.02]}}),crouch:s=>({hip:{h:.62,dz:-.06,pitch:y(18)},spine:{bend:y(38)},head:{pitch:y(22)},armL:{hand:[-.1*s.D,-.9*s.D,.9*s.D],pole:[1,-.4,-.3],curl:.4},armR:{hand:[.1*s.D,-.9*s.D,.9*s.D],pole:[-1,-.4,-.3],curl:.4},legL:{off:[.05,0,.05],knee:[.35,0,1]},legR:{off:[-.05,0,.05],knee:[-.35,0,1]}})};function mo(s,t,e=1){let i={...s},o={...i.hip||{}},a={...i.spine||{}};return o.dx=(o.dx||0)+.006*e*Math.sin(t*.61),o.roll=(o.roll||0)+.012*e*Math.sin(t*.61),a.side=(a.side||0)-.014*e*Math.sin(t*.61),a.bend=(a.bend||0)+.012*e*Math.sin(t*1.25),i.hip=o,i.spine=a,i.shrug=(i.shrug||0)+.035*e*(.5+.5*Math.sin(t*1.25)),i}var T=s=>s*k,wo=(s,t,e)=>Math.exp(-(((s-t)/e)**2)),ye={me:{in:.55,out:.7,hold:2.2,f:(s,t)=>{let e=3*Math.sin(t*1.3);return{spine:{bend:T(-5)},shrug:.12,hip:{dy:-.012*wo(t,.35,.16)},armL:{raise:T(54+e),azim:T(60),bend:T(36),twist:T(-22),palm:[.2,.75,.6],curl:.08},armR:{raise:T(54-e),azim:T(60),bend:T(36),twist:T(-22),palm:[-.2,.75,.6],curl:.08},head:{pitch:T(3),roll:T(4*Math.sin(t*.9))}}}},hands:{in:.7,out:.6,hold:3.2,f:(s,t)=>{let e=ot(1.4,2,t)-ot(2.9,3.5,t),i=h=>G([-h*g(.35,-.2,e),.1,g(-1,1,e)]),o=h=>.04+.5*Math.pow(.5+.5*Math.sin(t*2.6+h),2)*(1-.5*e),a=Math.sin(t*1.5-.4),n=(h,r)=>({hand:[h*.5*s.D,(.2+.04*Math.sin(t*1.1+r))*s.D,.56*s.D],pole:[h*.35,-1,-.15],palm:i(h),curl:o(r),spread:1.1,tight:.4});return{spine:{bend:T(3)},shrug:.1,head:{pitch:T(-7),yaw:T(24*a),roll:T(-5*a),replace:!0},armL:n(1,0),armR:n(-1,2)}}},wave:{in:.4,out:.55,hold:1.7,f:(s,t,e,i)=>{let o=i.side==="L"?"L":"R",a=o==="L"?1:-1;return{spine:{side:T(3)*a},head:{roll:T(5)*a},["arm"+o]:{raise:T(120),azim:T(70),bend:T(60+22*Math.sin(t*8)),twist:T(88),palm:[0,0,1],curl:.03,spread:1.1,tight:.5}}}},think:{in:.6,out:.6,hold:2.4,f:(s,t)=>({spine:{bend:T(3),side:T(2)},head:{roll:T(7),pitch:T(4),yaw:T(-6)},armL:{hand:[-1.08*s.clav,-.8*s.arm,.5*s.fore],pole:[.7,-.5,-.5],palm:[0,.3,-1],curl:.5,tight:.5},armR:{hand:[.84*s.clav,s.clavDrop+.07*s.D+.004*Math.sin(t*1.1),.5*s.D],pole:[-.5,-.9,.2],palm:[.3,.2,-1],curl:.62,wrist:T(12),tight:.7}})},point:{in:.35,out:.5,hold:1.6,f:(s,t,e,i)=>{let o=i.side==="L"?"L":"R",a=o==="L"?1:-1,n=e.rig.J["sh"+o],h=i.at||rt(n,[Math.sin(e.yaw),.1,Math.cos(e.yaw)],3),r=G(Z(h,n));return{spine:{twist:T(8)*a*-1},["arm"+o]:{world:rt(n,r,(s.arm+s.fore)*.985),pole:[0,-1,0],poleWorld:!0,palm:[0,-1,0],palmWorld:!0,curl:.6,fingers:[.02,.9,.95,1],thumb:.75,tight:.75}}}},present:{in:.6,out:.8,hold:2.4,f:(s,t,e,i)=>{let o=i.side==="R"?"R":"L",a=o==="L"?1:-1,n=ot(.2,2.2,t);return{spine:{twist:T(g(-8,14,n))*a,bend:T(-3)},head:{yaw:T(g(-10,26,n))*a},["arm"+o]:{raise:T(g(62,84,n)),azim:T(g(18,104,n)),bend:T(g(34,10,n)),twist:T(-30),palm:[0,1,.2],curl:.05,tight:.3}}}},startle:{in:.11,out:.9,hold:.7,f:(s,t)=>{let e=1-.35*ot(.15,.7,t);return{spine:{bend:T(-10)*e},hip:{h:1-.035*e,dz:-.025*e},shrug:.5*e,armL:{raise:T(66),azim:T(68),bend:T(80),twist:T(60),palm:[0,.2,1],curl:0,spread:1.4,tight:.8},armR:{raise:T(66),azim:T(68),bend:T(80),twist:T(60),palm:[0,.2,1],curl:0,spread:1.4,tight:.8}}}},shield:{in:.3,out:.6,hold:2,f:(s,t,e,i)=>{let o=i.side==="L"?"L":"R",a=o==="L"?1:-1;return{spine:{bend:T(-4)},shrug:.25,["arm"+o]:{hand:[-a*.62*s.clav,s.clavDrop+.95*s.D,.55*s.D],pole:[a*.9,.1,.2],palm:[0,.35,1],curl:.08,tight:.7}}}},reach:{in:.32,out:.5,hold:1.4,f:(s,t,e,i)=>{let o=i.side==="L"?"L":"R",a=o==="L"?1:-1,n=e.rig.J["sh"+o],h=i.at||e.eye,r=Z(h,n),l=ct(r),f=(s.arm+s.fore)*.99,u=i.grab!=null?ot(i.grab,i.grab+.18,t):0;return{spine:{bend:T(13),twist:T(-9)*a},hip:{dz:.03},["arm"+o]:{world:rt(n,r,Math.min(f,Math.max(.1,l-.12))/Math.max(1e-6,l)),pole:[0,-1,0],poleWorld:!0,palm:G(r),palmWorld:!0,curl:g(.03,.85,u),tight:1}}}},hold:{in:.25,out:.5,hold:1/0,f:(s,t,e,i)=>{let o=i.side==="R"?"R":"L",a=e.rig.J["sh"+o],n=i.at||e.eye,h=Z(n,a),r=ct(h),l=(s.arm+s.fore)*.97;return{["arm"+o]:{world:rt(a,h,Math.min(l,Math.max(.1,r-.1))/Math.max(1e-6,r)),pole:[0,-1,0],poleWorld:!0,palm:G(h),palmWorld:!0,curl:.85,tight:.9}}}},ui:{in:.25,out:.4,hold:1/0,f:(s,t,e,i,o)=>{let a=i.side==="L"?"L":"R",n=a==="L"?1:-1,h=i.rate??4.5,r=Math.floor(t*h),l=t*h-r;if(o.n!==r&&(o.n=r,o.from=o.to||[0,0],o.to=[(se(r*7+1)-.5)*.36,(se(r*13+5)-.5)*.24],r>0&&i.onTap))try{i.onTap(o.from,r)}catch(c){console.error(c)}let f=ot(0,.45,l),u=g(o.from[0],o.to[0],f),v=g(o.from[1],o.to[1],f),z=.05*wo(l,.78,.12);return{["arm"+a]:{hand:[-n*.42*s.clav+u,-.02*s.D+v,.86*s.fore+.1*s.arm+z],pole:[n*.75,-.65,0],palm:[0,-.35,1],curl:.4,fingers:[.04,.5,.62,.75],thumb:.5,wrist:T(-14),tight:1},head:{pitch:T(-7),yaw:T(-5)*n}}}},shrug:{in:.25,out:.45,hold:.5,f:()=>({shrug:.75,head:{roll:T(6)},armL:{raise:T(26),azim:T(58),bend:T(64),twist:T(-40),palm:[.2,.9,.4],curl:.1},armR:{raise:T(26),azim:T(58),bend:T(64),twist:T(-40),palm:[-.2,.9,.4],curl:.1}})},bounce:{in:.1,out:.3,hold:.9,f:(s,t)=>({hip:{dy:-.03*Math.abs(Math.sin(t*Math.PI*2.3))*_(1.2-t,0,1)},shrug:.1,armL:{raise:T(20),azim:T(84),bend:T(30)},armR:{raise:T(20),azim:T(84),bend:T(30)}})},winded:{in:.6,out:.9,hold:2.4,f:(s,t)=>{let e=Math.sin(t*5.2);return{hip:{h:.93,pitch:T(10)},spine:{bend:T(40+3*e)},shrug:.2+.12*e,head:{pitch:T(-12+5*e)},armL:{hand:[-.12*s.clav,-1.16*s.D,.62*s.D],pole:[1,-.2,-.4],palm:[0,-.3,-1],curl:.55,tight:.8},armR:{hand:[.12*s.clav,-1.16*s.D,.62*s.D],pole:[-1,-.2,-.4],palm:[0,-.3,-1],curl:.55,tight:.8}}}}};var gt=[["L",1],["R",-1]],$t={L:0,R:.5},yo=2*Math.PI,Kt=s=>s-Math.floor(s),kt=(s,t)=>Math.cos(yo*(s-t)),Ge=(s,t)=>Math.cos(2*yo*(s-t)),St=s=>Math.atan2(Math.sin(s),Math.cos(s)),Ho=(s,t,e)=>s+St(t-s)*e;function Xo(s,t,e){let i=e.raise??s.hang,o=e.azim??80*k,a=e.bend??10*k,n=e.twist??0,h=[t*Math.sin(i)*Math.sin(o),-Math.cos(i),Math.sin(i)*Math.cos(o)],r=[0,0,1];r=Z(r,N(h,ht(r,h))),ct(r)<.001&&(r=[0,1,0]),r=K(Ut(h,-t*n),G(r));let l=G(V(N(h,Math.cos(a)),N(r,Math.sin(a))));return{hand:V(N(h,s.arm),N(l,s.fore)),pole:h}}function We(s,t,e={}){let i=e.hand||e.world?{hand:e.hand?e.hand.slice():null,pole:e.pole?e.pole.slice():[t*.5,-.6,-.8]}:Xo(s,t,e);return{hand:i.hand,pole:G(i.pole),world:e.world?e.world.slice():null,poleWorld:!!e.poleWorld,palm:e.palm?G(e.palm):[-t,0,.25],palmWorld:!!e.palmWorld,curl:e.curl??.22,wrist:e.wrist||0,tight:e.tight??0,up:e.up||0,fwd:e.fwd||0,hdir:e.hdir?G(e.hdir):null,hdirW:e.hdir?e.hdirW??1:0,fingers:e.fingers?e.fingers.slice():null,thumb:e.thumb??null,spread:e.spread??.55}}function Yo(s,t,e){let i=_(ht(s,t),-1,1);if(i>.9995)return G(V(N(s,1-e),N(t,e)));if(i<-.9995)return Ft(s,t,e);let o=Math.acos(i),a=Math.sin(o);return V(N(s,Math.sin((1-e)*o)/a),N(t,Math.sin(e*o)/a))}function vo(s,t,e){if(e<=5e-4)return s;if(e>=.9995)return t;let i=ct(s.hand),o=ct(t.hand);return{hand:N(Yo(G(s.hand),G(t.hand),e),g(i,o,e)),pole:Ft(s.pole,t.pole,e),world:null,poleWorld:!1,palm:Ft(s.palm,t.palm,e),palmWorld:!1,curl:g(s.curl,t.curl,e),wrist:g(s.wrist,t.wrist,e),tight:g(s.tight,t.tight,e),up:g(s.up,t.up,e),fwd:g(s.fwd,t.fwd,e),hdir:s.hdir&&t.hdir?Ft(s.hdir,t.hdir,e):t.hdir||s.hdir,hdirW:g(s.hdirW,t.hdirW,e),fingers:s.fingers||t.fingers?[0,1,2,3].map(a=>g(s.fingers?s.fingers[a]:s.curl,t.fingers?t.fingers[a]:t.curl,e)):null,thumb:s.thumb!=null||t.thumb!=null?g(s.thumb??s.curl,t.thumb??t.curl,e):null,spread:g(s.spread,t.spread,e)}}function xo(s,t,e,i,o){for(let[a,n]of[[o,.012],[.07,.03],[0,.045]]){let h=Z(rt(s,t,a),e),r=ct(h);r<i+n&&(s=rt(s,r>1e-4?N(h,1/r):[0,0,1],i+n-r))}return s}function Dt(s,t,e,i,o=[]){let a=s[t],n=_(i*s.fps,0,s.n-1),h=Math.max(0,Math.min(Math.floor(n),s.n-2)),r=s.n>1?n-h:0,l=h*e;for(let f=0;f<e;f++)o[f]=a[l+f]+((s.n>1?a[l+e+f]:a[l+f])-a[l+f])*r;return o}var ge=class{constructor(t){this.sg=t,this.p=[0,0],this.yaw=0,this.planted=!0,this.s=0,this.dur=.4,this.span=0,this.from=[0,0],this.fromYaw=0,this.to=[0,0],this.toYaw=0,this.h=0,this.clear=.05,this.lift=0,this.lift0=0,this.pitch=0,this.pitch0=0,this.settle=!1,this.liftPh=-1,this.landPh=-1}},be=class{constructor(t){this.rig=t,this.pos=[0,0,0],this.yaw=0,this.vel=[0,0],this.speed=0,this.yawRate=0,this.ground=null,this.eye=[0,1.4,3],this.style={wobble:0,loose:.5,mech:0,energy:1,crouch:0,lean:0},this.feet={L:new ge(1),R:new ge(-1)},this.phase=0,this.ph=0,this.goal=null,this.facing=null,this.look={target:null,k:1},this.gestures=[],this.onStep=null,this.moves={},this.clip=null,this._stance=!1;let e=[0,0,0];this._sp={hipY:new wt(t.B.hipH,9,1),hipX:new wt(0,3.5,1),bend:new wt(0,3.2,.9),twist:new wt(0,3.5,.85),side:new wt(0,3,.9),roll:new wt(0,5,1),hyaw:new wt(0,5,1),head:new wt([0,0,0],3.4,.82),swing:{L:new wt(0,4.5,.9),R:new wt(0,4.5,.9)},hand:{L:new wt(e,5,.8),R:new wt(e,5,.8)},speed:new wt(0,2.2,1)},this._handInit=!1,this._seed=1+Math.floor(Math.random()*900),this._steps=0,this._held=null,this._heldAt=-1,this.place(0,0,0)}place(t,e,i=this.yaw){this.pos=[t,this._gy(t,e),e],this.yaw=i,this.vel=[0,0],this.speed=0,this.yawRate=0,this._sp.speed.set(0);for(let[o,a]of gt){let n=this.feet[o],h=this._home(a);n.p=h.p,n.yaw=h.yaw,n.planted=!0,n.h=0,n.lift=0,n.pitch=0,n.pitch0=0,n.s=0}if(this._finish(this.goal),this._finish(this.facing),this.goal=null,this.facing=null,this.clip){let o=this.clip;this.clip=null,this._finish(o)}return this._stance=!1,this._handInit=!1,this._sp.hipY.set(this.rig.B.hipH*.995),this}walkTo(t,e,i={}){return this.clip&&this.clip.legs&&this._endClip(),this._finish(this.goal),this._finish(this.facing),this.facing=null,this._stance=!1,new Promise(o=>{this.goal={x:t,z:e,speed:i.speed??.9,within:i.within??.06,face:i.face||null,burst:i.burst||1,res:o,stuck:0}})}face(t,e={}){return this._finish(this.facing),this._stance=!1,new Promise(i=>{this.facing={to:t,rate:(e.rate??150)*k,res:i}})}stopWalking(){this._finish(this.goal),this.goal=null}lookAt(t,e=1){return this.look.target=t,this.look.k=e,this}gesture(t,e={}){let i=ye[t];if(!i)return Promise.resolve();let o=this.gestures.find(a=>a.name===t&&!a.ending);return o&&(o.ending=!0),new Promise(a=>{this.gestures.push({name:t,def:i,opt:e,u:0,w:0,hold:e.hold??i.hold??1.5,k:e.k??1,ending:!1,res:a,state:{}})})}stop(t){for(let e of this.gestures)(!t||e.name===t)&&(e.ending=!0)}perform(t,e={}){let i=typeof t=="string"?this.moves[t]:t;if(!i||!i.n)return Promise.resolve(!1);this.clip&&this._endClip();let o=(e.legs??i.legs!==0)!==!1;return o&&(this.stopWalking(),this._finish(this.facing),this.facing=null),new Promise(a=>{let n=_(e.from??0,0,i.dur),h=_(e.to??i.dur,n,i.dur);this.clip={m:i,u:n,t0:n,t1:h,rate:e.rate??1,in:e.in??.25,out:e.out??.4,k:e.k??1,head:e.head??1,legs:o,arms:e.arms||"LR",w:0,w0:0,started:!1,wait:0,res:a,yaw0:0,cs:1,sn:0,bx:0,bz:0,off:{L:null,R:null},knee:{L:null,R:null},d0:[0,0],d0k:1}})}get performing(){return!!this.clip}get busy(){return!!(this.goal||this.facing)}_finish(t){if(t&&t.res){let e=t.res;t.res=null,e()}}_gy(t,e){return this.ground?this.ground(t,e):0}_home(t,e=this.yaw,i=this.pos){if(this._stance){let n=this.feet[t>0?"L":"R"];return{p:n.p.slice(),yaw:n.yaw}}let o=this.rig.B,a=t*o.pelvis*o.stance;return{p:[i[0]+Math.cos(e)*a,i[2]-Math.sin(e)*a],yaw:e+t*9*k}}update(t,e,i=null){e=_(e,0,.1);let o=this.rig,a=o.B,n=this.style;this._perf(e),this._steer(e),this._gait(t,e);let h=this._body(t,e);if(o.pose(h),this._arms(h,t,e),this._head(h,t,e,i),o.pose(h),n.mech>.01){let r=1/g(30,7,_(n.mech,0,1));this._held&&t-this._heldAt<r&&t>=this._heldAt?this._restore(this._held):(this._held=o.snapshot(),this._heldAt=t)}else this._held=null;return this}_restore(t){let e=this.rig;for(let i in t.J)e.J[i]=t.J[i].slice();e.headQ=t.headQ.slice(),e.chestQ=t.chestQ.slice(),e.palm={L:t.palm.L.slice(),R:t.palm.R.slice()}}_steer(t){if(this.clip&&this.clip.started&&this.clip.legs)return;let e=this.goal,i=this.style,o=0,a=null,n=170*k;if(e){let c=e.x-this.pos[0],m=e.z-this.pos[2],x=Math.hypot(c,m);if(x<=e.within||x<.25&&this.speed<.05&&(e.stuck+=t)>1.2)this.goal=null,e.face?this.facing={to:e.face,rate:150*k,res:e.res}:this._finish(e);else{let b=Math.atan2(c,m),A=Math.abs(St(b-this.yaw)),B=e.speed*(1-.3*i.wobble);o=B*(1-ot(35*k,110*k,A))*_(Math.sqrt(x/(.35+.35*B)),.12,1),a=b,n=g(150,330,ot(1.2,3,B))*k}}if(!this.goal&&this.facing){let c=this.facing,m=typeof c.to=="number"?c.to:Math.atan2(c.to[0]-this.pos[0],c.to[2]-this.pos[2]);a=m,n=c.rate,Math.abs(St(m-this.yaw))<2.5*k&&(this.facing=null,this._finish(c),a=null)}let h=0;if(a!=null){let c=St(a-this.yaw);h=_(c*5.5,-n,n)}this.yawRate+=(h-this.yawRate)*_(t*9,0,1),this.yaw=St(this.yaw+this.yawRate*t);let r=this._sp.speed,l=this.speed,f=e&&e.burst>1?e.burst:1;r.hz=(o>r.x?g(1.5,2.6,ot(1,3,o)):2.6)*(f>1?1.8:1);let u=Math.max(0,r.step(o,t)),v=g(1.7,4.4,ot(1,3,o))*f,z=4.6;u=_(u,l-z*t,l+v*t),u!==r.x&&(r.x=u,r.v=_(r.v,-z,v)),this.speed=u,o===0&&this.speed<.02&&(this.speed=0,r.set(0)),t>0&&(this._acc=(this._acc||0)+(_((this.speed-l)/t,-6,6)-(this._acc||0))*_(t*6,0,1)),this.vel=[Math.sin(this.yaw)*this.speed,Math.cos(this.yaw)*this.speed],this.pos[0]+=this.vel[0]*t,this.pos[2]+=this.vel[1]*t,this.pos[1]=this._gy(this.pos[0],this.pos[2])}_perf(t){let e=this.clip;if(!e)return;let i=e.m,o=this.feet;if(!e.started){if(e.wait+=t,e.legs&&e.wait<.7&&!(this.speed<.05&&o.L.planted&&o.R.planted))return;e.started=!0;let a=Dt(i,"p",3,e.t0);if(e.yaw0=this.yaw-a[2],e.cs=Math.cos(e.yaw0),e.sn=Math.sin(e.yaw0),e.legs){let n={L:Dt(i,"fL",10,e.t0),R:Dt(i,"fR",10,e.t0)},h=this._clipAt(e,(n.L[0]+n.R[0])/2,(n.L[1]+n.R[1])/2);e.bx=(o.L.p[0]+o.R.p[0])/2-h[0],e.bz=(o.L.p[1]+o.R.p[1])/2-h[1],e.d0=[this.pos[0]-(o.L.p[0]+o.R.p[0])/2,this.pos[2]-(o.L.p[1]+o.R.p[1])/2];for(let[r]of gt){let l=this._clipAt(e,n[r][0],n[r][1]);e.off[r]={d:[o[r].p[0]-l[0],o[r].p[1]-l[1]],yaw:St(o[r].yaw-(e.yaw0+n[r][2])),k:1,up:!1}}this._sp.speed.set(0)}}if(e.u=Math.min(e.t1,e.u+t*e.rate),e.w0=Math.min(ot(0,e.in,(e.u-e.t0)/e.rate),ot(0,e.out,(e.t1-e.u)/e.rate)),e.w=e.w0*e.k,e.legs){let a=Dt(i,"p",3,e.u),n=this._clipAt(e,a[0],a[1]);this.yaw=St(e.yaw0+a[2]),this.yawRate=0,this.speed=0,this.vel=[0,0],this._acc=0;for(let[f]of gt){let u=Dt(i,"f"+f,10,e.u),v=e.off[f],z=o[f],c=u[6]>.99;!c&&v.k>0&&(v.k=Math.max(0,v.k-t/.18));let m=this._clipAt(e,u[0],u[1]),x=v.k*v.k*(3-2*v.k);c&&!z.planted&&this.onStep&&this.onStep(f,.6),z.p=[m[0]+v.d[0]*x,m[1]+v.d[1]*x],z.yaw=e.yaw0+u[2]+v.yaw*x,z.h=u[3]*e.w0,z.lift=u[4]*e.w0,z.pitch=u[5]*e.w0,z.pitch0=0,z.planted=c,z.s=c?0:.5,z.settle=!1,e.knee[f]=[u[7],u[8],u[9]]}e.d0k=Math.max(0,e.d0k-t/.5);let h=(o.L.p[0]+o.R.p[0])/2,r=(o.L.p[1]+o.R.p[1])/2,l=e.d0k*e.d0k*(3-2*e.d0k);this.pos[0]=h+(n[0]-h)*e.w0+e.d0[0]*l*(1-e.w0),this.pos[2]=r+(n[1]-r)*e.w0+e.d0[1]*l*(1-e.w0),this.pos[1]=this._gy(this.pos[0],this.pos[2])}e.u>=e.t1&&this._endClip()}_clipAt(t,e,i){return[t.bx+e*t.cs+i*t.sn,t.bz-e*t.sn+i*t.cs]}_endClip(){let t=this.clip;if(t){if(this.clip=null,t.started&&t.legs){for(let[i]of gt){let o=this.feet[i];o.planted=!0,o.h=0,o.lift=0,o.pitch=0,o.s=0,o.settle=!1,o.landPh=this.ph-2}let e=0;for(let[i,o]of gt){let a=this.feet[i],n=this._home(o);e=Math.max(e,Math.hypot(a.p[0]-n.p[0],a.p[1]-n.p[1])+Math.abs(St(a.yaw-n.yaw))*.25)}this._stance=e<.17}this._finish(t)}}_pace(t){let e=this.rig.B,i=this.style,o=e.leg,a=t/o,n=ot(1.8,2.5,t),h=(.86+.42*Math.min(a,2.8))*(1-.3*i.wobble),r=.4+.62*a,l=g(h,r,n)*o,f=g(_(.66-.04*a,.57,.66)+.03*i.wobble,_(.75/r,.2,.38),n);return{run:n,vh:a,stride:l,SL:l/2,duty:f,T:l/Math.max(t,.3)}}_ankleOf(t){let e=this.rig.B,i=Math.sin(t.yaw),o=Math.cos(t.yaw),a=this._gy(t.p[0],t.p[1])+t.h;if(t.lift>1e-4){let n=Math.cos(t.lift),h=Math.sin(t.lift),r=e.ankle-e.r.toe,l=e.foot*(1-n)+r*h;return{at:[t.p[0]+i*l,a+e.r.toe+e.foot*h+r*n,t.p[1]+o*l],pitch:-t.lift}}return{at:[t.p[0],a+e.ankle,t.p[1]],pitch:t.pitch}}_gait(t,e){if(this.clip&&this.clip.started&&this.clip.legs){this._moving=!1,this.phase=Kt(this.ph),this._run=0;return}let i=this.rig.B,o=this.speed,a=this.style,n=this.feet,h=i.leg,r=this._pace(o),l=this._run=r.run,f=this._SL=r.SL,u=this._duty=r.duty,v=this._T=r.T,z=r.vh,c=o>.08,m=[Math.sin(this.yaw),Math.cos(this.yaw)],x=W=>(this.pos[0]-W.p[0])*m[0]+(this.pos[2]-W.p[1])*m[1],b=c?e/v*(1+.22*a.wobble*It(t*1.7,this._seed)):0,A=g(.075-.02*a.wobble,.25,l),B=g(.44*f*Math.min(1,o/.3),.17*h,l);if(c){if(!this._moving){let H=n.L.planted?n.R.planted?null:"R":"L";H?this.ph=Math.floor(this.ph)+2+_(1-(1-_(n[H].s,0,1))*n[H].dur/v,u,.98)-$t[H]:this.ph=Math.floor(this.ph)+2+u-$t[x(n.L)>=x(n.R)?"L":"R"];for(let[p]of gt)n[p].landPh=this.ph-2}let W=0;for(let[H]of gt){let p=n[H],R=Kt(this.ph+$t[H]);p.planted&&R<u&&(W=Math.max(W,x(p)+B-R*2*f))}this.ph+=b+_(W/(2*f),0,.2)*_(e*8,0,1);for(let[H]of gt){let p=n[H],R=Kt(this.ph+$t[H]);if(p.planted&&R>=u&&this.ph-p.landPh>.55*u){let w=Math.max(1-R,.6*(1-u));this._liftOff(p,w*v,A,!1,w)}}}if(this.phase=Kt(this.ph),this._moving=c,c)this._stance=!1;else if(this._stance&&n.L.planted&&n.R.planted){let W=_(e*3,0,1);this.pos[0]+=((n.L.p[0]+n.R.p[0])/2-this.pos[0])*W,this.pos[2]+=((n.L.p[1]+n.R.p[1])/2-this.pos[2])*W,this.pos[1]=this._gy(this.pos[0],this.pos[2])}for(let[W,H]of gt){let p=n[W],R=n[W==="L"?"R":"L"];if(p.planted){let U=this._home(H),O=Math.hypot(p.p[0]-U.p[0],p.p[1]-U.p[1]),F=Math.abs(St(p.yaw-U.yaw)),j=x(p);if(!c&&R.planted&&(O>.065||F>21*k)){let st=Math.hypot(R.p[0]-this._home(-H).p[0],R.p[1]-this._home(-H).p[1])+Math.abs(St(R.yaw-this._home(-H).yaw))*.2;if(O+F*.2>=st){this._liftOff(p,_(.26+O*.5,.26,.42),.028+.1*O,!0);continue}}else if(c&&j>g(.63,.85,l)*h&&(R.planted||l>.4||R.s>.5)){this._liftOff(p,(1-u)*v*.8,A,!1,(1-u)*.8);continue}let at=0;if(c){let st=_(Kt(this.ph+$t[W])/u,0,1);at=g(g(55,62,ot(1,1.9,z))*(1-.3*a.wobble)*Math.pow(_((st-.5)/.5,0,1),1.6),66*Math.pow(_((st-.38)/.62,0,1),1.5),l)*k*ot(0,.3*h,j)}p.lift=c?Math.max(at,p.lift-6*e):p.lift+(at-p.lift)*_(e*20,0,1);let tt=c?p.pitch0*(1-ot(0,g(.11,.05,l),this.ph-p.landPh)):0;p.pitch+=(tt-p.pitch)*_(e*30,0,1);continue}!c&&!p.settle&&(p.settle=!0,p.dur=_((1-p.s)*p.span*v,.1,.3)/Math.max(.05,1-p.s)),p.s+=p.settle?e/p.dur:b/Math.max(.05,p.span);let w=Math.max(0,1-p.s)*(p.settle?p.dur:p.span*v);if(p.settle&&!c){let U=this._home(H);p.to=U.p,p.toYaw=U.yaw}else{let U=this.yaw+this.yawRate*w*.6,O=Math.sin(U),F=Math.cos(U),j=a.wobble*.05*It(this._steps*1.37+H,this._seed+3),at=H*i.pelvis*g(i.stance,g(.85,.6,l),ot(.05,.5,o))+j+H*.03*a.wobble,tt=w*(this.speed+.5*_(this._acc||0,-5,5)*w);p.to=[this.pos[0]+O*(tt+B)+F*at,this.pos[2]+F*(tt+B)-O*at],p.toYaw=U+H*g(7,4,l)*k}let C=_(p.s,0,1),X=Math.pow(C,1.12),Y=p.settle?g(C,C*C*(3-2*C),.75):g(g(C,C*C*(3-2*C),.75),X*X*(3-2*X),l);if(p.p=[g(p.from[0],p.to[0],Y),g(p.from[1],p.to[1],Y)],p.yaw=Ho(p.fromYaw,p.toYaw,Y),p.settle)p.h=p.clear*Math.sin(Math.PI*C),p.lift=p.lift0*(1-ot(0,.55,C)),p.pitch=0;else{let U=g(.33,.37,l);p.h=p.clear*(C<U?Math.sin(.5*Math.PI*C/U):Math.cos(.5*Math.PI*(C-U)/(1-U))**2);let O=Math.max(p.lift0,g(60,80,l)*k*(1-.4*a.wobble)*ot(.1,.5,z)),F=g(.2,.32,l),j=g(.8,.9,l);p.lift=C<F?g(p.lift0,O,ot(0,F,C)):O*(1-ot(F,j,C));let at=g(g(14,26,ot(.5,1.5,z))*(1-.75*a.wobble)*ot(.12,.5,z),2,l)*k;p.pitch=at*ot(j-.02,1,C)}p.s>=1&&(p.planted=!0,p.p=p.to.slice(),p.yaw=p.toYaw,p.h=0,p.lift=0,p.pitch0=p.pitch,p.landPh=this.ph,this._steps++,this.onStep&&this.onStep(W,p.settle?.35:g(.6,1,l)))}}_liftOff(t,e,i,o,a=.38){t.planted=!1,t.s=0,t.dur=Math.max(.12,e),t.span=a,t.clear=i,t.settle=o,o||(t.liftPh=this.ph),t.from=t.p.slice(),t.fromYaw=t.yaw,t.lift0=t.lift,t.pitch=0,t.pitch0=0,t.to=t.p.slice(),t.toYaw=t.yaw}_body(t,e){let i=this.rig,o=i.B,a=this.style,n=this.feet,h=this._sp,r=this.speed,l=this._run||0,f=o.leg,u=r/f,v=[Math.sin(this.yaw),Math.cos(this.yaw)],z=[Math.cos(this.yaw),-Math.sin(this.yaw)],c=ot(.05,.5,r),m=a.energy,x=this.phase,b=this._duty||.62,A={},B={},W={};for(let[S]of gt){let L=n[S];A[S]=L.planted?1:1-Math.sin(Math.PI*_(L.s,0,1)),B[S]=(L.p[0]-this.pos[0])*v[0]+(L.p[1]-this.pos[2])*v[1],W[S]=this._ankleOf(L)}let H=Math.max(.2,A.L+A.R),p=(A.L*n.L.p[0]+A.R*n.R.p[0])/H-this.pos[0],R=(A.L*n.L.p[1]+A.R*n.R.p[1])/H-this.pos[2],w=(1-c)*m*.013*(Math.sin(t*.47+this._seed)+.5*Math.sin(t*.83+2*this._seed)),C=h.hipX.step((p*z[0]+R*z[1])*.5*(1-c)+w,e),X=f*g(g(.04,.018,ot(1,2,u)),.011,l)*(1+a.wobble),Y=C+c*X*kt(x,.4),U=1e3;for(let[S,L]of gt){let q=n[S];if(!(q.planted||q.s>.86||q.s<.1))continue;let nt=W[S].at,xt=this.pos[0]+z[0]*(L*o.pelvis+Y),zt=this.pos[2]+z[1]*(L*o.pelvis+Y),Mt=Math.hypot(nt[0]-xt,nt[2]-zt),ft=f*.996;U=Math.min(U,nt[1]-this.pos[1]+Math.sqrt(Math.max(ft*ft-Mt*Mt,.6*ft*ft))+o.pelvisDrop)}let O=o.hipH*(.995-.3*a.crouch-.012*a.wobble)-.04*f*l,F=-l*.05*f*Ge(x,b/2),j=Math.min(O,U*.995);h.hipY.hz=j<h.hipY.x?g(9,12,l):g(3.2,5,l);let at=Math.min(h.hipY.step(j,e)+F,U*.998),tt=c*g(3.5*kt(x,.1),3.5*kt(x,.6),l)*k,st=c*g(5.5*(1+a.wobble)*kt(x,.44),4.5*kt(x,.43),l)*k,$=ot(.9,1.9,u),J=c*g(g(4.5,6,$)*kt(x,.5),10*kt(x,.5),l)*k,et=Math.sin(t*1.25+this._seed),dt=(1.5+3*Math.min(r,1.4)/1.2)*k*c+l*4*k+(this._acc||0)*1.6*k+a.lean+5*k*a.wobble+.012*m*et,vt=0,it=-this.yawRate*r*.035-C/Math.max(.01,o.D)*.22,d=c*g(1.6*Ge(x,.48),2.4*Ge(x,.25),l)*k,M={pos:this.pos.slice(),yaw:this.yaw,hip:{h:1,dy:at-o.hipH,dx:Y,dz:.012*c,yaw:-tt,roll:st,pitch:l*3*k},spine:{bend:dt,twist:vt,side:it},shrug:.03*m*(.5+.5*et),head:{yaw:0,pitch:0,roll:0}};for(let[S,L]of gt){let q=n[S];M["leg"+S]={ankle:W[S].at,pitch:W[S].pitch,toe:[Math.sin(q.yaw),0,Math.cos(q.yaw)],knee:[L*.12,0,1]}}let E=this.clip&&this.clip.started&&this.clip.w>0?this.clip:null,P=E?E.w:0;if(E){let S=Dt(E.m,"h",6,E.u),L=Dt(E.m,"s",3,E.u),q=M.hip;if(E.legs){q.dx=g(q.dx,S[0],P),q.dz=g(q.dz,S[2],P),q.dy=g(q.dy,Math.min(o.hipH+S[1],U*.998)-o.hipH,P);for(let[nt]of gt)E.knee[nt]&&(M["leg"+nt].knee=Ft(M["leg"+nt].knee,E.knee[nt],P));q.yaw=g(q.yaw,S[3],P),q.pitch=g(q.pitch,S[4],P),q.roll=g(q.roll,S[5],P),dt=g(dt,L[0],P),it=g(it,L[1],P),vt=g(vt,L[2],P)}else{let nt=P*(1-c);q.dy=Math.min(q.dy+_(S[1],-.3,.02)*nt,U*.998-o.hipH),q.yaw=g(q.yaw,S[3],nt),q.pitch=g(q.pitch,S[4],nt),q.roll=g(q.roll,S[5],nt),dt=g(g(dt,L[0],P),dt+L[0]*P,c),it=g(g(it,L[1],P),it+L[1]*P,c),vt=g(g(vt,L[2],P),vt+L[2]*P,c)}}h.bend.hz=g(3.2,14,P),h.twist.hz=g(3.5,14,P),h.side.hz=g(3,14,P),this._gest=this._gestures(t,e);for(let S of this._gest){let L=S.pose,q=S.w;L.spine&&(dt+=(L.spine.bend||0)*q,vt+=(L.spine.twist||0)*q,it+=(L.spine.side||0)*q),L.hip&&(M.hip.dy+=(L.hip.dy||0)*q-(1-(L.hip.h??1))*o.hipH*q,M.hip.dz+=(L.hip.dz||0)*q,M.hip.pitch+=(L.hip.pitch||0)*q,M.hip.yaw+=(L.hip.yaw||0)*q),L.shrug&&(M.shrug+=L.shrug*q)}return M.spine.bend=h.bend.step(dt,e)+d,M.spine.twist=h.twist.step(vt,e)+tt-J,M.spine.side=h.side.step(it,e)+1.25*st,this._fore=B,this._walk=c,M}_gestures(t,e){let i=[],o=this.rig.B;for(let a=this.gestures.length-1;a>=0;a--){let n=this.gestures[a],h=n.def;if(n.u+=e,!n.ending&&n.u>(h.in??.4)+n.hold&&(n.ending=!0),n.w=_(n.w+e/Math.max(.05,n.ending?h.out??.5:h.in??.4)*(n.ending?-1:1),0,1),n.ending&&n.w<=0){this.gestures.splice(a,1),this._finish(n);continue}}for(let a of this.gestures){let n;try{n=a.def.f(o,a.u,this,a.opt,a.state)||{}}catch(h){console.error(h),n={}}i.push({g:a,pose:n,w:Ze(a.w)*a.k})}return i}_arms(t,e,i){let o=this.rig,a=o.B,n=this.style,h=this._sp,r=this._run||0,l=this._walk||0,f=o.chestQ,u=Te(f),v=n.energy,z=this.speed/a.leg,c=(4+4.5*Math.min(z,1.4)+14*ot(1.4,2,z))*(1-.5*n.wobble),m=.3*c+.8*Math.max(0,c-8);for(let[x,b]of gt){let A=Kt(this.ph+$t[x]),B=l*g(-2+c*kt(A,.5),-12+22*kt(A,.42),r)*k,W=a.hang+l*g(2*kt(A,.45),3+5*kt(A,.55),r)*k+16*n.wobble*k+n.wobble*6*k*It(e*1.3+b*5,this._seed+9),H=(1-l)*v,p=B+H*1.2*k*Math.sin(e*.7+b*1.3+this._seed),R=We(a,b,{raise:Math.hypot(p,W),azim:Math.atan2(W,p+1e-6),bend:g(13,g(27+m*kt(A,.58),98+11*kt(A,.38),r),l)*k+10*n.wobble*k+H*1.5*k*Math.sin(e*.9+b),curl:.22+.3*r}),w=this.clip&&this.clip.started&&this.clip.w>0&&this.clip.arms.includes(x)?this.clip:null,C=null;if(w){let $=w.m.an||(w.m.an=Math.round(w.m.aL.length/w.m.n)),J=Dt(w.m,"a"+x,$,w.u);C=K(f,[J[3],J[4],J[5]]);let et=this._clear([a.arm*J[0]+a.fore*J[3],a.arm*J[1]+a.fore*J[4],a.arm*J[2]+a.fore*J[5]],b,[J[3],J[4],J[5]],u);R=vo(R,We(a,b,{hand:et,pole:[J[0],J[1],J[2]],palm:[J[8],J[9],J[10]],curl:.26,tight:.75,up:J[6],fwd:J[7],hdir:$>=14?[J[11],J[12],J[13]]:null}),w.w)}for(let $ of this._gest){let J=$.pose["arm"+x];if(!J||$.w<=0)continue;let et=We(a,b,J);et.world&&(et.hand=K(u,Z(et.world,o.J["sh"+x])),et.world=null,et.poleWorld&&(et.pole=K(u,et.pole),et.poleWorld=!1)),et.palmWorld&&(et.palm=K(u,et.palm),et.palmWorld=!1),R=vo(R,et,$.w)}let X=(a.arm+a.fore)*.998,Y=ct(R.hand);Y>X&&(R.hand=N(R.hand,X/Y));let U=Z(V(o.J["sh"+x],K(f,R.hand)),this.pos),O=h.hand[x];this._handInit||O.set(U);let F=_(n.loose,0,1)*(1-.8*_(R.tight,0,1));O.hz=g(14,4.2,F),O.damp=g(1,.72,F);let j=O.step(U,i),at=Z(j,U),tt=ct(at),st=.22;if(tt>st&&(j=rt(U,at,st/tt),O.x=j.slice()),j=V(j,this.pos),w&&o.J.head){let $=xo(j,C,o.J.head,a.R,a.palm+.75*a.finger);$!==j&&(j=rt(j,Z($,j),w.w0),O.x=Z(j,this.pos))}t["arm"+x]={world:j.slice(),pole:K(f,R.pole),poleWorld:!0,palm:R.palm,curl:R.curl,wrist:R.wrist,fingers:R.fingers,thumb:R.thumb??void 0,spread:R.spread,up:R.up,fwd:R.fwd,hdir:R.hdir,hdirW:R.hdirW}}this._handInit=!0}_clear(t,e,i,o){let a=this.rig,n=a.B,h=a.J;h.head&&h["sh"+(e>0?"L":"R")]&&(t=xo(t,i,K(o,Z(h.head,h["sh"+(e>0?"L":"R")])),n.R,n.palm+.75*n.finger));let r=n.chestW+.035,l=n.r.chest+.04,f=t[0]+e*n.clav,u=t[2];if(t[1]<.03&&t[1]>-(n.spine[0]+n.spine[1]+n.spine[2]+.06)){let v=Math.hypot(f/r,u/l);if(v<1){let z=v>.001?1/v:0,c=v>.001?f*z:0,m=v>.001?u*z:l;t=[c-e*n.clav,t[1],m]}}return t}_head(t,e,i,o){let a=this.rig,n=this.style,h=Te(a.chestQ),r=n.energy,l=0,f=0,u=0,v=this.look,z=v.target==="eye"?this.eye:v.target;if(z){let A=a.J.head||a.J.neck,B=K(h,Z(z,A));l=_(Math.atan2(B[0],B[2]),-78*k,78*k)*v.k,f=_(Math.atan2(B[1],Math.hypot(B[0],B[2])),-48*k,52*k)*v.k}else l=_(this.yawRate*.16,-.5,.5)+r*3*k*It(e*.23,this._seed+21),f=r*2*k*It(e*.19,this._seed+22)-n.wobble*16*k*(.6+.4*It(e*.5,this._seed+23));l-=t.spine.twist*.9,f+=t.spine.bend*.55,u+=t.spine.side*.5;let c=this.clip&&this.clip.started&&this.clip.w>0?this.clip:null,m=c?c.w*c.head:0;if(c){let A=Dt(c.m,"hd",3,c.u);l=g(l,A[0],m),f=g(f,A[1],m),u=g(u,A[2],m)}this._sp.head.hz=g(3.4,11,m),this._sp.head.damp=g(.82,1,m);for(let A of this._gest){let B=A.pose.head;if(!B)continue;let W=A.w;B.replace?(l=g(l,B.yaw||0,W),f=g(f,B.pitch||0,W),u=g(u,B.roll||0,W)):(l+=(B.yaw||0)*W,f+=(B.pitch||0)*W,u+=(B.roll||0)*W)}let x=this._sp.head.step([l,f,u],i),b=o||{yaw:0,pitch:0,roll:0};t.head={yaw:x[0]+b.yaw,pitch:x[1]+b.pitch,roll:x[2]+b.roll},t.spine.twist+=_(x[0],-1.2,1.2)*.22*(1-(this._walk||0)*.6)*(1-m)}joint(t){return this.rig.J[t]}};var I=new URLSearchParams(location.search),Q=(s,t)=>I.has(s)&&isFinite(+I.get(s))?+I.get(s):t,jo=["idle","bliss","thinking","bored","sleepy","happy","moved","laugh","cute","shy","smug","surprised","shocked","afraid","angry","frown","notHappy","determined","disgusted","suspicious","confused","sad","sorrow","crying","depressed"],go={front:[0,6],"three-quarter":[38,8],side:[90,4],back:[180,6],above:[25,52],below:[20,-18]},pt=(s,t={},...e)=>{let i=document.createElement(s);for(let o in t)o==="class"?i.className=t[o]:o.startsWith("on")?i.addEventListener(o.slice(2),t[o]):o in i?i[o]=t[o]:i.setAttribute(o,t[o]);return i.append(...e),i};function Vo(){return new Promise((s,t)=>{let e=performance.now(),i=()=>{let o=window.__white;if(o&&o.view&&o.expr&&o.model&&o.live&&o.frames>1)return s(o);let a=document.getElementById("boot");if(a&&a.classList.contains("err"))return t(new Error(a.textContent));if(performance.now()-e>3e4)return t(new Error("White Engine did not start."));setTimeout(i,60)};i()})}async function Jo(){let s=await Vo(),t=document.getElementById("boot");t&&t.remove();let e=JSON.parse(JSON.stringify(Fe)),i=new ue(e),o=new pe(s,i),a=new me(document.getElementById("world")),n=d=>I.has(d)?I.get(d).split(",").map(Number):null,h=null,r=null;if(I.get("world")==="film"){let d=I.get("filmdir")||"assets/hook/",[M,E]=await Promise.all([fetch(d+"film.json").then(L=>L.json()),fetch(d+"ground.json").then(L=>L.json()).catch(()=>null)]);h=new ve(M,{ground:E,src:I.get("kind")==="webm"?[{url:d+"film.webm",type:"video/webm"}]:[{url:d+"film.mp4",type:"video/mp4"},{url:d+"film.webm",type:"video/webm"}]}),r=po(h);let P=n("tone"),S=n("shade");if(P&&Object.assign(r.tone,{gain:P[0]??1,gamma:P[1]??1,colour:P[2]??1}),S&&Object.assign(r.shade,{sun:S[0]??.92,feet:S[1]??.55,light:S[2]??.4,reach:S[3]??14}),r.show=Q("show",0),I.has("mon")&&(Object.assign(r.mon,uo(h.camAt(Q("frame",700)).pos,h.dir(Q("monel",27),Q("monyaw",74)),Q("mondist",430),Q("monsize",85))),r.mon.on=Q("mon",1),r.mon.light=Q("monlight",1),r.mon.wake=Q("monwake",.4),I.has("moneye")&&(r.mon.look=n("moneye"))),I.has("beam")){let L=n("beam"),q=h.spot(L[0],L[1]);r.beam.at=[q[0],h.floor(q[0],q[1]),q[1]],r.beam.on=L[2]??1,r.beam.width=L[3]??3}if(I.has("bug")){let L=n("bug");r.bug=[L[0],1.7,L[2]||24,L[1]||0]}}let l=r||(I.get("world")==="beach"?bt:lo);a.setWorld(l),I.has("cover")&&(a.look.depth=Q("cover",1)>0);let f=l.ground?(d,M)=>l.ground(d,M):()=>0,u=h&&I.has("spot")?h.spot(...n("spot")):[0,0];if(h)if(I.has("still"))await h.still(I.get("still"),Q("frame",0));else if(await h.load()){let d=(I.get("seq")||(I.get("clip")||"A")+":1e9").split(",").map(M=>M.split(":"));(async()=>{for(let[M,E]of d)await h.go(M,{fade:Q("fade",.35)}),await new Promise(P=>setTimeout(P,(+E||3)*1e3))})()}else throw new Error("The film could not be played.");let v=n("cam"),z=n("at");if(I.has("big")){let d=n("big");bt.big=[d[0],d[1]||1.3]}if(I.has("rough")&&(bt.rough=Q("rough",1)),I.has("q")&&(bt.quality=Q("q",1)),I.has("mon")&&(bt.mon.on=Q("mon",1),bt.mon.light=Q("monlight",1)),I.has("beam")){let d=n("beam");bt.beam.at=[d[0],d[1]],bt.beam.on=d[2]??1}if(I.has("bug")){let d=n("bug");bt.bug=[d[0],1.7,24,d[1]||0]}if(I.has("tear")){let d=n("tear");a.tear=[d[0],1.3,d[1]||0]}let c={az:Q("az",28),el:Q("el",7),dist:Q("dist",3.1),fov:Q("fov",36),height:Q("height",.52),pose:I.get("pose")||"stand",expr:I.get("expr")||"idle",time:I.has("time")?+I.get("time"):null,life:Q("life",1),turn:Q("turn",0),spin:I.has("spin"),headYaw:Q("hy",0),headPitch:Q("hp",0),headRoll:Q("hr",0),lookAtYou:I.has("look")},m=new be(i);if(m.ground=f,h){let d=h.camAt(Q("frame",0)).pos;m.place(u[0],u[1],Math.atan2(d[0]-u[0],d[2]-u[1])+Q("turn",0)*k)}try{m.moves=await fetch("assets/hook/moves.json").then(d=>d.json())}catch{m.moves={}}c.mode=I.has("pose")?"pose":"act",c.follow=I.has("follow");let x=0,b=d=>new Promise(M=>{A.push({at:B+d,r:M})}),A=[],B=0,W={stand:async()=>{},walk:async d=>{let M=[[1.3,1.1],[-1.3,1.2],[-1.2,-.9],[1.2,-1]];for(let E=0;x===d;E++)await m.walkTo(...M[E%4],{speed:.9})},first:async d=>{m.style.wobble=1,await m.walkTo(.5,1.5,{speed:.5}),x===d&&(m.style.wobble=.5,await m.walkTo(-.9,.6,{speed:.7}),x===d&&(m.style.wobble=0,await m.walkTo(0,0,{speed:.9,face:[0,0,5]})))},run:async d=>{let M=[[3.5,0],[-3.5,0]];for(let E=0;x===d;E++)await m.walkTo(...M[E%2],{speed:3.4})},turn:async d=>{for(let M=1;x===d;M++)await m.face(M*2.1),await b(.6)},line:async()=>{await m.walkTo(0,80,{speed:Q("speed",.9)})},hook:async d=>{m.lookAt(null),await b(.8),await m.gesture("hands",{hold:3}),x===d&&(m.lookAt("eye"),await m.gesture("me",{hold:1.8}),x===d&&(m.style.wobble=1,m.lookAt(null),await m.walkTo(.9,1.2,{speed:.5}),x===d&&(m.style.wobble=.3,await m.walkTo(-1,.9,{speed:.8}),x===d&&(m.style.wobble=0,await m.walkTo(0,0,{speed:1,face:[0,0,5]}),x===d&&(m.lookAt("eye"),await m.gesture("wave"))))))},go:async()=>{let d=h?h.spot(...n("to")||[100,3]):[1,1];await m.walkTo(d[0],d[1],{speed:Q("speed",.9)}),m.lookAt("eye")},escape:async d=>{m.lookAt("eye"),await m.gesture("startle"),x===d&&(m.gesture("ui",{side:"R"}),m.lookAt(null),await m.walkTo(0,30,{speed:3.6}))}},H=d=>{c.mode="act",c.act=d;let M=++x;if(m.stopWalking(),m.stop(),m.style.wobble=0,d.startsWith("g:"))m.gesture(d.slice(2),{hold:2.5});else if(d.startsWith("m:")){let E={};for(let P of["from","to","rate","k","head"])I.has(P)&&(E[P]=Q(P,0));I.has("arms")&&(E.arms=I.get("arms")),I.get("legs")==="0"&&(E.legs=!1),(async()=>(I.has("walk")&&m.walkTo(0,80,{speed:Q("walk",.9)}),await b(Q("pre",.3)),x===M&&m.perform(d.slice(2),E)))()}else(W[d]||W.stand)(M)};c.act=I.get("act")||"stand",I.has("wobble")&&(m.style.wobble=Q("wobble",0)),I.has("mech")&&(m.style.mech=Q("mech",0)),I.has("loose")&&(m.style.loose=Q("loose",.5));let p=(d,M,E)=>{B=d;for(let P=A.length-1;P>=0;P--)A[P].at<=d&&A.splice(P,1)[0].r();m.update(d,M,E)};if(I.has("lk"))for(let d of I.get("lk").split(",")){let[M,E]=d.split(":");if(!isFinite(+E))continue;let P=/^(fillet|filletOpen|filletNear)([0-3])$/.exec(M);P?o.look[P[1]][+P[2]]=+E:M in o.look&&(o.look[M]=+E)}if(I.has("bd")){for(let d of I.get("bd").split(",")){let[M,E]=d.split(":");isFinite(+E)&&(M.startsWith("r.")?e.r[M.slice(2)]=+E:e[M]=+E)}i.setBody(e)}if(I.has("shot")&&document.body.classList.add("shot"),I.has("scale")&&(a.scale=Q("scale",1)),s.setExpression(c.expr),I.has("flat")){document.body.classList.add("flat"),window.__w3d={E:s,rig:i,fig:o,stage:a,S:c,body:e,frames:99};return}o.enter();let R=a.canvas,w=new Map,C=0;R.addEventListener("pointerdown",d=>{R.setPointerCapture(d.pointerId),w.set(d.pointerId,[d.clientX,d.clientY]),C=0,c.spin=!1}),R.addEventListener("pointermove",d=>{let M=w.get(d.pointerId);if(M&&(w.size===1&&(c.az-=(d.clientX-M[0])*.35,c.el=_(c.el+(d.clientY-M[1])*.3,-40,88)),M[0]=d.clientX,M[1]=d.clientY,w.size===2)){let[E,P]=[...w.values()],S=Math.hypot(E[0]-P[0],E[1]-P[1]);C&&(c.dist=_(c.dist*C/S,.35,30)),C=S}});for(let d of["pointerup","pointercancel"])R.addEventListener(d,M=>{w.delete(M.pointerId),C=0});R.addEventListener("wheel",d=>{d.preventDefault(),c.dist=_(c.dist*Math.exp(d.deltaY*.0012),.35,30)},{passive:!1});let X=document.getElementById("panel"),Y=document.getElementById("hud"),U=(d,M,E,P)=>{let S=pt("div",{class:"row"}),L=M.map(nt=>pt("button",{type:"button",onclick:()=>{P(nt),q()}},nt)),q=()=>L.forEach((nt,xt)=>nt.setAttribute("aria-pressed",String(M[xt]===E())));return q(),S.append(...L),X.append(pt("h2",{},d),S),q},O=(d,M,E,P,S,L)=>{let q=pt("output",{},String(S())),nt=pt("input",{type:"range",min:M,max:E,step:P,value:S(),oninput:()=>{L(+nt.value),q.textContent=String(+nt.value)}});X.append(pt("label",{class:"s"},d,nt,q))};X.append(pt("h1",{},"White 3D"),pt("p",{},"Drag to go round him, scroll to come closer.")),X.append(pt("p",{},"Click the floor and he walks there (hold Shift: he runs).")),U("He moves",Object.keys(W),()=>c.mode==="act"?c.act:null,d=>H(d)),U("Gestures",Object.keys(ye),()=>null,d=>{c.mode="act",m.gesture(d,{hold:d==="hold"||d==="ui"?3:void 0})}),Object.keys(m.moves).length&&U("Performances",Object.keys(m.moves),()=>null,d=>{c.mode="act",m.perform(d)}),X.append(pt("h2",{},"How he moves")),O("Unsure on his feet",0,1,.05,()=>m.style.wobble,d=>{m.style.wobble=d}),O("Loose hands",0,1,.05,()=>m.style.loose,d=>{m.style.loose=d}),O("Stop-motion",0,1,.05,()=>m.style.mech,d=>{m.style.mech=d}),O("Standing life",0,2,.05,()=>m.style.energy,d=>{m.style.energy=d}),U("Still pose",Object.keys(xe),()=>c.mode==="pose"?c.pose:null,d=>{c.mode="pose",c.pose=d}),U("Expression",jo,()=>c.expr,d=>{c.expr=d,s.setExpression(d)}),U("View",Object.keys(go),()=>null,d=>{[c.az,c.el]=go[d],c.spin=!1}),X.append(pt("div",{class:"row",style:"margin-top:6px"},pt("button",{type:"button",onclick:()=>{c.spin=!c.spin}},"Turn him slowly"),pt("button",{type:"button",onclick:()=>{s.breath&&s.breath.now(1)}},"Glitch now"),pt("button",{type:"button",onclick:()=>{c.lookAtYou=!c.lookAtYou}},"Look at you"))),X.append(pt("h2",{},"Camera")),O("Lens (\xB0)",14,80,1,()=>c.fov,d=>{c.fov=d}),O("World sharpness",.3,1,.05,()=>a.scale,d=>{a.scale=d}),X.append(pt("h2",{},"Proportions (heads)"));let F=(d,M,E,P,S)=>O(d,E,P,.005,()=>S?e[S][M]:e[M],L=>{S?e[S][M]=L:e[M]=L,i.setBody(e)});O("Head (m)",.2,.4,.005,()=>e.head,d=>{e.head=d,i.setBody(e)}),F("Neck","neck",.6,1.2),F("Shoulders","clav",.3,.7),F("Their slope","clavDrop",.05,.45),F("Upper arm","arm",.5,1.2),F("Forearm","fore",.5,1.2),F("Chest width","chestW",.3,.7),F("Waist width","waistW",.3,.7),F("Hip width","pelvis",.15,.4),F("Thigh","thigh",.8,2),F("Shin","shin",.8,2),F("Foot","foot",.2,.8),F("Feet apart","stance",1,2.6),O("Arms hang out (\xB0)",0,25,.5,()=>e.hang,d=>{e.hang=d,i.setBody(e)}),F("Palm","palm",.15,.4),F("Fingers","finger",.15,.45),F("Depth: chest","chest",.15,.45,"r"),F("Depth: waist","waist",.15,.45,"r"),F("Depth: hips","hips",.15,.45,"r"),F("Arm at the shoulder","shoulder",.08,.3,"r"),F("Arm at the elbow","elbow",.06,.3,"r"),F("Arm at the wrist","wrist",.05,.3,"r"),F("Leg at the hip","hipJoint",.12,.4,"r"),F("Leg at the knee","knee",.1,.4,"r"),F("Leg at the ankle","ankle",.08,.4,"r"),F("Toe","toe",.06,.3,"r"),X.append(pt("h2",{},"How the body is drawn"));let j=(d,M,E,P,S=.005)=>O(d,E,P,S,()=>o.look[M],L=>{o.look[M]=L});j("Shadow of a part in front","over",0,.6),j("A hand's shadow","handOver",0,.6),j("Their reach","overReach",.02,.8),j("Their reach on his face","faceReach",.01,.5),j("Head's shadow (off)","headShadow",0,.5),j("Shade inside the face's edge (off)","faceShade",0,1,.05),O("Rounded corner: neck and shoulders",0,1,.01,()=>o.look.fillet[0],d=>{o.look.fillet[0]=d}),O("Rounded corner: inside an elbow or knee",0,.6,.01,()=>o.look.fillet[1],d=>{o.look.fillet[1]=d}),O("Rounded corner: where an arm or leg comes out",0,.8,.01,()=>o.look.fillet[2],d=>{o.look.fillet[2]=d}),O("Rounded corner: neck and head",0,.5,.01,()=>o.look.fillet[3],d=>{o.look.fillet[3]=d}),O("Rounding starts at a corner this open",0,.5,.01,()=>o.look.filletOpen[0],d=>{o.look.filletOpen[0]=d}),O("Rounding is full at a corner this open",.05,1.5,.01,()=>o.look.filletOpen[1],d=>{o.look.filletOpen[1]=d}),j("Edge shadow (off)","edge",0,.5),j("Its depth","edgeDepth",.02,.4),j("Wobble","wobble",0,.06,.001),j("Effects size","fxRef",.05,1,.01),j("Room for effects","margin",.5,5,.1);let at=null,tt=null;if(R.addEventListener("pointerdown",d=>{tt=[d.clientX,d.clientY]}),R.addEventListener("pointerup",d=>{if(!tt||!at||Math.hypot(d.clientX-tt[0],d.clientY-tt[1])>5)return;let M=R.getBoundingClientRect(),E=at,P=((d.clientX-M.left)/M.width-.5)*E.W,S=(.5-(d.clientY-M.top)/M.height)*E.H,L=[E.b.z[0]*E.f-E.b.x[0]*P+E.b.y[0]*S,E.b.z[1]*E.f-E.b.x[1]*P+E.b.y[1]*S,E.b.z[2]*E.f-E.b.x[2]*P+E.b.y[2]*S];if(L[1]>=-1e-6)return;let q=-E.pos[1]/L[1];c.mode="act",c.act=null,x++,m.walkTo(E.pos[0]+L[0]*q,E.pos[2]+L[2]*q,{speed:d.shiftKey?3.4:.95})}),c.mode==="act"&&(H(c.act),c.time!=null)){m.eye=[0,1.2,3];for(let d=0,M=Math.round(c.time*60);d<=M;d++)p(d/60,1/60,null),await null,await null}let st=[0,0],$=0,J=0,et=0,dt=null,vt=d=>{requestAnimationFrame(vt);let M=Math.min(window.devicePixelRatio||1,2);a.size(R.clientWidth*M,R.clientHeight*M);let E=R.width,P=R.height;dt==null&&(dt=d);let S=c.time!=null?c.time:(d-dt)/1e3,L=$?(d-$)/1e3:.016;$=d,c.spin&&(et+=L*24),J+=((L>0?1/L:60)-J)*.05;let q=i.height*c.height,nt=c.az*k,xt=c.el*k,zt=c.mode==="act"&&c.follow?m.pos:[0,0,0];st[0]+=(zt[0]-st[0])*_(L*4,0,1),st[1]+=(zt[2]-st[1])*_(L*4,0,1),c.time!=null&&(st[0]=zt[0],st[1]=zt[2]);let Mt=[st[0],q,st[1]];Mt[1]+=f(Mt[0],Mt[2]);let ft=[Mt[0]+c.dist*Math.sin(nt)*Math.cos(xt),Mt[1]+c.dist*Math.sin(xt),Mt[2]+c.dist*Math.cos(nt)*Math.cos(xt)];ft[1]=Math.max(f(ft[0],ft[2])+.05,ft[1]),v&&(ft=v);let qt=de(ft,z||Mt,c.fov*k,E,P);h&&(h.tick(L),qt=h.camera(E,P),ft=qt.pos),at=qt;let mt=I.has("nowhite")?null:o.frame(d,qt,Tt=>{if(c.mode==="act"){if(m.eye=ft,c.time==null)p(S,L,Tt);else{let ae=i.J}return}let Gt=xe[c.pose]||xe.stand,Et=mo(Gt(i.B,S),S,c.life);Et.yaw=(c.turn+et)*k+(h?Math.atan2(ft[0]-u[0],ft[2]-u[1]):0),Et.pos=[u[0],f(u[0],u[1]),u[1]];let Yt={yaw:0,pitch:0,roll:0,...Et.head||{}};Et.head={yaw:Yt.yaw+Tt.yaw+c.headYaw*k,pitch:Yt.pitch+Tt.pitch+c.headPitch*k,roll:Yt.roll+Tt.roll+c.headRoll*k},c.lookAtYou&&(Et.lookAt=ft,Et.look=.85),i.pose(Et)}),ut=i.J;l===bt&&ut.anL&&(bt.feet=[ut.anL[0],ut.anL[2],ut.anR[0],ut.anR[2]]);let Pt=[ut.hip[0],f(ut.hip[0],ut.hip[2]),ut.hip[2]];r&&r.white(mt?ut:null,i.B,Pt),a.render(S,qt,mt,mt?{head:ut.head,chest:ut.chest,hip:ut.hip,root:Pt}:null),it.out=mt,mt&&(Y.textContent=`${J.toFixed(0)} fps \xB7 White's picture ${mt.cw} \xD7 ${mt.ch}`+(mt.k<.999?` (${(mt.k*100).toFixed(0)} %)`:"")+` \xB7 effects \xD7 ${(o.fx||1).toFixed(2)}
head turn ${(mt.yaw/k).toFixed(0)}\xB0  nod ${(mt.pitch/k).toFixed(0)}\xB0  tilt ${(mt.roll/k).toFixed(0)}\xB0  \xB7  ${i.height.toFixed(2)} m, ${(i.height/i.B.D).toFixed(2)} heads`),it.frames++},it=window.__w3d={E:s,rig:i,fig:o,stage:a,S:c,body:e,actor:m,play:H,film:h,filmW:r,frames:0};requestAnimationFrame(vt)}Jo().catch(s=>{console.error(s);let t=document.getElementById("boot");t||(t=document.createElement("div"),t.id="boot",document.body.append(t)),t.textContent="White 3D could not start: "+s.message,t.classList.add("err")});})();
