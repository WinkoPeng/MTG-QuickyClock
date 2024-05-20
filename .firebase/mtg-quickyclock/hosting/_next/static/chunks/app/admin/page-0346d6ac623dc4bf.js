(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3],{67:function(){},2061:function(){},9555:function(e,a,s){Promise.resolve().then(s.bind(s,2161))},2161:function(e,a,s){"use strict";s.r(a),s.d(a,{default:function(){return v}});var n=s(7437),t=s(2265),r=s(6463),o=s(8370),l=s(3537),i=s.n(l),d=s(9842),u=s(5344);function c(){let[e,a]=(0,t.useState)({id:"",password:"",name:"",class:"employee",gender:"male",email:"",cell:"",address:"",workHours:{Monday:{start:"",end:""},Tuesday:{start:"",end:""},Wednesday:{start:"",end:""},Thursday:{start:"",end:""},Friday:{start:"",end:""},Saturday:{start:"",end:""},Sunday:{start:"",end:""}}}),s=e=>{let{name:s,value:n}=e.target;if(s.includes(".start")||s.includes(".end")){let[e,t]=s.split(".");a(a=>({...a,workHours:{...a.workHours,[e]:{...a.workHours[e],[t]:n}}}))}else a(e=>({...e,[s]:n}))},r=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e).toLowerCase()),o=()=>{for(let a in e.workHours){let s=e.workHours[a].start,n=e.workHours[a].end;if(s&&n&&new Date("1970-01-01T".concat(n))<new Date("1970-01-01T".concat(s)))return alert("".concat(a,": End time cannot be earlier than start time.")),!1}return!0},l=async()=>{let a=(0,d.IO)((0,d.hJ)(u.Z,"employee"),(0,d.ar)("id","==",e.id)),s=(0,d.IO)((0,d.hJ)(u.Z,"employee"),(0,d.ar)("email","==",e.email)),n=await (0,d.PL)(a),t=await (0,d.PL)(s);return n.empty?!!t.empty||(alert("Email already exists"),!1):(alert("Employee ID already exists"),!1)},c=async s=>{if(s.preventDefault(),o()){if(!r(e.email)){alert("Invalid email format");return}if(await l())try{let s=Object.keys(e.workHours).reduce((a,s)=>(a[s]="".concat(e.workHours[s].start," - ").concat(e.workHours[s].end),a),{});await (0,d.ET)((0,d.hJ)(u.Z,"employee"),{...e,workHours:s}),alert("Employee added successfully!"),a({id:"",password:"",name:"",class:"employee",gender:"male",email:"",cell:"",address:"",workHours:{Monday:{start:"",end:""},Tuesday:{start:"",end:""},Wednesday:{start:"",end:""},Thursday:{start:"",end:""},Friday:{start:"",end:""},Saturday:{start:"",end:""},Sunday:{start:"",end:""}}})}catch(e){console.error("Error adding document: ",e),alert("Error adding employee.")}}};return(0,n.jsxs)("div",{className:i().register,children:[(0,n.jsx)("h2",{children:"Register Employee"}),(0,n.jsxs)("form",{onSubmit:c,children:[(0,n.jsx)("input",{type:"text",name:"id",placeholder:"ID",value:e.id,onChange:s,required:!0,className:i().input}),(0,n.jsx)("input",{type:"password",name:"password",placeholder:"Password",value:e.password,onChange:s,required:!0,className:i().input}),(0,n.jsx)("input",{type:"text",name:"name",placeholder:"Name",value:e.name,onChange:s,required:!0,className:i().input}),(0,n.jsxs)("select",{name:"class",value:e.class,onChange:s,required:!0,className:i().input,children:[(0,n.jsx)("option",{value:"employee",children:"Employee"}),(0,n.jsx)("option",{value:"admin",children:"Admin"})]}),(0,n.jsxs)("select",{name:"gender",value:e.gender,onChange:s,required:!0,className:i().input,children:[(0,n.jsx)("option",{value:"male",children:"Male"}),(0,n.jsx)("option",{value:"female",children:"Female"})]}),(0,n.jsx)("input",{type:"email",name:"email",placeholder:"Email",value:e.email,onChange:s,required:!0,className:i().input}),(0,n.jsx)("input",{type:"text",name:"cell",placeholder:"Cell",value:e.cell,onChange:s,required:!0,className:i().input}),(0,n.jsx)("input",{type:"text",name:"address",placeholder:"Address",value:e.address,onChange:s,required:!0,className:i().input}),(0,n.jsxs)("div",{className:i().workHours,children:[(0,n.jsx)("h3",{children:"Work Hours"}),Object.keys(e.workHours).map(a=>(0,n.jsxs)("div",{className:i().workHoursRow,children:[(0,n.jsx)("label",{children:a}),(0,n.jsx)("input",{type:"time",name:"".concat(a,".start"),value:e.workHours[a].start,onChange:s,className:i().inputTime}),(0,n.jsx)("span",{children:"to"}),(0,n.jsx)("input",{type:"time",name:"".concat(a,".end"),value:e.workHours[a].end,onChange:s,className:i().inputTime})]},a))]}),(0,n.jsx)("button",{type:"submit",className:i().button,children:"Register"})]})]})}var m=s(7170),h=s(7800),p=function(e){let{onEdit:a}=e,[s,r]=(0,t.useState)([]),[o,l]=(0,t.useState)(""),[c,p]=(0,t.useState)("all"),x=(0,t.useCallback)(async()=>{r((await (0,d.PL)((0,d.hJ)(u.Z,"employee"))).docs.map(e=>({id:e.id,...e.data()})))},[]);(0,t.useEffect)(()=>{x()},[x]);let j=e=>"".concat(Math.floor(e/60)," hours ").concat(e%60," mins"),y=s.filter(e=>{let a=""===o||Object.values(e).some(e=>e.toString().toLowerCase().includes(o)),s="online"===e.status,n=e.workDurationToday||0,t=!0;return"online"===c&&(t=s),"workingToday"===c&&(t=n>0),"offToday"===c&&(t=0===n),a&&t});return(0,n.jsxs)("div",{className:i().content,children:[(0,n.jsxs)("div",{className:i().searchBar,children:[(0,n.jsx)("input",{type:"text",placeholder:"Search employees...",value:o,onChange:e=>{l(e.target.value.toLowerCase())},className:i().input}),(0,n.jsxs)("select",{value:c,onChange:e=>{p(e.target.value)},className:i().input,children:[(0,n.jsx)("option",{value:"all",children:"Show All"}),(0,n.jsx)("option",{value:"online",children:"Online Only"}),(0,n.jsx)("option",{value:"workingToday",children:"Working Today"}),(0,n.jsx)("option",{value:"offToday",children:"Off Today"})]}),(0,n.jsx)("button",{onClick:()=>{let e=h.P6.json_to_sheet(s),a=h.P6.book_new();h.P6.book_append_sheet(a,e,"Employees");let n=new Blob([h.cW(a,{bookType:"xlsx",type:"array"})],{type:"application/octet-stream"});(0,m.saveAs)(n,"employees.xlsx")},className:i().exportButton,children:"Export Employee List"})]}),(0,n.jsx)("div",{className:i().employeeList,children:y.map(e=>(0,n.jsxs)("div",{className:i().employeeCard,children:[(0,n.jsx)("h3",{children:e.name}),(0,n.jsxs)("p",{children:["Status: ",(0,n.jsx)("span",{style:{color:"online"===e.status?"green":"grey",fontWeight:"bold"},children:"online"===e.status?"Online":"Offline"})]}),(0,n.jsxs)("p",{children:["Class: ",e.class]}),(0,n.jsxs)("p",{children:["Today's Work Hours: ",j(e.workDurationToday)]}),(0,n.jsxs)("p",{children:["This Month's Work Hours: ",j(e.thisMonthWorkDuration)]}),(0,n.jsxs)("p",{children:["Last Month's Work Hours: ",j(e.lastMonthWorkDuration)]}),(0,n.jsxs)("p",{children:["Two Weeks' Work Hours: ",j(e.twoWeeksWorkDuration)]}),(0,n.jsx)("button",{onClick:()=>a(e),className:i().button,children:"Edit"})]},e.id))})]})},x=s(7346);s(433);var j=s(6140),y=s.n(j),k=function(){let[e,a]=(0,t.useState)([]),[s,r]=(0,t.useState)(0),[o,l]=(0,t.useState)(0),[i,c]=(0,t.useState)({hours:0,minutes:0});return(0,t.useEffect)(()=>{(async()=>{let e=(await (0,d.PL)((0,d.hJ)(u.Z,"employee"))).docs.map(e=>e.data()),s=e.filter(e=>"online"===e.status),n=e.reduce((e,a)=>e+(a.workDurationToday||0),0)/e.length;a(e),r(s.length),l(e.length),c({hours:Math.floor(n/60),minutes:Math.floor(n%60)})})()},[]),(0,n.jsxs)("div",{className:y().dashboard,children:[(0,n.jsx)("div",{className:y().card,children:(0,n.jsxs)("h3",{children:["Today's Work Count: ",s,"/",o," (Total Amount)"]})}),(0,n.jsxs)("div",{className:y().card,children:[(0,n.jsx)("h3",{children:"Employees Working Today"}),(0,n.jsx)("ul",{className:y().employeeList,children:e.map((e,a)=>(0,n.jsx)("li",{className:"".concat(y().employeeItem," ").concat("online"===e.status?y().online:y().offline),children:e.name},a))})]}),(0,n.jsxs)("div",{className:y().card,children:[(0,n.jsx)("h3",{children:"Real-time Online Count"}),(0,n.jsx)("div",{className:y().pieChartContainer,children:(0,n.jsx)(x.by,{data:{labels:["Online","Offline"],datasets:[{data:[s,o-s],backgroundColor:["#4caf50","#9e9e9e"]}]}})})]}),(0,n.jsx)("div",{className:y().card,children:(0,n.jsxs)("h3",{children:["Average Work Hours Today: ",i.hours," hours ",i.minutes," mins"]})})]})},_=function(e){let{employee:a,onCancel:s}=e;(0,r.useRouter)();let[o,l]=(0,t.useState)({id:"",password:"",name:"",class:"employee",gender:"male",email:"",cell:"",address:"",workHours:{Monday:{start:"",end:""},Tuesday:{start:"",end:""},Wednesday:{start:"",end:""},Thursday:{start:"",end:""},Friday:{start:"",end:""},Saturday:{start:"",end:""},Sunday:{start:"",end:""}},lastMonthWorkDuration:{hours:0,minutes:0},lastOnlineDate:"",thisMonthWorkDuration:{hours:0,minutes:0},twoWeeksWorkDuration:{hours:0,minutes:0},workDurationToday:{hours:0,minutes:0}});(0,t.useEffect)(()=>{if(a){let{lastMonthWorkDuration:e,thisMonthWorkDuration:s,twoWeeksWorkDuration:n,workDurationToday:t,workHours:r,...o}=a;l({...o,workHours:h(r),lastMonthWorkDuration:c(e),thisMonthWorkDuration:c(s),twoWeeksWorkDuration:c(n),workDurationToday:c(t)})}},[a]);let c=e=>({hours:Math.floor(e/60),minutes:e%60}),m=e=>{let{hours:a,minutes:s}=e;return 60*(parseInt(a)||0)+(parseInt(s)||0)},h=e=>{let a={};return Object.keys(e).forEach(s=>{let[n,t]=e[s].split(" - ").map(e=>"-"===e?"":e);a[s]={start:n,end:t}}),a},p=e=>{let{name:a,value:s}=e.target;if(a.includes(".start")||a.includes(".end")){let[e,n]=a.split(".");l(a=>({...a,workHours:{...a.workHours,[e]:{...a.workHours[e],[n]:s}}}))}else if(a.includes(".hours")||a.includes(".minutes")){let[e,n]=a.split(".");l(a=>({...a,[e]:{...a[e],[n]:s}}))}else l(e=>({...e,[a]:s}))},x=async e=>{e.preventDefault();try{let e=(0,d.IO)((0,d.hJ)(u.Z,"employee"),(0,d.ar)("id","==",o.id)),a=await (0,d.PL)(e);if(a.empty){alert("Employee ID does not exist");return}let n=a.docs[0],t=(0,d.JU)(u.Z,"employee",n.id),r={...o,lastMonthWorkDuration:m(o.lastMonthWorkDuration),thisMonthWorkDuration:m(o.thisMonthWorkDuration),twoWeeksWorkDuration:m(o.twoWeeksWorkDuration),workDurationToday:m(o.workDurationToday),workHours:Object.keys(o.workHours).reduce((e,a)=>(e[a]="".concat(o.workHours[a].start," - ").concat(o.workHours[a].end)||"- -",e),{})};await (0,d.r7)(t,r),alert("Employee updated successfully!"),s()}catch(e){console.error("Error updating document: ",e),alert("Error updating employee.")}};return(0,n.jsxs)("div",{className:i().register,children:[(0,n.jsx)("h2",{children:"Edit Employee"}),(0,n.jsxs)("form",{onSubmit:x,className:i().form,children:[(0,n.jsxs)("div",{className:i().formGroup,children:[(0,n.jsx)("label",{htmlFor:"id",children:"ID"}),(0,n.jsx)("input",{type:"text",name:"id",placeholder:"ID",value:o.id,onChange:p,required:!0,className:i().input})]}),(0,n.jsxs)("div",{className:i().formGroup,children:[(0,n.jsx)("label",{htmlFor:"password",children:"Password"}),(0,n.jsx)("input",{type:"password",name:"password",placeholder:"Password",value:o.password,onChange:p,required:!0,className:i().input})]}),(0,n.jsxs)("div",{className:i().formGroup,children:[(0,n.jsx)("label",{htmlFor:"name",children:"Name"}),(0,n.jsx)("input",{type:"text",name:"name",placeholder:"Name",value:o.name,onChange:p,required:!0,className:i().input})]}),(0,n.jsxs)("div",{className:i().formGroup,children:[(0,n.jsx)("label",{htmlFor:"class",children:"Class"}),(0,n.jsxs)("select",{name:"class",value:o.class,onChange:p,required:!0,className:i().input,children:[(0,n.jsx)("option",{value:"employee",children:"Employee"}),(0,n.jsx)("option",{value:"admin",children:"Admin"})]})]}),(0,n.jsxs)("div",{className:i().formGroup,children:[(0,n.jsx)("label",{htmlFor:"gender",children:"Gender"}),(0,n.jsxs)("select",{name:"gender",value:o.gender,onChange:p,required:!0,className:i().input,children:[(0,n.jsx)("option",{value:"male",children:"Male"}),(0,n.jsx)("option",{value:"female",children:"Female"})]})]}),(0,n.jsxs)("div",{className:i().formGroup,children:[(0,n.jsx)("label",{htmlFor:"email",children:"Email"}),(0,n.jsx)("input",{type:"email",name:"email",placeholder:"Email",value:o.email,onChange:p,required:!0,className:i().input})]}),(0,n.jsxs)("div",{className:i().formGroup,children:[(0,n.jsx)("label",{htmlFor:"cell",children:"Cell"}),(0,n.jsx)("input",{type:"text",name:"cell",placeholder:"Cell",value:o.cell,onChange:p,required:!0,className:i().input})]}),(0,n.jsxs)("div",{className:i().formGroup,children:[(0,n.jsx)("label",{htmlFor:"address",children:"Address"}),(0,n.jsx)("input",{type:"text",name:"address",placeholder:"Address",value:o.address,onChange:p,required:!0,className:i().input})]}),(0,n.jsxs)("div",{className:i().workHours,children:[(0,n.jsx)("h3",{children:"Work Hours"}),Object.keys(o.workHours).map(e=>(0,n.jsxs)("div",{className:i().workHoursRow,children:[(0,n.jsx)("label",{children:e}),(0,n.jsx)("input",{type:"time",name:"".concat(e,".start"),value:o.workHours[e].start,onChange:p,className:i().inputTime}),(0,n.jsx)("span",{children:"to"}),(0,n.jsx)("input",{type:"time",name:"".concat(e,".end"),value:o.workHours[e].end,onChange:p,className:i().inputTime})]},e))]}),(0,n.jsxs)("div",{className:i().formGroup,children:[(0,n.jsx)("label",{htmlFor:"lastMonthWorkDuration.hours",children:"Last Month Work Duration (Hours and Minutes)"}),(0,n.jsxs)("div",{className:i().durationFields,children:[(0,n.jsx)("input",{type:"number",name:"lastMonthWorkDuration.hours",placeholder:"Hours",value:o.lastMonthWorkDuration.hours,onChange:p,className:i().input}),(0,n.jsx)("span",{children:"hours"}),(0,n.jsx)("input",{type:"number",name:"lastMonthWorkDuration.minutes",placeholder:"Minutes",value:o.lastMonthWorkDuration.minutes,onChange:p,className:i().input}),(0,n.jsx)("span",{children:"mins"})]})]}),(0,n.jsxs)("div",{className:i().formGroup,children:[(0,n.jsx)("label",{htmlFor:"lastOnlineDate",children:"Last Online Date"}),(0,n.jsx)("input",{type:"date",name:"lastOnlineDate",placeholder:"Last Online Date",value:o.lastOnlineDate,onChange:p,className:i().input})]}),(0,n.jsxs)("div",{className:i().formGroup,children:[(0,n.jsx)("label",{htmlFor:"thisMonthWorkDuration.hours",children:"This Month Work Duration (Hours and Minutes)"}),(0,n.jsxs)("div",{className:i().durationFields,children:[(0,n.jsx)("input",{type:"number",name:"thisMonthWorkDuration.hours",placeholder:"Hours",value:o.thisMonthWorkDuration.hours,onChange:p,className:i().input}),(0,n.jsx)("span",{children:"hours"}),(0,n.jsx)("input",{type:"number",name:"thisMonthWorkDuration.minutes",placeholder:"Minutes",value:o.thisMonthWorkDuration.minutes,onChange:p,className:i().input}),(0,n.jsx)("span",{children:"mins"})]})]}),(0,n.jsxs)("div",{className:i().formGroup,children:[(0,n.jsx)("label",{htmlFor:"twoWeeksWorkDuration.hours",children:"Two Weeks Work Duration (Hours and Minutes)"}),(0,n.jsxs)("div",{className:i().durationFields,children:[(0,n.jsx)("input",{type:"number",name:"twoWeeksWorkDuration.hours",placeholder:"Hours",value:o.twoWeeksWorkDuration.hours,onChange:p,className:i().input}),(0,n.jsx)("span",{children:"hours"}),(0,n.jsx)("input",{type:"number",name:"twoWeeksWorkDuration.minutes",placeholder:"Minutes",value:o.twoWeeksWorkDuration.minutes,onChange:p,className:i().input}),(0,n.jsx)("span",{children:"mins"})]})]}),(0,n.jsxs)("div",{className:i().formGroup,children:[(0,n.jsx)("label",{htmlFor:"workDurationToday.hours",children:"Work Duration Today (Hours and Minutes)"}),(0,n.jsxs)("div",{className:i().durationFields,children:[(0,n.jsx)("input",{type:"number",name:"workDurationToday.hours",placeholder:"Hours",value:o.workDurationToday.hours,onChange:p,className:i().input}),(0,n.jsx)("span",{children:"hours"}),(0,n.jsx)("input",{type:"number",name:"workDurationToday.minutes",placeholder:"Minutes",value:o.workDurationToday.minutes,onChange:p,className:i().input}),(0,n.jsx)("span",{children:"mins"})]})]}),(0,n.jsxs)("div",{className:i().buttonGroup,children:[(0,n.jsx)("button",{type:"submit",className:i().saveButton,children:"Save"}),(0,n.jsx)("button",{type:"button",onClick:s,className:i().cancelButton,children:"Cancel"})]})]})]})},v=(0,o.Z)(function(){let[e,a]=(0,t.useState)("Dashboard"),[s,o]=(0,t.useState)(""),[l,d]=(0,t.useState)(null),u=(0,r.useRouter)();return(0,t.useEffect)(()=>{let e=localStorage.getItem("adminName");e&&o(e)},[]),(0,n.jsxs)("div",{className:i().container,children:[(0,n.jsxs)("div",{className:i().sidebar,children:[(0,n.jsxs)("div",{className:i().welcome,children:[(0,n.jsx)("h3",{children:"Welcome,"}),(0,n.jsx)("h2",{children:s})]}),(0,n.jsxs)("div",{className:i().menu,children:[(0,n.jsx)("div",{className:i().sidebarItem,onClick:()=>a("Dashboard"),children:"Dashboard"}),(0,n.jsx)("div",{className:i().sidebarItem,onClick:()=>a("Employee List"),children:"Employee List"}),(0,n.jsx)("div",{className:i().sidebarItem,onClick:()=>a("Register"),children:"Register"})]}),(0,n.jsx)("div",{className:i().logout,children:(0,n.jsx)("button",{onClick:()=>{localStorage.removeItem("adminName"),u.push("/")},className:i().logout,children:"Logout"})})]}),(0,n.jsx)("div",{className:i().main,children:(()=>{switch(e){case"Dashboard":default:return(0,n.jsx)(k,{});case"Employee List":return(0,n.jsx)(p,{onEdit:e=>{d(e),a("Edit")}});case"Register":return(0,n.jsx)(c,{});case"Edit":return(0,n.jsx)(_,{employee:l,onCancel:()=>a("Employee List")})}})()})]})})},5344:function(e,a,s){"use strict";var n=s(5236),t=s(9842),r=s(9854);let o=(0,n.ZF)({apiKey:"AIzaSyB5__zMeXEsk4RxME0Fg46Sz7AhqZzA9qE",authDomain:"mtg-quickyclock.firebaseapp.com",projectId:"mtg-quickyclock",storageBucket:"mtg-quickyclock.appspot.com",messagingSenderId:"865821745601",appId:"1:865821745601:web:b01221defd23ac3d338f40"}),l=(0,t.ad)(o);(0,r.cF)(o),a.Z=l},8370:function(e,a,s){"use strict";var n=s(7437),t=s(6463),r=s(2265);a.Z=e=>{let a=a=>{let s=(0,t.useRouter)();return(0,r.useEffect)(()=>{{let e=localStorage.getItem("userName"),a=localStorage.getItem("adminName");e||a||s.push("/")}},[s]),(0,n.jsx)(e,{...a})};return a.displayName="withAuth(".concat(e.displayName||e.name||"Component",")"),a}},3537:function(e){e.exports={container:"admin_container__T9cg4",sidebar:"admin_sidebar__5knmB",welcome:"admin_welcome__EOlff",menu:"admin_menu__Y1Ly4",sidebarItem:"admin_sidebarItem__qvaqy",logout:"admin_logout__AnB4w",main:"admin_main__zshRw",dashboard:"admin_dashboard__a0Ls_",card:"admin_card__Kn9tF",content:"admin_content__Nu_se",register:"admin_register__xR5KE",input:"admin_input__O8BkZ",formGroup:"admin_formGroup__rBUwz",workHours:"admin_workHours__UhxOF",workHoursRow:"admin_workHoursRow__s7mQ3",inputTime:"admin_inputTime__Soann",buttonGroup:"admin_buttonGroup__P8OAf",saveButton:"admin_saveButton__aSLLv",cancelButton:"admin_cancelButton__rtWWq",button:"admin_button__MLcPe",durationFields:"admin_durationFields__DWQXe",searchBar:"admin_searchBar__iAS0a",exportButton:"admin_exportButton__RN1ka",employeeList:"admin_employeeList__O9YWH",employeeCard:"admin_employeeCard___xEpz"}},6140:function(e){e.exports={dashboard:"dashboard_dashboard__SPoqz",card:"dashboard_card__sDD_F",employeeList:"dashboard_employeeList___vHh5",employeeItem:"dashboard_employeeItem__kSAAq",online:"dashboard_online__wlw8p",offline:"dashboard_offline__mdDU5",pieChartContainer:"dashboard_pieChartContainer__NAidZ"}}},function(e){e.O(0,[340,358,425,674,9,998,971,23,744],function(){return e(e.s=9555)}),_N_E=e.O()}]);