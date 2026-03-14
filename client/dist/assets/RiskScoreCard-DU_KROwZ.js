import{c as n}from"./index-nQSi578P.js";import{j as e,m as x}from"./vendor-CHOdf4FO.js";import{C as f}from"./Card-DC5HWRFn.js";import{B as l}from"./Badge-BtdXR5LF.js";/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=n("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=n("CalendarCheck",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"m9 16 2 2 4-4",key:"19s6y9"}]]);/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=n("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);function g({riskScore:s=0}){const d=c=>c>=7?{level:"High Risk",variant:"danger",color:"text-[#ef4444]",stroke:"#ef4444"}:c>=4?{level:"Medium Risk",variant:"warning",color:"text-[#f59e0b]",stroke:"#f59e0b"}:{level:"Low Risk",variant:"success",color:"text-[#22c55e]",stroke:"#22c55e"},{level:t,variant:i,color:o,stroke:m}=d(s),r=60,a=2*Math.PI*r,h=a-Math.min(s,9)/9*a;return e.jsxs(f,{className:"flex flex-col items-center justify-center p-6 h-full relative overflow-hidden group hover:shadow-card transition-all duration-300",children:[e.jsxs("div",{className:"flex items-center justify-between w-full mb-6",children:[e.jsx("h3",{className:"text-lg font-bold text-text-primary",children:"Current Risk"}),e.jsx(l,{variant:i,children:t})]}),e.jsxs("div",{className:"relative w-48 h-48 flex items-center justify-center mb-6",children:[e.jsxs("svg",{className:"absolute w-full h-full transform -rotate-90",children:[e.jsx("circle",{cx:"96",cy:"96",r,className:"text-gray-100",strokeWidth:"12",fill:"transparent",stroke:"currentColor"}),e.jsx(x.circle,{initial:{strokeDashoffset:a},animate:{strokeDashoffset:h},transition:{duration:1.5,ease:"easeOut"},cx:"96",cy:"96",r,className:o,strokeWidth:"12",fill:"transparent",stroke:m,strokeDasharray:a,strokeLinecap:"round"})]}),e.jsx("div",{className:"flex flex-col items-center z-10 animate-fade-in",children:e.jsx("span",{className:`text-5xl font-bold ${o}`,children:s})})]}),e.jsx("div",{className:"text-center mt-6",children:e.jsx(l,{variant:i,className:"text-sm px-4 py-1.5 shadow-sm",children:t})}),e.jsx("p",{className:"text-center text-text-secondary text-sm px-4 leading-relaxed",children:t.includes("High")?"Immediate attention needed. Review your study and lifestyle habits.":t.includes("Medium")?"Moderate risk detected. Consistency is key to improvement.":"Great work! You are maintaining a healthy academic balance."})]})}export{v as B,j as C,M,g as R};
