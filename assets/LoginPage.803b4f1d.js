import{_ as w,r as u,P as S,R as h,S as L,T as o,U as a,ar as m,Y as _,Z as k,aI as x,at as g,V as f,b6 as y,as as V}from"./index.6cf46907.js";import{g as I,a as Q,Q as v}from"./QForm.71ca19df.js";import{u as T}from"./index.0a93a9ee.js";const U=I`
  mutation LoginUser($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
      user {
        id
        name
        databaseId
        email
      }
    }
  }
`,D={name:"PageAuth",setup(){const l=u(!0),r=S(),t=u({username:"",password:""}),{mutate:e,loading:i,error:c}=T(U,()=>({variables:{username:t.value.username,password:t.value.password}}));return{isLogin:l,formData:t,submitForm:async()=>{try{const n=await e(),{authToken:p,refreshToken:b,user:d}=n.data.login;localStorage.setItem("authToken",p),localStorage.setItem("refreshToken",b),localStorage.setItem("currentUserName",d.name),localStorage.setItem("user",JSON.stringify(d)),r.push("/")}catch(n){console.error("Login failed:",n)}},loading:i}}},N={class:"text-h6"};function q(l,r,t,e,i,c){return h(),L(Q,{class:"flex flex-center",padding:""},{default:o(()=>[a(V,{flat:"",bordered:"",style:{width:"100%","max-width":"400px"}},{default:o(()=>[a(m,null,{default:o(()=>[_("div",N,k(e.isLogin?"Login":"Register"),1)]),_:1}),a(m,null,{default:o(()=>[a(v,{onSubmit:x(e.submitForm,["prevent"])},{default:o(()=>[a(g,{modelValue:e.formData.username,"onUpdate:modelValue":r[0]||(r[0]=s=>e.formData.username=s),label:"Username",outlined:"",required:""},null,8,["modelValue"]),a(g,{modelValue:e.formData.password,"onUpdate:modelValue":r[1]||(r[1]=s=>e.formData.password=s),label:"Password",type:"password",outlined:"",required:"",class:"q-mt-md"},null,8,["modelValue"]),a(f,{label:e.isLogin?"Login":"Register",type:"submit",color:"primary",class:"q-mt-md full-width",loading:e.loading},null,8,["label","loading"])]),_:1},8,["onSubmit"])]),_:1}),a(y,{align:"right"},{default:o(()=>[a(f,{flat:"",label:e.isLogin?"Need to register?":"Already registered?",onClick:r[2]||(r[2]=s=>e.isLogin=!e.isLogin)},null,8,["label"])]),_:1})]),_:1})]),_:1})}var B=w(D,[["render",q]]);export{B as default};
