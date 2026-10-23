import { useState } from 'react';
import { ThemeProvider } from '@/shared/ui/base/Theme';
import GlobalThemeStyle from '@/shared/theme/global';
import { DeleteContainer } from '@/features/environment/components/Environment/components/EnvManage/components/EnvServers/components/ItemMenu/style';
export default function ThemeFixture(){
 const [dark,setDark]=useState(false);
 return <ThemeProvider theme={{token:{colorPrimary:dark?'#ff0000':'#1677ff',fontSize:dark?14:12,fontSize14:dark?16:14,borderRadius:4}}}><GlobalThemeStyle/><button onClick={()=>setDark(v=>!v)}>Toggle theme</button><DeleteContainer $disable={!dark} style={{color:'var(--color-primary)'}}>Styled state</DeleteContainer></ThemeProvider>;
}
