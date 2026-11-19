import type { Config } from "tailwindcss";
export default { content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}"],
 theme:{extend:{colors:{navy:"#10243A",navy2:"#183B56",green:"#16A36A",paper:"#F7F9FB",ink:"#172B3A",muted:"#687786",line:"#DDE4EA"},
 fontFamily:{sans:["Manrope","Inter","system-ui","sans-serif"]}}},plugins:[]} satisfies Config;
