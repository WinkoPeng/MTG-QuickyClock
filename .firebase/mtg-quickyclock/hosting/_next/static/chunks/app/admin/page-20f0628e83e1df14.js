(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3],{67:function(){},2061:function(){},9555:function(e,a,s){Promise.resolve().then(s.bind(s,2161))},2161:function(e,a,s){"use strict";s.r(a),s.d(a,{default:function(){return w}});var r=s(7437),t=s(2265),n=s(6463),o=s(8370),l=s(3537),i=s.n(l),d=s(9842),u=s(5344);function c(){let[e,a]=(0,t.useState)({id:"",password:"",name:"",class:"employee",title:"Administrative Officer",gender:"male",email:"",cell:"",address:"",workHours:{Monday:{start:"",end:""},Tuesday:{start:"",end:""},Wednesday:{start:"",end:""},Thursday:{start:"",end:""},Friday:{start:"",end:""},Saturday:{start:"",end:""},Sunday:{start:"",end:""}},workPeriod:[]}),s=e=>{let{name:s,value:r}=e.target;if(s.includes(".start")||s.includes(".end")){let[e,t]=s.split(".");a(a=>({...a,workHours:{...a.workHours,[e]:{...a.workHours[e],[t]:r}}}))}else a(e=>({...e,[s]:r}))},n=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e).toLowerCase()),o=()=>{for(let a in e.workHours){let s=e.workHours[a].start,r=e.workHours[a].end;if(s&&r&&new Date("1970-01-01T".concat(r))<new Date("1970-01-01T".concat(s)))return alert("".concat(a,": End time cannot be earlier than start time.")),!1}return!0},l=async()=>{let a=(0,d.IO)((0,d.hJ)(u.Z,"employee"),(0,d.ar)("id","==",e.id)),s=(0,d.IO)((0,d.hJ)(u.Z,"employee"),(0,d.ar)("email","==",e.email)),r=await (0,d.PL)(a),t=await (0,d.PL)(s);return r.empty?!!t.empty||(alert("Email already exists"),!1):(alert("Employee ID already exists"),!1)},c=async s=>{if(s.preventDefault(),o()){if(!n(e.email)){alert("Invalid email format");return}if(await l())try{let s=Object.keys(e.workHours).reduce((a,s)=>(a[s]="".concat(e.workHours[s].start," - ").concat(e.workHours[s].end),a),{});await (0,d.ET)((0,d.hJ)(u.Z,"employee"),{...e,workHours:s}),alert("Employee added successfully!"),a({id:"",password:"",name:"",class:"employee",title:"Administrative Officer",gender:"male",email:"",cell:"",address:"",workHours:{Monday:{start:"",end:""},Tuesday:{start:"",end:""},Wednesday:{start:"",end:""},Thursday:{start:"",end:""},Friday:{start:"",end:""},Saturday:{start:"",end:""},Sunday:{start:"",end:""}},workPeriod:[]})}catch(e){console.error("Error adding document: ",e),alert("Error adding employee.")}}};return(0,r.jsxs)("div",{className:i().register,children:[(0,r.jsx)("h2",{children:"Register Employee"}),(0,r.jsxs)("form",{onSubmit:c,children:[(0,r.jsx)("input",{type:"text",name:"id",placeholder:"ID",value:e.id,onChange:s,required:!0,className:i().input}),(0,r.jsx)("input",{type:"password",name:"password",placeholder:"Password",value:e.password,onChange:s,required:!0,className:i().input}),(0,r.jsx)("input",{type:"text",name:"name",placeholder:"Name",value:e.name,onChange:s,required:!0,className:i().input}),(0,r.jsxs)("select",{name:"class",value:e.class,onChange:s,required:!0,className:i().input,children:[(0,r.jsx)("option",{value:"employee",children:"Employee"}),(0,r.jsx)("option",{value:"admin",children:"Admin"})]}),(0,r.jsxs)("select",{name:"title",value:e.title,onChange:s,required:!0,className:i().input,children:[(0,r.jsx)("option",{value:"Administrative Officer",children:"Administrative Officer"}),(0,r.jsx)("option",{value:"Program Coordinator",children:"Program Coordinator"}),(0,r.jsx)("option",{value:"Instructor",children:"Instructor"}),(0,r.jsx)("option",{value:"Receptionist",children:"Receptionist"})]}),(0,r.jsxs)("select",{name:"gender",value:e.gender,onChange:s,required:!0,className:i().input,children:[(0,r.jsx)("option",{value:"male",children:"Male"}),(0,r.jsx)("option",{value:"female",children:"Female"})]}),(0,r.jsx)("input",{type:"email",name:"email",placeholder:"Email",value:e.email,onChange:s,required:!0,className:i().input}),(0,r.jsx)("input",{type:"text",name:"cell",placeholder:"Cell",value:e.cell,onChange:s,required:!0,className:i().input}),(0,r.jsx)("input",{type:"text",name:"address",placeholder:"Address",value:e.address,onChange:s,required:!0,className:i().input}),(0,r.jsxs)("div",{className:i().workHours,children:[(0,r.jsx)("h3",{children:"Work Hours"}),Object.keys(e.workHours).map(a=>(0,r.jsxs)("div",{className:i().workHoursRow,children:[(0,r.jsx)("label",{children:a}),(0,r.jsx)("input",{type:"time",name:"".concat(a,".start"),value:e.workHours[a].start,onChange:s,className:i().inputWorkHours}),(0,r.jsx)("span",{children:"to"}),(0,r.jsx)("input",{type:"time",name:"".concat(a,".end"),value:e.workHours[a].end,onChange:s,className:i().inputWorkHours})]},a))]}),(0,r.jsx)("button",{type:"submit",className:i().button,children:"Register"})]})]})}var m=s(7170),h=s(7800),p=s(9450),x=function(e){let{onEdit:a}=e,[s,n]=(0,t.useState)([]),[o,l]=(0,t.useState)(""),[c,x]=(0,t.useState)("all"),[j,y]=(0,t.useState)(""),[k,_]=(0,t.useState)(""),v=(0,t.useCallback)(async()=>{n((await (0,d.PL)((0,d.hJ)(u.Z,"employee"))).docs.map(e=>({id:e.id,...e.data()})))},[]);(0,t.useEffect)(()=>{v()},[v]);let w=e=>{let a=(e/60).toFixed(1);return"".concat(a,"h")},g=p.ou.now().setZone("America/Edmonton").toFormat("cccc"),f=s.filter(e=>{let a=""===o||Object.values(e).some(e=>e.toString().toLowerCase().includes(o)),s="online"===e.status;e.workDurationToday;let r=e.workHours&&" - "!==e.workHours[g],t="all"===c||"online"===c&&s||"workingToday"===c&&r||"offToday"===c&&!r;return a&&t}),N=(()=>{let e=[];for(let a=6;a>=0;a--)e.push(p.ou.now().minus({days:a}).toISODate());return e})();return(0,r.jsxs)("div",{className:i().content,children:[(0,r.jsxs)("div",{className:i().searchBar,children:[(0,r.jsx)("input",{type:"text",placeholder:"Search employees...",value:o,onChange:e=>{l(e.target.value.toLowerCase())},className:i().input}),(0,r.jsxs)("select",{value:c,onChange:e=>{x(e.target.value)},className:i().input,children:[(0,r.jsx)("option",{value:"all",children:"Show All"}),(0,r.jsx)("option",{value:"online",children:"Online Only"}),(0,r.jsx)("option",{value:"workingToday",children:"Working Today"}),(0,r.jsx)("option",{value:"offToday",children:"Off Today"})]}),(0,r.jsx)("input",{type:"date",value:j,onChange:e=>{y(e.target.value)},className:i().input}),(0,r.jsx)("input",{type:"date",value:k,onChange:e=>{_(e.target.value)},className:i().input}),(0,r.jsx)("button",{onClick:()=>{if(!j||!k||p.ou.fromISO(j)>p.ou.fromISO(k)){alert("Please select a valid start and end date.");return}let e=p.ou.fromISO(j).startOf("day"),a=p.ou.fromISO(k).endOf("day"),r=[];for(let s=e;s<=a;s=s.plus({days:1}))r.push(s.toISODate());let t=s.map(e=>{let a=e.workPeriod||{},s=e.workTime||{},t=r.map(e=>{let r=s[e]?s[e]:"N/A",t=a[e]?a[e]:0;return{date:e,workEntry:r,duration:t}}),n=w(t.reduce((e,a)=>{let{duration:s}=a;return e+s},0));return{ID:e.id,Name:e.name,dailyDurations:t,Total:n}}),n=[["ID","Name",...r,"Total"]];t.forEach(e=>{let a=[e.ID,e.Name],s=["",""],r=["",""];e.dailyDurations.forEach(e=>{let{date:t,workEntry:n,duration:o}=e;a.push(t),s.push(n),r.push(w(o))}),a.push(""),s.push(""),r.push(e.Total),n.push(a),n.push(s),n.push(r),n.push([])});let o=h.P6.aoa_to_sheet(n),l=[{wpx:50},{wpx:110},...r.map(()=>({wpx:150})),{wpx:100}];o["!cols"]=l;let i=h.P6.book_new();h.P6.book_append_sheet(i,o,"Employees");let d=new Blob([h.cW(i,{bookType:"xlsx",type:"array"})],{type:"application/octet-stream"});(0,m.saveAs)(d,"employees.xlsx")},className:i().exportButton,children:"Export Employee List"})]}),(0,r.jsx)("div",{className:i().employeeList,children:f.map(e=>(0,r.jsxs)("div",{className:i().employeeCard,children:[(0,r.jsxs)("h3",{children:[e.name," - ",e.title]}),(0,r.jsxs)("p",{children:["Status: ",(0,r.jsx)("span",{style:{color:"online"===e.status?"green":"grey",fontWeight:"bold"},children:"online"===e.status?"Online":"Offline"})]}),(0,r.jsxs)("p",{children:["Today's Work Hours: ",w(e.workDurationToday)]}),(0,r.jsxs)("p",{children:["This Month's Work Hours: ",w(e.thisMonthWorkDuration||0)]}),(0,r.jsx)("button",{onClick:()=>a(e),className:i().button,children:"Edit"})]},e.id))}),(0,r.jsx)("div",{className:i().tableContainer,children:(0,r.jsxs)("table",{className:i().workTable,children:[(0,r.jsx)("thead",{children:(0,r.jsxs)("tr",{children:[(0,r.jsx)("th",{children:"ID"}),(0,r.jsx)("th",{children:"Name"}),(0,r.jsx)("th",{children:"Title"}),N.map(e=>(0,r.jsx)("th",{children:e},e)),(0,r.jsx)("th",{children:"Total"})]})}),(0,r.jsx)("tbody",{children:f.map(e=>{let a=N.reduce((a,s)=>a+(e.workPeriod&&e.workPeriod[s]||0),0);return(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:e.id}),(0,r.jsx)("td",{children:e.name}),(0,r.jsx)("td",{children:e.title}),N.map(a=>(0,r.jsx)("td",{children:w(e.workPeriod&&e.workPeriod[a]||0)},a)),(0,r.jsx)("td",{children:w(a)})]},e.id)})})]})})]})},j=s(7346);s(433);var y=s(6140),k=s.n(y),_=function(){let[e,a]=(0,t.useState)([]),[s,n]=(0,t.useState)([]),[o,l]=(0,t.useState)(""),[i,c]=(0,t.useState)(0),[m,h]=(0,t.useState)([]),[x,y]=(0,t.useState)(0),[_,v]=(0,t.useState)(0),[w,g]=(0,t.useState)({hours:0,minutes:0}),[f,N]=(0,t.useState)([]),[b,D]=(0,t.useState)(null),W=(0,t.useCallback)(async()=>{let e=(await (0,d.PL)((0,d.hJ)(u.Z,"employee"))).docs.map(e=>e.data()),s=p.ou.now(),r=s.minus({days:6}).startOf("day"),t=s.endOf("day"),o=[];for(let e=r;e<=t;e=e.plus({days:1}))o.push(e.toFormat("yyyy-MM-dd"));let l=e.filter(e=>{let a=e.workHours&&e.workHours[s.weekdayLong];return a&&" - "!==a}),i=l.filter(e=>"online"===e.status),m=e.reduce((e,a)=>e+(a.workDurationToday||0),0)/e.length,x=s.month;e.map(e=>{let a=e.workPeriod||{},s=Object.keys(a).reduce((e,s)=>(p.ou.fromISO(s).month===x&&(e+=a[s]),e),0);return{name:e.name,monthlyWorkHours:s}});let j=e.map(e=>{let a=e.workPeriod||{},s=o.map(e=>a[e]||0);return{name:e.name,workHours:s}});a(e),n(e),c(l.length),h(l),y(i.length),v(e.length),g({hours:Math.floor(m/60),minutes:Math.floor(m%60)}),N(j)},[]);(0,t.useEffect)(()=>{W()},[W]);let C={labels:Array.from({length:7},(e,a)=>p.ou.now().minus({days:6-a}).toFormat("yyyy-MM-dd")),datasets:b?[{label:b.name,data:b.workHours,fill:!0,borderColor:"#4caf50",backgroundColor:"rgba(76, 175, 80, 0.2)"}]:[]},T={labels:Array.from({length:7},(e,a)=>p.ou.now().minus({days:6-a}).toFormat("yyyy-MM-dd")),datasets:[{label:"Average Weekly Work Hours",data:f.reduce((e,a)=>(a.workHours.forEach((a,s)=>{e[s]=(e[s]||0)+a}),e),[]).map(e=>e/f.length/60),backgroundColor:"#007bff"}]},H=e=>{D(f.find(a=>a.name===e.name))};return(0,r.jsxs)("div",{className:k().dashboard,children:[(0,r.jsxs)("div",{className:k().cardsContainer,children:[(0,r.jsxs)("div",{className:"".concat(k().card," ").concat(k().cardPrimary),children:[(0,r.jsx)("h3",{children:"Today's Work Count"}),(0,r.jsxs)("p",{children:[i,"/",_]})]}),(0,r.jsxs)("div",{className:"".concat(k().card," ").concat(k().cardWarning),children:[(0,r.jsx)("h3",{children:"Employees Working Today"}),(0,r.jsx)("ul",{className:k().employeeList,children:m.map((e,a)=>(0,r.jsx)("li",{className:k().employeeItem,children:e.name},a))})]}),(0,r.jsxs)("div",{className:"".concat(k().card," ").concat(k().cardSuccess),children:[(0,r.jsx)("h3",{children:"Real-time Online Count"}),(0,r.jsx)("p",{children:x})]}),(0,r.jsxs)("div",{className:"".concat(k().card," ").concat(k().cardDanger),children:[(0,r.jsx)("h3",{children:"Average Work Hours Today"}),(0,r.jsxs)("p",{children:[w.hours," hours ",w.minutes," mins"]})]})]}),(0,r.jsxs)("div",{className:k().chartContainer,children:[(0,r.jsxs)("div",{className:k().chart,children:[(0,r.jsx)("h3",{children:"Weekly Work Hours"}),(0,r.jsx)("div",{className:k().employeeTags,children:f.map((e,a)=>(0,r.jsx)("span",{className:"".concat(k().employeeTag," ").concat((null==b?void 0:b.name)===e.name?k().selectedTag:""),onClick:()=>H(e),children:e.name},a))}),(0,r.jsx)(j.x1,{data:C,options:{plugins:{legend:{display:!1}}}})]}),(0,r.jsxs)("div",{className:k().chart,children:[(0,r.jsx)("h3",{children:"Average Weekly Work Hours"}),(0,r.jsx)(j.$Q,{data:T})]})]}),(0,r.jsxs)("div",{className:k().employeeTable,children:[(0,r.jsx)("input",{type:"text",placeholder:"Search by name or position",value:o,onChange:a=>{let s=a.target.value.toLowerCase();l(s),n(e.filter(e=>e.name.toLowerCase().includes(s)||e.title.toLowerCase().includes(s)))},className:k().searchBar}),(0,r.jsxs)("table",{children:[(0,r.jsx)("thead",{children:(0,r.jsxs)("tr",{children:[(0,r.jsx)("th",{children:"Name"}),(0,r.jsx)("th",{children:"Position"}),(0,r.jsx)("th",{children:"Status"}),(0,r.jsx)("th",{children:"Last Online"}),(0,r.jsx)("th",{children:"This Month's Work Hours"})]})}),(0,r.jsx)("tbody",{children:s.map((e,a)=>(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:e.name}),(0,r.jsx)("td",{children:e.title}),(0,r.jsx)("td",{children:e.status}),(0,r.jsx)("td",{children:e.lastOnlineDate}),(0,r.jsx)("td",{children:(e.totalWorkDuration/60).toFixed(2)})]},a))})]})]})]})},v=function(e){let{employee:a,onCancel:s}=e;(0,n.useRouter)();let[o,l]=(0,t.useState)({id:"",password:"",name:"",class:"employee",title:"Administrative Officer",gender:"male",email:"",cell:"",address:"",workHours:{Monday:{start:"",end:""},Tuesday:{start:"",end:""},Wednesday:{start:"",end:""},Thursday:{start:"",end:""},Friday:{start:"",end:""},Saturday:{start:"",end:""},Sunday:{start:"",end:""}},lastMonthWorkDuration:{hours:0,minutes:0},lastOnlineDate:"",thisMonthWorkDuration:{hours:0,minutes:0},twoWeeksWorkDuration:{hours:0,minutes:0},workDurationToday:{hours:0,minutes:0},totalWorkDuration:{hours:0,minutes:0}}),[c,m]=(0,t.useState)(""),[h,p]=(0,t.useState)({hours:0,minutes:0}),[x,j]=(0,t.useState)("");(0,t.useEffect)(()=>{if(a){let{lastMonthWorkDuration:e,thisMonthWorkDuration:s,twoWeeksWorkDuration:r,workDurationToday:t,totalWorkDuration:n,workHours:o,workPeriod:i,workTime:d,...u}=a;l({...u,workHours:_(o),lastMonthWorkDuration:y(e),thisMonthWorkDuration:y(s),twoWeeksWorkDuration:y(r),workDurationToday:y(t),totalWorkDuration:y(n)}),i&&c&&i[c]&&p(y(i[c])),d&&c&&d[c]?j(d[c]):j("")}},[a,c]);let y=e=>({hours:Math.floor(e/60),minutes:e%60}),k=e=>{let{hours:a,minutes:s}=e;return 60*(parseInt(a)||0)+(parseInt(s)||0)},_=e=>{let a={};return Object.keys(e).forEach(s=>{let[r,t]=e[s].split(" - ").map(e=>"-"===e?"":e);a[s]={start:r,end:t}}),a},v=e=>{let{name:a,value:s}=e.target;if(a.includes(".start")||a.includes(".end")){let[e,r]=a.split(".");l(a=>({...a,workHours:{...a.workHours,[e]:{...a.workHours[e],[r]:s}}}))}else if(a.includes(".hours")||a.includes(".minutes")){let[e,r]=a.split(".");"selectedDateWorkDuration"===e?p(e=>({...e,[r]:s})):l(a=>({...a,[e]:{...a[e],[r]:s}}))}else l(e=>({...e,[a]:s}))},w=async e=>{e.preventDefault();try{let e=(0,d.IO)((0,d.hJ)(u.Z,"employee"),(0,d.ar)("id","==",o.id)),r=await (0,d.PL)(e);if(r.empty){alert("Employee ID does not exist");return}let t=r.docs[0],n=(0,d.JU)(u.Z,"employee",t.id),l={...o,lastMonthWorkDuration:k(o.lastMonthWorkDuration),thisMonthWorkDuration:k(o.thisMonthWorkDuration),twoWeeksWorkDuration:k(o.twoWeeksWorkDuration),workDurationToday:k(o.workDurationToday),totalWorkDuration:k(o.totalWorkDuration),workHours:Object.keys(o.workHours).reduce((e,a)=>(e[a]="".concat(o.workHours[a].start," - ").concat(o.workHours[a].end)||"- -",e),{}),workPeriod:{...a.workPeriod,[c]:k(h)},workTime:{...a.workTime,[c]:x}};await (0,d.r7)(n,l),alert("Employee updated successfully!"),s()}catch(e){console.error("Error updating document: ",e),alert("Error updating employee.")}},g=async()=>{if(confirm("Are you sure you want to delete this employee?"))try{let e=(0,d.IO)((0,d.hJ)(u.Z,"employee"),(0,d.ar)("id","==",o.id)),a=await (0,d.PL)(e);if(a.empty){alert("Employee ID does not exist");return}let r=a.docs[0],t=(0,d.JU)(u.Z,"employee",r.id);await (0,d.oe)(t),alert("Employee deleted successfully!"),s()}catch(e){console.error("Error deleting document: ",e),alert("Error deleting employee.")}};return(0,r.jsxs)("div",{className:i().register,children:[(0,r.jsx)("h2",{className:i().editTitle,children:"Edit Employee"}),(0,r.jsxs)("form",{onSubmit:w,className:i().form,children:[(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"id",children:"ID"}),(0,r.jsx)("input",{type:"text",name:"id",placeholder:"ID",value:o.id,onChange:v,required:!0,className:i().input})]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"password",children:"Password"}),(0,r.jsx)("input",{type:"password",name:"password",placeholder:"Password",value:o.password,onChange:v,required:!0,className:i().input})]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"name",children:"Name"}),(0,r.jsx)("input",{type:"text",name:"name",placeholder:"Name",value:o.name,onChange:v,required:!0,className:i().input})]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"class",children:"Class"}),(0,r.jsxs)("select",{name:"class",value:o.class,onChange:v,required:!0,className:i().input,children:[(0,r.jsx)("option",{value:"employee",children:"Employee"}),(0,r.jsx)("option",{value:"admin",children:"Admin"})]})]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"title",children:"Title"}),(0,r.jsxs)("select",{name:"title",value:o.title,onChange:v,required:!0,className:i().input,children:[(0,r.jsx)("option",{value:"Administrative Officer",children:"Administrative Officer"}),(0,r.jsx)("option",{value:"Program Coordinator",children:"Program Coordinator"}),(0,r.jsx)("option",{value:"Instructor",children:"Instructor"}),(0,r.jsx)("option",{value:"Receptionist",children:"Receptionist"})]})]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"gender",children:"Gender"}),(0,r.jsxs)("select",{name:"gender",value:o.gender,onChange:v,required:!0,className:i().input,children:[(0,r.jsx)("option",{value:"male",children:"Male"}),(0,r.jsx)("option",{value:"female",children:"Female"})]})]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"email",children:"Email"}),(0,r.jsx)("input",{type:"email",name:"email",placeholder:"Email",value:o.email,onChange:v,required:!0,className:i().input})]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"cell",children:"Cell"}),(0,r.jsx)("input",{type:"text",name:"cell",placeholder:"Cell",value:o.cell,onChange:v,required:!0,className:i().input})]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"address",children:"Address"}),(0,r.jsx)("input",{type:"text",name:"address",placeholder:"Address",value:o.address,onChange:v,required:!0,className:i().input})]}),(0,r.jsxs)("div",{className:i().workHours,children:[(0,r.jsx)("h3",{children:"Work Hours"}),Object.keys(o.workHours).map(e=>(0,r.jsxs)("div",{className:i().workHoursRow,children:[(0,r.jsx)("label",{children:e}),(0,r.jsx)("input",{type:"time",name:"".concat(e,".start"),value:o.workHours[e].start,onChange:v,className:i().inputWorkHours}),(0,r.jsx)("span",{children:"to"}),(0,r.jsx)("input",{type:"time",name:"".concat(e,".end"),value:o.workHours[e].end,onChange:v,className:i().inputWorkHours})]},e))]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"selectedDateWorkDuration.hours",children:"Work Duration for Selected Date"}),(0,r.jsxs)("div",{className:i().durationFields,children:[(0,r.jsx)("input",{type:"date",name:"selectedDate",placeholder:"Selected Date",value:c,onChange:e=>{m(e.target.value),a.workPeriod&&a.workPeriod[e.target.value]?p(y(a.workPeriod[e.target.value])):p({hours:0,minutes:0}),a.workTime&&a.workTime[e.target.value]?j(a.workTime[e.target.value]):j("")},className:i().input}),(0,r.jsx)("input",{type:"number",name:"selectedDateWorkDuration.hours",placeholder:"Hours",value:h.hours,onChange:v,className:i().inputTime}),(0,r.jsx)("span",{children:"hours"}),(0,r.jsx)("input",{type:"number",name:"selectedDateWorkDuration.minutes",placeholder:"Minutes",value:h.minutes,onChange:v,className:i().inputTime}),(0,r.jsx)("span",{children:"mins"})]})]}),(0,r.jsx)("div",{className:i().formGroup,children:(0,r.jsxs)("div",{className:i().durationFields,children:[(0,r.jsx)("label",{htmlFor:"selectedDateWorkTime",children:"Start Time - End Time"}),(0,r.jsx)("input",{type:"text",name:"selectedDateWorkTime",placeholder:"Start time & End time",value:x,onChange:e=>{j(e.target.value)},className:i().input})]})}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"lastOnlineDate",children:"Last Online Date"}),(0,r.jsx)("input",{type:"date",name:"lastOnlineDate",placeholder:"Last Online Date",value:o.lastOnlineDate,onChange:v,className:i().input})]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"lastMonthWorkDuration.hours",children:"Last Month Work Duration"}),(0,r.jsxs)("div",{className:i().durationFields,children:[(0,r.jsx)("input",{type:"number",name:"lastMonthWorkDuration.hours",placeholder:"Hours",value:o.lastMonthWorkDuration.hours,onChange:v,className:i().input}),(0,r.jsx)("span",{children:"hours"}),(0,r.jsx)("input",{type:"number",name:"lastMonthWorkDuration.minutes",placeholder:"Minutes",value:o.lastMonthWorkDuration.minutes,onChange:v,className:i().input}),(0,r.jsx)("span",{children:"mins"})]})]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"thisMonthWorkDuration.hours",children:"This Month Work Duration"}),(0,r.jsxs)("div",{className:i().durationFields,children:[(0,r.jsx)("input",{type:"number",name:"thisMonthWorkDuration.hours",placeholder:"Hours",value:o.thisMonthWorkDuration.hours,onChange:v,className:i().input}),(0,r.jsx)("span",{children:"hours"}),(0,r.jsx)("input",{type:"number",name:"thisMonthWorkDuration.minutes",placeholder:"Minutes",value:o.thisMonthWorkDuration.minutes,onChange:v,className:i().input}),(0,r.jsx)("span",{children:"mins"})]})]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"twoWeeksWorkDuration.hours",children:"Two Weeks Work Duration"}),(0,r.jsxs)("div",{className:i().durationFields,children:[(0,r.jsx)("input",{type:"number",name:"twoWeeksWorkDuration.hours",placeholder:"Hours",value:o.twoWeeksWorkDuration.hours,onChange:v,className:i().input}),(0,r.jsx)("span",{children:"hours"}),(0,r.jsx)("input",{type:"number",name:"twoWeeksWorkDuration.minutes",placeholder:"Minutes",value:o.twoWeeksWorkDuration.minutes,onChange:v,className:i().input}),(0,r.jsx)("span",{children:"mins"})]})]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"workDurationToday.hours",children:"Work Duration Today"}),(0,r.jsxs)("div",{className:i().durationFields,children:[(0,r.jsx)("input",{type:"number",name:"workDurationToday.hours",placeholder:"Hours",value:o.workDurationToday.hours,onChange:v,className:i().input}),(0,r.jsx)("span",{children:"hours"}),(0,r.jsx)("input",{type:"number",name:"workDurationToday.minutes",placeholder:"Minutes",value:o.workDurationToday.minutes,onChange:v,className:i().input}),(0,r.jsx)("span",{children:"mins"})]})]}),(0,r.jsxs)("div",{className:i().formGroup,children:[(0,r.jsx)("label",{htmlFor:"totalWorkDuration.hours",children:"Total Work Duration"}),(0,r.jsxs)("div",{className:i().durationFields,children:[(0,r.jsx)("input",{type:"number",name:"totalWorkDuration.hours",placeholder:"Hours",value:o.totalWorkDuration.hours,onChange:v,className:i().input}),(0,r.jsx)("span",{children:"hours"}),(0,r.jsx)("input",{type:"number",name:"totalWorkDuration.minutes",placeholder:"Minutes",value:o.totalWorkDuration.minutes,onChange:v,className:i().input}),(0,r.jsx)("span",{children:"mins"})]})]}),(0,r.jsxs)("div",{className:i().buttonGroup,children:[(0,r.jsx)("button",{type:"submit",className:i().saveButton,children:"Save"}),(0,r.jsx)("button",{type:"button",onClick:s,className:i().cancelButton,children:"Cancel"}),(0,r.jsx)("button",{type:"button",onClick:g,className:i().cancelButton,children:"Delete"})]})]})]})},w=(0,o.Z)(function(){let[e,a]=(0,t.useState)("Dashboard"),[s,o]=(0,t.useState)(""),[l,d]=(0,t.useState)(null),u=(0,n.useRouter)();return(0,t.useEffect)(()=>{let e=localStorage.getItem("adminName");e&&o(e)},[]),(0,r.jsxs)("div",{className:i().container,children:[(0,r.jsx)("title",{children:"MTG - Admin"}),(0,r.jsxs)("div",{className:i().sidebar,children:[(0,r.jsxs)("div",{className:i().welcome,children:[(0,r.jsx)("h3",{children:"Welcome,"}),(0,r.jsx)("h2",{children:s})]}),(0,r.jsxs)("div",{className:i().menu,children:[(0,r.jsx)("div",{className:i().sidebarItem,onClick:()=>a("Dashboard"),children:"Dashboard"}),(0,r.jsx)("div",{className:i().sidebarItem,onClick:()=>a("Employee List"),children:"Employee List"}),(0,r.jsx)("div",{className:i().sidebarItem,onClick:()=>a("Register"),children:"Register"})]}),(0,r.jsx)("div",{className:i().logout,children:(0,r.jsx)("button",{onClick:()=>{localStorage.removeItem("adminName"),u.push("/")},children:"Logout"})})]}),(0,r.jsxs)("div",{className:i().main,children:[(0,r.jsx)("div",{className:i().dashboardHeader,children:(0,r.jsx)("h1",{children:"Admin"})}),(()=>{switch(e){case"Dashboard":default:return(0,r.jsx)(_,{});case"Employee List":return(0,r.jsx)(x,{onEdit:e=>{d(e),a("Edit")}});case"Register":return(0,r.jsx)(c,{});case"Edit":return(0,r.jsx)(v,{employee:l,onCancel:()=>a("Employee List")})}})()]})]})})},5344:function(e,a,s){"use strict";var r=s(5236),t=s(9842),n=s(9854);let o=(0,r.ZF)({apiKey:"AIzaSyB5__zMeXEsk4RxME0Fg46Sz7AhqZzA9qE",authDomain:"mtg-quickyclock.firebaseapp.com",projectId:"mtg-quickyclock",storageBucket:"mtg-quickyclock.appspot.com",messagingSenderId:"865821745601",appId:"1:865821745601:web:b01221defd23ac3d338f40"}),l=(0,t.ad)(o);(0,n.cF)(o),a.Z=l},8370:function(e,a,s){"use strict";var r=s(7437),t=s(6463),n=s(2265);a.Z=e=>{let a=a=>{let s=(0,t.useRouter)();return(0,n.useEffect)(()=>{{let e=localStorage.getItem("userName"),a=localStorage.getItem("adminName");e||a||s.push("/")}},[s]),(0,r.jsx)(e,{...a})};return a.displayName="withAuth(".concat(e.displayName||e.name||"Component",")"),a}},3537:function(e){e.exports={container:"admin_container__T9cg4",sidebar:"admin_sidebar__5knmB",welcome:"admin_welcome__EOlff",menu:"admin_menu__Y1Ly4",sidebarItem:"admin_sidebarItem__qvaqy",logout:"admin_logout__AnB4w",main:"admin_main__zshRw",dashboard:"admin_dashboard__a0Ls_",card:"admin_card__Kn9tF",content:"admin_content__Nu_se",register:"admin_register__xR5KE",input:"admin_input__O8BkZ",formGroup:"admin_formGroup__rBUwz",workHours:"admin_workHours__UhxOF",workHoursRow:"admin_workHoursRow__s7mQ3",inputTime:"admin_inputTime__Soann",buttonGroup:"admin_buttonGroup__P8OAf",saveButton:"admin_saveButton__aSLLv",cancelButton:"admin_cancelButton__rtWWq",button:"admin_button__MLcPe",durationFields:"admin_durationFields__DWQXe",searchBar:"admin_searchBar__iAS0a",exportButton:"admin_exportButton__RN1ka",employeeList:"admin_employeeList__O9YWH",employeeCard:"admin_employeeCard___xEpz",header:"admin_header__zGWj8",editTitle:"admin_editTitle__smNi5",span:"admin_span__8M3CT",inputWorkHours:"admin_inputWorkHours__NwpD9",tableContainer:"admin_tableContainer__XkWgJ",workTable:"admin_workTable__ph5H8"}},6140:function(e){e.exports={dashboard:"dashboard_dashboard__SPoqz",cardsContainer:"dashboard_cardsContainer__sdCNc",card:"dashboard_card__sDD_F",cardPrimary:"dashboard_cardPrimary__GVxoU",cardWarning:"dashboard_cardWarning__z0YPz",cardSuccess:"dashboard_cardSuccess__N1kwN",cardDanger:"dashboard_cardDanger__4OduP",employeeTags:"dashboard_employeeTags__n0g57",employeeTag:"dashboard_employeeTag__KVXFJ",selectedTag:"dashboard_selectedTag__MXuh8",chartContainer:"dashboard_chartContainer__VN0Is",chart:"dashboard_chart__Y6hZ_",employeeTable:"dashboard_employeeTable__g54gA",searchBar:"dashboard_searchBar__QHS3W",employeeList:"dashboard_employeeList___vHh5",employeeItem:"dashboard_employeeItem__kSAAq",online:"dashboard_online__wlw8p",offline:"dashboard_offline__mdDU5"}}},function(e){e.O(0,[340,358,425,674,900,998,971,23,744],function(){return e(e.s=9555)}),_N_E=e.O()}]);