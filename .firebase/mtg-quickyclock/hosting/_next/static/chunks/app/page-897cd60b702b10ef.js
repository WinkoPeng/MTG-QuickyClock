(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{9169:function(e,o,t){Promise.resolve().then(t.bind(t,9320))},3299:function(e,o,t){"use strict";t.d(o,{el:function(){return m},hq:function(){return g},pM:function(){return I},x$:function(){return u}});var a=t(9842),n=t(9450),r=t(5344);let i=null,l=(e,o,t,a,n,r,l,A,c)=>{i&&clearInterval(i),i=setInterval(async()=>{let i=await s(e);i||await u(e,o,t,a,n,r,i,A,c)},6e4)},s=async e=>{let o=(0,a.IO)((0,a.hJ)(r.Z,"employee"),(0,a.ar)("id","==",e)),t=await (0,a.PL)(o);return!t.empty&&t.docs[0].data().isOnBreak},A=e=>{let o=n.ou.now().setZone("America/Edmonton").minus({months:1}).month,t=0;for(let a in e)n.ou.fromISO(a).setZone("America/Edmonton").month===o&&(t+=e[a]);return t},c=e=>{let o=n.ou.now().setZone("America/Edmonton"),t=o.month,a=o.year,r=0;if(o.day<=15){let o=n.ou.local(a,t,1).setZone("America/Edmonton"),i=n.ou.local(a,t,15).setZone("America/Edmonton");for(let t in e){let a=n.ou.fromISO(t).setZone("America/Edmonton");a>=o&&a<=i&&(r+=e[t])}}else{let i=n.ou.local(a,t,16).setZone("America/Edmonton"),l=n.ou.local(a,t,o.daysInMonth).setZone("America/Edmonton");for(let o in e){let t=n.ou.fromISO(o).setZone("America/Edmonton");t>=i&&t<=l&&(r+=e[o])}}return r},d=e=>{let o=n.ou.now().setZone("America/Edmonton").month,t=0;for(let a in e)n.ou.fromISO(a).setZone("America/Edmonton").month===o&&(t+=e[a]);return t},u=async(e,o,t,l,s,u,m,I,p)=>{let f=(0,a.IO)((0,a.hJ)(r.Z,"employee"),(0,a.ar)("id","==",e)),E=await (0,a.PL)(f);if(!E.empty){let f=E.docs[0],w=(0,a.JU)(r.Z,"employee",f.id),y=f.data();if("online"===y.status){let r=n.ou.now().setZone("America/Edmonton"),f=r.toISODate(),E=y.lastOnlineDate||f,h=y.workDurationToday||0;f!==E&&(h=0);let k=r.weekdayLong,[_,S]=y.workHours[k].split(" - ");if(h>=n.ou.fromISO(S).diff(n.ou.fromISO(_),"minutes").minutes){clearInterval(i),alert("Work duration limit for today has been reached."),await g(e,o,t,l,s,u,m,I,p);return}if(r>n.ou.fromISO(S,{zone:"America/Edmonton"}).plus({minutes:30})){clearInterval(i),alert("Auto clocking out as work time has ended."),await g(e,o,t,l,s,u,m,I,p);return}h+=1;let D={...y.workPeriod,[f]:h},Z=(y.totalWorkDuration||0)+1,O=d(D),L=c(D),C=A(D);await (0,a.r7)(w,{workDurationToday:h,totalWorkDuration:Z,twoWeeksWorkDuration:L,thisMonthWorkDuration:O,lastMonthWorkDuration:C,lastOnlineDate:f,workPeriod:D}),console.log("Work duration updated successfully.")}else clearInterval(i)}},m=async(e,o,t,i,s,A,c,d,u,m)=>{let g=(0,a.IO)((0,a.hJ)(r.Z,"employee"),(0,a.ar)("id","==",e));try{let A=await (0,a.PL)(g);if(A.empty)console.log("User document does not exist for ID: ".concat(e));else{let g=A.docs[0],I=(0,a.JU)(r.Z,"employee",g.id),p=g.data(),f=n.ou.now().setZone("America/Edmonton"),E=f.weekdayLong,w=p.workHours[E];if(" - "===w){alert("Today is a day off, you cannot clock in.");return}let[y,h]=w.split(" - "),k=n.ou.fromISO(y,{zone:"America/Edmonton"}).minus({minutes:30}),_=n.ou.fromISO(h,{zone:"America/Edmonton"}).plus({minutes:30});if(f<k||f>_){alert("It is not within the allowed clock-in time range.");return}t(!0),o(f),i("Clocked In at ".concat(f.toLocaleString(n.ou.DATETIME_FULL_WITH_SECONDS)));let S=f.toISODate(),D={...p.workPeriod,[S]:0};await (0,a.r7)(I,{status:"online",workDurationToday:p.workDurationToday||0,workPeriod:D,isOnBreak:!1}),console.log("User status set to online and workDurationToday initialized."),l(e,t,s,i,f,c,d,u,m)}}catch(e){console.error("Error clocking in:",e)}},g=async(e,o,t,i,l,s,A,c,d)=>{o(!1);let u=n.ou.now().setZone("America/Edmonton");if(A){clearTimeout(c),i("Break ended at ".concat(u.toLocaleString(n.ou.DATETIME_FULL_WITH_SECONDS)));let e=l.plus({minutes:s}),o=u.diff(e,"minutes").minutes;t(e=>e+o),d(!1)}i("Clocked Out at ".concat(u.toLocaleString(n.ou.DATETIME_FULL_WITH_SECONDS)));let m=(0,a.IO)((0,a.hJ)(r.Z,"employee"),(0,a.ar)("id","==",e));try{let o=await (0,a.PL)(m);if(o.empty)console.log("User document does not exist for ID: ".concat(e));else{let e=o.docs[0],t=(0,a.JU)(r.Z,"employee",e.id);await (0,a.r7)(t,{status:"offline",isOnBreak:!1}),console.log("User status set to offline.")}}catch(e){console.error("Error clocking out:",e)}t(0)},I=async(e,o,t,i,l)=>{o(!0),l("Break started at ".concat(n.ou.now().setZone("America/Edmonton").toLocaleString(n.ou.DATETIME_FULL_WITH_SECONDS)));let s=(0,a.IO)((0,a.hJ)(r.Z,"employee"),(0,a.ar)("id","==",e)),A=await (0,a.PL)(s);if(!A.empty){let e=A.docs[0],s=(0,a.JU)(r.Z,"employee",e.id);await (0,a.r7)(s,{isOnBreak:!0}),t(setTimeout(async()=>{o(!1),l("Break ended at ".concat(n.ou.now().setZone("America/Edmonton").toLocaleString(n.ou.DATETIME_FULL_WITH_SECONDS))),await (0,a.r7)(s,{isOnBreak:!1}),t(null)},6e4*i))}}},5344:function(e,o,t){"use strict";var a=t(5236),n=t(9842),r=t(9854);let i=(0,a.ZF)({apiKey:"AIzaSyB5__zMeXEsk4RxME0Fg46Sz7AhqZzA9qE",authDomain:"mtg-quickyclock.firebaseapp.com",projectId:"mtg-quickyclock",storageBucket:"mtg-quickyclock.appspot.com",messagingSenderId:"865821745601",appId:"1:865821745601:web:b01221defd23ac3d338f40"}),l=(0,n.ad)(i);(0,r.cF)(i),o.Z=l},9320:function(e,o,t){"use strict";t.r(o),t.d(o,{default:function(){return g}});var a=t(7437),n=t(6463),r=t(2265),i=t(6648),l=t(8518),s=t.n(l),A=t(9842),c=t(5344),d=t(9450),u={src:"/_next/static/media/MTGBCSLogo.3420c02d.jpg",height:960,width:2304,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAMACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAABwEBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhADEAAAAK4I/8QAGRABAAIDAAAAAAAAAAAAAAAAAQMRAAIh/9oACAEBAAE/AIYtCWgoVXuf/8QAFREBAQAAAAAAAAAAAAAAAAAAAQD/2gAIAQIBAT8AFb//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/AH//2Q==",blurWidth:8,blurHeight:3},m=t(3299);function g(){let e=(0,n.useRouter)(),o=async()=>{let e=d.ou.now().setZone("America/Edmonton").toISODate();(await (0,A.PL)((0,A.hJ)(c.Z,"employee"))).forEach(async o=>{let t=o.data().lastOnlineDate||e;if(e!==t){let e=(0,A.JU)(c.Z,"employee",o.id);await (0,A.r7)(e,{workDurationToday:0})}})};(0,r.useEffect)(()=>{o()},[]);let t=async()=>{let o=document.getElementById("mtgId").value,t=document.getElementById("password").value,a=(0,A.IO)((0,A.hJ)(c.Z,"employee"),(0,A.ar)("id","==",o),(0,A.ar)("password","==",t)),n=await (0,A.PL)(a);if(n.empty)console.error("Invalid credentials"),alert("Invalid credentials");else{let t=n.docs[0].data();localStorage.setItem("userName",t.name),localStorage.setItem("userId",o),(0,m.x$)(o),e.push("/employee")}},l=async()=>{let o=document.getElementById("mtgId").value,t=document.getElementById("password").value,a=(0,A.IO)((0,A.hJ)(c.Z,"employee"),(0,A.ar)("id","==",o),(0,A.ar)("password","==",t)),n=await (0,A.PL)(a);if(n.empty)console.error("Invalid credentials"),alert("Invalid credentials");else{let t=n.docs[0].data();"admin"===t.class?(localStorage.setItem("adminName",t.name),localStorage.setItem("userId",o),(0,m.x$)(o),e.push("/admin")):(console.error("You are not authorized to access admin page"),alert("You are not authorized to access admin page"))}};return(0,a.jsxs)("div",{className:s().container,children:[(0,a.jsxs)("div",{className:s().formContainer,children:[(0,a.jsx)(i.default,{src:u,alt:"MTG Logo",className:s().logo,width:250,height:110}),(0,a.jsx)("input",{type:"text",placeholder:"Enter Your MTG ID",className:s().input,id:"mtgId"}),(0,a.jsx)("input",{type:"password",placeholder:"Password",className:s().input,id:"password"}),(0,a.jsx)("button",{className:s().button,onClick:t,children:"Login"}),(0,a.jsx)("a",{onClick:l,className:s().forgetPassword,children:"Login as Admin"})]}),(0,a.jsx)("div",{className:s().copyright,children:"\xa9 2024 MTG Healthcare Academy"})]})}},8518:function(e){e.exports={container:"page_container__jZF7q",logo:"page_logo__ikIZE",title:"page_title__po7na",formContainer:"page_formContainer__9vwPo",input:"page_input__lx_gt",button:"page_button__52WaL",forgetPassword:"page_forgetPassword__zMizj",copyright:"page_copyright__FJcf5"}}},function(e){e.O(0,[851,358,900,648,971,23,744],function(){return e(e.s=9169)}),_N_E=e.O()}]);