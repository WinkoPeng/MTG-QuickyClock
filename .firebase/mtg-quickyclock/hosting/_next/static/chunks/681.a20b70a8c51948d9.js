"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[681],{7681:function(e,t,r){r.r(t),r.d(t,{default:function(){return p}});var a=r(7437),n=r(2265),s=r(1654),o=r(7719),l=r.n(o);r(9360);var c=r(3537),i=r.n(c),u=r(9842),d=r(5344);let f="pk.eyJ1IjoidGJ1aTYiLCJhIjoiY2x5Y25hZ3cwMXJobTJrbXh2MWlnazRuMSJ9.NttMI2vLcbUpQb_SYSpK-g";function p(){let e=(0,n.useRef)(null),t=(0,n.useRef)(null),[r,o]=(0,n.useState)(!1),[c,p]=(0,n.useState)(""),[h,m]=(0,n.useState)(null),[g,y]=(0,n.useState)("");(0,n.useEffect)(()=>(l().accessToken=f,t.current=new(l()).Map({container:e.current,style:"mapbox://styles/mapbox/streets-v11",center:[-74.5,40],zoom:9}),t.current.on("load",()=>{o(!0)}),()=>t.current.remove()),[]);let x=async()=>{let e=(0,u.IO)((0,u.hJ)(d.Z,"geofence"),(0,u.ar)("name","==",g)),t=(0,u.IO)((0,u.hJ)(d.Z,"geofence"),(0,u.ar)("address","==",h.properties.full_address)),r=await (0,u.PL)(e),a=await (0,u.PL)(t);return r.empty?!!a.empty||(alert("The location already exists as a geofence"),!1):(alert("A geofence with that name already exists"),!1)},b=async e=>{if(e.preventDefault(),!h){alert("Please select a location first!");return}if(!g){alert("Please enter a name for the geofence.");return}if(await x())try{let e=new u.F8(h.geometry.coordinates[1],h.geometry.coordinates[0]);await (0,u.ET)((0,u.hJ)(d.Z,"geofence"),{geopoint:e,name:g,address:h.properties.full_address}),alert("Geofence added successfully.")}catch(e){console.error("Error adding document: ",e),alert("Error adding geofence.")}};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(s.Rj,{accessToken:f,map:t.current,mapboxgl:l(),value:c,onChange:e=>{p(e)},onRetrieve:e=>{if(e&&e.features&&e.features.length>0){console.log(e);let r=e.features[0];if(m(r),t.current){let[e,a]=r.geometry.coordinates;t.current.flyTo({center:[e,a],essential:!0,zoom:14}),new(l()).Marker().setLngLat([e,a]).addTo(t.current)}}else console.error("No features found in the response:",e)},marker:!1}),(0,a.jsx)("div",{id:"map-container",ref:e,style:{height:"75%",width:"100%"}}),h&&(0,a.jsxs)("div",{children:[(0,a.jsx)("h3",{children:"Selected Location:"}),(0,a.jsxs)("p",{children:["Place name: ",h.properties.name]}),(0,a.jsxs)("p",{children:["Address: ",h.properties.full_address]}),(0,a.jsxs)("form",{onSubmit:b,children:[(0,a.jsx)("input",{type:"text",name:"Geofence Name",placeholder:"Location Name",value:g,onChange:e=>y(e.target.value),required:!0,className:i().input}),(0,a.jsx)("button",{type:"submit",className:i().button,children:"Add Location"})]})]})]})}}}]);