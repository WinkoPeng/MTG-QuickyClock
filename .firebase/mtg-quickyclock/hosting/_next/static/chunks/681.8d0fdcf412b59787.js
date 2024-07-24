"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[681],{7681:function(e,r,t){t.r(r),t.d(r,{default:function(){return u}});var a=t(7437),s=t(2265),n=t(1654),l=t(7719),o=t.n(l);t(9360);var c=t(9842),d=t(5344);let i="pk.eyJ1IjoidGJ1aTYiLCJhIjoiY2x5Y25hZ3cwMXJobTJrbXh2MWlnazRuMSJ9.NttMI2vLcbUpQb_SYSpK-g";function u(){let e=(0,s.useRef)(null),r=(0,s.useRef)(null),[t,l]=(0,s.useState)(!1),[u,f]=(0,s.useState)(""),[g,m]=(0,s.useState)(null),[h,p]=(0,s.useState)("");(0,s.useEffect)(()=>(o().accessToken=i,r.current=new(o()).Map({container:e.current,style:"mapbox://styles/mapbox/streets-v11",center:[-74.5,40],zoom:9}),r.current.on("load",()=>{l(!0)}),()=>r.current.remove()),[]);let x=async()=>{let e=(0,c.IO)((0,c.hJ)(d.ZP,"geofence"),(0,c.ar)("name","==",h)),r=(0,c.IO)((0,c.hJ)(d.ZP,"geofence"),(0,c.ar)("address","==",g.properties.full_address)),t=await (0,c.PL)(e),a=await (0,c.PL)(r);return t.empty?!!a.empty||(alert("The location already exists as a geofence"),!1):(alert("A geofence with that name already exists"),!1)},b=async e=>{if(e.preventDefault(),!g){alert("Please select a location first!");return}if(!h){alert("Please enter a name for the geofence.");return}if(await x())try{let e=new c.F8(g.geometry.coordinates[1],g.geometry.coordinates[0]);await (0,c.ET)((0,c.hJ)(d.ZP,"geofence"),{geopoint:e,name:h,address:g.properties.full_address}),alert("Geofence added successfully.")}catch(e){console.error("Error adding document: ",e),alert("Error adding geofence.")}};return(0,a.jsxs)("div",{className:"flex flex-col md:flex-row p-4 gap-4",children:[(0,a.jsxs)("div",{className:"relative flex-1 h-[400px] md:h-[75vh] bg-gray-800 rounded-lg shadow-md",children:[(0,a.jsx)(n.Rj,{accessToken:i,map:r.current,mapboxgl:o(),value:u,onChange:e=>{f(e)},onRetrieve:e=>{if(e&&e.features&&e.features.length>0){console.log(e);let t=e.features[0];if(m(t),r.current){let[e,a]=t.geometry.coordinates;r.current.flyTo({center:[e,a],essential:!0,zoom:14}),new(o()).Marker().setLngLat([e,a]).addTo(r.current)}}else console.error("No features found in the response:",e)},marker:!1}),(0,a.jsx)("div",{id:"map-container",ref:e,className:"absolute top-0 left-0 w-full h-full rounded-lg"})]}),(0,a.jsxs)("div",{className:"flex-1 max-w-md p-4 bg-gray-900 text-gray-200 rounded-lg shadow-lg",children:[!g&&(0,a.jsx)("div",{className:"mb-4 p-4 border border-dashed border-gray-700 rounded-md text-center bg-gray-800",children:(0,a.jsx)("p",{className:"text-gray-400",children:"Please search for a location, then double-click on the intended result in the resulting list."})}),g&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("h3",{className:"text-lg font-semibold mb-4",children:"Selected Location"}),(0,a.jsxs)("p",{className:"text-gray-300",children:[(0,a.jsx)("strong",{children:"Place name:"})," ",g.properties.name]}),(0,a.jsxs)("p",{className:"text-gray-300",children:[(0,a.jsx)("strong",{children:"Address:"})," ",g.properties.full_address]}),(0,a.jsxs)("form",{onSubmit:b,className:"mt-4 flex flex-col gap-4",children:[(0,a.jsx)("input",{type:"text",name:"Geofence Name",placeholder:"Name your geofence",value:h,onChange:e=>p(e.target.value),required:!0,className:"p-3 border border-gray-700 rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"}),(0,a.jsx)("button",{type:"submit",className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",children:"Add Location"})]})]})]})]})}}}]);