import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/core/components/ui/tabs';

import FormAuth from './components/Form';
import bgUrl from './images/bg.jpg';

const Auth = () => {
  return (
    <div
      style={{ backgroundImage: `url('${bgUrl.src}')` }}
      className={
        'flex justify-center items-center h-screen bg-center bg-cover relative after:z-1 after:absolute after:bg-white/10 after:size-full after:top-0 after:left-0 after:backdrop-blur'
      }
    >
      <Tabs defaultValue="signin" className={'w-105 relative z-10'}>
        <TabsList className={'w-full'}>
          <TabsTrigger value="signin">Đăng nhập</TabsTrigger>
          <TabsTrigger value="signup">Đăng kí</TabsTrigger>
        </TabsList>
        <TabsContent value="signin" className={'w-full'}>
          <FormAuth keyForm={'signin'} />
        </TabsContent>
        <TabsContent value="signup" className={'w-full'}>
          <FormAuth keyForm={'signup'} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Auth;
