(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[487],{9870:function(e,t,o){Promise.resolve().then(o.bind(o,5936))},5936:function(e,t,o){"use strict";o.r(t);var a=o(7437),n=o(6463),r=o(2265),s=o(9450),l=o(9842),i=o(5344),c=o(4769),u=o.n(c),d=o(8370),m=o(3299);t.default=(0,d.Z)(()=>{let e=(0,n.useRouter)(),[t,o]=(0,r.useState)(s.ou.now().setZone("America/Edmonton").toLocaleString(s.ou.DATETIME_FULL_WITH_SECONDS)),[c,d]=(0,r.useState)(""),[h,_]=(0,r.useState)(""),[k,y]=(0,r.useState)(""),[f,w]=(0,r.useState)(""),[g,b]=(0,r.useState)("select"),[S,x]=(0,r.useState)([]),[I,j]=(0,r.useState)(null),[E,v]=(0,r.useState)(!1),[O,T]=(0,r.useState)(!1),[B,C]=(0,r.useState)(null),[N,A]=(0,r.useState)(0),[Z,D]=(0,r.useState)(""),[L,M]=(0,r.useState)(600),[P,G]=(0,r.useState)(!1),[U,J]=(0,r.useState)(""),[F,H]=(0,r.useState)(""),[q,z]=(0,r.useState)(""),[W,R]=(0,r.useState)(0),K=(0,r.useCallback)(e=>{x(o=>[...o,{time:t,message:e}])},[t]),X=(0,r.useCallback)(()=>(e.push("/"),600),[e]);(0,r.useEffect)(()=>{let e=localStorage.getItem("userName"),t=localStorage.getItem("userId");e&&d(e),t&&_(t),(async()=>{if(t){let e=(0,l.IO)((0,l.hJ)(i.Z,"employee"),(0,l.ar)("id","==",t)),o=await (0,l.PL)(e);o.empty||("online"===o.docs[0].data().status?(v(!0),(0,m.x$)(t,R)):v(!1))}})();let a=setInterval(()=>{let e=s.ou.now().setZone("America/Edmonton");o(e.toLocaleString(s.ou.DATETIME_FULL_WITH_SECONDS)),M(e=>e<=1?X():e-1);let t=e.hour;t<12?D("Good morning"):t<18?D("Good afternoon"):D("Good evening")},1e3);return()=>clearInterval(a)},[X]);let Y=e=>{b(e.target.value),"select"===e.target.value?w(""):y("")},$=async e=>{if(e.preventDefault(),F!==q){alert("New password and confirm new password do not match.");return}try{let e=(0,l.IO)((0,l.hJ)(i.Z,"employee"),(0,l.ar)("id","==",h)),t=await (0,l.PL)(e);if(t.empty){alert("Employee ID does not exist");return}let o=t.docs[0];if(o.data().password!==U){alert("Current password is incorrect.");return}let a=(0,l.JU)(i.Z,"employee",o.id);await (0,l.r7)(a,{password:F}),alert("Password changed successfully!"),G(!1)}catch(e){console.error("Error updating password: ",e),alert("Error updating password.")}};return(0,a.jsxs)("div",{className:u().container,children:[(0,a.jsx)("title",{children:"MTG - Employee"}),(0,a.jsxs)("div",{className:u().formContainer,children:[(0,a.jsxs)("h1",{children:[Z,", ",c,"!"]}),(0,a.jsxs)("div",{className:u().currentTime,children:["Current Time: ",t]}),(0,a.jsxs)("div",{className:u().currentTime,children:["Auto Logout In: ",Math.floor(L/60),":",String(L%60).padStart(2,"0")]}),(0,a.jsxs)("div",{className:u().currentTime,children:["Today's Work Duration: ",p(W)]}),(0,a.jsxs)("div",{className:u().buttonAndBreakGroup,children:[(0,a.jsxs)("div",{className:u().buttonGroup,children:[(0,a.jsx)("button",{className:"".concat(u().clockInButton," ").concat(E?u().disabledButton:""),onClick:()=>(0,m.el)(h,C,v,K,R),disabled:E,children:"Clock In"}),(0,a.jsx)("button",{className:"".concat(u().clockOutButton," ").concat(E?"":u().disabledButton),onClick:()=>(0,m.hq)(h,v,K,R),disabled:!E,children:"Clock Out"}),(0,a.jsx)("button",{className:u().changePasswordButton,onClick:()=>G(!0),children:"Change Password"})]}),(0,a.jsxs)("div",{className:u().breakGroup,children:[(0,a.jsxs)("div",{className:u().breakOption,children:[(0,a.jsx)("input",{type:"radio",name:"breakOption",value:"select",checked:"select"===g,onChange:Y,disabled:!E}),(0,a.jsxs)("select",{className:u().breakSelect,value:k,onChange:e=>{y(e.target.value),b("select")},disabled:"select"!==g||!E,children:[(0,a.jsx)("option",{value:"15",children:"15 min"}),(0,a.jsx)("option",{value:"30",children:"30 min"}),(0,a.jsx)("option",{value:"45",children:"45 min"}),(0,a.jsx)("option",{value:"60",children:"60 min"})]})]}),(0,a.jsxs)("div",{className:u().breakOption,children:[(0,a.jsx)("input",{type:"radio",name:"breakOption",value:"custom",checked:"custom"===g,onChange:Y,disabled:!E}),(0,a.jsx)("input",{type:"number",className:u().breakInput,placeholder:"Custom",value:f,onChange:e=>{w(e.target.value),b("custom")},disabled:"custom"!==g||!E,min:"1"})]}),(0,a.jsx)("button",{className:"".concat(u().startBreakButton," ").concat(!E||O?u().disabledButton:""),onClick:()=>{let e="select"===g?k:f;if(""===e||0===parseInt(e)){alert("Break duration must be greater than 0 and not empty.");return}(0,m.pM)(h,T,j,e,K)},disabled:!E||O,children:"Start Break"})]})]}),(0,a.jsx)("div",{className:u().log,children:(0,a.jsxs)("table",{className:u().logTable,children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:"Time"}),(0,a.jsx)("th",{children:"Message"})]})}),(0,a.jsx)("tbody",{children:S.map((e,t)=>(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{children:e.time}),(0,a.jsx)("td",{children:e.message})]},t))})]})}),(0,a.jsx)("button",{className:u().logoutButton,onClick:()=>{e.push("/")},children:"Log Out"})]}),P&&(0,a.jsx)("div",{className:u().passwordModal,children:(0,a.jsx)("div",{className:u().passwordModalContent,children:(0,a.jsxs)("form",{onSubmit:$,children:[(0,a.jsxs)("div",{className:u().formGroup,children:[(0,a.jsx)("label",{children:"Current Password:"}),(0,a.jsx)("input",{type:"password",value:U,onChange:e=>J(e.target.value)})]}),(0,a.jsxs)("div",{className:u().formGroup,children:[(0,a.jsx)("label",{children:"New Password:"}),(0,a.jsx)("input",{type:"password",value:F,onChange:e=>H(e.target.value)})]}),(0,a.jsxs)("div",{className:u().formGroup,children:[(0,a.jsx)("label",{children:"Confirm New Password:"}),(0,a.jsx)("input",{type:"password",value:q,onChange:e=>z(e.target.value)})]}),(0,a.jsxs)("div",{className:u().passwordModalButtons,children:[(0,a.jsx)("button",{type:"submit",children:"Confirm"}),(0,a.jsx)("button",{type:"button",onClick:()=>G(!1),children:"Cancel"})]})]})})})]})});let p=e=>0===e?"0 h 0 m":"".concat(Math.floor(e/60)," h ").concat(e%60," m")},3299:function(e,t,o){"use strict";o.d(t,{el:function(){return m},hq:function(){return p},pM:function(){return h},x$:function(){return d}});var a=o(9842),n=o(9450),r=o(5344);let s=null,l=(e,t)=>{s&&clearInterval(s),s=setInterval(async()=>{await d(e,t)},6e4)},i=e=>{let t=n.ou.now().setZone("America/Edmonton").minus({months:1}).month,o=0;for(let a in e)n.ou.fromISO(a).setZone("America/Edmonton").month===t&&(o+=e[a]);return o},c=e=>{let t=n.ou.now().setZone("America/Edmonton"),o=t.month,a=t.year,r=0;if(t.day<=15){let t=n.ou.local(a,o,1).setZone("America/Edmonton"),s=n.ou.local(a,o,15).setZone("America/Edmonton");for(let o in e){let a=n.ou.fromISO(o).setZone("America/Edmonton");a>=t&&a<=s&&(r+=e[o])}}else{let s=n.ou.local(a,o,16).setZone("America/Edmonton"),l=n.ou.local(a,o,t.daysInMonth).setZone("America/Edmonton");for(let t in e){let o=n.ou.fromISO(t).setZone("America/Edmonton");o>=s&&o<=l&&(r+=e[t])}}return r},u=e=>{let t=n.ou.now().setZone("America/Edmonton").month,o=0;for(let a in e)n.ou.fromISO(a).setZone("America/Edmonton").month===t&&(o+=e[a]);return o},d=async(e,t)=>{let o=(0,a.IO)((0,a.hJ)(r.Z,"employee"),(0,a.ar)("id","==",e)),l=await (0,a.PL)(o);if(!l.empty){let e=l.docs[0],o=(0,a.JU)(r.Z,"employee",e.id),d=e.data();if("online"===d.status){let e=n.ou.now().setZone("America/Edmonton"),r=e.toISODate(),s=d.workTime[r],l=n.ou.fromISO(s.split(" - ")[0]),m=Math.round(e.diff(l,"minutes").minutes-(d.totalBreakDuration||0));t(m);let p={...d.workPeriod,[r]:m},h=(d.totalWorkDuration||0)+m,_=u(p),k=c(p),y=i(p);await (0,a.r7)(o,{workDurationToday:m,totalWorkDuration:h,twoWeeksWorkDuration:k,thisMonthWorkDuration:_,lastMonthWorkDuration:y,workPeriod:p}),console.log("Work duration updated successfully.")}else clearInterval(s)}},m=async(e,t,o,s,i)=>{let c=(0,a.IO)((0,a.hJ)(r.Z,"employee"),(0,a.ar)("id","==",e));try{let u=await (0,a.PL)(c);if(u.empty)console.log("User document does not exist for ID: ".concat(e));else{let c=u.docs[0],d=(0,a.JU)(r.Z,"employee",c.id),m=c.data(),p=n.ou.now().setZone("America/Edmonton"),h=p.weekdayLong,_=m.workHours[h];if(" - "===_){alert("Today is a day off, you cannot clock in.");return}let[k,y]=_.split(" - "),f=n.ou.fromISO(k,{zone:"America/Edmonton"}).minus({minutes:30}),w=n.ou.fromISO(y,{zone:"America/Edmonton"}).plus({minutes:30});if(p<f||p>w){alert("It is not within the allowed clock-in time range.");return}o(!0),t(p),s("Clocked In at ".concat(p.toLocaleString(n.ou.DATETIME_FULL_WITH_SECONDS)));let g=p.toISODate(),b={...m.workTime,[g]:p.toFormat("HH:mm")};await (0,a.r7)(d,{status:"online",workDurationToday:0,workTime:b,totalBreakDuration:0,isOnBreak:!1}),console.log("User status set to online and workDurationToday initialized."),l(e,i)}}catch(e){console.error("Error clocking in:",e)}},p=async(e,t,o,s)=>{t(!1);let l=n.ou.now().setZone("America/Edmonton");o("Clocked Out at ".concat(l.toLocaleString(n.ou.DATETIME_FULL_WITH_SECONDS)));let i=(0,a.IO)((0,a.hJ)(r.Z,"employee"),(0,a.ar)("id","==",e));try{let t=await (0,a.PL)(i);if(t.empty)console.log("User document does not exist for ID: ".concat(e));else{let e=t.docs[0],o=(0,a.JU)(r.Z,"employee",e.id),i=e.data(),c=l.toISODate(),u=i.workTime[c],d=n.ou.fromISO("".concat(c,"T").concat(u),{zone:"America/Edmonton"}),m=Math.round(l.diff(d,"minutes").minutes-(i.totalBreakDuration||0)),p={...i.workPeriod,[c]:m},h={...i.workTime,[c]:"".concat(u," - ").concat(l.toFormat("HH:mm"))};await (0,a.r7)(o,{status:"offline",isOnBreak:!1,workDurationToday:m,workPeriod:p,workTime:h}),console.log("User status set to offline and work duration updated."),s(m)}}catch(e){console.error("Error clocking out:",e)}},h=async(e,t,o,s,l)=>{t(!0),l("Break started at ".concat(n.ou.now().setZone("America/Edmonton").toLocaleString(n.ou.DATETIME_FULL_WITH_SECONDS)));let i=(0,a.IO)((0,a.hJ)(r.Z,"employee"),(0,a.ar)("id","==",e)),c=await (0,a.PL)(i);if(!c.empty){let e=c.docs[0],i=(0,a.JU)(r.Z,"employee",e.id);await (0,a.r7)(i,{isOnBreak:!0}),o(setTimeout(async()=>{t(!1),l("Break ended at ".concat(n.ou.now().setZone("America/Edmonton").toLocaleString(n.ou.DATETIME_FULL_WITH_SECONDS))),await (0,a.r7)(i,{isOnBreak:!1}),o(null)},6e4*s))}}},5344:function(e,t,o){"use strict";var a=o(5236),n=o(9842),r=o(9854);let s=(0,a.ZF)({apiKey:"AIzaSyB5__zMeXEsk4RxME0Fg46Sz7AhqZzA9qE",authDomain:"mtg-quickyclock.firebaseapp.com",projectId:"mtg-quickyclock",storageBucket:"mtg-quickyclock.appspot.com",messagingSenderId:"865821745601",appId:"1:865821745601:web:b01221defd23ac3d338f40"}),l=(0,n.ad)(s);(0,r.cF)(s),t.Z=l},8370:function(e,t,o){"use strict";var a=o(7437),n=o(6463),r=o(2265);t.Z=e=>{let t=t=>{let o=(0,n.useRouter)();return(0,r.useEffect)(()=>{{let e=localStorage.getItem("userName"),t=localStorage.getItem("adminName");e||t||o.push("/")}},[o]),(0,a.jsx)(e,{...t})};return t.displayName="withAuth(".concat(e.displayName||e.name||"Component",")"),t}},4769:function(e){e.exports={container:"employee_container__38_MF",formContainer:"employee_formContainer__b8qtM",currentTime:"employee_currentTime__fa65a",buttonAndBreakGroup:"employee_buttonAndBreakGroup__nsAjr",buttonGroup:"employee_buttonGroup__hBnnY",clockInButton:"employee_clockInButton__zL5RK",clockOutButton:"employee_clockOutButton___OENO",changePasswordButton:"employee_changePasswordButton__2ykY_",startBreakButton:"employee_startBreakButton__KRkim",button:"employee_button__RdhaT",disabledButton:"employee_disabledButton__h46X_",breakGroup:"employee_breakGroup__6AevP",breakOption:"employee_breakOption__f249u",breakSelect:"employee_breakSelect__yDLJJ",breakInput:"employee_breakInput__uUJRy",log:"employee_log__9iUMH",logTable:"employee_logTable__oFT7h",logoutButton:"employee_logoutButton__CdvJg",passwordModal:"employee_passwordModal__8ubjX",passwordModalContent:"employee_passwordModalContent__oqHd5",formGroup:"employee_formGroup__Rojk9",passwordModalButtons:"employee_passwordModalButtons__S2Ob5"}}},function(e){e.O(0,[432,358,900,971,23,744],function(){return e(e.s=9870)}),_N_E=e.O()}]);