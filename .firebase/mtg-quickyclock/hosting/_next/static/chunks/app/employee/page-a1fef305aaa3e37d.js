(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[487],{4654:function(){},6611:function(e,t,a){Promise.resolve().then(a.bind(a,5325))},5325:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return y}});var s=a(7437),o=a(6463),r=a(2265),l=a(9450),n=a(9842),i=a(5344),d=a(4769),c=a.n(d),u=e=>{let{userId:t,name:a}=e,[o,l]=(0,r.useState)({userId:t,name:a,message:""}),[d,u]=(0,r.useState)(null),m=e=>{l({...o,[e.target.name]:e.target.value})},h=async e=>{e.preventDefault();try{await (0,n.ET)((0,n.hJ)(i.Z,"messages"),{...o,status:"pending",createdAt:new Date}),l({message:""}),u("Form submitted successfully.")}catch(e){console.error("Error adding document: ",e),u("Error submitting form. Please try again.")}};return(0,s.jsx)("div",{className:c().formGroup,children:(0,s.jsxs)("form",{onSubmit:h,children:[(0,s.jsx)("h2",{children:"Contact Admins"}),(0,s.jsxs)("div",{className:"max-w-sm",children:[(0,s.jsx)("label",{for:"id",className:"block text-sm font-medium mb-2 dark:text-white",children:"ID"}),(0,s.jsx)("input",{type:"text",id:"id",className:"py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600",value:o.userId,onChange:m,required:!0,disabled:!0})]}),(0,s.jsxs)("div",{className:"max-w-sm",children:[(0,s.jsx)("label",{for:"name",className:"block text-sm font-medium mb-2 dark:text-white",children:"Name"}),(0,s.jsx)("input",{type:"text",id:"name",className:"py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600",value:o.name,onChange:m,required:!0,disabled:!0})]}),(0,s.jsxs)("div",{className:"max-w-sm",children:[(0,s.jsx)("label",{for:"textarea-label",className:"block text-sm font-medium mb-2 dark:text-white",children:"Comment"}),(0,s.jsx)("textarea",{id:"textarea-label",className:"py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600",rows:"3",value:o.message,onChange:m,required:!0})]}),(0,s.jsx)("button",{type:"submit",className:"py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",children:"Submit"}),d&&(0,s.jsx)("p",{children:d})]})})},m=e=>{let{userId:t}=e,[a,o]=(0,r.useState)([]),[l,d]=(0,r.useState)(!0),[c,u]=(0,r.useState)(null);return((0,r.useEffect)(()=>{(async()=>{d(!0);try{let e=(0,n.hJ)(i.Z,"messages"),a=(0,n.IO)(e,(0,n.ar)("userId","==",t)),s=(await (0,n.PL)(a)).docs.map(e=>({id:e.id,...e.data()}));o(s)}catch(e){u("Error fetching messages"),console.error(e)}finally{d(!1)}})()},[t]),l)?(0,s.jsx)("p",{children:"Loading..."}):c?(0,s.jsx)("p",{children:c}):(0,s.jsxs)("div",{className:"p-4",children:[(0,s.jsx)("h2",{className:"text-2xl font-semibold mb-4",children:"My Sent Forms"}),0===a.length?(0,s.jsx)("p",{className:"text-gray-500",children:"No sent forms found."}):(0,s.jsx)("ul",{className:"space-y-4",children:a.map(e=>(0,s.jsxs)("li",{className:"bg-white border border-gray-200 rounded-lg p-4 shadow-md",children:[(0,s.jsxs)("p",{className:"text-gray-800",children:[(0,s.jsx)("strong",{className:"font-semibold",children:"Message:"})," ",e.message]}),(0,s.jsxs)("p",{className:"text-gray-800",children:[(0,s.jsx)("strong",{className:"font-semibold",children:"Status:"})," ",e.status]}),(0,s.jsxs)("p",{className:"text-gray-800",children:[(0,s.jsx)("strong",{className:"font-semibold",children:"Time:"})," ",new Date(1e3*e.createdAt.seconds).toLocaleString()]})]},e.id))})]})};let h=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];var x=e=>{let{employeeId:t}=e,[a,o]=(0,r.useState)({}),[l,d]=(0,r.useState)(!0);(0,r.useEffect)(()=>{(async()=>{try{let e=(0,n.IO)((0,n.hJ)(i.Z,"employee"),(0,n.ar)("id","==",t)),a=await (0,n.PL)(e);if(!a.empty){let e=a.docs[0].data();console.log(e),o(e.workHours)}}catch(e){setError("Error fetching work hours: "+e.message)}finally{d(!1)}})()},[t]);let c=Object.entries(a).sort((e,t)=>h.indexOf(e[0])-h.indexOf(t[0]));return(0,s.jsxs)("div",{className:"p-6 bg-gray-50 min-h-screen",children:[(0,s.jsx)("h2",{className:"text-3xl font-bold text-gray-800 mb-6",children:"Your Weekly Work Hours"}),(0,s.jsx)("div",{className:"overflow-x-auto",children:(0,s.jsxs)("table",{className:"min-w-full bg-white border border-gray-200 rounded-lg shadow-md",children:[(0,s.jsx)("thead",{children:(0,s.jsxs)("tr",{className:"bg-gray-100 text-left text-gray-600",children:[(0,s.jsx)("th",{className:"px-6 py-3 border-b border-gray-200",children:"Day"}),(0,s.jsx)("th",{className:"px-6 py-3 border-b border-gray-200",children:"Hours"})]})}),(0,s.jsx)("tbody",{children:c.map(e=>{let[t,a]=e;return(0,s.jsxs)("tr",{className:"hover:bg-gray-50",children:[(0,s.jsx)("td",{className:"px-6 py-4 border-b border-gray-200",children:t}),(0,s.jsx)("td",{className:"px-6 py-4 border-b border-gray-200",children:a})]},t)})})]})})]})},p=a(8370),b=a(3458),g=()=>{let[e,t]=(0,r.useState)([]),[a,o]=(0,r.useState)(!1);(0,r.useEffect)(()=>{(async()=>{try{let e=(await (0,n.PL)((0,n.hJ)(i.Z,"bulletins"))).docs.map(e=>({id:e.id,...e.data()})).sort((e,t)=>{let a=e.createdAt.toDate?e.createdAt.toDate():new Date(e.createdAt);return(t.createdAt.toDate?t.createdAt.toDate():new Date(t.createdAt))-a});t(e)}catch(e){console.error("Error fetching bulletins:",e)}})()},[]);let l=e.length>0?e[0]:null;return(0,s.jsxs)("div",{className:"relative p-4 bg-gray-100",children:[(0,s.jsx)("h1",{className:"text-2xl font-bold mb-4",children:"Bulletin Board"}),l&&!a?(0,s.jsxs)("div",{className:"p-3 bg-white shadow-md rounded-lg mb-4",children:[(0,s.jsxs)("div",{className:"mb-1",children:[(0,s.jsx)("h2",{className:"text-lg font-semibold text-gray-800",children:l.title}),(0,s.jsxs)("p",{className:"text-xs text-gray-600",children:["By: ",l.author]})]}),(0,s.jsx)("p",{className:"text-gray-700 mb-1",children:l.message}),(0,s.jsx)("p",{className:"text-xs text-gray-500",children:new Date(l.createdAt.toDate()).toLocaleString()}),(0,s.jsx)("button",{onClick:()=>o(!0),className:"mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm",children:"Show All Messages"})]}):null,a&&(0,s.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:(0,s.jsxs)("div",{className:"bg-white p-4 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto relative",children:[(0,s.jsx)("button",{onClick:()=>o(!1),className:"absolute top-2 right-2 text-gray-600 hover:text-gray-800","aria-label":"Close",children:(0,s.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,s.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})}),(0,s.jsx)("h2",{className:"text-xl font-bold mb-4",children:"All Bulletins"}),(0,s.jsx)("ul",{className:"space-y-2",children:e.map(e=>(0,s.jsxs)("li",{className:"p-2 bg-gray-50 shadow-md rounded-lg",children:[(0,s.jsxs)("div",{className:"mb-1",children:[(0,s.jsx)("h3",{className:"text-lg font-semibold text-gray-800",children:e.title}),(0,s.jsxs)("p",{className:"text-xs text-gray-600",children:["By: ",e.author]})]}),(0,s.jsx)("p",{className:"text-gray-700 mb-1",children:e.message}),(0,s.jsx)("p",{className:"text-xs text-gray-500",children:new Date(e.createdAt.toDate()).toLocaleString()})]},e.id))})]})})]})},y=(0,p.Z)(()=>{let e=(0,o.useRouter)(),[t,a]=(0,r.useState)(l.ou.now().setZone("America/Edmonton").toLocaleString(l.ou.DATETIME_FULL_WITH_SECONDS)),[d,h]=(0,r.useState)(""),[p,y]=(0,r.useState)(""),[f,w]=(0,r.useState)("15"),[k,j]=(0,r.useState)(""),[_,N]=(0,r.useState)("select"),[v,S]=(0,r.useState)([]),[I,C]=(0,r.useState)(null),[B,E]=(0,r.useState)(!1),[D,O]=(0,r.useState)(!1),[A,T]=(0,r.useState)(null),[L,M]=(0,r.useState)(0),[P,Z]=(0,r.useState)(""),[J,H]=(0,r.useState)(600),[G,U]=(0,r.useState)(!1),[F,W]=(0,r.useState)(!1),[q,z]=(0,r.useState)(!1),[R,K]=(0,r.useState)(""),[Y,X]=(0,r.useState)(""),[$,Q]=(0,r.useState)(""),[V,ee]=(0,r.useState)(0),[et,ea]=(0,r.useState)([]),[es,eo]=(0,r.useState)(!1),[er,el]=(0,r.useState)(null),en=(0,r.useCallback)(e=>{S(a=>[...a,{time:t,message:e}])},[t]),ei=(0,r.useCallback)(()=>(e.push("/"),600),[e]);(0,r.useEffect)(()=>{let e=localStorage.getItem("userName"),t=localStorage.getItem("userId");e&&h(e),t&&y(t),(async()=>{if(t){let e=(0,n.IO)((0,n.hJ)(i.Z,"employee"),(0,n.ar)("id","==",t)),a=await (0,n.PL)(e);a.empty||("online"===a.docs[0].data().status?(E(!0),(0,b.x$)(t,ee)):E(!1))}})();let s=setInterval(()=>{let e=l.ou.now().setZone("America/Edmonton");a(e.toLocaleString(l.ou.DATETIME_FULL_WITH_SECONDS)),H(e=>e<=1?ei():e-1),(0,b.x$)(p,ee);let t=e.hour;t<12?Z("Good morning"):t<18?Z("Good afternoon"):Z("Good evening")},1e3);return()=>clearInterval(s)},[ei,p]);let ed=e=>{N(e.target.value),"select"===e.target.value?j(""):w("")},ec=async e=>{if(e.preventDefault(),Y!==$){alert("New password and confirm new password do not match.");return}try{let e=(0,n.IO)((0,n.hJ)(i.Z,"employee"),(0,n.ar)("id","==",p)),t=await (0,n.PL)(e);if(t.empty){alert("Employee ID does not exist");return}let a=t.docs[0];if(a.data().password!==R){alert("Current password is incorrect.");return}let s=(0,n.JU)(i.Z,"employee",a.id);await (0,n.r7)(s,{password:Y}),alert("Password changed successfully!"),U(!1)}catch(e){console.error("Error updating password: ",e),alert("Error updating password.")}};return(0,s.jsxs)("div",{className:c().container,children:[(0,s.jsx)("title",{children:"MTG - Employee"}),(0,s.jsxs)("div",{className:"overflow-y-auto\n      [&::-webkit-scrollbar]:w-2\n      [&::-webkit-scrollbar-track]:bg-gray-100\n      [&::-webkit-scrollbar-thumb]:bg-gray-300\n      dark:[&::-webkit-scrollbar-track]:bg-neutral-700\n      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 ".concat(c().formContainer),children:[(0,s.jsxs)("div",{className:"p-6 space-y-4 bg-white shadow-md rounded-lg",children:[(0,s.jsxs)("h1",{className:"text-2xl font-bold text-gray-800 dark:text-gray-100",children:[P,", ",d,"!"]}),(0,s.jsxs)("div",{className:"text-lg text-gray-800 dark:text-gray-200",children:[(0,s.jsxs)("p",{children:["Current Time: ",(0,s.jsx)("span",{className:"font-semibold",children:t})]}),(0,s.jsxs)("p",{children:["Auto Logout In:"," ",(0,s.jsxs)("span",{className:"font-semibold text-blue-600 dark:text-blue-400",children:[Math.floor(J/60),":",String(J%60).padStart(2,"0")]})]}),(0,s.jsxs)("p",{children:["Today's Work Duration:"," ",(0,s.jsx)("span",{className:"font-semibold",children:0===V?"0 h 0 m":"".concat(Math.floor(V/60)," h ").concat(V%60," m")})]})]})]}),(0,s.jsx)("div",{className:"w-full max-w-xl bg-white p-4 rounded-lg shadow-lg",children:(0,s.jsx)(g,{})}),(0,s.jsxs)("div",{className:c().buttonAndBreakGroup,children:[(0,s.jsxs)("div",{className:c().buttonGroup,children:[(0,s.jsx)("button",{className:"".concat(c().clockInButton," ").concat(B?c().disabledButton:""),onClick:()=>(0,b.el)(p,T,E,en),disabled:B,children:"Clock In"}),(0,s.jsx)("button",{className:"".concat(c().clockOutButton," ").concat(B?"":c().disabledButton),onClick:()=>(0,b.hq)(p,E,M,en,A,L,D,I,O),disabled:!B,children:"Clock Out"}),(0,s.jsx)("button",{className:c().changePasswordButton,onClick:()=>W(!0),children:"Contact Admins"}),(0,s.jsx)("button",{className:c().changePasswordButton,onClick:()=>z(!0),children:"View Sent Contact Forms"}),(0,s.jsx)("button",{className:c().changePasswordButton,onClick:()=>U(!0),children:"Change Password"})]}),(0,s.jsxs)("div",{className:c().breakGroup,children:[(0,s.jsxs)("div",{className:c().breakOption,children:[(0,s.jsx)("input",{type:"radio",name:"breakOption",value:"select",checked:"select"===_,onChange:ed,disabled:!B}),(0,s.jsxs)("select",{className:c().breakSelect,value:f,onChange:e=>{w(e.target.value),N("select")},disabled:"select"!==_||!B,children:[(0,s.jsx)("option",{value:"15",children:"15 min"}),(0,s.jsx)("option",{value:"30",children:"30 min"}),(0,s.jsx)("option",{value:"45",children:"45 min"}),(0,s.jsx)("option",{value:"60",children:"60 min"})]})]}),(0,s.jsxs)("div",{className:c().breakOption,children:[(0,s.jsx)("input",{type:"radio",name:"breakOption",value:"custom",checked:"custom"===_,onChange:ed,disabled:!B}),(0,s.jsx)("input",{type:"number",className:c().breakInput,placeholder:"Custom",value:k,onChange:e=>{j(e.target.value),N("custom")},disabled:"custom"!==_||!B,min:"1"})]}),(0,s.jsx)("button",{className:"".concat(c().startBreakButton," ").concat(!B||D?c().disabledButton:""),onClick:()=>{let e="select"===_?f:k;if(""===e||0===parseInt(e)){alert("Break duration must be greater than 0 and not empty.");return}(0,b.pM)(p,O,C,e,en)},disabled:!B||D,children:"Start Break"})]})]}),(0,s.jsx)(x,{employeeId:p}),(0,s.jsx)("div",{className:c().log,children:(0,s.jsxs)("table",{className:c().logTable,children:[(0,s.jsx)("thead",{children:(0,s.jsxs)("tr",{children:[(0,s.jsx)("th",{children:"Time"}),(0,s.jsx)("th",{children:"Message"})]})}),(0,s.jsx)("tbody",{children:v.map((e,t)=>(0,s.jsxs)("tr",{children:[(0,s.jsx)("td",{children:e.time}),(0,s.jsx)("td",{children:e.message})]},t))})]})}),(0,s.jsx)("button",{className:c().logoutButton,onClick:()=>{e.push("/")},children:"Log Out"})]}),es&&(0,s.jsx)("div",{className:c().overlay,children:(0,s.jsxs)("div",{className:c().overlayContent,children:[(0,s.jsx)("h2",{children:"All Bulletins"}),(0,s.jsx)("button",{className:c().closeButton,onClick:()=>eo(!1),children:"Close"}),(0,s.jsx)("ul",{className:c().bulletinList,children:et.map(e=>(0,s.jsxs)("li",{className:c().bulletinItem,children:[(0,s.jsx)("h3",{children:e.title}),(0,s.jsxs)("p",{children:["By: ",e.author]}),(0,s.jsx)("p",{children:new Date(e.createdAt.toDate()).toLocaleString()}),(0,s.jsx)("p",{children:e.message})]},e.id))})]})}),F&&(0,s.jsx)("div",{className:c().passwordModal,children:(0,s.jsxs)("div",{className:c().passwordModalContent,children:[(0,s.jsx)(u,{userId:p,name:d}),(0,s.jsx)("button",{onClick:()=>W(!1),children:"Close"})]})}),q&&(0,s.jsx)("div",{className:c().passwordModal,children:(0,s.jsxs)("div",{className:c().passwordModalContent,children:[(0,s.jsx)(m,{userId:p}),(0,s.jsx)("button",{onClick:()=>z(!1),children:"Close"})]})}),G&&(0,s.jsx)("div",{className:c().passwordModal,children:(0,s.jsx)("div",{className:c().passwordModalContent,children:(0,s.jsxs)("form",{onSubmit:ec,children:[(0,s.jsxs)("div",{className:c().formGroup,children:[(0,s.jsx)("label",{children:"Current Password:"}),(0,s.jsx)("input",{type:"password",value:R,onChange:e=>K(e.target.value)})]}),(0,s.jsxs)("div",{className:c().formGroup,children:[(0,s.jsx)("label",{children:"New Password:"}),(0,s.jsx)("input",{type:"password",value:Y,onChange:e=>X(e.target.value)})]}),(0,s.jsxs)("div",{className:c().formGroup,children:[(0,s.jsx)("label",{children:"Confirm New Password:"}),(0,s.jsx)("input",{type:"password",value:$,onChange:e=>Q(e.target.value)})]}),(0,s.jsxs)("div",{className:c().passwordModalButtons,children:[(0,s.jsx)("button",{type:"submit",children:"Confirm"}),(0,s.jsx)("button",{type:"button",onClick:()=>U(!1),children:"Cancel"})]})]})})})]})})},3458:function(e,t,a){"use strict";a.d(t,{el:function(){return h},hq:function(){return x},pM:function(){return p},x$:function(){return m}});var s=a(9842),o=a(9450),r=a(5344),l=a(5871),n=a(5494);let i=()=>new Promise((e,t)=>{navigator.geolocation.getCurrentPosition(e,t,{enableHighAccuracy:!0,timeout:5e3,maximumAge:6e4})}),d=async e=>{try{let t=(0,s.IO)((0,s.hJ)(r.Z,"employee"),(0,s.ar)("id","==",e)),a=await (0,s.PL)(t);if(a.empty)return console.error("No user found with the given ID"),!1;let o=a.docs[0].data().geofence;if("None"==o)return!0;if(!o)return console.error("No geofence location ID found for the user"),!1;let d=(0,s.JU)(r.Z,"geofence",o),c=await (0,s.QT)(d);if(!c.exists())return console.error("No geofence document found"),!1;let u=c.data().geopoint;if(!u||!u.latitude||!u.longitude)return console.error("Invalid geofence location data"),!1;let m=await i(),h=[m.coords.longitude,m.coords.latitude],x=(0,l.xm)(h),p=(0,l.xm)([u.longitude,u.latitude]);return 5>=(0,n.T)(p,x,{units:"kilometers"})}catch(e){return console.error("Error validating location:",e),!1}},c=null,u=(e,t)=>{c&&clearInterval(c),c=setInterval(async()=>{await m(e,t)},6e4)},m=async(e,t)=>{let a=(0,s.IO)((0,s.hJ)(r.Z,"employee"),(0,s.ar)("id","==",e)),l=await (0,s.PL)(a);if(!l.empty){let e=l.docs[0],a=(0,s.JU)(r.Z,"employee",e.id),n=e.data();if("online"===n.status){let e=o.ou.now().setZone("America/Edmonton"),r=e.toISODate(),l=n.workTime[r],i=o.ou.fromISO(l.split(" - ")[0],{zone:"America/Edmonton"}),d=n.totalBreakDuration||0,c=Math.round(e.diff(i,"minutes").minutes-d);c<0&&(c=0),t(c);let u={...n.workPeriod,[r]:c};await (0,s.r7)(a,{workDurationToday:c,workPeriod:u}),console.log("Work duration updated successfully.")}else clearInterval(c)}},h=async(e,t,a,l,n)=>{if(!await d(e)){alert("You are not within the allowed location to clock in.");return}let i=(0,s.IO)((0,s.hJ)(r.Z,"employee"),(0,s.ar)("id","==",e));try{let d=await (0,s.PL)(i);if(d.empty)console.log("User document does not exist for ID: ".concat(e));else{let i=d.docs[0],c=(0,s.JU)(r.Z,"employee",i.id),m=i.data(),h=o.ou.now().setZone("America/Edmonton"),x=h.weekdayLong,p=m.workHours[x];if(" - "===p){alert("Today is a day off, you cannot clock in.");return}let[b,g]=p.split(" - "),y=o.ou.fromISO(b,{zone:"America/Edmonton"}).minus({minutes:30}),f=o.ou.fromISO(g,{zone:"America/Edmonton"}).plus({minutes:30});if(h<y||h>f){alert("It is not within the allowed clock-in time range.");return}a(!0),t(h),l("Clocked In at ".concat(h.toLocaleString(o.ou.DATETIME_FULL_WITH_SECONDS)));let w=h.toISODate(),k={...m.workTime,[w]:h.toFormat("HH:mm")};await (0,s.r7)(c,{status:"online",workDurationToday:0,workTime:k,totalBreakDuration:0,isOnBreak:!1}),console.log("User status set to online and workDurationToday initialized."),u(e,n)}}catch(e){console.error("Error clocking in:",e)}},x=async(e,t,a,l,n)=>{t(!1);let i=o.ou.now().setZone("America/Edmonton");a("Clocked Out at ".concat(i.toLocaleString(o.ou.DATETIME_FULL_WITH_SECONDS)));let d=(0,s.IO)((0,s.hJ)(r.Z,"employee"),(0,s.ar)("id","==",e));try{let t=await (0,s.PL)(d);if(t.empty)console.log("User document does not exist for ID: ".concat(e));else{let e=t.docs[0],a=(0,s.JU)(r.Z,"employee",e.id),d=e.data(),c=i.toISODate(),u=d.workTime[c],m=o.ou.fromISO(u,{zone:"America/Edmonton"}),h=Math.round(i.diff(m,"minutes").minutes-(d.totalBreakDuration||0));h<0&&(h=0);let x={...d.workPeriod,[c]:h},p={...d.workTime,[c]:"".concat(u," - ").concat(i.toFormat("HH:mm"))};await (0,s.r7)(a,{status:"offline",lastOnlineDate:c,isOnBreak:!1,workDurationToday:h,workPeriod:x,workTime:p}),console.log("User status set to offline and work duration updated."),l(h),n(!1)}}catch(e){console.error("Error clocking out:",e)}},p=async(e,t,a,l,n)=>{t(!0),n("Break started at ".concat(o.ou.now().setZone("America/Edmonton").toLocaleString(o.ou.DATETIME_FULL_WITH_SECONDS)));let i=(0,s.IO)((0,s.hJ)(r.Z,"employee"),(0,s.ar)("id","==",e)),d=await (0,s.PL)(i);if(!d.empty){let e=d.docs[0],i=(0,s.JU)(r.Z,"employee",e.id),c=(e.data().totalBreakDuration||0)+parseInt(l);await (0,s.r7)(i,{isOnBreak:!0,totalBreakDuration:c}),a(setTimeout(async()=>{t(!1),n("Break ended at ".concat(o.ou.now().setZone("America/Edmonton").toLocaleString(o.ou.DATETIME_FULL_WITH_SECONDS))),await (0,s.r7)(i,{isOnBreak:!1}),a(null)},6e4*l))}}},5344:function(e,t,a){"use strict";var s=a(5236),o=a(9842),r=a(9854);let l=(0,s.ZF)({apiKey:"AIzaSyB5__zMeXEsk4RxME0Fg46Sz7AhqZzA9qE",authDomain:"mtg-quickyclock.firebaseapp.com",projectId:"mtg-quickyclock",storageBucket:"mtg-quickyclock.appspot.com",messagingSenderId:"865821745601",appId:"1:865821745601:web:b01221defd23ac3d338f40"}),n=(0,o.ad)(l);(0,r.cF)(l),t.Z=n},8370:function(e,t,a){"use strict";var s=a(7437),o=a(6463),r=a(2265);t.Z=e=>{let t=t=>{let a=(0,o.useRouter)();return(0,r.useEffect)(()=>{{let e=localStorage.getItem("userName"),t=localStorage.getItem("adminName");e||t||a.push("/")}},[a]),(0,s.jsx)(e,{...t})};return t.displayName="withAuth(".concat(e.displayName||e.name||"Component",")"),t}},4769:function(e){e.exports={container:"employee_container__38_MF",formContainer:"employee_formContainer__b8qtM",currentTime:"employee_currentTime__fa65a",buttonAndBreakGroup:"employee_buttonAndBreakGroup__nsAjr",buttonGroup:"employee_buttonGroup__hBnnY",clockInButton:"employee_clockInButton__zL5RK",clockOutButton:"employee_clockOutButton___OENO",changePasswordButton:"employee_changePasswordButton__2ykY_",startBreakButton:"employee_startBreakButton__KRkim",button:"employee_button__RdhaT",disabledButton:"employee_disabledButton__h46X_",breakGroup:"employee_breakGroup__6AevP",breakOption:"employee_breakOption__f249u",breakSelect:"employee_breakSelect__yDLJJ",breakInput:"employee_breakInput__uUJRy",log:"employee_log__9iUMH",logTable:"employee_logTable__oFT7h",logoutButton:"employee_logoutButton__CdvJg",passwordModal:"employee_passwordModal__8ubjX",passwordModalContent:"employee_passwordModalContent__oqHd5",formGroup:"employee_formGroup__Rojk9",passwordModalButtons:"employee_passwordModalButtons__S2Ob5",bulletinSection:"employee_bulletinSection__xP74p",bulletinHeader:"employee_bulletinHeader__DEQo2",viewAllButton:"employee_viewAllButton__hMRa1",overlay:"employee_overlay__HWJ_j",overlayContent:"employee_overlayContent__nOHlr",closeButton:"employee_closeButton__L4tlb",bulletinList:"employee_bulletinList__vbOY_",bulletinItem:"employee_bulletinItem__7GNfJ","sent-forms-container":"employee_sent-forms-container__omKX3","sent-forms-list":"employee_sent-forms-list__8lcnb","sent-form-item":"employee_sent-form-item__AKMoy"}}},function(e){e.O(0,[432,358,900,494,971,23,744],function(){return e(e.s=6611)}),_N_E=e.O()}]);