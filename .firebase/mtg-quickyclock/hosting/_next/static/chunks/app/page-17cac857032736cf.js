(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{9169:function(e,t,o){Promise.resolve().then(o.bind(o,9320))},3299:function(e,t,o){"use strict";o.d(t,{el:function(){return l},hq:function(){return c},pM:function(){return d},x$:function(){return A}});var a=o(9842),n=o(9450),r=o(5344);let i=null,s=(e,t)=>{i&&clearInterval(i),i=setInterval(async()=>{await A(e,t)},6e4)},A=async(e,t)=>{let o=(0,a.IO)((0,a.hJ)(r.Z,"employee"),(0,a.ar)("id","==",e)),s=await (0,a.PL)(o);if(!s.empty){let e=s.docs[0],o=(0,a.JU)(r.Z,"employee",e.id),A=e.data();if("online"===A.status){let e=n.ou.now().setZone("America/Edmonton"),r=e.toISODate(),i=A.workTime[r],s=n.ou.fromISO(i.split(" - ")[0],{zone:"America/Edmonton"}),l=A.totalBreakDuration||0,c=Math.round(e.diff(s,"minutes").minutes-l);c<0&&(c=0),t(c);let d={...A.workPeriod,[r]:c};await (0,a.r7)(o,{workDurationToday:c,workPeriod:d}),console.log("Work duration updated successfully.")}else clearInterval(i)}},l=async(e,t,o,i,A)=>{let l=(0,a.IO)((0,a.hJ)(r.Z,"employee"),(0,a.ar)("id","==",e));try{let c=await (0,a.PL)(l);if(c.empty)console.log("User document does not exist for ID: ".concat(e));else{let l=c.docs[0],d=(0,a.JU)(r.Z,"employee",l.id),u=l.data(),m=n.ou.now().setZone("America/Edmonton"),g=m.weekdayLong,p=u.workHours[g];if(" - "===p){alert("Today is a day off, you cannot clock in.");return}let[I,w]=p.split(" - "),f=n.ou.fromISO(I,{zone:"America/Edmonton"}).minus({minutes:30}),y=n.ou.fromISO(w,{zone:"America/Edmonton"}).plus({minutes:30});if(m<f||m>y){alert("It is not within the allowed clock-in time range.");return}o(!0),t(m),i("Clocked In at ".concat(m.toLocaleString(n.ou.DATETIME_FULL_WITH_SECONDS)));let E=m.toISODate(),h={...u.workTime,[E]:m.toFormat("HH:mm")};await (0,a.r7)(d,{status:"online",workDurationToday:0,workTime:h,totalBreakDuration:0,isOnBreak:!1}),console.log("User status set to online and workDurationToday initialized."),s(e,A)}}catch(e){console.error("Error clocking in:",e)}},c=async(e,t,o,i,s)=>{t(!1);let A=n.ou.now().setZone("America/Edmonton");o("Clocked Out at ".concat(A.toLocaleString(n.ou.DATETIME_FULL_WITH_SECONDS)));let l=(0,a.IO)((0,a.hJ)(r.Z,"employee"),(0,a.ar)("id","==",e));try{let t=await (0,a.PL)(l);if(t.empty)console.log("User document does not exist for ID: ".concat(e));else{let e=t.docs[0],o=(0,a.JU)(r.Z,"employee",e.id),l=e.data(),c=A.toISODate(),d=l.workTime[c],u=n.ou.fromISO(d,{zone:"America/Edmonton"}),m=Math.round(A.diff(u,"minutes").minutes-(l.totalBreakDuration||0));m<0&&(m=0);let g={...l.workPeriod,[c]:m},p={...l.workTime,[c]:"".concat(d," - ").concat(A.toFormat("HH:mm"))};await (0,a.r7)(o,{status:"offline",lastOnlineDate:c,isOnBreak:!1,workDurationToday:m,workPeriod:g,workTime:p}),console.log("User status set to offline and work duration updated."),i(m),s(!1)}}catch(e){console.error("Error clocking out:",e)}},d=async(e,t,o,i,s)=>{t(!0),s("Break started at ".concat(n.ou.now().setZone("America/Edmonton").toLocaleString(n.ou.DATETIME_FULL_WITH_SECONDS)));let A=(0,a.IO)((0,a.hJ)(r.Z,"employee"),(0,a.ar)("id","==",e)),l=await (0,a.PL)(A);if(!l.empty){let e=l.docs[0],A=(0,a.JU)(r.Z,"employee",e.id),c=(e.data().totalBreakDuration||0)+parseInt(i);await (0,a.r7)(A,{isOnBreak:!0,totalBreakDuration:c}),o(setTimeout(async()=>{t(!1),s("Break ended at ".concat(n.ou.now().setZone("America/Edmonton").toLocaleString(n.ou.DATETIME_FULL_WITH_SECONDS))),await (0,a.r7)(A,{isOnBreak:!1}),o(null)},6e4*i))}}},5344:function(e,t,o){"use strict";var a=o(5236),n=o(9842),r=o(9854);let i=(0,a.ZF)({apiKey:"AIzaSyB5__zMeXEsk4RxME0Fg46Sz7AhqZzA9qE",authDomain:"mtg-quickyclock.firebaseapp.com",projectId:"mtg-quickyclock",storageBucket:"mtg-quickyclock.appspot.com",messagingSenderId:"865821745601",appId:"1:865821745601:web:b01221defd23ac3d338f40"}),s=(0,n.ad)(i);(0,r.cF)(i),t.Z=s},9320:function(e,t,o){"use strict";o.r(t),o.d(t,{default:function(){return g}});var a=o(7437),n=o(6463),r=o(2265),i=o(6648),s=o(8518),A=o.n(s),l=o(9842),c=o(5344),d=o(9450),u={src:"/_next/static/media/MTGBCSLogo.3420c02d.jpg",height:960,width:2304,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAMACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAABwEBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhADEAAAAK4I/8QAGRABAAIDAAAAAAAAAAAAAAAAAQMRAAIh/9oACAEBAAE/AIYtCWgoVXuf/8QAFREBAQAAAAAAAAAAAAAAAAAAAQD/2gAIAQIBAT8AFb//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/AH//2Q==",blurWidth:8,blurHeight:3},m=o(3299);function g(){let e=(0,n.useRouter)(),t=async()=>{let e=d.ou.now().setZone("America/Edmonton").toISODate();(await (0,l.PL)((0,l.hJ)(c.Z,"employee"))).forEach(async t=>{let o=t.data().lastOnlineDate||e;if(e!==o){let e=(0,l.JU)(c.Z,"employee",t.id);await (0,l.r7)(e,{workDurationToday:0})}})};(0,r.useEffect)(()=>{t()},[]);let o=async()=>{let t=document.getElementById("mtgId").value,o=document.getElementById("password").value,a=(0,l.IO)((0,l.hJ)(c.Z,"employee"),(0,l.ar)("id","==",t),(0,l.ar)("password","==",o)),n=await (0,l.PL)(a);if(n.empty)console.error("Invalid credentials"),alert("Invalid credentials");else{let o=n.docs[0].data();localStorage.setItem("userName",o.name),localStorage.setItem("userId",t),(0,m.x$)(t),e.push("/employee")}},s=async()=>{let t=document.getElementById("mtgId").value,o=document.getElementById("password").value,a=(0,l.IO)((0,l.hJ)(c.Z,"employee"),(0,l.ar)("id","==",t),(0,l.ar)("password","==",o)),n=await (0,l.PL)(a);if(n.empty)console.error("Invalid credentials"),alert("Invalid credentials");else{let o=n.docs[0].data();"admin"===o.class?(localStorage.setItem("adminName",o.name),localStorage.setItem("userId",t),(0,m.x$)(t),e.push("/admin")):(console.error("You are not authorized to access admin page"),alert("You are not authorized to access admin page"))}};return(0,a.jsxs)("div",{className:A().container,children:[(0,a.jsx)("title",{children:"MTG"}),(0,a.jsxs)("div",{className:A().formContainer,children:[(0,a.jsx)(i.default,{src:u,alt:"MTG Logo",className:A().logo,width:250,height:110}),(0,a.jsx)("input",{type:"text",placeholder:"Enter Your MTG ID",className:A().input,id:"mtgId"}),(0,a.jsx)("input",{type:"password",placeholder:"Password",className:A().input,id:"password"}),(0,a.jsx)("button",{className:A().button,onClick:o,children:"Login"}),(0,a.jsx)("a",{onClick:s,className:A().forgetPassword,children:"Login as Admin"})]}),(0,a.jsx)("div",{className:A().copyright,children:"\xa9 2024 MTG Healthcare Academy"})]})}},8518:function(e){e.exports={container:"page_container__jZF7q",logo:"page_logo__ikIZE",title:"page_title__po7na",formContainer:"page_formContainer__9vwPo",input:"page_input__lx_gt",button:"page_button__52WaL",forgetPassword:"page_forgetPassword__zMizj",copyright:"page_copyright__FJcf5"}}},function(e){e.O(0,[851,358,900,648,971,23,744],function(){return e(e.s=9169)}),_N_E=e.O()}]);