var e=require("@material-ui/core/colors"),n=e.blueGrey,t=e.indigo,r=e.green,i=e.deepOrange,a=e.brown,u=e.amber,s=e.grey,o=e.orange,c=e.blue,l=e.lightGreen,f=require("simple-statistics"),m=f.mean,d=f.interquartileRange,g=f.quantile,v=f.min,h=f.max,p=f.sum,y=f.medianAbsoluteDeviation,w=f.modeSorted,O=f.medianSorted,U=f.uniqueCountSorted,b=f.variance,k=f.standardDeviation,M=require("date-fns"),D=M.subYears,T=M.getYear,B=M.format,S=M.addMinutes,x=M.addHours,Y=M.addDays,j=M.addMonths,I=M.addYears,N=M.subMonths,q=M.startOfMonth,C=M.startOfDay,E=M.startOfYear,W=M.endOfYear,A=M.endOfMonth,F=M.endOfDay,P=M.differenceInYears,_=M.parse,L=require("lodash/groupBy"),H=require("lodash/merge"),$=function(e,n,t,r){return void 0===r&&(r=r),e*r[n][t]},z=function(e){return isNaN(e)?"0":parseInt(Math.round(e),10).toLocaleString()},R=function(e,n){return(e-n)/n},V=function(e,n){return isNaN(e)&&(e=new Date(e).valueOf()),isNaN(n)&&(n=new Date(n).valueOf()),315576e5/(n-e)},G=function(e,n){var t;switch(n){case"day":t=C(e);break;case"month":t=q(e);break;default:t=E(e)}return t.valueOf()},Q=function(e,n,t,r){void 0===r&&(r=1);var i=[e=_(e)];if(e>=(n=_(n)))return[];for(;i[i.length-1].valueOf()<n.valueOf();){var a=void 0;switch(t){case"minute":a=S(i[i.length-1],r);break;case"hour":a=x(i[i.length-1],r);break;case"day":a=Y(i[i.length-1],r);break;case"month":a=j(i[i.length-1],r);break;default:a=I(i[i.length-1],r)}i.push(a)}return i},Z=function(e){return e.filter((function(e){return NaN!==e[1]||null!==e[1]})).reduce((function(e,n){var t;return Object.assign(e,((t={})[n[0]]=n[1],t))}),{})},J=function(e){return Object.entries(e).map((function(e){var n=e[1];return[new Date(e[0]),n]})).sort((function(e,n){return e[0]-n[0]}))},K=function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];var r=n.map((function(e){return e.map((function(e){var n=e[1];return[new Date(e[0]).valueOf(),n]}))})),i=[].concat(r.map((function(e){return new Map(e)})).reduce((function(e,n){var t=n.keys(),r=Array.isArray(t),i=0;for(t=r?t:t[Symbol.iterator]();;){var a;if(r){if(i>=t.length)break;a=t[i++]}else{if((i=t.next()).done)break;a=i.value}var u=a;e.has(u)?e.set(u,n.get(u)+e.get(u)):e.set(u,n.get(u))}return e}),new Map)).sort((function(e,n){return e[0]-n[0]})).map((function(e){var n=e[1];return[new Date(e[0]),n]}));return i},X=function(e,n){var t=e.slice(0,n-1<0?0:n-1).filter((function(e){return e[1]})).reverse()[0],r=e.slice(n+1).filter((function(e){return e[1]}))[0];return((t?t[1]:0)+(r?r[1]:0))/2},ee=function(e,n,t){return n=new Date(n),t=new Date(t),e.map((function(e){var n=e[1];return[new Date(e[0]),n]})).filter((function(e){return e[0]>=n&&e[0]<=t}))},ne=function(e){return e.sort((function(e,n){return e[0]-n[0]}))},te=function(e){return e.map((function(e){return e[1]})).reduce((function(e,n){return e+n}),0)},re=function(e,n,t,r,i,a){return void 0===i&&(i=[]),void 0===a&&(a=a),Object.keys(e).filter((function(e){return-1===i.indexOf(e)})).filter((function(n){return a.hasOwnProperty(n)&&e[n].length>0})).map((function(i,a){return ee(e[i],t,r).map((function(e){return[e[0],$(e[1],i,n)]}))})).reduce((function(e,n){return K(e,n)}),[])},ie=function(e,n,t,r,i){return void 0===i&&(i=[]),te(re(e,"energy",t,r,i))/n*V(t,r)},ae=function(e,n,t,r,i,a,u){if(void 0===a&&(a=[]),void 0===u&&(u=!1),-1!==["energy","emissions","cost"].indexOf(n))return te(re(e,n,r,i,a))/t*V(r,i);if(!e.hasOwnProperty(n))return 0;var s=te(ee(e[n],r,i))/t*V(r,i);return u?$(s,n,"energy"):s},ue=["eui","energy","emissions","cost","electricity","steam","ng","chw","hw","oil","water"],se=function(e,n){return ue.indexOf(e)<ue.indexOf(n)?-1:1};module.exports={Meters:{eui:{type:"eui",name:"EUI",icon:"account_balance",color:n,units:"kBtu/ft²",intensityUnits:"kBtu/ft²",largeUnits:"kBtu/ft²",kUnits:"MBtu/ft²",demandUnits:"kBtu/ft²/hr",largeDemandUnits:"kBtu/ft²/hr"},energy:{type:"energy",name:"Total Energy",icon:"account_balance",color:n,units:"kBtu",intensityUnits:"kBtu/ft²",largeUnits:"MBtu",kUnits:"MBtu",demandUnits:"kBtu/hr",largeDemandUnits:"MBtu/hr"},electricity:{type:"electricity",name:"Electricity",icon:"power",color:r,units:"kWh",intensityUnits:"kWh/ft²",largeUnits:"MWh",kUnits:"MWh",demandUnits:"kW",largeDemandUnits:"MW"},steam:{type:"steam",name:"Steam",icon:"whatshot",color:i,units:"lbs",intensityUnits:"lbs/ft²",largeUnits:"1,000 lbs",kUnits:"klbs",demandUnits:"lbs/hr",largeDemandUnits:"1,000 lbs/hr"},ng:{type:"ng",name:"Natural Gas",icon:"grain",color:o,units:"Therms",intensityUnits:"Therms/ft²",largeUnits:"1,000 Therms",kUnits:"kTherms",demandUnits:"Therms/hr",largeDemandUnits:"1,000 Therms/hr"},chw:{type:"chw",name:"Chilled Water",icon:"ac_unit",color:t,units:"TonHrs",intensityUnits:"TonHrs/ft²",largeUnits:"1,000 TonHrs",kUnits:"kTonHrs",demandUnits:"Tons",largeDemandUnits:"1,000 Tons"},hw:{type:"hw",name:"Hot Water",icon:"invert_colors",color:u,units:"kBtu",intensityUnits:"kBtu/ft²",largeUnits:"Mbtu",kUnits:"Mbtu",demandUnits:"KBtu/hr",largeDemandUnits:"MBtu/hr"},water:{type:"water",name:"Water",icon:"opacity",color:c,units:"gals",intensityUnits:"gals/ft²",largeUnits:"1,000 gals",kUnits:"kgals",demandUnits:"gals/hr",largeDemandUnits:"1,000 gals/hr"},oil:{type:"oil",name:"Fuel Oil",icon:"local_gas_station",color:s,units:"gals",intensityUnits:"gals/ft²",largeUnits:"1,000 gals",kUnits:"kgals",demandUnits:"gals/hr",largeDemandUnits:"1,000 gals/hr"},cost:{type:"cost",name:"Cost",icon:"attach_money",color:l,units:"$",intensityUnits:"$/ft²",largeUnits:"$1,000",kUnits:"thousands",demandUnits:"$/hr",largeDemandUnits:"1,000 $/hr"},emissions:{type:"emissions",name:"CO2e Emissions",icon:"cloud",color:a,units:"lbs CO2e",intensityUnits:"lbs CO2e/ft²",largeUnits:"1,000 lbs CO2e",kUnits:"klbs CO2e",demandUnits:"CO2e/hr",largeDemandUnits:"1,000 CO2e/hr"}},meterOrder:ue,sortMeters:se,getAvailableMeters:function(e,n,t,r){void 0===e&&(e=[]);var i=[].concat(new Set(e.map((function(e){return Object.keys((e.data||{}).actual||{})})).reduce((function(e,n){return e.concat(n)}),[]))).sort(se);return t&&i.unshift("emissions"),r&&i.unshift("cost"),n&&i.unshift("energy"),i},simpleMeter:function(e){return{_id:e._id,type:e.type,isSubMeter:e.isSubMeter,isVirtualMeter:e.isVirtualMeter,name:e.name,units:e.units}},calcScale:function(e,n){return void 0===n&&(n=""),(e=e.filter((function(e){return e>0}))).length<1?{low:1,high:2,max:3,units:n}:{low:parseInt(g(e,.5),10),high:parseInt(g(e,.75),10),max:parseInt(h(e),10),units:n}},chooseIcon:function(e,n,t){var r=n.low,i=n.high,a=e+"-err";return t&&r&&i?a=t<=r?e+"-low":t<=i?e+"-med":e+"-high":a},validEmail:function(e){var n=new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);return Boolean(e.match(n))},toURLQuery:function(e){return"?".concat(Object.keys(e).map((function(n){return[n,e[n]].join("=")})).join("&"))},parseQueryParams:function(e){return new Map(e.replace("?","").split("&").map((function(e){return e.split("=")})))},conversionFactors:{electricity:{energy:3.4121416331,emissions:.53},steam:{energy:1.19,emissions:.1397},hw:{energy:1,emissions:0},water:{energy:0,emissions:0},chw:{energy:12,emissions:0},ng:{energy:99.9761,emissions:11.7},oil:{energy:165.726,emissions:22.4}},units:{electricity:["kWh","MWh","MJ","kW"],steam:["lbs","kBtu","btu"],chw:["ton-hr","kBtu","btu"],ng:["therm","ccf","mcf","kBtu"],oil:["gals","barallel","kBtu","btu"],water:["gals"]},convert:$,capFirst:function(e){return void 0===e&&(e=""),e.replace(/\w\S*/g,(function(e){return e.charAt(0).toUpperCase()+e.substr(1).toLowerCase()}))},replaceAll:function(e,n,t){return void 0===e&&(e=""),e.replace(new RegExp(n,"g"),t)},stringifyID:function(e){return e<10?"00"+e:e<100?"0"+e:String(e)},formatNumber:z,formatFloat:function(e){return isNaN(e)?"0":parseFloat(e).toLocaleString()},formatPercent:function(e){return isNaN(e)?"0":z(100*e)},calcProgress:R,normalize:function(e,n,t){return(e-n)/(t-n)},normalizeBack:function(e,n,t){return e*(t-n)+n},euiTimeScaler:V,calcCVRMSE:function(e,n){var t=[],r=[];for(var i in e)t.push(Math.pow(e[i]-n[i],2)),r.push(e[i]);var a=t.length,u=p(r)/r.length;return Math.sqrt(p(t)/(a-1))/u*100},calcNMBE:function(e,n){var t=[],r=[];for(var i in e)t.push(e[i]-n[i]),r.push(e[i]);var a=t.length,u=p(r)/r.length;return p(t)/((a-1)*u)*100},boxPlot:function(e,n){if(void 0===n&&(n=!1),n&&(e=e.filter((function(e){return e>0}))),e.length<2)throw new Error("not enough values");return{q1:g(e,.25),q3:g(e,.75),min:v(e),max:h(e)}},minTimeseries:function(e){return v(e.map((function(e){return e[1]})))},maxTimeseries:function(e){return h(e.map((function(e){return e[1]})))},reduceTimeseries:K,filterTimeseries:ee,groupTimeseries:function(e,n){var t=e.map((function(e){return[_(e[0]).valueOf(),e[1]]})).reduce((function(e,t){var r=G(t[0],n);return e.has(r)?e.set(r,[].concat(e.get(r),[t])):e.set(r,[t]),e}),new Map);return[].concat(t)},groupTimeseriesDay:function(e){return Object.entries(L(e,(function(e){return C(e[0])}))).map((function(e){var n=e[1];return[new Date(e[0]),n]}))},aggregateTimeSeries:function(e,n){var t=e.map((function(e){return[_(e[0]),e[1]]})).reduce((function(e,t){var r=G(t[0],n);return e.has(r)?e.set(r,e.get(r)+t[1]):e.set(r,t[1]),e}),new Map);return[].concat(t).map((function(e){return[new Date(e[0]),e[1]]}))},totalTimeseries:te,averageTimeseries:function(e){return m(e.map((function(e){return e[1]})))},makeDailyTimeseries:function(e,n,t,r){return Q(e,F(e),t).map((function(e,t,r){return[e.valueOf(),n/r.length]}))},findMissingDays:function(e,n){var t=void 0===n?{}:n,r=t.startDate,i=t.endDate;e=e.sort((function(e,n){return e[0]-n[0]})),r||(r=e[0][0]),i||(i=e[e.length-1][0]);var a=Q(r,i,"day"),u=new Set(a.map((function(e){return e.valueOf()}))),s=new Set(e.map((function(e){return e[0]}))),o=new Set([].concat(u).filter((function(e){return!s.has(e)})));return[].concat(o)},calcEUI:ie,calcBuildingEUI:function(e,n){var t;if(e&&n){var r=E(D(new Date,1)),i=W(r),a=q(N(new Date,2)),u=A(a);t={year:ie(e,n,r,i)||0,month:ie(e,n,a,u)||0}}else t={year:0,month:0};return t},calcIntensity:ae,EUIByType:function(e,n,t,r,i,a){void 0===i&&(i=[]),void 0===a&&(a=a);var u=new Array(P(r,t)+1).fill(0).map((function(e,n){var r=new Date(t.getFullYear()+n,0);return[r,q(W(r))]}));return Object.keys(e).filter((function(e){return a.hasOwnProperty(e)&&a[e].energy>0&&-1===i.indexOf(e)})).map((function(t,i){return u.map((function(i){var a=i[0].valueOf(),u=i[1].valueOf();u>r.valueOf()&&(u=r.valueOf(),a=q(N(u,11)).valueOf());var s=V(a,u),o=$(te(ee(e[t],a,u))*s/n,t,"energy");return{type:t,year:new Date(T(u),0).valueOf(),value:o}}))}))},EUIByYear:function(e,n,t,r,i,a,u){void 0===i&&(i=[]),void 0===u&&(u=u);var s=new Array(P(r,t)+1).fill(0).map((function(e,n){var r=new Date(t.getFullYear()+n,0);return[r,q(W(r))]})),o=Object.keys(e).filter((function(e){return u.hasOwnProperty(e)&&u[e].energy>0&&-1===i.indexOf(e)})),c=new Map(o.map((function(t){return[t,ae(e,t,n,a.valueOf(),q(W(a)).valueOf(),i,!0)]})));return s.map((function(t){var r=t[0],a=t[1];return[r.valueOf(),o.map((function(t){var u=ae(e,t,n,r.valueOf(),a.valueOf(),i,!0);return{type:t,progress:R(u,c.get(t)),value:u}}))]}))},calcMeterTotal:re,cleanTimeseriesInterpolate:function(e,n,t){return e.map((function(e){return isNaN(e[1])?[e[0],0,e[1]]:e})).map((function(e){return e[1]<n?[e[0],null,e[1]]:e})).map((function(e){return e[1]>t?[e[0],null,e[1]]:e})).map((function(e,n,t){if(e[1])return e;var r=X(t,n);return[e[0],r,e[2]]}))},dataStatistics:function(e,n){if(void 0===n&&(n=!1),n&&(e=e.filter((function(e){return e>0}))),e.length<2)return{};e=e.sort();var t=d(e),r=g(e,.25),i=g(e,.75);return{iq:t,q1:r,q3:i,lowerInnerFence:r-1.5*t,lowerOuterFence:i-3*t,upperInnerFence:r+1.5*t,upperOuterFence:i+3*t,min:v(e),max:h(e),mean:m(e),mode:w(e),median:O(e),medianAbsoluteDeviation:y(e),uniqueCountSorted:U(e),standardDeviation:k(e),variance:b(e)}},uncleanTimeseries:function(e){return e.map((function(e){return e[2]?[e[0],e[2]]:e}))},interpolateTimeseries:X,maxTimeseriesWithDate:function(e){return e.sort((function(e,n){return n[1]-e[1]}))[0]},valuesTimeseries:function(e){return e.map((function(e){return e[1]}))},timeseriesToXY:function(e,n){return void 0===n&&(n=1),e.map((function(e){return{x:new Date(e[0]),y:e[1]/n}}))},cleanTimeseries:function(e,n,t,r){return e.map((function(e){return e[1]>r||e[1]<t?[e[0],n,e[1]]:e}))},isTimeseriesUniform:function(e){return new Set(e.map((function(e){return e[1]}))).size<3},monthlyValueWithTrend:function(e,n,t,r){var i=new Map(e);if(!i.has(t.valueOf()))return{value:0,trend:{value:null,text:""}};var a=i.get(t.valueOf()),u=i.get(r.valueOf())||0;return{value:a,units:n,trend:{value:100*R(a,u),text:""+B(r,"MMM YYYY")}}},getLastTimestamp:function(e){return new Date(h(e.map((function(e){return e[0]}))))},getFirstTimestamp:function(e){return new Date(v(e.map((function(e){return e[0]}))))},timeseriesToObject:Z,objToTimeseries:J,mergeTimeseries:function(e){var n=e.raw,t=void 0===n?[]:n,r=e.clean,i=void 0===r?[]:r,a=e.forecast;return J(H(Z(void 0===a?[]:a),Z(t),Z(i)))},mergeOrderedTimeseries:function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];var r=n.map((function(e){return Z(e.map((function(e){return[new Date(e[0]),e[1]]})))})),i=Object.assign.apply(Object,r.reverse()),a=J(i);return a},sortTimeseries:ne,calcTotals:function(e,n,t){var r=void 0===t?{}:t,i=r.typeLimit,a=void 0===i?[]:i,u=r.conversionFactors,s=void 0===u?s:u;return Object.keys(e).filter((function(e){return-1===a.indexOf(e)})).filter((function(n){return s.hasOwnProperty(n)&&e[n].length>0})).map((function(t){return e[t].map((function(e){return[e[0],$(e[1],t,n,s)]}))})).reduce((function(e,n){return K(e,n)}),[])},calcDataIntensity:function(e,n,t,r,i){void 0===e&&(e=[]),void 0===n&&(n=0),e=ne(e);var a=te(e);return t&&r||(t=e[0][0],r=e[e.length-1][0]),t&&r&&(a=te(ee(e,t,r))),a/n*V(t,r)},toObject:function(e,n){var t;return Object.assign(e,((t={})[n[0]]=n[1],t))},timeseriesLabels:function(e){return 0===getMonth(e)?B(e,"MMM YYYY"):getMonth(e)%2==0?B(e,"MMMM"):""},sortTS:function(e,n){return e[0]-n[0]}};
//# sourceMappingURL=index.module.js.map
