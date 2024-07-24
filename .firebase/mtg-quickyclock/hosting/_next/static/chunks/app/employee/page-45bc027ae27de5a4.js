(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[487],{4654:function(){},6611:function(e,t,a){Promise.resolve().then(a.bind(a,4385))},4385:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return p}});var r=a(7437),s=a(6463),l=a(2265),o=a(9450),d=a(9842),n=a(5344);let c=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];var i=e=>{let{employeeId:t}=e,[a,s]=(0,l.useState)({}),[o,i]=(0,l.useState)(!0);(0,l.useEffect)(()=>{(async()=>{try{let e=(0,d.IO)((0,d.hJ)(n.ZP,"employee"),(0,d.ar)("id","==",t)),a=await (0,d.PL)(e);if(!a.empty){let e=a.docs[0].data();console.log(e),s(e.workHours)}}catch(e){setError("Error fetching work hours: "+e.message)}finally{i(!1)}})()},[t]);let g=Object.entries(a).sort((e,t)=>c.indexOf(e[0])-c.indexOf(t[0]));return(0,r.jsxs)("div",{className:"p-6 bg-gray-50 dark:bg-gray-900 min-h-screen",children:[(0,r.jsx)("h2",{className:"text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6",children:"Your Weekly Work Hours"}),(0,r.jsx)("div",{className:"overflow-x-auto",children:(0,r.jsxs)("table",{className:"min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md",children:[(0,r.jsx)("thead",{children:(0,r.jsxs)("tr",{className:"bg-gray-100 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300",children:[(0,r.jsx)("th",{className:"px-6 py-3 border-b border-gray-200 dark:border-gray-600",children:"Day"}),(0,r.jsx)("th",{className:"px-6 py-3 border-b border-gray-200 dark:border-gray-600",children:"Hours"})]})}),(0,r.jsx)("tbody",{children:g.map(e=>{let[t,a]=e;return(0,r.jsxs)("tr",{className:"hover:bg-gray-50 dark:hover:bg-gray-600",children:[(0,r.jsx)("td",{className:"px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100",children:t}),(0,r.jsx)("td",{className:"px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100",children:a})]},t)})})]})})]})},g=a(8370),u=a(7513),m=a.n(u),x=e=>{let{userId:t,showPasswordModal:a,setShowPasswordModal:s}=e,[o,c]=(0,l.useState)(""),[i,g]=(0,l.useState)(""),[u,x]=(0,l.useState)(""),y=async e=>{if(e.preventDefault(),i!==u){alert("New password and confirm new password do not match.");return}try{let e=(0,d.IO)((0,d.hJ)(n.ZP,"employee"),(0,d.ar)("id","==",t)),a=(await (0,d.PL)(e)).docs[0],r=a.data();if(!m().compareSync(o,r.password)&&o!=r.password){alert("Current password is incorrect.");return}let l=m().genSaltSync(10),c=m().hashSync(i,l);console.log("Hashed password: ",c);let g=(0,d.JU)(n.ZP,"employee",a.id);await (0,d.r7)(g,{password:c}),alert("Password changed successfully!"),s(!1)}catch(e){console.error("Error updating password: ",e),alert("Error updating password.")}};return a?(0,r.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:(0,r.jsxs)("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative",children:[(0,r.jsx)("button",{className:"absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100",onClick:()=>s(!1),"aria-label":"Close",children:"\xd7"}),(0,r.jsxs)("form",{onSubmit:y,children:[(0,r.jsxs)("div",{className:"mb-4",children:[(0,r.jsx)("label",{className:"block text-gray-700 dark:text-gray-300",children:"Current Password:"}),(0,r.jsx)("input",{type:"password",className:"mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500",value:o,onChange:e=>c(e.target.value)})]}),(0,r.jsxs)("div",{className:"mb-4",children:[(0,r.jsx)("label",{className:"block text-gray-700 dark:text-gray-300",children:"New Password:"}),(0,r.jsx)("input",{type:"password",className:"mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500",value:i,onChange:e=>g(e.target.value)})]}),(0,r.jsxs)("div",{className:"mb-4",children:[(0,r.jsx)("label",{className:"block text-gray-700 dark:text-gray-300",children:"Confirm New Password:"}),(0,r.jsx)("input",{type:"password",className:"mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500",value:u,onChange:e=>x(e.target.value)})]}),(0,r.jsxs)("div",{className:"flex justify-end space-x-2",children:[(0,r.jsx)("button",{type:"submit",className:"py-2 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500",children:"Confirm"}),(0,r.jsx)("button",{type:"button",className:"py-2 px-4 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500",onClick:()=>s(!1),children:"Cancel"})]})]})]})}):null},y=()=>{let[e,t]=(0,l.useState)([]),[a,s]=(0,l.useState)(!1),[o,c]=(0,l.useState)(!1);(0,l.useEffect)(()=>{(async()=>{try{let e=(await (0,d.PL)((0,d.hJ)(n.ZP,"bulletins"))).docs.map(e=>({id:e.id,...e.data()})).sort((e,t)=>{let a=e.createdAt.toDate?e.createdAt.toDate():new Date(e.createdAt);return(t.createdAt.toDate?t.createdAt.toDate():new Date(t.createdAt))-a});t(e)}catch(e){console.error("Error fetching bulletins:",e)}})()},[]);let i=e.length>0?e[0]:null;return(0,r.jsxs)("div",{className:"relative rounded-lg p-4 bg-gray-100 dark:bg-gray-900",children:[(0,r.jsx)("h1",{className:"text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100",children:"Announcements"}),i&&!a?(0,r.jsxs)("div",{className:"p-3 bg-white dark:bg-gray-800 shadow-md rounded-lg mb-4",children:[(0,r.jsxs)("div",{className:"mb-1",children:[(0,r.jsx)("h2",{className:"text-lg font-semibold text-gray-800 dark:text-gray-200",children:i.title}),(0,r.jsxs)("p",{className:"text-xs text-gray-600 dark:text-gray-400",children:["By: ",i.author]})]}),(0,r.jsx)("p",{className:"text-gray-700 dark:text-gray-300 mb-1 ".concat(o?"":"line-clamp-3"),children:i.message}),(0,r.jsx)("p",{className:"text-xs text-gray-500 dark:text-gray-500",children:new Date(i.createdAt.toDate()).toLocaleString()}),i.message.length>200&&(0,r.jsx)("button",{onClick:()=>c(!o),className:"mt-2 px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 text-sm",children:o?"Show Less":"Read More"}),(0,r.jsx)("button",{onClick:()=>s(!0),className:"mt-2 ml-2 px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 text-sm",children:"Show All Messages"})]}):null,a&&(0,r.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:(0,r.jsxs)("div",{className:"bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto relative",children:[(0,r.jsx)("button",{onClick:()=>s(!1),className:"absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100","aria-label":"Close",children:(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,r.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})}),(0,r.jsx)("h2",{className:"text-xl font-bold mb-4 text-gray-900 dark:text-gray-100",children:"All Bulletins"}),(0,r.jsx)("ul",{className:"space-y-2",children:e.map(e=>(0,r.jsxs)("li",{className:"p-2 bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg",children:[(0,r.jsxs)("div",{className:"mb-1",children:[(0,r.jsx)("h3",{className:"text-lg font-semibold text-gray-800 dark:text-gray-200",children:e.title}),(0,r.jsxs)("p",{className:"text-xs text-gray-600 dark:text-gray-400",children:["By: ",e.author]})]}),(0,r.jsx)("p",{className:"text-gray-700 dark:text-gray-300 mb-1",children:e.message}),(0,r.jsx)("p",{className:"text-xs text-gray-500 dark:text-gray-500",children:new Date(e.createdAt.toDate()).toLocaleString()})]},e.id))})]})})]})},b=e=>{let{userId:t,showSentFormsModal:a,setSentFormsModal:s}=e,[o,c]=(0,l.useState)([]),[i,g]=(0,l.useState)(!0),[u,m]=(0,l.useState)(null);return((0,l.useEffect)(()=>{(async()=>{g(!0);try{let e=(0,d.hJ)(n.ZP,"messages"),a=(0,d.IO)(e,(0,d.ar)("userId","==",t)),r=(await (0,d.PL)(a)).docs.map(e=>({id:e.id,...e.data()}));c(r)}catch(e){m("Error fetching messages"),console.error(e)}finally{g(!1)}})()},[t]),i)?(0,r.jsx)("p",{children:"Loading..."}):u?(0,r.jsx)("p",{children:u}):(0,r.jsx)(r.Fragment,{children:a&&(0,r.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:(0,r.jsxs)("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg relative",children:[(0,r.jsx)("button",{className:"absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100",onClick:()=>s(!1),"aria-label":"Close",children:"\xd7"}),(0,r.jsxs)("div",{className:"p-4",children:[(0,r.jsx)("h2",{className:"text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100",children:"My Sent Forms"}),0===o.length?(0,r.jsx)("p",{className:"text-gray-500 dark:text-gray-400",children:"No sent forms found."}):(0,r.jsx)("ul",{className:"space-y-4",children:o.map(e=>(0,r.jsxs)("li",{className:"bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-md",children:[(0,r.jsxs)("p",{className:"text-gray-800 dark:text-gray-200",children:[(0,r.jsx)("strong",{className:"font-semibold",children:"Message:"})," ",e.message]}),(0,r.jsxs)("p",{className:"text-gray-800 dark:text-gray-200",children:[(0,r.jsx)("strong",{className:"font-semibold",children:"Status:"})," ",e.status]}),(0,r.jsxs)("p",{className:"text-gray-800 dark:text-gray-200",children:[(0,r.jsx)("strong",{className:"font-semibold",children:"Time:"})," ",new Date(1e3*e.createdAt.seconds).toLocaleString()]})]},e.id))})]})]})})})},h=e=>{let{userId:t,name:a,showContactModal:s,setShowContactModal:o}=e,[c,i]=(0,l.useState)({userId:t,name:a,message:""}),[g,u]=(0,l.useState)(null),m=e=>{i({...c,[e.target.name]:e.target.value})},x=async e=>{e.preventDefault();try{await (0,d.ET)((0,d.hJ)(n.ZP,"messages"),{...c,status:"pending",createdAt:new Date}),i({...c,message:""}),u("Form submitted successfully.")}catch(e){console.error("Error adding document: ",e),u("Error submitting form. Please try again.")}};return(0,r.jsx)(r.Fragment,{children:s&&(0,r.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:(0,r.jsxs)("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative",children:[(0,r.jsx)("button",{className:"absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100",onClick:()=>o(!1),"aria-label":"Close",children:"\xd7"}),(0,r.jsx)("div",{className:"p-4",children:(0,r.jsxs)("form",{onSubmit:x,children:[(0,r.jsx)("h2",{className:"text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100",children:"Contact Admins"}),(0,r.jsxs)("div",{className:"mb-4",children:[(0,r.jsx)("label",{htmlFor:"id",className:"block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400",children:"ID"}),(0,r.jsx)("input",{type:"text",id:"id",name:"userId",className:"py-2 px-3 block w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500",value:c.userId,onChange:m,required:!0,disabled:!0})]}),(0,r.jsxs)("div",{className:"mb-4",children:[(0,r.jsx)("label",{htmlFor:"name",className:"block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400",children:"Name"}),(0,r.jsx)("input",{type:"text",id:"name",name:"name",className:"py-2 px-3 block w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500",value:c.name,onChange:m,required:!0,disabled:!0})]}),(0,r.jsxs)("div",{className:"mb-4",children:[(0,r.jsx)("label",{htmlFor:"message",className:"block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400",children:"Comment"}),(0,r.jsx)("textarea",{id:"message",name:"message",className:"py-2 px-3 block w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500",rows:"4",value:c.message,onChange:m,required:!0})]}),(0,r.jsx)("button",{type:"submit",className:"py-2 px-4 w-full bg-blue-600 dark:bg-blue-700 text-white dark:text-gray-200 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:bg-blue-700 dark:focus:bg-blue-600",children:"Submit"}),g&&(0,r.jsx)("p",{className:"mt-4 text-sm text-center text-gray-800 dark:text-gray-200",children:g})]})})]})})})},f=a(3458),p=(0,g.Z)(()=>{let e=(0,s.useRouter)(),[t,a]=(0,l.useState)(!1),[c,g]=(0,l.useState)(""),[u,m]=(0,l.useState)(""),[p,k]=(0,l.useState)(""),[w,j]=(0,l.useState)("15"),[N,v]=(0,l.useState)(""),[S,I]=(0,l.useState)("select"),[C,E]=(0,l.useState)([]),[P,D]=(0,l.useState)(null),[O,A]=(0,l.useState)(!1),[L,T]=(0,l.useState)(!1),[M,Z]=(0,l.useState)(null),[_,F]=(0,l.useState)(0),[B,J]=(0,l.useState)(""),[H,U]=(0,l.useState)(600),[z,W]=(0,l.useState)(!1),[q,R]=(0,l.useState)(!1),[G,Y]=(0,l.useState)(!1),K=(0,l.useCallback)(e=>{E(t=>[...t,{time:c,message:e}])},[c]),Q=(0,l.useCallback)(()=>(e.push("/"),600),[e]);(0,l.useEffect)(()=>{let e=localStorage.getItem("userName"),t=localStorage.getItem("userId");e&&m(e),t&&k(t),(async()=>{if(t){let e=(0,d.IO)((0,d.hJ)(n.ZP,"employee"),(0,d.ar)("id","==",t)),a=await (0,d.PL)(e);a.empty||("online"===a.docs[0].data().status?A(!0):A(!1))}})()},[p]),(0,l.useEffect)(()=>{let e=setInterval(()=>{let e=o.ou.now().setZone("America/Edmonton");g(e.toLocaleString(o.ou.DATETIME_FULL_WITH_SECONDS));let t=e.hour;t<12?J("morning"):t<18?J("afternoon"):J("evening")},1e3);return()=>{clearInterval(e)}},[p]),(0,l.useEffect)(()=>{if(H>0){let e=setInterval(()=>{U(e=>e<=1?Q():e-1)},1e3);return()=>clearInterval(e)}},[H]);let V=e=>{I(e.target.value),"select"===e.target.value?v(""):j("")},X=async()=>{try{localStorage.removeItem("userName"),localStorage.removeItem("userId"),e.push("/")}catch(e){console.error("Error during logout:",e)}};return(0,r.jsx)("div",{className:"dark:bg-gray-900",children:(0,r.jsxs)("div",{className:"container mx-auto dark:bg-gray-900",children:[(0,r.jsx)("title",{children:"MTG - Employee"}),(0,r.jsxs)("div",{className:"bg-white min-w-full dark:bg-gray-900 p-4 shadow-lg",children:[(0,r.jsxs)("div",{className:"bg-white min-w-full dark:bg-gray-900 p-4 shadow-lg",children:[(0,r.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,r.jsx)("a",{href:"#",className:"text-red-600 dark:text-red-400 hover:underline text-xs sm:text-sm md:text-base",onClick:X,children:"Log Out"}),(0,r.jsx)("div",{className:"text-center flex-grow",children:(0,r.jsxs)("h1",{className:"text-xl font-bold mb-1 text-gray-900 dark:text-gray-100",children:["Good ",B,", ",u]})})]}),(0,r.jsxs)("div",{className:"text-sm md:text-base lg:text-lg xl:text-xl bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md text-center md:text-left lg:text-center",children:[(0,r.jsxs)("p",{className:"text-gray-900 dark:text-gray-100",children:["Current Time:"," ",(0,r.jsx)("span",{className:"font-semibold",children:c})]}),(0,r.jsxs)("p",{className:"text-gray-900 dark:text-gray-100",children:["Auto Logout In:"," ",(0,r.jsxs)("span",{className:"font-semibold text-blue-600 dark:text-blue-400",children:[Math.floor(H/60),":",String(H%60).padStart(2,"0")]})]})]})]}),(0,r.jsxs)("div",{className:"flex flex-col md:flex-row md:space-x-4 mt-4",children:[(0,r.jsx)("div",{className:"w-full md:w-2/3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg",children:(0,r.jsx)(y,{})}),(0,r.jsxs)("div",{className:"w-full md:w-1/3 flex flex-col space-y-4",children:[(0,r.jsx)("div",{className:"space-y-2",children:O?(0,r.jsx)("button",{className:"w-full h-full py-10 text-4xl px-4 rounded-full ".concat(O?"bg-red-600 text-white":"bg-gray-400 dark:bg-gray-600 cursor-not-allowed"),onClick:()=>(0,f.hq)(p,A,F,K,M,_,L,P,T),disabled:!O,children:"Clock Out"}):(0,r.jsx)("button",{className:"w-full h-full py-10 text-4xl px-4 rounded-full ".concat(O?"bg-gray-400 dark:bg-gray-600 cursor-not-allowed":"bg-green-600 text-white"),onClick:()=>(0,f.el)(p,Z,A,K,a),disabled:O,children:"Clock In"})}),(0,r.jsx)("div",{className:"p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto",children:(0,r.jsxs)("div",{className:"flex flex-col md:flex-row gap-4 mb-4 flex-wrap",children:[(0,r.jsxs)("div",{className:"flex items-center gap-2 flex-1 min-w-[150px]",children:[(0,r.jsx)("input",{type:"radio",name:"breakOption",value:"select",checked:"select"===S,onChange:V,disabled:!O,className:"form-radio text-blue-500 dark:text-blue-400"}),(0,r.jsxs)("select",{className:"p-2 border rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ".concat("select"===S&&O?"":"bg-gray-200 dark:bg-gray-800"),value:w,onChange:e=>{j(e.target.value),I("select")},disabled:"select"!==S||!O,children:[(0,r.jsx)("option",{value:"15",children:"15 min"}),(0,r.jsx)("option",{value:"30",children:"30 min"}),(0,r.jsx)("option",{value:"45",children:"45 min"}),(0,r.jsx)("option",{value:"60",children:"60 min"})]})]}),(0,r.jsxs)("div",{className:"flex items-center gap-2 flex-1 min-w-[150px]",children:[(0,r.jsx)("input",{type:"radio",name:"breakOption",value:"custom",checked:"custom"===S,onChange:V,disabled:!O,className:"form-radio text-blue-500 dark:text-blue-400"}),(0,r.jsx)("input",{type:"number",className:"p-2 border rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ".concat("custom"===S&&O?"":"bg-gray-200 dark:bg-gray-800"),placeholder:"Custom",value:N,onChange:e=>{v(e.target.value),I("custom")},disabled:"custom"!==S||!O,min:"1"})]}),(0,r.jsx)("button",{className:"flex-shrink-0 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ".concat(!O||L?"bg-gray-400 text-gray-700 cursor-not-allowed":""),onClick:()=>{let e="select"===S?w:N;if(""===e||0===parseInt(e)){alert("Break duration must be greater than 0 and not empty.");return}(0,f.pM)(p,T,D,e,K)},disabled:!O||L,children:"Start Break"})]})})]})]}),(0,r.jsx)("div",{className:"flex flex-col space-y-2 mt-4",children:(0,r.jsxs)("div",{className:"flex flex-row gap-4",children:[(0,r.jsx)("button",{className:"w-full py-2 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded",onClick:()=>R(!0),children:"Contact Admins"}),(0,r.jsx)("button",{className:"w-full py-2 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded",onClick:()=>Y(!0),children:"View Sent Contact Forms"}),(0,r.jsx)("button",{className:"w-full py-2 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded",onClick:()=>W(!0),children:"Change Password"})]})}),(0,r.jsx)(i,{employeeId:p}),C.length>0&&(0,r.jsx)("div",{className:"mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg",children:(0,r.jsxs)("table",{className:"w-full text-left text-gray-900 dark:text-gray-100",children:[(0,r.jsx)("thead",{children:(0,r.jsxs)("tr",{className:"border-b dark:border-gray-700",children:[(0,r.jsx)("th",{className:"py-2 px-4",children:"Time"}),(0,r.jsx)("th",{className:"py-2 px-4",children:"Message"})]})}),(0,r.jsx)("tbody",{children:C.map((e,t)=>(0,r.jsxs)("tr",{className:"border-b dark:border-gray-700",children:[(0,r.jsx)("td",{className:"py-2 px-4",children:e.time}),(0,r.jsx)("td",{className:"py-2 px-4",children:e.message})]},t))})]})})]}),t&&(0,r.jsx)("div",{className:"fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50",children:(0,r.jsxs)("div",{className:"text-white text-lg",children:[(0,r.jsxs)("svg",{className:"animate-spin h-8 w-8 mx-auto",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:[(0,r.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,r.jsx)("path",{className:"opacity-75",fill:"none",d:"M4 12a8 8 0 0116 0"})]}),(0,r.jsx)("p",{className:"mt-2",children:"Checking Location"})]})}),(0,r.jsx)(x,{userId:p,showPasswordModal:z,setShowPasswordModal:W}),(0,r.jsx)(h,{userId:p,name:u,showContactModal:q,setShowContactModal:R}),(0,r.jsx)(b,{userId:p,showSentFormsModal:G,setSentFormsModal:Y})]})})})},3458:function(e,t,a){"use strict";a.d(t,{el:function(){return g},hq:function(){return u},pM:function(){return m},x$:function(){return i}});var r=a(9842),s=a(9450),l=a(5344),o=a(5871),d=a(5494);let n=()=>new Promise((e,t)=>{navigator.geolocation.getCurrentPosition(e,t,{enableHighAccuracy:!0,timeout:5e3,maximumAge:6e4})}),c=async e=>{try{let t=(0,r.IO)((0,r.hJ)(l.ZP,"employee"),(0,r.ar)("id","==",e)),a=await (0,r.PL)(t);if(a.empty)return console.error("No user found with the given ID"),!1;let s=a.docs[0].data().geofence;if("None"==s)return!0;if(!s)return console.error("No geofence location ID found for the user"),!1;let c=(0,r.JU)(l.ZP,"geofence",s),i=await (0,r.QT)(c);if(!i.exists())return console.error("No geofence document found"),!1;let g=i.data().geopoint;if(!g||!g.latitude||!g.longitude)return console.error("Invalid geofence location data"),!1;let u=await n(),m=[u.coords.longitude,u.coords.latitude],x=(0,o.xm)(m),y=(0,o.xm)([g.longitude,g.latitude]);return 5>=(0,d.T)(y,x,{units:"kilometers"})}catch(e){return console.error("Error validating location:",e),!1}},i=async(e,t)=>{let a=(0,r.IO)((0,r.hJ)(l.ZP,"employee"),(0,r.ar)("id","==",e)),o=await (0,r.PL)(a);if(!o.empty){let e=o.docs[0],a=(0,r.JU)(l.ZP,"employee",e.id),d=e.data();if("online"===d.status){let e=s.ou.now().setZone("America/Edmonton"),l=e.toISODate(),o=d.workTime[l];if(!o){console.log("No clock-in entry found for today.");return}let n=s.ou.fromISO(o.split(" - ")[0],{zone:"America/Edmonton"}),c=d.totalBreakDuration||0,i=Math.round(e.diff(n,"minutes").minutes-c);i<0&&(i=0),t(i);let g=d.workPeriod[l]||0,u={...d.workPeriod,[l]:g+i};await (0,r.r7)(a,{workDurationToday:i,workPeriod:u}),console.log("Work duration updated successfully.")}}},g=async(e,t,a,o,d)=>{if(d(!0),!await c(e)){d(!1),alert("You are not within the allowed location to clock in.");return}d(!1);let n=(0,r.IO)((0,r.hJ)(l.ZP,"employee"),(0,r.ar)("id","==",e));try{let d=await (0,r.PL)(n);if(d.empty)console.log("User document does not exist for ID: ".concat(e));else{let e=d.docs[0],n=(0,r.JU)(l.ZP,"employee",e.id),c=e.data(),i=s.ou.now().setZone("America/Edmonton"),g=i.weekdayLong,u=c.workHours[g];if(" - "===u){alert("Today is a day off, you cannot clock in.");return}let[m,x]=u.split(" - "),y=s.ou.fromISO(m,{zone:"America/Edmonton"}).minus({minutes:30}),b=s.ou.fromISO(x,{zone:"America/Edmonton"}).plus({minutes:30});if(i<y||i>b){alert("It is not within the allowed clock-in time range.");return}a(!0),t(i),o("Clocked In at ".concat(i.toLocaleString(s.ou.DATETIME_FULL_WITH_SECONDS)));let h=i.toISODate(),f={...c.workTime,[h]:i.toFormat("HH:mm")};await (0,r.r7)(n,{status:"online",workTime:f,totalBreakDuration:0,isOnBreak:!1})}}catch(e){console.error("Error clocking in:",e)}},u=async(e,t,a,o,d)=>{t(!1);let n=s.ou.now().setZone("America/Edmonton");a("Clocked Out at ".concat(n.toLocaleString(s.ou.DATETIME_FULL_WITH_SECONDS)));let c=(0,r.IO)((0,r.hJ)(l.ZP,"employee"),(0,r.ar)("id","==",e));try{let t=await (0,r.PL)(c);if(t.empty)console.log("User document does not exist for ID: ".concat(e));else{let e=t.docs[0],a=(0,r.JU)(l.ZP,"employee",e.id),c=e.data(),i=n.toISODate(),g=c.workTime[i];if(!g){console.log("No clock-in entry found for today.");return}let u=s.ou.fromISO(g,{zone:"America/Edmonton"}),m=Math.round(n.diff(u,"minutes").minutes-(c.totalBreakDuration||0));m<0&&(m=0);let x=c.workPeriod[i]||0;m+=x;let y={...c.workPeriod,[i]:m},b={...c.workTime,[i]:"".concat(g," - ").concat(n.toFormat("HH:mm"))};if(await (0,r.r7)(a,{status:"offline",lastOnlineDate:i,isOnBreak:!1,workDurationToday:m,workPeriod:y,workTime:b}),n.startOf("day")>u.startOf("day")){let e=n.plus({days:1}).toISODate(),t=c.workPeriod[e]||0;await (0,r.r7)(a,{workPeriod:{...c.workPeriod,[e]:t+m}})}console.log("User status set to offline and work duration updated."),o(m),d(!1)}}catch(e){console.error("Error clocking out:",e)}},m=async(e,t,a,o,d)=>{t(!0),d("Break started at ".concat(s.ou.now().setZone("America/Edmonton").toLocaleString(s.ou.DATETIME_FULL_WITH_SECONDS)));let n=(0,r.IO)((0,r.hJ)(l.ZP,"employee"),(0,r.ar)("id","==",e)),c=await (0,r.PL)(n);if(!c.empty){let e=c.docs[0],n=(0,r.JU)(l.ZP,"employee",e.id),i=(e.data().totalBreakDuration||0)+parseInt(o);await (0,r.r7)(n,{isOnBreak:!0,totalBreakDuration:i}),a(setTimeout(async()=>{t(!1),d("Break ended at ".concat(s.ou.now().setZone("America/Edmonton").toLocaleString(s.ou.DATETIME_FULL_WITH_SECONDS))),await (0,r.r7)(n,{isOnBreak:!1}),a(null)},6e4*o))}}},5344:function(e,t,a){"use strict";var r=a(5236),s=a(9842),l=a(9854),o=a(5735);let d=(0,r.ZF)({apiKey:"AIzaSyB5__zMeXEsk4RxME0Fg46Sz7AhqZzA9qE",authDomain:"mtg-quickyclock.firebaseapp.com",projectId:"mtg-quickyclock",storageBucket:"mtg-quickyclock.appspot.com",messagingSenderId:"865821745601",appId:"1:865821745601:web:b01221defd23ac3d338f40"}),n=(0,s.ad)(d);(0,l.cF)(d),(0,o.v0)(d),t.ZP=n},8370:function(e,t,a){"use strict";var r=a(7437),s=a(6463),l=a(2265);t.Z=e=>{let t=t=>{let a=(0,s.useRouter)();return(0,l.useEffect)(()=>{{let e=localStorage.getItem("userName"),t=localStorage.getItem("adminName");e||t||a.push("/")}},[a]),(0,r.jsx)(e,{...t})};return t.displayName="withAuth(".concat(e.displayName||e.name||"Component",")"),t}}},function(e){e.O(0,[358,208,218,379,813,971,23,744],function(){return e(e.s=6611)}),_N_E=e.O()}]);